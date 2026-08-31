
import { useEffect, useState } from "react";

import {
  getLiveMatches,

  type ApiEvent,
} from "../api/footballApi";

function Live() {
  const [matches, setMatches] =
    useState<ApiEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadLive() {
      try {
        setLoading(true);

        const data =
          await getLiveMatches(
           
          );

        setMatches(data);
      } catch (err) {
        console.error(err);
        setError(
          "فشل تحميل المباريات المباشرة."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLive();

    const interval =
      setInterval(loadLive, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="live-page">
      <section className="page-header">
        <span>LIVE CENTER</span>

        <h1>
          LIVE <strong>MATCHES</strong>
        </h1>

        <p>
          تابع المباريات الجارية حاليًا.
        </p>
      </section>

      <section className="page-content">
        {loading && (
          <div className="api-message">
            جاري تحميل المباريات...
          </div>
        )}

        {error && (
          <div className="api-message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          matches.length === 0 && (
            <div className="empty-state">
              <span>⚽</span>
              <h2>
                لا توجد مباريات مباشرة الآن
              </h2>
              <p>
                سيتم تحديث الصفحة تلقائيًا.
              </p>
            </div>
          )}

        <div className="live-grid">
          {matches.map((match) => {
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

            return (
              <article
                className="live-card"
                key={match.id}
              >
                <div className="live-status">
                  <span></span>
                  LIVE
                </div>

                <div className="live-teams">
                  <div>
                    <b>
                      {home?.team.displayName}
                    </b>

                    <strong>
                      {home?.score ?? "0"}
                    </strong>
                  </div>

                  <div className="live-vs">
                    VS
                  </div>

                  <div>
                    <b>
                      {away?.team.displayName}
                    </b>

                    <strong>
                      {away?.score ?? "0"}
                    </strong>
                  </div>
                </div>

                <small>
                  {competition?.status?.type
                    ?.shortDetail ?? "LIVE"}
                </small>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Live;

