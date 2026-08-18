import type { PageServerLoad } from './$types';
import { getPageContent, getPrivacyPageContent } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const [page, privacy] = await Promise.all([getPageContent('privacy'), getPrivacyPageContent()]);
  return { page, privacy };
};
