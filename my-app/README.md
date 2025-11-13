# 🚀 Next.js Runtime Environment Variables using Docker (Dynamic, Not Baked)

This project demonstrates how to use **real runtime environment variables** in a **Next.js App Router** application running inside Docker — without rebuilding the image every time the environment changes.

Unlike typical `NEXT_PUBLIC_*` variables (which are baked at build time), this setup injects variables at **container startup**, making them fully dynamic and production-ready.

---

## 📂 Project Structure

```
.
├── Dockerfile
├── docker-compose.yaml
├── entrypoint.sh
├── app/
│   ├── env.d.ts
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── runtime-config.js  (GENERATED AT RUNTIME — NOT IN REPO)
└── ...
```

---

# ✅ What Problem This Solves

By default:

- `process.env.*` in Next.js is **baked into the build**  
- Changing env vars requires **rebuilding** the app  
- Kubernetes/Docker deployments cannot easily override values at runtime  

This repo solves that by:

✔ Generating `public/runtime-config.js` at container startup  
✔ Exposing dynamic values through `window.__ENV`  
✔ Allowing **runtime config changes without rebuilds**  
✔ Fully compatible with Docker, Compose, Kubernetes, and cloud hosting  

---

# ✅ Changes Made (FULL DOCUMENTATION)

Below is every modification done to make runtime envs work correctly.

---

# 1️⃣ Added a Runtime Entrypoint Script (`entrypoint.sh`)

This script runs **inside the container at startup**, before Next.js starts.

It generates:

`public/runtime-config.js`

…using environment variables passed to Docker or Kubernetes.

### `entrypoint.sh`

```sh
#!/bin/sh
set -e

cat <<EOF > /app/public/runtime-config.js
window.__ENV = {
  NEXT_PUBLIC_API_URL: "${NEXT_PUBLIC_API_URL}",
  NEXT_PUBLIC_ANALYTICS_KEY: "${NEXT_PUBLIC_ANALYTICS_KEY}"
};
EOF

npm run start
```

---

# 2️⃣ Updated Dockerfile to Use Entrypoint

### `Dockerfile`

```dockerfile
# ----------- Builder -----------
FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----------- Runner -----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]
```

---

# 3️⃣ Created `docker-compose.yaml` with Runtime Environment Variables

### `docker-compose.yaml`

```yaml
version: "3.9"

services:
  next-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: next-runtime-app
    ports:
      - "3000:3000"

    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: "https://api.example.com"
      NEXT_PUBLIC_ANALYTICS_KEY: "abc123xyz"

    restart: always
```

---

# 4️⃣ Added Global Type Declaration (`app/env.d.ts`)

### `app/env.d.ts`

```ts
declare global {
  interface Window {
    __ENV?: {
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_ANALYTICS_KEY?: string;
    };
  }
}

export {};
```

---

# 5️⃣ Updated `app/layout.tsx` to Load Runtime Config Script

### `app/layout.tsx`

```tsx
"use client";

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="/runtime-config.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

# 6️⃣ Updated `app/page.tsx` to Read Dynamic Variables

### `app/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    setApiUrl(window.__ENV?.NEXT_PUBLIC_API_URL || "");
  }, []);

  return (
    <div>
      <h1>Runtime Config</h1>
      <p>API_URL: {apiUrl}</p>
    </div>
  );
}
```

---

# 🚀 How It Works

1. Env vars injected into container  
2. `entrypoint.sh` generates runtime-config.js  
3. Next.js loads it via `<script>` tag  
4. Browser exposes env as `window.__ENV`  
5. Components read them dynamically  

---

# 🎉 Result

✔ No rebuilds required  
✔ Fully dynamic runtime configuration  
✔ Works in Docker, Compose, Kubernetes  
✔ Production-safe  

---

# 🚀 Commands

### Build and run

```sh
docker-compose up --build
```

