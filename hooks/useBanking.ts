"use client";

import useSWR from "swr";

// Hook for fetching user accounts with auto-refresh
export const useAccounts = (userId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/accounts?userId=${userId}` : null,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    accounts: data?.data || [],
    totalBanks: data?.totalBanks || 0,
    totalCurrentBalance: data?.totalCurrentBalance || 0,
    isLoading,
    isError: error,
    mutate, // Function to manually refresh data
  };
};

// Hook for fetching transactions with auto-refresh
export const useTransactions = (appwriteItemId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    appwriteItemId ? `/api/transactions?appwriteItemId=${appwriteItemId}` : null,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    transactions: data?.transactions || [],
    account: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
};

// Hook for fetching single account details
export const useAccount = (appwriteItemId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    appwriteItemId ? `/api/account?appwriteItemId=${appwriteItemId}` : null,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    account: data?.data || null,
    transactions: data?.transactions || [],
    isLoading,
    isError: error,
    mutate,
  };
};

// Hook for fetching user banks
export const useBanks = (userId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/banks?userId=${userId}` : null,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    banks: data || [],
    isLoading,
    isError: error,
    mutate,
  };
};
