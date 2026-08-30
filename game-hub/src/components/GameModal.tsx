import type { Game } from "../types/game";
import type { Translation } from "../data/translations";

type Props = {
  game: Game | null;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  close: () => void;
  playGame: (game: Game) => void;
  t: Translation;
};

export default function GameModal({
  game,
  favorites,
  toggleFavorite,
  close,
  playGame,
  t
}: Props) {
  if (!game) {
    return null;
  }

  const isFavorite = favorites.includes(game.id);

  return (
    <div className="modal-backdrop" onClick={close}>
      <div
        className="game-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label={t.closeDetails}
        >
          ×
        </button>

        <img
          className="modal-image"
          src={game.thumbnail}
          alt={game.title}
        />

        <div className="modal-content">
          <span className="eyebrow">
            {t.gameDetails}
          </span>

          <h2>{game.title}</h2>

          <div className="modal-rating">
            {t.freeToPlay}
          </div>

          <div className="modal-info">
            <div>
              <span>{t.released}</span>
              <strong>
                {game.release_date || t.unknown}
              </strong>
            </div>

            <div>
              <span>{t.genre}</span>
              <strong>
                {game.genre || t.unknown}
              </strong>
            </div>

            <div>
              <span>{t.platforms}</span>
              <strong>
                {game.platform || t.unknown}
              </strong>
            </div>

            <div>
              <span>{t.developer}</span>
              <strong>
                {game.developer || t.unknown}
              </strong>
            </div>

            <div>
              <span>{t.publisher}</span>
              <strong>
                {game.publisher || t.unknown}
              </strong>
            </div>
          </div>

          <p className="modal-description">
            {game.short_description ||
              t.exploreDescription}
          </p>

          <button
            type="button"
            className="primary-btn modal-btn"
            onClick={() => toggleFavorite(game.id)}
          >
            {isFavorite
              ? t.removeFavorite
              : t.addFavorite}
          </button>

          <button
            type="button"
            className="secondary-btn modal-btn"
            onClick={() => playGame(game)}
          >
            🎮 {t.playNow}
          </button>
        </div>
      </div>
    </div>
  );
}