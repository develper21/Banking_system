"use server";

import { CountryCode } from "plaid";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";
import { createTransfer } from "./dwolla.actions";
import { createTransaction } from "./transaction.actions";
import { revalidatePath } from "next/cache";
import { getBanksForTestUser, getAccountBalanceForTestUser } from "./mock-data.actions";

export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // Handle test user with mock data
    if (userId === 'test-user-demo') {
      const mockBanks = await getBanksForTestUser({ userId });
      const mockBalance = await getAccountBalanceForTestUser({ userId });
      
      const accounts = mockBanks.map((bank: any) => ({
        id: bank.accountId,
        availableBalance: bank.availableBalance,
        currentBalance: bank.currentBalance,
        institutionId: bank.bankId,
        name: bank.bankName,
        officialName: bank.bankName,
        mask: bank.mask,
        type: bank.type,
        subtype: bank.type,
        appwriteItemId: bank.$id,
        shareableId: bank.shareableId,
      }));

      return parseStringify({ 
        data: accounts, 
        totalBanks: accounts.length, 
        totalCurrentBalance: mockBalance?.totalBalance || 0 
      });
    }

    const banks = await getBanks({ userId });
    
    if (!banks || banks.length === 0) {
      return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
    }
    
    const accounts = await Promise.all(
      banks.map(async (bank: Bank) => {
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          shareableId: bank.shareableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    if (!appwriteItemId) {
      console.warn("getAccount: appwriteItemId is missing");
      return parseStringify({ data: null, transactions: [] });
    }

    // Handle test user with mock data
    if (appwriteItemId.startsWith('mock-bank-')) {
      const { getTransactionsByBankForTestUser } = await import("./mock-data.actions");
      const mockTransactions = await getTransactionsByBankForTestUser({ bankId: appwriteItemId });
      
      // Find the mock bank data
      const { getBanksForTestUser } = await import("./mock-data.actions");
      const mockBanks = await getBanksForTestUser({ userId: 'test-user-demo' });
      const mockBank = mockBanks.find((bank: any) => bank.$id === appwriteItemId);
      
      if (!mockBank) {
        return parseStringify({ data: null, transactions: [] });
      }

      const account = {
        id: mockBank.accountId,
        availableBalance: mockBank.availableBalance,
        currentBalance: mockBank.currentBalance,
        institutionId: mockBank.bankId,
        name: mockBank.bankName,
        officialName: mockBank.bankName,
        mask: mockBank.mask,
        type: mockBank.type,
        subtype: mockBank.type,
        appwriteItemId: mockBank.$id,
      };

      const transactions = mockTransactions.map((txn: any) => ({
        id: txn.$id,
        name: txn.name,
        paymentChannel: txn.paymentChannel,
        type: txn.type,
        accountId: txn.accountId,
        amount: Math.abs(txn.amount),
        pending: false,
        category: txn.category,
        date: txn.date,
        image: null,
      }));

      return parseStringify({
        data: account,
        transactions: transactions,
      });
    }

    const bank = await getBank({ documentId: appwriteItemId });

    if (!bank) {
      console.warn(`getAccount: no bank found for appwriteItemId=${appwriteItemId}`);
      return parseStringify({ data: null, transactions: [] });
    }

    if (!bank.accessToken) {
      console.warn(`getAccount: bank missing access token for bankId=${bank.$id}`);
      return parseStringify({ data: null, transactions: [] });
    }

    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData?.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US", "IN"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      const fetchedTransactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      transactions = [...transactions, ...fetchedTransactions];
      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
    return parseStringify([]);
  }
};

// Transfer funds between bank accounts using Dwolla
export const transferFunds = async ({ 
  sourceFundingSourceUrl, 
  destinationFundingSourceUrl, 
  amount,
  senderBankId,
  receiverBankId,
  senderId,
  receiverId,
  email,
}: TransferFundsParams & { senderId: string; receiverId: string; email: string }) => {
  try {
    // Create transfer via Dwolla
    const transferUrl = await createTransfer({
      sourceFundingSourceUrl,
      destinationFundingSourceUrl,
      amount,
    });

    if (!transferUrl) {
      throw new Error("Transfer creation failed");
    }

    // Store transaction in database
    const transaction = {
      name: "Transfer",
      amount,
      senderId,
      senderBankId,
      receiverId,
      receiverBankId,
      email,
    };

    const newTransaction = await createTransaction(transaction);

    // Revalidate the path to update UI
    revalidatePath("/");

    return parseStringify({
      transferUrl,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Transfer fund failed:", error);
    throw error;
  }
};
