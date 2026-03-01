"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  ResponsiveContainer
} from "recharts";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [btcData, setBtcData] = useState([]);
  const [btcInfo, setBtcInfo] = useState(null);
  const chatEndRef = useRef(null);

  // Boot animation
  useEffect(() => {
    setTimeout(() => {
      setBooting(false);
      setMessages([
        {
          role: "agent",
          content:
            "🧠 DAFALABS Web3 Intelligence Terminal Online.\nReal-time market engine connected with OHLC data.",
        },
      ]);
    }, 2000);
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  // Fetch BTC real-time data
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        // Fetch BTC price and data
        const priceRes = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin"
        );
        const priceData = await priceRes.json();

        setBtcInfo({
          price: priceData.market_data.current_price.usd,
          change: priceData.market_data.price_change_percentage_24h,
          volume: priceData.market_data.total_volume.usd,
        });

        // Fetch BTC OHLC data (Candlestick data)
        const chartRes = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1"
        );
        const chartData = await chartRes.json();

        const formatted = chartData.map((c) => ({
          time: new Date(c[0]).toLocaleTimeString(),
          open: c[1],
          high: c[2],
          low: c[3],
          close: c[4],
        }));

        setBtcData(formatted);
      } catch (err) {
        console.error("Market fetch error", err);
      }
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  // Risk Scoring Engine
  const analyzeRisk = (data) => {
    const liquidity = data.liquidity.usd;
    const volume = data.volume.h24;
    const priceChange = data.price_change_percentage_24h;

    let riskScore = "Medium";

    if (liquidity > 1000000 && volume > 1000000 && Math.abs(priceChange) < 5) {
      riskScore = "Low";
    } else if (liquidity < 500000 || volume < 500000 || Math.abs(priceChange) > 20) {
      riskScore = "High";
    }

    return `Risk Assessment: ${riskScore}`;
  };

  // Whale Tracking
  const checkWhaleTransactions = (data) => {
    const volume = data.pairs[0].volume.h24;

    if (volume > 1000000) {
      return `🚨 ALERT: Whale detected! Large transaction volume: $${volume.toLocaleString()}`;
    }
    return "No whale activity detected.";
  };

  // Typing effect
  const streamResponse = (text) => {
    setIsThinking(true);
    setStreamText("");
    let index = 0;

    const interval = setInterval(() => {
      setStreamText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "agent", content: text }]);
          setStreamText("");
          setIsThinking(false);
        }, 300);
      }
    }, 10);
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userInput = input;
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");

    streamResponse("Processing intelligence request...");
  };

  // Generate response for contract and queries
  const generateResponse = async (prompt) => {
    const trimmed = prompt.trim().toLowerCase();

    // CONTRACT SCAN
    if (/^0x[a-fA-F0-9]{40}$/.test(prompt.trim())) {
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${prompt}`
        );
        const data = await res.json();

        if (!data.pairs || data.pairs.length === 0) {
          return `No liquidity data detected on DexScreener.

Recommendation:
• Verify chain
• Confirm contract authenticity
• Check official website manually`;
        }

        const pair = data.pairs[0];

        return `🧠 DAFALABS CONTRACT INTELLIGENCE REPORT

Executive Summary:
${pair.baseToken.name} (${pair.baseToken.symbol}) is actively traded on ${pair.dexId} (${pair.chainId}).

Market Metrics:
• Price: $${pair.priceUsd}
• 24h Volume: $${pair.volume.h24?.toLocaleString()}
• Liquidity: $${pair.liquidity.usd?.toLocaleString()}

Social Presence:
• Website: ${pair.info?.websites?.[0]?.url || "Not listed"}
• Twitter: ${
          pair.info?.socials?.find((s) => s.type === "twitter")?.url ||
          "Not listed"
        }
• Telegram: ${pair.info?.socials?.find((s) => s.type === "telegram")?.url || "Not listed"}

Liquidity Analysis:
${
          pair.liquidity.usd > 1000000
            ? "Healthy liquidity structure."
            : "Liquidity depth is limited — higher volatility risk."
        }

Professional Insight:
Always validate contract from official sources before capital allocation.`;
      } catch {
        return "DexScreener intelligence engine failed.";
      }
    }

    // COMMUNITY STRATEGY
    if (trimmed.includes("community")) {
      return `🧠 WEB3 COMMUNITY STRATEGY FRAMEWORK

Executive Perspective:
Community is not marketing — it is liquidity defense.

Phase 1 — Narrative Control:
• Define positioning
• Build conviction
• Communicate mission clearly

Phase 2 — Core Believers:
• Private alpha channels
• Ambassador program
• Incentivized engagement

Phase 3 — Expansion:
• Strategic KOL alignment
• Consistent roadmap updates
• Transparent communication

Key Principle:
Organic trust outperforms artificial hype cycles.`;
    }

    // TOKEN PROJECT STRATEGY
    if (trimmed.includes("project") || trimmed.includes("proyek")) {
      return `🧠 WEB3 PROJECT SUCCESS MODEL

Foundation:
1. Real problem solving
2. Sustainable tokenomics
3. Clear value accrual mechanism

Execution:
• VC & strategic alignment
• Audit credibility
• Liquidity planning
• Vesting discipline

Failure Pattern:
Most projects fail from poor treasury management and over-emission.

Professional Conclusion:
Long-term valuation follows real utility, not narrative spikes.`;
    }

    // AIRDROP STRATEGY
    if (trimmed.includes("airdrop")) {
      return `🧠 AIRDROP INTELLIGENCE PLAYBOOK

Primary Platforms:
• https://layer3.xyz
• https://galxe.com
• https://zealy.io
• https://coinmarketcap.com/airdrop/

Strategic Approach:
1. Focus on VC-backed ecosystems
2. Interact consistently (bridge, swap, vote)
3. Participate in governance
4. Maintain on-chain footprint

Edge Strategy:
Consistency > multi-wallet spam.

Airdrops reward usage history, not speculation.`;
    }

    // MARKET ANALYSIS
    if (trimmed.includes("market") || trimmed.includes("bull") || trimmed.includes("bear")) {
      return `🧠 MARKET STRUCTURE ANALYSIS

Current Environment:
Liquidity rotating toward high-conviction narratives.

Indicators:
• Stablecoin inflow increasing
• BTC dominance stabilizing
• AI & infrastructure sectors gaining attention

Macro Insight:
Market cycles reward builders before speculators.

Professional View:
Focus on fundamentals during volatility expansion phases.`;
    }

    return `🧠 DAFALABS WEB3 INTELLIGENCE READY

Capabilities:
• Contract liquidity analysis
• Web3 growth strategy
• Token launch modeling
• Airdrop intelligence
• Market structure insight

Ask with precision for deeper analysis.`;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatePresence>
        {booting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black flex items-center justify-center z-50 tracking-[6px]"
          >
            INITIALIZING DAFALABS AI CORE...
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white rounded-full blur-[200px] opacity-10"
      />

      <div className="relative z-10 p-6 md:p-16">
        <h1 className="tracking-[8px] text-xl mb-8">DAFALABS</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {/* CHAT */}
          <div className="md:col-span-2 bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6">
            <div className="h-[400px] overflow-y-auto mb-6 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="text-left">
                  <div className="inline-block px-4 py-3 rounded-2xl border bg-zinc-900 border-zinc-800 whitespace-pre-line">
                    {msg.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="inline-block px-4 py-3 rounded-2xl border bg-zinc-900 border-zinc-800">
                  {streamText}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Paste contract address or ask Web3 strategy..."
              className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl"
            />
          </div>

          {/* MARKET TERMINAL */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-zinc-400">Market Terminal</h3>

            {btcInfo && (
              <>
                <div>
                  <p className="text-lg font-semibold">
                    BTC — ${btcInfo.price.toLocaleString()}
                  </p>
                  <p
                    className={
                      btcInfo.change > 0
                        ? "text-green-400 text-sm"
                        : "text-red-400 text-sm"
                    }
                  >
                    {btcInfo.change.toFixed(2)}%
                  </p>
                  <p className="text-zinc-500 text-xs">
                    Volume: ${btcInfo.volume.toLocaleString()}
                  </p>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={btcData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                      }}
                    >
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Legend />
                      <Bar dataKey="open" fill="#8884d8" barSize={5} />
                      <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-xs text-zinc-600">
                  Source: CoinGecko API (Real-time 60s refresh)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
