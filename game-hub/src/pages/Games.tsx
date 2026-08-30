import { useEffect, useMemo, useState } from "react";
import type { Game } from "../types/game";
import type { Translation } from "../data/translations";
import GameCard from "../components/GameCard";
import Pagination from "../components/Pagination";

type Props = {
  games: Game[];
  loading: boolean;
  error: string;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  openGame: (game: Game) => void;
  loadGames: () => void;
  t: Translation;
  selectedGenre: string;
};

export default function Games({
  games,
  loading,
  error,
  favorites,
  toggleFavorite,
  openGame,
  loadGames,
  t,
  selectedGenre
}: Props) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(selectedGenre);
  const [platform, setPlatform] = useState("All");
  const [page, setPage] = useState(1);

  const gamesPerPage = 12;

  useEffect(() => {
    setGenre(selectedGenre);
    setPage(1);
  }, [selectedGenre]);

  useEffect(() => {
    setPage(1);
  }, [search, genre, platform]);

  const genres = useMemo(() => {
    const values = games
      .map((game) => game.genre)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [games]);

  const platforms = useMemo(() => {
    const values = games
      .map((game) => game.platform)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [games]);

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    return games.filter((game) => {
      const title = game.title?.toLowerCase() || "";
      const description =
        game.short_description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query);

      const matchesGenre =
        genre === "All" || game.genre === genre;

      const matchesPlatform =
        platform === "All" ||
        game.platform === platform;

      return (
        matchesSearch &&
        matchesGenre &&
        matchesPlatform
      );
    });
  }, [games, search, genre, platform]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGames.length / gamesPerPage)
  );

  const safePage = Math.min(page, totalPages);

  const visibleGames = filteredGames.slice(
    (safePage - 1) * gamesPerPage,
    safePage * gamesPerPage
  );

  const paginationPages = useMemo(() => {
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    let start = Math.max(1, safePage - 3);
    let end = Math.min(
      totalPages,
      start + maxVisible - 1
    );

    if (end - start + 1 < maxVisible) {
      start = Math.max(
        1,
        end - maxVisible + 1
      );
    }

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }, [safePage, totalPages]);

  function resetFilters() {
    setSearch("");
    setGenre("All");
    setPlatform("All");
    setPage(1);
  }

  const firstVisible =
    filteredGames.length === 0
      ? 0
      : (safePage - 1) * gamesPerPage + 1;

  const lastVisible = Math.min(
    safePage * gamesPerPage,
    filteredGames.length
  );

  return (
    <section className="games-section page-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {t.discover}
            </span>

            <h2>{t.exploreGames}</h2>

            <p>{t.exploreDescription}</p>
          </div>

          {!loading && !error && (
            <div className="results-counter">
              <strong>{filteredGames.length}</strong>
              <span>{t.gamesFound}</span>
            </div>
          )}
        </div>

        <div className="controls">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="search"
              placeholder={t.search}
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label={t.clearSearch}
              >
                ×
              </button>
            )}
          </div>

          <select
            value={genre}
            onChange={(event) =>
              setGenre(event.target.value)
            }
          >
            {genres.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "All"
                  ? t.allGenres
                  : item}
              </option>
            ))}
          </select>

          <select
            value={platform}
            onChange={(event) =>
              setPlatform(event.target.value)
            }
          >
            {platforms.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "All"
                  ? t.allPlatforms
                  : item}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="reset-btn"
            onClick={resetFilters}
          >
            {t.reset}
          </button>
        </div>

        {!loading &&
          !error &&
          filteredGames.length > 0 && (
            <div className="results-bar">
              <span>
                {t.showing}{" "}
                <strong>{firstVisible}</strong>{" "}
                —{" "}
                <strong>{lastVisible}</strong>{" "}
                {t.of}{" "}
                <strong>
                  {filteredGames.length}
                </strong>{" "}
                {t.gamesFound}
              </span>
            </div>
          )}

        {loading && (
          <div className="loading-box">
            <div className="loader" />

            <strong>{t.loading}</strong>

            <span>{t.connecting}</span>
          </div>
        )}

        {!loading && error && (
          <div className="error-box">
            <strong>
              {t.connectionError}
            </strong>

            <p>{error}</p>

            <button
              type="button"
              onClick={loadGames}
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          visibleGames.length === 0 && (
            <div className="empty-box">
              <div>🎮</div>

              <h3>{t.noGames}</h3>

              <p>{t.noGamesDescription}</p>

              <button
                type="button"
                onClick={resetFilters}
              >
                {t.clearFilters}
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          visibleGames.length > 0 && (
            <>
              <div className="games-grid">
                {visibleGames.map(
                  (game, index) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      index={index}
                      page={safePage}
                      gamesPerPage={gamesPerPage}
                      favorites={favorites}
                      toggleFavorite={
                        toggleFavorite
                      }
                      openGame={openGame}
                      t={t}
                    />
                  )
                )}
              </div>

              <Pagination
                page={safePage}
                totalPages={totalPages}
                pages={paginationPages}
                previous={t.previous}
                next={t.next}
                setPage={setPage}
              />
            </>
          )}
      </div>
    </section>
  );
}