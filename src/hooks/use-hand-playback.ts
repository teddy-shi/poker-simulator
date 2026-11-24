"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { flushSync } from "react-dom";
import type { Card } from "@/lib/poker/cards";
import { useHandDeal } from "@/hooks/use-hand-deal";

type HandPlaybackOptions = {
  sceneRef: RefObject<HTMLDivElement | null>;
  deckRef: RefObject<readonly Card[]>;
  shuffleAndRedeal: () => Promise<void>;
};
type Phase = "idle" | "preparing" | "dealing" | "complete";
const EMPTY_BOARD: readonly (Card | null)[] = [null, null, null, null, null];

export function useHandPlayback({ sceneRef, deckRef, shuffleAndRedeal }: HandPlaybackOptions) {
  const getHandDeal = useHandDeal();
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [burns, setBurns] = useState<readonly Card[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState("Cards ready.");
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);
  const inFlight = useRef<Promise<void> | null>(null);
  const animations = useRef(new Set<Animation>());
  const pauses = useRef(new Map<ReturnType<typeof setTimeout>, () => void>());

  useEffect(() => {
    mounted.current = true;
    const activeAnimations = animations.current;
    const activePauses = pauses.current;
    return () => {
      mounted.current = false;
      activeAnimations.forEach((animation) => animation.cancel());
      activeAnimations.clear();
      activePauses.forEach((resolve, timer) => { clearTimeout(timer); resolve(); });
      activePauses.clear();
    };
  }, []);

  const simulateHand = useCallback((): Promise<void> => {
    if (inFlight.current) return inFlight.current;
    if (!mounted.current) return Promise.resolve();

    const performHand = async () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pause = () => new Promise<void>((resolve) => {
        if (reduceMotion) { resolve(); return; }
        const timer = setTimeout(() => { pauses.current.delete(timer); resolve(); }, 240);
        pauses.current.set(timer, resolve);
      });
      try {
        setPhase("preparing");
        setStatus("Preparing hand…");
        setError(null);
        setBoard(EMPTY_BOARD);
        setBurns([]);
        await shuffleAndRedeal();
        if (!mounted.current) return;

        const steps = getHandDeal(deckRef.current);
        // TODO: Run betting, evaluation, and statistics through the simulation engine.
        // This hook only plays the burn/flop/turn/river visual sequence.
        setPhase("dealing");
        for (const step of steps) {
          if (!mounted.current) return;
          flushSync(() => {
            setStatus(step.kind === "burn" ? `Burning before the ${step.street}…` : `Dealing the ${step.street}…`);
            if (step.kind === "burn") setBurns((previous) => [...previous, step.card]);
            else setBoard((previous) => previous.map((card, slot) => slot === step.slot ? step.card : card));
          });
          const scene = sceneRef.current;
          const card = scene?.querySelector<HTMLElement>(`[data-hand-card="${step.kind}-${step.slot}"]`);
          const origin = scene?.querySelector<HTMLElement>("[data-shuffle-origin]");
          if (!reduceMotion && card && origin && typeof card.animate === "function") {
            const from = origin.getBoundingClientRect();
            const to = card.getBoundingClientRect();
            const x = from.left + from.width / 2 - to.left - to.width / 2;
            const y = from.top + from.height / 2 - to.top - to.height / 2;
            const animation = card.animate([
              { transform: `translate(${x}px, ${y}px) rotate(-8deg) scale(.85)` },
              { transform: "translate(0, 0) rotate(0deg) scale(1)" },
            ], { duration: 380, fill: "both", easing: "cubic-bezier(.22,.7,.25,1)" });
            animations.current.add(animation);
            await animation.finished;
            animation.cancel();
            animations.current.delete(animation);
          }
          if (!mounted.current) return;
          await pause();
        }
        if (mounted.current) {
          setStatus("Hand complete. Five community cards dealt; three cards burned.");
          setPhase("complete");
        }
      } catch {
        if (mounted.current) {
          setError("Hand playback interrupted. Try Simulate hand again.");
          setPhase("idle");
        }
      } finally {
        animations.current.forEach((animation) => animation.cancel());
        animations.current.clear();
      }
    };
    const run = performHand().finally(() => { inFlight.current = null; });
    inFlight.current = run;
    return run;
  }, [deckRef, getHandDeal, sceneRef, shuffleAndRedeal]);

  return { board, burns, phase, status, error, simulateHand, isPlaying: phase === "preparing" || phase === "dealing" };
}
