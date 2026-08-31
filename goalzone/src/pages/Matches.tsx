
// src/pages/Matches.tsx

import { useEffect, useMemo, useState } from "react";
import {
  getTodayMatches,
  getYesterdayMatches,
  getTomorrowMatches,
  getLiveMatches,
  getMatchStatus,
  getMatchTeams,
  getMatchScore,
  isMatchLive,
  type ApiEvent,
} from "../api/footballApi";

import "./Matches.css";

type MatchDay = "yesterday" | "today" | "tomorrow" | "live";

function Matches() {
  const [matches, setMatches] = useState<ApiEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<MatchDay>("today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    const loadMatches = async () => {
      setLoading(true);
      setError("");

      try {
        let data: ApiEvent[];

        switch (selectedDay) {
          case "yesterday":
            data = await getYesterdayMatches();
            break;

          case "tomorrow":
            data = await getTomorrowMatches();
            break;

          case "live":
            data = await getLiveMatches();
            break;

          default:
            data = await getTodayMatches();
        }

        if (!cancelled) {
          setMatches(data);
        }
      } catch (err) {
        console.error("Matches error:", err);

        if (!cancelled) {
          setMatches([]);
          setError("حدث خطأ أثناء تحميل المباريات.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, [selectedDay]);

  const leagues = useMemo(() => {
    const map = new Map<string, string>();

    matches.forEach((match) => {
      const id = match.league?.id;
      const name = match.league?.name;

      if (id && name) {
        map.set(id, name);
      }
    });

    return Array.from(map.entries());
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (leagueFilter === "all") {
      return matches;
    }

    return matches.filter(
      (match) => match.league?.id === leagueFilter
    );
  }, [matches, leagueFilter]);

  const pageTitle = {
    yesterday: "مباريات أمس",
    today: "مباريات اليوم",
    tomorrow: "مباريات غدًا",
    live: "المباريات المباشرة",
  }[selectedDay];

  const changeDay = (day: MatchDay) => {
    setLeagueFilter("all");
    setSelectedDay(day);
  };

  return (
    <main className="matches-page" dir="rtl">
      <section className="matches-hero">
        <div className="matches-hero-content">
          <span className="matches-kicker">⚽ GOALZONE</span>

          <h1>المباريات</h1>

          <p>
            تابع نتائج ومواعيد مباريات أهم البطولات العالمية.
          </p>
        </div>
      </section>

      <section className="matches-controls">
        <div className="day-tabs">
          <button
            className={selectedDay === "yesterday" ? "active" : ""}
            onClick={() => changeDay("yesterday")}
          >
            <span>أمس</span>
            <small>Yesterday</small>
          </button>

          <button
            className={selectedDay === "today" ? "active" : ""}
            onClick={() => changeDay("today")}
          >
            <span>اليوم</span>
            <small>Today</small>
          </button>

          <button
            className={selectedDay === "tomorrow" ? "active" : ""}
            onClick={() => changeDay("tomorrow")}
          >
            <span>غدًا</span>
            <small>Tomorrow</small>
          </button>

          <button
            className={selectedDay === "live" ? "active live-tab" : ""}
            onClick={() => changeDay("live")}
          >
            <span>
              <i className="live-dot" />
              مباشر
            </span>

            <small>Live</small>
          </button>
        </div>

        <div className="league-filter">
          <label htmlFor="league-select">البطولة</label>

          <select
            id="league-select"
            value={leagueFilter}
            onChange={(event) =>
              setLeagueFilter(event.target.value)
            }
          >
            <option value="all">كل البطولات</option>

            {leagues.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="matches-list-section">
        <div className="matches-section-head">
          <div>
            <span>MATCH CENTER</span>
            <h2>{pageTitle}</h2>
          </div>

          <div className="matches-count">
            {filteredMatches.length}
            <span> مباراة</span>
          </div>
        </div>

        {loading && (
          <div className="matches-state">
            <div className="loader" />
            <p>جاري تحميل المباريات...</p>
          </div>
        )}

        {!loading && error && (
          <div className="matches-state error">
            <div className="state-icon">⚠️</div>

            <h3>حدث خطأ</h3>

            <p>{error}</p>

            <button onClick={() => changeDay(selectedDay)}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && filteredMatches.length === 0 && (
          <div className="matches-state">
            <div className="state-icon">⚽</div>

            <h3>لا توجد مباريات</h3>

            <p>لا توجد مباريات متاحة في هذا اليوم.</p>
          </div>
        )}

        {!loading && !error && filteredMatches.length > 0 && (
          <div className="matches-grid">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

type MatchCardProps = {
  match: ApiEvent;
};

function MatchCard({ match }: MatchCardProps) {
  const { home, away } = getMatchTeams(match);
  const score = getMatchScore(match);
  const status = getMatchStatus(match);
  const live = isMatchLive(match);

  const matchDate = new Date(match.date);

  const time = matchDate.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = matchDate.toLocaleDateString("ar-EG");

  return (
    <article className={`match-card ${live ? "is-live" : ""}`}>
      <div className="match-card-top">
        <div className="match-league">
          <span>{match.league?.name ?? "Football"}</span>
        </div>

        {live && (
          <div className="live-badge">
            <i />
            LIVE
          </div>
        )}
      </div>

      <div className="match-teams">
        <div className="team home-team">
          <div className="team-logo">
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
            {home?.team.displayName ?? "Home"}
          </strong>
        </div>

        <div className="match-middle">
          {live || status === "انتهت" ? (
            <div className="score">
              <span>{score.home}</span>
              <b>-</b>
              <span>{score.away}</span>
            </div>
          ) : (
            <div className="match-time">{time}</div>
          )}

          <div className={`match-status ${live ? "live" : ""}`}>
            {status}
          </div>
        </div>

        <div className="team away-team">
          <div className="team-logo">
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
            {away?.team.displayName ?? "Away"}
          </strong>
        </div>
      </div>

      <div className="match-card-footer">
        <span>📅 {date}</span>

        {match.competitions?.[0]?.venue?.fullName && (
          <span>
            📍 {match.competitions[0].venue.fullName}
          </span>
        )}
      </div>
    </article>
  );
}

export default Matches;

