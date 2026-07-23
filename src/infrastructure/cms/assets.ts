import { env as publicEnv } from '$env/dynamic/public';

export function getAssetUrl(fileId: string | undefined): string | undefined {
  if (!fileId) return undefined;
  const baseUrl = publicEnv.PUBLIC_DIRECTUS_URL?.trim();
  if (!baseUrl) return undefined;
  return `${baseUrl.replace(/\/$/, '')}/assets/${fileId}`;
}
