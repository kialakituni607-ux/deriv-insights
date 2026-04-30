import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateCandles, type Candle } from "@/lib/mock-data";

interface Props {
  symbol: string;
  basePrice?: number;
  height?: number;
  showVolume?: boolean;
}

export function CandleChart({ symbol, basePrice = 100, height = 360, showVolume = true }: Props) {
  const candles: Candle[] = useMemo(() => generateCandles(symbol, 80, basePrice), [symbol, basePrice]);

  const data = candles.map((c) => ({
    t: new Date(c.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    open: c.open,
    close: c.close,
    high: c.high,
    low: c.low,
    volume: c.volume,
    range: [c.low, c.high] as [number, number],
    body: [Math.min(c.open, c.close), Math.max(c.open, c.close)] as [number, number],
    bullish: c.close >= c.open,
  }));

  const last = candles[candles.length - 1];
  const ema = (() => {
    const period = 21;
    const k = 2 / (period + 1);
    let prev = candles[0].close;
    return candles.map((c, i) => {
      if (i === 0) return prev;
      prev = c.close * k + prev * (1 - k);
      return prev;
    });
  })();
  const dataWithEma = data.map((d, i) => ({ ...d, ema: ema[i] }));

  return (
    <div className="w-full">
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataWithEma} margin={{ top: 8, right: 48, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} interval={Math.floor(data.length / 8)} />
            <YAxis
              orientation="right"
              domain={["auto", "auto"]}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => Number(v).toFixed(basePrice < 10 ? 4 : 2)}
            />
            <Tooltip
              cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "3 3" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
              formatter={(value: any, name) => {
                if (name === "range" || name === "body") return null;
                return [typeof value === "number" ? value.toFixed(basePrice < 10 ? 4 : 2) : value, name];
              }}
            />
            {/* Wick */}
            <Bar dataKey="range" barSize={1} isAnimationActive={false}>
              {dataWithEma.map((d, i) => (
                <Cell key={i} fill={d.bullish ? "var(--bull)" : "var(--bear)"} />
              ))}
            </Bar>
            {/* Body */}
            <Bar dataKey="body" barSize={5} isAnimationActive={false}>
              {dataWithEma.map((d, i) => (
                <Cell key={i} fill={d.bullish ? "var(--bull)" : "var(--bear)"} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="ema" stroke="var(--primary)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {showVolume && (
        <div style={{ height: 70 }} className="mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
              <XAxis dataKey="t" hide />
              <YAxis orientation="right" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={56} />
              <Bar dataKey="volume" isAnimationActive={false}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.bullish ? "var(--bull)" : "var(--bear)"} fillOpacity={0.45} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] font-mono text-muted-foreground">
        <span>O <span className="text-foreground">{last.open.toFixed(basePrice < 10 ? 4 : 2)}</span></span>
        <span>H <span className="text-bull">{last.high.toFixed(basePrice < 10 ? 4 : 2)}</span></span>
        <span>L <span className="text-bear">{last.low.toFixed(basePrice < 10 ? 4 : 2)}</span></span>
        <span>C <span className="text-foreground">{last.close.toFixed(basePrice < 10 ? 4 : 2)}</span></span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-3 bg-primary inline-block rounded-sm" /> EMA 21
        </span>
      </div>
    </div>
  );
}
