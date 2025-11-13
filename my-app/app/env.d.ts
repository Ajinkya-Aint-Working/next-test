declare global {
  interface Window {
    __ENV?: {
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_ANALYTICS_KEY?: string;
    };
  }
}

export {};
