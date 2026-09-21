"use client";

import { useEffect, useState, type ReactNode } from "react";

// Mount only while loading. Fast requests unmount this before the timer fires.
// This detects slow loading, not the connection type (which isn't reliable across browsers).
export function DelayedLoading({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  return visible ? children : null;
}
