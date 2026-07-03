import type { PageServerLoad } from './$types';
import { getPageContent } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const page = await getPageContent('home');
  return { page };
};
