import React, { useMemo, useState } from 'react';
import { Pressable, View as RNView, ScrollView, StyleSheet } from 'react-native';

import GamePanel from '@/components/GamePanels';
import { useHistory } from '@/components/HistoryContext';
import { Text, View } from '@/components/Themed';

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export default function PlayScreen() {
  const { recordResult, results } = useHistory();
  const [status, setStatus] = useState<string>('Choose a shelf to stage your next mini-experiment.');
  const [expandedShelf, setExpandedShelf] = useState<string | null>(null);

  const guidelines = useMemo(
    () => [
      'Minimalist screens with one clear action per card.',
      'Secure randomness for guessing games to keep outcomes fair.',
      'Millisecond timers for reaction and decision-making feedback.',
      'Immediate, friendly feedback so users know what to try next.',
    ],
    [],
  );

  const shelves = useMemo(
    () => [
      {
        title: 'Guessing shelf',
        summary: 'Reserve the space for number/colour/shape intuition draws with randomness wired in.',
        cta: 'Stage intuition',
        module: 'Intuition' as const,
      },
      {
        title: 'Reaction shelf',
        summary: 'Hold the tap-to-go reaction flow; swap in visuals later while keeping timer hooks ready.',
        cta: 'Stage reaction',
        module: 'Reaction' as const,
      },
      {
        title: 'Decision shelf',
        summary: 'Slot the pump-or-bank risk task here with point counters and pop thresholds.',
        cta: 'Stage risk',
        module: 'Risk' as const,
      },
      {
        title: 'Memory shelf',
        summary: 'Keep room for N-back or sequence recall with short bursts and clear prompts.',
        cta: 'Stage memory',
        module: 'Memory' as const,
      },
    ],
    [],
  );

  const handleShelfSelect = (title: string) => {
    const time = new Date().toLocaleTimeString();
    setStatus(`“${title}” scaffold queued at ${time}. Transition when assets and logic are ready.`);
  };

  const handleShelfExpand = (title: string) => {
    setExpandedShelf((current) => (current === title ? null : title));
  };

  const simulateRun = (module: 'Intuition' | 'Reaction' | 'Risk' | 'Memory') => {
    const reactionMs = Math.round(120 + Math.random() * 420);
    const scoreChange = module === 'Risk' ? Math.round(Math.random() * 5) : undefined;
    const outcome = module === 'Risk' ? 'Banked points safely' : 'Captured a timing sample';
    recordResult({
      module,
      label: `${module} sample`,
      reactionMs,
      scoreChange,
      outcome,
    });
    handleShelfSelect(`${module} shelf`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Intuition Lab</Text>
        <Text style={styles.title}>Micro-games for intuition and cognition</Text>
        <Text style={styles.subtitle}>
          Stage each micro-game as a transitional shelf—ready for assets and timers but calm until you launch
          them.
        </Text>
        <View style={styles.pillRow}>
          {guidelines.map((item) => (
            <Pill key={item} label={item} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Shelves & transitions</Text>
        <Text style={styles.cardCopy}>
          Keep the experience calm with transitional buttons that hold space for each micro-game. When
          you’re ready, drop in assets, timers, and scoring without reshaping the layout.
        </Text>
        <View style={styles.shelfGrid}>
          {shelves.map((shelf) => (
            <View key={shelf.title} style={[styles.shelf, expandedShelf === shelf.title && styles.shelfExpanded]}>
              <View style={styles.shelfHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shelfLabel}>{shelf.title}</Text>
                  <Text style={styles.shelfHint}>Expandable container for upcoming assets and controls.</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Scaffold</Text>
                </View>
              </View>
              <Text style={styles.cardCopy}>{shelf.summary}</Text>
              <RNView style={styles.buttonRow}>
                <Pressable style={styles.primaryButton} onPress={() => simulateRun(shelf.module)}>
                  <Text style={styles.primaryButtonText}>{shelf.cta}</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={() => handleShelfExpand(shelf.title)}>
                  <Text style={styles.secondaryButtonText}>
                    {expandedShelf === shelf.title ? 'Collapse shelf' : 'Expand shelf'}
                  </Text>
                </Pressable>
              </RNView>
              {expandedShelf === shelf.title && (
                <View style={styles.expandPanel}>
                  <Text style={styles.sectionLabel}>Next hooks</Text>
                  <Text style={styles.cardCopy}>
                    Drop timers, canvas assets, or gesture handlers into this expanded container. Data points from
                    simulated runs land in the History tab so you can watch averages update.
                  </Text>
                  <GamePanel module={shelf.module} onResult={recordResult} />
                </View>
              )}
            </View>
          ))}
        </View>
        <View style={styles.statusBar}>
          <Text style={styles.statusLabel}>Now staging</Text>
          <Text style={styles.statusValue}>{status}</Text>
        </View>
        <View style={styles.statusBar}>
          <Text style={styles.statusLabel}>Latest signals</Text>
          <View style={styles.inlineRow}>
            <Text style={styles.statusValue}>Recorded runs: {results.length}</Text>
            {results[0]?.reactionMs ? (
              <Text style={styles.statusValue}> • Last reaction: {results[0].reactionMs} ms</Text>
            ) : null}
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
    alignSelf: 'flex-start',
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
  shelfGrid: {
    gap: 12,
  },
  shelf: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  shelfExpanded: {
    borderColor: '#22c55e',
  },
  shelfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shelfLabel: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 16,
  },
  shelfHint: {
    color: '#94a3b8',
    marginTop: 4,
  },
  statusBar: {
    marginTop: 8,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 6,
  },
  statusLabel: {
    color: '#a5b4fc',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  statusValue: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  expandPanel: {
    marginTop: 4,
    padding: 12,
    backgroundColor: '#0b1224',
    borderRadius: 12,
    borderColor: '#1f2937',
    borderWidth: 1,
    gap: 6,
  },
});
