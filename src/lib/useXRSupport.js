"use client";

import { useEffect, useState } from "react";

export function useXRSupport() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.xr) return;
    navigator.xr
      .isSessionSupported("immersive-vr")
      .then(setSupported)
      .catch(() => setSupported(false));
  }, []);

  return supported;
}
