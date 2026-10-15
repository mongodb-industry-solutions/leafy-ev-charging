"use client";

import { useEffect, useState } from "react";

let cachedCartoApiKey: string | null = null;
let cartoApiKeyRequest: Promise<string> | null = null;

function loadCartoApiKey(): Promise<string> {
  if (cachedCartoApiKey !== null) {
    return Promise.resolve(cachedCartoApiKey);
  }

  if (cartoApiKeyRequest === null) {
    cartoApiKeyRequest = fetch("/api/config")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const key =
          data && typeof data.cartoApiKey === "string" ? data.cartoApiKey : "";
        cachedCartoApiKey = key || null;
        return key;
      })
      .catch(() => {
        cachedCartoApiKey = null;
        return "";
      })
      .finally(() => {
        cartoApiKeyRequest = null;
      });
  }

  return cartoApiKeyRequest;
}

export function useCartoApiKey(): string {
  const [cartoApiKey, setCartoApiKey] = useState<string>(
    cachedCartoApiKey ?? ""
  );

  useEffect(() => {
    let active = true;
    void loadCartoApiKey().then((key) => {
      if (active) {
        setCartoApiKey(key);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return cartoApiKey;
}
