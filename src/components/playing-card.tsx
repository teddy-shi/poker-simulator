import { cardLabel, SUIT_DETAILS, type Card } from "@/lib/poker/cards";

type PlayingCardProps = { card: Card };

export function PlayingCard({ card }: PlayingCardProps) {
  const { symbol, color } = SUIT_DETAILS[card.suit];

  return (
    <span role="img" aria-label={cardLabel(card)} className={`playing-card ${color === "red" ? "card-red" : ""}`}>
      <span className="card-corner" aria-hidden="true"><b>{card.rank}</b><span>{symbol}</span></span>
      <span className="card-center" aria-hidden="true">
        <span className="card-suit-symbol">{symbol}</span>
      </span>
      <span className="card-corner corner-bottom" aria-hidden="true"><b>{card.rank}</b><span>{symbol}</span></span>
    </span>
  );
}
