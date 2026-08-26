import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
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
type Language = "ar" | "en";
type Theme = "dark" | "light";
type AccentColor =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red";

const API_URL =
  "https://www.freetogame.com/api/games";

const GAMES_PER_PAGE = 12;

const translations = {
  ar: {
    games: "الألعاب",
    favorites: "المفضلة",
    live: "مباشر",
    discover: "اكتشف",
    play: "العب",
    enjoy: "استمتع",
    nextGeneration:
      "منصة ألعاب من الجيل الجديد",
    heroDescription:
      "اكتشف عالمًا ضخمًا من الألعاب المجانية. ابحث عن لعبتك القادمة واحفظ ألعابك المفضلة وابدأ اللعب.",
    searchPlaceholder:
      "ابحث عن لعبة، نوع، مطور...",
    search: "بحث",
    exploreGames: "استكشف الألعاب",
    myCollection: "مجموعتي",
    featuredGame: "لعبة مميزة",
    exploreGame: "استكشف اللعبة",
    nextUp: "التالي",
    discoverLabel: "اكتشف",
    scroll: "اسحب للأسفل",
    gamesFound: "لعبة موجودة",
    genres: "الأنواع",
    yourCollection: "مجموعتك",
    exploreUniverse: "استكشف عالم الألعاب",
    yourFavorites: "ألعابك المفضلة",
    discoverGames: "اكتشف الألعاب",
    all: "الكل",
    filters: "الفلاتر",
    allGenres: "كل الأنواع",
    allPlatforms: "كل المنصات",
    defaultSort: "الترتيب الافتراضي",
    sortName: "حسب الاسم",
    sortDate: "حسب تاريخ الإصدار",
    reset: "إعادة ضبط",
    loading: "جاري تحميل الألعاب",
    preparing: "بنجهز عالم الألعاب ليك...",
    somethingWrong: "حصل خطأ",
    tryAgain: "حاول مرة أخرى",
    noGames: "لا توجد ألعاب",
    emptyFavorites: "المفضلة فارغة",
    addFavorites:
      "أضف ألعابك المفضلة وستظهر هنا.",
    changeSearch:
      "جرب كلمة بحث مختلفة أو غير الفلاتر.",
    back: "العودة للألعاب",
    available: "اللعبة متاحة",
    addFavorite: "إضافة للمفضلة",
    removeFavorite: "إزالة من المفضلة",
    playGame: "العب الآن",
    platform: "المنصة",
    developer: "المطور",
    publisher: "الناشر",
    releaseDate: "تاريخ الإصدار",
    freeToPlay: "مجاني للعب",
    onlineGame: "أونلاين",
    nowPlaying: "يتم اللعب الآن",
    online: "متصل",
    fullscreen: "ملء الشاشة",
    exitFullscreen: "خروج",
    enjoyGame: "استمتع باللعبة",
    gameDetails: "تفاصيل اللعبة",
    welcome: "مرحبًا بك في",
    welcomeDescription:
      "اكتشف الألعاب المجانية، واحفظ المفضلة، واعثر على مغامرتك القادمة.",
    enterHub: "دخول إلى GAME HUB",
    skip: "تخطي",

    settings: "الإعدادات",
    language: "اللغة",
    appearance: "المظهر",
    accentColor: "لون الواجهة",

    chooseLanguage:
      "اختار لغة الموقع",
    chooseAppearance:
      "اختار الشكل المناسب ليك",
    chooseAccent:
      "اختار اللون الأساسي للموقع",

    arabic: "العربية",
    english: "English",

    darkMode: "الوضع الليلي",
    lightMode: "الوضع الفاتح",

    blue: "أزرق",
    purple: "بنفسجي",
    green: "أخضر",
    orange: "برتقالي",
    red: "أحمر",

    resetSettings: "استرجاع الإعدادات",
    resetSettingsDescription:
      "يرجع الإعدادات للوضع الافتراضي",
    restoreDefaults:
      "استرجاع الإعدادات الافتراضية",
    done: "تم",
  },

  en: {
    games: "Games",
    favorites: "Favorites",
    live: "LIVE",
    discover: "DISCOVER",
    play: "PLAY",
    enjoy: "ENJOY",
    nextGeneration:
      "NEXT GENERATION GAMING PLATFORM",
    heroDescription:
      "Discover a huge universe of free games. Find your next game, save your favorites and start playing.",
    searchPlaceholder:
      "Search games, genres, developers...",
    search: "SEARCH",
    exploreGames: "EXPLORE GAMES",
    myCollection: "MY COLLECTION",
    featuredGame: "FEATURED GAME",
    exploreGame: "EXPLORE GAME",
    nextUp: "NEXT UP",
    discoverLabel: "DISCOVER",
    scroll: "SCROLL DOWN",
    gamesFound: "GAMES FOUND",
    genres: "GENRES",
    yourCollection: "YOUR COLLECTION",
    exploreUniverse: "EXPLORE THE UNIVERSE",
    yourFavorites: "YOUR FAVORITES",
    discoverGames: "DISCOVER GAMES",
    all: "ALL",
    filters: "FILTERS",
    allGenres: "All Genres",
    allPlatforms: "All Platforms",
    defaultSort: "Sort: Default",
    sortName: "Sort: Name",
    sortDate: "Sort: Release Date",
    reset: "RESET",
    loading: "LOADING GAMES",
    preparing: "Preparing your gaming universe...",
    somethingWrong: "Something went wrong",
    tryAgain: "TRY AGAIN",
    noGames: "NO GAMES FOUND",
    emptyFavorites: "YOUR FAVORITES ARE EMPTY",
    addFavorites:
      "Add your favorite games and they will appear here.",
    changeSearch:
      "Try another search or change your filters.",
    back: "BACK TO GAMES",
    available: "GAME AVAILABLE",
    addFavorite: "ADD TO FAVORITES",
    removeFavorite: "REMOVE FAVORITE",
    playGame: "PLAY GAME",
    platform: "Platform",
    developer: "Developer",
    publisher: "Publisher",
    releaseDate: "Release Date",
    freeToPlay: "TO PLAY",
    onlineGame: "ONLINE",
    nowPlaying: "NOW PLAYING",
    online: "ONLINE",
    fullscreen: "FULLSCREEN",
    exitFullscreen: "EXIT",
    enjoyGame: "ENJOY THE GAME",
    gameDetails: "GAME DETAILS",
    welcome: "WELCOME TO",
    welcomeDescription:
      "Discover free games, save your favorites and find your next adventure.",
    enterHub: "ENTER GAME HUB",
    skip: "SKIP",

    settings: "Settings",
    language: "Language",
    appearance: "Appearance",
    accentColor: "Accent Color",
    chooseLanguage:
      "Choose your interface language",
    chooseAppearance:
      "Choose your preferred appearance",
    chooseAccent:
      "Choose your main interface color",

    arabic: "Arabic",
    english: "English",

    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    blue: "Blue",
    purple: "Purple",
    green: "Green",
    orange: "Orange",
    red: "Red",

    resetSettings: "Reset Settings",
    resetSettingsDescription:
      "Restore your default settings",
    restoreDefaults: "Restore Defaults",
    done: "Done",
  },
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [sort, setSort] =
    useState<SortOption>("default");

  const [page, setPage] = useState(1);

  const [favorites, setFavorites] = useState<number[]>(
    () => {
      try {
        const saved =
          localStorage.getItem("gameHubFavorites");

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    }
  );

  const [showFavorites, setShowFavorites] =
    useState(false);

  const [selectedGame, setSelectedGame] =
    useState<Game | null>(null);

  const [view, setView] =
    useState<View>("home");

  const [language, setLanguage] =
    useState<Language>(() => {
      return localStorage.getItem(
        "gameHubLanguage"
      ) === "en"
        ? "en"
        : "ar";
    });

  const [theme, setTheme] =
    useState<Theme>(() => {
      return localStorage.getItem(
        "gameHubTheme"
      ) === "light"
        ? "light"
        : "dark";
    });

  const [accentColor, setAccentColor] =
    useState<AccentColor>(() => {
      const saved =
        localStorage.getItem(
          "gameHubAccent"
        );

      const colors: AccentColor[] = [
        "blue",
        "purple",
        "green",
        "orange",
        "red",
      ];

      return colors.includes(
        saved as AccentColor
      )
        ? (saved as AccentColor)
        : "blue";
    });

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [settingsTab, setSettingsTab] =
    useState<
      "appearance" | "language" | "color"
    >("appearance");

  const [showIntro, setShowIntro] =
    useState(() => {
      return (
        sessionStorage.getItem(
          "gameHubIntroSeen"
        ) !== "true"
      );
    });

  const [introLeaving, setIntroLeaving] =
    useState(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const playerRef =
    useRef<HTMLDivElement | null>(null);

  const t = translations[language];
  const isArabic = language === "ar";

  const loadGames = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load games"
        );
      }

      const data: Game[] =
        await response.json();

      setGames(data);
    } catch {
      setError(
        isArabic
          ? "مش قادرين نحمل الألعاب دلوقتي. تأكد من الإنترنت وحاول تاني."
          : "We couldn't load the games. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "gameHubFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubLanguage",
      language
    );

    document.documentElement.lang =
      language;

    document.documentElement.dir =
      language === "ar"
        ? "rtl"
        : "ltr";
  }, [language]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubTheme",
      theme
    );

    document.documentElement.dataset.theme =
      theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubAccent",
      accentColor
    );

    document.documentElement.dataset.accent =
      accentColor;
  }, [accentColor]);

  const genres = useMemo(() => {
    const values = games
      .map((game) => game.genre)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(values)
      ).sort(),
    ];
  }, [games]);

  const platforms = useMemo(() => {
    const values = games.flatMap(
      (game) =>
        game.platform
          ? game.platform
              .split(",")
              .map((item) =>
                item.trim()
              )
          : []
    );

    return [
      "All",
      ...Array.from(
        new Set(values)
      ).sort(),
    ];
  }, [games]);

  const filteredGames = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    let result = games.filter((game) => {
      const title =
        game.title?.toLowerCase() || "";

      const description =
        game.short_description?.toLowerCase() ||
        "";

      const gameGenre =
        game.genre?.toLowerCase() || "";

      const publisher =
        game.publisher?.toLowerCase() ||
        "";

      const developer =
        game.developer?.toLowerCase() ||
        "";

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        gameGenre.includes(searchValue) ||
        publisher.includes(searchValue) ||
        developer.includes(searchValue);

      const matchesGenre =
        genre === "All" ||
        game.genre === genre;

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
        b.release_date.localeCompare(
          a.release_date
        )
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

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredGames.length /
        GAMES_PER_PAGE
    )
  );

  const visibleGames = useMemo(() => {
    const start =
      (page - 1) *
      GAMES_PER_PAGE;

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

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter(
            (favoriteId) =>
              favoriteId !== id
          )
        : [...current, id]
    );
  };

  const finishIntro = () => {
    setIntroLeaving(true);

    window.setTimeout(() => {
      sessionStorage.setItem(
        "gameHubIntroSeen",
        "true"
      );

      setShowIntro(false);
      setIntroLeaving(false);
    }, 550);
  };

  const openGame = (game: Game) => {
    setSelectedGame(game);
    setView("details");
    setShowFavorites(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const playGame = (game: Game) => {
    setSelectedGame(game);
    setView("player");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goHome = () => {
    setSelectedGame(null);
    setView("home");
    setShowFavorites(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openFavorites = () => {
    setSelectedGame(null);
    setView("home");
    setShowFavorites(true);

    setTimeout(() => {
      document
        .getElementById("games-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const resetFilters = () => {
    setSearch("");
    setGenre("All");
    setPlatform("All");
    setSort("default");
    setPage(1);
  };

  const toggleFullscreen = async () => {
    if (!playerRef.current) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      console.log(
        "Fullscreen is not supported."
      );
    }
  };

  useEffect(() => {
    const handleFullscreenChange =
      () => {
        setIsFullscreen(
          Boolean(
            document.fullscreenElement
          )
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

  const scrollToGames = () => {
    document
      .getElementById("games-section")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const resetSettings = () => {
    setLanguage("ar");
    setTheme("dark");
    setAccentColor("blue");
    setSettingsTab("appearance");
  };

  const featuredGame =
    games[0] ?? null;

  const secondFeaturedGame =
    games.length > 1
      ? games[1]
      : null;

  const thirdFeaturedGame =
    games.length > 2
      ? games[2]
      : null;

  if (showIntro) {
    return (
      <IntroScreen
        language={language}
        theme={theme}
        t={t}
        isArabic={isArabic}
        leaving={introLeaving}
        onEnter={finishIntro}
        onSkip={finishIntro}
        onLanguage={() =>
          setLanguage(
            language === "ar"
              ? "en"
              : "ar"
          )
        }
        onTheme={() =>
          setTheme(
            theme === "dark"
              ? "light"
              : "dark"
          )
        }
      />
    );
  }

  return (
    <div
      className={`app ${
        theme === "light"
          ? "theme-light"
          : "theme-dark"
      }`}
    >
      <div className="background-effects">
        <div className="background-orb orb-purple" />
        <div className="background-orb orb-cyan" />
        <div className="background-orb orb-blue" />
        <div className="background-grid" />
        <div className="background-noise" />
      </div>

      {/* NAVBAR */}

      <header className="navbar">
        <button
          className="logo"
          onClick={goHome}
          aria-label="Home"
        >
          <span className="logo-icon">
            ◈
          </span>

          <span className="logo-name">
            <span className="logo-main">
              GAME
            </span>{" "}
            <span className="logo-gradient">
              HUB
            </span>
          </span>
        </button>

        <nav className="nav-links">
          <button
            className={
              view === "home" &&
              !showFavorites
                ? "nav-item nav-active"
                : "nav-item"
            }
            onClick={goHome}
          >
            <span>⌂</span>
            {t.games}
          </button>

          <button
            className={
              showFavorites
                ? "nav-item nav-active"
                : "nav-item"
            }
            onClick={openFavorites}
          >
            <span>♥</span>
            {t.favorites}

            <b className="favorite-count">
              {favorites.length}
            </b>
          </button>
        </nav>

        <div className="navbar-actions">
          {/* LANGUAGE */}

          <button
            className="nav-setting-btn"
            onClick={() =>
              setLanguage(
                language === "ar"
                  ? "en"
                  : "ar"
              )
            }
            title={t.language}
          >
            <span className="nav-setting-icon">
              🌐
            </span>

            <span className="nav-setting-text">
              {language === "ar"
                ? "عربي"
                : "EN"}
            </span>
          </button>

          {/* THEME */}

          <button
            className="nav-setting-btn"
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            title={t.appearance}
          >
            <span className="nav-setting-icon">
              {theme === "dark"
                ? "☀"
                : "☾"}
            </span>

            <span className="nav-setting-text">
              {theme === "dark"
                ? "Light"
                : "Dark"}
            </span>
          </button>

          {/* SETTINGS */}

          <button
            className="nav-setting-btn settings-nav-button"
            onClick={() =>
              setSettingsOpen(true)
            }
            title={t.settings}
          >
            <span className="nav-setting-icon">
              ⚙
            </span>

            <span className="nav-setting-text">
              {t.settings}
            </span>
          </button>

          <div className="nav-status">
            <span />
            {t.live}
          </div>
        </div>
      </header>

      {/* PLAYER */}

      {view === "player" &&
        selectedGame && (
          <GamePlayer
            game={selectedGame}
            playerRef={playerRef}
            isFullscreen={isFullscreen}
            language={language}
            onBack={() =>
              setView("details")
            }
            onFullscreen={
              toggleFullscreen
            }
          />
        )}

      {/* DETAILS */}

      {view === "details" &&
        selectedGame && (
          <GameDetails
            game={selectedGame}
            isFavorite={favorites.includes(
              selectedGame.id
            )}
            language={language}
            onBack={goHome}
            onFavorite={() =>
              toggleFavorite(
                selectedGame.id
              )
            }
            onPlay={() =>
              playGame(selectedGame)
            }
          />
        )}

      {/* HOME */}

      {view === "home" && (
        <main>
          <section className="hero">
            <div className="hero-overlay" />
            <div className="hero-grid" />

            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />

            <div className="hero-vignette" />

            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />

            <div className="hero-content">
              <div className="hero-badge">
                <span className="live-dot" />
                {t.nextGeneration}
              </div>

              <div className="hero-eyebrow">
                <span />
                {t.discover}
                <b>•</b>
                {t.play}
                <b>•</b>
                {t.enjoy}
              </div>

              <h1>
                {isArabic
                  ? "ادخل عالم"
                  : "ENTER THE"}

                <span>
                  {isArabic
                    ? "الألعاب"
                    : "GAMEVERSE"}
                </span>
              </h1>

              <p>
                {t.heroDescription}
              </p>

              <div className="hero-search">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  placeholder={
                    t.searchPlaceholder
                  }
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      scrollToGames();
                    }
                  }}
                />

                {search && (
                  <button
                    className="clear-search"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}

                <button
                  className="hero-search-btn"
                  onClick={
                    scrollToGames
                  }
                >
                  {t.search}
                </button>
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>
                    {games.length}
                  </strong>
                  <span>
                    {t.games}
                  </span>
                </div>

                <i />

                <div className="hero-stat">
                  <strong>
                    {Math.max(
                      genres.length -
                        1,
                      0
                    )}
                  </strong>
                  <span>
                    {t.genres}
                  </span>
                </div>

                <i />

                <div className="hero-stat">
                  <strong>
                    {favorites.length}
                  </strong>
                  <span>
                    {t.favorites}
                  </span>
                </div>
              </div>

              <div className="hero-actions">
                <button
                  className="hero-primary-btn"
                  onClick={
                    scrollToGames
                  }
                >
                  <span>
                    {t.exploreGames}
                  </span>
                  <b>→</b>
                </button>

                <button
                  className="hero-secondary-btn"
                  onClick={
                    openFavorites
                  }
                >
                  <span>♥</span>
                  {t.myCollection}
                </button>
              </div>
            </div>

            {featuredGame && (
              <div className="featured-preview">
                <div className="featured-top-line">
                  <div className="featured-label">
                    <span />
                    {t.featuredGame}
                  </div>

                  <span className="featured-index">
                    01 / 03
                  </span>
                </div>

                <div className="featured-image-wrap">
                  <img
                    src={
                      featuredGame.thumbnail
                    }
                    alt={
                      featuredGame.title
                    }
                  />

                  <div className="featured-image-shine" />

                  <div className="featured-corner top-left" />
                  <div className="featured-corner top-right" />
                  <div className="featured-corner bottom-left" />
                  <div className="featured-corner bottom-right" />
                </div>

                <div className="featured-info">
                  <span>
                    {
                      featuredGame.genre
                    }
                  </span>

                  <h3>
                    {
                      featuredGame.title
                    }
                  </h3>

                  <p>
                    {
                      featuredGame.short_description
                    }
                  </p>

                  <button
                    onClick={() =>
                      openGame(
                        featuredGame
                      )
                    }
                  >
                    {t.exploreGame}
                    <b>→</b>
                  </button>
                </div>
              </div>
            )}

            <div className="hero-mini-games">
              {secondFeaturedGame && (
                <button
                  className="hero-mini-card"
                  onClick={() =>
                    openGame(
                      secondFeaturedGame
                    )
                  }
                >
                  <img
                    src={
                      secondFeaturedGame.thumbnail
                    }
                    alt={
                      secondFeaturedGame.title
                    }
                  />

                  <div>
                    <small>
                      {t.nextUp}
                    </small>

                    <strong>
                      {
                        secondFeaturedGame.title
                      }
                    </strong>
                  </div>
                </button>
              )}

              {thirdFeaturedGame && (
                <button
                  className="hero-mini-card"
                  onClick={() =>
                    openGame(
                      thirdFeaturedGame
                    )
                  }
                >
                  <img
                    src={
                      thirdFeaturedGame.thumbnail
                    }
                    alt={
                      thirdFeaturedGame.title
                    }
                  />

                  <div>
                    <small>
                      {t.discoverLabel}
                    </small>

                    <strong>
                      {
                        thirdFeaturedGame.title
                      }
                    </strong>
                  </div>
                </button>
              )}
            </div>

            <div className="scroll-indicator">
              <span>
                {t.scroll}
              </span>

              <b>↓</b>
            </div>
          </section>

          <section
            className="games-section"
            id="games-section"
          >
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-label">
                  {showFavorites
                    ? t.yourCollection
                    : t.exploreUniverse}
                </span>

                <h2>
                  {showFavorites
                    ? t.yourFavorites
                    : t.discoverGames}
                </h2>

                <div className="title-line" />
              </div>

              <div className="results-box">
                <strong>
                  {
                    filteredGames.length
                  }
                </strong>

                <span>
                  {t.gamesFound}
                </span>
              </div>
            </div>

            <div className="genre-strip">
              <button
                className={
                  genre === "All"
                    ? "genre-pill active"
                    : "genre-pill"
                }
                onClick={() =>
                  setGenre("All")
                }
              >
                {t.all}
              </button>

              {genres
                .filter(
                  (item) =>
                    item !== "All"
                )
                .slice(0, 8)
                .map((item) => (
                  <button
                    key={item}
                    className={
                      genre === item
                        ? "genre-pill active"
                        : "genre-pill"
                    }
                    onClick={() =>
                      setGenre(item)
                    }
                  >
                    {item}
                  </button>
                ))}
            </div>

            <div className="filters-panel">
              <div className="filter-heading">
                <span>⚙</span>
                {t.filters}
              </div>

              <select
                value={genre}
                onChange={(event) =>
                  setGenre(
                    event.target.value
                  )
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
                  setPlatform(
                    event.target.value
                  )
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
                  {t.defaultSort}
                </option>

                <option value="name">
                  {t.sortName}
                </option>

                <option value="date">
                  {t.sortDate}
                </option>
              </select>

              {(search ||
                genre !== "All" ||
                platform !== "All" ||
                sort !== "default") && (
                <button
                  className="reset-btn"
                  onClick={
                    resetFilters
                  }
                >
                  ↻ {t.reset}
                </button>
              )}
            </div>

            {loading && (
              <div className="status-box">
                <div className="big-loader">
                  <span />
                </div>

                <h3>
                  {t.loading}
                </h3>

                <p>
                  {t.preparing}
                </p>
              </div>
            )}

            {!loading &&
              error && (
                <div className="status-box">
                  <div className="status-icon">
                    !
                  </div>

                  <h3>
                    {
                      t.somethingWrong
                    }
                  </h3>

                  <p>{error}</p>

                  <button
                    className="primary-btn"
                    onClick={
                      loadGames
                    }
                  >
                    ↻ {t.tryAgain}
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              filteredGames.length ===
                0 && (
                <div className="status-box">
                  <div className="empty-icon">
                    ◈
                  </div>

                  <h3>
                    {showFavorites
                      ? t.emptyFavorites
                      : t.noGames}
                  </h3>

                  <p>
                    {showFavorites
                      ? t.addFavorites
                      : t.changeSearch}
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => {
                      resetFilters();
                      setShowFavorites(
                        false
                      );
                    }}
                  >
                    {t.exploreGames}
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              visibleGames.length >
                0 && (
                <div className="games-grid">
                  {visibleGames.map(
                    (
                      game,
                      index
                    ) => {
                      const favorite =
                        favorites.includes(
                          game.id
                        );

                      return (
                        <article
                          className="game-card"
                          key={
                            game.id
                          }
                          style={{
                            animationDelay: `${Math.min(
                              index *
                                0.045,
                              0.45
                            )}s`,
                          }}
                          onClick={() =>
                            openGame(
                              game
                            )
                          }
                        >
                          <div className="game-image">
                            <img
                              src={
                                game.thumbnail
                              }
                              alt={
                                game.title
                              }
                              loading="lazy"
                            />

                            <div className="card-gradient" />

                            <div className="image-overlay">
                              <div className="play-circle">
                                ▶
                              </div>

                              <span>
                                {
                                  t.exploreGame
                                }
                              </span>
                            </div>

                            <button
                              className={`favorite-btn ${
                                favorite
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                toggleFavorite(
                                  game.id
                                );
                              }}
                              aria-label={
                                t.favorites
                              }
                            >
                              {favorite
                                ? "♥"
                                : "♡"}
                            </button>

                            <span className="game-platform">
                              {
                                game.platform
                              }
                            </span>

                            <span className="card-number">
                              #
                              {String(
                                (page -
                                  1) *
                                  GAMES_PER_PAGE +
                                  index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>
                          </div>

                          <div className="game-content">
                            <span className="game-genre">
                              {game.genre ||
                                "Adventure"}
                            </span>

                            <h3>
                              {
                                game.title
                              }
                            </h3>

                            <p>
                              {
                                game.short_description
                              }
                            </p>

                            <div className="game-footer">
                              <span>
                                📅{" "}
                                {
                                  game.release_date
                                }
                              </span>

                              <button
                                className="card-play"
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();

                                  playGame(
                                    game
                                  );
                                }}
                              >
                                {t.play}
                                <span>
                                  →
                                </span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}

            {!loading &&
              !error &&
              filteredGames.length >
                0 && (
                <div className="pagination">
                  <button
                    disabled={
                      page === 1
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current -
                              1
                          )
                      )
                    }
                  >
                    ←
                  </button>

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  )
                    .filter(
                      (number) => {
                        if (
                          totalPages <=
                          7
                        ) {
                          return true;
                        }

                        return (
                          number ===
                            1 ||
                          number ===
                            totalPages ||
                          Math.abs(
                            number -
                              page
                          ) <= 1
                        );
                      }
                    )
                    .map(
                      (number) => (
                        <button
                          key={
                            number
                          }
                          className={
                            page ===
                            number
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setPage(
                              number
                            )
                          }
                        >
                          {
                            number
                          }
                        </button>
                      )
                    )}

                  <button
                    disabled={
                      page ===
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current +
                              1
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

      {settingsOpen && (
        <SettingsModal
          language={language}
          theme={theme}
          accentColor={accentColor}
          activeTab={settingsTab}
          onTabChange={
            setSettingsTab
          }
          onLanguageChange={
            setLanguage
          }
          onThemeChange={
            setTheme
          }
          onAccentChange={
            setAccentColor
          }
          onClose={() =>
            setSettingsOpen(false)
          }
          onReset={resetSettings}
        />
      )}
    </div>
  );
}

/* =========================================================
   INTRO
========================================================= */

type IntroScreenProps = {
  language: Language;
  theme: Theme;
  t: (typeof translations)["ar"];
  isArabic: boolean;
  leaving: boolean;
  onEnter: () => void;
  onSkip: () => void;
  onLanguage: () => void;
  onTheme: () => void;
};

function IntroScreen({
  language,
  theme,
  t,
  isArabic,
  leaving,
  onEnter,
  onSkip,
  onLanguage,
  onTheme,
}: IntroScreenProps) {
  return (
    <div
      className={`intro-screen ${
        leaving
          ? "intro-leaving"
          : ""
      }`}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <div className="intro-background">
        <div className="intro-orb intro-orb-one" />
        <div className="intro-orb intro-orb-two" />
        <div className="intro-orb intro-orb-three" />
        <div className="intro-grid" />
        <div className="intro-scanline" />
      </div>

      <div className="intro-topbar">
        <div className="intro-logo">
          <span>◈</span>
          GAME
          <b>HUB</b>
        </div>

        <div className="intro-controls">
          <button onClick={onLanguage}>
            🌐{" "}
            {language === "ar"
              ? "EN"
              : "عربي"}
          </button>

          <button onClick={onTheme}>
            {theme === "dark"
              ? "☀"
              : "☾"}
          </button>
        </div>
      </div>

      <div className="intro-content">
        <div className="intro-status">
          <span />
          SYSTEM ONLINE
        </div>

        <div className="intro-icon">
          <div>◈</div>
        </div>

        <p className="intro-welcome">
          {t.welcome}
        </p>

        <h1>
          {isArabic
            ? "ادخل عالم"
            : "ENTER"}

          <span>
            {isArabic
              ? " الألعاب"
              : " THE GAMEVERSE"}
          </span>
        </h1>

        <p className="intro-description">
          {t.welcomeDescription}
        </p>

        <div className="intro-line">
          <span />
          <i />
          <span />
        </div>

        <button
          className="intro-enter-btn"
          onClick={onEnter}
        >
          {t.enterHub}
          <b>→</b>
        </button>

        <button
          className="intro-skip"
          onClick={onSkip}
        >
          {t.skip}
        </button>
      </div>

      <div className="intro-bottom">
        <span>
          GAME HUB / 2026
        </span>

        <span>
          {isArabic
            ? "استعد للعب"
            : "READY TO PLAY"}
        </span>

        <span>
          FREE GAMING
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   DETAILS
========================================================= */

type GameDetailsProps = {
  game: Game;
  isFavorite: boolean;
  language: Language;
  onBack: () => void;
  onFavorite: () => void;
  onPlay: () => void;
};

function GameDetails({
  game,
  isFavorite,
  language,
  onBack,
  onFavorite,
  onPlay,
}: GameDetailsProps) {
  const t =
    translations[language];

  return (
    <main className="details-page">
      <button
        className="back-btn"
        onClick={onBack}
      >
        ← {t.back}
      </button>

      <section className="details-hero">
        <div className="details-image">
          <img
            src={game.thumbnail}
            alt={game.title}
          />

          <div className="details-image-glow" />

          <span className="details-image-label">
            <span />
            {t.available}
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
              onClick={
                onFavorite
              }
            >
              {isFavorite
                ? `♥ ${t.removeFavorite}`
                : `♡ ${t.addFavorite}`}
            </button>

            <button
              className="play-btn"
              onClick={onPlay}
            >
              ▶ {t.playGame}
              <span>→</span>
            </button>
          </div>

          <div className="details-mini-stats">
            <div>
              <span>🎮</span>

              <strong>
                {game.platform}
              </strong>

              <small>
                {t.platform}
              </small>
            </div>

            <div>
              <span>★</span>

              <strong>
                FREE
              </strong>

              <small>
                {t.freeToPlay}
              </small>
            </div>

            <div>
              <span>⚡</span>

              <strong>
                ONLINE
              </strong>

              <small>
                {t.onlineGame}
              </small>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <InfoCard
          icon="🎮"
          label={t.platform}
          value={game.platform}
        />

        <InfoCard
          icon="🏷"
          label={t.genres}
          value={game.genre}
        />

        <InfoCard
          icon="◆"
          label={t.developer}
          value={
            game.developer ||
            "Unknown"
          }
        />

        <InfoCard
          icon="📅"
          label={t.releaseDate}
          value={game.release_date}
        />

        <InfoCard
          icon="▣"
          label={t.publisher}
          value={
            game.publisher ||
            "Unknown"
          }
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

/* =========================================================
   PLAYER
========================================================= */

type GamePlayerProps = {
  game: Game;
  playerRef: RefObject<HTMLDivElement | null>;
  isFullscreen: boolean;
  language: Language;
  onBack: () => void;
  onFullscreen: () => void;
};

function GamePlayer({
  game,
  playerRef,
  isFullscreen,
  language,
  onBack,
  onFullscreen,
}: GamePlayerProps) {
  const t =
    translations[language];

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

            <div className="player-thumb">
              <img
                src={game.thumbnail}
                alt={game.title}
              />
            </div>

            <div>
              <span>
                {t.nowPlaying}
              </span>

              <h2>
                {game.title}
              </h2>
            </div>
          </div>

          <div className="player-controls">
            <span className="online-badge">
              <i />
              {t.online}
            </span>

            <button
              className="fullscreen-btn"
              onClick={
                onFullscreen
              }
            >
              {isFullscreen
                ? `⛶ ${t.exitFullscreen}`
                : `⛶ ${t.fullscreen}`}
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

          <div className="frame-corner top-left" />
          <div className="frame-corner top-right" />
          <div className="frame-corner bottom-left" />
          <div className="frame-corner bottom-right" />
        </div>

        <div className="player-footer">
          <div className="player-game-info">
            <span className="player-genre">
              {game.genre}
            </span>

            <span>•</span>

            <span>
              {game.platform}
            </span>
          </div>

          <span className="player-tip">
            🎮 {t.enjoyGame}
          </span>

          <button
            className="player-details-btn"
            onClick={onBack}
          >
            {t.gameDetails} →
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

type SettingsModalProps = {
  language: Language;
  theme: Theme;
  accentColor: AccentColor;

  activeTab:
    | "appearance"
    | "language"
    | "color";

  onTabChange: (
    tab:
      | "appearance"
      | "language"
      | "color"
  ) => void;

  onLanguageChange: (
    value: Language
  ) => void;

  onThemeChange: (
    value: Theme
  ) => void;

  onAccentChange: (
    value: AccentColor
  ) => void;

  onClose: () => void;

  onReset: () => void;
};

function SettingsModal({
  language,
  theme,
  accentColor,
  activeTab,
  onTabChange,
  onLanguageChange,
  onThemeChange,
  onAccentChange,
  onClose,
  onReset,
}: SettingsModalProps) {
  const t =
    translations[language];

  const isArabic =
    language === "ar";

  return (
    <div
      className="settings-overlay"
      onClick={onClose}
    >
      <section
        className="settings-panel"
        dir={
          isArabic
            ? "rtl"
            : "ltr"
        }
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <header className="settings-header">
          <div className="settings-title">
            <div className="settings-title-icon">
              ⚙
            </div>

            <div className="settings-title-text">
              <strong>
                {t.settings}
              </strong>

              <span>
                GAME HUB
              </span>
            </div>
          </div>

          <button
            className="settings-close"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="settings-body">
          <aside className="settings-sidebar">
            <button
              className={
                activeTab ===
                "appearance"
                  ? "settings-side-btn active"
                  : "settings-side-btn"
              }
              onClick={() =>
                onTabChange(
                  "appearance"
                )
              }
            >
              <span>🎨</span>
              {t.appearance}
            </button>

            <button
              className={
                activeTab ===
                "language"
                  ? "settings-side-btn active"
                  : "settings-side-btn"
              }
              onClick={() =>
                onTabChange(
                  "language"
                )
              }
            >
              <span>🌐</span>
              {t.language}
            </button>

            <button
              className={
                activeTab === "color"
                  ? "settings-side-btn active"
                  : "settings-side-btn"
              }
              onClick={() =>
                onTabChange(
                  "color"
                )
              }
            >
              <span>✨</span>
              {t.accentColor}
            </button>

            <button
              className="settings-side-btn reset-side-btn"
              onClick={onReset}
            >
              <span>↻</span>
              {t.resetSettings}
            </button>
          </aside>

          <div className="settings-content">
            {activeTab ===
              "appearance" && (
              <>
                <div className="settings-content-title">
                  <h3>
                    {t.appearance}
                  </h3>

                  <p>
                    {t.chooseAppearance}
                  </p>
                </div>

                <div className="setting-card">
                  <div className="setting-card-header">
                    <div className="setting-card-icon">
                      ☀
                    </div>

                    <div className="setting-card-title">
                      <strong>
                        {isArabic
                          ? "الوضع"
                          : "Theme"}
                      </strong>

                      <span>
                        {t.chooseAppearance}
                      </span>
                    </div>
                  </div>

                  <div className="setting-options">
                    <button
                      className={
                        theme === "dark"
                          ? "setting-option active"
                          : "setting-option"
                      }
                      onClick={() =>
                        onThemeChange(
                          "dark"
                        )
                      }
                    >
                      <span className="setting-option-icon">
                        🌙
                      </span>

                      <span className="setting-option-text">
                        <strong>
                          {
                            t.darkMode
                          }
                        </strong>

                        <span>
                          Dark
                        </span>
                      </span>

                      {theme ===
                        "dark" && (
                        <span className="setting-option-check">
                          ✓
                        </span>
                      )}
                    </button>

                    <button
                      className={
                        theme === "light"
                          ? "setting-option active"
                          : "setting-option"
                      }
                      onClick={() =>
                        onThemeChange(
                          "light"
                        )
                      }
                    >
                      <span className="setting-option-icon">
                        ☀️
                      </span>

                      <span className="setting-option-text">
                        <strong>
                          {
                            t.lightMode
                          }
                        </strong>

                        <span>
                          Light
                        </span>
                      </span>

                      {theme ===
                        "light" && (
                        <span className="setting-option-check">
                          ✓
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab ===
              "language" && (
              <>
                <div className="settings-content-title">
                  <h3>
                    {t.language}
                  </h3>

                  <p>
                    {t.chooseLanguage}
                  </p>
                </div>

                <div className="setting-card">
                  <div className="setting-card-header">
                    <div className="setting-card-icon">
                      🌐
                    </div>

                    <div className="setting-card-title">
                      <strong>
                        {isArabic
                          ? "لغة الموقع"
                          : "Interface Language"}
                      </strong>

                      <span>
                        {t.chooseLanguage}
                      </span>
                    </div>
                  </div>

                  <div className="setting-options">
                    <button
                      className={
                        language === "ar"
                          ? "setting-option active"
                          : "setting-option"
                      }
                      onClick={() =>
                        onLanguageChange(
                          "ar"
                        )
                      }
                    >
                      <span className="setting-option-icon">
                        🇪🇬
                      </span>

                      <span className="setting-option-text">
                        <strong>
                          {t.arabic}
                        </strong>

                        <span>
                          Arabic
                        </span>
                      </span>

                      {language ===
                        "ar" && (
                        <span className="setting-option-check">
                          ✓
                        </span>
                      )}
                    </button>

                    <button
                      className={
                        language === "en"
                          ? "setting-option active"
                          : "setting-option"
                      }
                      onClick={() =>
                        onLanguageChange(
                          "en"
                        )
                      }
                    >
                      <span className="setting-option-icon">
                        🇺🇸
                      </span>

                      <span className="setting-option-text">
                        <strong>
                          {t.english}
                        </strong>

                        <span>
                          English
                        </span>
                      </span>

                      {language ===
                        "en" && (
                        <span className="setting-option-check">
                          ✓
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "color" && (
              <>
                <div className="settings-content-title">
                  <h3>
                    {t.accentColor}
                  </h3>

                  <p>
                    {t.chooseAccent}
                  </p>
                </div>

                <div className="setting-card">
                  <div className="setting-card-header">
                    <div className="setting-card-icon">
                      ✨
                    </div>

                    <div className="setting-card-title">
                      <strong>
                        {isArabic
                          ? "اللون الأساسي"
                          : "Main Color"}
                      </strong>

                      <span>
                        {t.chooseAccent}
                      </span>
                    </div>
                  </div>

                  <div className="color-options">
                    <button
                      className={`color-option color-blue ${
                        accentColor ===
                        "blue"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        onAccentChange(
                          "blue"
                        )
                      }
                      title={t.blue}
                    >
                      <span />
                    </button>

                    <button
                      className={`color-option color-purple ${
                        accentColor ===
                        "purple"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        onAccentChange(
                          "purple"
                        )
                      }
                      title={t.purple}
                    >
                      <span />
                    </button>

                    <button
                      className={`color-option color-green ${
                        accentColor ===
                        "green"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        onAccentChange(
                          "green"
                        )
                      }
                      title={t.green}
                    >
                      <span />
                    </button>

                    <button
                      className={`color-option color-orange ${
                        accentColor ===
                        "orange"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        onAccentChange(
                          "orange"
                        )
                      }
                      title={t.orange}
                    >
                      <span />
                    </button>

                    <button
                      className={`color-option color-red ${
                        accentColor ===
                        "red"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        onAccentChange(
                          "red"
                        )
                      }
                      title={t.red}
                    >
                      <span />
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="settings-note">
              <span>✓</span>

              <p>
                {isArabic
                  ? "الإعدادات يتم حفظها تلقائيًا على جهازك."
                  : "Your settings are saved automatically on this device."}
              </p>
            </div>
          </div>
        </div>

        <footer className="settings-footer">
          <span>
            GAME HUB
          </span>

          <button
            className="settings-done"
            onClick={onClose}
          >
            {t.done}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default App;