"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { DECK, type Card } from "@/lib/poker/cards";
import { useShuffleDeck } from "@/hooks/use-shuffle-deck";

type Phase = "idle" | "collecting" | "shuffling" | "dealing";
export type SeatHand = readonly [Card, Card];

const SEAT_COUNT = 6;
const INITIAL_HANDS: readonly SeatHand[] = Array.from(
  { length: SEAT_COUNT },
  (_, seat): SeatHand => [DECK[seat * 8], DECK[seat * 8 + 1]],
);

// Preserve the existing preview hands in round-robin deal order.
const previewCards = [
  ...INITIAL_HANDS.map((hand) => hand[0]),
  ...INITIAL_HANDS.map((hand) => hand[1]),
];
const previewCardIds = new Set(previewCards.map((card) => card.id));
const PREVIEW_DECK: readonly Card[] = Object.freeze([
  ...previewCards,
  ...DECK.filter((card) => !previewCardIds.has(card.id)),
]);

/** Presentation trigger; the shuffle hook controls the actual card order. */
export function useTableRedeal() {
  const shuffleDeck = useShuffleDeck();
  const [hands, setHands] = useState(INITIAL_HANDS);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const inFlight = useRef<Promise<void> | null>(null);
  const animations = useRef(new Set<Animation>());

  useEffect(() => {
    mounted.current = true;
    const activeAnimations = animations.current;
    return () => {
      mounted.current = false;
      activeAnimations.forEach((animation) => animation.cancel());
      activeAnimations.clear();
    };
  }, []);

  const shuffleAndRedeal = useCallback((): Promise<void> => {
    // A button click and a simulation completion share the same run while busy.
    if (inFlight.current) return inFlight.current;
    if (!mounted.current) return Promise.resolve();

    const performRedeal = async () => {
      setError(null);
      const deck = shuffleDeck(PREVIEW_DECK);
      // Deal one card to each seat, then a second card to each seat.
      const nextHands = Array.from(
        { length: SEAT_COUNT },
        (_, seat): SeatHand => [deck[seat], deck[seat + SEAT_COUNT]],
      );
      const scene = sceneRef.current;
      const cards = Array.from(scene?.querySelectorAll<HTMLElement>("[data-dealt-card]") ?? []);
      const shuffleOrigin = scene?.querySelector<HTMLElement>("[data-shuffle-origin]");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!scene || !shuffleOrigin || reduceMotion || cards.length !== SEAT_COUNT * 2 || !cards.every((card) => typeof card.animate === "function")) {
        setHands(nextHands);
        return;
      }

      const table = scene.querySelector(".felt-inset") ?? scene;
      const tableBounds = table.getBoundingClientRect();
      const originBounds = shuffleOrigin.getBoundingClientRect();
      const originX = originBounds.left + originBounds.width / 2;
      const originY = originBounds.top + originBounds.height / 2;
      const targets = cards.map((card, index) => {
        const bounds = card.getBoundingClientRect();
        const x = originX - bounds.left - bounds.width / 2;
        const y = originY - bounds.top - bounds.height / 2;
        const tilt = (index - 5.5) * 1.1;
        return { card, x, y, tilt };
      });
      const stackTransform = (x: number, y: number, tilt: number) =>
        `translate(${x}px, ${y}px) rotate(${tilt}deg) scale(.9)`;
      const play = (card: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
        const animation = card.animate(frames, { fill: "both", easing: "cubic-bezier(.22,.7,.25,1)", ...options });
        animations.current.add(animation);
        return animation.finished;
      };

      try {
        setPhase("collecting");
        await Promise.all(targets.map(({ card, x, y, tilt }, index) => play(card, [
          { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          { transform: stackTransform(x, y, tilt) },
        ], { duration: 320, delay: index * 16 })));
        if (!mounted.current) return;

        setPhase("shuffling");
        await Promise.all(targets.map(({ card, x, y, tilt }, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          const spread = Math.min(tableBounds.width * .12, 80) * direction;
          return play(card, [
            { transform: stackTransform(x, y, tilt) },
            { transform: stackTransform(x + spread, y - 15, direction * 18), offset: .23 },
            { transform: stackTransform(x, y, -tilt), offset: .46 },
            { transform: stackTransform(x - spread, y + 10, -direction * 15), offset: .7 },
            { transform: stackTransform(x, y, tilt) },
          ], { duration: 820 });
        }));
        if (!mounted.current) return;

        // Commit the new faces while cards are still stacked at the dealer.
        // Card wrappers stay mounted, so their animation transforms are preserved.
        flushSync(() => {
          setHands(nextHands);
          setPhase("dealing");
        });
        await Promise.all(targets.map(({ card, x, y, tilt }, index) => {
          const seat = Math.floor(index / 2);
          const round = index % 2;
          return play(card, [
            { transform: stackTransform(x, y, tilt) },
            { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          ], { duration: 360, delay: (round * SEAT_COUNT + seat) * 85 });
        }));
      } catch {
        // Unmount cancels pending animations and rejects their finished promises.
        if (mounted.current) {
          setHands(nextHands);
          setError("Animation interrupted. Cards have been redealt.");
        }
      } finally {
        animations.current.forEach((animation) => animation.cancel());
        animations.current.clear();
        if (mounted.current) setPhase("idle");
      }
    };

    const run = performRedeal().finally(() => {
      inFlight.current = null;
    });
    inFlight.current = run;
    return run;
  }, [shuffleDeck]);

  return { hands, phase, error, sceneRef, shuffleAndRedeal, isRedealing: phase !== "idle" };
}
