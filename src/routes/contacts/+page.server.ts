import type { PageServerLoad } from './$types';
import { getContactsPageContent, getPageContent, getSiteSettings } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const [page, contacts, settings] = await Promise.all([
    getPageContent('contacts'),
    getContactsPageContent(),
    getSiteSettings(),
  ]);
  return { page, contacts, settings };
};
