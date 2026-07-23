import type { PageServerLoad } from './$types';
import { getHomePageContent, getPageContent } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const [page, home] = await Promise.all([getPageContent('home'), getHomePageContent()]);
  return { page, home };
};
