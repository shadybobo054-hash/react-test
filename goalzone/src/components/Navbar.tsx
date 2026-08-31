
type NavbarProps = {
  navigate: (page: "home" | "matches") => void;
};

function Navbar({ navigate }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        ⚽ GoalZone
      </div>

      <div className="navbar-links">
        <button
          type="button"
          onClick={() => navigate("home")}
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => navigate("matches")}
        >
          Matches
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

