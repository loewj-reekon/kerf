import { Link } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { layout } from '@/constants/layout';
import { api } from '@/lib/api';
import { useLoad } from '@/lib/use-load';

export default function ProjectsScreen() {
  const { data, error, loading, refresh } = useLoad(useCallback(() => api.projects(), []));

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={layout.content}
      data={data ?? []}
      keyExtractor={(p) => String(p.id)}
      refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={refresh} />}
      ListHeaderComponent={
        <Link href="/capture" asChild>
          <Button title="Capture measurements" variant="primary" />
        </Link>
      }
      ListEmptyComponent={<StatusMessage loading={loading} error={error} />}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/projects/[id]', params: { id: item.id, name: item.name } }} asChild>
          <Card>
            <ThemedText type="smallBold">{item.name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {item.measurementCount} {item.measurementCount === 1 ? 'measurement' : 'measurements'}
            </ThemedText>
          </Card>
        </Link>
      )}
    />
  );
}
