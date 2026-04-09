import { useMonetree } from "@/context/MonetreeContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";
import type { Transaction } from "@/utils/storage";

const typeStyles: Record<Transaction["type"], string> = {
  deposit: "bg-success/10 text-success",
  lock: "bg-warning/10 text-warning",
  unlock: "bg-primary/10 text-primary",
  savings: "bg-accent/10 text-accent",
  transfer: "bg-destructive/10 text-destructive",
  goal_set: "bg-primary/10 text-primary",
};

const typeLabels: Record<Transaction["type"], string> = {
  deposit: "Deposit",
  lock: "Lock",
  unlock: "Unlock",
  savings: "Savings",
  transfer: "Transfer",
  goal_set: "Goal Set",
};

const TransactionsTab = () => {
  const { transactions } = useMonetree();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No transactions yet</p>
        ) : (
          <ScrollArea className="h-[500px] pr-3">
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${typeStyles[tx.type]}`}>
                      {typeLabels[tx.type]}
                    </span>
                    <span className="text-sm">{tx.description}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsTab;
