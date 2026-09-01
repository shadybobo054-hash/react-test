
type Page = "home" | "matches" | "live" | "news" | "transfers";

type NavbarProps = {
  navigate: (page: Page) => void;
  currentPage: Page;
};

function Navbar({ navigate, currentPage }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        <button
          type="button"
          className="navbar-logo"
          onClick={() => navigate("home")}
          aria-label="GoalZone Home"
        >
          <span className="logo-ball">⚽</span>

          <span className="logo-text">
            <strong>GOAL</strong>
            <span>ZONE</span>
          </span>
        </button>

        <nav className="navbar-links">

          <button
            type="button"
            className={`nav-link ${
              currentPage === "home" ? "active" : ""
            }`}
            onClick={() => navigate("home")}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            type="button"
            className={`nav-link ${
              currentPage === "matches" ? "active" : ""
            }`}
            onClick={() => navigate("matches")}
          >
            <span>⚽</span>
            Matches
          </button>

          <button
            type="button"
            className={`nav-link live-link ${
              currentPage === "live" ? "active" : ""
            }`}
            onClick={() => navigate("live")}
          >
            <span className="live-dot"></span>
            LIVE
          </button>

          <button
            type="button"
            className={`nav-link ${
              currentPage === "transfers" ? "active" : ""
            }`}
            onClick={() => navigate("transfers")}
          >
            <span>↗</span>
            Transfers
          </button>

          <button
            type="button"
            className={`nav-link ${
              currentPage === "news" ? "active" : ""
            }`}
            onClick={() => navigate("news")}
          >
            <span>▤</span>
            News
          </button>

        </nav>

        <div className="navbar-actions">

          <button
            type="button"
            className="notification-btn"
            aria-label="Notifications"
          >
            <span>♢</span>
            <span className="notification-badge">3</span>
          </button>

          <div className="stadium-status">
            <span className="status-light"></span>
            <span>Football Center</span>
          </div>

        </div>
      </div>

      <div className="navbar-line">
        <span></span>
      </div>
    </header>
  );
}

export default Navbar;

