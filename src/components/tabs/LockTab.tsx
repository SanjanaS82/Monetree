import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock } from "lucide-react";
import { getAvailableBalance } from "@/utils/storage";

const LockTab = () => {
  const { accounts, lockMoney, unlockMoney } = useMonetree();
  const [lockAccountId, setLockAccountId] = useState("");
  const [lockAmount, setLockAmount] = useState("");
  const [unlockAccountId, setUnlockAccountId] = useState("");
  const [unlockAmount, setUnlockAmount] = useState("");

  const handleLock = () => {
    lockMoney(lockAccountId, parseFloat(lockAmount));
    setLockAmount("");
  };

  const handleUnlock = () => {
    unlockMoney(unlockAccountId, parseFloat(unlockAmount));
    setUnlockAmount("");
  };

  const lockAccount = accounts.find(a => a.id === lockAccountId);
  const unlockAccount = accounts.find(a => a.id === unlockAccountId);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Lock Funds
          </CardTitle>
          <CardDescription>Lock money to prevent accidental spending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={lockAccountId} onValueChange={setLockAccountId}>
            <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
            <SelectContent>
              {accounts.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.bankName} (Avail: {getAvailableBalance(a).toFixed(2)})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {lockAccount && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Available: {getAvailableBalance(lockAccount).toFixed(2)}</span>
              <span>Locked: {lockAccount.lockedAmount.toFixed(2)}</span>
            </div>
          )}
          <Input type="number" placeholder="Amount to lock" value={lockAmount} onChange={e => setLockAmount(e.target.value)} min="0" step="0.01" />
          <Button onClick={handleLock} variant="destructive" className="w-full">Lock Money</Button>
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
          <Select value={unlockAccountId} onValueChange={setUnlockAccountId}>
            <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
            <SelectContent>
              {accounts.filter(a => a.lockedAmount > 0).map(a => (
                <SelectItem key={a.id} value={a.id}>{a.bankName} (Locked: {a.lockedAmount.toFixed(2)})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {unlockAccount && (
            <p className="text-sm text-muted-foreground">Locked: {unlockAccount.lockedAmount.toFixed(2)}</p>
          )}
          <Input type="number" placeholder="Amount to unlock" value={unlockAmount} onChange={e => setUnlockAmount(e.target.value)} min="0" step="0.01" />
          <Button onClick={handleUnlock} variant="outline" className="w-full">Unlock Money</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockTab;
