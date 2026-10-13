import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { FeedRow } from '@/components/feed-row';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { useSettings } from '@/lib/settings';
import { useLoad } from '@/lib/use-load';

export default function DashboardScreen() {
  const { unit } = useSettings();
  const { data, error, loading, refresh } = useLoad(useCallback(() => api.feed(), []));

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={layout.content}
      data={data ?? []}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={refresh} />}
      renderItem={({ item }) => <FeedRow item={item} unit={unit} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText type="smallBold">Recent measurements</ThemedText>
        </View>
      }
      ListEmptyComponent={<StatusMessage loading={loading} error={error} />}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.two,
  },
});
