import type { PageServerLoad } from './$types';
import { getAboutPageContent, getPageContent } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const [about, page] = await Promise.all([getAboutPageContent(), getPageContent('about')]);
  return { page, about };
};
