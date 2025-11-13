#!/bin/sh
set -e

# Build window.__ENV object from env vars you want exposed to client
cat <<EOF > /app/public/runtime-config.js
window.__ENV = {
  NEXT_PUBLIC_API_URL: "${NEXT_PUBLIC_API_URL:-}",
  NEXT_PUBLIC_ANALYTICS_KEY: "${NEXT_PUBLIC_ANALYTICS_KEY:-}"
};
EOF

# Optionally write server-only envs to a file or leave in process.env

# Start Next in production
# If you use next start:
npm run start
# or if using a custom server: node server.js
