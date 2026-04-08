import { useMonetree } from "@/context/MonetreeContext";

const BalanceCard = ({ label, amount, variant }: { label: string; amount: number; variant: "primary" | "locked" | "available" }) => {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    locked: "bg-card text-card-foreground border border-destructive/20",
    available: "bg-card text-card-foreground border border-success/20",
  };

  return (
    <div className={`rounded-xl p-5 shadow-sm ${styles[variant]}`}>
      <p className={`text-sm font-medium ${variant === "primary" ? "opacity-80" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{amount.toFixed(2)}</p>
    </div>
  );
};

const BalanceCards = () => {
  const { balance, lockedAmount, availableBalance } = useMonetree();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <BalanceCard label="Total Balance" amount={balance} variant="primary" />
      <BalanceCard label="Locked Amount" amount={lockedAmount} variant="locked" />
      <BalanceCard label="Available Balance" amount={availableBalance} variant="available" />
    </div>
  );
};

export default BalanceCards;
