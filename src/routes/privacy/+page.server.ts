import type { PageServerLoad } from './$types';
import { getPrivacyPageContent } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const privacy = await getPrivacyPageContent();
  return { privacy };
};
