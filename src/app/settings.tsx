import { UNIT_LABELS, type Unit } from '@kerf/shared';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Chips } from '@/components/chips';
import { ThemedText } from '@/components/themed-text';
import { layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { updateSettings, useSettings } from '@/lib/settings';

const UNITS = Object.keys(UNIT_LABELS) as Unit[];

export default function SettingsScreen() {
  const settings = useSettings();
  const [resetStatus, setResetStatus] = useState<string>();

  async function reset() {
    setResetStatus('Resetting…');
    try {
      await api.reset();
      setResetStatus('Seed data restored.');
    } catch (e) {
      setResetStatus(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={layout.content}>
      <Card>
        <ThemedText type="smallBold">Units</ThemedText>
        <Chips
          options={UNITS.map((u) => ({ value: u, label: UNIT_LABELS[u] }))}
          selected={settings.unit}
          onSelect={(unit) => updateSettings({ unit })}
        />
      </Card>

      <ThemedText type="small" themeColor="textSecondary" style={styles.heading}>
        DEVELOPER
      </ThemedText>
      <Card>
        <ThemedText type="smallBold">Seed data</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Restores the demo projects and measurements on the server.
        </ThemedText>
        <View style={styles.action}>
          <Button title="Reset seed data" onPress={reset} />
        </View>
        {resetStatus && <ThemedText type="small">{resetStatus}</ThemedText>}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: Spacing.three,
  },
  action: {
    alignItems: 'flex-start',
    marginTop: Spacing.two,
  },
});
