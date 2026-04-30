import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MARKETS, type MarketCategory } from "@/lib/mock-data";
import { MiniSparkline } from "@/components/MiniSparkline";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — Quantix" },
      { name: "description", content: "Browse Deriv synthetic indices, forex, crypto, commodities and stock indices with live mini-charts." },
    ],
  }),
  component: MarketsPage,
});

const CATEGORIES: ("All" | MarketCategory)[] = ["All", "Synthetic", "Forex", "Crypto", "Commodities", "Indices"];

function MarketsPage() {
  const [cat, setCat] = useState<"All" | MarketCategory>("All");
  const [q, setQ] = useState("");

  const filtered = MARKETS.filter((m) => (cat === "All" || m.category === cat) && (q === "" || m.symbol.toLowerCase().includes(q.toLowerCase()) || m.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <AppHeader title="Markets" subtitle={`${MARKETS.length} instruments tracked`} />
      <main className="flex-1 p-3 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search symbol or name…" className="pl-9 bg-surface border-border" />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                cat === c ? "bg-primary/15 text-primary border border-primary/30" : "bg-surface text-muted-foreground border border-border hover:text-foreground"
              }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-card border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface/60 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2.5">Symbol</th>
                  <th className="text-left px-4 py-2.5 hidden md:table-cell">Name</th>
                  <th className="text-left px-4 py-2.5 hidden lg:table-cell">Category</th>
                  <th className="text-right px-4 py-2.5">Price</th>
                  <th className="text-right px-4 py-2.5">24h %</th>
                  <th className="text-right px-4 py-2.5 hidden sm:table-cell">Trend</th>
                  <th className="text-right px-4 py-2.5 hidden xl:table-cell">Volume</th>
                  <th className="text-right px-4 py-2.5">Bias</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.symbol} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{m.symbol}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{m.name}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{m.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular text-xs">{m.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    <td className={`px-4 py-3 text-right font-mono text-xs ${m.change >= 0 ? "text-bull" : "text-bear"}`}>
                      {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex justify-end">
                        <MiniSparkline symbol={m.symbol} bullish={m.change >= 0} basePrice={m.price} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground hidden xl:table-cell">{m.volume}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="outline" className={`text-[10px] font-mono ${
                        m.bias === "bullish" ? "border-bull/40 text-bull" : m.bias === "bearish" ? "border-bear/40 text-bear" : "border-border text-muted-foreground"
                      }`}>
                        {m.bias}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">No markets match your filters.</div>
            )}
          </div>
        </Card>
      </main>
    </>
  );
}
