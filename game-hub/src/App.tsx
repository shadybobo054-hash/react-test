import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Game = {
  id: number;
  title: string;
  thumbnail: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  short_description: string;
};

type Language = "en" | "ar";
type Theme = "dark" | "light";
type Page = "home" | "games" | "favorites" | "settings";

const API_URL = "https://www.freetogame.com/api/games";

const translations = {
  en: {
    home: "Home",
    games: "Games",
    favorites: "Favorites",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    dark: "Dark Mode",
    light: "Light Mode",
    english: "English",
    arabic: "العربية",
    nextGeneration: "NEXT GENERATION GAMING HUB",
    discoverNext: "DISCOVER YOUR",
    nextGame: "NEXT GAME",
    heroDescription:
      "Explore real free-to-play games, discover hidden gems, build your favorites and find your next gaming obsession.",
    explore: "EXPLORE GAMES",
    viewFavorites: "VIEW FAVORITES",
    gamesLoaded: "GAMES LOADED",
    savedGames: "SAVED GAMES",
    freeGames: "FREE GAMES",
    liveDatabase: "LIVE DATABASE",
    discover: "DISCOVER",
    exploreGames: "EXPLORE GAMES",
    exploreDescription:
      "Find your next adventure from our free-to-play game collection.",
    search: "Search games...",
    allGenres: "All Genres",
    allPlatforms: "All Platforms",
    reset: "RESET",
    loading: "LOADING GAMES...",
    connecting: "Connecting to free game database",
    connectionError: "CONNECTION ERROR",
    tryAgain: "TRY AGAIN",
    noGames: "NO GAMES FOUND",
    noGamesDescription: "Try changing your search or filters.",
    clearFilters: "CLEAR FILTERS",
    comingSoon: "Coming Soon",
    details: "DETAILS",
    gameDetails: "GAME DETAILS",
    released: "RELEASED",
    genre: "GENRE",
    platforms: "PLATFORMS",
    developer: "DEVELOPER",
    publisher: "PUBLISHER",
    addFavorite: "ADD TO FAVORITES",
    removeFavorite: "REMOVE FROM FAVORITES",
    yourCollection: "YOUR COLLECTION",
    yourFavorites: "YOUR FAVORITES",
    savedMessage: "Start building your personal game collection.",
    favoritesMessage: "You have",
    saved: "game(s) saved.",
    noFavorites: "NO FAVORITES YET",
    noFavoritesDescription:
      "Go to the Games page and add some games to your favorites.",
    browseGames: "BROWSE GAMES",
    readyPlayer: "READY PLAYER?",
    levelUp: "LEVEL UP",
    collection: "YOUR COLLECTION",
    builtForGamers: "BUILT FOR GAMERS",
    freeToPlay: "FREE TO PLAY",
    unknown: "Unknown",
    backHome: "BACK HOME",
    settingsDescription: "Customize your GameHub experience.",
    chooseLanguage: "Choose your preferred language.",
    chooseTheme: "Choose your preferred appearance.",
    close: "CLOSE",
  },
  ar: {
    home: "الرئيسية",
    games: "الألعاب",
    favorites: "المفضلة",
    settings: "الإعدادات",
    language: "اللغة",
    theme: "المظهر",
    dark: "الوضع الداكن",
    light: "الوضع الفاتح",
    english: "English",
    arabic: "العربية",
    nextGeneration: "منصة الألعاب من الجيل القادم",
    discoverNext: "اكتشف",
    nextGame: "لعبتك القادمة",
    heroDescription:
      "اكتشف ألعاب مجانية حقيقية، اعثر على ألعاب مخفية، كوّن قائمتك المفضلة وابحث عن تجربة الألعاب القادمة.",
    explore: "استكشف الألعاب",
    viewFavorites: "عرض المفضلة",
    gamesLoaded: "لعبة محملة",
    savedGames: "الألعاب المحفوظة",
    freeGames: "ألعاب مجانية",
    liveDatabase: "قاعدة بيانات مباشرة",
    discover: "اكتشف",
    exploreGames: "استكشف الألعاب",
    exploreDescription:
      "اعثر على مغامرتك القادمة من مجموعة الألعاب المجانية.",
    search: "ابحث عن لعبة...",
    allGenres: "كل الأنواع",
    allPlatforms: "كل المنصات",
    reset: "إعادة ضبط",
    loading: "جاري تحميل الألعاب...",
    connecting: "جاري الاتصال بقاعدة بيانات الألعاب المجانية",
    connectionError: "خطأ في الاتصال",
    tryAgain: "حاول مرة أخرى",
    noGames: "لم يتم العثور على ألعاب",
    noGamesDescription: "جرّب تغيير البحث أو الفلاتر.",
    clearFilters: "مسح الفلاتر",
    comingSoon: "قريبًا",
    details: "التفاصيل",
    gameDetails: "تفاصيل اللعبة",
    released: "تاريخ الإصدار",
    genre: "النوع",
    platforms: "المنصات",
    developer: "المطور",
    publisher: "الناشر",
    addFavorite: "إضافة للمفضلة",
    removeFavorite: "إزالة من المفضلة",
    yourCollection: "مجموعتك",
    yourFavorites: "ألعابك المفضلة",
    savedMessage: "ابدأ الآن في بناء مجموعة ألعابك الشخصية.",
    favoritesMessage: "لديك",
    saved: "لعبة محفوظة.",
    noFavorites: "لا توجد مفضلات حتى الآن",
    noFavoritesDescription:
      "اذهب إلى صفحة الألعاب وأضف بعض الألعاب إلى المفضلة.",
    browseGames: "تصفح الألعاب",
    readyPlayer: "جاهز للعب؟",
    levelUp: "طوّر مستواك",
    collection: "مجموعتك",
    builtForGamers: "مصمم للاعبين",
    freeToPlay: "لعبة مجانية",
    unknown: "غير معروف",
    backHome: "العودة للرئيسية",
    settingsDescription: "خصص تجربة GameHub الخاصة بك.",
    chooseLanguage: "اختر اللغة المفضلة لديك.",
    chooseTheme: "اختر المظهر المفضل لديك.",
    close: "إغلاق",
  },
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gamehub-favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (
      (localStorage.getItem("gamehub-language") as Language) || "en"
    );
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (
      (localStorage.getItem("gamehub-theme") as Theme) || "dark"
    );
  });

  const [currentPage, setCurrentPage] = useState<Page>("home");

  const t = translations[language];

  const isArabic = language === "ar";

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "gamehub-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("gamehub-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  useEffect(() => {
    localStorage.setItem("gamehub-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setPage(1);
  }, [search, genre, platform]);

  async function loadGames() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load games");
      }

      const data = await response.json();

      setGames(data || []);
    } catch {
      setError(
        isArabic
          ? "مش قادر أوصل لقاعدة بيانات الألعاب المجانية. تأكد من الاتصال بالإنترنت."
          : "Unable to connect to the free game database. Check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function navigate(pageName: Page) {
    setCurrentPage(pageName);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetFilters() {
    setSearch("");
    setGenre("All");
    setPlatform("All");
    setPage(1);
  }

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
    return games.filter((game) => {
      const matchesSearch = game.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesGenre =
        genre === "All" || game.genre === genre;

      const matchesPlatform =
        platform === "All" || game.platform === platform;

      return (
        matchesSearch &&
        matchesGenre &&
        matchesPlatform
      );
    });
  }, [games, search, genre, platform]);

  const favoriteGames = useMemo(() => {
    return games.filter((game) =>
      favorites.includes(game.id)
    );
  }, [games, favorites]);

  const gamesPerPage = 12;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGames.length / gamesPerPage)
  );

  const visibleGames = filteredGames.slice(
    (page - 1) * gamesPerPage,
    page * gamesPerPage
  );

  function GameCard({
    game,
    index,
  }: {
    game: Game;
    index: number;
  }) {
    const isFavorite = favorites.includes(game.id);

    return (
      <article className="game-card">
        <div className="game-image">
          <img
            src={game.thumbnail}
            alt={game.title}
            loading="lazy"
          />

          <div className="image-shade" />

          <button
            className={`favorite ${
              isFavorite ? "active" : ""
            }`}
            onClick={() => toggleFavorite(game.id)}
          >
            {isFavorite ? "♥" : "♡"}
          </button>

          <div className="game-number">
            #
            {String(
              (page - 1) * gamesPerPage + index + 1
            ).padStart(2, "0")}
          </div>

          <button
            className="view-game"
            onClick={() => setSelectedGame(game)}
          >
            {t.details}
          </button>
        </div>

        <div className="game-body">
          <div className="game-top">
            <span>{game.genre || t.freeToPlay}</span>

            <div className="rating">
              FREE
            </div>
          </div>

          <h3>{game.title}</h3>

          <div className="game-meta">
            <span>
              📅 {game.release_date || t.comingSoon}
            </span>

            <span>
              🎮 {game.platform || t.platforms}
            </span>
          </div>

          <div className="game-platforms">
            <span>
              {game.publisher || t.publisher}
            </span>

            <span>
              {game.developer || t.developer}
            </span>
          </div>

          <button
            className="details-btn"
            onClick={() => setSelectedGame(game)}
          >
            {t.details}
            <span>→</span>
          </button>
        </div>
      </article>
    );
  }

  function HomePage() {
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
                  className="primary-btn"
                  onClick={() => navigate("games")}
                >
                  {t.explore}
                  <span>→</span>
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => navigate("favorites")}
                >
                  {t.viewFavorites}
                </button>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-glow" />
              <div className="hero-controller">
                🎮
              </div>

              <div className="hero-card-text">
                <span>{t.readyPlayer}</span>
                <strong>{t.levelUp}</strong>
                <small>{t.collection}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <strong>
                {games.length || "—"}
              </strong>
              <span>{t.gamesLoaded}</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <strong>{favorites.length}</strong>
              <span>{t.savedGames}</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🆓</div>
              <strong>FREE</strong>
              <span>{t.freeGames}</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <strong>LIVE</strong>
              <span>{t.liveDatabase}</span>
            </div>
          </div>
        </section>

        <section className="home-feature-section">
          <div className="container">
            <span className="eyebrow">
              {t.discover}
            </span>

            <h2>{t.exploreGames}</h2>

            <p>
              {t.exploreDescription}
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("games")}
            >
              {t.explore}
              <span>→</span>
            </button>
          </div>
        </section>
      </>
    );
  }

  function GamesPage() {
    return (
      <section className="games-section page-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {t.discover}
              </span>

              <h2>{t.exploreGames}</h2>

              <p>
                {t.exploreDescription}
              </p>
            </div>
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
              className="reset-btn"
              onClick={resetFilters}
            >
              {t.reset}
            </button>
          </div>

          {loading && (
            <div className="loading-box">
              <div className="loader" />

              <strong>
                {t.loading}
              </strong>

              <span>
                {t.connecting}
              </span>
            </div>
          )}

          {!loading && error && (
            <div className="error-box">
              <strong>
                {t.connectionError}
              </strong>

              <p>{error}</p>

              <button onClick={loadGames}>
                {t.tryAgain}
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            visibleGames.length === 0 && (
              <div className="empty-box">
                <div>🎮</div>

                <h3>
                  {t.noGames}
                </h3>

                <p>
                  {t.noGamesDescription}
                </p>

                <button
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
                      />
                    )
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={page === 1}
                      onClick={() =>
                        setPage(
                          (current) =>
                            current - 1
                        )
                      }
                    >
                      ←
                    </button>

                    {Array.from(
                      {
                        length: Math.min(
                          totalPages,
                          7
                        ),
                      },
                      (_, index) =>
                        index + 1
                    ).map((number) => (
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
                            current + 1
                        )
                      }
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
        </div>
      </section>
    );
  }

  function FavoritesPage() {
    return (
      <section className="favorites-page page-section">
        <div className="container">
          <div className="favorites-header">
            <div>
              <span className="eyebrow">
                {t.yourCollection}
              </span>

              <h2>
                {t.yourFavorites}
              </h2>

              <p>
                {favorites.length
                  ? `${t.favoritesMessage} ${favorites.length} ${t.saved}`
                  : t.savedMessage}
              </p>
            </div>

            <div className="favorite-count">
              <strong>
                {favorites.length}
              </strong>

              <span>
                {t.savedGames}
              </span>
            </div>
          </div>

          {favoriteGames.length === 0 ? (
            <div className="empty-box favorites-empty">
              <div>❤️</div>

              <h3>
                {t.noFavorites}
              </h3>

              <p>
                {t.noFavoritesDescription}
              </p>

              <button
                onClick={() =>
                  navigate("games")
                }
              >
                {t.browseGames}
              </button>
            </div>
          ) : (
            <div className="games-grid favorites-grid">
              {favoriteGames.map(
                (game, index) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    index={index}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  function SettingsPage() {
    return (
      <section className="settings-page page-section">
        <div className="container">
          <div className="settings-page-header">
            <span className="eyebrow">
              ⚙ {t.settings}
            </span>

            <h2>{t.settings}</h2>

            <p>
              {t.settingsDescription}
            </p>
          </div>

          <div className="settings-grid">
            <div className="settings-card">
              <div className="settings-card-icon">
                🌐
              </div>

              <div className="settings-card-content">
                <h3>{t.language}</h3>

                <p>
                  {t.chooseLanguage}
                </p>
              </div>

              <div className="settings-choice-grid">
                <button
                  className={
                    language === "en"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setLanguage("en")
                  }
                >
                  🇬🇧
                  <span>
                    {t.english}
                  </span>
                </button>

                <button
                  className={
                    language === "ar"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setLanguage("ar")
                  }
                >
                  🇪🇬
                  <span>
                    {t.arabic}
                  </span>
                </button>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-icon">
                🎨
              </div>

              <div className="settings-card-content">
                <h3>{t.theme}</h3>

                <p>
                  {t.chooseTheme}
                </p>
              </div>

              <div className="settings-choice-grid">
                <button
                  className={
                    theme === "dark"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setTheme("dark")
                  }
                >
                  🌙
                  <span>
                    {t.dark}
                  </span>
                </button>

                <button
                  className={
                    theme === "light"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setTheme("light")
                  }
                >
                  ☀️
                  <span>
                    {t.light}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderPage() {
    if (currentPage === "home") {
      return <HomePage />;
    }

    if (currentPage === "games") {
      return <GamesPage />;
    }

    if (currentPage === "favorites") {
      return <FavoritesPage />;
    }

    return <SettingsPage />;
  }

  return (
    <div
      className={`app ${
        theme === "light"
          ? "light-theme"
          : ""
      }`}
    >
      <header className="navbar">
        <div className="container nav-inner">
          <button
            className="logo"
            onClick={() =>
              navigate("home")
            }
          >
            <span className="logo-mark">
              G
            </span>

            <div>
              <strong>
                GAMEHUB
              </strong>

              <small>
                ULTIMATE GAMING PLATFORM
              </small>
            </div>
          </button>

          <nav>
            <button
              className={
                currentPage === "home"
                  ? "nav-active"
                  : ""
              }
              onClick={() =>
                navigate("home")
              }
            >
              {t.home}
            </button>

            <button
              className={
                currentPage === "games"
                  ? "nav-active"
                  : ""
              }
              onClick={() =>
                navigate("games")
              }
            >
              {t.games}
            </button>

            <button
              className={
                currentPage === "favorites"
                  ? "nav-active"
                  : ""
              }
              onClick={() =>
                navigate("favorites")
              }
            >
              {t.favorites}

              <span>
                {favorites.length}
              </span>
            </button>

            <button
              className={
                currentPage === "settings"
                  ? "nav-active settings-nav"
                  : "settings-nav"
              }
              onClick={() =>
                navigate("settings")
              }
              aria-label={t.settings}
            >
              ⚙️
            </button>
          </nav>
        </div>
      </header>

      <main>{renderPage()}</main>

      {selectedGame && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedGame(null)
          }
        >
          <div
            className="game-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setSelectedGame(null)
              }
            >
              ×
            </button>

            <img
              className="modal-image"
              src={
                selectedGame.thumbnail
              }
              alt={selectedGame.title}
            />

            <div className="modal-content">
              <span className="eyebrow">
                {t.gameDetails}
              </span>

              <h2>
                {selectedGame.title}
              </h2>

              <div className="modal-rating">
                {t.freeToPlay}
              </div>

              <div className="modal-info">
                <div>
                  <span>
                    {t.released}
                  </span>

                  <strong>
                    {selectedGame.release_date ||
                      t.unknown}
                  </strong>
                </div>

                <div>
                  <span>
                    {t.genre}
                  </span>

                  <strong>
                    {selectedGame.genre ||
                      t.unknown}
                  </strong>
                </div>

                <div>
                  <span>
                    {t.platforms}
                  </span>

                  <strong>
                    {selectedGame.platform ||
                      t.unknown}
                  </strong>
                </div>

                <div>
                  <span>
                    {t.developer}
                  </span>

                  <strong>
                    {selectedGame.developer ||
                      t.unknown}
                  </strong>
                </div>

                <div>
                  <span>
                    {t.publisher}
                  </span>

                  <strong>
                    {selectedGame.publisher ||
                      t.unknown}
                  </strong>
                </div>
              </div>

              <p className="modal-description">
                {
                  selectedGame.short_description
                }
              </p>

              <button
                className="primary-btn modal-btn"
                onClick={() =>
                  toggleFavorite(
                    selectedGame.id
                  )
                }
              >
                {favorites.includes(
                  selectedGame.id
                )
                  ? t.removeFavorite
                  : t.addFavorite}
              </button>

              <button
                className="secondary-btn modal-btn"
                onClick={() =>
                  window.open(
                    selectedGame.game_url,
                    "_blank"
                  )
                }
              >
                🎮 {t.explore}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="container footer-inner">
          <button
            className="logo"
            onClick={() =>
              navigate("home")
            }
          >
            <span className="logo-mark">
              G
            </span>

            <div>
              <strong>
                GAMEHUB
              </strong>

              <small>
                ULTIMATE GAMING PLATFORM
              </small>
            </div>
          </button>

          <span>
            {t.builtForGamers} ⚡
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;