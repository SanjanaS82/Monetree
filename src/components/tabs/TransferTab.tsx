import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { getAvailableBalance } from "@/utils/storage";

const TransferTab = () => {
  const { accounts, transfer } = useMonetree();
  const [fromAccountId, setFromAccountId] = useState("");
  const [transferType, setTransferType] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");

  const fromAccount = accounts.find(a => a.id === fromAccountId);

  const handleTransfer = () => {
    transfer(fromAccountId, transferType, destination, parseFloat(amount));
    setAmount("");
    setDestination("");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Fund Transfer
          </CardTitle>
          <CardDescription>Transfer funds to accounts, merchants, or UPI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Source Account</label>
            <Select value={fromAccountId} onValueChange={setFromAccountId}>
              <SelectTrigger><SelectValue placeholder="Select source account" /></SelectTrigger>
              <SelectContent>
                {accounts.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.bankName} (Avail: {getAvailableBalance(a).toFixed(2)})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromAccount && (
              <p className="text-xs text-muted-foreground">Available: {getAvailableBalance(fromAccount).toFixed(2)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transfer Type</label>
            <Select value={transferType} onValueChange={(v) => { setTransferType(v); setDestination(""); }}>
              <SelectTrigger><SelectValue placeholder="Select transfer type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">To Another Account</SelectItem>
                <SelectItem value="merchant">To Merchant</SelectItem>
                <SelectItem value="upi">To UPI ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {transferType === "internal" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination Account</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>
                  {accounts.filter(a => a.id !== fromAccountId).map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.bankName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : transferType === "merchant" ? (
            <Input placeholder="Merchant name" value={destination} onChange={e => setDestination(e.target.value)} />
          ) : transferType === "upi" ? (
            <Input placeholder="UPI ID (e.g. name@upi)" value={destination} onChange={e => setDestination(e.target.value)} />
          ) : null}

          <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" />
          <Button onClick={handleTransfer} className="w-full">Transfer</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferTab;
