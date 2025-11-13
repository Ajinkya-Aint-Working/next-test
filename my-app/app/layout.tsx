"use client";

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Load dynamic runtime environment variables */}
        <script src="/runtime-config.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
