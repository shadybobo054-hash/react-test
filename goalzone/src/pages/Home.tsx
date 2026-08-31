
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-badge">
            ⚽ GOALZONE
          </span>

          <h1>
            THE WORLD OF
            <br />
            <span>FOOTBALL</span>
          </h1>

          <p>
            كل ما يخص كرة القدم في مكان واحد.
            تابع المباريات، الأخبار، الانتقالات والمزيد.
          </p>

          <div className="home-buttons">
            <Link
              to="/matches"
              className="home-btn home-btn-primary"
            >
              مباريات اليوم
            </Link>

            <Link
              to="/news"
              className="home-btn home-btn-secondary"
            >
              آخر الأخبار
            </Link>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-glow"></div>

          <div className="home-ball">
            ⚽
          </div>
        </div>
      </section>

      <section className="home-explore">
        <div className="home-section-title">
          <span>EXPLORE</span>

          <h2>
            Football World
          </h2>
        </div>

        <div className="home-cards">
          <Link to="/matches" className="home-card">
            <div className="home-card-icon">
              🏟️
            </div>

            <h3>Matches</h3>

            <p>
              شاهد المباريات والنتائج.
            </p>
          </Link>

          <Link to="/live" className="home-card">
            <div className="home-card-icon">
              🔴
            </div>

            <h3>Live</h3>

            <p>
              تابع المباريات المباشرة.
            </p>
          </Link>

          <Link to="/transfers" className="home-card">
            <div className="home-card-icon">
              🔄
            </div>

            <h3>Transfers</h3>

            <p>
              أحدث أخبار الانتقالات.
            </p>
          </Link>

          <Link to="/news" className="home-card">
            <div className="home-card-icon">
              📰
            </div>

            <h3>News</h3>

            <p>
              كل أخبار كرة القدم.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;

