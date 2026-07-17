import type { PageServerLoad } from './$types';
import { getContactsPageContent } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const contacts = await getContactsPageContent();
  return { contacts };
};
