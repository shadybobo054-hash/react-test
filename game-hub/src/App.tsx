import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
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
type Density = "comfortable" | "compact";
type CardView = "grid" | "list";
type SettingsTab =
  | "appearance"
  | "language"
  | "color"
  | "behavior"
  | "data";

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
    exploreUniverse:
      "استكشف عالم الألعاب",

    yourFavorites: "ألعابك المفضلة",
    discoverGames: "اكتشف الألعاب",

    all: "الكل",
    filters: "الفلاتر",
    allGenres: "كل الأنواع",
    allPlatforms: "كل المنصات",

    defaultSort:
      "الترتيب الافتراضي",
    sortName: "حسب الاسم",
    sortDate:
      "حسب تاريخ الإصدار",

    reset: "إعادة ضبط",

    loading:
      "جاري تحميل الألعاب",

    preparing:
      "بنجهز عالم الألعاب ليك...",

    somethingWrong:
      "حصل خطأ",

    tryAgain:
      "حاول مرة أخرى",

    noGames:
      "لا توجد ألعاب",

    emptyFavorites:
      "المفضلة فارغة",

    addFavorites:
      "أضف ألعابك المفضلة وستظهر هنا.",

    changeSearch:
      "جرب كلمة بحث مختلفة أو غير الفلاتر.",

    back:
      "العودة للألعاب",

    available:
      "اللعبة متاحة",

    addFavorite:
      "إضافة للمفضلة",

    removeFavorite:
      "إزالة من المفضلة",

    playGame:
      "العب الآن",

    platform:
      "المنصة",

    developer:
      "المطور",

    publisher:
      "الناشر",

    releaseDate:
      "تاريخ الإصدار",

    freeToPlay:
      "مجاني للعب",

    onlineGame:
      "أونلاين",

    nowPlaying:
      "يتم اللعب الآن",

    online:
      "متصل",

    fullscreen:
      "ملء الشاشة",

    exitFullscreen:
      "خروج",

    enjoyGame:
      "استمتع باللعبة",

    gameDetails:
      "تفاصيل اللعبة",

    welcome:
      "مرحبًا بك في",

    welcomeDescription:
      "اكتشف الألعاب المجانية، واحفظ المفضلة، واعثر على مغامرتك القادمة.",

    enterHub:
      "دخول إلى NEXORA",

    skip:
      "تخطي",

    settings:
      "الإعدادات",

    language:
      "اللغة",

    appearance:
      "المظهر",

    accentColor:
      "لون الواجهة",

    behavior:
      "السلوك",

    data:
      "البيانات",

    chooseLanguage:
      "اختار لغة الموقع",

    chooseAppearance:
      "اختار الشكل المناسب ليك",

    chooseAccent:
      "اختار اللون الأساسي للموقع",

    arabic:
      "العربية",

    english:
      "English",

    darkMode:
      "الوضع الليلي",

    lightMode:
      "الوضع الفاتح",

    blue:
      "أزرق",

    purple:
      "بنفسجي",

    green:
      "أخضر",

    orange:
      "برتقالي",

    red:
      "أحمر",

    resetSettings:
      "استرجاع الإعدادات",

    restoreDefaults:
      "استرجاع الإعدادات الافتراضية",

    done:
      "تم",

    dashboard:
      "لوحة التحكم",

    trending:
      "الأكثر انتشارًا",

    popular:
      "الألعاب الرائجة",

    newReleases:
      "إصدارات جديدة",

    recommended:
      "مختارة لك",

    recentlyPlayed:
      "لعبتها مؤخرًا",

    recentlyViewed:
      "شاهدتها مؤخرًا",

    continuePlaying:
      "كمل لعب",

    searchHistory:
      "سجل البحث",

    clearHistory:
      "مسح سجل البحث",

    clearRecently:
      "مسح الألعاب الأخيرة",

    collections:
      "المجموعات",

    createCollection:
      "إنشاء مجموعة",

    collectionName:
      "اسم المجموعة",

    addToCollection:
      "إضافة للمجموعة",

    noCollections:
      "مفيش مجموعات لسه",

    create:
      "إنشاء",

    share:
      "مشاركة",

    copied:
      "تم نسخ الرابط",

    addedFavorite:
      "تمت الإضافة للمفضلة",

    removedFavorite:
      "تمت الإزالة من المفضلة",

    addedCollection:
      "تمت الإضافة للمجموعة",

    clear:
      "مسح",

    grid:
      "شبكة",

    list:
      "قائمة",

    compact:
      "مضغوط",

    comfortable:
      "مريح",

    animations:
      "الحركات",

    animationsOn:
      "الحركات مفعلة",

    animationsOff:
      "الحركات متوقفة",

    shortcuts:
      "اختصارات لوحة المفاتيح",

    exportData:
      "تصدير البيانات",

    resetData:
      "حذف البيانات المحلية",

    searchFocus:
      "فتح البحث",

    homeShortcut:
      "الرئيسية",

    favoriteShortcut:
      "المفضلة",

    closeShortcut:
      "إغلاق",

    similarGames:
      "ألعاب مشابهة",

    popularNow:
      "الشائع الآن",

    totalGames:
      "كل الألعاب",

    quickActions:
      "إجراءات سريعة",

    backup:
      "نسخة احتياطية",
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

    search:
      "SEARCH",

    exploreGames:
      "EXPLORE GAMES",

    myCollection:
      "MY COLLECTION",

    featuredGame:
      "FEATURED GAME",

    exploreGame:
      "EXPLORE GAME",

    nextUp:
      "NEXT UP",

    discoverLabel:
      "DISCOVER",

    scroll:
      "SCROLL DOWN",

    gamesFound:
      "GAMES FOUND",

    genres:
      "GENRES",

    yourCollection:
      "YOUR COLLECTION",

    exploreUniverse:
      "EXPLORE THE UNIVERSE",

    yourFavorites:
      "YOUR FAVORITES",

    discoverGames:
      "DISCOVER GAMES",

    all:
      "ALL",

    filters:
      "FILTERS",

    allGenres:
      "All Genres",

    allPlatforms:
      "All Platforms",

    defaultSort:
      "Sort: Default",

    sortName:
      "Sort: Name",

    sortDate:
      "Sort: Release Date",

    reset:
      "RESET",

    loading:
      "LOADING GAMES",

    preparing:
      "Preparing your gaming universe...",

    somethingWrong:
      "Something went wrong",

    tryAgain:
      "TRY AGAIN",

    noGames:
      "NO GAMES FOUND",

    emptyFavorites:
      "YOUR FAVORITES ARE EMPTY",

    addFavorites:
      "Add your favorite games and they will appear here.",

    changeSearch:
      "Try another search or change your filters.",

    back:
      "BACK TO GAMES",

    available:
      "GAME AVAILABLE",

    addFavorite:
      "ADD TO FAVORITES",

    removeFavorite:
      "REMOVE FAVORITE",

    playGame:
      "PLAY GAME",

    platform:
      "Platform",

    developer:
      "Developer",

    publisher:
      "Publisher",

    releaseDate:
      "Release Date",

    freeToPlay:
      "TO PLAY",

    onlineGame:
      "ONLINE",

    nowPlaying:
      "NOW PLAYING",

    online:
      "ONLINE",

    fullscreen:
      "FULLSCREEN",

    exitFullscreen:
      "EXIT",

    enjoyGame:
      "ENJOY THE GAME",

    gameDetails:
      "GAME DETAILS",

    welcome:
      "WELCOME TO",

    welcomeDescription:
      "Discover free games, save your favorites and find your next adventure.",

    enterHub:
      "ENTER NEXORA",

    skip:
      "SKIP",

    settings:
      "Settings",

    language:
      "Language",

    appearance:
      "Appearance",

    accentColor:
      "Accent Color",

    behavior:
      "Behavior",

    data:
      "Data",

    chooseLanguage:
      "Choose your interface language",

    chooseAppearance:
      "Choose your preferred appearance",

    chooseAccent:
      "Choose your main interface color",

    arabic:
      "Arabic",

    english:
      "English",

    darkMode:
      "Dark Mode",

    lightMode:
      "Light Mode",

    blue:
      "Blue",

    purple:
      "Purple",

    green:
      "Green",

    orange:
      "Orange",

    red:
      "Red",

    resetSettings:
      "Reset Settings",

    restoreDefaults:
      "Restore Defaults",

    done:
      "Done",

    dashboard:
      "Dashboard",

    trending:
      "TRENDING",

    popular:
      "POPULAR GAMES",

    newReleases:
      "NEW RELEASES",

    recommended:
      "RECOMMENDED",

    recentlyPlayed:
      "RECENTLY PLAYED",

    recentlyViewed:
      "RECENTLY VIEWED",

    continuePlaying:
      "CONTINUE PLAYING",

    searchHistory:
      "SEARCH HISTORY",

    clearHistory:
      "CLEAR HISTORY",

    clearRecently:
      "CLEAR RECENT",

    collections:
      "COLLECTIONS",

    createCollection:
      "CREATE COLLECTION",

    collectionName:
      "Collection name",

    addToCollection:
      "ADD TO COLLECTION",

    noCollections:
      "No collections yet",

    create:
      "CREATE",

    share:
      "SHARE",

    copied:
      "Link copied",

    addedFavorite:
      "Added to favorites",

    removedFavorite:
      "Removed from favorites",

    addedCollection:
      "Added to collection",

    clear:
      "CLEAR",

    grid:
      "GRID",

    list:
      "LIST",

    compact:
      "COMPACT",

    comfortable:
      "COMFORTABLE",

    animations:
      "ANIMATIONS",

    animationsOn:
      "Animations enabled",

    animationsOff:
      "Animations disabled",

    shortcuts:
      "KEYBOARD SHORTCUTS",

    exportData:
      "EXPORT DATA",

    resetData:
      "DELETE LOCAL DATA",

    searchFocus:
      "Focus search",

    homeShortcut:
      "Home",

    favoriteShortcut:
      "Favorites",

    closeShortcut:
      "Close",

    similarGames:
      "SIMILAR GAMES",

    popularNow:
      "POPULAR NOW",

    totalGames:
      "TOTAL GAMES",

    quickActions:
      "QUICK ACTIONS",

    backup:
      "BACKUP",
  },
} as const;

