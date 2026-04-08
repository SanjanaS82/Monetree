import { useMonetree } from "@/context/MonetreeContext";
import { Progress } from "@/components/ui/progress";

const SavingsSection = () => {
  const { savingsGoal } = useMonetree();

  if (!savingsGoal) {
    return (
      <div className="bg-card rounded-xl shadow-sm p-6 border">
        <h2 className="text-lg font-semibold text-card-foreground mb-2">Savings Challenge</h2>
        <p className="text-muted-foreground text-sm">No savings goal set. Use the action panel to set one.</p>
      </div>
    );
  }

  const progress = Math.min((savingsGoal.current / savingsGoal.target) * 100, 100);
  const remaining = Math.max(savingsGoal.target - savingsGoal.current, 0);
  const isComplete = progress >= 100;

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 border">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Savings Challenge</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Goal: {savingsGoal.target.toFixed(2)}</span>
          <span className="text-muted-foreground">Saved: {savingsGoal.current.toFixed(2)}</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{progress.toFixed(1)}% complete</span>
          {isComplete ? (
            <span className="text-sm font-semibold text-success">Goal Reached</span>
          ) : (
            <span className="text-sm text-muted-foreground">{remaining.toFixed(2)} remaining</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsSection;
