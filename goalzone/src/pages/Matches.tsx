import { useEffect, useState } from "react";
import {
  getTodayMatches,
  getYesterdayMatches,
  getTomorrowMatches,
  getMatchStatus,
  getMatchScore,
  ALL_LEAGUES,
  type ApiEvent,
} from "../api/footballApi";
import "./Matches.css";

type Day = "yesterday" | "today" | "tomorrow";

function Matches() {
  const [matches, setMatches] = useState<ApiEvent[]>([]);
  const [day, setDay] = useState<Day>("today");
  const [league, setLeague] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");
      const data =
        day === "today"
          ? await getTodayMatches()
          : day === "yesterday"
          ? await getYesterdayMatches()
          : await getTomorrowMatches();
      setMatches(data);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل المباريات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [day]);

  const filtered =
    league === "all"
      ? matches
      : matches.filter((m) => m.league?.id === league);

  const time = (date: string) =>
    new Date(date).toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const dayTitle =
    day === "today"
      ? "مباريات اليوم"
      : day === "yesterday"
      ? "مباريات الأمس"
      : "مباريات الغد";

  return (
    <main className="matches-page">
      <section className="matches-hero">
        <div className="matches-hero-glow" />
        <div className="matches-hero-content">
          <span>GOALZONE MATCH CENTER</span>
          <h1>
            FOOTBALL <b>MATCHES</b>
          </h1>
          <p>تابع جميع المباريات والنتائج من مكان واحد.</p>
        </div>
        <div className="matches-hero-ball">⚽</div>
      </section>

      <section className="matches-content">
        <div className="matches-toolbar">
          <div className="day-tabs">
            {(["yesterday", "today", "tomorrow"] as Day[]).map((d) => (
              <button
                key={d}
                className={day === d ? "active" : ""}
                onClick={() => setDay(d)}
              >
                {d === "yesterday"
                  ? "أمس"
                  : d === "today"
                  ? "اليوم"
                  : "غدًا"}
              </button>
            ))}
          </div>

          <select value={league} onChange={(e) => setLeague(e.target.value)}>
            <option value="all">جميع البطولات</option>
            {ALL_LEAGUES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="matches-heading">
          <div>
            <span>FIXTURES</span>
            <h2>{dayTitle}</h2>
          </div>
          <strong>{filtered.length} مباراة</strong>
        </div>

        {loading && (
          <div className="matches-state">
            <div className="loader" />
            <p>جاري تحميل المباريات...</p>
          </div>
        )}

        {!loading && error && (
          <div className="matches-state error">
            <h3>{error}</h3>
            <button onClick={loadMatches}>إعادة المحاولة</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="matches-state">
            <div className="empty-ball">⚽</div>
            <h3>لا توجد مباريات</h3>
            <p>لم يتم العثور على مباريات في هذا اليوم.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="matches-grid">
            {filtered.map((match) => {
              const competitors =
                match.competitions?.[0]?.competitors ?? [];

              const home = competitors.find(
                (t) => t.homeAway === "home"
              );
              const away = competitors.find(
                (t) => t.homeAway === "away"
              );

              const score = getMatchScore(match);
              const status = getMatchStatus(match);
              const live =
                match.competitions?.[0]?.status?.type?.state === "in";

              const leagueName =
                ALL_LEAGUES.find(
                  (l) => l.id === match.league?.id
                )?.name || "Football";

              return (
                <article className="match-card" key={match.id}>
                  <div className="match-card-top">
                    <span>{leagueName}</span>
                    {live ? (
                      <b className="live-status">
                        <i /> LIVE
                      </b>
                    ) : (
                      <small>{status}</small>
                    )}
                  </div>

                  <div className="match-date">
                    {time(match.date)}
                  </div>

                  <div className="teams">
                    <div className="team">
                      <div className="team-logo">
                        {home?.team.logo ? (
                          <img src={home.team.logo} alt="" />
                        ) : (
                          "⚽"
                        )}
                      </div>
                      <strong>
                        {home?.team.shortDisplayName || "Home"}
                      </strong>
                      <small>HOME</small>
                    </div>

                    <div className="score">
                      {live || status === "انتهت" ? (
                        <>
                          <strong>
                            {score.home} : {score.away}
                          </strong>
                          <span>{live ? "LIVE" : "FT"}</span>
                        </>
                      ) : (
                        <>
                          <strong>VS</strong>
                          <span>{time(match.date)}</span>
                        </>
                      )}
                    </div>

                    <div className="team">
                      <div className="team-logo">
                        {away?.team.logo ? (
                          <img src={away.team.logo} alt="" />
                        ) : (
                          "⚽"
                        )}
                      </div>
                      <strong>
                        {away?.team.shortDisplayName || "Away"}
                      </strong>
                      <small>AWAY</small>
                    </div>
                  </div>

                  <button className="details-btn">
                    Details <span>→</span>
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