
// src/pages/MatchDetails.tsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getMatchDetails,
  getMatchTeams,
  getMatchScore,
  getMatchStatus,
  isMatchLive,
  type ApiEvent,
} from "../api/footballApi";

import "./MatchDetails.css";

function MatchDetails() {
  const { eventId } = useParams<{ eventId: string }>();

  const [match, setMatch] =
    useState<ApiEvent | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD MATCH
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadMatch() {
      if (!eventId) {
        setError("Match ID غير موجود");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
         * البطولة الافتراضية.
         *
         * لو جايب الدوري من صفحة Matches
         * ممكن نمرره لاحقًا عن طريق URL.
         */
        const league = "eng.1";

        const data = await getMatchDetails(
          league,
          eventId
        );

        if (cancelled) {
          return;
        }

        if (!data) {
          setError(
            "لم يتم العثور على المباراة."
          );

          setMatch(null);
          return;
        }

        setMatch(data);
      } catch (err) {
        console.error(
          "Match Details Error:",
          err
        );

        if (!cancelled) {
          setError(
            "تعذر تحميل تفاصيل المباراة."
          );

          setMatch(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMatch();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="match-details-page">

        <div className="match-details-loading">

          <div className="details-spinner" />

          <p>
            جاري تحميل تفاصيل المباراة...
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !match) {
    return (
      <main className="match-details-page">

        <div className="match-details-error">

          <div className="error-icon">
            ⚽
          </div>

          <h1>
            Match Not Found
          </h1>

          <p>
            {error ||
              "لم يتم العثور على المباراة."}
          </p>

          <Link
            to="/matches"
            className="back-button"
          >
            ← Back to Matches
          </Link>

        </div>

      </main>
    );
  }

  // =====================================================
  // MATCH DATA
  // =====================================================

  const { home, away } =
    getMatchTeams(match);

  const score =
    getMatchScore(match);

  const status =
    getMatchStatus(match);

  const live =
    isMatchLive(match);

  const competition =
    match.competitions?.[0];

  const venue =
    competition?.venue?.fullName;

  const matchDate =
    new Date(match.date);

  const validDate =
    !Number.isNaN(
      matchDate.getTime()
    );

  const formattedDate =
    validDate
      ? matchDate.toLocaleDateString(
          "ar-EG",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "التاريخ غير متاح";

  const formattedTime =
    validDate
      ? matchDate.toLocaleTimeString(
          "ar-EG",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "--:--";

  const isFinished =
    competition?.status?.type
      ?.completed === true ||
    competition?.status?.type
      ?.state === "post";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="match-details-page">

      {/* =================================================
          TOP
      ================================================= */}

      <section className="details-top">

        <Link
          to="/matches"
          className="back-button"
        >
          ← العودة للمباريات
        </Link>

        <div className="competition-label">
          ⚽ GOALZONE MATCH CENTER
        </div>

        <h1>
          تفاصيل المباراة
        </h1>

        <p>
          كل المعلومات الأساسية عن المباراة
        </p>

      </section>

      {/* =================================================
          CONTAINER
      ================================================= */}

      <section className="details-container">

        {/* =================================================
            MAIN MATCH CARD
        ================================================= */}

        <div
          className={`details-match-card ${
            live ? "is-live" : ""
          }`}
        >

          {/* STATUS */}

          <div className="details-status">

            <span
              className={
                live
                  ? "status live"
                  : isFinished
                  ? "status finished"
                  : "status upcoming"
              }
            >
              {live
                ? "● مباشر"
                : isFinished
                ? "انتهت"
                : "لم تبدأ"}
            </span>

            <span className="status-detail">
              {competition
                ?.status
                ?.type
                ?.shortDetail ||
                status}
            </span>

          </div>

          {/* LEAGUE */}

          <div className="details-league">

            <span>
              {match.league?.name ||
                "Football"}
            </span>

          </div>

          {/* DATE */}

          <div className="details-date">

            <strong>
              {formattedDate}
            </strong>

            <span>
              {formattedTime}
            </span>

          </div>

          {/* =================================================
              TEAMS
          ================================================= */}

          <div className="details-teams">

            {/* HOME */}

            <div className="details-team">

              <div className="team-logo-large">

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

              <h2>
                {home?.team.displayName ||
                  "الفريق المضيف"}
              </h2>

              <span>
                HOME
              </span>

            </div>

            {/* SCORE */}

            <div className="details-score">

              <div className="score-number">

                <strong>
                  {live ||
                  isFinished
                    ? score.home
                    : "-"}
                </strong>

                <span>
                  :
                </span>

                <strong>
                  {live ||
                  isFinished
                    ? score.away
                    : "-"}
                </strong>

              </div>

              <div className="score-label">

                {live
                  ? "MATCH IN PROGRESS"
                  : isFinished
                  ? "FULL TIME"
                  : "KICK OFF"}

              </div>

            </div>

            {/* AWAY */}

            <div className="details-team">

              <div className="team-logo-large">

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

              <h2>
                {away?.team.displayName ||
                  "الفريق الضيف"}
              </h2>

              <span>
                AWAY
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="details-info-grid">

          <div className="info-box">

            <span>
              البطولة
            </span>

            <strong>
              {match.league?.name ||
                "Football"}
            </strong>

          </div>

          <div className="info-box">

            <span>
              التاريخ
            </span>

            <strong>
              {formattedDate}
            </strong>

          </div>

          <div className="info-box">

            <span>
              الوقت
            </span>

            <strong>
              {formattedTime}
            </strong>

          </div>

          <div className="info-box">

            <span>
              الحالة
            </span>

            <strong>
              {status}
            </strong>

          </div>

        </div>

        {/* =================================================
            VENUE
        ================================================= */}

        {venue && (
          <section className="details-section">

            <div className="section-heading">

              <span>
                STADIUM
              </span>

              <h2>
                الملعب
              </h2>

            </div>

            <div className="venue-card">

              <div className="venue-icon">
                🏟️
              </div>

              <div>
                <span>
                  Venue
                </span>

                <strong>
                  {venue}
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* =================================================
            MATCH ID
        ================================================= */}

        <section className="details-section">

          <div className="section-heading">

            <span>
              MATCH INFORMATION
            </span>

            <h2>
              معلومات المباراة
            </h2>

          </div>

          <div className="match-extra-grid">

            <div className="extra-box">

              <span>
                MATCH ID
              </span>

              <strong>
                #{match.id}
              </strong>

            </div>

            <div className="extra-box">

              <span>
                SEASON
              </span>

              <strong>
                {match.season?.name ||
                  match.season?.year ||
                  "غير متاح"}
              </strong>

            </div>

            <div className="extra-box">

              <span>
                HOME
              </span>

              <strong>
                {home?.team.abbreviation ||
                  home?.team.shortDisplayName ||
                  "-"}
              </strong>

            </div>

            <div className="extra-box">

              <span>
                AWAY
              </span>

              <strong>
                {away?.team.abbreviation ||
                  away?.team.shortDisplayName ||
                  "-"}
              </strong>

            </div>

          </div>

        </section>

      </section>

    </main>
  );
}

export default MatchDetails;
