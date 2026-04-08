import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpFromLine } from "lucide-react";

const WithdrawTab = () => {
  const [amount, setAmount] = useState("");
  const { withdraw, availableBalance } = useMonetree();

  const handleWithdraw = () => {
    withdraw(parseFloat(amount));
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="h-5 w-5" />
            Withdraw Funds
          </CardTitle>
          <CardDescription>Withdraw from your available balance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-bold">{availableBalance.toFixed(2)}</p>
          </div>
          <Input
            type="number"
            placeholder="Enter amount to withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button onClick={handleWithdraw} variant="outline" className="w-full">
            Withdraw
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawTab;
