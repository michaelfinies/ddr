"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createUnifiedPrompt } from "@/lib/ai-prompts";
import { motion, AnimatePresence } from "framer-motion";

// PROPS: { defaultOpen?: boolean }
export default function WormyChatWidget({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, open]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setHistory((h) => [...h, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      console.log(process.env.GEMINI);
      const AI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI);
      const prompt = createUnifiedPrompt(
        userMessage,
        history.map((h) => ({ role: h.role, text: h.content }))
      );
      console.log(prompt);
      const model = AI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const res = await model.generateContent(prompt);
      console.log(res);
      const txt = res.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Expecting JSON
      let obj = null;
      try {
        obj = JSON.parse(
          txt.match(/{[\s\S]*}/)?.[0] ||
            txt.replace("```json", "").replace("```", "")
        );
      } catch {
        obj = {
          action_type: "JAA",
          response_text: `<div><p>Sorry, I didn't understand that reply!</p></div>`,
        };
      }
      setHistory((h) => [...h, { role: "wormy", content: obj.response_text }]);
    } catch (e) {
      setHistory((h) => [
        ...h,
        {
          role: "wormy",
          content: `<div><p>Oh no! I couldn't answer right now. Please try again.</p></div>`,
        },
      ]);
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleClear() {
    setHistory([]);
  }

  // For accessibility, optionally close on Escape
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  return (
    <>
      {/* Floating mascot button */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end h-full">
        <motion.button
          className="absolute bottom-0 rounded-full border-4 border-blue-200 bg-white shadow-xl transition hover:scale-105 focus:outline-none"
          style={{
            width: 80,
            height: 80,
            padding: 0,
            display: open ? "none" : "block",
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: open ? 0.95 : 1, opacity: open ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          onClick={() => setOpen(true)}
          aria-label="Open Wormy Chat"
        >
          <Image
            src="/mascot2.png"
            alt="Mascot"
            width={80}
            height={80}
            className="rounded-full"
            draggable={false}
            priority
          />
          <span className="absolute -top-3 right-0 text-xs bg-green-500 text-white px-2 py-0.5 rounded-xl shadow">
            Chat
          </span>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="wormy-chat"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="w-[360px] sm:w-[500px] max-w-[95vw] fixed h-full right-4 z-50"
              style={{ pointerEvents: open ? "auto" : "none" }}
            >
              <Card className="rounded-3xl shadow-2xl border-2 border-blue-100 bg-white h-full">
                <CardContent className="p-4 flex flex-col gap-2 h-full">
                  {/* Top Bar */}
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src="/mascot2.png"
                      alt="Wormy"
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-blue-400 shadow"
                      priority
                    />
                    <div>
                      <span className="block text-sm text-gray-400"></span>
                    </div>
                    <button
                      className="ml-auto text-gray-400 hover:cursor-pointer bg-gray-200 border-2 border-gray-500 hover:text-red-500 p-1 rounded-full"
                      aria-label="Close chat"
                      onClick={() => setOpen(false)}
                    >
                      <svg width="22" height="22" viewBox="0 0 22 22">
                        <path
                          d="M6 6L16 16M16 6L6 16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Messages */}
                  <div
                    ref={containerRef}
                    className=" overflow-y-auto bg-muted/50 rounded-lg p-3 flex flex-col gap-3 h-full"
                  >
                    {history.length === 0 && (
                      <div className="text-center text-gray-400 mt-10">
                        <span>
                          Hi! I'm Wormy. Ask me anything about books, reading,
                          or learning.
                        </span>
                      </div>
                    )}
                    {history.map((msg, idx) =>
                      msg.role === "user" ? (
                        <div
                          key={idx}
                          className="self-end max-w-[85%] bg-blue-100 px-3 py-2 rounded-xl text-sm"
                        >
                          {msg.content}
                        </div>
                      ) : (
                        <div
                          key={idx}
                          className="flex gap-2 items-start max-w-[85%]"
                        >
                          <div
                            className="bg-gray-300 px-3 py-2 rounded-xl text-sm prose prose-green max-w-full"
                            dangerouslySetInnerHTML={{ __html: msg.content }}
                          />
                        </div>
                      )
                    )}
                    {loading && (
                      <div className="flex gap-2 items-center">
                        <span className="italic text-gray-500">
                          Wormy is thinking...
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Input */}
                  <form
                    className="flex gap-2 mt-2 "
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Ask Anything"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={loading}
                      className="flex-1 border rounded-xl px-3 py-2 outline-none "
                    />
                    <Button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="rounded-xl"
                    >
                      Send
                    </Button>
                  </form>
                  <Button
                    size="sm"
                    onClick={handleClear}
                    className="mt-1 text-xs text-gray-500 hover:cursor-pointer hover:bg-blue-500 hover:text-white bg-blue-100"
                  >
                    Clear chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
