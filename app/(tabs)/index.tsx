import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Pressable } from 'react-native';

import { Text, View } from '@/components/Themed';

const numberOptions = Array.from({ length: 10 }, (_, i) => i + 1);

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export default function PlayScreen() {
  const [numberTarget, setNumberTarget] = useState<number | null>(null);
  const [numberStart, setNumberStart] = useState<number | null>(null);
  const [numberResult, setNumberResult] = useState<string>('');

  const [reactionStatus, setReactionStatus] = useState<'idle' | 'waiting' | 'go' | 'done'>(
    'idle',
  );
  const [reactionMessage, setReactionMessage] = useState('Tap start to begin a quick reaction test.');
  const [reactionStart, setReactionStart] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const guidelines = useMemo(
    () => [
      'Minimalist screens with one clear action per card.',
      'Secure randomness for guessing games to keep outcomes fair.',
      'Millisecond timers for reaction and decision-making feedback.',
      'Immediate, friendly feedback so users know what to try next.',
    ],
    [],
  );

  const startGuessRound = () => {
    const target = Math.floor(Math.random() * 10) + 1;
    setNumberTarget(target);
    setNumberStart(Date.now());
    setNumberResult('Pick the number you think was chosen.');
  };

  const submitGuess = (guess: number) => {
    if (!numberTarget || !numberStart) {
      setNumberResult('Tap “Start guessing” first to generate a number.');
      return;
    }

    const reactionMs = Date.now() - numberStart;
    const correct = guess === numberTarget;
    const error = Math.abs(guess - numberTarget);
    const feedback = correct
      ? `Nice intuition! ${guess} was correct. Reaction: ${reactionMs} ms.`
      : `Target was ${numberTarget}. You chose ${guess} (off by ${error}). Reaction: ${reactionMs} ms.`;

    setNumberResult(feedback);
    setNumberTarget(null);
    setNumberStart(null);
  };

  const startReactionTest = () => {
    setReactionStatus('waiting');
    setReactionMessage('Wait for green, then tap quickly!');
    setReactionTime(null);

    const delay = Math.floor(Math.random() * 3000) + 1500;
    reactionTimer.current && clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => {
      setReactionStatus('go');
      setReactionMessage('Tap now!');
      setReactionStart(Date.now());
    }, delay);
  };

  const handleReactionTap = () => {
    if (reactionStatus === 'waiting') {
      setReactionStatus('idle');
      setReactionMessage('Too early! Tap start and wait for the green prompt.');
      reactionTimer.current && clearTimeout(reactionTimer.current);
      return;
    }

    if (reactionStatus === 'go' && reactionStart) {
      const time = Date.now() - reactionStart;
      setReactionStatus('done');
      setReactionTime(time);
      setReactionMessage(`Response captured in ${time} ms.`);
      reactionTimer.current && clearTimeout(reactionTimer.current);
      return;
    }

    if (reactionStatus === 'done') {
      setReactionMessage('Tap start for another round.');
    }
  };

  useEffect(() => {
    return () => {
      reactionTimer.current && clearTimeout(reactionTimer.current);
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Intuition Lab</Text>
        <Text style={styles.title}>Micro-games for intuition and cognition</Text>
        <Text style={styles.subtitle}>
          Try a guessing round, test your reaction speed, and capture quick feedback in under a minute.
        </Text>
        <View style={styles.pillRow}>
          {guidelines.map((item) => (
            <Pill key={item} label={item} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Guess the number</Text>
        <Text style={styles.cardCopy}>
          The app picks a number between 1 and 10. Choose as fast as you can to capture intuition and reaction
          time.
        </Text>
        <View style={styles.inlineRow}>
          <Pressable style={styles.primaryButton} onPress={startGuessRound}>
            <Text style={styles.primaryButtonText}>Start guessing</Text>
          </Pressable>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Random & secure</Text>
          </View>
        </View>
        <View style={styles.numberGrid}>
          {numberOptions.map((number) => (
            <Pressable key={number} style={styles.optionButton} onPress={() => submitGuess(number)}>
              <Text style={styles.optionLabel}>{number}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.feedback}>{numberResult || 'Tap start, then pick a number.'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Reaction speed</Text>
        <Text style={styles.cardCopy}>
          Wait for the green signal, then tap immediately. Timing uses high-resolution timestamps to measure
          your response window.
        </Text>
        <View style={styles.inlineRow}>
          <Pressable style={styles.primaryButton} onPress={startReactionTest}>
            <Text style={styles.primaryButtonText}>Start</Text>
          </Pressable>
          {reactionTime !== null && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Last: {reactionTime} ms</Text>
            </View>
          )}
        </View>
        <Pressable
          style={[styles.reactionPanel, reactionStatus === 'go' && styles.reactionPanelActive]}
          onPress={handleReactionTap}>
          <Text style={styles.reactionLabel}>{reactionMessage}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Session summary</Text>
        <Text style={styles.cardCopy}>
          Alternate between intuition (guessing) and cognition (reaction). After each round, note accuracy,
          difference from the target, and response time. Keep sessions short to avoid fatigue.
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryStat}>
            <Text style={styles.statLabel}>Focus</Text>
            <Text style={styles.statValue}>One task at a time</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.statLabel}>Timing</Text>
            <Text style={styles.statValue}>ms precision</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.statLabel}>Feedback</Text>
            <Text style={styles.statValue}>Instant</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  hero: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  kicker: {
    color: '#a5b4fc',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  subtitle: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    color: '#e2e8f0',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#0b1224',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  sectionLabel: {
    color: '#a5b4fc',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 12,
  },
  cardCopy: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    width: '18%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    alignItems: 'center',
  },
  optionLabel: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  feedback: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  reactionPanel: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  reactionPanelActive: {
    backgroundColor: '#047857',
    borderColor: '#22c55e',
  },
  reactionLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryStat: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statLabel: {
    color: '#a5b4fc',
    fontWeight: '700',
    marginBottom: 4,
  },
  statValue: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
});

