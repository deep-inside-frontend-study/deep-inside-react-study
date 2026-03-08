"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/constants/config";

const SERVICE_WORKER_URL = `${BASE_PATH}/sw.js`;
const SERVICE_WORKER_SCOPE = BASE_PATH ? `${BASE_PATH}/` : "/";

export function PwaBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker
      .register(SERVICE_WORKER_URL, {
        scope: SERVICE_WORKER_SCOPE,
        updateViaCache: "none",
      })
      .catch((error) => {
        console.warn("Failed to register service worker:", error);
      });
  }, []);

  return null;
}
