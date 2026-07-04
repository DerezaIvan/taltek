import { resolve } from '$app/paths';

export function isActiveRoute(href: string, pathname: string): boolean {
  const normalizedHref = resolve(href as '/').replace(/\/+$/, '') || '/';
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return normalizedHref === normalizedPath;
}
