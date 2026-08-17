/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PESAPAL_CONSUMER_KEY?: string;
  readonly VITE_PESAPAL_CONSUMER_SECRET?: string;
  readonly VITE_PESAPAL_ENVIRONMENT?: 'sandbox' | 'live';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
