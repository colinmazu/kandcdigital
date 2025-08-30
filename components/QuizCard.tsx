"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dict from "@/data/spanish-to-english.json";

// A tiny helper to normalize user input
function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD") // split accents
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Pick a random entry each round
function useRandomPair() {
  const keys = useMemo(() => Object.keys(dict), []);
  const pick = useCallback(() => keys[Math.floor(Math.random() * keys.length)], [keys]);
  return { keys, pick };
}

export default function QuizCard() {
  const { pick } = useRandomPair();
  const [spanish, setSpanish] = useState<string>(pick());
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const english = (dict as Record<string, string>)[spanish];

  const onSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const isCorrect = normalize(answer) === normalize(english);
      setStatus(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        // Briefly show correct state then advance after a short delay
        setTimeout(() => {
          setSpanish(pick());
          setAnswer("");
          setStatus("idle");
          setShowHint(false);
          inputRef.current?.focus();
        }, 700);
      }
    },
    [answer, english, pick]
  );

  // Press Enter to submit
  useEffect(() => {
    const el = inputRef.current;
    el?.focus();
  }, [spanish]);

  const nextWord = useCallback(() => {
    setSpanish(pick());
    setAnswer("");
    setStatus("idle");
    setShowHint(false);
    inputRef.current?.focus();
  }, [pick]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400">
          What is this in English?
        </span>
        <button
          onClick={() => setShowHint((s) => !s)}
          className="text-xs underline-offset-4 hover:underline"
          aria-pressed={showHint}
        >
          {showHint ? "Hide hint" : "Show hint"}
        </button>
      </div>

      <div className="mb-6 text-center">
        <span className="text-4xl font-semibold">{spanish}</span>
        {showHint && (
          <div className="mt-2 text-sm opacity-70">Hint: {english?.[0]?.toUpperCase()}</div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Type the English meaning…"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none ring-0 transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-950"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          aria-label="Your answer"
        />
        <button
          type="submit"
          className="rounded-xl border border-transparent bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 active:opacity-80 dark:bg-gray-100 dark:text-gray-900"
        >
          Check
        </button>
      </form>

      {status === "correct" && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-300">
          ✅ Correct!
        </div>
      )}

      {status === "wrong" && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-300">
          ❌ Not quite. The correct answer is <strong>{english}</strong>.
          <div className="mt-3">
            <button
              onClick={nextWord}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Next word
            </button>
          </div>
        </div>
      )}

      {status === "idle" && (
        <p className="mt-4 text-xs opacity-70">Press Enter to submit. Toggle hint if you need a nudge.</p>
      )}
    </div>
  );
}