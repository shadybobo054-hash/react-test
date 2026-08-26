import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";

type Game = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  game_url: string;
  status?: string;
};

type SortOption = "default" | "name" | "date";
type View = "home" | "details" | "player";

const API_URL = "https://www.freetogame.com/api/games";
const GAMES_PER_PAGE = 12;

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [sort, setSort] = useState<SortOption>("default");

  const [page, setPage] = useState(1);

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("gameHubFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [view, setView] = useState<View>("home");

  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerRef = useRef<HTMLDivElement | null>(null);

  /* ================= LOAD GAMES ================= */

  const loadGames = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load games");
      }

      const data: Game[] = await response.json();

      setGames(data);
    } catch {
      setError(
        "مش قادرين نحمل الألعاب دلوقتي. تأكد من الإنترنت وحاول تاني."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  /* ================= SAVE FAVORITES ================= */

  useEffect(() => {
    localStorage.setItem(
      "gameHubFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  /* ================= GENRES ================= */

  const genres = useMemo(() => {
    const values = games
      .map((game) => game.genre)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)).sort(),
    ];
  }, [games]);

  /* ================= PLATFORMS ================= */

  const platforms = useMemo(() => {
    const values = games.flatMap((game) =>
      game.platform
        ? game.platform
            .split(",")
            .map((item) => item.trim())
        : []
    );

    return [
      "All",
      ...Array.from(new Set(values)).sort(),
    ];
  }, [games]);

  /* ================= FILTER + SEARCH ================= */

  const filteredGames = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    let result = games.filter((game) => {
      const title = game.title?.toLowerCase() || "";
      const description =
        game.short_description?.toLowerCase() || "";
      const gameGenre = game.genre?.toLowerCase() || "";
      const publisher = game.publisher?.toLowerCase() || "";
      const developer = game.developer?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        gameGenre.includes(searchValue) ||
        publisher.includes(searchValue) ||
        developer.includes(searchValue);

      const matchesGenre =
        genre === "All" || game.genre === genre;

      const matchesPlatform =
        platform === "All" ||
        game.platform?.includes(platform);

      const matchesFavorites =
        !showFavorites ||
        favorites.includes(game.id);

      return (
        matchesSearch &&
        matchesGenre &&
        matchesPlatform &&
        matchesFavorites
      );
    });

    if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "date") {
      result = [...result].sort((a, b) =>
        b.release_date.localeCompare(a.release_date)
      );
    }

    return result;
  }, [
    games,
    search,
    genre,
    platform,
    sort,
    showFavorites,
    favorites,
  ]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGames.length / GAMES_PER_PAGE)
  );

  const visibleGames = useMemo(() => {
    const start =
      (page - 1) * GAMES_PER_PAGE;

    return filteredGames.slice(
      start,
      start + GAMES_PER_PAGE
    );
  }, [filteredGames, page]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    genre,
    platform,
    sort,
    showFavorites,
  ]);

  /* ================= FAVORITES ================= */

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter(
            (favoriteId) => favoriteId !== id
          )
        : [...current, id]
    );
  };

  /* ================= OPEN DETAILS ================= */

  const openGame = (game: Game) => {
    setSelectedGame(game);
    setView("details");
    setShowFavorites(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= PLAY GAME ================= */

  const playGame = (game: Game) => {
    setSelectedGame(game);
    setView("player");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= HOME ================= */

  const goHome = () => {
    setSelectedGame(null);
    setView("home");
    setShowFavorites(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= FAVORITES PAGE ================= */

  const openFavorites = () => {
    setSelectedGame(null);
    setView("home");
    setShowFavorites(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= BACK DETAILS ================= */

  const closeDetails = () => {
    setSelectedGame(null);
    setView("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= FULLSCREEN ================= */

  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      console.log("Fullscreen is not supported.");
    }
  };

  /* ================= FULLSCREEN EVENT ================= */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  /* ================= RESET ================= */

  const resetFilters = () => {
    setSearch("");
    setGenre("All");
    setPlatform("All");
    setSort("default");
    setPage(1);
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <button
          className="logo"
          onClick={goHome}
        >
          <span className="logo-symbol">
            ◈
          </span>

          <span className="logo-text">
            GAME<span>HUB</span>
          </span>
        </button>

        <nav className="nav-links">

          <button
            className={
              view === "home" &&
              !showFavorites
                ? "nav-item active"
                : "nav-item"
            }
            onClick={goHome}
          >
            <span>⌂</span>
            Games
          </button>

          <button
            className={
              showFavorites
                ? "nav-item active"
                : "nav-item"
            }
            onClick={openFavorites}
          >
            <span>♥</span>
            Favorites

            <b className="favorite-count">
              {favorites.length}
            </b>
          </button>

        </nav>

        <div className="nav-status">
          <span></span>
          ONLINE
        </div>

      </header>

      {/* ================= PLAYER ================= */}

      {view === "player" &&
        selectedGame && (
          <GamePlayer
            game={selectedGame}
            playerRef={playerRef}
            isFullscreen={isFullscreen}
            onBack={() => setView("details")}
            onFullscreen={toggleFullscreen}
          />
        )}

      {/* ================= DETAILS ================= */}

      {view === "details" &&
        selectedGame && (
          <GameDetails
            game={selectedGame}
            isFavorite={favorites.includes(
              selectedGame.id
            )}
            onBack={closeDetails}
            onFavorite={() =>
              toggleFavorite(selectedGame.id)
            }
            onPlay={() =>
              playGame(selectedGame)
            }
          />
        )}

      {/* ================= HOME ================= */}

      {view === "home" && (
        <main>

          {/* ================= HERO ================= */}

          <section className="hero">

            <div className="hero-bg"></div>

            <div className="hero-noise"></div>

            <div className="hero-grid"></div>

            <div className="hero-orb orb-one"></div>
            <div className="hero-orb orb-two"></div>
            <div className="hero-orb orb-three"></div>

            <div className="hero-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="hero-content">

              <div className="hero-badge">
                <span className="live-dot"></span>
                <span>
                  NEXT GENERATION GAMING PLATFORM
                </span>
              </div>

              <h1>
                ENTER THE
                <strong>GAMEVERSE</strong>
              </h1>

              <p className="hero-description">
                اكتشف عالمًا ضخمًا من الألعاب المجانية.
                ابحث، اكتشف، احفظ ألعابك المفضلة
                وابدأ مغامرتك القادمة.
              </p>

              {/* HERO SEARCH */}

              <div className="hero-search">

                <span className="hero-search-icon">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  placeholder="Search games, genres, developers..."
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      document
                        .getElementById(
                          "games-section"
                        )
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }
                  }}
                />

                {search && (
                  <button
                    className="search-clear"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}

                <button
                  className="search-button"
                  onClick={() =>
                    document
                      .getElementById(
                        "games-section"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  SEARCH
                </button>

              </div>

              {/* STATS */}

              <div className="hero-stats">

                <div>
                  <strong>
                    {games.length || "100+"}
                  </strong>
                  <span>GAMES</span>
                </div>

                <i></i>

                <div>
                  <strong>
                    {genres.length > 1
                      ? genres.length - 1
                      : "20+"}
                  </strong>
                  <span>GENRES</span>
                </div>

                <i></i>

                <div>
                  <strong>FREE</strong>
                  <span>TO PLAY</span>
                </div>

              </div>

            </div>

            <div className="hero-scroll">
              <span>SCROLL TO EXPLORE</span>
              <b>↓</b>
            </div>

          </section>

          {/* ================= GAMES ================= */}

          <section
            className="games-section"
            id="games-section"
          >

            <div className="section-header">

              <div>
                <span className="section-label">
                  {showFavorites
                    ? "YOUR COLLECTION"
                    : "EXPLORE THE UNIVERSE"}
                </span>

                <h2>
                  {showFavorites
                    ? "Your Favorites"
                    : "Discover Games"}
                </h2>

                <div className="section-line"></div>
              </div>

              <div className="results-box">
                <strong>
                  {filteredGames.length}
                </strong>
                <span>GAMES FOUND</span>
              </div>

            </div>

            {/* FILTERS */}

            <div className="filters-panel">

              <div className="filter-heading">
                <span>⚙</span>
                FILTERS
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
                      ? "All Genres"
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
                      ? "All Platforms"
                      : item}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target
                      .value as SortOption
                  )
                }
              >
                <option value="default">
                  Sort: Default
                </option>
                <option value="name">
                  Sort: Name
                </option>
                <option value="date">
                  Sort: Release Date
                </option>
              </select>

              {(search ||
                genre !== "All" ||
                platform !== "All" ||
                sort !== "default") && (
                <button
                  className="reset-btn"
                  onClick={resetFilters}
                >
                  ↻ Reset
                </button>
              )}

            </div>

            {/* LOADING */}

            {loading && (
              <div className="status-box">
                <div className="big-loader"></div>
                <h3>Loading Gameverse</h3>
                <p>
                  Preparing your gaming universe...
                </p>
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="status-box error-box">
                <div className="status-icon">
                  !
                </div>

                <h3>
                  Something went wrong
                </h3>

                <p>{error}</p>

                <button
                  className="primary-btn"
                  onClick={loadGames}
                >
                  ↻ Try Again
                </button>
              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              filteredGames.length === 0 && (
                <div className="status-box">

                  <div className="empty-icon">
                    ◈
                  </div>

                  <h3>
                    {showFavorites
                      ? "Your Collection Is Empty"
                      : "No Games Found"}
                  </h3>

                  <p>
                    {showFavorites
                      ? "أضف ألعابك المفضلة وستظهر هنا."
                      : "جرب كلمة بحث مختلفة أو غير الفلاتر."}
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => {
                      resetFilters();
                      setShowFavorites(false);
                    }}
                  >
                    EXPLORE GAMES
                  </button>

                </div>
              )}

            {/* GRID */}

            {!loading &&
              !error &&
              visibleGames.length > 0 && (
                <div className="games-grid">

                  {visibleGames.map(
                    (game, index) => {
                      const favorite =
                        favorites.includes(
                          game.id
                        );

                      return (
                        <article
                          className="game-card"
                          key={game.id}
                          style={{
                            animationDelay: `${
                              Math.min(
                                index * 0.05,
                                0.5
                              )
                            }s`,
                          }}
                          onClick={() =>
                            openGame(game)
                          }
                        >

                          <div className="game-image">

                            <img
                              src={game.thumbnail}
                              alt={game.title}
                              loading="lazy"
                            />

                            <div className="image-shade"></div>

                            <div className="card-hover">

                              <div className="play-circle">
                                ▶
                              </div>

                              <span>
                                VIEW GAME
                              </span>

                            </div>

                            <button
                              className={`favorite-btn ${
                                favorite
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(
                                  game.id
                                );
                              }}
                            >
                              {favorite
                                ? "♥"
                                : "♡"}
                            </button>

                            <span className="platform-badge">
                              {game.platform}
                            </span>

                            <span className="game-number">
                              #
                              {String(
                                (page - 1) *
                                  GAMES_PER_PAGE +
                                  index +
                                  1
                              ).padStart(2, "0")}
                            </span>

                          </div>

                          <div className="game-content">

                            <span className="game-genre">
                              {game.genre ||
                                "Adventure"}
                            </span>

                            <h3>
                              {game.title}
                            </h3>

                            <p>
                              {game.short_description ||
                                "No description available."}
                            </p>

                            <div className="game-footer">

                              <span>
                                📅{" "}
                                {game.release_date}
                              </span>

                              <button
                                className="card-play"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  playGame(game);
                                }}
                              >
                                PLAY
                                <span>→</span>
                              </button>

                            </div>

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>
              )}

            {/* PAGINATION */}

            {!loading &&
              !error &&
              filteredGames.length > 0 && (
                <div className="pagination">

                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                  >
                    ←
                  </button>

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => index + 1
                  )
                    .filter((number) => {
                      if (totalPages <= 7)
                        return true;

                      return (
                        number === 1 ||
                        number === totalPages ||
                        Math.abs(
                          number - page
                        ) <= 1
                      );
                    })
                    .map((number) => (
                      <button
                        key={number}
                        className={
                          page === number
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setPage(number)
                        }
                      >
                        {number}
                      </button>
                    ))}

                  <button
                    disabled={
                      page === totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current + 1
                          )
                      )
                    }
                  >
                    →
                  </button>

                </div>
              )}

          </section>

        </main>
      )}

    </div>
  );
}

/* =====================================================
   GAME DETAILS
===================================================== */

type GameDetailsProps = {
  game: Game;
  isFavorite: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onPlay: () => void;
};

function GameDetails({
  game,
  isFavorite,
  onBack,
  onFavorite,
  onPlay,
}: GameDetailsProps) {
  return (
    <main className="details-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Games
      </button>

      <section className="details-hero">

        <div className="details-image">

          <img
            src={game.thumbnail}
            alt={game.title}
          />

          <div className="details-image-overlay"></div>

          <span className="available-badge">
            ● GAME AVAILABLE
          </span>

        </div>

        <div className="details-info">

          <span className="game-genre">
            {game.genre}
          </span>

          <h1>{game.title}</h1>

          <p className="details-description">
            {game.short_description ||
              "No description available."}
          </p>

          <div className="details-actions">

            <button
              className={`favorite-large ${
                isFavorite
                  ? "active"
                  : ""
              }`}
              onClick={onFavorite}
            >
              {isFavorite
                ? "♥ Remove Favorite"
                : "♡ Add to Favorites"}
            </button>

            <button
              className="play-btn"
              onClick={onPlay}
            >
              ▶ PLAY GAME
              <span>→</span>
            </button>

          </div>

          <div className="details-mini-stats">

            <div>
              <span>🎮</span>
              <strong>{game.platform}</strong>
              <small>PLATFORM</small>
            </div>

            <div>
              <span>★</span>
              <strong>FREE</strong>
              <small>TO PLAY</small>
            </div>

            <div>
              <span>⚡</span>
              <strong>ONLINE</strong>
              <small>GAME</small>
            </div>

          </div>

        </div>

      </section>

      <section className="info-section">

        <InfoCard
          icon="🎮"
          label="Platform"
          value={game.platform}
        />

        <InfoCard
          icon="🏷"
          label="Genre"
          value={game.genre}
        />

        <InfoCard
          icon="◆"
          label="Developer"
          value={game.developer || "Unknown"}
        />

        <InfoCard
          icon="📅"
          label="Release Date"
          value={game.release_date}
        />

        <InfoCard
          icon="▣"
          label="Publisher"
          value={game.publisher || "Unknown"}
        />

      </section>

    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="info-card">
      <span>{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

/* =====================================================
   GAME PLAYER
===================================================== */

type GamePlayerProps = {
  game: Game;
  playerRef: React.RefObject<HTMLDivElement | null>;
  isFullscreen: boolean;
  onBack: () => void;
  onFullscreen: () => void;
};

function GamePlayer({
  game,
  playerRef,
  isFullscreen,
  onBack,
  onFullscreen,
}: GamePlayerProps) {
  return (
    <main className="player-page">

      <div
        className={`player-shell ${
          isFullscreen
            ? "player-fullscreen"
            : ""
        }`}
        ref={playerRef}
      >

        <div className="player-header">

          <div className="player-title">

            <button
              className="player-back"
              onClick={onBack}
            >
              ←
            </button>

            <img
              src={game.thumbnail}
              alt={game.title}
            />

            <div>
              <span>NOW PLAYING</span>
              <h2>{game.title}</h2>
            </div>

          </div>

          <div className="player-controls">

            <span className="online-badge">
              <i></i>
              ONLINE
            </span>

            <button
              className="fullscreen-btn"
              onClick={onFullscreen}
            >
              {isFullscreen
                ? "⛶ EXIT"
                : "⛶ FULLSCREEN"}
            </button>

          </div>

        </div>

        <div className="game-frame">

          <iframe
            src={game.game_url}
            title={game.title}
            className="game-iframe"
            allow="fullscreen; autoplay; gamepad"
            allowFullScreen
          />

        </div>

        <div className="player-footer">

          <div>
            <span className="player-genre">
              {game.genre}
            </span>
            <span> • </span>
            <span>{game.platform}</span>
          </div>

          <span>
            🎮 Enjoy the game
          </span>

          <button
            className="player-details-btn"
            onClick={onBack}
          >
            Game Details →
          </button>

        </div>

      </div>

    </main>
  );
}

export default App;