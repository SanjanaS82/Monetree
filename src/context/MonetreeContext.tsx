import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import {
  BankAccount, SavingsGoal, Transaction, UserData, SavingsType,
  getUserData, saveUserData, getAvailableBalance,
  getTotalBalance, getTotalLocked, getTotalAvailable,
} from "@/utils/storage";

interface MonetreeState {
  accounts: BankAccount[];
  savings: SavingsGoal[];
  transactions: Transaction[];
  totalBalance: number;
  totalLocked: number;
  totalAvailable: number;
}

interface MonetreeActions {
  addAccount: (bankName: string, initialBalance: number) => void;
  deposit: (accountId: string, amount: number) => void;
  lockMoney: (accountId: string, amount: number) => void;
  unlockMoney: (accountId: string, amount: number) => void;
  transfer: (fromAccountId: string, destinationType: string, destination: string, amount: number) => void;
  createSavingsGoal: (type: SavingsType, customLabel: string, targetAmount: number, linkedAccountId: string) => void;
  addToSavings: (goalId: string, amount: number) => void;
}

const MonetreeContext = createContext<(MonetreeState & MonetreeActions) | null>(null);

export const useMonetree = () => {
  const ctx = useContext(MonetreeContext);
  if (!ctx) throw new Error("useMonetree must be used within MonetreeProvider");
  return ctx;
};

