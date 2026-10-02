import type { Group, Project } from '@kerf/shared';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const TOKEN = 'alex-7f3c2a91';
const API_PORT = 4000;

// The API runs on the same machine as the Expo dev server: the page's host on web, and the
// dev server's host on a phone. EXPO_PUBLIC_API_URL overrides both.
function apiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  const host =
    Platform.OS === 'web'
      ? globalThis.location?.hostname
      : Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${host || 'localhost'}:${API_PORT}`;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(apiUrl() + path, {
    ...init,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      'content-type': 'application/json',
      ...init.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }
  return res.json();
}

export const api = {
  projects: () => request<Project[]>('/projects'),
  measurements: (projectId: number) => request<Group[]>(`/projects/${projectId}/measurements`),
};
