"use client";

import { useCallback } from "react";
import type { Card } from "@/lib/poker/cards";
import { SEAT_COUNT } from "@/lib/poker/preview-hand";

export type HandDealStep = Readonly<{
  kind: "burn" | "board";
  street: "flop" | "turn" | "river";
  slot: number;
  card: Card;
}>;

/** Supplies the cards for visual playback without evaluating the hand. */
export function useHandDeal() {
  return useCallback((deck: readonly Card[]): readonly HandDealStep[] => {
    // TODO: Read the deck cursor and street actions from your simulation algorithm.
    // The first 12 cards are the players' hands; consume the next 8 in order.
    const start = SEAT_COUNT * 2;
    return [
      { kind: "burn", street: "flop", slot: 0, card: deck[start] },
      { kind: "board", street: "flop", slot: 0, card: deck[start + 1] },
      { kind: "board", street: "flop", slot: 1, card: deck[start + 2] },
      { kind: "board", street: "flop", slot: 2, card: deck[start + 3] },
      { kind: "burn", street: "turn", slot: 1, card: deck[start + 4] },
      { kind: "board", street: "turn", slot: 3, card: deck[start + 5] },
      { kind: "burn", street: "river", slot: 2, card: deck[start + 6] },
      { kind: "board", street: "river", slot: 4, card: deck[start + 7] },
    ];
  }, []);
}
