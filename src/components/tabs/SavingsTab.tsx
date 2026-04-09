import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, PiggyBank } from "lucide-react";
import { getAvailableBalance } from "@/utils/storage";

type SavingsTypeOption = "emergency" | "rent" | "insurance" | "custom";

const savingsTypeLabels: Record<SavingsTypeOption, string> = {
  emergency: "Emergency Fund",
  rent: "Rent",
  insurance: "Insurance",
  custom: "Custom",
};

const SavingsTab = () => {
  const { accounts, savings, createSavingsGoal, addToSavings } = useMonetree();
  const [savingsType, setSavingsType] = useState<SavingsTypeOption>("emergency");
  const [customLabel, setCustomLabel] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [linkedAccount, setLinkedAccount] = useState("");
  const [contributeGoalId, setContributeGoalId] = useState("");
  const [contributeAmount, setContributeAmount] = useState("");

  const handleCreate = () => {
    createSavingsGoal(savingsType, customLabel, parseFloat(targetAmount), linkedAccount);
    setTargetAmount("");
    setCustomLabel("");
  };

  const handleContribute = () => {
    addToSavings(contributeGoalId, parseFloat(contributeAmount));
    setContributeAmount("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {savings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5" />
              Savings Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savings.map(goal => {
              const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
              const label = goal.type === "custom" ? goal.customLabel : savingsTypeLabels[goal.type];
              const acc = accounts.find(a => a.id === goal.linkedAccountId);
              const isComplete = progress >= 100;
              return (
                <div key={goal.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{label}</span>
                    <span className="text-muted-foreground text-xs">via {acc?.bankName}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(1)}%</span>
                    <span>{goal.currentAmount.toFixed(2)} / {goal.targetAmount.toFixed(2)}</span>
                  </div>
                  {isComplete ? (
                    <p className="text-xs font-semibold text-center" style={{ color: "hsl(var(--success))" }}>Goal reached</p>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">{remaining.toFixed(2)} remaining</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create Savings Goal
          </CardTitle>
          <CardDescription>Set a new savings target</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={savingsType} onValueChange={(v) => setSavingsType(v as SavingsTypeOption)}>
            <SelectTrigger><SelectValue placeholder="Savings type" /></SelectTrigger>
            <SelectContent>
              {Object.entries(savingsTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {savingsType === "custom" && (
            <Input placeholder="Custom label" value={customLabel} onChange={e => setCustomLabel(e.target.value)} />
          )}
          <Input type="number" placeholder="Target amount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} min="0" step="0.01" />
          <Select value={linkedAccount} onValueChange={setLinkedAccount}>
            <SelectTrigger><SelectValue placeholder="Linked bank account" /></SelectTrigger>
            <SelectContent>
              {accounts.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.bankName} (Avail: {getAvailableBalance(a).toFixed(2)})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreate} className="w-full">Create Goal</Button>
        </CardContent>
      </Card>

      {savings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Add to Savings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={contributeGoalId} onValueChange={setContributeGoalId}>
              <SelectTrigger><SelectValue placeholder="Select savings goal" /></SelectTrigger>
              <SelectContent>
                {savings.filter(g => g.currentAmount < g.targetAmount).map(g => {
                  const label = g.type === "custom" ? g.customLabel : savingsTypeLabels[g.type];
                  return <SelectItem key={g.id} value={g.id}>{label} ({g.currentAmount.toFixed(2)}/{g.targetAmount.toFixed(2)})</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Amount to contribute" value={contributeAmount} onChange={e => setContributeAmount(e.target.value)} min="0" step="0.01" />
            <Button onClick={handleContribute} className="w-full" style={{ backgroundColor: "hsl(var(--success))" }}>Add to Savings</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavingsTab;
