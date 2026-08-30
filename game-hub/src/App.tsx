import { useEffect, useState } from "react";
import "./App.css";

import type { Game } from "./types/game";
import { getTranslations, type Translation } from "./data/translations";

import { useGames } from "./hooks/useGames";
import { useFavorites } from "./hooks/useFavorites";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import GameDetails from "./pages/GameDetails";

type Language = "en" | "ar";
type Theme = "dark" | "light";

type AppPage =
  | "home"
  | "games"
  | "favorites"
  | "settings";

const LANGUAGE_KEY = "gamehub-language";
const THEME_KEY = "gamehub-theme";

function App() {
  const { games, loading, error, loadGames } = useGames();
  const { favorites, toggleFavorite } = useFavorites();

  const [language, setLanguage] = useState<Language>(() => {
    return localStorage.getItem(LANGUAGE_KEY) === "ar"
      ? "ar"
      : "en";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem(THEME_KEY) === "light"
      ? "light"
      : "dark";
  });

  const [currentPage, setCurrentPage] =
    useState<AppPage>("home");

  const [selectedGenre, setSelectedGenre] =
    useState("All");

  const [selectedGame, setSelectedGame] =
    useState<Game | null>(null);

  const t = getTranslations(
    language
  ) as unknown as Translation;

  useEffect(() => {
    localStorage.setItem(
      LANGUAGE_KEY,
      language
    );

    document.documentElement.lang =
      language;

    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    localStorage.setItem(
      THEME_KEY,
      theme
    );

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  function navigate(page: AppPage) {
    setCurrentPage(page);
    setSelectedGame(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openGame(game: Game) {
    setSelectedGame(game);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function playGame(game: Game) {
    if (!game.game_url) {
      return;
    }

    window.open(
      game.game_url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function renderPage() {
    if (selectedGame) {
      return (
        <GameDetails
          game={selectedGame}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          playGame={playGame}
          navigate={(page) => {
            navigate(page as AppPage);
          }}
          t={t}
        />
      );
    }

    switch (currentPage) {
      case "games":
        return (
          <Games
            games={games}
            loading={loading}
            error={error}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openGame={openGame}
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
            openGame={openGame}
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

      case "home":
      default:
        return (
          <Home
            games={games}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openGame={openGame}
            playGame={playGame}
            navigate={navigate}
            setGenre={setSelectedGenre}
            t={t}
          />
        );
    }
  }

  return (
    <div className="app">
      <Navbar
        currentPage={currentPage}
        favoritesCount={favorites.length}
        t={t}
        navigate={navigate}
      />

      <main>
        {renderPage()}

        {loading && (
          <div className="container">
            <p>Loading games...</p>
          </div>
        )}

        {error && (
          <div className="container">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => loadGames()}
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer>
        <div className="container footer-inner">
          <button
            type="button"
            className="logo"
            onClick={() => navigate("home")}
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