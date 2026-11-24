import { cardLabel, SUIT_DETAILS, type Card } from "@/lib/poker/cards";

type PlayingCardProps = { card?: Card; faceDown?: boolean; className?: string };

export function PlayingCard({ card, faceDown = false, className = "" }: PlayingCardProps) {
  if (faceDown || !card) {
    return (
      <span role="img" aria-label="Face-down card" className={`playing-card card-back ${className}`}>
        <span className="back-emblem" aria-hidden="true">♠</span>
      </span>
    );
  }

  const { symbol, color } = SUIT_DETAILS[card.suit];

  return (
    <span role="img" aria-label={cardLabel(card)} className={`playing-card ${color === "red" ? "card-red" : ""} ${className}`}>
      <span className="card-corner" aria-hidden="true"><b>{card.rank}</b><span>{symbol}</span></span>
      <span className="card-center" aria-hidden="true">
        <span className="card-suit-symbol">{symbol}</span>
      </span>
      <span className="card-corner corner-bottom" aria-hidden="true"><b>{card.rank}</b><span>{symbol}</span></span>
    </span>
  );
}
