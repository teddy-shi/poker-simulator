export const SUITS = ["spades", "hearts", "clubs", "diamonds"] as const;
export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

export type Suit = (typeof SUITS)[number];
export type Rank = (typeof RANKS)[number];
export type Card = Readonly<{ id: `${Rank}-${Suit}`; rank: Rank; suit: Suit }>;

export const SUIT_DETAILS = {
  spades: { symbol: "♠", name: "Spades", color: "black" },
  hearts: { symbol: "♥", name: "Hearts", color: "red" },
  clubs: { symbol: "♣", name: "Clubs", color: "black" },
  diamonds: { symbol: "♦", name: "Diamonds", color: "red" },
} as const;

export const RANK_NAMES: Record<Rank, string> = {
  A: "Ace", "2": "Two", "3": "Three", "4": "Four", "5": "Five",
  "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine", "10": "Ten",
  J: "Jack", Q: "Queen", K: "King",
};

// Standard deck without jokers
export const DECK: readonly Card[] = Object.freeze(
  SUITS.flatMap((suit) =>
    RANKS.map((rank): Card => Object.freeze({ id: `${rank}-${suit}`, rank, suit })),
  ),
);

export function cardLabel(card: Card): string {
  return `${RANK_NAMES[card.rank]} of ${SUIT_DETAILS[card.suit].name}`;
}
