
import { useEffect, useState } from "react";

import {
  getMatches,
  LEAGUES,
  type ApiEvent,
} from "../api/footballApi";

import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState<string[]>(
    []
  );

  const [matches, setMatches] = useState<ApiEvent[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================
     LOAD FAVORITES
  ========================= */

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("goalzone-favorites") || "[]"
      );

      if (Array.isArray(saved)) {
        setFavorites(saved);
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  /* =========================
     LOAD MATCHES FROM API
  ========================= */

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError("");

        const data = await getMatches(
          LEAGUES.premierLeague
        );

        setMatches(data);
      } catch (err) {
        console.error(err);

        setError(
          "تعذر تحميل المباريات من API."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  /* =========================
     REMOVE FAVORITE
  ========================= */

  function removeFavorite(id: string) {
    const updated = favorites.filter(
      (favoriteId) => favoriteId !== id
    );

    setFavorites(updated);

    localStorage.setItem(
      "goalzone-favorites",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("favoritesUpdated")
    );
  }

  /* =========================
     FAVORITE MATCHES
  ========================= */

  const favoriteMatches = matches.filter(
    (match) => favorites.includes(match.id)
  );

  return (
    <main className="favorites-page">

      {/* HERO */}

      <section className="favorites-hero">

        <div className="favorites-hero-content">

          <span className="favorites-label">
            YOUR COLLECTION
          </span>

          <h1>
            MY <strong>FAVORITES</strong>
          </h1>

          <p>
            كل المباريات التي أضفتها إلى
            المفضلة في مكان واحد.
          </p>

        </div>

        <div className="favorites-hero-icon">
          ⭐
        </div>

      </section>

      {/* CONTENT */}

      <section className="favorites-content">

        <div className="favorites-title">

          <div>
            <span>
              YOUR MATCHES
            </span>

            <h2>
              Favorite Matches
            </h2>
          </div>

          <div className="favorites-total">

            <strong>
              {favorites.length}
            </strong>

            <span>
              Favorites
            </span>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="favorites-message">

            <div className="favorites-loader"></div>

            <p>
              جاري تحميل المباريات...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="favorites-message">

            <p className="favorites-error">
              {error}
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          favoriteMatches.length === 0 && (
            <div className="favorites-empty">

              <div className="favorites-empty-icon">
                ⭐
              </div>

              <h2>
                No Favorites Yet
              </h2>

              <p>
                لم تقم بإضافة أي مباراة إلى
                المفضلة حتى الآن.
              </p>

              <a href="/matches">
                Browse Matches →
              </a>

            </div>
          )}

        {/* FAVORITE MATCHES */}

        {!loading &&
          !error &&
          favoriteMatches.length > 0 && (

            <div className="favorites-grid">

              {favoriteMatches.map((match) => {

                const competition =
                  match.competitions?.[0];

                const teams =
                  competition?.competitors ?? [];

                const home =
                  teams.find(
                    (team) =>
                      team.homeAway === "home"
                  );

                const away =
                  teams.find(
                    (team) =>
                      team.homeAway === "away"
                  );

                const status =
                  competition
                    ?.status
                    ?.type
                    ?.shortDetail ??
                  "Upcoming";

                return (
                  <article
                    className="favorite-card"
                    key={match.id}
                  >

                    {/* CARD TOP */}

                    <div className="favorite-card-top">

                      <span className="favorite-status">
                        {status}
                      </span>

                      <button
                        className="favorite-star"
                        type="button"
                        onClick={() =>
                          removeFavorite(match.id)
                        }
                        title="Remove from favorites"
                      >
                        ★
                      </button>

                    </div>

                    {/* MATCH NAME */}

                    <div className="favorite-league">
                      {match.name}
                    </div>

                    {/* TEAMS */}

                    <div className="favorite-teams">

                      {/* HOME */}

                      <div className="favorite-team">

                        <div className="favorite-logo">

                          {home?.team.logo ? (
                            <img
                              src={home.team.logo}
                              alt={
                                home.team.displayName
                              }
                            />
                          ) : (
                            <span>
                              ⚽
                            </span>
                          )}

                        </div>

                        <h3>
                          {home
                            ?.team
                            .displayName ??
                            "Home"}
                        </h3>

                        <span>
                          Home
                        </span>

                      </div>

                      {/* SCORE */}

                      <div className="favorite-score">

                        <strong>
                          {home?.score ?? "-"}
                        </strong>

                        <span>
                          :
                        </span>

                        <strong>
                          {away?.score ?? "-"}
                        </strong>

                      </div>

                      {/* AWAY */}

                      <div className="favorite-team">

                        <div className="favorite-logo">

                          {away?.team.logo ? (
                            <img
                              src={away.team.logo}
                              alt={
                                away.team.displayName
                              }
                            />
                          ) : (
                            <span>
                              ⚽
                            </span>
                          )}

                        </div>

                        <h3>
                          {away
                            ?.team
                            .displayName ??
                            "Away"}
                        </h3>

                        <span>
                          Away
                        </span>

                      </div>

                    </div>

                    {/* FOOTER */}

                    <div className="favorite-card-footer">

                      <span>
                        ⚽ Football Match
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeFavorite(match.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </section>

    </main>
  );
}

export default Favorites;

