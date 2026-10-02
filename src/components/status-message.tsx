import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function StatusMessage({ loading, error }: { loading?: boolean; error?: string }) {
  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ThemedText themeColor="danger">{error ?? 'Nothing here yet.'}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
  },
});
