import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Unlock } from "lucide-react";

const LockTab = () => {
  const [lockAmount, setLockAmount] = useState("");
  const [unlockAmount, setUnlockAmount] = useState("");
  const { lockMoney, unlockMoney, lockedAmount, availableBalance } = useMonetree();

  const handleLock = () => {
    lockMoney(parseFloat(lockAmount));
    setLockAmount("");
  };

  const handleUnlock = () => {
    unlockMoney(parseFloat(unlockAmount));
    setUnlockAmount("");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Lock Funds
          </CardTitle>
          <CardDescription>Lock money to prevent accidental spending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-lg font-bold">{availableBalance.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Currently Locked</p>
              <p className="text-lg font-bold text-destructive">{lockedAmount.toFixed(2)}</p>
            </div>
          </div>
          <Input
            type="number"
            placeholder="Amount to lock"
            value={lockAmount}
            onChange={(e) => setLockAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button onClick={handleLock} variant="destructive" className="w-full">
            Lock Money
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Unlock Funds
          </CardTitle>
          <CardDescription>Release previously locked funds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Locked Amount</p>
            <p className="text-lg font-bold">{lockedAmount.toFixed(2)}</p>
          </div>
          <Input
            type="number"
            placeholder="Amount to unlock"
            value={unlockAmount}
            onChange={(e) => setUnlockAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button onClick={handleUnlock} variant="outline" className="w-full">
            Unlock Money
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockTab;
