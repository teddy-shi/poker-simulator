"use client";

import { useCallback } from "react";
import type { Card } from "@/lib/poker/cards";

/** Replace this placeholder with your shuffle implementation. */
export function useShuffleDeck() {
  return useCallback((deck: readonly Card[]): readonly Card[] => {
    // TODO: Implement shuffling in a pure TypeScript helper and call it here.
    // Return all 52 unique cards without mutating the input deck.
    // Until then, keep the card order unchanged so the animation uses fixed hands.
    return deck;
  }, []);
}
