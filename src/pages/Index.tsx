import { MonetreeProvider } from "@/context/MonetreeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTab from "@/components/tabs/DashboardTab";
import DepositTab from "@/components/tabs/DepositTab";
import WithdrawTab from "@/components/tabs/WithdrawTab";
import LockTab from "@/components/tabs/LockTab";
import SavingsTab from "@/components/tabs/SavingsTab";
import TransactionsTab from "@/components/tabs/TransactionsTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import { LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Lock, PiggyBank, List, User } from "lucide-react";

const tabs = [
  { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "deposit", label: "Deposit", icon: ArrowDownToLine },
  { value: "withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { value: "lock", label: "Lock / Unlock", icon: Lock },
  { value: "savings", label: "Savings", icon: PiggyBank },
  { value: "transactions", label: "Transactions", icon: List },
  { value: "profile", label: "Profile", icon: User },
];

const Index = () => {
  return (
    <MonetreeProvider>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground py-5 px-6 shadow-md">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Monetree</h1>
            <p className="text-sm opacity-80 mt-0.5">Smart Money Management</p>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted p-1.5 rounded-lg">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="dashboard"><DashboardTab /></TabsContent>
            <TabsContent value="deposit"><DepositTab /></TabsContent>
            <TabsContent value="withdraw"><WithdrawTab /></TabsContent>
            <TabsContent value="lock"><LockTab /></TabsContent>
            <TabsContent value="savings"><SavingsTab /></TabsContent>
            <TabsContent value="transactions"><TransactionsTab /></TabsContent>
            <TabsContent value="profile"><ProfileTab /></TabsContent>
          </Tabs>
        </main>
      </div>
    </MonetreeProvider>
  );
};

export default Index;
