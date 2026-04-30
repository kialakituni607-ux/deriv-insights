import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CandleChart } from "@/components/CandleChart";
import { MiniSparkline } from "@/components/MiniSparkline";
import { MARKETS, INDICATORS, SIGNALS, PERFORMANCE } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight, Brain, Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Quantix" },
      { name: "description", content: "Live market overview, top signals, and prediction confidence at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const top = MARKETS.slice(0, 5);
  const activeSignals = SIGNALS.filter((s) => s.status === "active");
  const winRate = (PERFORMANCE.reduce((a, p) => a + p.wins, 0) / PERFORMANCE.reduce((a, p) => a + p.wins + p.losses, 0)) * 100;

  return (
    <>
      <AppHeader title="Dashboard" subtitle="Real-time market intelligence" />
      <main className="flex-1 p-3 sm:p-5 space-y-5">
        {/* KPI strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Active Signals" value={activeSignals.length.toString()} hint="across 4 markets" tone="primary" icon={<Sparkles className="h-3.5 w-3.5" />} />
          <Kpi label="Win Rate (7d)" value={`${winRate.toFixed(1)}%`} hint="↑ 4.2% vs last week" tone="bull" icon={<TrendingUp className="h-3.5 w-3.5" />} />
          <Kpi label="Avg Confidence" value="74%" hint="signal quality" tone="info" icon={<Target className="h-3.5 w-3.5" />} />
          <Kpi label="Risk Level" value="Medium" hint="2 high-risk alerts" tone="warning" icon={<AlertTriangle className="h-3.5 w-3.5" />} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Featured chart */}
          <Card className="xl:col-span-2 p-4 bg-card border-border shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold tracking-tight">Volatility 100 Index</h2>
                  <Badge variant="outline" className="font-mono text-[10px] border-primary/40 text-primary">R_100 · 1m</Badge>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-mono font-bold tabular">8,421.32</span>
                  <span className="text-bull font-mono text-sm flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5" /> +103.42 (+1.24%)
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex gap-1 text-[11px] font-mono">
                {["1m", "5m", "15m", "1h", "4h", "1D"].map((tf) => (
                  <button key={tf} className={`px-2 py-1 rounded ${tf === "1m" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <CandleChart symbol="R_100" basePrice={8420} height={300} />
          </Card>

          {/* AI Insights */}
          <Card className="p-4 bg-card border-border shadow-card flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-md gradient-primary grid place-items-center shadow-glow">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Insights</h3>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Updated 14s ago</p>
              </div>
            </div>
            <div className="space-y-3 text-sm flex-1">
              <Insight tone="bull" title="Bullish bias on synthetics" body="R_100 and Boom indices showing strong continuation patterns. Volatility expanding." />
              <Insight tone="warning" title="Watch GBP exhaustion" body="GBPUSD lost momentum at 1.2680. Short setups forming on 15m." />
              <Insight tone="info" title="Crypto consolidation" body="BTC trading inside a tightening range. Breakout watch on 1h." />
            </div>
            <button className="mt-3 text-xs text-primary font-medium hover:underline self-start">
              View full report →
            </button>
          </Card>
        </section>

        {/* Top movers + Active signals */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-4 bg-card border-border shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Top Movers</h3>
              <Link to="/markets" className="text-xs text-primary hover:underline">All markets →</Link>
            </div>
            <div className="space-y-1">
              {top.map((m) => (
                <div key={m.symbol} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold">{m.symbol}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{m.name}</span>
                    </div>
                  </div>
                  <MiniSparkline symbol={m.symbol} bullish={m.change >= 0} basePrice={m.price} />
                  <div className="text-right w-20">
                    <div className="font-mono text-xs tabular">{m.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                    <div className={`text-[11px] font-mono ${m.change >= 0 ? "text-bull" : "text-bear"}`}>
                      {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-card border-border shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Active Signals</h3>
              <Link to="/signals" className="text-xs text-primary hover:underline">All signals →</Link>
            </div>
            <div className="space-y-2">
              {activeSignals.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-md bg-surface/60 border border-border">
                  <Badge className={`font-mono text-[10px] ${s.side === "BUY" ? "bg-bull/15 text-bull border border-bull/30" : "bg-bear/15 text-bear border border-bear/30"}`}>
                    {s.side}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-semibold">{s.symbol} <span className="text-muted-foreground">· {s.timeframe}</span></div>
                    <div className="text-[11px] text-muted-foreground truncate">{s.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-primary">{s.confidence}%</div>
                    <div className="text-[10px] text-muted-foreground">{s.createdAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Indicators + Performance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 p-4 bg-card border-border shadow-card">
            <h3 className="font-semibold text-sm mb-3">Technical Indicators · R_100</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INDICATORS.map((i) => (
                <div key={i.name} className="rounded-md border border-border bg-surface/60 p-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{i.name}</div>
                  <div className="font-mono text-sm font-semibold mt-1">{i.value}</div>
                  <div className={`text-[10px] mt-1 font-medium ${
                    i.signal === "buy" ? "text-bull" : i.signal === "sell" ? "text-bear" : "text-muted-foreground"
                  }`}>
                    {i.detail}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-card border-border shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Weekly Accuracy</h3>
              <span className="text-xs font-mono text-bull">{winRate.toFixed(1)}%</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="accuracy" stroke="var(--primary)" strokeWidth={2} fill="url(#acc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
              {PERFORMANCE.map((p) => <span key={p.date}>{p.date}</span>)}
            </div>
          </Card>
        </section>

        <p className="text-[11px] text-muted-foreground text-center font-mono pt-2">
          ⚠ Analysis is probabilistic. No outcome is guaranteed. Trade responsibly.
        </p>
      </main>
    </>
  );
}

function Kpi({ label, value, hint, tone, icon }: { label: string; value: string; hint: string; tone: "primary" | "bull" | "bear" | "info" | "warning"; icon: React.ReactNode }) {
  const toneClass = {
    primary: "text-primary",
    bull: "text-bull",
    bear: "text-bear",
    info: "text-info",
    warning: "text-warning",
  }[tone];
  return (
    <Card className="p-3.5 bg-card border-border shadow-card">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
        <span className={toneClass}>{icon}</span>
        {label}
      </div>
      <div className={`mt-1.5 text-xl font-mono font-bold tabular ${toneClass}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>
    </Card>
  );
}

function Insight({ tone, title, body }: { tone: "bull" | "bear" | "info" | "warning"; title: string; body: string }) {
  const toneClass = {
    bull: "border-l-bull text-bull",
    bear: "border-l-bear text-bear",
    info: "border-l-info text-info",
    warning: "border-l-warning text-warning",
  }[tone];
  return (
    <div className={`border-l-2 ${toneClass} pl-3`}>
      <div className="text-xs font-semibold">{title}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{body}</div>
    </div>
  );
}
