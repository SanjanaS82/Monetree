import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

export type TransactionType = "deposit" | "withdraw" | "lock" | "savings" | "goal_set";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
  description: string;
}

interface SavingsGoal {
  target: number;
  current: number;
}

interface MonetreeState {
  balance: number;
  lockedAmount: number;
  savingsGoal: SavingsGoal | null;
  transactions: Transaction[];
  availableBalance: number;
}

interface MonetreeActions {
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  lockMoney: (amount: number) => void;
  setSavingsGoal: (amount: number) => void;
  addToSavings: (amount: number) => void;
}

const MonetreeContext = createContext<(MonetreeState & MonetreeActions) | null>(null);

export const useMonetree = () => {
  const ctx = useContext(MonetreeContext);
  if (!ctx) throw new Error("useMonetree must be used within MonetreeProvider");
  return ctx;
};

const labelMap: Record<TransactionType, string> = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  lock: "Money Locked",
  savings: "Savings Contribution",
  goal_set: "Savings Goal Set",
};

export const MonetreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [lockedAmount, setLockedAmount] = useState(0);
  const [savingsGoal, setSavingsGoalState] = useState<SavingsGoal | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const availableBalance = balance - lockedAmount - (savingsGoal?.current ?? 0);

  const addTransaction = useCallback((type: TransactionType, amount: number, description: string) => {
    setTransactions((prev) => [
      { id: crypto.randomUUID(), type, amount, timestamp: new Date(), description },
      ...prev,
    ]);
  }, []);

  const validatePositive = (amount: number): boolean => {
    if (!amount || amount <= 0 || isNaN(amount)) {
      toast.error("Please enter a valid positive amount");
      return false;
    }
    return true;
  };

  const deposit = useCallback((amount: number) => {
    if (!validatePositive(amount)) return;
    setBalance((b) => b + amount);
    addTransaction("deposit", amount, `Deposited ${amount.toFixed(2)}`);
    toast.success(`Successfully deposited ${amount.toFixed(2)}`);
  }, [addTransaction]);

  const withdraw = useCallback((amount: number) => {
    if (!validatePositive(amount)) return;
    if (amount > availableBalance) {
      toast.error("Insufficient available balance");
      return;
    }
    setBalance((b) => b - amount);
    addTransaction("withdraw", amount, `Withdrawn ${amount.toFixed(2)}`);
    toast.success(`Successfully withdrawn ${amount.toFixed(2)}`);
  }, [availableBalance, addTransaction]);

  const lockMoney = useCallback((amount: number) => {
    if (!validatePositive(amount)) return;
    if (amount > availableBalance) {
      toast.error("Cannot lock more than available balance");
      return;
    }
    setLockedAmount((l) => l + amount);
    addTransaction("lock", amount, `Locked ${amount.toFixed(2)}`);
    toast.success(`Successfully locked ${amount.toFixed(2)}`);
  }, [availableBalance, addTransaction]);

  const setSavingsGoal = useCallback((amount: number) => {
    if (!validatePositive(amount)) return;
    setSavingsGoalState({ target: amount, current: 0 });
    addTransaction("goal_set", amount, `Savings goal set to ${amount.toFixed(2)}`);
    toast.success(`Savings goal set to ${amount.toFixed(2)}`);
  }, [addTransaction]);

  const addToSavings = useCallback((amount: number) => {
    if (!validatePositive(amount)) return;
    if (!savingsGoal) {
      toast.error("Please set a savings goal first");
      return;
    }
    if (amount > availableBalance) {
      toast.error("Insufficient available balance for savings");
      return;
    }
    const remaining = savingsGoal.target - savingsGoal.current;
    const actual = Math.min(amount, remaining);
    if (actual <= 0) {
      toast.error("Savings goal already reached");
      return;
    }
    setSavingsGoalState((g) => g ? { ...g, current: g.current + actual } : g);
    addTransaction("savings", actual, `Added ${actual.toFixed(2)} to savings`);
    const newCurrent = savingsGoal.current + actual;
    if (newCurrent >= savingsGoal.target) {
      toast.success("Congratulations! Savings goal reached!");
    } else {
      toast.success(`Added ${actual.toFixed(2)} to savings`);
    }
  }, [savingsGoal, availableBalance, addTransaction]);

  return (
    <MonetreeContext.Provider value={{
      balance, lockedAmount, savingsGoal, transactions, availableBalance,
      deposit, withdraw, lockMoney, setSavingsGoal, addToSavings,
    }}>
      {children}
    </MonetreeContext.Provider>
  );
};
