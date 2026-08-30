import type { Game } from "../types/game";
import type { Translation } from "../data/translations";
import GameCard from "../components/GameCard";

type Props = {
  games: Game[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  openGame: (game: Game) => void;
  navigate: (page: "games") => void;
  t: Translation;
};

export default function Favorites({
  games,
  favorites,
  toggleFavorite,
  openGame,
  navigate,
  t
}: Props) {
  const favoriteGames = games.filter((game) => favorites.includes(game.id));

  return (
    <section className="favorites-page page-section">
      <div className="container">
        <div className="favorites-header">
          <div>
            <span className="eyebrow">{t.yourCollection}</span>
            <h2>{t.yourFavorites}</h2>
            <p>
              {favorites.length
                ? `${t.favoritesMessage} ${favorites.length} ${t.saved}`
                : t.savedMessage}
            </p>
          </div>

          <div className="favorite-count">
            <strong>{favorites.length}</strong>
            <span>{t.savedGames}</span>
          </div>
        </div>

        {favoriteGames.length === 0 ? (
          <div className="empty-box favorites-empty">
            <div>❤️</div>
            <h3>{t.noFavorites}</h3>
            <p>{t.noFavoritesDescription}</p>
            <button type="button" onClick={() => navigate("games")}>
              {t.browseGames}
            </button>
          </div>
        ) : (
          <div className="games-grid favorites-grid">
            {favoriteGames.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                page={1}
                gamesPerPage={favoriteGames.length}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                openGame={openGame}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}