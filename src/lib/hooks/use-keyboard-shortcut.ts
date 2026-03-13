"use client";

import { useEffect } from "react";

type ModifierKey = "meta" | "ctrl" | "alt" | "shift";

interface KeyboardShortcutOptions {
  /** The key to listen for (e.g. "k", "Escape") */
  key: string;
  /** Modifier keys that must be held (defaults to none) */
  modifiers?: ModifierKey[];
  /** Whether to call event.preventDefault() (default: true) */
  preventDefault?: boolean;
  /** Skip when focus is inside an input, textarea, or select */
  ignoreInputs?: boolean;
}

/**
 * Registers a global keyboard shortcut that calls the provided handler.
 *
 * @param handler - Callback invoked when the shortcut is triggered
 * @param options - Shortcut configuration (key, modifiers, etc.)
 *
 * @example
 * useKeyboardShortcut(() => inputRef.current?.focus(), {
 *   key: "k",
 *   modifiers: ["meta"],
 * });
 */
export function useKeyboardShortcut(
  handler: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions
) {
  const {
    key,
    modifiers = [],
    preventDefault = true,
    ignoreInputs = true,
  } = options;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (ignoreInputs) {
        const tag = (event.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
      }

      const metaOk = modifiers.includes("meta") ? event.metaKey || event.ctrlKey : true;
      const ctrlOk = modifiers.includes("ctrl") ? event.ctrlKey : true;
      const altOk = modifiers.includes("alt") ? event.altKey : true;
      const shiftOk = modifiers.includes("shift") ? event.shiftKey : true;

      // Ensure no unexpected modifiers are held when not required
      const noExtraModifiers =
        (modifiers.includes("meta") || (!event.metaKey && !event.ctrlKey)) &&
        (modifiers.includes("alt") || !event.altKey) &&
        (modifiers.includes("shift") || !event.shiftKey);

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        metaOk &&
        ctrlOk &&
        altOk &&
        shiftOk &&
        noExtraModifiers
      ) {
        if (preventDefault) event.preventDefault();
        handler(event);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handler, key, modifiers, preventDefault, ignoreInputs]);
}
