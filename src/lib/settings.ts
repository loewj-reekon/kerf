import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Unit } from '@kerf/shared';
import { useSyncExternalStore } from 'react';

export interface Settings {
  unit: Unit;
}

const STORAGE_KEY = 'kerf.settings';

let settings: Settings = { unit: 'fractional' };
const listeners = new Set<() => void>();

AsyncStorage.getItem(STORAGE_KEY)
  .then((raw) => {
    if (raw) {
      settings = { ...settings, ...JSON.parse(raw) };
      listeners.forEach((l) => l());
    }
  })
  .catch(() => {});

export function getSettings() {
  return settings;
}

export function updateSettings(patch: Partial<Settings>) {
  settings = { ...settings, ...patch };
  listeners.forEach((l) => l());
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {});
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings, getSettings);
}
