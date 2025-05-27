"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createUnifiedPrompt } from "@/lib/ai-prompts";
import { motion, AnimatePresence } from "framer-motion";

// Animate dot loader for "thinking..." state
function LoaderDots() {
  return (
    <span className="inline-flex gap-1 items-center h-4">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-2 h-2 rounded-full bg-blue-500"
          animate={{
            y: [0, -5, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            delay: i * 0.25,
          }}
        />
      ))}
    </span>
  );
}

export default function WormyChatWidget({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
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
      const AI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI);
      const prompt = createUnifiedPrompt(
        userMessage,
        history.map((h) => ({ role: h.role, text: h.content }))
      );
      const model = AI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const res = await model.generateContent(prompt);
      const txt = res.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

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

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const widgetVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.93 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 170, damping: 17 },
    },
    exit: { opacity: 0, y: 60, scale: 0.93, transition: { duration: 0.18 } },
  };

  const mascotVariants = {
    initial: { rotate: 0 },
    hover: { rotate: [0, -10, 12, -8, 0], transition: { duration: 0.7 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 150, damping: 16 },
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end h-full">
        {/* Mascot floating button */}
        <motion.button
          className="absolute bottom-0 rounded-full border-4 border-blue-300 bg-gradient-to-br from-white/80 via-blue-50 to-blue-100 shadow-[0_6px_36px_0_rgba(220,200,100,0.20)] backdrop-blur-lg transition hover:shadow-[0_8px_44px_rgba(220,180,60,0.22)]"
          style={{
            width: 82,
            height: 82,
            padding: 0,
            display: open ? "none" : "block",
          }}
          initial="initial"
          whileHover="hover"
          animate={{ scale: open ? 0.98 : 1, opacity: open ? 0 : 1 }}
          variants={mascotVariants}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
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
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="wormy-chat"
              variants={widgetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-[360px] sm:w-[500px] max-w-[95vw] fixed h-[560px] sm:h-[640px] right-4 bottom-4 z-50"
              style={{
                pointerEvents: open ? "auto" : "none",
              }}
            >
              <Card className="rounded-lg py-0 shadow-2xl border-2 border-blue-100 bg-gradient-to-br from-white/90 via-blue-50 to-blue-100/80 backdrop-blur-xl h-full overflow-hidden">
                <CardContent className="px-3 flex flex-col gap-2 h-full  pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Image
                      src="/mascot2.png"
                      alt="Wormy"
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-blue-400 shadow"
                      priority
                    />

                    <button
                      className="ml-auto text-gray-400 hover:cursor-pointer bg-gray-200/70 border-2 border-gray-400 hover:text-red-500 p-1.5 rounded-full transition-all hover:bg-red-200/30"
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
                  </motion.div>

                  <div
                    ref={containerRef}
                    className="overflow-y-auto bg-white/70 rounded-2xl p-3 flex flex-col gap-3 h-full  shadow-inner"
                    style={{ backdropFilter: "blur(7px)" }}
                  >
                    {history.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center text-gray-400 mt-10"
                      >
                        <span>
                          Hi! I'm{" "}
                          <span className="font-semibold text-blue-500">
                            Wormy
                          </span>
                          . Ask me anything about{" "}
                          <span className="underline decoration-blue-400">
                            books
                          </span>
                          ,{" "}
                          <span className="underline decoration-blue-300">
                            reading
                          </span>
                          , or{" "}
                          <span className="underline decoration-blue-200">
                            learning
                          </span>
                          !
                        </span>
                      </motion.div>
                    )}
                    <AnimatePresence initial={false}>
                      {history.map((msg, idx) =>
                        msg.role === "user" ? (
                          <motion.div
                            key={idx}
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="self-end max-w-[78%] bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200/80 px-4 py-2 rounded-2xl rounded-tr-md shadow font-medium text-sm text-gray-800 border border-blue-200 backdrop-blur-lg"
                          >
                            {msg.content}
                          </motion.div>
                        ) : (
                          <motion.div
                            key={idx}
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex gap-2 items-start max-w-[82%]"
                          >
                            <div
                              className="bg-gradient-to-br from-green-50/80 to-green-100/60 px-4 py-2 rounded-2xl rounded-tl-md shadow-inner border border-green-200 text-sm prose prose-green max-w-full backdrop-blur-lg"
                              dangerouslySetInnerHTML={{ __html: msg.content }}
                            />
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                    {loading && (
                      <div className="flex gap-2 items-center mt-2">
                        <span className="italic text-gray-500">
                          Wormy is thinking <LoaderDots />
                        </span>
                      </div>
                    )}
                  </div>

                  <motion.form
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 mt-2 bottom-0 pb-1"
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
                      className="flex-1 border border-blue-200/60 rounded-xl px-3 py-2 outline-none bg-white/90 shadow focus:ring-2 focus:ring-blue-300/50"
                    />
                    <Button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="rounded-xl shadow-lg bg-blue-400/80 hover:bg-blue-500 text-white px-5 py-2 transition"
                    >
                      Send
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleClear}
                      className="mt-1 text-xs border-2 border-gray-500 text-gray-500 hover:cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-100 rounded-xl px-3 py-1 transition"
                    >
                      Clear chat
                    </Button>
                  </motion.form>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  ></motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
