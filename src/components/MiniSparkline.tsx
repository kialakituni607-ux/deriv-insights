import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { generateCandles } from "@/lib/mock-data";

export function MiniSparkline({ symbol, bullish, basePrice = 100 }: { symbol: string; bullish: boolean; basePrice?: number }) {
  const data = generateCandles(symbol, 30, basePrice).map((c) => ({ v: c.close }));
  const color = bullish ? "var(--bull)" : "var(--bear)";
  const id = `spark-${symbol}`;
  return (
    <div className="h-9 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${id})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
