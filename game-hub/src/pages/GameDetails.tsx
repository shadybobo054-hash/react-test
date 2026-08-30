
import type { Game } from "../types/game";
import type { Translation } from "../data/translations";
import "./GameDetails.css";

type Props = {
  game: Game;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  playGame: (game: Game) => void;
  navigate: (
    page: "home" | "games" | "favorites" | "settings" | "details"
  ) => void;
  t: Translation;
};

export default function GameDetails({
  game,
  favorites,
  toggleFavorite,
  playGame,
  navigate,
  t,
}: Props) {
  const isFavorite = favorites.includes(game.id);

  return (
    <section className="game-details-page">
      {/* HERO */}
      <div className="details-hero">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="details-cover"
        />

        <div className="details-overlay" />
        <div className="details-glow" />

        <div className="details-content container">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("games")}
          >
            <span>←</span>
            {t.games}
          </button>

          <div className="details-main">
            <div className="details-info">
              <div className="details-top-line">
                <span className="details-badge">
                  {game.genre || t.freeToPlay}
                </span>

                <span className="free-badge">
                  FREE TO PLAY
                </span>
              </div>

              <h1>{game.title}</h1>

              <div className="details-meta">
                <span>
                  🎮 {game.platform || "PC"}
                </span>

                <span>•</span>

                <span>
                  📅 {game.release_date || "—"}
                </span>
              </div>

              <p className="details-description">
                {game.short_description ||
                  "Discover this amazing free-to-play game."}
              </p>

              <div className="details-actions">
                <button
                  type="button"
                  className="play-btn"
                  onClick={() => playGame(game)}
                >
                  <span className="play-icon">▶</span>
                  PLAY NOW
                </button>

                <button
                  type="button"
                  className={
                    isFavorite
                      ? "favorite-details active"
                      : "favorite-details"
                  }
                  onClick={() =>
                    toggleFavorite(game.id)
                  }
                >
                  <span className="heart">
                    {isFavorite ? "♥" : "♡"}
                  </span>

                  <span>
                    {isFavorite
                      ? t.removeFavorite
                      : t.addFavorite}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="details-body container">
        <div className="details-grid">

          {/* GAME INFORMATION */}
          <div className="details-panel">
            <div className="panel-heading">
              <span className="panel-line" />
              <h2>GAME INFORMATION</h2>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span>Genre</span>
                <strong>
                  {game.genre || "—"}
                </strong>
              </div>

              <div className="info-item">
                <span>Platform</span>
                <strong>
                  {game.platform || "—"}
                </strong>
              </div>

              <div className="info-item">
                <span>Publisher</span>
                <strong>
                  {game.publisher || "—"}
                </strong>
              </div>

              <div className="info-item">
                <span>Developer</span>
                <strong>
                  {game.developer || "—"}
                </strong>
              </div>

              <div className="info-item">
                <span>Release Date</span>
                <strong>
                  {game.release_date || "—"}
                </strong>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div className="details-panel">
            <div className="panel-heading">
              <span className="panel-line" />
              <h2>ABOUT THIS GAME</h2>
            </div>

            <p className="about-text">
              {game.short_description ||
                "No description available."}
            </p>

            <button
              type="button"
              className="details-play-wide"
              onClick={() => playGame(game)}
            >
              <span>▶</span>
              PLAY {game.title}
            </button>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="details-bottom-card">
          <img
            src={game.thumbnail}
            alt={game.title}
          />

          <div className="bottom-card-info">
            <span>READY TO PLAY?</span>
            <h3>{game.title}</h3>
          </div>

          <button
            type="button"
            onClick={() => playGame(game)}
          >
            PLAY NOW
          </button>
        </div>
      </div>
    </section>
  );
}
