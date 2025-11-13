"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [apiUrl, setApiUrl] = useState<string | undefined>();

  useEffect(() => {
    setApiUrl(window.__ENV?.NEXT_PUBLIC_API_URL);
  }, []);

  return (
    <div>
      <h1>Runtime Config</h1>

      <p>API_URL: {apiUrl}</p>
    </div>
  );
}
