import { useEffect, useState } from "react";
import "./App.css";
import type { Game, Language, Page, Theme } from "./types/game";
import { getTranslations, type Translation } from "./data/translations";
import { useGames } from "./hooks/useGames";
import { useFavorites } from "./hooks/useFavorites";
import Navbar from "./components/Navbar";
import GameModal from "./components/GameModal";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";

const LANGUAGE_KEY = "gamehub-language";
const THEME_KEY = "gamehub-theme";

function App() {
  const { games, loading, error, loadGames } = useGames();
  const { favorites, toggleFavorite } = useFavorites();

  const [language, setLanguage] = useState<Language>(() =>
    localStorage.getItem(LANGUAGE_KEY) === "ar" ? "ar" : "en"
  );

  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark"
  );

  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const t = getTranslations(language) as unknown as Translation;
  const isArabic = language === "ar";

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = selectedGame ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedGame]);

  function navigate(page: Page) {
    setCurrentPage(page);
    setSelectedGame(null);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function playGame(game: Game) {
    if (!game.game_url) return;

    window.open(
      game.game_url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function renderPage() {
    switch (currentPage) {
      case "games":
        return (
          <Games
            games={games}
            loading={loading}
            error={error}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openGame={setSelectedGame}
            loadGames={loadGames}
            t={t}
            selectedGenre={selectedGenre}
          />
        );

      case "favorites":
        return (
          <Favorites
            games={games}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openGame={setSelectedGame}
            navigate={navigate}
            t={t}
          />
        );

      case "settings":
        return (
          <Settings
            language={language}
            theme={theme}
            setLanguage={setLanguage}
            setTheme={setTheme}
            t={t}
          />
        );

      default:
        return (
          <Home
            games={games}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openGame={setSelectedGame}
            playGame={playGame}
            navigate={navigate}
            setGenre={setSelectedGenre}
            t={t}
          />
        );
    }
  }

  return (
    <div className={`app ${theme === "light" ? "light-theme" : ""}`}>
      <Navbar
        currentPage={currentPage}
        favoritesCount={favorites.length}
        t={t}
        navigate={navigate}
      />

      <main>{renderPage()}</main>

      <GameModal
        game={selectedGame}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        close={() => setSelectedGame(null)}
        playGame={playGame}
        t={t}
      />

      <footer>
        <div className="container footer-inner">
          <button
            type="button"
            className="logo"
            onClick={() => navigate("home")}
          >
            <span className="logo-mark">G</span>
            <div>
              <strong>GAMEHUB</strong>
              <small>ULTIMATE GAMING PLATFORM</small>
            </div>
          </button>

          <span>{t.builtForGamers} ⚡</span>
        </div>
      </footer>
    </div>
  );
}

export default App;