import { useMonetree } from "@/context/MonetreeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, Lock, CircleDollarSign, Building2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { accounts, savings, transactions, totalBalance, totalLocked, totalAvailable } = useMonetree();
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Balance" amount={totalBalance} icon={Wallet} variant="primary" />
          <StatCard label="Total Locked" amount={totalLocked} icon={Lock} variant="locked" />
          <StatCard label="Total Available" amount={totalAvailable} icon={CircleDollarSign} variant="available" />
        </div>
      </div>

      {accounts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Bank Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {accounts.map(acc => (
                <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">{acc.bankName}</span>
                  <div className="text-right text-sm">
                    <span className="font-semibold">{acc.balance.toFixed(2)}</span>
                    {acc.lockedAmount > 0 && (
                      <span className="text-destructive text-xs ml-2">(Locked: {acc.lockedAmount.toFixed(2)})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {savings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Savings Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {savings.map(goal => {
              const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const label = goal.type === "custom" ? goal.customLabel : goal.type;
              return (
                <div key={goal.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{label}</span>
                    <span className="text-muted-foreground">{goal.currentAmount.toFixed(2)} / {goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTx.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {recentTx.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{tx.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
