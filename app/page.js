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
            "DAFALABS Web3 Intelligence Terminal Online.\nReal-time market engine connected with OHLC data.",
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
        // BTC price and data
        const priceRes = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin"
        );
        const priceData = await priceRes.json();

        setBtcInfo({
          price: priceData.market_data.current_price.usd,
          change: priceData.market_data.price_change_percentage_24h,
          volume: priceData.market_data.total_volume.usd,
        });

        // BTC OHLC data (Candlestick data)
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
