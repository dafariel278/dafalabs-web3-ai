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

  useEffect(() => {
    setTimeout(() => {
      setBooting(false);
      setMessages([
        {
          role: "agent",
          content:
            "DAFALABS Web3 Intelligence Agent online.\nMonitoring on-chain signals and crypto opportunities.",
        },
      ]);
    }, 2000);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const generateResponse = (prompt) => {
    const lower = prompt.toLowerCase();

    if (lower.includes("komunitas") || lower.includes("community")) {
      return `Web3 Community Strategy:

• Strong narrative
• Core alpha members
• Discord gamification
• KOL partnerships
• Transparency updates`;
    }

    if (lower.includes("airdrop")) {
      return `Airdrop Strategy:

• Track VC-backed projects
• Use testnet early
• Interact consistently
• Use multiple wallets wisely`;
    }

    return `Analyzing market structure...

Infrastructure & AI narratives strengthening.

Provide more specific query.`;
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
    <div style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      fontFamily: "sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Boot Screen */}
      <AnimatePresence>
        {booting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              letterSpacing: "6px"
            }}
          >
            INITIALIZING DAFALABS AI CORE...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Background */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          background: "white",
          borderRadius: "50%",
          filter: "blur(200px)",
          opacity: 0.1
        }}
      />

      <div style={{ padding: "60px", position: "relative", zIndex: 10 }}>

        <h1 style={{ letterSpacing: "8px", marginBottom: "40px" }}>
          DAFALABS
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "40px"
        }}>

          {/* Chat */}
          <div style={{
            background: "#0a0a0a",
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "30px"
          }}>

            <div style={{
              height: "400px",
              overflowY: "auto",
              marginBottom: "20px"
            }}>
              {messages.map((msg, index) => (
                <div key={index} style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  marginBottom: "15px"
                }}>
                  <div style={{
                    display: "inline-block",
                    padding: "12px 18px",
                    borderRadius: "15px",
                    background: msg.role === "user" ? "white" : "#111",
                    color: msg.role === "user" ? "black" : "white",
                    border: "1px solid #333",
                    whiteSpace: "pre-line"
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "inline-block",
                    padding: "12px 18px",
                    borderRadius: "15px",
                    background: "#111",
                    border: "1px solid #333",
                    whiteSpace: "pre-line"
                  }}>
                    {streamText}▌
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Web3 strategy..."
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "black",
                  border: "1px solid #333",
                  color: "white"
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "10px 20px",
                  background: "white",
                  color: "black",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Investor Panel */}
          <div style={{
            background: "#0a0a0a",
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "30px"
          }}>
            <h3 style={{ marginBottom: "20px" }}>Market Signals</h3>
            <p>AI Narrative Strength: 82%</p>
            <p>Stablecoin Inflow: Increasing</p>
            <p>Early Opportunities: 14 Detected</p>
          </div>

        </div>
      </div>
    </div>
  );
}
