"use client";

import { PlayingCard } from "@/components/playing-card";
import { useTableRedeal, type SeatHand } from "@/hooks/use-table-redeal";

function Seat({ number, position, cards }: { number: number; position: string; cards: SeatHand }) {
  return (
    <div className={`table-seat seat-${position}`}>
      <div className="seat-cards">
        {cards.map((card, slot) => (
          <span className="dealt-card" data-dealt-card key={slot}>
            <PlayingCard card={card} />
          </span>
        ))}
      </div>
      <div className="seat-label">
        <span className="seat-avatar">{String(number).padStart(2, "0")}</span>
        <span><b>{`Seat ${String(number).padStart(2, "0")}`}</b></span>
      </div>
    </div>
  );
}

function DealerStation() {
  return (
    <div className="dealer-station" aria-label="Dealer station">
      <div className="dealer-identity">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 28v-3a11 11 0 0 1 22 0v3M11 17l5 11 5-11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="m12 17 4 2 4-2v5l-4-2-4 2z" fill="currentColor" />
        </svg>
        <span>Dealer</span>
      </div>
      <div className="dealer-deck-zone" data-shuffle-origin aria-label="Dealer shuffle area">
        <span aria-hidden="true">♠</span>
      </div>
    </div>
  );
}

export function SimulatorScreen() {
  const { hands, phase, error, sceneRef, shuffleAndRedeal, isRedealing } = useTableRedeal();
  const phaseLabel = { idle: "Shuffle & redeal", collecting: "Collecting cards…", shuffling: "Shuffling…", dealing: "Dealing…" }[phase];

  return (
    <main className="main-content">
      <section id="table" aria-label="Poker table">
        <div className="section-heading">
          <span className="table-format">No-limit Hold’em <span> / </span> 6 seats</span>
        </div>
        <div className="simulation-layout">
          <div className="table-panel">
            <div className="table-scene" ref={sceneRef} data-phase={phase} aria-busy={isRedealing}>
              <div className="poker-table">
                <div className="felt-inset">
                  <div className="board-area">
                    <div className="pot-label">COMMUNITY CARDS</div>
                    <div className="community-cards">
                      {/* TODO: Render community cards from simulation state when the engine is implemented. */}
                      {["Flop card 1", "Flop card 2", "Flop card 3", "Turn", "River"].map((label) => (
                        <div key={label} className="empty-card" role="img" aria-label={`${label}: empty`}><span aria-hidden="true">+</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DealerStation />
              <Seat cards={hands[0]} number={1} position="upper-right" />
              <Seat cards={hands[1]} number={2} position="lower-right" />
              <Seat cards={hands[2]} number={3} position="bottom-right" />
              <Seat cards={hands[3]} number={4} position="bottom-left" />
              <Seat cards={hands[4]} number={5} position="lower-left" />
              <Seat cards={hands[5]} number={6} position="upper-left" />
            </div>
            <div className="table-footer">
              {/* TODO: Wire Run simulation to the engine and await shuffleAndRedeal() after each run.
                  Remove the temporary shuffle button once that integration is ready. */}
              <button className="simulation-button" disabled title="Simulation functionality is not implemented yet"><span>▷</span> Run simulation <span className="soon-label">SOON</span></button>
              <button className="shuffle-button" type="button" onClick={() => void shuffleAndRedeal()} disabled={isRedealing}>
                {phaseLabel}
              </button>
              <span className="visually-hidden" role="status">{error ?? (isRedealing ? phaseLabel : "Cards ready.")}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
