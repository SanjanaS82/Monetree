import { useMonetree } from "@/context/MonetreeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, Lock, CircleDollarSign, Target } from "lucide-react";

const StatCard = ({ label, amount, icon: Icon, variant }: {
  label: string;
  amount: number;
  icon: React.ElementType;
  variant: "primary" | "locked" | "available";
}) => {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    locked: "border border-destructive/20",
    available: "border border-success/20",
  };

  return (
    <Card className={`${styles[variant]} shadow-sm`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${variant === "primary" ? "opacity-80" : "text-muted-foreground"}`} />
          <p className={`text-sm font-medium ${variant === "primary" ? "opacity-80" : "text-muted-foreground"}`}>
            {label}
          </p>
        </div>
        <p className="text-2xl font-bold mt-2">{amount.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

const DashboardTab = () => {
  const { balance, lockedAmount, availableBalance, savingsGoal, transactions } = useMonetree();

  const progress = savingsGoal ? Math.min((savingsGoal.current / savingsGoal.target) * 100, 100) : 0;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Balance" amount={balance} icon={Wallet} variant="primary" />
          <StatCard label="Locked Amount" amount={lockedAmount} icon={Lock} variant="locked" />
          <StatCard label="Available Balance" amount={availableBalance} icon={CircleDollarSign} variant="available" />
        </div>
      </div>

      {savingsGoal && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Savings Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{progress.toFixed(1)}% complete</span>
              <span>{savingsGoal.current.toFixed(2)} / {savingsGoal.target.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{tx.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {tx.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