type Translation =
  (typeof translations)[Language];

function readJSON<T>(
  key: string,
  fallback: T
): T {
  try {
    const raw =
      localStorage.getItem(key);

    return raw
      ? (JSON.parse(raw) as T)
      : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [games, setGames] =
    useState<Game[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [genre, setGenre] =
    useState("All");

  const [platform, setPlatform] =
    useState("All");

  const [sort, setSort] =
    useState<SortOption>(
      "default"
    );

  const [page, setPage] =
    useState(1);

  const [favorites, setFavorites] =
    useState<number[]>(() =>
      readJSON<number[]>(
        "gameHubFavorites",
        []
      )
    );

  const [
    recentlyPlayed,
    setRecentlyPlayed,
  ] = useState<number[]>(() =>
    readJSON<number[]>(
      "gameHubRecentlyPlayed",
      []
    )
  );

  const [
    recentlyViewed,
    setRecentlyViewed,
  ] = useState<number[]>(() =>
    readJSON<number[]>(
      "gameHubRecentlyViewed",
      []
    )
  );

  const [
    searchHistory,
    setSearchHistory,
  ] = useState<string[]>(() =>
    readJSON<string[]>(
      "gameHubSearchHistory",
      []
    )
  );

  const [
    collections,
    setCollections,
  ] = useState<
    Record<string, number[]>
  >(() =>
    readJSON<
      Record<string, number[]>
    >(
      "gameHubCollections",
      {}
    )
  );

  const [
    showFavorites,
    setShowFavorites,
  ] = useState(false);

  const [
    selectedGame,
    setSelectedGame,
  ] = useState<Game | null>(
    null
  );

  const [view, setView] =
    useState<View>("home");

  const [
    language,
    setLanguage,
  ] = useState<Language>(() =>
    localStorage.getItem(
      "gameHubLanguage"
    ) === "en"
      ? "en"
      : "ar"
  );

  const [theme, setTheme] =
    useState<Theme>(() =>
      localStorage.getItem(
        "gameHubTheme"
      ) === "light"
        ? "light"
        : "dark"
    );

  const [
    accentColor,
    setAccentColor,
  ] = useState<AccentColor>(() => {
    const saved =
      localStorage.getItem(
        "gameHubAccent"
      ) as AccentColor | null;

    return saved &&
      [
        "blue",
        "purple",
        "green",
        "orange",
        "red",
      ].includes(saved)
      ? saved
      : "blue";
  });

  const [density, setDensity] =
    useState<Density>(() =>
      localStorage.getItem(
        "gameHubDensity"
      ) === "compact"
        ? "compact"
        : "comfortable"
    );

  const [cardView, setCardView] =
    useState<CardView>(() =>
      localStorage.getItem(
        "gameHubCardView"
      ) === "list"
        ? "list"
        : "grid"
    );

  const [
    animations,
    setAnimations,
  ] = useState(
    () =>
      localStorage.getItem(
        "gameHubAnimations"
      ) !== "false"
  );

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false);

  const [
    settingsTab,
    setSettingsTab,
  ] =
    useState<SettingsTab>(
      "appearance"
    );

  const [
    collectionModal,
    setCollectionModal,
  ] = useState<Game | null>(
    null
  );

  const [
    collectionName,
    setCollectionName,
  ] = useState("");

  const [toast, setToast] =
    useState("");

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    showTopButton,
    setShowTopButton,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    showIntro,
    setShowIntro,
  ] = useState(
    () =>
      sessionStorage.getItem(
        "gameHubIntroSeen"
      ) !== "true"
  );

  const [
    introLeaving,
    setIntroLeaving,
  ] = useState(false);

  const [
    isFullscreen,
    setIsFullscreen,
  ] = useState(false);

  const playerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const searchInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const t: Translation =
    translations[language];

  const isArabic =
    language === "ar";

  const showToast = (
    message: string
  ) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const loadGames =
    async () => {
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

        const data =
          (await response.json()) as Game[];

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
    void loadGames();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "gameHubFavorites",
      JSON.stringify(
        favorites
      )
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubRecentlyPlayed",
      JSON.stringify(
        recentlyPlayed
      )
    );
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubRecentlyViewed",
      JSON.stringify(
        recentlyViewed
      )
    );
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubSearchHistory",
      JSON.stringify(
        searchHistory
      )
    );
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubCollections",
      JSON.stringify(
        collections
      )
    );
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubLanguage",
      language
    );

    document.documentElement.lang =
      language;

    document.documentElement.dir =
      isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

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

  useEffect(() => {
    localStorage.setItem(
      "gameHubDensity",
      density
    );
  }, [density]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubCardView",
      cardView
    );
  }, [cardView]);

  useEffect(() => {
    localStorage.setItem(
      "gameHubAnimations",
      String(animations)
    );
  }, [animations]);

  useEffect(() => {
    const handleScroll = () => {
      const max =
        document.documentElement
          .scrollHeight -
        window.innerHeight;

      setProgress(
        max > 0
          ? (window.scrollY / max) *
              100
          : 0
      );

      setShowTopButton(
        window.scrollY > 450
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    const handleFullscreen =
      () => {
        setIsFullscreen(
          Boolean(
            document.fullscreenElement
          )
        );
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      );
  }, []);

  const genres = useMemo(() => {
    const values =
      games
        .map(
          (game) =>
            game.genre
        )
        .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(values)
      ).sort(),
    ];
  }, [games]);

  const platforms = useMemo(() => {
    const values =
      games.flatMap(
        (game) =>
          game.platform
            ? game.platform
                .split(",")
                .map(
                  (item) =>
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

  const filteredGames =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim();

      let result =
        games.filter(
          (game) => {
            const searchable = [
              game.title,
              game.short_description,
              game.genre,
              game.publisher,
              game.developer,
              game.platform,
            ]
              .filter(Boolean)
              .map((value) =>
                value.toLowerCase()
              );

            const matchesSearch =
              !query ||
              searchable.some(
                (value) =>
                  value.includes(
                    query
                  )
              );

            const matchesGenre =
              genre === "All" ||
              game.genre === genre;

            const matchesPlatform =
              platform === "All" ||
              game.platform?.includes(
                platform
              );

            const matchesFavorites =
              !showFavorites ||
              favorites.includes(
                game.id
              );

            return (
              matchesSearch &&
              matchesGenre &&
              matchesPlatform &&
              matchesFavorites
            );
          }
        );

      if (sort === "name") {
        result =
          [...result].sort(
            (a, b) =>
              a.title.localeCompare(
                b.title
              )
          );
      }

      if (sort === "date") {
        result =
          [...result].sort(
            (a, b) =>
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

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredGames.length /
          GAMES_PER_PAGE
      )
    );

  const visibleGames =
    useMemo(() => {
      const start =
        (page - 1) *
        GAMES_PER_PAGE;

      return filteredGames.slice(
        start,
        start +
          GAMES_PER_PAGE
      );
    }, [
      filteredGames,
      page,
    ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    genre,
    platform,
    sort,
    showFavorites,
  ]);

  const favoriteGames =
    useMemo(
      () =>
        games.filter((game) =>
          favorites.includes(
            game.id
          )
        ),
      [games, favorites]
    );

  const getGamesByIds = (
    ids: number[]
  ): Game[] =>
    ids
      .map((id) =>
        games.find(
          (game) =>
            game.id === id
        )
      )
      .filter(
        (game): game is Game =>
          Boolean(game)
      );

  const recentlyPlayedGames =
    getGamesByIds(
      recentlyPlayed
    );

  const recentlyViewedGames =
    getGamesByIds(
      recentlyViewed
    );

  const trendingGames =
    games.slice(0, 6);

  const popularGames =
    games.slice(0, 8);

  const newReleaseGames =
    useMemo(
      () =>
        [...games]
          .sort(
            (a, b) =>
              b.release_date.localeCompare(
                a.release_date
              )
          )
          .slice(0, 6),
      [games]
    );

  const recommendedGames =
    useMemo(() => {
      if (!games.length) {
        return [];
      }

      const favoriteGenres =
        new Set(
          favoriteGames
            .map(
              (game) =>
                game.genre
            )
            .filter(Boolean)
        );

      const matches =
        games.filter(
          (game) =>
            !favorites.includes(
              game.id
            ) &&
            favoriteGenres.has(
              game.genre
            )
        );

      return (
        matches.length
          ? matches
          : games.filter(
              (game) =>
                !favorites.includes(
                  game.id
                )
            )
      ).slice(0, 6);
    }, [
      games,
      favoriteGames,
      favorites,
    ]);

  const suggestions =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return [];
      }

      return games
        .filter((game) =>
          game.title
            .toLowerCase()
            .includes(query)
        )
        .slice(0, 6);
    }, [
      games,
      search,
    ]);

  const similarGames =
    useMemo(() => {
      if (!selectedGame) {
        return [];
      }

      return games
        .filter(
          (game) =>
            game.id !==
              selectedGame.id &&
            game.genre ===
              selectedGame.genre
        )
        .slice(0, 6);
    }, [
      games,
      selectedGame,
    ]);

  const toggleFavorite = (
    id: number
  ) => {
    setFavorites(
      (current) => {
        const exists =
          current.includes(id);

        showToast(
          exists
            ? t.removedFavorite
            : t.addedFavorite
        );

        return exists
          ? current.filter(
              (value) =>
                value !== id
            )
          : [
              ...current,
              id,
            ];
      }
    );
  };

  const rememberGame = (
    setter: Dispatch<
      SetStateAction<number[]>
    >,
    id: number
  ) => {
    setter(
      (current) =>
        [
          id,
          ...current.filter(
            (item) =>
              item !== id
          ),
        ].slice(0, 12)
    );
  };

  const openGame = (
    game: Game
  ) => {
    setSelectedGame(
      game
    );

    setView("details");
    setShowFavorites(false);

    rememberGame(
      setRecentlyViewed,
      game.id
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const playGame = (
    game: Game
  ) => {
    setSelectedGame(
      game
    );

    setView("player");

    rememberGame(
      setRecentlyPlayed,
      game.id
    );

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

    window.setTimeout(
      () => {
        document
          .getElementById(
            "games-section"
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      },
      50
    );
  };

  const scrollToGames =
    () => {
      document
        .getElementById(
          "games-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    };

  const resetFilters = () => {
    setSearch("");
    setGenre("All");
    setPlatform("All");
    setSort("default");
    setPage(1);
    setSearchOpen(false);
  };

  const commitSearch = (
    value: string
  ) => {
    const query =
      value.trim();

    if (!query) {
      return;
    }

    setSearchHistory(
      (current) =>
        [
          query,
          ...current.filter(
            (item) =>
              item.toLowerCase() !==
              query.toLowerCase()
          ),
        ].slice(0, 10)
    );
  };

  const createCollection =
    () => {
      const name =
        collectionName.trim();

      if (
        !name ||
        collections[name]
      ) {
        return;
      }

      setCollections(
        (current) => ({
          ...current,
          [name]: [],
        })
      );

      setCollectionName("");

      showToast(
        isArabic
          ? "تم إنشاء المجموعة"
          : "Collection created"
      );
    };

  const addToCollection = (
    name: string
  ) => {
    if (!collectionModal) {
      return;
    }

    setCollections(
      (current) => {
        const ids =
          current[name] ??
          [];

        if (
          ids.includes(
            collectionModal.id
          )
        ) {
          return current;
        }

        return {
          ...current,
          [name]: [
            ...ids,
            collectionModal.id,
          ],
        };
      }
    );

    setCollectionModal(null);

    showToast(
      t.addedCollection
    );
  };

  const shareGame = async (
    game: Game
  ) => {
    const url =
      game.game_url ||
      window.location.href;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title: game.title,
          text: game.short_description,
          url,
        });
      } else if (
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(
          url
        );

        showToast(
          t.copied
        );
      }
    } catch {
      // User cancelled sharing.
    }
  };

  const toggleFullscreen =
    async () => {
      if (!playerRef.current) {
        return;
      }

      try {
        if (
          !document.fullscreenElement
        ) {
          await playerRef.current.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch {
        // Unsupported.
      }
    };

  const resetSettings = () => {
    setLanguage("ar");
    setTheme("dark");
    setAccentColor("blue");
    setDensity(
      "comfortable"
    );
    setCardView("grid");
    setAnimations(true);
    setSettingsTab(
      "appearance"
    );

    showToast(
      isArabic
        ? "تم استرجاع الإعدادات"
        : "Settings restored"
    );
  };

  const exportData = () => {
    const payload = {
      favorites,
      recentlyPlayed,
      recentlyViewed,
      searchHistory,
      collections,
      language,
      theme,
      accentColor,
      density,
      cardView,
      animations,
    };

    const blob =
      new Blob(
        [
          JSON.stringify(
            payload,
            null,
            2
          ),
        ],
        {
          type:
            "application/json",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      "nexora-backup.json";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url
    );
  };

  const clearLocalData =
    () => {
      [
        "gameHubFavorites",
        "gameHubRecentlyPlayed",
        "gameHubRecentlyViewed",
        "gameHubSearchHistory",
        "gameHubCollections",
      ].forEach((key) =>
        localStorage.removeItem(
          key
        )
      );

      setFavorites([]);
      setRecentlyPlayed([]);
      setRecentlyViewed([]);
      setSearchHistory([]);
      setCollections({});

      showToast(
        isArabic
          ? "تم حذف البيانات المحلية"
          : "Local data deleted"
      );
    };

  const finishIntro =
    () => {
      setIntroLeaving(true);

      window.setTimeout(
        () => {
          sessionStorage.setItem(
            "gameHubIntroSeen",
            "true"
          );

          setShowIntro(false);
          setIntroLeaving(false);
        },
        500
      );
    };

  useEffect(() => {
    const handleKeyboard =
      (
        event: KeyboardEvent
      ) => {
        const target =
          event.target as HTMLElement;

        const typing =
          target.tagName ===
            "INPUT" ||
          target.tagName ===
            "TEXTAREA" ||
          target.tagName ===
            "SELECT";

        if (
          event.key ===
          "Escape"
        ) {
          setSettingsOpen(
            false
          );

          setCollectionModal(
            null
          );

          setSearchOpen(
            false
          );
        }

        if (
          event.key ===
            "/" &&
          !typing
        ) {
          event.preventDefault();

          setSearchOpen(
            true
          );

          window.setTimeout(
            () => {
              searchInputRef.current?.focus();
            },
            0
          );
        }

        if (
          event.key.toLowerCase() ===
            "f" &&
          !typing
        ) {
          openFavorites();
        }

        if (
          event.key.toLowerCase() ===
            "g" &&
          !typing
        ) {
          goHome();
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
  }, []);

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
        leaving={
          introLeaving
        }
        onEnter={
          finishIntro
        }
        onSkip={
          finishIntro
        }
        onLanguage={() =>
          setLanguage(
            language ===
              "ar"
              ? "en"
              : "ar"
          )
        }
        onTheme={() =>
          setTheme(
            theme ===
              "dark"
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
      } ${
        density ===
        "compact"
          ? "density-compact"
          : "density-comfortable"
      } ${
        animations
          ? ""
          : "animations-off"
      } ${
        cardView ===
        "list"
          ? "cards-list-view"
          : ""
      }`}
    >
      <div
        className="scroll-progress"
        style={{
          width: `${progress}%`,
        }}
      />

      <div className="background-effects">
        <div className="background-orb orb-purple" />
        <div className="background-orb orb-cyan" />
        <div className="background-orb orb-blue" />
        <div className="background-grid" />
        <div className="background-noise" />
      </div>

      <header className="navbar">
        <button
          className="logo"
          onClick={
            goHome
          }
          aria-label="Home"
        >
          <span className="logo-icon">
            ◈
          </span>

          <span className="logo-name">
            <span className="logo-main">
              NEX
            </span>{" "}
            <span className="logo-gradient">
              ORA
            </span>
          </span>
        </button>

        <nav className="nav-links">
          <button
            className={
              view ===
                "home" &&
              !showFavorites
                ? "nav-item nav-active"
                : "nav-item"
            }
            onClick={
              goHome
            }
          >
            <span>
              ⌂
            </span>

            {
              t.games
            }
          </button>

          <button
            className={
              showFavorites
                ? "nav-item nav-active"
                : "nav-item"
            }
            onClick={
              openFavorites
            }
          >
            <span>
              ♥
            </span>

            {
              t.favorites
            }

            <b className="favorite-count">
              {
                favorites.length
              }
            </b>
          </button>
        </nav>

        <div className="navbar-actions">
          <button
            className="nav-setting-btn"
            onClick={() =>
              setLanguage(
                language ===
                  "ar"
                  ? "en"
                  : "ar"
              )
            }
          >
            <span className="nav-setting-icon">
              🌐
            </span>

            <span className="nav-setting-text">
              {
                language ===
                "ar"
                  ? "عربي"
                  : "EN"
              }
            </span>
          </button>

          <button
            className="nav-setting-btn"
            onClick={() =>
              setTheme(
                theme ===
                  "dark"
                  ? "light"
                  : "dark"
              )
            }
          >
            <span className="nav-setting-icon">
              {
                theme ===
                "dark"
                  ? "☀"
                  : "☾"
              }
            </span>

            <span className="nav-setting-text">
              {
                theme ===
                "dark"
                  ? "Light"
                  : "Dark"
              }
            </span>
          </button>

          <button
            className="nav-setting-btn"
            onClick={() =>
              setSettingsOpen(
                true
              )
            }
          >
            <span className="nav-setting-icon">
              ⚙
            </span>

            <span className="nav-setting-text">
              {
                t.settings
              }
            </span>
          </button>

          <div className="nav-status">
            <span />
            {
              t.live
            }
          </div>
        </div>
      </header>

      {view ===
        "player" &&
        selectedGame && (
          <GamePlayer
            game={
              selectedGame
            }
            playerRef={
              playerRef
            }
            isFullscreen={
              isFullscreen
            }
            language={
              language
            }
            onBack={() =>
              setView(
                "details"
              )
            }
            onFullscreen={
              toggleFullscreen
            }
          />
        )}

      {view ===
        "details" &&
        selectedGame && (
          <GameDetails
            game={
              selectedGame
            }
            similarGames={
              similarGames
            }
            isFavorite={favorites.includes(
              selectedGame.id
            )}
            language={
              language
            }
            onBack={
              goHome
            }
            onFavorite={() =>
              toggleFavorite(
                selectedGame.id
              )
            }
            onPlay={() =>
              playGame(
                selectedGame
              )
            }
            onShare={() =>
              void shareGame(
                selectedGame
              )
            }
            onCollection={() =>
              setCollectionModal(
                selectedGame
              )
            }
            onOpen={
              openGame
            }
          />
        )}

      {view ===
        "home" && (
        <main>
          <section className="hero">
            <div className="hero-overlay" />
            <div className="hero-grid" />
            <div className="hero-vignette" />

            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />

            <div className="hero-content">
              <div className="hero-badge">
                <span className="live-dot" />
                {
                  t.nextGeneration
                }
              </div>

              <div className="hero-eyebrow">
                <span />
                {
                  t.discover
                }

                <b>
                  •
                </b>

                {
                  t.play
                }

                <b>
                  •
                </b>

                {
                  t.enjoy
                }
              </div>

              <h1>
                {
                  isArabic
                    ? "ادخل عالم"
                    : "ENTER THE"
                }

                <span>
                  {
                    isArabic
                      ? "NEXORA"
                      : "NEXORA"
                  }
                </span>
              </h1>

              <p>
                {
                  t.heroDescription
                }
              </p>

              <div className="hero-search">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  ref={
                    searchInputRef
                  }
                  type="search"
                  value={
                    search
                  }
                  placeholder={
                    t.searchPlaceholder
                  }
                  onFocus={() =>
                    setSearchOpen(
                      true
                    )
                  }
                  onChange={(
                    event
                  ) => {
                    setSearch(
                      event
                        .target
                        .value
                    );

                    setSearchOpen(
                      true
                    );
                  }}
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      commitSearch(
                        search
                      );

                      setSearchOpen(
                        false
                      );

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
                  >
                    ×
                  </button>
                )}

                <button
                  className="hero-search-btn"
                  onClick={() => {
                    commitSearch(
                      search
                    );

                    setSearchOpen(
                      false
                    );

                    scrollToGames();
                  }}
                >
                  {
                    t.search
                  }
                </button>

                {searchOpen &&
                  suggestions.length >
                    0 && (
                    <div className="search-suggestions">
                      {suggestions.map(
                        (
                          game
                        ) => (
                          <button
                            key={
                              game.id
                            }
                            onMouseDown={() => {
                              setSearchOpen(
                                false
                              );

                              openGame(
                                game
                              );
                            }}
                          >
                            <img
                              src={
                                game.thumbnail
                              }
                              alt=""
                            />

                            <span>
                              {
                                game.title
                              }
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  )}
              </div>

              {searchHistory.length >
                0 &&
                !search && (
                  <div className="hero-history">
                    <span>
                      {
                        t.searchHistory
                      }
                    </span>

                    {searchHistory
                      .slice(
                        0,
                        5
                      )
                      .map(
                        (
                          item
                        ) => (
                          <button
                            key={
                              item
                            }
                            onClick={() => {
                              setSearch(
                                item
                              );

                              scrollToGames();
                            }}
                          >
                            {
                              item
                            }
                          </button>
                        )
                      )}
                  </div>
                )}

              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>
                    {
                      games.length
                    }
                  </strong>

                  <span>
                    {
                      t.totalGames
                    }
                  </span>
                </div>

                <i />

                <div className="hero-stat">
                  <strong>
                    {
                      Math.max(
                        genres.length -
                          1,
                        0
                      )
                    }
                  </strong>

                  <span>
                    {
                      t.genres
                    }
                  </span>
                </div>

                <i />

                <div className="hero-stat">
                  <strong>
                    {
                      favorites.length
                    }
                  </strong>

                  <span>
                    {
                      t.favorites
                    }
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
                    {
                      t.exploreGames
                    }
                  </span>

                  <b>
                    →
                  </b>
                </button>

                <button
                  className="hero-secondary-btn"
                  onClick={
                    openFavorites
                  }
                >
                  <span>
                    ♥
                  </span>

                  {
                    t.myCollection
                  }
                </button>
              </div>
            </div>

            {featuredGame && (
              <div className="featured-preview">
                <div className="featured-top-line">
                  <div className="featured-label">
                    <span />
                    {
                      t.featuredGame
                    }
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
                    {
                      t.exploreGame
                    }

                    <b>
                      →
                    </b>
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
                      {
                        t.nextUp
                      }
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
                      {
                        t.discoverLabel
                      }
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
                {
                  t.scroll
                }
              </span>

              <b>
                ↓
              </b>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-header">
              <div>
                <span className="section-label">
                  NEXORA
                </span>

                <h2>
                  {
                    t.dashboard
                  }
                </h2>

                <p>
                  {isArabic
                    ? "كل حاجة عن لعبك في مكان واحد."
                    : "Everything about your gaming in one place."}
                </p>
              </div>

              <button
                className="dashboard-refresh"
                onClick={() =>
                  void loadGames()
                }
              >
                ↻
              </button>
            </div>

            <div className="dashboard-stats">
              <DashboardStat
                icon="🎮"
                value={
                  games.length
                }
                label={
                  t.totalGames
                }
              />

              <DashboardStat
                icon="♥"
                value={
                  favoriteGames.length
                }
                label={
                  t.favorites
                }
              />

              <DashboardStat
                icon="▶"
                value={
                  recentlyPlayed.length
                }
                label={
                  t.recentlyPlayed
                }
              />

              <DashboardStat
                icon="▦"
                value={
                  Object.keys(
                    collections
                  ).length
                }
                label={
                  t.collections
                }
              />
            </div>

            <div className="quick-actions">
              <button
                onClick={
                  scrollToGames
                }
              >
                🎮{" "}
                {
                  t.games
                }
              </button>

              <button
                onClick={
                  openFavorites
                }
              >
                ♥{" "}
                {
                  t.favorites
                }
              </button>

              <button
                onClick={() =>
                  setSettingsOpen(
                    true
                  )
                }
              >
                ⚙{" "}
                {
                  t.settings
                }
              </button>

              <button
                onClick={
                  exportData
                }
              >
                💾{" "}
                {
                  t.backup
                }
              </button>
            </div>
          </section>

          <SmartGameSection
            title={
              t.trending
            }
            subtitle={
              t.popular
            }
            games={
              trendingGames
            }
            favorites={
              favorites
            }
            language={
              language
            }
            onOpen={
              openGame
            }
            onPlay={
              playGame
            }
            onFavorite={
              toggleFavorite
            }
            onShare={(game) =>
              void shareGame(
                game
              )
            }
            onCollection={
              setCollectionModal
            }
          />

          <SmartGameSection
            title={
              t.popularNow
            }
            subtitle={
              t.popular
            }
            games={
              popularGames
            }
            favorites={
              favorites
            }
            language={
              language
            }
            onOpen={
              openGame
            }
            onPlay={
              playGame
            }
            onFavorite={
              toggleFavorite
            }
            onShare={(game) =>
              void shareGame(
                game
              )
            }
            onCollection={
              setCollectionModal
            }
          />

          <SmartGameSection
            title={
              t.newReleases
            }
            subtitle={
              t.discoverGames
            }
            games={
              newReleaseGames
            }
            favorites={
              favorites
            }
            language={
              language
            }
            onOpen={
              openGame
            }
            onPlay={
              playGame
            }
            onFavorite={
              toggleFavorite
            }
            onShare={(game) =>
              void shareGame(
                game
              )
            }
            onCollection={
              setCollectionModal
            }
          />

          <SmartGameSection
            title={
              t.recommended
            }
            subtitle={
              t.discoverGames
            }
            games={
              recommendedGames
            }
            favorites={
              favorites
            }
            language={
              language
            }
            onOpen={
              openGame
            }
            onPlay={
              playGame
            }
            onFavorite={
              toggleFavorite
            }
            onShare={(game) =>
              void shareGame(
                game
              )
            }
            onCollection={
              setCollectionModal
            }
          />

          {recentlyPlayedGames.length >
            0 && (
            <SmartGameSection
              title={
                t.recentlyPlayed
              }
              subtitle={
                t.continuePlaying
              }
              games={
                recentlyPlayedGames.slice(
                  0,
                  6
                )
              }
              favorites={
                favorites
              }
              language={
                language
              }
              onOpen={
                openGame
              }
              onPlay={
                playGame
              }
              onFavorite={
                toggleFavorite
              }
              onShare={(game) =>
                void shareGame(
                  game
                )
              }
              onCollection={
                setCollectionModal
              }
              clearAction={() =>
                setRecentlyPlayed(
                  []
                )
              }
            />
          )}

          {recentlyViewedGames.length >
            0 && (
            <SmartGameSection
              title={
                t.recentlyViewed
              }
              subtitle={
                t.exploreGame
              }
              games={
                recentlyViewedGames.slice(
                  0,
                  6
                )
              }
              favorites={
                favorites
              }
              language={
                language
              }
              onOpen={
                openGame
              }
              onPlay={
                playGame
              }
              onFavorite={
                toggleFavorite
              }
              onShare={(game) =>
                void shareGame(
                  game
                )
              }
              onCollection={
                setCollectionModal
              }
              clearAction={() =>
                setRecentlyViewed(
                  []
                )
              }
            />
          )}

          <section
            className="games-section"
            id="games-section"
          >
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-label">
                  {
                    showFavorites
                      ? t.yourCollection
                      : t.exploreUniverse
                  }
                </span>

                <h2>
                  {
                    showFavorites
                      ? t.yourFavorites
                      : t.discoverGames
                  }
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
                  {
                    t.gamesFound
                  }
                </span>
              </div>
            </div>

            <div className="games-toolbar">
              <div className="genre-strip">
                <button
                  className={
                    genre ===
                    "All"
                      ? "genre-pill active"
                      : "genre-pill"
                  }
                  onClick={() =>
                    setGenre(
                      "All"
                    )
                  }
                >
                  {
                    t.all
                  }
                </button>

                {genres
                  .filter(
                    (item) =>
                      item !==
                      "All"
                  )
                  .slice(
                    0,
                    9
                  )
                  .map(
                    (
                      item
                    ) => (
                      <button
                        key={
                          item
                        }
                        className={
                          genre ===
                          item
                            ? "genre-pill active"
                            : "genre-pill"
                        }
                        onClick={() =>
                          setGenre(
                            item
                          )
                        }
                      >
                        {
                          item
                        }
                      </button>
                    )
                  )}
              </div>

              <div className="view-switcher">
                <button
                  className={
                    cardView ===
                    "grid"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCardView(
                      "grid"
                    )
                  }
                >
                  ▦
                </button>

                <button
                  className={
                    cardView ===
                    "list"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCardView(
                      "list"
                    )
                  }
                >
                  ☰
                </button>
              </div>
            </div>

            <div className="filters-panel">
              <div className="filter-heading">
                <span>
                  ⚙
                </span>

                {
                  t.filters
                }
              </div>

              <select
                value={
                  genre
                }
                onChange={(
                  event
                ) =>
                  setGenre(
                    event.target
                      .value
                  )
                }
              >
                {genres.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {
                        item ===
                        "All"
                          ? t.allGenres
                          : item
                      }
                    </option>
                  )
                )}
              </select>

              <select
                value={
                  platform
                }
                onChange={(
                  event
                ) =>
                  setPlatform(
                    event.target
                      .value
                  )
                }
              >
                {platforms.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {
                        item ===
                        "All"
                          ? t.allPlatforms
                          : item
                      }
                    </option>
                  )
                )}
              </select>

              <select
                value={
                  sort
                }
                onChange={(
                  event
                ) =>
                  setSort(
                    event.target
                      .value as SortOption
                  )
                }
              >
                <option value="default">
                  {
                    t.defaultSort
                  }
                </option>

                <option value="name">
                  {
                    t.sortName
                  }
                </option>

                <option value="date">
                  {
                    t.sortDate
                  }
                </option>
              </select>

              {(search ||
                genre !==
                  "All" ||
                platform !==
                  "All" ||
                sort !==
                  "default") && (
                <button
                  className="reset-btn"
                  onClick={
                    resetFilters
                  }
                >
                  ↻{" "}
                  {
                    t.reset
                  }
                </button>
              )}
            </div>

            {loading && (
              <div className="games-grid skeleton-grid">
                {Array.from(
                  {
                    length: 8,
                  },
                  (_, index) => (
                    <div
                      className="skeleton-card"
                      key={
                        index
                      }
                    >
                      <div className="skeleton-image" />

                      <div className="skeleton-line large" />

                      <div className="skeleton-line" />

                      <div className="skeleton-line short" />
                    </div>
                  )
                )}
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

                  <p>
                    {
                      error
                    }
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      void loadGames()
                    }
                  >
                    ↻{" "}
                    {
                      t.tryAgain
                    }
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
                    {
                      showFavorites
                        ? t.emptyFavorites
                        : t.noGames
                    }
                  </h3>

                  <p>
                    {
                      showFavorites
                        ? t.addFavorites
                        : t.changeSearch
                    }
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
                    {
                      t.exploreGames
                    }
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              visibleGames.length >
                0 && (
                <div
                  className={`games-grid ${
                    cardView ===
                    "list"
                      ? "list-grid"
                      : ""
                  }`}
                >
                  {visibleGames.map(
                    (
                      game,
                      index
                    ) => (
                      <GameCard
                        key={
                          game.id
                        }
                        game={
                          game
                        }
                        index={
                          index
                        }
                        page={
                          page
                        }
                        favorite={favorites.includes(
                          game.id
                        )}
                        language={
                          language
                        }
                        onOpen={
                          openGame
                        }
                        onPlay={
                          playGame
                        }
                        onFavorite={
                          toggleFavorite
                        }
                        onShare={(value) =>
                          void shareGame(
                            value
                          )
                        }
                        onCollection={
                          setCollectionModal
                        }
                      />
                    )
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
                      page ===
                      1
                    }
                    onClick={() =>
                      setPage(
                        (
                          current
                        ) =>
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
                    (
                      _,
                      index
                    ) =>
                      index +
                      1
                  )
                    .filter(
                      (
                        number
                      ) => {
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
                      (
                        number
                      ) => (
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
                        (
                          current
                        ) =>
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

      {showTopButton && (
        <button
          className="back-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior:
                "smooth",
            })
          }
        >
          ↑
        </button>
      )}

      {toast && (
        <div className="toast">
          <span>
            ✓
          </span>

          {
            toast
          }
        </div>
      )}

      {collectionModal && (
        <CollectionModal
          game={
            collectionModal
          }
          collections={
            collections
          }
          language={
            language
          }
          name={
            collectionName
          }
          onNameChange={
            setCollectionName
          }
          onCreate={
            createCollection
          }
          onAdd={
            addToCollection
          }
          onClose={() =>
            setCollectionModal(
              null
            )
          }
        />
      )}

      {settingsOpen && (
        <SettingsModal
          language={
            language
          }
          theme={
            theme
          }
          accentColor={
            accentColor
          }
          density={
            density
          }
          cardView={
            cardView
          }
          animations={
            animations
          }
          activeTab={
            settingsTab
          }
          searchHistory={
            searchHistory
          }
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
          onDensityChange={
            setDensity
          }
          onCardViewChange={
            setCardView
          }
          onAnimationsChange={
            setAnimations
          }
          onClearHistory={() => {
            setSearchHistory(
              []
            );

            showToast(
              t.clearHistory
            );
          }}
          onClearRecently={() => {
            setRecentlyPlayed(
              []
            );

            setRecentlyViewed(
              []
            );

            showToast(
              t.clearRecently
            );
          }}
          onExport={
            exportData
          }
          onReset={
            resetSettings
          }
          onClearData={
            clearLocalData
          }
          onClose={() =>
            setSettingsOpen(
              false
            )
          }
        />
      )}
    </div>
  );
}

function DashboardStat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="dashboard-stat">
      <span>
        {icon}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {label}
      </small>
    </div>
  );
}

function SmartGameSection({
  title,
  subtitle,
  games,
  favorites,
  language,
  onOpen,
  onPlay,
  onFavorite,
  onShare,
  onCollection,
  clearAction,
}: {
  title: string;
  subtitle: string;
  games: Game[];
  favorites: number[];
  language: Language;
  onOpen: (
    game: Game
  ) => void;
  onPlay: (
    game: Game
  ) => void;
  onFavorite: (
    id: number
  ) => void;
  onShare: (
    game: Game
  ) => void;
  onCollection: (
    game: Game
  ) => void;
  clearAction?: () => void;
}) {
  const t =
    translations[language];

  if (!games.length) {
    return null;
  }

  return (
    <section className="smart-section">
      <div className="smart-section-header">
        <div>
          <span>
            {
              title
            }
          </span>

          <h2>
            {
              subtitle
            }
          </h2>
        </div>

        {clearAction && (
          <button
            className="smart-clear-btn"
            onClick={
              clearAction
            }
          >
            {
              t.clear
            }
          </button>
        )}
      </div>

      <div className="smart-grid">
        {games.map(
          (game) => (
            <GameCard
              key={`${title}-${game.id}`}
              game={
                game
              }
              index={
                0
              }
              page={
                1
              }
              favorite={favorites.includes(
                game.id
              )}
              language={
                language
              }
              onOpen={
                onOpen
              }
              onPlay={
                onPlay
              }
              onFavorite={
                onFavorite
              }
              onShare={
                onShare
              }
              onCollection={
                onCollection
              }
              compact
            />
          )
        )}
      </div>
    </section>
  );
}

function GameCard({
  game,
  index,
  page,
  favorite,
  language,
  onOpen,
  onPlay,
  onFavorite,
  onShare,
  onCollection,
  compact = false,
}: {
  game: Game;
  index: number;
  page: number;
  favorite: boolean;
  language: Language;
  onOpen: (
    game: Game
  ) => void;
  onPlay: (
    game: Game
  ) => void;
  onFavorite: (
    id: number
  ) => void;
  onShare: (
    game: Game
  ) => void;
  onCollection: (
    game: Game
  ) => void;
  compact?: boolean;
}) {
  const t =
    translations[language];

  return (
    <article
      className={`game-card ${
        compact
          ? "smart-card"
          : ""
      }`}
      style={{
        animationDelay: `${Math.min(
          index * 0.045,
          0.45
        )}s`,
      }}
      onClick={() =>
        onOpen(game)
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

            onFavorite(
              game.id
            );
          }}
          aria-label={
            t.favorites
          }
        >
          {
            favorite
              ? "♥"
              : "♡"
          }
        </button>

        <span className="game-platform">
          {
            game.platform
          }
        </span>

        <span className="card-number">
          #
          {String(
            (page - 1) *
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
          {
            game.genre ||
            "Adventure"
          }
        </span>

        <h3>
          {
            game.title
          }
        </h3>

        <p>
          {
            game.short_description ||
            "No description available."
          }
        </p>

        <div className="game-badges">
          <span>
            FREE
          </span>

          <span>
            {
              game.platform
            }
          </span>
        </div>

        <div className="game-footer">
          <span>
            📅{" "}
            {
              game.release_date
            }
          </span>

          <div className="card-actions">
            <button
              className="mini-action"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                onShare(
                  game
                );
              }}
              title={
                t.share
              }
            >
              ↗
            </button>

            <button
              className="mini-action"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                onCollection(
                  game
                );
              }}
              title={
                t.addToCollection
              }
            >
              +
            </button>

            <button
              className="card-play"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                onPlay(
                  game
                );
              }}
            >
              {
                t.play
              }

              <span>
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function GameDetails({
  game,
  similarGames,
  isFavorite,
  language,
  onBack,
  onFavorite,
  onPlay,
  onShare,
  onCollection,
  onOpen,
}: {
  game: Game;
  similarGames: Game[];
  isFavorite: boolean;
  language: Language;
  onBack: () => void;
  onFavorite: () => void;
  onPlay: () => void;
  onShare: () => void;
  onCollection: () => void;
  onOpen: (
    game: Game
  ) => void;
}) {
  const t =
    translations[language];

  return (
    <main className="details-page">
      <button
        className="back-btn"
        onClick={
          onBack
        }
      >
        ←{" "}
        {
          t.back
        }
      </button>

      <section className="details-hero">
        <div className="details-image">
          <img
            src={
              game.thumbnail
            }
            alt={
              game.title
            }
          />

          <div className="details-image-glow" />

          <span className="details-image-label">
            <span />

            {
              t.available
            }
          </span>
        </div>

        <div className="details-info">
          <span className="game-genre">
            {
              game.genre
            }
          </span>

          <h1>
            {
              game.title
            }
          </h1>

          <p className="details-description">
            {
              game.short_description
            }
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
              {
                isFavorite
                  ? `♥ ${t.removeFavorite}`
                  : `♡ ${t.addFavorite}`
              }
            </button>

            <button
              className="play-btn"
              onClick={
                onPlay
              }
            >
              ▶{" "}
              {
                t.playGame
              }
            </button>

            <button
              className="details-secondary-btn"
              onClick={
                onShare
              }
            >
              ↗
            </button>

            <button
              className="details-secondary-btn"
              onClick={
                onCollection
              }
            >
              +
            </button>
          </div>

          <div className="details-mini-stats">
            <div>
              <span>
                🎮
              </span>

              <strong>
                {
                  game.platform
                }
              </strong>

              <small>
                {
                  t.platform
                }
              </small>
            </div>

            <div>
              <span>
                ★
              </span>

              <strong>
                FREE
              </strong>

              <small>
                {
                  t.freeToPlay
                }
              </small>
            </div>

            <div>
              <span>
                ⚡
              </span>

              <strong>
                ONLINE
              </strong>

              <small>
                {
                  t.onlineGame
                }
              </small>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <InfoCard
          icon="🎮"
          label={
            t.platform
          }
          value={
            game.platform
          }
        />

        <InfoCard
          icon="🏷"
          label={
            t.genres
          }
          value={
            game.genre
          }
        />

        <InfoCard
          icon="◆"
          label={
            t.developer
          }
          value={
            game.developer ||
            "Unknown"
          }
        />

        <InfoCard
          icon="📅"
          label={
            t.releaseDate
          }
          value={
            game.release_date
          }
        />

        <InfoCard
          icon="▣"
          label={
            t.publisher
          }
          value={
            game.publisher ||
            "Unknown"
          }
        />
      </section>

      {similarGames.length >
        0 && (
        <section className="smart-section details-similar">
          <div className="smart-section-header">
            <div>
              <span>
                {
                  t.similarGames
                }
              </span>

              <h2>
                {
                  t.recommended
                }
              </h2>
            </div>
          </div>

          <div className="smart-grid">
            {similarGames.map(
              (
                item
              ) => (
                <GameCard
                  key={
                    item.id
                  }
                  game={
                    item
                  }
                  index={
                    0
                  }
                  page={
                    1
                  }
                  favorite={
                    false
                  }
                  language={
                    language
                  }
                  onOpen={
                    onOpen
                  }
                  onPlay={() =>
                    onOpen(
                      item
                    )
                  }
                  onFavorite={() =>
                    undefined
                  }
                  onShare={
                    onShare
                  }
                  onCollection={
                    onCollection
                  }
                  compact
                />
              )
            )}
          </div>
        </section>
      )}
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
      <span>
        {icon}
      </span>

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function GamePlayer({
  game,
  playerRef,
  isFullscreen,
  language,
  onBack,
  onFullscreen,
}: {
  game: Game;
  playerRef: RefObject<
    HTMLDivElement | null
  >;
  isFullscreen: boolean;
  language: Language;
  onBack: () => void;
  onFullscreen: () => void;
}) {
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
        ref={
          playerRef
        }
      >
        <div className="player-header">
          <div className="player-title">
            <button
              className="player-back"
              onClick={
                onBack
              }
            >
              ←
            </button>

            <div className="player-thumb">
              <img
                src={
                  game.thumbnail
                }
                alt={
                  game.title
                }
              />
            </div>

            <div>
              <span>
                {
                  t.nowPlaying
                }
              </span>

              <h2>
                {
                  game.title
                }
              </h2>
            </div>
          </div>

          <div className="player-controls">
            <span className="online-badge">
              <i />
              {
                t.online
              }
            </span>

            <button
              className="fullscreen-btn"
              onClick={
                onFullscreen
              }
            >
              {
                isFullscreen
                  ? `⛶ ${t.exitFullscreen}`
                  : `⛶ ${t.fullscreen}`
              }
            </button>
          </div>
        </div>

        <div className="game-frame">
          <iframe
            src={
              game.game_url
            }
            title={
              game.title
            }
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
              {
                game.genre
              }
            </span>

            <span>
              •
            </span>

            <span>
              {
                game.platform
              }
            </span>
          </div>

          <span className="player-tip">
            🎮{" "}
            {
              t.enjoyGame
            }
          </span>

          <button
            className="player-details-btn"
            onClick={
              onBack
            }
          >
            {
              t.gameDetails
            }{" "}
            →
          </button>
        </div>
      </div>
    </main>
  );
}

function CollectionModal({
  game,
  collections,
  language,
  name,
  onNameChange,
  onCreate,
  onAdd,
  onClose,
}: {
  game: Game;
  collections: Record<
    string,
    number[]
  >;
  language: Language;
  name: string;
  onNameChange: (
    value: string
  ) => void;
  onCreate: () => void;
  onAdd: (
    name: string
  ) => void;
  onClose: () => void;
}) {
  const t =
    translations[language];

  const names =
    Object.keys(
      collections
    );

  return (
    <div
      className="modal-overlay"
      onClick={
        onClose
      }
    >
      <div
        className="collection-modal"
        dir={
          language ===
          "ar"
            ? "rtl"
            : "ltr"
        }
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <span>
              {
                t.collections
              }
            </span>

            <h3>
              {
                t.addToCollection
              }
            </h3>
          </div>

          <button
            onClick={
              onClose
            }
          >
            ×
          </button>
        </div>

        <div className="collection-game-preview">
          <img
            src={
              game.thumbnail
            }
            alt=""
          />

          <div>
            <strong>
              {
                game.title
              }
            </strong>

            <small>
              {
                game.genre
              }
            </small>
          </div>
        </div>

        <div className="collection-list">
          {names.map(
            (
              collection
            ) => (
              <button
                key={
                  collection
                }
                className="collection-row"
                onClick={() =>
                  onAdd(
                    collection
                  )
                }
              >
                <span>
                  ▦
                </span>

                <strong>
                  {
                    collection
                  }
                </strong>

                <small>
                  {
                    collections[
                      collection
                    ]?.length ??
                    0
                  }
                </small>
              </button>
            )
          )}

          {!names.length && (
            <p className="modal-empty">
              {
                t.noCollections
              }
            </p>
          )}
        </div>

        <div className="new-collection">
          <input
            value={
              name
            }
            placeholder={
              t.collectionName
            }
            onChange={(
              event
            ) =>
              onNameChange(
                event.target
                  .value
              )
            }
          />

          <button
            onClick={
              onCreate
            }
          >
            {
              t.create
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({
  language,
  theme,
  accentColor,
  density,
  cardView,
  animations,
  activeTab,
  searchHistory,
  onTabChange,
  onLanguageChange,
  onThemeChange,
  onAccentChange,
  onDensityChange,
  onCardViewChange,
  onAnimationsChange,
  onClearHistory,
  onClearRecently,
  onExport,
  onReset,
  onClearData,
  onClose,
}: {
  language: Language;
  theme: Theme;
  accentColor: AccentColor;
  density: Density;
  cardView: CardView;
  animations: boolean;
  activeTab: SettingsTab;
  searchHistory: string[];
  onTabChange: (
    tab: SettingsTab
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
  onDensityChange: (
    value: Density
  ) => void;
  onCardViewChange: (
    value: CardView
  ) => void;
  onAnimationsChange: (
    value: boolean
  ) => void;
  onClearHistory: () => void;
  onClearRecently: () => void;
  onExport: () => void;
  onReset: () => void;
  onClearData: () => void;
  onClose: () => void;
}) {
  const t =
    translations[language];

  const tabs: {
    id: SettingsTab;
    icon: string;
    label: string;
  }[] = [
    {
      id: "appearance",
      icon: "🎨",
      label: t.appearance,
    },
    {
      id: "language",
      icon: "🌐",
      label: t.language,
    },
    {
      id: "color",
      icon: "✨",
      label: t.accentColor,
    },
    {
      id: "behavior",
      icon: "⚡",
      label: t.behavior,
    },
    {
      id: "data",
      icon: "💾",
      label: t.data,
    },
  ];

  return (
    <div
      className="settings-overlay"
      onClick={
        onClose
      }
    >
      <section
        className="settings-panel"
        dir={
          language ===
          "ar"
            ? "rtl"
            : "ltr"
        }
        onClick={(
          event
        ) =>
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
                {
                  t.settings
                }
              </strong>

              <span>
                NEXORA
              </span>
            </div>
          </div>

          <button
            className="settings-close"
            onClick={
              onClose
            }
          >
            ×
          </button>
        </header>

        <div className="settings-body">
          <aside className="settings-sidebar">
            {tabs.map(
              (
                tab
              ) => (
                <button
                  key={
                    tab.id
                  }
                  className={
                    activeTab ===
                    tab.id
                      ? "settings-side-btn active"
                      : "settings-side-btn"
                  }
                  onClick={() =>
                    onTabChange(
                      tab.id
                    )
                  }
                >
                  <span>
                    {
                      tab.icon
                    }
                  </span>

                  {
                    tab.label
                  }
                </button>
              )
            )}

            <button
              className="settings-side-btn reset-side-btn"
              onClick={
                onReset
              }
            >
              <span>
                ↻
              </span>

              {
                t.resetSettings
              }
            </button>
          </aside>

          <div className="settings-content">
            {activeTab ===
              "appearance" && (
              <>
                <SettingsTitle
                  title={
                    t.appearance
                  }
                  description={
                    t.chooseAppearance
                  }
                />

                <div className="setting-card">
                  <SettingHeading
                    icon="☀"
                    title={
                      t.appearance
                    }
                    description={
                      t.chooseAppearance
                    }
                  />

                  <div className="setting-options">
                    <SettingOption
                      icon="🌙"
                      title={
                        t.darkMode
                      }
                      subtitle="Dark"
                      active={
                        theme ===
                        "dark"
                      }
                      onClick={() =>
                        onThemeChange(
                          "dark"
                        )
                      }
                    />

                    <SettingOption
                      icon="☀️"
                      title={
                        t.lightMode
                      }
                      subtitle="Light"
                      active={
                        theme ===
                        "light"
                      }
                      onClick={() =>
                        onThemeChange(
                          "light"
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab ===
              "language" && (
              <>
                <SettingsTitle
                  title={
                    t.language
                  }
                  description={
                    t.chooseLanguage
                  }
                />

                <div className="setting-card">
                  <SettingHeading
                    icon="🌐"
                    title={
                      t.language
                    }
                    description={
                      t.chooseLanguage
                    }
                  />

                  <div className="setting-options">
                    <SettingOption
                      icon="🇪🇬"
                      title={
                        t.arabic
                      }
                      subtitle="Arabic"
                      active={
                        language ===
                        "ar"
                      }
                      onClick={() =>
                        onLanguageChange(
                          "ar"
                        )
                      }
                    />

                    <SettingOption
                      icon="🇺🇸"
                      title={
                        t.english
                      }
                      subtitle="English"
                      active={
                        language ===
                        "en"
                      }
                      onClick={() =>
                        onLanguageChange(
                          "en"
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab ===
              "color" && (
              <>
                <SettingsTitle
                  title={
                    t.accentColor
                  }
                  description={
                    t.chooseAccent
                  }
                />

                <div className="setting-card">
                  <SettingHeading
                    icon="✨"
                    title={
                      t.accentColor
                    }
                    description={
                      t.chooseAccent
                    }
                  />

                  <div className="color-options">
                    {(
                      [
                        "blue",
                        "purple",
                        "green",
                        "orange",
                        "red",
                      ] as AccentColor[]
                    ).map(
                      (
                        color
                      ) => (
                        <button
                          key={
                            color
                          }
                          className={`color-option color-${color} ${
                            accentColor ===
                            color
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            onAccentChange(
                              color
                            )
                          }
                        >
                          <span />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab ===
              "behavior" && (
              <>
                <SettingsTitle
                  title={
                    t.behavior
                  }
                  description={
                    t.shortcuts
                  }
                />

                <div className="setting-card">
                  <SettingHeading
                    icon="✨"
                    title={
                      t.animations
                    }
                    description={
                      animations
                        ? t.animationsOn
                        : t.animationsOff
                    }
                  />

                  <div className="setting-options">
                    <SettingOption
                      icon="ON"
                      title="ON"
                      subtitle="Animations"
                      active={
                        animations
                      }
                      onClick={() =>
                        onAnimationsChange(
                          true
                        )
                      }
                    />

                    <SettingOption
                      icon="OFF"
                      title="OFF"
                      subtitle="Animations"
                      active={
                        !animations
                      }
                      onClick={() =>
                        onAnimationsChange(
                          false
                        )
                      }
                    />
                  </div>
                </div>

                <div className="setting-card">
                  <SettingHeading
                    icon="▦"
                    title={
                      t.grid
                    }
                    description="Card layout"
                  />

                  <div className="setting-options">
                    <SettingOption
                      icon="▦"
                      title={
                        t.grid
                      }
                      subtitle="Grid view"
                      active={
                        cardView ===
                        "grid"
                      }
                      onClick={() =>
                        onCardViewChange(
                          "grid"
                        )
                      }
                    />

                    <SettingOption
                      icon="☰"
                      title={
                        t.list
                      }
                      subtitle="List view"
                      active={
                        cardView ===
                        "list"
                      }
                      onClick={() =>
                        onCardViewChange(
                          "list"
                        )
                      }
                    />
                  </div>
                </div>

                <div className="setting-card">
                  <SettingHeading
                    icon="▤"
                    title={
                      t.compact
                    }
                    description="Card spacing"
                  />

                  <div className="setting-options">
                    <SettingOption
                      icon="▥"
                      title={
                        t.comfortable
                      }
                      subtitle="Comfortable"
                      active={
                        density ===
                        "comfortable"
                      }
                      onClick={() =>
                        onDensityChange(
                          "comfortable"
                        )
                      }
                    />

                    <SettingOption
                      icon="▤"
                      title={
                        t.compact
                      }
                      subtitle="Compact"
                      active={
                        density ===
                        "compact"
                      }
                      onClick={() =>
                        onDensityChange(
                          "compact"
                        )
                      }
                    />
                  </div>
                </div>

                <div className="keyboard-card">
                  <strong>
                    {
                      t.shortcuts
                    }
                  </strong>

                  <div>
                    <kbd>
                      /
                    </kbd>

                    <span>
                      {
                        t.searchFocus
                      }
                    </span>
                  </div>

                  <div>
                    <kbd>
                      F
                    </kbd>

                    <span>
                      {
                        t.favoriteShortcut
                      }
                    </span>
                  </div>

                  <div>
                    <kbd>
                      G
                    </kbd>

                    <span>
                      {
                        t.homeShortcut
                      }
                    </span>
                  </div>

                  <div>
                    <kbd>
                      ESC
                    </kbd>

                    <span>
                      {
                        t.closeShortcut
                      }
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab ===
              "data" && (
              <>
                <SettingsTitle
                  title={
                    t.data
                  }
                  description={
                    t.backup
                  }
                />

                <div className="setting-card">
                  <SettingHeading
                    icon="🔎"
                    title={
                      t.searchHistory
                    }
                    description={`${searchHistory.length}`}
                  />

                  <div className="history-list">
                    {searchHistory.map(
                      (
                        item
                      ) => (
                        <span
                          key={
                            item
                          }
                        >
                          {
                            item
                          }
                        </span>
                      )
                    )}
                  </div>

                  <button
                    className="danger-action"
                    onClick={
                      onClearHistory
                    }
                  >
                    {
                      t.clearHistory
                    }
                  </button>
                </div>

                <div className="setting-card">
                  <SettingHeading
                    icon="🕹️"
                    title={
                      t.recentlyPlayed
                    }
                    description={
                      t.clearRecently
                    }
                  />

                  <button
                    className="danger-action"
                    onClick={
                      onClearRecently
                    }
                  >
                    {
                      t.clearRecently
                    }
                  </button>
                </div>

                <div className="setting-card">
                  <SettingHeading
                    icon="💾"
                    title={
                      t.backup
                    }
                    description={
                      t.exportData
                    }
                  />

                  <button
                    className="primary-btn"
                    onClick={
                      onExport
                    }
                  >
                    {
                      t.exportData
                    }
                  </button>

                  <button
                    className="danger-action data-delete-btn"
                    onClick={
                      onClearData
                    }
                  >
                    {
                      t.resetData
                    }
                  </button>
                </div>
              </>
            )}

            <div className="settings-note">
              <span>
                ✓
              </span>

              <p>
                {language ===
                "ar"
                  ? "إعدادات NEXORA وبياناتك يتم حفظها تلقائيًا على جهازك."
                  : "NEXORA settings and data are saved automatically on this device."}
              </p>
            </div>
          </div>
        </div>

        <footer className="settings-footer">
          <span>
            NEXORA
          </span>

          <button
            className="settings-done"
            onClick={
              onClose
            }
          >
            {
              t.done
            }
          </button>
        </footer>
      </section>
    </div>
  );
}

function SettingsTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="settings-content-title">
      <h3>
        {
          title
        }
      </h3>

      <p>
        {
          description
        }
      </p>
    </div>
  );
}

function SettingHeading({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="setting-card-header">
      <div className="setting-card-icon">
        {
          icon
        }
      </div>

      <div className="setting-card-title">
        <strong>
          {
            title
          }
        </strong>

        <span>
          {
            description
          }
        </span>
      </div>
    </div>
  );
}

function SettingOption({
  icon,
  title,
  subtitle,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={
        active
          ? "setting-option active"
          : "setting-option"
      }
      onClick={
        onClick
      }
    >
      <span className="setting-option-icon">
        {
          icon
        }
      </span>

      <span className="setting-option-text">
        <strong>
          {
            title
          }
        </strong>

        <span>
          {
            subtitle
          }
        </span>
      </span>

      {active && (
        <span className="setting-option-check">
          ✓
        </span>
      )}
    </button>
  );
}

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
}: {
  language: Language;
  theme: Theme;
  t: Translation;
  isArabic: boolean;
  leaving: boolean;
  onEnter: () => void;
  onSkip: () => void;
  onLanguage: () => void;
  onTheme: () => void;
}) {
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
          <span>
            ◈
          </span>

          NEX

          <b>
            ORA
          </b>
        </div>

        <div className="intro-controls">
          <button
            onClick={
              onLanguage
            }
          >
            🌐{" "}
            {
              language ===
              "ar"
                ? "EN"
                : "عربي"
            }
          </button>

          <button
            onClick={
              onTheme
            }
          >
            {
              theme ===
              "dark"
                ? "☀"
                : "☾"
            }
          </button>
        </div>
      </div>

      <div className="intro-content">
        <div className="intro-status">
          <span />
          NEXORA ONLINE
        </div>

        <div className="intro-icon">
          ◈
        </div>

        <p className="intro-welcome">
          {
            t.welcome
          }
        </p>

        <h1>
          {
            isArabic
              ? "ادخل عالم"
              : "ENTER"
          }

          <span>
            NEXORA
          </span>
        </h1>

        <p className="intro-description">
          {
            t.welcomeDescription
          }
        </p>

        <div className="intro-line">
          <span />
          <i />
          <span />
        </div>

        <button
          className="intro-enter-btn"
          onClick={
            onEnter
          }
        >
          {
            t.enterHub
          }

          <b>
            →
          </b>
        </button>

        <button
          className="intro-skip"
          onClick={
            onSkip
          }
        >
          {
            t.skip
          }
        </button>
      </div>

      <div className="intro-bottom">
        <span>
          NEXORA / 2026
        </span>

        <span>
          {
            isArabic
              ? "استعد للعب"
              : "READY TO PLAY"
          }
        </span>

        <span>
          FREE GAMING
        </span>
      </div>
    </div>
  );
}

export default App;