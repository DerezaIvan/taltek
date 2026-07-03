import type { LayoutServerLoad } from './$types';
import { getLayoutContent } from '$infrastructure/cms';

export const load: LayoutServerLoad = async () => {
  return getLayoutContent();
};
