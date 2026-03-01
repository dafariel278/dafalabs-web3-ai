"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [topCoins, setTopCoins] = useState([]);

  // Boot
  useEffect(() => {
    setTimeout(() => {
      setBooting(false);
      setMessages([
        {
          role: "agent",
          content:
            "DAFALABS Web3 Intelligence Agent online.\nMonitoring global liquidity, smart contracts, and ecosystem growth.",
        },
      ]);
    }, 2000);
  }, []);

  // Fetch Top Coins
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true"
        );
        const data = await res.json();
        setTopCoins(data);
      } catch (err) {
        console.error("Market API error:", err);
      }
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  // Web3 Intelligence Engine
  const generateResponse = async (prompt) => {
    const trimmed = prompt.trim();
    const lower = trimmed.toLowerCase();

    // Ethereum contract detection
    if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/contract/${trimmed}`
        );

        if (!res.ok) {
          return "Contract not found in CoinGecko database.";
        }

        const data = await res.json();

        const marketCap = data.market_data.market_cap.usd || 0;
        const volume = data.market_data.total_volume.usd || 0;

        return `SMART CONTRACT INTELLIGENCE REPORT

Token: ${data.name} (${data.symbol.toUpperCase()})
Market Cap: $${marketCap.toLocaleString()}
24h Volume: $${volume.toLocaleString()}

Official Website:
${data.links.homepage[0] || "N/A"}

Twitter:
https://twitter.com/${data.links.twitter_screen_name || "N/A"}

Preliminary Risk Profile:
• Market Presence: ${marketCap > 100000000 ? "Established" : "Early Stage"}
• Liquidity Strength: ${volume > 1000000 ? "Healthy" : "Low"}
• Volatility Tier: ${data.market_data.price_change_percentage_24h > 10 ? "High" : "Normal"}

Always verify contract authenticity independently.`;
      } catch {
        return "Error scanning contract.";
      }
    }

    if (lower.includes("community")) {
      return `WEB3 COMMUNITY GROWTH FRAMEWORK

Phase 1: Narrative Control
• Clear positioning
• Problem-solution clarity

Phase 2: Core Adoption
• Alpha user group
• Ambassador incentives
• Discord gamification

Phase 3: Expansion
• Strategic KOL partnerships
• Transparent roadmap updates

Long-term loyalty > short-term hype.`;
    }

    if (lower.includes("airdrop")) {
      return `AIRDROP INTELLIGENCE STRATEGY

Platforms:
• https://coinmarketcap.com/airdrop/
• https://airdropalert.com/
• https://layer3.xyz/
• https://galxe.com/
• https://zealy.io/

Focus Areas:
• VC-backed testnets
• On-chain interaction
• Governance participation
• Consistent activity footprint

Edge comes from early and consistent usage.`;
    }

    if (lower.includes("project") || lower.includes("proyek")) {
      return `HIGH-PROBABILITY WEB3 PROJECT BLUEPRINT

1. Real Problem-Solution Fit
2. Sustainable Tokenomics
3. Strategic Investors
4. Community Before Token
5. Liquidity & Vesting Strategy

Execution discipline defines valuation trajectory.`;
    }

    return `DAFALABS Intelligence Ready.

You may:
• Paste smart contract address
• Ask about community strategy
• Ask about token launch structure
• Ask about airdrop hunting`;
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
    }, 15);
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userInput = input;
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");

    const response = await generateResponse(userInput);
    streamResponse(response);
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

      <div className="relative z-10 p-16">

        <h1 className="tracking-[8px] text-xl mb-10">DAFALABS</h1>

        <div className="grid grid-cols-3 gap-10">

          {/* CHAT */}
          <div className="col-span-2 bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8">

            <div className="h-[400px] overflow-y-auto mb-6 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={msg.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={`inline-block px-5 py-3 rounded-2xl border whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-white text-black border-white"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div>
                  <div className="inline-block px-5 py-3 rounded-2xl border bg-zinc-900 border-zinc-800 whitespace-pre-line">
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
            </div>

            <div className="flex gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste contract address or ask Web3 strategy..."
                className="flex-1 bg-black border border-zinc-800 px-4 py-2 rounded-xl"
              />
              <button
                onClick={sendMessage}
                className="bg-white text-black px-6 rounded-xl"
              >
                Send
              </button>
            </div>
          </div>

          {/* MARKET PANEL */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-zinc-400">Top Market Coins</h3>

            {topCoins.length > 0 ? (
              topCoins.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between">

                  <div>
                    <p className="font-medium">
                      {coin.symbol.toUpperCase()} — ${coin.current_price.toLocaleString()}
                    </p>
                    <p
                      className={
                        coin.price_change_percentage_24h > 0
                          ? "text-green-400 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>

                  <div className="w-24 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={coin.sparkline_in_7d.price.map((p, i) => ({
                          price: p,
                          index: i,
                        }))}
                      >
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={
                            coin.price_change_percentage_24h > 0
                              ? "#22c55e"
                              : "#ef4444"
                          }
                          dot={false}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-zinc-500">Loading market data...</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
