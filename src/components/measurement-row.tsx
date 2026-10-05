import type { SyncStatus } from '@kerf/shared';
import { StyleSheet, View } from 'react-native';

import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Props = {
  label: string;
  value: string;
  status: SyncStatus;
};

export function MeasurementRow({ label, value, status }: Props) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label} numberOfLines={1}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
      <StatusBadge status={status} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  label: {
    flex: 1,
  },
});
