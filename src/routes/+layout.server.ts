import type { LayoutServerLoad } from './$types';
import { getLayoutContent, getSiteSettings } from '$infrastructure/cms';

export const load: LayoutServerLoad = async () => {
  const [layout, settings] = await Promise.all([getLayoutContent(), getSiteSettings()]);
  return { ...layout, settings };
};
