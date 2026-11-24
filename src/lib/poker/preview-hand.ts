import { DECK, type Card, type SeatHand } from "./cards";

export const SEAT_COUNT = 6;
export const PREVIEW_HANDS: readonly SeatHand[] = Array.from(
  { length: SEAT_COUNT },
  (_, seat): SeatHand => [DECK[seat * 8], DECK[seat * 8 + 1]],
);

// Fixed board: Q♠, 6♥, 10♣, 9♦, 5♠. Burn cards: 3♠, 2♣, 4♦.
// TODO: Replace this preview fixture with the simulation's deck state.
const previewCards = [
  ...PREVIEW_HANDS.map((hand) => hand[0]),
  ...PREVIEW_HANDS.map((hand) => hand[1]),
  DECK[2], DECK[11], DECK[18], DECK[35],
  DECK[27], DECK[47],
  DECK[42], DECK[4],
];
const previewCardIds = new Set(previewCards.map((card) => card.id));

export const PREVIEW_DECK: readonly Card[] = Object.freeze([
  ...previewCards,
  ...DECK.filter((card) => !previewCardIds.has(card.id)),
]);
