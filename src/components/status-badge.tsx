import type { SyncStatus } from '@kerf/shared';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const COLORS = { synced: 'success', pending: 'warning', failed: 'danger' } as const;

export function StatusBadge({ status }: { status: SyncStatus }) {
  const theme = useTheme();
  const color = theme[COLORS[status]];
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <ThemedText type="small" style={{ color }}>
        {status}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
  },
});
