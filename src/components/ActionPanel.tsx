import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ActionPanel = () => {
  const [amount, setAmount] = useState("");
  const { deposit, withdraw, lockMoney, addToSavings, setSavingsGoal } = useMonetree();

  const getAmount = () => parseFloat(amount);

  const handleAction = (action: (n: number) => void) => {
    action(getAmount());
    setAmount("");
  };

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 border">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h2>
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 text-lg"
        min="0"
        step="0.01"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Button onClick={() => handleAction(deposit)} className="bg-primary hover:bg-primary/90">
          Deposit
        </Button>
        <Button onClick={() => handleAction(withdraw)} variant="outline" className="border-primary text-primary hover:bg-primary/5">
          Withdraw
        </Button>
        <Button onClick={() => handleAction(lockMoney)} variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/5">
          Lock Money
        </Button>
        <Button onClick={() => handleAction(addToSavings)} className="bg-success hover:bg-success/90 text-success-foreground">
          Add to Savings
        </Button>
        <Button onClick={() => handleAction(setSavingsGoal)} variant="outline" className="border-accent text-accent hover:bg-accent/5 col-span-2 sm:col-span-2">
          Set Savings Goal
        </Button>
      </div>
    </div>
  );
};

export default ActionPanel;
