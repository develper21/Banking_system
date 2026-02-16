"use server";

import { ID, Query, Models } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_NAME: USER_COLLECTION_NAME,
  APPWRITE_BANK_COLLECTION_NAME: BANK_COLLECTION_NAME,
} = process.env;

const isProduction = process.env.NODE_ENV === "production";

const setSessionCookie = (session: Models.Session) => {
  if (!session.secret) {
    throw new Error("Appwrite session secret missing");
  }

  cookies().set("appwrite-session", session.secret, {
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
      [Query.equal("email", [email])]
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

    setSessionCookie(session);

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

    // Skip Dwolla for now - create user document without Dwolla dependency
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_NAME!,
      ID.unique(),
      {
        username: email.split('@')[0], // Required username field
        passwordHash: 'hashed_password_placeholder', // Required passwordHash field  
        status: 'active', // Required status field
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

    setSessionCookie(session);

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

    cookies().delete("appwrite-session");
    if (account) await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
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

    // Skip Dwolla for now - just create bank account without funding source
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl: '', // Empty for now
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
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_NAME!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
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
