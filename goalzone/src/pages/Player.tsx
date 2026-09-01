import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPlayerCareer,
  type Transfer,
} from "../api/transfersApi";

import "./Transfers.css";

function Player() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [career, setCareer] =
    useState<Transfer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;

      try {
        setLoading(true);

        const data =
          await getPlayerCareer(
            Number(id)
          );

        if (!cancelled) {
          setCareer(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            "تعذر تحميل مسيرة اللاعب."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const player =
    career[0];

  return (
    <main
      className="player-page"
      dir="rtl"
    >
      <button
        className="back-button"
        onClick={() =>
          navigate("/transfers")
        }
      >
        → العودة للانتقالات
      </button>

      {loading && (
        <div className="transfers-state">
          <div className="transfer-loader" />

          <h3>
            جاري تحميل مسيرة اللاعب...
          </h3>
        </div>
      )}

      {!loading && error && (
        <div className="transfers-state error">
          <div>⚠️</div>

          <h3>
            حدث خطأ
          </h3>

          <p>
            {error}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        !player && (
          <div className="transfers-state">
            <div>⚽</div>

            <h3>
              اللاعب غير موجود
            </h3>
          </div>
        )}

      {!loading &&
        !error &&
        player && (
          <>
            <section className="player-hero">
              <div className="player-avatar">
                {player.playerImage ? (
                  <img
                    src={
                      player.playerImage
                    }
                    alt={
                      player.playerName
                    }
                  />
                ) : (
                  "⚽"
                )}
              </div>

              <div>
                <span>
                  PLAYER PROFILE
                </span>

                <h1>
                  {player.playerName}
                </h1>

                <p>
                  {player.flag ?? "🌍"}{" "}
                  {player.country ??
                    "Unknown"}
                </p>
              </div>
            </section>

            <section className="career-section">
              <div className="career-heading">
                <span>
                  CAREER TIMELINE
                </span>

                <h2>
                  مسيرة اللاعب
                </h2>
              </div>

              <div className="career-timeline">
                {career.map(
                  (transfer, index) => (
                    <div
                      className="career-item"
                      key={
                        transfer.id
                      }
                    >
                      <div className="career-dot">
                        {index + 1}
                      </div>

                      <div className="career-card">
                        <div className="career-club">
                          <div>
                            {transfer.fromLogo ? (
                              <img
                                src={
                                  transfer.fromLogo
                                }
                                alt=""
                              />
                            ) : (
                              "⚽"
                            )}
                          </div>

                          <span>
                            {transfer.fromTeam ??
                              "Free Agent"}
                          </span>
                        </div>

                        <div className="career-arrow">
                          →
                        </div>

                        <div className="career-club">
                          <div>
                            {transfer.toLogo ? (
                              <img
                                src={
                                  transfer.toLogo
                                }
                                alt=""
                              />
                            ) : (
                              "⚽"
                            )}
                          </div>

                          <span>
                            {transfer.toTeam ??
                              "Unknown"}
                          </span>
                        </div>

                        <div className="career-details">
                          <strong>
                            {formatFee(
                              transfer.amount
                            )}
                          </strong>

                          <small>
                            {formatDate(
                              transfer.date
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          </>
        )}
    </main>
  );
}

function formatFee(
  amount?: number
) {
  if (
    amount === undefined ||
    amount === null
  ) {
    return "غير معلن";
  }

  if (amount === 0) {
    return "مجاني";
  }

  return `€${amount.toLocaleString()}`;
}

function formatDate(
  date?: string
) {
  if (!date) return "";

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleDateString(
    "ar-EG",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default Player;