import { useMemo } from "react";
import type { Game } from "../types/game";
import type { Translation } from "../data/translations";

type Props = {
  games: Game[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  openGame: (game: Game) => void;
  playGame: (game: Game) => void;
  navigate: (page: "games" | "favorites") => void;
  setGenre: (genre: string) => void;
  t: Translation;
};

export default function Home({
  games,
  favorites,
  toggleFavorite,
  openGame,
  playGame,
  navigate,
  setGenre,
  t,
}: Props) {
  const featuredGames = games.slice(0, 4);

  const trendingGames = games.slice(0, 4);

  const topRatedGames = useMemo(() => {
    return [...games]
      .sort((a, b) => {
        const ratingA = Number((a as Game & { rating?: number }).rating || 0);
        const ratingB = Number((b as Game & { rating?: number }).rating || 0);
        return ratingB - ratingA;
      })
      .slice(0, 4);
  }, [games]);

  const genres = Array.from(
    new Set(games.map((game) => game.genre).filter(Boolean))
  ).slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-mouse-glow" />

        <div className="container hero-content">
          <div className="hero-copy">
            <div className="hero-badge">
              <span />
              {t.nextGeneration}
            </div>

            <h1>
              {t.discoverNext}
              <strong>{t.nextGame}</strong>
            </h1>

            <p>{t.heroDescription}</p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => navigate("games")}
              >
                {t.explore}
                <span>→</span>
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("favorites")}
              >
                {t.viewFavorites}
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-glow" />
            <div className="hero-controller">🎮</div>

            <div className="hero-card-text">
              <span>{t.readyPlayer}</span>
              <strong>{t.levelUp}</strong>
              <small>{t.collection}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="home-featured-games">
        <div className="container">
          <div className="featured-games-heading">
            <div>
              <span className="featured-kicker">
                DISCOVER
              </span>

              <h2>GAMES</h2>

              <p>
                Explore the most popular games in our collection
              </p>
            </div>

            <button
              type="button"
              className="featured-view-all"
              onClick={() => navigate("games")}
            >
              VIEW ALL
              <span>→</span>
            </button>
          </div>

          <div className="featured-games-grid">
            {featuredGames.map((game) => {
              const isFavorite = favorites.includes(game.id);

              return (
                <article
                  className="featured-game-card"
                  key={game.id}
                >
                  <div
                    className="featured-game-image"
                    onClick={() => openGame(game)}
                  >
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      loading="lazy"
                    />

                    <div className="featured-game-shade" />

                    <span className="featured-free">
                      FREE
                    </span>

                    <button
                      type="button"
                      className={`featured-favorite ${
                        isFavorite ? "active" : ""
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(game.id);
                      }}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>

                    <div className="featured-play">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          playGame(game);
                        }}
                      >
                        ▶
                      </button>
                    </div>
                  </div>

                  <div className="featured-game-body">
                    <div className="featured-game-info">
                      <h3>{game.title}</h3>

                      <span>
                        {game.genre || "Action"}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="featured-details"
                      onClick={() => openGame(game)}
                    >
                      DETAILS
                      <span>→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-simple">
        <div className="container">
          <div className="home-dashboard-grid">
            <div className="trending-panel">
              <div className="dashboard-heading">
                <div className="dashboard-title">
                  <span className="dashboard-dot" />
                  <strong>TRENDING NOW</strong>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("games")}
                >
                  View All <span>→</span>
                </button>
              </div>

              <div className="trending-grid">
                {trendingGames.map((game) => {
                  const isFavorite = favorites.includes(game.id);

                  return (
                    <article
                      className="mini-game-card"
                      key={game.id}
                    >
                      <div
                        className="mini-game-image"
                        onClick={() => openGame(game)}
                      >
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          loading="lazy"
                        />

                        <button
                          type="button"
                          className={`mini-favorite ${
                            isFavorite ? "active" : ""
                          }`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(game.id);
                          }}
                        >
                          {isFavorite ? "♥" : "♡"}
                        </button>
                      </div>

                      <div className="mini-game-body">
                        <h3>{game.title}</h3>

                        <span className="mini-game-genre">
                          {game.genre || "Action"}
                        </span>

                        <div className="mini-game-bottom">
                          <span>FREE</span>

                          <button
                            type="button"
                            onClick={() => openGame(game)}
                          >
                            →
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rated-panel">
              <div className="dashboard-heading">
                <div className="dashboard-title">
                  <span className="dashboard-star">★</span>
                  <strong>TOP RATED</strong>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("games")}
                >
                  View All <span>→</span>
                </button>
              </div>

              <div className="rated-list">
                {topRatedGames.map((game, index) => {
                  const rating =
                    Number(
                      (game as Game & { rating?: number }).rating
                    ) || 4.7 - index * 0.2;

                  return (
                    <button
                      type="button"
                      className="rated-item"
                      key={game.id}
                      onClick={() => openGame(game)}
                    >
                      <span className="rated-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        loading="lazy"
                      />

                      <span className="rated-info">
                        <strong>{game.title}</strong>

                        <small>
                          {game.genre || "Action"}
                        </small>
                      </span>

                      <span className="rated-score">
                        ★ {rating.toFixed(1)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {genres.length > 0 && (
            <section className="simple-genres">
              <div className="dashboard-heading genre-heading">
                <div className="dashboard-title">
                  <span className="dashboard-dot" />
                  <strong>BROWSE BY GENRE</strong>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("games")}
                >
                  View All <span>→</span>
                </button>
              </div>

              <div className="dashboard-genre-grid">
                {genres.map((genre, index) => {
                  const count = games.filter(
                    (game) => game.genre === genre
                  ).length;

                  const icons = [
                    "✦",
                    "◆",
                    "◈",
                    "♟",
                    "♛",
                    "◎",
                  ];

                  return (
                    <button
                      type="button"
                      className="dashboard-genre-card"
                      key={genre}
                      onClick={() => {
                        setGenre(genre);
                        navigate("games");
                      }}
                    >
                      <span
                        className={`dashboard-genre-icon genre-color-${index}`}
                      >
                        {icons[index]}
                      </span>

                      <span className="dashboard-genre-info">
                        <strong>{genre}</strong>
                        <small>{count} Games</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <div className="simple-library">
            <div>
              <span className="simple-label">
                {t.yourLibrary}
              </span>

              <h2>
                {favorites.length
                  ? `${favorites.length} ${t.saved}`
                  : t.viewFavorites}
              </h2>

              <p>{t.libraryDescription}</p>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("favorites")}
            >
              {t.viewCollection}
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}