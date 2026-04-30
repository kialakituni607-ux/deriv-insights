import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateDigitFrequency, generateDigitStream } from "@/lib/mock-data";
import { Flame, Snowflake, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/digits")({
  head: () => ({
    meta: [
      { title: "Digits Analysis — Quantix" },
      { name: "description", content: "Last digit frequency, hot/cold digits, streak detection and probability heatmap for Deriv digit trading." },
    ],
  }),
  component: DigitsPage,
});

const SYMBOLS = ["R_10", "R_25", "R_50", "R_75", "R_100"];

function DigitsPage() {
  const [symbol, setSymbol] = useState("R_100");
  const seed = symbol.charCodeAt(symbol.length - 1);
  const freq = useMemo(() => generateDigitFrequency(seed), [seed]);
  const stream = useMemo(() => generateDigitStream(40, seed + 3), [seed]);

  const max = Math.max(...freq.map((f) => f.count));
  const min = Math.min(...freq.map((f) => f.count));
  const hot = freq.filter((f) => f.count === max).map((f) => f.digit);
  const cold = freq.filter((f) => f.count === min).map((f) => f.digit);

  // streak detection in stream
  const streaks: { digit: number; length: number; start: number }[] = [];
  let i = 0;
  while (i < stream.length) {
    let j = i;
    while (j < stream.length && stream[j] === stream[i]) j++;
    if (j - i >= 2) streaks.push({ digit: stream[i], length: j - i, start: i });
    i = j;
  }

  return (
    <>
      <AppHeader title="Digits Analysis" subtitle="Last-digit frequency, hot/cold zones, streaks" />
      <main className="flex-1 p-3 sm:p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1">
            {SYMBOLS.map((s) => (
              <button key={s} onClick={() => setSymbol(s)} className={`px-3 py-1.5 rounded-md text-xs font-mono ${
                symbol === s ? "bg-primary/15 text-primary border border-primary/30" : "bg-surface text-muted-foreground border border-border hover:text-foreground"
              }`}>
                {s}
              </button>
            ))}
          </div>
          <Badge variant="outline" className="font-mono text-[10px] border-bull/30 text-bull">
            <span className="h-1.5 w-1.5 rounded-full bg-bull pulse-dot mr-1.5" />
            Sampling 1,000 ticks
          </Badge>
        </div>

        {/* Digit circles */}
        <Card className="p-5 bg-card border-border shadow-card">
          <h3 className="font-semibold text-sm mb-4">Digit Distribution</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4">
            {freq.map((f) => {
              const isHot = hot.includes(f.digit);
              const isCold = cold.includes(f.digit);
              const intensity = (f.count - min) / (max - min || 1); // 0..1
              const size = 56 + intensity * 24;
              return (
                <div key={f.digit} className="flex flex-col items-center">
                  <div
                    className={`relative rounded-full grid place-items-center font-mono font-bold transition-all ${
                      isHot ? "bg-bear/20 border-2 border-bear text-bear shadow-[0_0_24px_-4px_var(--bear)]" :
                      isCold ? "bg-info/15 border-2 border-info text-info" :
                      "bg-surface border border-border"
                    }`}
                    style={{ width: size, height: size, fontSize: 18 + intensity * 6 }}
                  >
                    {f.digit}
                    {isHot && <Flame className="absolute -top-1 -right-1 h-3.5 w-3.5 text-bear" fill="currentColor" />}
                    {isCold && <Snowflake className="absolute -top-1 -right-1 h-3.5 w-3.5 text-info" />}
                  </div>
                  <div className="mt-2 font-mono text-[11px] tabular">{f.percent.toFixed(1)}%</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{f.count}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Probability heatmap (bar) */}
          <Card className="lg:col-span-2 p-4 bg-card border-border shadow-card">
            <h3 className="font-semibold text-sm mb-3">Probability Heatmap</h3>
            <div className="space-y-1.5">
              {freq.sort((a, b) => b.count - a.count).map((f) => {
                const w = (f.count / max) * 100;
                const isHot = hot.includes(f.digit);
                const isCold = cold.includes(f.digit);
                return (
                  <div key={f.digit} className="flex items-center gap-3">
                    <div className="w-6 text-center font-mono font-bold">{f.digit}</div>
                    <div className="flex-1 h-6 bg-surface rounded-md overflow-hidden relative">
                      <div className={`h-full ${isHot ? "bg-bear/60" : isCold ? "bg-info/50" : "bg-primary/40"}`} style={{ width: `${w}%` }} />
                      <div className="absolute inset-0 flex items-center justify-end pr-2 font-mono text-[11px] tabular">
                        {f.percent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-4 bg-card border-border shadow-card space-y-3">
            <h3 className="font-semibold text-sm">Insights</h3>
            <div className="rounded-md border border-bear/30 bg-bear/10 p-3">
              <div className="flex items-center gap-2 text-bear text-xs font-semibold">
                <Flame className="h-3.5 w-3.5" /> Hot digit{hot.length > 1 ? "s" : ""}: {hot.join(", ")}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Appearing more than expected — possible overbought repetition.</p>
            </div>
            <div className="rounded-md border border-info/30 bg-info/10 p-3">
              <div className="flex items-center gap-2 text-info text-xs font-semibold">
                <Snowflake className="h-3.5 w-3.5" /> Cold digit{cold.length > 1 ? "s" : ""}: {cold.join(", ")}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Underperforming. Mean reversion may favour these.</p>
            </div>
            <div className="rounded-md border border-warning/30 bg-warning/10 p-3">
              <div className="flex items-center gap-2 text-warning text-xs font-semibold">
                <AlertCircle className="h-3.5 w-3.5" /> {streaks.length} streak{streaks.length === 1 ? "" : "s"} detected
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Longest run: {Math.max(0, ...streaks.map((s) => s.length))} consecutive digits.</p>
            </div>
          </Card>
        </div>

        {/* Live tick stream */}
        <Card className="p-4 bg-card border-border shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Recent Tick Stream</h3>
            <span className="text-[10px] font-mono text-muted-foreground">latest →</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stream.map((d, idx) => {
              const isStreak = streaks.some((s) => idx >= s.start && idx < s.start + s.length);
              return (
                <div key={idx} className={`h-7 w-7 rounded font-mono text-xs grid place-items-center ${
                  isStreak ? "bg-warning/20 text-warning border border-warning/40" : "bg-surface border border-border text-foreground"
                }`}>
                  {d}
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </>
  );
}
