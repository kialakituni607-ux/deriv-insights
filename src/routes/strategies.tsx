import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Repeat, Clock, Scale, Shuffle, Grid3x3, Gauge,
  Activity, ShieldCheck, Layers, CheckCircle2, Bot, Sparkles, AlertTriangle,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/strategies")({
  head: () => ({
    meta: [
      { title: "Strategies — ANTIPOVERTY AI Analysis" },
      { name: "description", content: "12 digit-trading strategies for Deriv volatility indices: trend bias, streaks, frequency imbalance, Differs anti-repeat, pattern recognition, martingale, bot statistical and more." },
    ],
  }),
  component: StrategiesPage,
});

type Strategy = {
  id: number;
  title: string;
  icon: typeof TrendingUp;
  tag: string;
  tagTone: "bull" | "bear" | "warning" | "info" | "primary";
  summary: string;
  worksOn: string[];
  rules: string[];
  example?: string;
  risk?: string;
};

const STRATEGIES: Strategy[] = [
  {
    id: 1,
    title: "Trend / Frequency Bias",
    icon: TrendingUp,
    tag: "Momentum / Mean Reversion",
    tagTone: "primary",
    summary: "Track the last 20–100 digits and count frequency. Trade with momentum (continuation) or against it (mean reversion).",
    worksOn: ["Even/Odd", "Over/Under", "Differs"],
    rules: [
      "Sample window: last 20–100 ticks",
      "Count digits / properties (Even, Odd, Over N, Under N)",
      "Mean reversion: trade the lagging side expecting balance",
      "Momentum: trade the dominant side",
    ],
    example: "Last 50 ticks → Even = 34, Odd = 16. Reversion player buys Odd; momentum player keeps buying Even.",
    risk: "Streaks can continue much longer than expected.",
  },
  {
    id: 2,
    title: "Last Digit Streak",
    icon: Repeat,
    tag: "Reversal",
    tagTone: "warning",
    summary: "Wait for repeated digits or properties, then enter on expected exhaustion / reversal.",
    worksOn: ["Over/Under", "Even/Odd", "Differs"],
    rules: [
      "Enter after a 3–6 streak",
      "1–3 tick contract duration",
      "One entry per streak — no chasing",
    ],
    example: "5 consecutive Even → buy Odd. 4 consecutive Under 5 → buy Over 5.",
  },
  {
    id: 3,
    title: "Delay / Skip",
    icon: Clock,
    tag: "Patience",
    tagTone: "info",
    summary: "Don't trade every tick. Watch and only enter when a clear setup appears.",
    worksOn: ["All digit contracts"],
    rules: [
      "Observe 10–30 ticks before any entry",
      "Trade only on: 4 Odds in a row, 3 digits under barrier, repeated digit patterns",
      "Reduces overtrading and emotional entries",
    ],
  },
  {
    id: 4,
    title: "Frequency Imbalance",
    icon: Scale,
    tag: "Over/Under",
    tagTone: "primary",
    summary: "Pick a barrier (3, 4, 5, 6) and compare Over vs Under counts in the recent window.",
    worksOn: ["Over/Under"],
    rules: [
      "Choose barrier (commonly 5)",
      "Count Over N and Under N in last 30 ticks",
      "Reversion: buy the under-represented side",
      "Continuation: buy the dominant side if momentum is strong",
    ],
    example: "Last 30 ticks → Over 5 = 22, Under 5 = 8. Reversion buys Under; momentum buys Over.",
  },
  {
    id: 5,
    title: "Differs Anti-Repeat",
    icon: Shuffle,
    tag: "Differs",
    tagTone: "bull",
    summary: "After repeated digits appear, buy Differs — exact-repeat probability is lower than non-repeat.",
    worksOn: ["Differs"],
    rules: [
      "Watch for 2+ recent repeats",
      "Buy Differs from the most recent digit",
      "1 tick duration is standard",
    ],
    example: "Recent: 7, 7, 3, 4 → buy Differs from last digit.",
    risk: "Payout is adjusted to match the lower probability.",
  },
  {
    id: 6,
    title: "Pattern Recognition",
    icon: Grid3x3,
    tag: "Sequence",
    tagTone: "info",
    summary: "Look for repeating sequences (1,3,1,3 / alternating Even-Odd / clustering) and predict continuation or break.",
    worksOn: ["Even/Odd", "Over/Under", "Matches/Differs"],
    rules: [
      "Identify 4+ tick repeating sequences",
      "Predict next element in the sequence",
      "Stop after one break of the pattern",
    ],
    example: "Even, Odd, Even, Odd → buy Even.",
    risk: "Speculative — patterns in random data are coincidental.",
  },
  {
    id: 7,
    title: "Volatility Timing",
    icon: Gauge,
    tag: "Market Selection",
    tagTone: "primary",
    summary: "Choose the right synthetic index for your style. 1s indices are fast and noisy; standard R_ are slower and cleaner.",
    worksOn: ["Index selection"],
    rules: [
      "1HZ (1s): fast scalping, high frequency",
      "R_ standard: slower, better for analysis",
      "Boom/Crash 1000: spike strategies, not digit trading",
      "Avoid 1s if you can't read fast charts",
    ],
  },
  {
    id: 8,
    title: "Session Adaptation",
    icon: Activity,
    tag: "Adaptive",
    tagTone: "warning",
    summary: "Match the strategy to the current market rhythm — don't force one approach into all conditions.",
    worksOn: ["All contracts"],
    rules: [
      "Balanced market → avoid mean-reversion entries",
      "One-sided market → use trend or streak system",
      "Re-evaluate every 50–100 ticks",
    ],
    example: "Trending = momentum. Balanced = reversal.",
  },
  {
    id: 9,
    title: "Fixed Stake Risk Management",
    icon: ShieldCheck,
    tag: "Risk Control",
    tagTone: "bull",
    summary: "Constant stake per trade with hard stop-loss and daily profit caps. Boring but survivable.",
    worksOn: ["Any strategy"],
    rules: [
      "Fixed stake per trade (e.g. $1)",
      "Stop after 2–5 consecutive losses",
      "Daily profit cap (e.g. +5 units)",
      "Walk away when limits hit",
    ],
    example: "Stake $1 → stop after 3 losses, take profit at +5 units.",
  },
  {
    id: 10,
    title: "Controlled Martingale / Recovery",
    icon: Layers,
    tag: "High Risk",
    tagTone: "bear",
    summary: "Multiply stake after losses (1, 2.2, 5, 11…). Only with strict step limits — account blow-up risk is real.",
    worksOn: ["Any binary contract"],
    rules: [
      "Max 2–3 recovery steps",
      "Reset to base stake after any win",
      "Never exceed pre-defined daily loss",
    ],
    risk: "Mathematically dangerous. A long losing streak wipes the account.",
  },
  {
    id: 11,
    title: "Confirmation Strategy",
    icon: CheckCircle2,
    tag: "Selective",
    tagTone: "bull",
    summary: "Require multiple independent conditions before entry. Lower frequency, higher selectivity.",
    worksOn: ["Over/Under", "Even/Odd", "Differs"],
    rules: [
      "Require 2–3 confirming signals",
      "Skip the trade if any signal is missing",
      "Track win rate per condition combo",
    ],
    example: "Buy Over 5 only when: 4 consecutive Under, Under freq >70% in last 20, no recent Over streak.",
  },
  {
    id: 12,
    title: "Bot-Based Statistical",
    icon: Bot,
    tag: "Algorithmic",
    tagTone: "primary",
    summary: "Bots score setups using digit frequency, entropy, streak length and transition probabilities — entering only on anomalies.",
    worksOn: ["All digit contracts"],
    rules: [
      "Track tick history, frequency, entropy, streaks, transition matrix",
      "Score setups numerically",
      "Trade only when: repeat-probability anomaly, cluster imbalance, or streak threshold met",
    ],
    example: "Used by most advanced Deriv bots for systematic entries.",
  },
];

