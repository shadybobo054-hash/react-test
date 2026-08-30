import type { Game } from "../types/game";
import type { Translation } from "../data/translations";

type Props = {
  game: Game;
  index: number;
  page: number;
  gamesPerPage: number;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  openGame: (game: Game) => void;
  t: Translation;
};

export default function GameCard({
  game,
  index,
  page,
  gamesPerPage,
  favorites,
  toggleFavorite,
  openGame,
  t
}: Props) {
  const isFavorite = favorites.includes(game.id);

  return (
    <article className="game-card">
      <div className="game-image">
        <img src={game.thumbnail} alt={game.title} loading="lazy" />
        <div className="image-shade" />

        <button
          type="button"
          className={`favorite ${isFavorite ? "active" : ""}`}
          onClick={() => toggleFavorite(game.id)}
          aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <div className="game-number">
          #{String((page - 1) * gamesPerPage + index + 1).padStart(2, "0")}
        </div>

        <button
          type="button"
          className="view-game"
          onClick={() => openGame(game)}
        >
          {t.details}
        </button>
      </div>

      <div className="game-body">
        <div className="game-top">
          <span>{game.genre || t.freeToPlay}</span>
          <div className="rating">FREE</div>
        </div>

        <h3>{game.title}</h3>

        <div className="game-meta">
          <span>📅 {game.release_date || t.comingSoon}</span>
          <span>🎮 {game.platform || t.platforms}</span>
        </div>

        <div className="game-platforms">
          <span>{game.publisher || t.publisher}</span>
          <span>{game.developer || t.developer}</span>
        </div>

        <button
          type="button"
          className="details-btn"
          onClick={() => openGame(game)}
        >
          {t.details}
          <span>→</span>
        </button>
      </div>
    </article>
  );
}