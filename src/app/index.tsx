import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import { Card } from '@/components/card';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { useLoad } from '@/lib/use-load';

export default function ProjectsScreen() {
  const { data, error, loading, refresh } = useLoad(useCallback(() => api.projects(), []));

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data ?? []}
      keyExtractor={(p) => String(p.id)}
      refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={refresh} />}
      ListEmptyComponent={<StatusMessage loading={loading} error={error} />}
      renderItem={({ item }) => (
        <Card>
          <ThemedText type="smallBold">{item.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {item.measurementCount} {item.measurementCount === 1 ? 'measurement' : 'measurements'}
          </ThemedText>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
