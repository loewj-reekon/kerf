import { formatValue, type Group, type SyncStatus } from '@kerf/shared';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';

import { Button } from '@/components/button';
import { Chips } from '@/components/chips';
import { MeasurementRow } from '@/components/measurement-row';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { tape } from '@/lib/tape';
import { useSettings } from '@/lib/settings';
import { useLoad } from '@/lib/use-load';

type Reading = { key: string; label: string; value: number; status: SyncStatus };

export default function CaptureScreen() {
  const theme = useTheme();
  const projects = useLoad(useCallback(() => api.projects(), []));
  const [projectId, setProjectId] = useState<number>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<number>();
  const [label, setLabel] = useState('');
  const [lastValue, setLastValue] = useState<number>();
  const [readings, setReadings] = useState<Reading[]>([]);
  const { unit } = useSettings();

  useEffect(() => {
    if (projectId === undefined) return;
    api.measurements(projectId).then((result) => {
      setGroups(result);
      setGroupId(result[0]?.id);
    });
  }, [projectId]);

  useEffect(() => {
    return tape.subscribe((notification) => {
      const value = Math.round(notification.value / 1000);
      setLastValue(value);
      if (groupId === undefined || !label.trim()) return;

      const reading: Reading = {
        key: `${Date.now()}-${Math.random()}`,
        label: label.trim(),
        value,
        status: 'pending',
      };
      setReadings((prev) => [reading, ...prev].slice(0, 20));

      const setStatus = (status: SyncStatus) =>
        setReadings((prev) => prev.map((r) => (r.key === reading.key ? { ...r, status } : r)));
      api
        .addMeasurement(groupId, { value, label: reading.label, deviceId: notification.deviceId })
        .then(() => setStatus('synced'))
        .catch(() => setStatus('failed'));
    });
  }, [groupId, label]);

  const ready = groupId !== undefined && label.trim().length > 0;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={layout.content}
      keyboardShouldPersistTaps="handled">
      <ThemedText type="smallBold">Project</ThemedText>
      {!projects.data && <StatusMessage loading={projects.loading} error={projects.error} />}
      <Chips
        options={(projects.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
        selected={projectId}
        onSelect={setProjectId}
      />
      {groups.length > 0 && (
        <>
          <ThemedText type="smallBold">Group</ThemedText>
          <Chips
            options={groups.map((g) => ({ value: g.id, label: g.name }))}
            selected={groupId}
            onSelect={setGroupId}
          />
        </>
      )}
      <ThemedText type="smallBold">Label</ThemedText>
      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder="e.g. Sink wall run"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      <ThemedView type="backgroundElement" style={styles.panel}>
        <ThemedText type="small" themeColor="textSecondary">
          {tape.deviceId}
        </ThemedText>
        <ThemedText type="title">
          {lastValue === undefined ? '—' : formatValue(lastValue, unit)}
        </ThemedText>
      </ThemedView>
      <Button title="Measure" variant="primary" size="large" onPress={() => tape.measure()} />
      {!ready && (
        <ThemedText type="small" themeColor="textSecondary">
          Pick a group and enter a label to save readings.
        </ThemedText>
      )}

      {readings.map((r) => (
        <MeasurementRow
          key={r.key}
          label={r.label}
          value={formatValue(r.value, unit)}
          status={r.status}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    padding: Spacing.three,
    fontSize: 16,
  },
  panel: {
    borderRadius: 16,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
