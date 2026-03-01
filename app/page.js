"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [message, setMessage] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      fontFamily: "sans-serif",
      padding: "40px"
    }}>
      
      <h1 style={{ letterSpacing: "6px" }}>DAFALABS</h1>

      <div style={{
        marginTop: "60px",
        padding: "40px",
        border: "1px solid #222",
        borderRadius: "20px",
        background: "#0a0a0a"
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>Web3 Intelligence Agent Online.</p>
        </motion.div>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about Web3 strategy..."
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            background: "black",
            border: "1px solid #333",
            color: "white"
          }}
        />
      </div>
    </div>
  );
}
