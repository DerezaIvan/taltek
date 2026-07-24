import type { PageServerLoad } from './$types';
import { getPageContent, getServicesPageContent } from '$infrastructure/cms';

export const load: PageServerLoad = async () => {
  const [services, page] = await Promise.all([
    getServicesPageContent(),
    getPageContent('services'),
  ]);
  return { page, services };
};
