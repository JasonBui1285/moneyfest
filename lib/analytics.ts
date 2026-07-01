"use client";

type EventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, parameters: EventParameters = {}) {
  window.gtag?.("event", name, parameters);
}
