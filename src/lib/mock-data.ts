// Deterministic-ish mock data generators for the trading platform UI.

export type MarketCategory = "Synthetic" | "Forex" | "Crypto" | "Commodities" | "Indices";

export interface Market {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number; // percent
  volume: string;
  bias: "bullish" | "bearish" | "neutral";
}

export const MARKETS: Market[] = [
  { symbol: "R_100", name: "Volatility 100 Index", category: "Synthetic", price: 8421.32, change: 1.24, volume: "1.2M", bias: "bullish" },
  { symbol: "R_75", name: "Volatility 75 Index", category: "Synthetic", price: 412678.90, change: -0.84, volume: "980K", bias: "bearish" },
  { symbol: "R_50", name: "Volatility 50 Index", category: "Synthetic", price: 248.91, change: 0.42, volume: "750K", bias: "neutral" },
  { symbol: "R_25", name: "Volatility 25 Index", category: "Synthetic", price: 567.12, change: 2.11, volume: "620K", bias: "bullish" },
  { symbol: "R_10", name: "Volatility 10 Index", category: "Synthetic", price: 6892.45, change: -0.31, volume: "510K", bias: "neutral" },
  { symbol: "BOOM1000", name: "Boom 1000 Index", category: "Synthetic", price: 14210.55, change: 0.92, volume: "430K", bias: "bullish" },
  { symbol: "CRASH1000", name: "Crash 1000 Index", category: "Synthetic", price: 8745.21, change: -1.45, volume: "412K", bias: "bearish" },
  { symbol: "BOOM500", name: "Boom 500 Index", category: "Synthetic", price: 9421.10, change: 0.55, volume: "380K", bias: "bullish" },
  { symbol: "JD10", name: "Jump 10 Index", category: "Synthetic", price: 21567.30, change: 1.88, volume: "295K", bias: "bullish" },
  { symbol: "JD25", name: "Jump 25 Index", category: "Synthetic", price: 18234.12, change: -0.62, volume: "274K", bias: "neutral" },
  { symbol: "RB100", name: "Range Break 100", category: "Synthetic", price: 5421.78, change: 0.18, volume: "180K", bias: "neutral" },
  { symbol: "EURUSD", name: "Euro / US Dollar", category: "Forex", price: 1.0823, change: 0.12, volume: "4.5B", bias: "neutral" },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", category: "Forex", price: 1.2641, change: -0.34, volume: "2.1B", bias: "bearish" },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", category: "Forex", price: 154.21, change: 0.58, volume: "3.8B", bias: "bullish" },
  { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", category: "Forex", price: 0.6612, change: -0.21, volume: "1.4B", bias: "bearish" },
  { symbol: "BTCUSD", name: "Bitcoin / US Dollar", category: "Crypto", price: 67421.50, change: 3.21, volume: "32B", bias: "bullish" },
  { symbol: "ETHUSD", name: "Ethereum / US Dollar", category: "Crypto", price: 3421.18, change: 2.45, volume: "18B", bias: "bullish" },
  { symbol: "SOLUSD", name: "Solana / US Dollar", category: "Crypto", price: 178.32, change: -1.12, volume: "4.2B", bias: "bearish" },
  { symbol: "XAUUSD", name: "Gold Spot", category: "Commodities", price: 2398.45, change: 0.72, volume: "1.8B", bias: "bullish" },
  { symbol: "XAGUSD", name: "Silver Spot", category: "Commodities", price: 28.41, change: 1.15, volume: "620M", bias: "bullish" },
  { symbol: "WTI", name: "Crude Oil WTI", category: "Commodities", price: 78.32, change: -0.85, volume: "1.2B", bias: "bearish" },
  { symbol: "SPX500", name: "S&P 500 Index", category: "Indices", price: 5421.32, change: 0.42, volume: "—", bias: "bullish" },
  { symbol: "NDX100", name: "Nasdaq 100 Index", category: "Indices", price: 18921.18, change: 0.81, volume: "—", bias: "bullish" },
  { symbol: "GER40", name: "DAX 40 Index", category: "Indices", price: 18432.55, change: -0.18, volume: "—", bias: "neutral" },
];

// Seeded pseudo-random for stable charts.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function generateCandles(symbol: string, count = 80, basePrice = 100): Candle[] {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = mulberry32(seed);
  const candles: Candle[] = [];
  let price = basePrice;
  const now = Date.now();
  for (let i = count; i > 0; i--) {
    const open = price;
    const volatility = basePrice * 0.008;
    const change = (rand() - 0.48) * volatility * 2;
    const close = open + change;
    const high = Math.max(open, close) + rand() * volatility * 0.6;
    const low = Math.min(open, close) - rand() * volatility * 0.6;
    candles.push({
      time: now - i * 60_000,
      open,
      high,
      low,
      close,
      volume: Math.floor(rand() * 1000 + 200),
    });
    price = close;
  }
  return candles;
}

export interface Signal {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  risk: "low" | "medium" | "high";
  timeframe: string;
  createdAt: string;
  status: "active" | "won" | "lost" | "expired";
  reason: string;
}

