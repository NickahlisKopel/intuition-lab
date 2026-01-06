import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useHistory } from '@/components/HistoryContext';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const { results } = useHistory();

  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        total: '0 runs',
        avgReaction: '—',
        riskBank: '—',
      };
    }

    const reactions = results
      .map((item) => item.reactionMs)
      .filter((value): value is number => typeof value === 'number');
    const avgReaction = reactions.length
      ? `${Math.round(reactions.reduce((sum, v) => sum + v, 0) / reactions.length)} ms`
      : '—';

    const riskOutcomes = results.filter((item) => item.module === 'Risk');
    const riskBanked = riskOutcomes.filter((item) => item.outcome.toLowerCase().includes('bank')).length;
    const riskRate = riskOutcomes.length ? `${Math.round((riskBanked / riskOutcomes.length) * 100)}% banked` : '—';

    return {
      total: `${results.length} run${results.length === 1 ? '' : 's'}`,
      avgReaction,
      riskBank: riskRate,
    };
  }, [results]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.card}> 
          <Text style={styles.sectionLabel}>History & stats</Text>
          <Text style={styles.body}>Track every simulated run from the Play shelves. The container expands per entry so you can see timing, modules, and outcomes.</Text>
          <View style={styles.statRow}>
            <Stat label="Total runs" value={stats.total} />
            <Stat label="Avg reaction" value={stats.avgReaction} />
            <Stat label="Risk banking" value={stats.riskBank} />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.entry}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>{item.label}</Text>
            <View style={styles.badge}> 
              <Text style={styles.badgeText}>{item.module}</Text>
            </View>
          </View>
          <Text style={styles.body}>{item.outcome}</Text>
          <View style={styles.metaRow}>
            {item.reactionMs ? <Text style={styles.meta}>Reaction: {item.reactionMs} ms</Text> : null}
            {typeof item.scoreChange === 'number' ? <Text style={styles.meta}>Score Δ: {item.scoreChange}</Text> : null}
            <Text style={styles.meta}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.card}>
          <Text style={styles.body}>No runs yet. Trigger a shelf on the Play tab to populate history.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050b18',
  },
  content: {
    padding: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#0b1224',
    borderRadius: 16,
    padding: 20,
    gap: 8,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  sectionLabel: {
    color: '#a5b4fc',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 12,
  },
  body: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    minWidth: 140,
    gap: 4,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  statLabel: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  statValue: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 18,
  },
  entry: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryTitle: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 16,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  meta: {
    color: '#94a3b8',
    fontWeight: '600',
  },
});
