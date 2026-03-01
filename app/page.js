"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  // Premium Boot Animation
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
    }, 2800);
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  // AI Brain
  const generateResponse = async (prompt) => {
    const lower = prompt.toLowerCase();

    if (lower.includes("airdrop")) {
      return `🧠 AIRDROP STRATEGY ANALYSIS

Executive View:
Airdrops reward consistent on-chain behavior.

Primary Platforms:
• layer3.xyz
• galxe.com
• zealy.io
• coinmarketcap.com/airdrop

Professional Edge:
Engagement history > wallet farming.

Institutional Insight:
Focus on ecosystems backed by tier-1 VCs.`;
    }

    if (lower.includes("community")) {
      return `🧠 WEB3 COMMUNITY ARCHITECTURE

Phase 1 — Narrative Positioning
Phase 2 — Core Alpha Group
Phase 3 — Strategic Amplification

Key Principle:
Community is liquidity defense, not marketing.

Professional Insight:
Trust compounds faster than hype.`;
    }

    if (lower.includes("project")) {
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

    return `🧠 DAFALABS Intelligence Ready.

You can ask about:
• Airdrop strategy
• Community growth
• Token project modeling
• Market structure`;
  };

  // Typing Effect
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
              placeholder="Ask about Web3 strategy..."
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
