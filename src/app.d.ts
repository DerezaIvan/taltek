import '@sveltejs/kit';

interface ImportMetaEnv {
  readonly PUBLIC_DIRECTUS_URL?: string;
}

declare global {
  namespace App {
    interface Locals {}
  }
}

export {};
