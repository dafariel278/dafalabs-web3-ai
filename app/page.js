"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const chatEndRef = useRef(null);

  // Boot animation
  useEffect(() => {
    setTimeout(() => {
      setBooting(false);
      setMessages([
        {
          role: "agent",
          content:
            "DAFALABS Web3 Intelligence Agent online.\nMonitoring on-chain signals and crypto market conditions.",
        },
      ]);
    }, 2000);
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  // LIVE MARKET DATA
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const priceRes = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
        );
        const priceData = await priceRes.json();

        const fearRes = await fetch("https://api.alternative.me/fng/");
        const fearData = await fearRes.json();

        setMarketData({
          btc: priceData.bitcoin.usd,
          btcChange: priceData.bitcoin.usd_24h_change,
          eth: priceData.ethereum.usd,
          ethChange: priceData.ethereum.usd_24h_change,
          fear: fearData.data[0].value,
        });
      } catch (err) {
        console.error("Market API Error:", err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateResponse = (prompt) => {
    const lower = prompt.toLowerCase();

    if (lower.includes("komunitas") || lower.includes("community")) {
      return `Web3 Community Strategy:

• Strong narrative positioning
• Core alpha believers
• Discord gamification
• KOL alignment
• Transparent roadmap`;
    }

    if (lower.includes("airdrop")) {
      return `Airdrop Strategy:

• Track VC-backed ecosystems
• Use testnet early
• Interact consistently
• Multi-wallet strategy`;
    }

    return `Analyzing market structure...

Infrastructure & AI narratives strengthening.

Provide a more specific query.`;
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

              <div ref={chatEndRef} />
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
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8 space-y-4">
            <h3 className="text-zinc-400 mb-4">Market Signals</h3>

            {marketData ? (
              <>
                <p>
                  BTC: ${marketData.btc.toLocaleString()}{" "}
                  <span
                    className={
                      marketData.btcChange > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    ({marketData.btcChange.toFixed(2)}%)
                  </span>
                </p>

                <p>
                  ETH: ${marketData.eth.toLocaleString()}{" "}
                  <span
                    className={
                      marketData.ethChange > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    ({marketData.ethChange.toFixed(2)}%)
                  </span>
                </p>

                <p>Fear & Greed Index: {marketData.fear}</p>
              </>
            ) : (
              <p className="text-zinc-500">Loading market data...</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
