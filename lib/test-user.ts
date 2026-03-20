export const TEST_USER_CREDENTIALS = {
  email: 'demo@banking.com',
  password: 'demo123456'
};

export const TEST_USER_DATA = {
  $id: 'test-user-demo',
  userId: 'test-user-demo',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@banking.com',
  username: 'demo',
  address1: '123 Demo Street',
  city: 'Test City',
  state: 'TS',
  postalCode: '12345',
  dateOfBirth: '1990-01-01',
  ssn: '1234',
  status: 'active',
  dwollaCustomerId: 'test-dwolla-id'
};

export const MOCK_BANKS = [
  {
    $id: 'mock-bank-1',
    userId: 'test-user-demo',
    bankId: 'ins_123456',
    accountId: 'acc_mock_1',
    shareableId: '000123456',
    fundingSourceUrl: 'https://api.dwolla.com/funding-sources/test-funding-1',
    bankName: 'Demo Bank - Checking',
    currentBalance: 15420.50,
    availableBalance: 15420.50,
    mask: '1234',
    type: 'checking'
  },
  {
    $id: 'mock-bank-2',
    userId: 'test-user-demo',
    bankId: 'ins_789012',
    accountId: 'acc_mock_2',
    shareableId: '000789012',
    fundingSourceUrl: 'https://api.dwolla.com/funding-sources/test-funding-2',
    bankName: 'Demo Bank - Savings',
    currentBalance: 45890.25,
    availableBalance: 45890.25,
    mask: '5678',
    type: 'savings'
  },
  {
    $id: 'mock-bank-3',
    userId: 'test-user-demo',
    bankId: 'ins_345678',
    accountId: 'acc_mock_3',
    shareableId: '000345678',
    fundingSourceUrl: 'https://api.dwolla.com/funding-sources/test-funding-3',
    bankName: 'Credit Union - Credit Card',
    currentBalance: -1250.75,
    availableBalance: 5000.00,
    mask: '9012',
    type: 'credit'
  }
];

export const MOCK_TRANSACTIONS = [
  // Checking Account Transactions
  {
    $id: 'txn_1',
    userId: 'test-user-demo',
    bankId: 'mock-bank-1',
    accountId: 'acc_mock_1',
    name: 'Monthly Salary',
    amount: 5500.00,
    date: '2024-03-15',
    category: 'income',
    type: 'credit',
    paymentChannel: 'direct_deposit'
  },
  {
    $id: 'txn_2',
    userId: 'test-user-demo',
    bankId: 'mock-bank-1',
    accountId: 'acc_mock_1',
    name: 'Grocery Store',
    amount: 125.43,
    date: '2024-03-18',
    category: 'food',
    type: 'debit',
    paymentChannel: 'in_store'
  },
  {
    $id: 'txn_3',
    userId: 'test-user-demo',
    bankId: 'mock-bank-1',
    accountId: 'acc_mock_1',
    name: 'Electric Bill',
    amount: 89.50,
    date: '2024-03-20',
    category: 'utilities',
    type: 'debit',
    paymentChannel: 'online'
  },
  {
    $id: 'txn_4',
    userId: 'test-user-demo',
    bankId: 'mock-bank-1',
    accountId: 'acc_mock_1',
    name: 'Restaurant',
    amount: 45.67,
    date: '2024-03-19',
    category: 'dining',
    type: 'debit',
    paymentChannel: 'in_store'
  },
  {
    $id: 'txn_5',
    userId: 'test-user-demo',
    bankId: 'mock-bank-1',
    accountId: 'acc_mock_1',
    name: 'Gas Station',
    amount: 65.00,
    date: '2024-03-17',
    category: 'transportation',
    type: 'debit',
    paymentChannel: 'in_store'
  },
  
  // Savings Account Transactions
  {
    $id: 'txn_6',
    userId: 'test-user-demo',
    bankId: 'mock-bank-2',
    accountId: 'acc_mock_2',
    name: 'Interest Payment',
    amount: 125.30,
    date: '2024-03-10',
    category: 'income',
    type: 'credit',
    paymentChannel: 'other'
  },
  {
    $id: 'txn_7',
    userId: 'test-user-demo',
    bankId: 'mock-bank-2',
    accountId: 'acc_mock_2',
    name: 'Transfer from Checking',
    amount: 1000.00,
    date: '2024-03-01',
    category: 'transfer',
    type: 'credit',
    paymentChannel: 'other'
  },
  
  // Credit Card Transactions
  {
    $id: 'txn_8',
    userId: 'test-user-demo',
    bankId: 'mock-bank-3',
    accountId: 'acc_mock_3',
    name: 'Online Shopping',
    amount: 234.99,
    date: '2024-03-16',
    category: 'shopping',
    type: 'debit',
    paymentChannel: 'online'
  },
  {
    $id: 'txn_9',
    userId: 'test-user-demo',
    bankId: 'mock-bank-3',
    accountId: 'acc_mock_3',
    name: 'Subscription Service',
    amount: 14.99,
    date: '2024-03-15',
    category: 'entertainment',
    type: 'debit',
    paymentChannel: 'online'
  },
  {
    $id: 'txn_10',
    userId: 'test-user-demo',
    bankId: 'mock-bank-3',
    accountId: 'acc_mock_3',
    name: 'Coffee Shop',
    amount: 5.75,
    date: '2024-03-18',
    category: 'dining',
    type: 'debit',
    paymentChannel: 'in_store'
  }
];

export const isTestUser = (email: string, password: string): boolean => {
  return email === TEST_USER_CREDENTIALS.email && password === TEST_USER_CREDENTIALS.password;
};

export const getMockTransactionsByBankId = (bankId: string) => {
  return MOCK_TRANSACTIONS.filter(txn => txn.bankId === bankId);
};

export const getMockBankById = (bankId: string) => {
  return MOCK_BANKS.find(bank => bank.$id === bankId);
};
