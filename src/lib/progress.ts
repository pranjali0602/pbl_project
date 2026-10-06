import { useCallback, useEffect, useState } from "react";
import type { Trait } from "@/data/scenarios";

export type Progress = {
  name: string;
  xp: number;
  completed: string[];
  concepts: string[];
  traits: Record<string, number>;
  balance: number;
  savings: number;
  streak: number;
  lastPlayed: string | null;
};

export const EMPTY: Progress = {
  name: "",
  xp: 0,
  completed: [],
  concepts: [],
  traits: {},
  balance: 0,
  savings: 0,
  streak: 0,
  lastPlayed: null,
};

const KEY = "paisaboom.progress.v1";

export function levelFor(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const into = xp % 500;
  return { level, into, pct: Math.round((into / 500) * 100) };
}

export const LEVEL_NAMES = [
  "Broke Rookie",
  "Budget Curious",
  "Money Aware",
  "Smart Spender",
  "Compound Kid",
  "Wealth Brain",
];

export function levelName(level: number) {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)] ?? "Money Rookie";
}

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(read());
    setReady(true);
    const onStorage = () => setProgress(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: Progress) => {
    setProgress(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback(
    (fn: (p: Progress) => Progress) => {
      const next = fn(read());
      save(next);
    },
    [save],
  );

  const reset = useCallback(() => save(EMPTY), [save]);

  return { progress, ready, update, reset };
}

export function applyRun(
  p: Progress,
  input: {
    scenarioId: string;
    conceptIds: string[];
    xp: number;
    traits: Trait[];
    balance: number;
    savings: number;
  },
): Progress {
  const traits = { ...p.traits };
  input.traits.forEach((t) => (traits[t] = (traits[t] ?? 0) + 1));
  const today = new Date().toDateString();
  const streak =
    p.lastPlayed === today ? Math.max(p.streak, 1) : p.streak + 1;
  return {
    ...p,
    xp: p.xp + input.xp,
    completed: Array.from(new Set([...p.completed, input.scenarioId])),
    concepts: Array.from(new Set([...p.concepts, ...input.conceptIds])),
    traits,
    balance: p.balance + input.balance,
    savings: p.savings + input.savings,
    streak,
    lastPlayed: today,
  };
}

export function topTrait(traits: Record<string, number>) {
  const entries = Object.entries(traits).sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? null;
}
