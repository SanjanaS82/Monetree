import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownToLine } from "lucide-react";

const DepositTab = () => {
  const [amount, setAmount] = useState("");
  const { deposit, balance } = useMonetree();

  const handleDeposit = () => {
    deposit(parseFloat(amount));
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5" />
            Deposit Funds
          </CardTitle>
          <CardDescription>Add money to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="text-2xl font-bold">{balance.toFixed(2)}</p>
          </div>
          <Input
            type="number"
            placeholder="Enter amount to deposit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button onClick={handleDeposit} className="w-full">
            Deposit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositTab;