const TONE: Record<Strategy["tagTone"], string> = {
  bull: "border-bull/30 bg-bull/10 text-bull",
  bear: "border-bear/30 bg-bear/10 text-bear",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
  primary: "border-primary/30 bg-primary/10 text-primary",
};

function StrategiesPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <AppHeader title="Strategies" subtitle="12 digit-trading playbooks for Deriv volatility indices" />
      <main className="flex-1 p-3 sm:p-5 space-y-4">
        {/* Combo callout */}
        <Card className="p-4 bg-card border-primary/30 shadow-card">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/15 border border-primary/30 grid place-items-center shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">Practical Combo</h3>
                <Badge variant="outline" className="font-mono text-[10px] border-bull/30 text-bull">Most used</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Watch the last 50 digits → detect a streak of 4+ → trade the reversal once → fixed stake → stop after 2 losses.
                Example: 5 Even in a row → buy Odd, one entry only.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {STRATEGIES.map((s) => {
            const Icon = s.icon;
            const isOpen = active === s.id;
            return (
              <Card
                key={s.id}
                onClick={() => setActive(isOpen ? null : s.id)}
                className={`p-4 bg-card border-border shadow-card cursor-pointer transition-all hover:border-primary/40 ${
                  isOpen ? "border-primary/50 shadow-glow" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-surface border border-border grid place-items-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground">#{String(s.id).padStart(2, "0")}</div>
                      <h3 className="font-semibold text-sm leading-tight">{s.title}</h3>
                    </div>
                  </div>
                  <Badge variant="outline" className={`font-mono text-[10px] ${TONE[s.tagTone]}`}>{s.tag}</Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{s.summary}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {s.worksOn.map((w) => (
                    <span key={w} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                      {w}
                    </span>
                  ))}
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-border space-y-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mb-1.5">Rules</div>
                      <ul className="space-y-1">
                        {s.rules.map((r, i) => (
                          <li key={i} className="text-xs flex items-start gap-2">
                            <span className="text-primary mt-1">▸</span>
                            <span className="text-foreground">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {s.example && (
                      <div className="rounded-md border border-info/30 bg-info/5 p-2.5">
                        <div className="text-[10px] uppercase tracking-wider font-mono text-info mb-1">Example</div>
                        <p className="text-xs text-foreground leading-relaxed">{s.example}</p>
                      </div>
                    )}
                    {s.risk && (
                      <div className="rounded-md border border-warning/30 bg-warning/5 p-2.5 flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed"><span className="text-warning font-semibold">Risk:</span> {s.risk}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 text-[10px] font-mono text-muted-foreground">
                  {isOpen ? "Click to collapse ▲" : "Click to expand ▼"}
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-4 bg-card border-warning/30 shadow-card">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              These strategies describe what traders <em>do</em> — they are not financial advice. Synthetic indices are random by design;
              no strategy guarantees profit. Always combine with strict risk management.
            </p>
          </div>
        </Card>
      </main>
    </>
  );
}
