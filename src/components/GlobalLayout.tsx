"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import NavigationPanel from "./NavigationPanel";
import BreathingOrbs from "./BreathingOrbs";

export default function GlobalLayout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />
      <NavigationPanel />
      <BreathingOrbs />
    </>
  );
}
