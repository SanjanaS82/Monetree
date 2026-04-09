import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, LogOut, Trash2, Bell } from "lucide-react";
import { toast } from "sonner";

type ReminderFrequency = "weekly" | "monthly";

interface ReminderSettings {
  enabled: boolean;
  frequency: ReminderFrequency;
}

const REMINDER_INTERVALS: Record<ReminderFrequency, number> = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

// For demo purposes, use shorter intervals (30s for weekly, 60s for monthly)
const DEMO_INTERVALS: Record<ReminderFrequency, number> = {
  weekly: 30 * 1000,
  monthly: 60 * 1000,
};

const ProfileTab = () => {
  const { username, logout, deleteProfile } = useAuth();
  const storageKey = `monetree_reminder_${username}`;

  const [reminder, setReminder] = useState<ReminderSettings>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : { enabled: false, frequency: "weekly" };
    } catch {
      return { enabled: false, frequency: "weekly" };
    }
  });

  const saveReminder = useCallback(
    (settings: ReminderSettings) => {
      setReminder(settings);
      localStorage.setItem(storageKey, JSON.stringify(settings));
    },
    [storageKey]
  );

  useEffect(() => {
    if (!reminder.enabled) return;
    const interval = DEMO_INTERVALS[reminder.frequency];
    const id = setInterval(() => {
      toast.info("Reminder: Add money to your savings!");
    }, interval);
    return () => clearInterval(id);
  }, [reminder.enabled, reminder.frequency]);

  const handleDeleteProfile = () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      deleteProfile();
      toast.success("Profile deleted");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="text-lg font-semibold">{username}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDeleteProfile}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-5 w-5" />
            Savings Reminder
          </CardTitle>
          <CardDescription>Get periodic reminders to add money to savings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminder-toggle">Enable Reminder</Label>
            <Switch
              id="reminder-toggle"
              checked={reminder.enabled}
              onCheckedChange={(checked) => saveReminder({ ...reminder, enabled: checked })}
            />
          </div>
          {reminder.enabled && (
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={reminder.frequency}
                onValueChange={(val) => saveReminder({ ...reminder, frequency: val as ReminderFrequency })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Demo: reminders fire every {reminder.frequency === "weekly" ? "30 seconds" : "60 seconds"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
