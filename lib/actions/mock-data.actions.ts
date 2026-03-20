"use server";

import { MOCK_BANKS, MOCK_TRANSACTIONS, getMockBankById, getMockTransactionsByBankId } from "@/lib/test-user";
import { parseStringify } from "@/lib/utils";

export const getBanksForTestUser = async ({ userId }: { userId: string }) => {
  if (userId === 'test-user-demo') {
    return parseStringify(MOCK_BANKS);
  }
  return [];
};

export const getBankForTestUser = async ({ documentId }: { documentId: string }) => {
  const bank = getMockBankById(documentId);
  return parseStringify(bank || null);
};

export const getTransactionsForTestUser = async ({ userId }: { userId: string }) => {
  if (userId === 'test-user-demo') {
    return parseStringify(MOCK_TRANSACTIONS);
  }
  return [];
};

export const getTransactionsByBankForTestUser = async ({ bankId }: { bankId: string }) => {
  const transactions = getMockTransactionsByBankId(bankId);
  return parseStringify(transactions);
};

export const getAccountBalanceForTestUser = async ({ userId }: { userId: string }) => {
  if (userId === 'test-user-demo') {
    const totalBalance = MOCK_BANKS.reduce((sum, bank) => sum + bank.currentBalance, 0);
    return parseStringify({
      totalBalance,
      totalBanks: MOCK_BANKS.length,
      totalTransactions: MOCK_TRANSACTIONS.length
    });
  }
  return null;
};
