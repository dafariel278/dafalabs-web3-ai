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

  // Boot screen
  useEffect(() => {
    setTimeout(() => {
      setBooting(false);
      setMessages([
        {
          role: "agent",
          content:
            "DAFALABS Web3 Intelligence Agent online.\nMonitoring global crypto liquidity & market structure.",
        },
      ]);
    }, 2000);
  }, []);

  // Fetch Top 5 Coins with Sparkline
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

  const generateResponse = (prompt) => {
    const lower = prompt.toLowerCase();

    if (lower.includes("community")) {
      return `Web3 Community Strategy:

• Strong narrative
• Core alpha members
• Gamified Discord roles
• Strategic KOL alignment`;
    }

    if (lower.includes("airdrop")) {
      return `Airdrop Strategy:

• Track VC-backed ecosystems
• Engage early testnet
• Consistent on-chain activity`;
    }

    return `Analyzing market signals...

Liquidity rotation detected in Layer 1 & AI narratives.

Refine your query for deeper analysis.`;
  };

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

  const sendMessage = () => {
    if (!input.trim() || isThinking) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const response = generateResponse(input);
    setInput("");
    setTimeout(() => streamResponse(response), 600);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Boot Screen */}
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

      {/* Background Glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white rounded-full blur-[200px] opacity-10"
      />

      <div className="relative z-10 p-16">

        {/* Header */}
        <h1 className="tracking-[8px] text-xl mb-10">
          DAFALABS
        </h1>

        <div className="grid grid-cols-3 gap-10">

          {/* CHAT PANEL */}
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
                placeholder="Ask about Web3 strategy, airdrop, community..."
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
