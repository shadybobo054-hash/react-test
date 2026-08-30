import type { Page } from "../types/game";
import type { Translation } from "../data/translations";

type Props = {
  currentPage: Page;
  favoritesCount: number;
  t: Translation;
  navigate: (page: Page) => void;
};

export default function Navbar({
  currentPage,
  favoritesCount,
  t,
  navigate
}: Props) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <button type="button" className="logo" onClick={() => navigate("home")}>
          <span className="logo-mark">G</span>
          <div>
            <strong>GAMEHUB</strong>
            <small>ULTIMATE GAMING PLATFORM</small>
          </div>
        </button>

        <nav>
          <button
            type="button"
            className={currentPage === "home" ? "nav-active" : ""}
            onClick={() => navigate("home")}
          >
            {t.home}
          </button>

          <button
            type="button"
            className={currentPage === "games" ? "nav-active" : ""}
            onClick={() => navigate("games")}
          >
            {t.games}
          </button>

          <button
            type="button"
            className={currentPage === "favorites" ? "nav-active" : ""}
            onClick={() => navigate("favorites")}
          >
            {t.favorites}
            <span>{favoritesCount}</span>
          </button>

          <button
            type="button"
            className={currentPage === "settings" ? "nav-active settings-nav" : "settings-nav"}
            onClick={() => navigate("settings")}
            aria-label={t.settings}
          >
            ⚙️
          </button>
        </nav>
      </div>
    </header>
  );
}