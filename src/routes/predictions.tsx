import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MARKETS } from "@/lib/mock-data";
import { Brain, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from "recharts";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Predictions — Quantix" },
      { name: "description", content: "Probability-based short-term direction predictions with confidence scoring and volatility outlook." },
    ],
  }),
  component: PredictionsPage,
});

interface Prediction {
  symbol: string;
  name: string;
  upProb: number;
  downProb: number;
  bias: "bullish" | "bearish" | "neutral";
  volatility: "expanding" | "contracting" | "stable";
  confidence: number;
  horizon: string;
}

const PREDICTIONS: Prediction[] = MARKETS.slice(0, 8).map((m, i) => {
  const seed = i * 13 + 7;
  const up = 35 + (seed % 50);
  return {
    symbol: m.symbol,
    name: m.name,
    upProb: up,
    downProb: 100 - up,
    bias: up > 58 ? "bullish" : up < 42 ? "bearish" : "neutral",
    volatility: ["expanding", "contracting", "stable"][i % 3] as Prediction["volatility"],
    confidence: 55 + (seed % 35),
    horizon: ["5 min", "15 min", "1 hour", "4 hours"][i % 4],
  };
});

function PredictionsPage() {
  return (
    <>
      <AppHeader title="Predictions" subtitle="Probability-based short-term direction" />
      <main className="flex-1 p-3 sm:p-5 space-y-4">
        <Card className="p-4 bg-card border-border shadow-card">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-md gradient-primary grid place-items-center shadow-glow shrink-0">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Model output is probabilistic, not a guarantee.</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                Predictions blend price action, momentum and volatility regime. Confidence reflects model agreement — never a profit promise.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PREDICTIONS.map((p) => <PredictionCard key={p.symbol} p={p} />)}
        </div>
      </main>
    </>
  );
}

function PredictionCard({ p }: { p: Prediction }) {
  const dominant = p.upProb >= p.downProb ? p.upProb : p.downProb;
  const dominantColor = p.upProb >= p.downProb ? "var(--bull)" : "var(--bear)";
  const data = [{ name: "prob", value: dominant, fill: dominantColor }];

  const biasIcon = p.bias === "bullish" ? <TrendingUp className="h-3 w-3" /> : p.bias === "bearish" ? <TrendingDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />;
  const biasClass = p.bias === "bullish" ? "border-bull/40 text-bull bg-bull/10" : p.bias === "bearish" ? "border-bear/40 text-bear bg-bear/10" : "border-border text-muted-foreground bg-muted/30";

  return (
    <Card className="p-4 bg-card border-border shadow-card hover:border-primary/30 transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-mono font-bold text-sm">{p.symbol}</div>
          <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">{p.name}</div>
        </div>
        <Badge variant="outline" className={`text-[10px] font-mono uppercase ${biasClass}`}>
          {biasIcon} {p.bias}
        </Badge>
      </div>

      <div className="relative h-32 -my-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "var(--muted)" }} dataKey="value" cornerRadius={6} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-mono font-bold tabular" style={{ color: dominantColor }}>
            {dominant.toFixed(0)}%
          </div>
          <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            {p.upProb >= p.downProb ? "UP probability" : "DOWN probability"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="rounded-md bg-bull/10 border border-bull/20 p-2">
          <div className="text-[10px] font-mono text-muted-foreground">UP</div>
          <div className="font-mono text-bull font-semibold">{p.upProb}%</div>
        </div>
        <div className="rounded-md bg-bear/10 border border-bear/20 p-2">
          <div className="text-[10px] font-mono text-muted-foreground">DOWN</div>
          <div className="font-mono text-bear font-semibold">{p.downProb}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] font-mono">
        <span className="text-muted-foreground">Vol: <span className="text-foreground capitalize">{p.volatility}</span></span>
        <span className="text-muted-foreground">Horizon: <span className="text-foreground">{p.horizon}</span></span>
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
          <span>Model confidence</span>
          <span className="text-primary">{p.confidence}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full gradient-primary" style={{ width: `${p.confidence}%` }} />
        </div>
      </div>
    </Card>
  );
}
