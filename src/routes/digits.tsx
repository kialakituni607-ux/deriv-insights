import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateDigitFrequency, generateDigitStream } from "@/lib/mock-data";
import { Flame, Snowflake, AlertCircle, Target, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/digits")({
  head: () => ({
    meta: [
      { title: "Digits Analysis — Quantix" },
      { name: "description", content: "Last digit frequency, hot/cold digits, streak detection, predictions for Over/Under, Differs/Matches, Rise/Fall, Even/Odd on Deriv volatility indices." },
    ],
  }),
  component: DigitsPage,
});

const SYMBOLS = [
  "R_10", "R_25", "R_50", "R_75", "R_100",
  "1HZ10V", "1HZ25V", "1HZ50V", "1HZ75V", "1HZ100V",
  "1HZ150V", "1HZ200V", "1HZ250V", "1HZ300V",
];

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

  // ===== Predictions =====
  // Over N: probability digit > N (digits 0-9). Best contract = max prob across barriers 0..8
  // Under N: probability digit < N. Best contract = max across barriers 1..9
  const totalCount = freq.reduce((a, f) => a + f.count, 0) || 1;
  const pct = (n: number) => (n / totalCount) * 100;

  const overOptions = [1, 2, 3, 4].map((b) => ({
    barrier: b,
    prob: pct(freq.filter((f) => f.digit > b).reduce((a, f) => a + f.count, 0)),
  }));
  const underOptions = [6, 7, 8].map((b) => ({
    barrier: b,
    prob: pct(freq.filter((f) => f.digit < b).reduce((a, f) => a + f.count, 0)),
  }));
  const bestOver = overOptions.reduce((a, b) => (b.prob > a.prob ? b : a));
  const bestUnder = underOptions.reduce((a, b) => (b.prob > a.prob ? b : a));

  // Matches/Differs: pick the most/least frequent digit
  const sortedFreq = [...freq].sort((a, b) => b.count - a.count);
  const matchesPick = sortedFreq[0]; // highest prob digit to "Match"
  const differsPick = sortedFreq[sortedFreq.length - 1]; // best digit to "Differ" (lowest prob ⇒ high differ chance)
  const differProb = 100 - differsPick.percent;

  // Even / Odd
  const evenProb = pct(freq.filter((f) => f.digit % 2 === 0).reduce((a, f) => a + f.count, 0));
  const oddProb = 100 - evenProb;

  // Rise / Fall — derived from last 20 ticks momentum
  const recent = stream.slice(-20);
  let rises = 0;
  for (let k = 1; k < recent.length; k++) if (recent[k] > recent[k - 1]) rises++;
  const riseProb = (rises / (recent.length - 1)) * 100;
  const fallProb = 100 - riseProb;

  // Best overall recommendation
  const allPredictions = [
    { type: "Over", label: `Over ${bestOver.barrier}`, prob: bestOver.prob, dir: "up" as const },
    { type: "Under", label: `Under ${bestUnder.barrier}`, prob: bestUnder.prob, dir: "down" as const },
    { type: "Differs", label: `Differs ${differsPick.digit}`, prob: differProb, dir: "up" as const },
    { type: "Matches", label: `Matches ${matchesPick.digit}`, prob: matchesPick.percent, dir: "up" as const },
    { type: "Even/Odd", label: evenProb >= oddProb ? "Even" : "Odd", prob: Math.max(evenProb, oddProb), dir: "up" as const },
    { type: "Rise/Fall", label: riseProb >= fallProb ? "Rise" : "Fall", prob: Math.max(riseProb, fallProb), dir: riseProb >= fallProb ? "up" as const : "down" as const },
  ];
  const bestOverall = allPredictions.reduce((a, b) => (b.prob > a.prob ? b : a));

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
