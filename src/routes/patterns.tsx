import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PATTERNS, type Pattern } from "@/lib/mock-data";
import { Triangle, Repeat, GitBranch, Pause, ScanSearch } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/patterns")({
  head: () => ({
    meta: [
      { title: "Pattern Scanner — Quantix" },
      { name: "description", content: "Live scanner for breakouts, reversals, consolidations and continuation patterns." },
    ],
  }),
  component: PatternsPage,
});

const TYPE_META: Record<Pattern["type"], { label: string; icon: React.ReactNode; color: string }> = {
  breakout: { label: "Breakout", icon: <Triangle className="h-3.5 w-3.5" />, color: "text-bull border-bull/40 bg-bull/10" },
  reversal: { label: "Reversal", icon: <Repeat className="h-3.5 w-3.5" />, color: "text-bear border-bear/40 bg-bear/10" },
  consolidation: { label: "Consolidation", icon: <Pause className="h-3.5 w-3.5" />, color: "text-warning border-warning/40 bg-warning/10" },
  continuation: { label: "Continuation", icon: <GitBranch className="h-3.5 w-3.5" />, color: "text-info border-info/40 bg-info/10" },
};

function PatternsPage() {
  const [filter, setFilter] = useState<"all" | Pattern["type"]>("all");
  const list = PATTERNS.filter((p) => filter === "all" || p.type === filter);

  return (
    <>
      <AppHeader title="Pattern Scanner" subtitle="Auto-detected chart formations across timeframes" />
      <main className="flex-1 p-3 sm:p-5 space-y-4">
        <div className="flex items-center gap-1 flex-wrap">
          {(["all", "breakout", "reversal", "consolidation", "continuation"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${
              filter === f ? "bg-primary/15 text-primary border border-primary/30" : "bg-surface text-muted-foreground border border-border hover:text-foreground"
            }`}>
              {f}
            </button>
          ))}
          <Badge variant="outline" className="ml-auto font-mono text-[10px] border-bull/30 text-bull">
            <ScanSearch className="h-3 w-3 mr-1.5" /> Scanning live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((p, i) => {
            const meta = TYPE_META[p.type];
            return (
              <Card key={i} className="p-4 bg-card border-border shadow-card hover:border-primary/30 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="font-mono text-xs text-muted-foreground mt-0.5">{p.symbol} · {p.timeframe}</div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-mono uppercase border ${meta.color}`}>
                    {meta.icon}
                    <span className="ml-1">{meta.label}</span>
                  </Badge>
                </div>

                <div className="rounded-md bg-surface/60 border border-border p-3 mb-3">
                  <PatternMiniSvg type={p.type} />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                    <span>STRENGTH</span>
                    <span className="text-primary font-semibold">{p.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary" style={{ width: `${p.confidence}%` }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}

function PatternMiniSvg({ type }: { type: Pattern["type"] }) {
  const stroke = "var(--primary)";
  return (
    <svg viewBox="0 0 200 60" className="w-full h-16">
      {type === "breakout" && (
        <>
          <path d="M5,40 Q40,38 70,42 T130,40 L195,15" stroke={stroke} strokeWidth="2" fill="none" />
          <line x1="5" y1="50" x2="135" y2="50" stroke="var(--bear)" strokeDasharray="3 3" strokeWidth="1" opacity="0.5" />
        </>
      )}
      {type === "reversal" && (
        <path d="M5,15 L50,45 L100,20 L150,45 L195,15" stroke={stroke} strokeWidth="2" fill="none" />
      )}
      {type === "consolidation" && (
        <>
          <path d="M5,30 Q50,15 100,35 T195,30" stroke={stroke} strokeWidth="2" fill="none" />
          <line x1="5" y1="15" x2="195" y2="15" stroke="var(--muted-foreground)" strokeDasharray="3 3" strokeWidth="1" opacity="0.4" />
          <line x1="5" y1="45" x2="195" y2="45" stroke="var(--muted-foreground)" strokeDasharray="3 3" strokeWidth="1" opacity="0.4" />
        </>
      )}
      {type === "continuation" && (
        <path d="M5,50 L50,30 L70,40 L90,28 L130,38 L195,10" stroke={stroke} strokeWidth="2" fill="none" />
      )}
    </svg>
  );
}
