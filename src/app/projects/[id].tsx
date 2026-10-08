import { formatValue } from '@kerf/shared';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl, SectionList, StyleSheet } from 'react-native';

import { MeasurementRow } from '@/components/measurement-row';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { useSettings } from '@/lib/settings';
import { useLoad } from '@/lib/use-load';

export default function ProjectScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const projectId = Number(id);
  const { data, error, loading, refresh } = useLoad(
    useCallback(() => api.measurements(projectId), [projectId]),
  );

  const { unit } = useSettings();

  const sections = (data ?? []).map((group) => ({
    title: group.name,
    data: group.measurements,
  }));

  return (
    <>
      <Stack.Screen options={{ title: name ?? 'Project' }} />
      <SectionList
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={layout.content}
        sections={sections}
        keyExtractor={(m) => String(m.id)}
        refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={refresh} />}
        ListEmptyComponent={<StatusMessage loading={loading} error={error} />}
        renderSectionHeader={({ section }) => (
          <ThemedView style={styles.header}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {section.title}
            </ThemedText>
          </ThemedView>
        )}
        renderItem={({ item }) => (
          <MeasurementRow
            label={item.label}
            value={formatValue(item.value, unit)}
            status="synced"
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
});
