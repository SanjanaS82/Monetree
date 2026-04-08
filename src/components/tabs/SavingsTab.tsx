import { useState } from "react";
import { useMonetree } from "@/context/MonetreeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, PiggyBank } from "lucide-react";

const SavingsTab = () => {
  const [goalAmount, setGoalAmount] = useState("");
  const [saveAmount, setSaveAmount] = useState("");
  const { setSavingsGoal, addToSavings, savingsGoal, availableBalance } = useMonetree();

  const handleSetGoal = () => {
    setSavingsGoal(parseFloat(goalAmount));
    setGoalAmount("");
  };

  const handleAddSavings = () => {
    addToSavings(parseFloat(saveAmount));
    setSaveAmount("");
  };

  const progress = savingsGoal ? Math.min((savingsGoal.current / savingsGoal.target) * 100, 100) : 0;
  const remaining = savingsGoal ? Math.max(savingsGoal.target - savingsGoal.current, 0) : 0;
  const isComplete = progress >= 100;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {savingsGoal && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5" />
              Savings Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={progress} className="h-4" />
            <div className="flex justify-between text-sm">
              <span className="font-medium">{progress.toFixed(1)}%</span>
              <span className="text-muted-foreground">
                {savingsGoal.current.toFixed(2)} / {savingsGoal.target.toFixed(2)}
              </span>
            </div>
            {isComplete ? (
              <p className="text-sm font-semibold text-success text-center py-2">
                Savings goal reached
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                {remaining.toFixed(2)} remaining to reach your goal
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set Savings Goal
          </CardTitle>
          <CardDescription>
            {savingsGoal ? "Replace your current savings goal" : "Define a target amount to save towards"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Enter goal amount"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button onClick={handleSetGoal} variant="outline" className="w-full">
            Set Goal
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Add to Savings
          </CardTitle>
          <CardDescription>Available: {availableBalance.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Amount to save"
            value={saveAmount}
            onChange={(e) => setSaveAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button onClick={handleAddSavings} className="w-full bg-success hover:bg-success/90 text-success-foreground">
            Add to Savings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsTab;
