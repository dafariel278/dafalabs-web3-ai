"use client";

import { useState, useEffect, useRef } from "react";
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
  const chatEndRef = useRef(null);

  // Boot
  useEffect(() => {
    setTimeout(() => {
      setBooting(false);
      setMessages([
        {
          role: "agent",
          content:
            "DAFALABS Web3 Intelligence Terminal Online.\nDexScreener liquidity engine connected.",
        },
      ]);
    }, 2000);
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  // Fetch Top Coins (market preview)
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch(
          "https://api.dexscreener.com/latest/dex/pairs/ethereum/0xdac17f958d2ee523a2206206994597c13d831ec7"
        );
        const data = await res.json();
        if (data.pairs) setTopCoins(data.pairs.slice(0, 5));
      } catch {}
    };

    fetchMarket();
  }, []);

  // DexScreener Contract Scanner
  const generateResponse = async (prompt) => {
    const trimmed = prompt.trim();

    if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${trimmed}`
        );

        const data = await res.json();

        if (!data.pairs || data.pairs.length === 0) {
          return "No liquidity data found on DexScreener.";
        }

        const pair = data.pairs[0];

        return `DEX LIQUIDITY INTELLIGENCE REPORT

Token: ${pair.baseToken.name} (${pair.baseToken.symbol})
Chain: ${pair.chainId}
DEX: ${pair.dexId}

Price: $${pair.priceUsd}
24h Volume: $${pair.volume.h24?.toLocaleString()}
Liquidity: $${pair.liquidity.usd?.toLocaleString()}

Official Website:
${pair.info?.websites?.[0]?.url || "N/A"}

Social Media:
Twitter: ${pair.info?.socials?.find(s => s.type === "twitter")?.url || "N/A"}
Telegram: ${pair.info?.socials?.find(s => s.type === "telegram")?.url || "N/A"}

Risk Indicators:
• Liquidity Depth: ${pair.liquidity.usd > 1000000 ? "Strong" : "Low"}
• Volume Activity: ${pair.volume.h24 > 1000000 ? "Active" : "Weak"}

Always verify contract authenticity independently.`;
      } catch {
        return "DexScreener API error.";
      }
    }

    if (trimmed.toLowerCase().includes("community")) {
      return `WEB3 COMMUNITY DOMINATION FRAMEWORK

1. Narrative Authority
2. Core Alpha Users
3. Ambassador Incentives
4. Token Utility Clarity
5. Consistent Transparency

Community strength defines token longevity.`;
    }

    if (trimmed.toLowerCase().includes("airdrop")) {
      return `AIRDROP INTELLIGENCE SOURCES

• https://layer3.xyz
• https://galxe.com
• https://zealy.io
• https://coinmarketcap.com/airdrop/

Focus on:
• VC-backed ecosystems
• Testnet usage
• Governance activity`;
    }

    return `DAFALABS Intelligence Ready.

You may:
• Paste smart contract address
• Ask about Web3 growth strategy
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
    }, 10);
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

      <div className="relative z-10 p-6 md:p-16">

        <h1 className="tracking-[8px] text-xl mb-8">DAFALABS</h1>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2 bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6">

            <div className="h-[400px] overflow-y-auto mb-6 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={msg.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl border whitespace-pre-line ${
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
                  <div className="inline-block px-4 py-3 rounded-2xl border bg-zinc-900 border-zinc-800 whitespace-pre-line">
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

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Paste contract address or ask Web3 strategy..."
              className="w-full bg-black border border-zinc-800 px-4 py-3 rounded-xl"
            />
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-zinc-400 mb-4">Liquidity Engine</h3>
            <p className="text-sm text-zinc-500">
              DexScreener real-time contract intelligence enabled.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
