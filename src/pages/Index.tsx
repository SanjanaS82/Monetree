import { MonetreeProvider } from "@/context/MonetreeContext";
import BalanceCards from "@/components/BalanceCards";
import ActionPanel from "@/components/ActionPanel";
import SavingsSection from "@/components/SavingsSection";
import TransactionHistory from "@/components/TransactionHistory";

const Index = () => {
  return (
    <MonetreeProvider>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground py-5 px-6 shadow-md">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Monetree</h1>
            <p className="text-sm opacity-80 mt-0.5">Smart Money Management</p>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <BalanceCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActionPanel />
            <SavingsSection />
          </div>
          <TransactionHistory />
        </main>
      </div>
    </MonetreeProvider>
  );
};

export default Index;
