import { useMonetree, TransactionType } from "@/context/MonetreeContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeStyles: Record<TransactionType, string> = {
  deposit: "bg-success/10 text-success",
  withdraw: "bg-destructive/10 text-destructive",
  lock: "bg-warning/10 text-warning",
  savings: "bg-accent/10 text-accent",
  goal_set: "bg-primary/10 text-primary",
};

const typeLabels: Record<TransactionType, string> = {
  deposit: "Deposit",
  withdraw: "Withdrawal",
  lock: "Lock",
  savings: "Savings",
  goal_set: "Goal Set",
};

const TransactionHistory = () => {
  const { transactions } = useMonetree();

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 border">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No transactions yet</p>
      ) : (
        <ScrollArea className="h-[320px] pr-3">
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${typeStyles[tx.type]}`}>
                    {typeLabels[tx.type]}
                  </span>
                  <span className="text-sm text-card-foreground">{tx.description}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {tx.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default TransactionHistory;
