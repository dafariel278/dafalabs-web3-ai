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
            "🧠 DAFALABS Web3 Intelligence Core Online.\nInstitutional-grade crypto analysis engine initialized.",
        },
      ]);
    }, 2500);
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
    }, 12);
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userInput = input;
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");

    streamResponse("Analyzing on-chain structures...\n");

    setTimeout(async () => {
      const response = await generateResponse(userInput);
      streamResponse(response);
    }, 1200);
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
      return `🧠 WEB3 COMMUNITY ARCHITECTURE

Phase 1 — Narrative Positioning
Phase 2 — Core Alpha Group
Phase 3 — Strategic Amplification

Key Principle:
Community is liquidity defense, not marketing.

Professional Insight:
Trust compounds faster than hype.`;
    }

    // TOKEN PROJECT STRATEGY
    if (trimmed.includes("project") || trimmed.includes("proyek")) {
      return `🧠 TOKEN PROJECT SUCCESS FRAMEWORK

Foundation:
• Real utility
• Sustainable tokenomics
• Strategic capital

Execution:
• Audit credibility
• Liquidity structure
• Vesting discipline

Conclusion:
Valuation follows execution discipline.`;
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

    return `🧠 DAFALABS INTELLIGENCE READY

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

      {/* Animated Background Glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -top-60 -left-60 w-[900px] h-[900px] bg-white/10 rounded-full blur-3xl"
      />

      {/* Boot Screen */}
      <AnimatePresence>
        {booting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black flex items-center justify-center z-50"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="tracking-[0.5em] text-lg"
            >
              INITIALIZING DAFALABS AI CORE...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-6 md:p-16 max-w-6xl mx-auto">

        <h1 className="tracking-[0.4em] text-2xl mb-12 font-light">
          DAFALABS
        </h1>

        <div className="bg-zinc-950/70 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 shadow-[0_0_80px_rgba(255,255,255,0.05)]">

          {/* Chat Area */}
          <div className="h-[420px] overflow-y-auto space-y-6 mb-8 pr-2">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl px-6 py-4 rounded-2xl text-sm whitespace-pre-line border ${
                    msg.role === "user"
                      ? "bg-white text-black border-white"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-xl px-6 py-4 rounded-2xl text-sm border bg-zinc-900 border-zinc-800 text-zinc-300">
                  {streamText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ▌
                  </motion.span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Paste contract address or ask Web3 strategy..."
              className="flex-1 bg-black border border-zinc-800 px-6 py-4 rounded-xl focus:outline-none focus:border-white transition"
            />
            <button
              onClick={sendMessage}
              className="bg-white text-black px-8 rounded-xl hover:bg-zinc-200 transition"
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
