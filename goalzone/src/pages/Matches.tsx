
import { useEffect, useState } from "react";
import {
  getMatches,
  getMatchStatus,
  type ApiEvent,
} from "../api/footballApi";
import "./Matches.css";

type MatchesProps = {
  onDetails: (match: ApiEvent) => void;
};

function Matches({ onDetails }: MatchesProps) {
  const [matches, setMatches] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMatches("eng.1");
      setMatches(data);
    } catch (err) {
      console.error("Matches Error:", err);
      setError("فشل تحميل المباريات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <main className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero-content">
          <span className="matches-label">
            <i></i>
            FOOTBALL CENTER
          </span>

          <h1>
            TODAY'S
            <strong>MATCHES</strong>
          </h1>

          <p>
            تابع أهم مباريات كرة القدم ومواعيدها ونتائجها
            من مكان واحد.
          </p>

          <div className="matches-stats">
            <div className="matches-stat">
              <span className="stat-icon">⚽</span>
              <div>
                <strong>{matches.length}</strong>
                <small>TODAY MATCHES</small>
              </div>
            </div>

            <div className="matches-stat">
              <span className="stat-icon">🏆</span>
              <div>
                <strong>PL</strong>
                <small>PREMIER LEAGUE</small>
              </div>
            </div>

            <div className="matches-stat">
              <span className="stat-icon">↻</span>
              <div>
                <strong>LIVE</strong>
                <small>ESPN DATA</small>
              </div>
            </div>
          </div>
        </div>

        <div className="transfers-ball">⚽</div>
      </section>

      <section className="matches-content">
        <div className="matches-heading">
          <div>
            <span>PREMIER LEAGUE</span>
            <h2>
              مباريات <strong>اليوم</strong>
            </h2>
          </div>

          <div className="matches-count">
            {matches.length} MATCHES
          </div>
        </div>

        {loading && (
          <div className="matches-state">
            <div className="matches-loader"></div>
            <h3>جاري تحميل المباريات</h3>
            <p>نحصل على أحدث البيانات من ESPN...</p>
          </div>
        )}

        {!loading && error && (
          <div className="matches-state">
            <div className="state-icon">⚠</div>
            <h3>حدث خطأ</h3>
            <p>{error}</p>

            <button onClick={loadMatches}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="matches-state">
            <div className="state-icon">⚽</div>
            <h3>لا توجد مباريات اليوم</h3>
            <p>لم يتم العثور على مباريات في الدوري الإنجليزي اليوم.</p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="matches-grid">
            {matches.map((match) => {
              const competition = match.competitions?.[0];
              const teams = competition?.competitors ?? [];

              const home = teams.find(
                (team) => team.homeAway === "home"
              );

              const away = teams.find(
                (team) => team.homeAway === "away"
              );

              const status = getMatchStatus(match);

              return (
                <article className="match-card" key={match.id}>
                  <div className="match-card-top">
                    <span className="league-name">
                      {match.league?.name || "Premier League"}
                    </span>

                    <span
                      className={`match-status ${
                        competition?.status?.type?.state === "in"
                          ? "is-live"
                          : ""
                      }`}
                    >
                      {competition?.status?.type?.state === "in" && (
                        <i></i>
                      )}

                      {status}
                    </span>
                  </div>

                  <div className="match-date">
                    {new Date(match.date).toLocaleDateString(
                      "ar-EG",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      }
                    )}
                  </div>

                  <div className="match-teams">
                    <div className="match-team">
                      <div className="match-logo">
                        {home?.team.logo ? (
                          <img
                            src={home.team.logo}
                            alt={home.team.displayName}
                          />
                        ) : (
                          <span>⚽</span>
                        )}
                      </div>

                      <strong>
                        {home?.team.displayName || "Home Team"}
                      </strong>

                      <small>HOME</small>
                    </div>

                    <div className="match-score">
                      <b>{home?.score ?? "0"}</b>

                      <em>:</em>

                      <b>{away?.score ?? "0"}</b>

                      <small>
                        {competition?.status?.type?.shortDetail ||
                          "MATCH"}
                      </small>
                    </div>

                    <div className="match-team">
                      <div className="match-logo">
                        {away?.team.logo ? (
                          <img
                            src={away.team.logo}
                            alt={away.team.displayName}
                          />
                        ) : (
                          <span>⚽</span>
                        )}
                      </div>

                      <strong>
                        {away?.team.displayName || "Away Team"}
                      </strong>

                      <small>AWAY</small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="match-details-btn"
                    onClick={() => onDetails(match)}
                  >
                    <span>تفاصيل المباراة</span>
                    <b>→</b>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Matches;

