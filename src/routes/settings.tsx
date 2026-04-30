import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Quantix" },
      { name: "description", content: "Configure analysis thresholds, API keys, signal preferences and notifications." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [threshold, setThreshold] = useState([65]);
  const [risk, setRisk] = useState([2]);
  const [notify, setNotify] = useState(true);
  const [sound, setSound] = useState(false);

  return (
    <>
      <AppHeader title="Settings" subtitle="Analysis & API configuration" />
      <main className="flex-1 p-3 sm:p-5 space-y-4 max-w-3xl">
        <Card className="p-5 bg-card border-border shadow-card space-y-4">
          <div>
            <h3 className="font-semibold text-sm">Deriv API</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Connect your Deriv account for live tick data.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">App ID</Label>
              <Input placeholder="1089" className="bg-surface font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">API Token</Label>
              <Input type="password" placeholder="••••••••••••••" className="bg-surface font-mono" />
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">Connect to Deriv</Button>
        </Card>

        <Card className="p-5 bg-card border-border shadow-card space-y-5">
          <div>
            <h3 className="font-semibold text-sm">Signal thresholds</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Tune when signals are generated.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <Label className="font-mono uppercase tracking-wider text-muted-foreground">Min confidence</Label>
              <span className="font-mono font-semibold text-primary">{threshold[0]}%</span>
            </div>
            <Slider value={threshold} onValueChange={setThreshold} min={50} max={95} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <Label className="font-mono uppercase tracking-wider text-muted-foreground">Risk per trade</Label>
              <span className="font-mono font-semibold text-primary">{risk[0]}%</span>
            </div>
            <Slider value={risk} onValueChange={setRisk} min={0.5} max={5} step={0.1} />
          </div>
        </Card>

        <Card className="p-5 bg-card border-border shadow-card space-y-4">
          <div>
            <h3 className="font-semibold text-sm">Notifications</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Push notifications</Label>
              <p className="text-xs text-muted-foreground">Alert on new high-confidence signals.</p>
            </div>
            <Switch checked={notify} onCheckedChange={setNotify} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Sound alerts</Label>
              <p className="text-xs text-muted-foreground">Play a tone when a signal triggers.</p>
            </div>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">Reset</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            onClick={() => toast.success("Settings saved", { description: "Your preferences have been updated." })}>
            Save changes
          </Button>
        </div>
      </main>
    </>
  );
}
