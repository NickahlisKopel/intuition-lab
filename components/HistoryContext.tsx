import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type GameResult = {
  id: string;
  module: 'Intuition' | 'Reaction' | 'Risk' | 'Memory';
  label: string;
  outcome: string;
  reactionMs?: number;
  scoreChange?: number;
  timestamp: number;
};

type HistoryContextShape = {
  results: GameResult[];
  recordResult: (payload: Omit<GameResult, 'id' | 'timestamp'>) => void;
};

const HistoryContext = createContext<HistoryContextShape | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<GameResult[]>([]);

  const recordResult = useCallback((payload: Omit<GameResult, 'id' | 'timestamp'>) => {
    const id = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `run-${Date.now()}-${Math.random()}`;
    setResults((prev) => [
      {
        ...payload,
        id,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo(
    () => ({ results, recordResult }),
    [results, recordResult],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return ctx;
}
