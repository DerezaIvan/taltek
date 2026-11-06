import '@sveltejs/kit';

interface ImportMetaEnv {
  readonly PUBLIC_DIRECTUS_URL?: string;
}

declare global {
  namespace App {
    interface Locals {}
  }

  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

export {};