export const SIGNALS: Signal[] = [
  { id: "s1", symbol: "R_100", side: "BUY", entry: 8420.5, stopLoss: 8390, takeProfit: 8480, confidence: 82, risk: "medium", timeframe: "5m", createdAt: "2 min ago", status: "active", reason: "RSI oversold bounce + EMA9 cross above EMA21" },
  { id: "s2", symbol: "BTCUSD", side: "BUY", entry: 67380, stopLoss: 66800, takeProfit: 68500, confidence: 76, risk: "medium", timeframe: "1h", createdAt: "12 min ago", status: "active", reason: "Bullish MACD divergence on 1h timeframe" },
  { id: "s3", symbol: "EURUSD", side: "SELL", entry: 1.0825, stopLoss: 1.0850, takeProfit: 1.0780, confidence: 68, risk: "low", timeframe: "15m", createdAt: "28 min ago", status: "active", reason: "Rejection at key resistance, bearish engulfing candle" },
  { id: "s4", symbol: "BOOM1000", side: "BUY", entry: 14180, stopLoss: 14100, takeProfit: 14350, confidence: 71, risk: "high", timeframe: "5m", createdAt: "45 min ago", status: "won", reason: "Spike pattern detected after consolidation" },
  { id: "s5", symbol: "XAUUSD", side: "BUY", entry: 2392.10, stopLoss: 2382, takeProfit: 2412, confidence: 79, risk: "low", timeframe: "1h", createdAt: "1 hr ago", status: "won", reason: "Bullish flag breakout with volume confirmation" },
  { id: "s6", symbol: "GBPUSD", side: "SELL", entry: 1.2658, stopLoss: 1.2685, takeProfit: 1.2610, confidence: 64, risk: "medium", timeframe: "15m", createdAt: "2 hr ago", status: "lost", reason: "Lower high formation at trend resistance" },
  { id: "s7", symbol: "ETHUSD", side: "BUY", entry: 3398, stopLoss: 3360, takeProfit: 3470, confidence: 73, risk: "medium", timeframe: "4h", createdAt: "3 hr ago", status: "won", reason: "Cup and handle breakout on 4h" },
  { id: "s8", symbol: "CRASH1000", side: "SELL", entry: 8780, stopLoss: 8820, takeProfit: 8700, confidence: 70, risk: "high", timeframe: "5m", createdAt: "4 hr ago", status: "won", reason: "Crash pattern signal after exhaustion" },
];

// Digit analysis: last digits 0-9 frequency
export function generateDigitFrequency(seed = 1): { digit: number; count: number; percent: number }[] {
  const rand = mulberry32(seed);
  const total = 1000;
  const raw = Array.from({ length: 10 }, () => Math.floor(rand() * 100) + 60);
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((c, i) => ({
    digit: i,
    count: Math.floor((c / sum) * total),
    percent: (c / sum) * 100,
  }));
}

export function generateDigitStream(length = 30, seed = 7): number[] {
  const rand = mulberry32(seed);
  return Array.from({ length }, () => Math.floor(rand() * 10));
}

// Indicator mock outputs
export interface IndicatorReading {
  name: string;
  value: string;
  signal: "buy" | "sell" | "neutral";
  detail: string;
}

export const INDICATORS: IndicatorReading[] = [
  { name: "RSI (14)", value: "62.4", signal: "neutral", detail: "Approaching overbought" },
  { name: "MACD", value: "+0.42", signal: "buy", detail: "Bullish crossover confirmed" },
  { name: "Bollinger Bands", value: "Upper", signal: "neutral", detail: "Price riding upper band" },
  { name: "EMA 9 / 21", value: "Above", signal: "buy", detail: "Short-term trend bullish" },
  { name: "EMA 50 / 200", value: "Above", signal: "buy", detail: "Long-term uptrend intact" },
  { name: "Stochastic", value: "78 / 71", signal: "sell", detail: "Overbought, watch reversal" },
  { name: "ATR (14)", value: "12.4", signal: "neutral", detail: "Volatility expanding" },
  { name: "SMA 50", value: "8412.10", signal: "buy", detail: "Price above SMA 50" },
];

export interface Pattern {
  name: string;
  type: "breakout" | "reversal" | "consolidation" | "continuation";
  symbol: string;
  timeframe: string;
  confidence: number;
}

export const PATTERNS: Pattern[] = [
  { name: "Bullish Flag", type: "continuation", symbol: "R_100", timeframe: "5m", confidence: 84 },
  { name: "Double Bottom", type: "reversal", symbol: "EURUSD", timeframe: "15m", confidence: 72 },
  { name: "Ascending Triangle", type: "breakout", symbol: "BTCUSD", timeframe: "1h", confidence: 78 },
  { name: "Head & Shoulders", type: "reversal", symbol: "GBPUSD", timeframe: "1h", confidence: 65 },
  { name: "Symmetrical Triangle", type: "consolidation", symbol: "XAUUSD", timeframe: "4h", confidence: 70 },
  { name: "Cup & Handle", type: "continuation", symbol: "ETHUSD", timeframe: "4h", confidence: 81 },
  { name: "Bullish Engulfing", type: "reversal", symbol: "BOOM1000", timeframe: "5m", confidence: 76 },
];

export interface PerformancePoint {
  date: string;
  wins: number;
  losses: number;
  accuracy: number;
}

export const PERFORMANCE: PerformancePoint[] = [
  { date: "Mon", wins: 12, losses: 5, accuracy: 70.6 },
  { date: "Tue", wins: 14, losses: 4, accuracy: 77.8 },
  { date: "Wed", wins: 9, losses: 7, accuracy: 56.3 },
  { date: "Thu", wins: 16, losses: 3, accuracy: 84.2 },
  { date: "Fri", wins: 11, losses: 6, accuracy: 64.7 },
  { date: "Sat", wins: 13, losses: 5, accuracy: 72.2 },
  { date: "Sun", wins: 15, losses: 4, accuracy: 78.9 },
];
