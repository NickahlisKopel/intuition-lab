import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

const modules = [
  {
    title: 'Guess the Colour & Shape',
    intent: 'Capture intuitive choices across multiple sensory anchors.',
    gameplay: 'Randomly select a colour or shape and let users pick quickly; reveal the outcome instantly.',
    metrics: 'Accuracy %, reaction ms, distance between guess and target distribution.',
  },
  {
    title: 'Reaction Time',
    intent: 'Measure perception-to-action speed with millisecond timing.',
    gameplay: 'Show a neutral screen, flash a go cue, and record the tap latency.',
    metrics: 'Average, median, and best reaction time across trials.',
  },
  {
    title: 'Decision & Risk (Balloon)',
    intent: 'Surface risk appetite through pump-or-bank choices.',
    gameplay: 'Each pump adds points but increases pop risk; banking secures current points.',
    metrics: 'Average pumps before banking, pop %, total points.',
  },
  {
    title: 'Memory Span',
    intent: 'Test short-term memory with expanding sequences.',
    gameplay: 'Play a sequence of numbers/colours and ask users to reproduce it.',
    metrics: 'Max sequence length recalled and trial accuracy.',
  },
];

export default function ModulesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Design map</Text>
        <Text style={styles.title}>Minimal application blueprint</Text>
        <Text style={styles.body}>
          Each module isolates one cognitive skill—intuition, reaction, risk, or memory—while keeping controls
          simple and feedback immediate.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Principles</Text>
        <Text style={styles.body}>• Minimal UI with a single clear action per screen.</Text>
        <Text style={styles.body}>• Randomized outcomes for fairness in guessing modules.</Text>
        <Text style={styles.body}>• Millisecond timers for reaction and decision events.</Text>
        <Text style={styles.body}>• Short sessions with optional summaries to reduce fatigue.</Text>
        <Text style={styles.body}>• Transitional shelves that hold controls and copy until full game flows are slotted in.</Text>
      </View>

      {modules.map((module) => (
        <View key={module.title} style={styles.card}>
          <Text style={styles.sectionLabel}>{module.title}</Text>
          <Text style={styles.body}>Intent: {module.intent}</Text>
          <Text style={styles.body}>Gameplay: {module.gameplay}</Text>
          <Text style={styles.body}>Metrics: {module.metrics}</Text>
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Ethics & usage</Text>
        <Text style={styles.body}>
          Scores are for entertainment and practice only; they do not diagnose or prove abilities. Encourage
          breaks and emphasize chance in precognition-style guessing.
        </Text>
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
  body: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#0b1224',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  sectionLabel: {
    color: '#a5b4fc',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 12,
  },
});

