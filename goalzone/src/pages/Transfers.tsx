
// src/pages/Transfers.tsx

import { useEffect, useState } from "react";

import {
  getTransfers,
  type Transaction,
} from "../api/footballApi";

import "./Transfers.css";

function Transfers() {
  const [transfers, setTransfers] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD TRANSFERS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadTransfers() {
      setLoading(true);
      setError("");

      try {
        const data = await getTransfers();

        if (!cancelled) {
          setTransfers(data);
        }
      } catch (err) {
        console.error(
          "Transfers error:",
          err
        );

        if (!cancelled) {
          setError(
            "تعذر تحميل بيانات الانتقالات من المصدر الحالي."
          );

          setTransfers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTransfers();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="transfers-page">

      {/* ================= HEADER ================= */}

      <section className="page-header transfers-header">

        <div className="page-header-content">

          <span>
            ⚽ TRANSFER CENTER
          </span>

          <h1>
            PLAYER <strong>TRANSFERS</strong>
          </h1>

          <p>
            أحدث تحركات اللاعبين والصفقات
            في عالم كرة القدم.
          </p>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <section className="page-content transfers-content">

        {/* LOADING */}

        {loading && (
          <div className="api-message">

            <div className="transfers-loader" />

            <p>
              جاري تحميل الانتقالات...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="api-message error">

            <div className="message-icon">
              ⚠️
            </div>

            <h3>
              حدث خطأ
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              إعادة المحاولة
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          transfers.length === 0 && (
            <div className="empty-state">

              <div className="message-icon">
                🔄
              </div>

              <h3>
                لا توجد انتقالات
              </h3>

              <p>
                لا توجد بيانات انتقالات
                متاحة حاليًا.
              </p>

            </div>
          )}

        {/* TRANSFERS */}

        {!loading &&
          !error &&
          transfers.length > 0 && (

            <div className="transfers-list">

              {transfers.map(
                (transfer, index) => (

                  <article
                    className="transfer-card"
                    key={
                      transfer.id ||
                      `transfer-${index}`
                    }
                  >

                    {/* PLAYER */}

                    <div className="transfer-player">

                      <div className="transfer-avatar">

                        {transfer.image ? (
                          <img
                            src={
                              transfer.image
                            }
                            alt={
                              transfer.player
                            }
                            loading="lazy"
                          />
                        ) : (
                          <span>
                            ⚽
                          </span>
                        )}

                      </div>

                      <div className="transfer-player-info">

                        <strong>
                          {transfer.player ||
                            "لاعب غير معروف"}
                        </strong>

                        <small>
                          {transfer.date ||
                            "تاريخ غير محدد"}
                        </small>

                      </div>

                    </div>

                    {/* TRANSFER */}

                    <div className="transfer-route">

                      <div className="transfer-club from">

                        <span>
                          من
                        </span>

                        <strong>
                          {transfer.from ||
                            "غير معروف"}
                        </strong>

                      </div>

                      <div className="transfer-arrow">
                        →
                      </div>

                      <div className="transfer-club to">

                        <span>
                          إلى
                        </span>

                        <strong>
                          {transfer.to ||
                            "غير معروف"}
                        </strong>

                      </div>

                    </div>

                    {/* TYPE */}

                    <div className="transfer-type">

                      <span>
                        {transfer.type ||
                          "Transfer"}
                      </span>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

      </section>

    </main>
  );
}

export default Transfers;