export const MonetreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { username } = useAuth();
  const [data, setData] = useState<UserData>(() => getUserData(username || ""));

  useEffect(() => {
    if (username) setData(getUserData(username));
  }, [username]);

  const persist = useCallback((updated: UserData) => {
    setData(updated);
    if (username) saveUserData(username, updated);
  }, [username]);

  const addTx = (d: UserData, type: Transaction["type"], amount: number, description: string): UserData => ({
    ...d,
    transactions: [
      { id: crypto.randomUUID(), type, amount, timestamp: new Date().toISOString(), description },
      ...d.transactions,
    ],
  });

  const validate = (amount: number): boolean => {
    if (!amount || amount <= 0 || isNaN(amount)) {
      toast.error("Please enter a valid positive amount");
      return false;
    }
    return true;
  };

  const addAccount = useCallback((bankName: string, initialBalance: number) => {
    if (!bankName.trim()) { toast.error("Please enter a bank name"); return; }
    if (!validate(initialBalance)) return;
    const account: BankAccount = { id: crypto.randomUUID(), bankName: bankName.trim(), balance: initialBalance, lockedAmount: 0 };
    let updated = { ...data, accounts: [...data.accounts, account] };
    updated = addTx(updated, "deposit", initialBalance, `Account created: ${bankName} with ${initialBalance.toFixed(2)}`);
    persist(updated);
    toast.success(`Account "${bankName}" added`);
  }, [data, persist]);

  const deposit = useCallback((accountId: string, amount: number) => {
    if (!validate(amount)) return;
    let updated = {
      ...data,
      accounts: data.accounts.map(a => a.id === accountId ? { ...a, balance: a.balance + amount } : a),
    };
    const acc = data.accounts.find(a => a.id === accountId);
    updated = addTx(updated, "deposit", amount, `Deposited ${amount.toFixed(2)} to ${acc?.bankName}`);
    persist(updated);
    toast.success(`Deposited ${amount.toFixed(2)}`);
  }, [data, persist]);

  const lockMoney = useCallback((accountId: string, amount: number) => {
    if (!validate(amount)) return;
    const acc = data.accounts.find(a => a.id === accountId);
    if (!acc || amount > getAvailableBalance(acc)) { toast.error("Insufficient available balance"); return; }
    let updated = {
      ...data,
      accounts: data.accounts.map(a => a.id === accountId ? { ...a, lockedAmount: a.lockedAmount + amount } : a),
    };
    updated = addTx(updated, "lock", amount, `Locked ${amount.toFixed(2)} in ${acc.bankName}`);
    persist(updated);
    toast.success(`Locked ${amount.toFixed(2)}`);
  }, [data, persist]);

  const unlockMoney = useCallback((accountId: string, amount: number) => {
    if (!validate(amount)) return;
    const acc = data.accounts.find(a => a.id === accountId);
    if (!acc || amount > acc.lockedAmount) { toast.error("Cannot unlock more than locked amount"); return; }
    let updated = {
      ...data,
      accounts: data.accounts.map(a => a.id === accountId ? { ...a, lockedAmount: a.lockedAmount - amount } : a),
    };
    updated = addTx(updated, "unlock", amount, `Unlocked ${amount.toFixed(2)} from ${acc.bankName}`);
    persist(updated);
    toast.success(`Unlocked ${amount.toFixed(2)}`);
  }, [data, persist]);

  const transfer = useCallback((fromAccountId: string, destinationType: string, destination: string, amount: number) => {
    if (!validate(amount)) return;
    if (!destination.trim()) { toast.error("Please enter a destination"); return; }
    const from = data.accounts.find(a => a.id === fromAccountId);
    if (!from || amount > getAvailableBalance(from)) { toast.error("Insufficient available balance"); return; }
    let updated = { ...data };
    updated.accounts = updated.accounts.map(a => a.id === fromAccountId ? { ...a, balance: a.balance - amount } : a);
    if (destinationType === "internal") {
      const toAcc = updated.accounts.find(a => a.id === destination);
      if (!toAcc) { toast.error("Destination account not found"); return; }
      updated.accounts = updated.accounts.map(a => a.id === destination ? { ...a, balance: a.balance + amount } : a);
      updated = addTx(updated, "transfer", amount, `Transferred ${amount.toFixed(2)} from ${from.bankName} to ${toAcc.bankName}`);
    } else if (destinationType === "merchant") {
      updated = addTx(updated, "transfer", amount, `Paid ${amount.toFixed(2)} to merchant: ${destination}`);
    } else {
      updated = addTx(updated, "transfer", amount, `Sent ${amount.toFixed(2)} to UPI: ${destination}`);
    }
    persist(updated);
    toast.success(`Transfer of ${amount.toFixed(2)} successful`);
  }, [data, persist]);

  const createSavingsGoal = useCallback((type: SavingsType, customLabel: string, targetAmount: number, linkedAccountId: string) => {
    if (!validate(targetAmount)) return;
    if (!linkedAccountId) { toast.error("Please select a bank account"); return; }
    if (type === "custom" && !customLabel.trim()) { toast.error("Please enter a custom label"); return; }
    const goal: SavingsGoal = {
      id: crypto.randomUUID(), type, customLabel: type === "custom" ? customLabel.trim() : undefined,
      targetAmount, currentAmount: 0, linkedAccountId,
    };
    let updated = { ...data, savings: [...data.savings, goal] };
    const label = type === "custom" ? customLabel : type;
    updated = addTx(updated, "goal_set", targetAmount, `Savings goal "${label}" set to ${targetAmount.toFixed(2)}`);
    persist(updated);
    toast.success(`Savings goal created`);
  }, [data, persist]);

  const addToSavings = useCallback((goalId: string, amount: number) => {
    if (!validate(amount)) return;
    const goal = data.savings.find(g => g.id === goalId);
    if (!goal) return;
    const acc = data.accounts.find(a => a.id === goal.linkedAccountId);
    if (!acc || amount > getAvailableBalance(acc)) { toast.error("Insufficient available balance in linked account"); return; }
    const remaining = goal.targetAmount - goal.currentAmount;
    const actual = Math.min(amount, remaining);
    if (actual <= 0) { toast.error("Savings goal already reached"); return; }
    let updated = {
      ...data,
      accounts: data.accounts.map(a => a.id === goal.linkedAccountId ? { ...a, balance: a.balance - actual } : a),
      savings: data.savings.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + actual } : g),
    };
    const label = goal.type === "custom" ? goal.customLabel : goal.type;
    updated = addTx(updated, "savings", actual, `Added ${actual.toFixed(2)} to "${label}" savings`);
    persist(updated);
    if (goal.currentAmount + actual >= goal.targetAmount) {
      toast.success("Savings goal reached!");
    } else {
      toast.success(`Added ${actual.toFixed(2)} to savings`);
    }
  }, [data, persist]);

  const state: MonetreeState = {
    accounts: data.accounts,
    savings: data.savings,
    transactions: data.transactions,
    totalBalance: getTotalBalance(data.accounts),
    totalLocked: getTotalLocked(data.accounts),
    totalAvailable: getTotalAvailable(data.accounts),
  };

  return (
    <MonetreeContext.Provider value={{ ...state, addAccount, deposit, lockMoney, unlockMoney, transfer, createSavingsGoal, addToSavings }}>
      {children}
    </MonetreeContext.Provider>
  );
};
