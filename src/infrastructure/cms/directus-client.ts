import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

function getBaseUrl(): string | undefined {
  const url = publicEnv.PUBLIC_DIRECTUS_URL?.trim();
  return url || undefined;
}

function getToken(): string | undefined {
  const token = privateEnv.DIRECTUS_TOKEN?.trim();
  return token || undefined;
}

export function isDirectusConfigured(): boolean {
  return Boolean(getBaseUrl());
}

export function getAssetUrl(fileId: string | undefined): string | undefined {
  if (!fileId) return undefined;
  const baseUrl = getBaseUrl();
  if (!baseUrl) return undefined;
  return `${baseUrl.replace(/\/$/, '')}/assets/${fileId}`;
}

export async function directusFetch<T>(path: string): Promise<T | null> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return null;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, { headers });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}
