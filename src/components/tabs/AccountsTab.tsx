import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, ArrowDownToLine } from "lucide-react";
import { getAvailableBalance } from "@/utils/storage";

const AccountsTab = () => {
  const { accounts, addAccount, deposit } = useMonetree();
  const [bankName, setBankName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [depositAccountId, setDepositAccountId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const handleAddAccount = () => {
    addAccount(bankName, parseFloat(initialBalance));
    setBankName("");
    setInitialBalance("");
  };

  const handleDeposit = () => {
    deposit(depositAccountId, parseFloat(depositAmount));
    setDepositAmount("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Bank Account
          </CardTitle>
          <CardDescription>Create a new bank account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Bank name" value={bankName} onChange={e => setBankName(e.target.value)} />
          <Input type="number" placeholder="Initial balance" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} min="0" step="0.01" />
          <Button onClick={handleAddAccount} className="w-full">Add Account</Button>
        </CardContent>
      </Card>

      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5" />
              Deposit Funds
            </CardTitle>
            <CardDescription>Add money to an existing account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={depositAccountId} onValueChange={setDepositAccountId}>
              <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
              <SelectContent>
                {accounts.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.bankName} ({a.balance.toFixed(2)})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Amount to deposit" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} min="0" step="0.01" />
            <Button onClick={handleDeposit} className="w-full">Deposit</Button>
          </CardContent>
        </Card>
      )}

      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Your Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.map(acc => (
                <div key={acc.id} className="p-4 rounded-lg bg-muted/50 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{acc.bankName}</span>
                    <span className="font-bold">{acc.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Available: {getAvailableBalance(acc).toFixed(2)}</span>
                    <span>Locked: {acc.lockedAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountsTab;
