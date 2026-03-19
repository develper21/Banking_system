"use server";

import { ID, Query, Models } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, parseStringify } from "../utils";
import {
  CountryCode,
  Products,
} from "plaid";
import { plaidClient } from "@/lib/plaid";
import { createDwollaCustomer, addFundingSource } from "./dwolla.actions";
import { revalidatePath } from "next/cache";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_NAME: USER_COLLECTION_NAME,
  APPWRITE_BANK_COLLECTION_NAME: BANK_COLLECTION_NAME,
} = process.env;

const isProduction = process.env.NODE_ENV === "production";

const setSessionCookie = async (session: Models.Session) => {
  if (!session.secret) {
    throw new Error("Appwrite session secret missing");
  }

  const cookieStore = await cookies();
  cookieStore.set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction,
  });
};

export const getUserInfo = async ({ email }: { email: string }) => {
  try {
    const { database } = await createAdminClient();

    console.log("[getUserInfo] Appwrite collection", {
      databaseId: DATABASE_ID,
      userCollectionName: USER_COLLECTION_NAME,
    });

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_NAME!,
      [Query.equal("email", email)]
    );

    const userDocument = user.documents[0];

    if (!userDocument) {
      console.log("User document not found in Appwrite");
      return null;
    }

    return parseStringify(userDocument);
  } catch (error) {
    console.log("getUserInfo error:", error);
    return null;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account, database } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    await setSessionCookie(session);

    let user = await getUserInfo({ email });

    // If user document doesn't exist, create it for existing Appwrite users
    if (!user) {
      const accountInfo = await account.get();
      const newUser = await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_NAME!,
        ID.unique(),
        {
          username: email.split('@')[0], // Required username field
          passwordHash: 'hashed_password_placeholder', // Required passwordHash field  
          status: 'active', // Required status field
          firstName: accountInfo.name?.split(' ')[0] || '',
          lastName: accountInfo.name?.split(' ').slice(1).join(' ') || '',
          email: accountInfo.email,
          address1: '',
          city: '',
          state: '',
          postalCode: '',
          dateOfBirth: '',
          ssn: '',
        }
      );
      user = parseStringify(newUser);
    }

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    console.log("Appwrite account created:", newUserAccount.$id);

    let dwollaCustomerUrl: string | null = null;
    
    // Create Dwolla customer for transfers
    try {
      dwollaCustomerUrl = await createDwollaCustomer({
        firstName,
        lastName,
        email,
        type: 'personal',
        address1: userData.address1 || '',
        city: userData.city || '',
        state: userData.state || '',
        postalCode: userData.postalCode || '',
        dateOfBirth: userData.dateOfBirth || '',
        ssn: userData.ssn || '',
      });
      console.log("Dwolla customer created:", dwollaCustomerUrl);
    } catch (dwollaError) {
      console.error("Dwolla customer creation failed:", dwollaError);
      // Continue without Dwolla - user can still link banks but can't transfer
    }

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_NAME!,
      ID.unique(),
      {
        username: email.split('@')[0],
        passwordHash: 'hashed_password_placeholder',
        status: 'active',
        firstName,
        lastName,
        email,
        address1: userData.address1 || '',
        city: userData.city || '',
        state: userData.state || '',
        postalCode: userData.postalCode || '',
        dateOfBirth: userData.dateOfBirth || '',
        ssn: userData.ssn || '',
      }
    );

    console.log("User document created in database");

    const session = await account.createEmailPasswordSession(email, password);

    await setSessionCookie(session);

    console.log("Session created and cookie set");

    return parseStringify(newUser);
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export async function getLoggedInUser() {
  try {
    let user = null;
    const { account } = await createSessionClient();
    
    if (!account) {
      console.log("No account found in session client");
      return null;
    }
    
    const result = await account.get();
    console.log("Session user found:", result.$id);
    
    user = await getUserInfo({ email: result.email });
    console.log("User document found:", !!user);

    return parseStringify(user || null);
  } catch (error) {
    console.log("getLoggedInUser error:", error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete("appwrite-session");
    if (account) await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    console.log("Creating link token for user:", {
      userId: user.$id,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    if (!user.$id || !user.firstName || !user.lastName) {
      throw new Error("Invalid user data: missing required fields");
    }

    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      country_codes: ["US"] as CountryCode[],
      language: "en",
    };

    console.log("Token params:", tokenParams);
    console.log("Plaid environment:", {
      clientId: process.env.PLAID_CLIENT_ID?.substring(0, 8) + "...",
      env: process.env.PLAID_ENV
    });

    const response = await plaidClient.linkTokenCreate(tokenParams);

    console.log("Link token created successfully");
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error: any) {
    console.error("Plaid link token error:", error);
    console.error("Error details:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message
    });
    throw error;
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_NAME!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];
    
    // Create Dwolla processor token for funding source
    let fundingSourceUrl = '';
    if (user.dwollaCustomerId) {
      try {
        // Create processor token for Dwolla
        const processorTokenResponse = await plaidClient.processorTokenCreate({
          access_token: accessToken,
          account_id: accountData.account_id,
          processor: 'dwolla' as any,
        });
        
        const processorToken = processorTokenResponse.data.processor_token;
        
        // Add funding source to Dwolla customer
        const fundingSourceResult = await addFundingSource({
          dwollaCustomerId: user.dwollaCustomerId,
          processorToken,
          bankName: accountData.name,
        });
        
        fundingSourceUrl = fundingSourceResult || '';
        
        console.log("Dwolla funding source created:", fundingSourceUrl);
      } catch (dwollaError) {
        console.error("Dwolla funding source creation failed:", dwollaError);
        // Continue without funding source - user can still view bank data
      }
    }

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    revalidatePath("/");

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  if (!userId) {
    return [];
  }

  const { database } = await createAdminClient();

  try {
    // Prefer client-side filtering to avoid Appwrite schema mismatch issues
    const allBanks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_NAME!
    );

    return parseStringify(
      allBanks.documents.filter(
        (bank: any) => bank.userId === userId || bank.user_id === userId
      )
    );
  } catch (error: any) {
    const errorMessage =
      typeof error?.response === "string"
        ? error.response
        : error?.response?.message || error?.message || JSON.stringify(error);

    console.error("getBanks error:", errorMessage);

    // Additional fallback: no filter query in case of schema mismatch
    if (errorMessage.includes("Attribute not found in schema")) {
      console.warn(
        "Appwrite collection schema is missing userId attribute; attempting full scan fallback"
      );
      try {
        const allBanks = await database.listDocuments(
          DATABASE_ID!,
          BANK_COLLECTION_NAME!
        );

        return parseStringify(
          allBanks.documents.filter(
            (bank: any) => bank.userId === userId || bank.user_id === userId
          )
        );
      } catch (innerError) {
        console.error("getBanks fallback scan error:", innerError);
        return [];
      }
    }

    return [];
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_NAME!,
      [Query.equal("$id", [documentId])]
    );

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_NAME!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
