"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnimatePresence, motion } from "framer-motion";

// Helper for generating prompt
function getQuizPrompt(title, summary) {
  return `You are a reading assistant. Given the following book title and summary, generate a quiz of 5 multiple-choice questions about the book. 
Each question must have 1 correct answer and 3 plausible but incorrect options. 
Respond only in this JSON format:
[
  {
    "question": "Question text?",
    "choices": ["A. (answer)", "B. (answer)", "C. (answer)", "D. (answer)"],
    "answer": "A. (answer)"
  },
  ...
]
Book Title: ${title}
Book Summary: ${summary}
`;
}

export default function TestQuiz({ title, summary, handleQuizSubmit }) {
  const [open, setOpen] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(10);
  const timerRef = useRef();

  async function fetchQuiz() {
    setLoading(true);
    setQuiz([]);
    setUserAnswers([]);
    setCurrentQ(0);
    setShowResult(false);
    setTimer(10);

    try {
      const AI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI);
      const prompt = getQuizPrompt(title, summary);
      const model = AI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const res = await model.generateContent(prompt);
      const txt = res.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

      let parsed = null;
      try {
        parsed = JSON.parse(
          txt.match(/\[([\s\S]*)\]/)
            ? txt.match(/\[([\s\S]*)\]/)[0]
            : txt.replace("```json", "").replace("```", "")
        );
      } catch (e) {
        parsed = [];
      }
      setQuiz(parsed);
    } catch (e) {
      setQuiz([]);
    }
    setLoading(false);
  }

  function handleOpen() {
    setOpen(true);
    fetchQuiz();
  }

  function handleClose() {
    setOpen(false);
    setQuiz([]);
    setUserAnswers([]);
    setCurrentQ(0);
    setShowResult(false);
    setTimer(10);
  }

  // Timer logic
  useEffect(() => {
    if (!open || loading || showResult || quiz.length === 0) return;
    setTimer(10);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [open, loading, currentQ, showResult, quiz.length]);

  function handleTimeout() {
    if (userAnswers[currentQ] !== undefined) return;
    const arr = [...userAnswers];
    arr[currentQ] = null; // null means unanswered/incorrect
    setUserAnswers(arr);

    setTimeout(() => {
      if (currentQ < quiz.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        setShowResult(true);
      }
    }, 450);
  }

  function handleAnswer(choiceIdx) {
    if (userAnswers[currentQ] !== undefined) return;
    const arr = [...userAnswers];
    arr[currentQ] = choiceIdx;
    setUserAnswers(arr);
    clearInterval(timerRef.current);

    setTimeout(() => {
      if (currentQ < quiz.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        setShowResult(true);
      }
    }, 550);
  }

  // Count correct
  const correctCount = userAnswers.filter(
    (ans, idx) =>
      ans !== null &&
      ans !== undefined &&
      quiz[idx]?.choices[ans] === quiz[idx]?.answer
  ).length;

  return (
    <>
      <Button onClick={handleOpen}>Take Quiz</Button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="quiz-modal"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <Card className="relative w-full max-w-3xl h-[680px] rounded-[2.5rem] shadow-2xl border-2 border-blue-200 bg-white overflow-hidden flex flex-col justify-center">
              <CardContent className="w-full h-full p-0 flex flex-col">
                {/* Close button */}
                <button
                  className="absolute top-7 right-7 bg-blue-100 hover:bg-blue-200 rounded-full p-2 border-2 border-blue-300 z-20"
                  onClick={handleClose}
                  aria-label="Close quiz"
                >
                  <svg width="24" height="24" viewBox="0 0 20 20">
                    <path
                      d="M6 6L14 14M14 6L6 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Loading */}
                {loading && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-7 animate-fadeIn">
                    <Image
                      src="/mascot2.png"
                      alt="Loading Mascot"
                      width={120}
                      height={120}
                      className="rounded-full border-2 border-blue-400 shadow-xl"
                      priority
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl text-blue-600 font-semibold text-center"
                    >
                      Let’s see how well you understood!
                    </motion.div>
                  </div>
                )}

                {/* Error */}
                {!loading && quiz.length === 0 && (
                  <div className="flex flex-1 flex-col items-center justify-center text-gray-500 py-6">
                    <p>Couldn&apos;t generate quiz. Please try again.</p>
                    <Button className="mt-3" onClick={fetchQuiz}>
                      Retry
                    </Button>
                  </div>
                )}

                {/* Quiz */}
                {!loading && quiz.length > 0 && !showResult && (
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ type: "spring", stiffness: 130, damping: 17 }}
                    className="flex-1 flex flex-col items-center justify-center w-full px-6"
                  >
                    <div className="flex items-center justify-between w-full max-w-xl mb-2">
                      <div className="text-blue-500 text-lg font-medium">
                        Question {currentQ + 1} of {quiz.length}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-semibold text-lg w-7 text-right">
                          Time: {timer}
                        </span>
                      </div>
                    </div>
                    <div className="font-semibold text-2xl mb-6 text-blue-800 text-center max-w-2xl">
                      {quiz[currentQ]?.question}
                    </div>
                    <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
                      {quiz[currentQ].choices.map((choice, cidx) => {
                        const isSelected = userAnswers[currentQ] === cidx;
                        const isCorrect =
                          quiz[currentQ].choices[cidx] ===
                          quiz[currentQ].answer;
                        let style =
                          "w-full px-6 py-4 rounded-2xl border text-lg font-medium transition-all ";
                        if (userAnswers[currentQ] !== undefined) {
                          style += isSelected
                            ? isCorrect
                              ? "bg-green-200 border-green-500 text-green-800"
                              : "bg-red-100 border-red-400 text-red-600"
                            : isCorrect
                            ? "bg-green-100 border-green-300 text-green-700"
                            : "bg-blue-50 border-blue-200 text-blue-800";
                        } else {
                          style +=
                            "bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100 cursor-pointer";
                        }
                        return (
                          <motion.button
                            key={cidx}
                            whileTap={{ scale: 0.97 }}
                            className={style}
                            disabled={userAnswers[currentQ] !== undefined}
                            onClick={() => handleAnswer(cidx)}
                          >
                            {choice}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Show result */}
                {!loading && showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center px-6"
                  >
                    <motion.div
                      initial={{ scale: 0.92 }}
                      animate={{ scale: 1 }}
                      className="inline-block mb-2"
                    >
                      <Image
                        src="/mascot2.png"
                        alt="Mascot"
                        width={110}
                        height={110}
                        className="rounded-full border-2 border-blue-300 shadow mb-4"
                        priority
                      />
                    </motion.div>
                    <div className="text-2xl font-bold mb-2 text-blue-700">
                      {correctCount >= 4 ? (
                        <span className="text-green-700">
                          🎉 You Passed! ({correctCount}/5 correct)
                        </span>
                      ) : (
                        <span className="text-red-600">
                          You got {correctCount}/5 correct. Good effort!
                        </span>
                      )}
                    </div>
                    <div className="text-base text-blue-600 mb-4">
                      Thanks for taking the quiz on <b>{title}</b>!
                    </div>
                    <Button
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg px-8 py-4"
                      onClick={
                        (handleClose(), handleQuizSubmit(correctCount >= 4))
                      }
                    >
                      Close
                    </Button>
                  </motion.div>
                )}

                {/* Progress Dots */}
                {!loading && quiz.length > 0 && !showResult && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                    {quiz.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-4 h-4 rounded-full transition-all ${
                          idx === currentQ
                            ? "bg-blue-600"
                            : idx < currentQ
                            ? userAnswers[idx] === null
                              ? "bg-red-400"
                              : "bg-green-400"
                            : "bg-blue-200"
                        }`}
                        style={{
                          boxShadow:
                            idx === currentQ
                              ? "0 0 8px 2px rgba(37,99,235,0.15)"
                              : undefined,
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
