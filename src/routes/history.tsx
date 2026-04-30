import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SIGNALS, PERFORMANCE } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Quantix" },
      { name: "description", content: "Past signals, prediction accuracy and win/loss analytics." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const totals = PERFORMANCE.reduce((a, p) => ({ wins: a.wins + p.wins, losses: a.losses + p.losses }), { wins: 0, losses: 0 });
  const winRate = (totals.wins / (totals.wins + totals.losses)) * 100;

  return (
    <>
      <AppHeader title="History" subtitle="Performance tracker & past signals" />
      <main className="flex-1 p-3 sm:p-5 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiBlock label="Total signals" value={(totals.wins + totals.losses).toString()} />
          <KpiBlock label="Wins" value={totals.wins.toString()} tone="bull" />
          <KpiBlock label="Losses" value={totals.losses.toString()} tone="bear" />
          <KpiBlock label="Win rate" value={`${winRate.toFixed(1)}%`} tone="primary" />
        </div>

        <Card className="p-4 bg-card border-border shadow-card">
          <h3 className="font-semibold text-sm mb-3">Win / Loss · last 7 days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="wins" fill="var(--bull)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" fill="var(--bear)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-card overflow-hidden">
          <h3 className="font-semibold text-sm mb-3">Signal log</h3>
          <div className="overflow-x-auto -mx-4">
            <table className="w-full text-sm">
              <thead className="bg-surface/60 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2">Symbol</th>
                  <th className="text-left px-4 py-2">Side</th>
                  <th className="text-left px-4 py-2 hidden md:table-cell">TF</th>
                  <th className="text-right px-4 py-2">Entry</th>
                  <th className="text-right px-4 py-2 hidden sm:table-cell">SL</th>
                  <th className="text-right px-4 py-2 hidden sm:table-cell">TP</th>
                  <th className="text-right px-4 py-2">Conf</th>
                  <th className="text-right px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {SIGNALS.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold">{s.symbol}</td>
                    <td className="px-4 py-2.5">
                      <Badge className={`font-mono text-[10px] ${s.side === "BUY" ? "bg-bull/15 text-bull border border-bull/30" : "bg-bear/15 text-bear border border-bear/30"}`}>
                        {s.side}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs hidden md:table-cell text-muted-foreground">{s.timeframe}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-right tabular">{s.entry}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-right tabular text-bear hidden sm:table-cell">{s.stopLoss}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-right tabular text-bull hidden sm:table-cell">{s.takeProfit}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-right text-primary font-semibold">{s.confidence}%</td>
                    <td className="px-4 py-2.5 text-right">
                      <Badge variant="outline" className={`text-[10px] font-mono uppercase ${
                        s.status === "won" ? "border-bull/40 text-bull" :
                        s.status === "lost" ? "border-bear/40 text-bear" :
                        s.status === "active" ? "border-primary/40 text-primary" :
                        "border-border text-muted-foreground"
                      }`}>
                        {s.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}

function KpiBlock({ label, value, tone }: { label: string; value: string; tone?: "bull" | "bear" | "primary" }) {
  const tc = tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : tone === "primary" ? "text-primary" : "text-foreground";
  return (
    <Card className="p-3.5 bg-card border-border shadow-card">
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-mono font-bold tabular ${tc}`}>{value}</div>
    </Card>
  );
}
