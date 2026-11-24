import { PlayingCard } from "@/components/playing-card";
import { DECK } from "@/lib/poker/cards";

function Seat({ number, position }: { number: number; position: string }) {
  const cardIndex = (number - 1) * 8;

  return (
    <div className={`table-seat seat-${position}`}>
      <div className="seat-cards">
        <PlayingCard card={DECK[cardIndex]} />
        <PlayingCard card={DECK[cardIndex + 1]} />
      </div>
      <div className="seat-label">
        <span className="seat-avatar">{String(number).padStart(2, "0")}</span>
        <span><b>{`Seat ${String(number).padStart(2, "0")}`}</b></span>
      </div>
    </div>
  );
}

export function SimulatorScreen() {
  return (
    <div>
      <main className="main-content">
        <section id="table" aria-label="Poker table">
          <div className="section-heading">
            <span className="table-format">No-limit Hold’em <span> / </span> 6 seats</span>
          </div>
          <div className="simulation-layout">
            <div className="table-panel">
              <div className="table-panel-top"></div>
              <div className="table-scene">
                <div className="poker-table">
                  <div className="felt-inset">
                    <div className="board-area">
                      <div className="pot-label">COMMUNITY CARDS</div>
                      <div className="community-cards">
                        {["Flop card 1", "Flop card 2", "Flop card 3", "Turn", "River"].map((label) => (
                          <div key={label} className="empty-card" role="img" aria-label={`${label}: empty`}><span aria-hidden="true">+</span></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Seat number={1} position="top" />
                <Seat number={2} position="upper-right" />
                <Seat number={3} position="lower-right" />
                <Seat number={4} position="bottom" />
                <Seat number={5} position="lower-left" />
                <Seat number={6} position="upper-left" />
              </div>
              <div className="table-footer">
                <button className="simulation-button" disabled title="Simulation functionality is not implemented yet"><span>▷</span> Run simulation <span className="soon-label">SOON</span></button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
