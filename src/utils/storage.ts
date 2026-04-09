export interface BankAccount {
  id: string;
  bankName: string;
  balance: number;
  lockedAmount: number;
}

export type SavingsType = "emergency" | "rent" | "insurance" | "custom";

export interface SavingsGoal {
  id: string;
  type: SavingsType;
  customLabel?: string;
  targetAmount: number;
  currentAmount: number;
  linkedAccountId: string;
}

export type TransactionType = "deposit" | "lock" | "unlock" | "savings" | "transfer" | "goal_set";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  description: string;
}

export interface UserData {
  username: string;
  accounts: BankAccount[];
  savings: SavingsGoal[];
  transactions: Transaction[];
}

const DATA_KEY = "monetree_data";

const getAllData = (): Record<string, UserData> => {
  try {
    return JSON.parse(localStorage.getItem(DATA_KEY) || "{}");
  } catch {
    return {};
  }
};

export const getUserData = (username: string): UserData => {
  const all = getAllData();
  return all[username] || { username, accounts: [], savings: [], transactions: [] };
};

export const saveUserData = (username: string, data: UserData): void => {
  const all = getAllData();
  all[username] = data;
  localStorage.setItem(DATA_KEY, JSON.stringify(all));
};

export const deleteUserData = (username: string): void => {
  const all = getAllData();
  delete all[username];
  localStorage.setItem(DATA_KEY, JSON.stringify(all));
};

export const getAvailableBalance = (account: BankAccount): number => {
  return account.balance - account.lockedAmount;
};

export const getTotalBalance = (accounts: BankAccount[]): number => {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
};

export const getTotalLocked = (accounts: BankAccount[]): number => {
  return accounts.reduce((sum, a) => sum + a.lockedAmount, 0);
};

export const getTotalAvailable = (accounts: BankAccount[]): number => {
  return accounts.reduce((sum, a) => sum + a.balance - a.lockedAmount, 0);
};
