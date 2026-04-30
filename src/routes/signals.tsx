import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { SIGNALS, type Signal } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Target, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/signals")({
  head: () => ({
    meta: [
      { title: "Signals — Quantix" },
      { name: "description", content: "Generated trading signals with entry, stop loss, take profit, confidence and risk rating." },
    ],
  }),
  component: SignalsPage,
});

function SignalsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "won" | "lost">("all");
  const list = SIGNALS.filter((s) => filter === "all" || s.status === filter);

  const stats = {
    active: SIGNALS.filter((s) => s.status === "active").length,
    won: SIGNALS.filter((s) => s.status === "won").length,
    lost: SIGNALS.filter((s) => s.status === "lost").length,
  };
  const winRate = stats.won + stats.lost > 0 ? (stats.won / (stats.won + stats.lost)) * 100 : 0;

  return (
    <>
      <AppHeader title="Signals" subtitle="Generated entries with risk-rated targets" />
      <main className="flex-1 p-3 sm:p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Active" value={stats.active.toString()} tone="primary" />
          <StatCard label="Won" value={stats.won.toString()} tone="bull" />
          <StatCard label="Lost" value={stats.lost.toString()} tone="bear" />
          <StatCard label="Win Rate" value={`${winRate.toFixed(0)}%`} tone="info" />
        </div>

        <div className="flex gap-1">
          {(["all", "active", "won", "lost"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${
              filter === f ? "bg-primary/15 text-primary border border-primary/30" : "bg-surface text-muted-foreground border border-border hover:text-foreground"
            }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {list.map((s) => <SignalCard key={s.id} s={s} />)}
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "primary" | "bull" | "bear" | "info" }) {
  const toneClass = { primary: "text-primary", bull: "text-bull", bear: "text-bear", info: "text-info" }[tone];
  return (
    <Card className="p-3.5 bg-card border-border shadow-card">
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{label}</div>
      <div className={`mt-1.5 text-2xl font-mono font-bold tabular ${toneClass}`}>{value}</div>
    </Card>
  );
}

function SignalCard({ s }: { s: Signal }) {
  const isBuy = s.side === "BUY";
  const riskColor = { low: "text-bull border-bull/30 bg-bull/10", medium: "text-warning border-warning/30 bg-warning/10", high: "text-bear border-bear/30 bg-bear/10" }[s.risk];
  const statusColor = {
    active: "bg-primary/15 text-primary border-primary/30",
    won: "bg-bull/15 text-bull border-bull/30",
    lost: "bg-bear/15 text-bear border-bear/30",
    expired: "bg-muted text-muted-foreground border-border",
  }[s.status];

  return (
    <Card className="p-4 bg-card border-border shadow-card hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`h-9 w-9 rounded-md grid place-items-center ${isBuy ? "bg-bull/15 text-bull" : "bg-bear/15 text-bear"}`}>
            {isBuy ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">{s.symbol}</span>
              <Badge className={`font-mono text-[10px] border ${isBuy ? "bg-bull/15 text-bull border-bull/30" : "bg-bear/15 text-bear border-bear/30"}`}>{s.side}</Badge>
              <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">{s.timeframe}</Badge>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{s.createdAt}</div>
          </div>
        </div>
        <Badge variant="outline" className={`text-[10px] font-mono uppercase ${statusColor} border`}>{s.status}</Badge>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.reason}</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <Pill label="Entry" value={s.entry.toFixed(s.entry < 10 ? 4 : 2)} icon={<Target className="h-3 w-3" />} />
        <Pill label="Stop" value={s.stopLoss.toFixed(s.stopLoss < 10 ? 4 : 2)} icon={<Shield className="h-3 w-3" />} tone="bear" />
        <Pill label="Target" value={s.takeProfit.toFixed(s.takeProfit < 10 ? 4 : 2)} icon={<TrendingUp className="h-3 w-3" />} tone="bull" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
            <span>CONFIDENCE</span>
            <span className="text-primary font-semibold">{s.confidence}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary" style={{ width: `${s.confidence}%` }} />
          </div>
        </div>
        <Badge variant="outline" className={`text-[10px] font-mono uppercase ${riskColor}`}>{s.risk} risk</Badge>
      </div>
    </Card>
  );
}

function Pill({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone?: "bull" | "bear" }) {
  const toneClass = tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "text-foreground";
  return (
    <div className="rounded-md bg-surface/60 border border-border p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
        {icon} {label}
      </div>
      <div className={`mt-1 font-mono text-sm font-semibold tabular ${toneClass}`}>{value}</div>
    </div>
  );
}
