import type { GameResult } from '@/components/HistoryContext';
import { Text, View } from '@/components/Themed';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

type ModuleName = GameResult['module'];

type Props = {
  module: ModuleName;
  onResult: (payload: Omit<GameResult, 'id' | 'timestamp'>) => void;
};

export default function GamePanel({ module, onResult }: Props) {
  if (module === 'Reaction') return <ReactionPanel onResult={onResult} />;
  if (module === 'Risk') return <RiskPanel onResult={onResult} />;
  if (module === 'Memory') return <MemoryPanel onResult={onResult} />;
  return <IntuitionPanel onResult={onResult} />;
}

function IntuitionPanel({ onResult }: { onResult: Props['onResult'] }) {
  const draw = () => {
    const outcomes = ['Red', 'Blue', 'Green', 'Yellow'];
    const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
    onResult({ module: 'Intuition', label: 'Intuition draw', outcome: `Drew ${pick}` });
  };

  return (
    <View style={styles.panelRow}>
      <Pressable style={styles.ghostButton} onPress={draw}>
        <Text style={styles.ghostText}>Draw a token</Text>
      </Pressable>
    </View>
  );
}

function ReactionPanel({ onResult }: { onResult: Props['onResult'] }) {
  const [state, setState] = useState<'idle' | 'waiting' | 'go'>('idle');
  const startTs = useRef<number | null>(null);

  const start = useCallback(() => {
    setState('waiting');
    const delay = 500 + Math.random() * 1500;
    setTimeout(() => {
      startTs.current = Date.now();
      setState('go');
    }, delay);
  }, []);

  const tap = useCallback(() => {
    if (state !== 'go' || startTs.current == null) return;
    const reactionMs = Date.now() - startTs.current;
    onResult({ module: 'Reaction', label: 'Reaction tap', outcome: 'User tapped', reactionMs });
    setState('idle');
    startTs.current = null;
  }, [state, onResult]);

  return (
    <View style={styles.panelRow}>
      {state === 'idle' && (
        <Pressable style={styles.primaryButton} onPress={start}>
          <Text style={styles.primaryButtonText}>Start reaction</Text>
        </Pressable>
      )}
      {state === 'waiting' && (
        <View>
          <Text style={styles.body}>Wait for the prompt…</Text>
        </View>
      )}
      {state === 'go' && (
        <Pressable style={styles.primaryButton} onPress={tap}>
          <Text style={styles.primaryButtonText}>Tap!</Text>
        </Pressable>
      )}
    </View>
  );
}

function RiskPanel({ onResult }: { onResult: Props['onResult'] }) {
  const [pumps, setPumps] = useState(0);

  const pump = () => {
    // chance to bust grows with pumps
    const busted = Math.random() < Math.min(0.15 + pumps * 0.05, 0.6);
    setPumps((p) => p + 1);
    if (busted) {
      onResult({ module: 'Risk', label: 'Risk burst', outcome: 'Burst! Lost points', scoreChange: -Math.round(Math.random() * 3) });
      setPumps(0);
    }
  };

  const bank = () => {
    const gained = pumps * (1 + Math.round(Math.random() * 3));
    onResult({ module: 'Risk', label: 'Risk bank', outcome: `Banked ${gained} points`, scoreChange: gained });
    setPumps(0);
  };

  return (
    <View style={styles.panelRow}>
      <Text style={styles.body}>Pumps: {pumps}</Text>
      <Pressable style={styles.secondaryButton} onPress={pump}>
        <Text style={styles.secondaryButtonText}>Pump</Text>
      </Pressable>
      <Pressable style={styles.primaryButton} onPress={bank}>
        <Text style={styles.primaryButtonText}>Bank</Text>
      </Pressable>
    </View>
  );
}

function MemoryPanel({ onResult }: { onResult: Props['onResult'] }) {
  const [sequence, setSequence] = useState<number[] | null>(null);

  const show = () => {
    const seq = Array.from({ length: 3 }, () => 1 + Math.floor(Math.random() * 9));
    setSequence(seq);
    setTimeout(() => {
      // for simplicity assume correct recall
      onResult({ module: 'Memory', label: 'Memory trial', outcome: `Presented ${seq.join('-')} (assumed recall)` });
      setSequence(null);
    }, 1200);
  };

  return (
    <View style={styles.panelRow}>
      <Pressable style={styles.ghostButton} onPress={show}>
        <Text style={styles.ghostText}>Show sequence</Text>
      </Pressable>
      {sequence && <Text style={styles.body}>Sequence: {sequence.join(' ')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  panelRow: {
    gap: 8,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#1f2937',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  ghostButton: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ghostText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  body: {
    color: '#cbd5e1',
  },
});
