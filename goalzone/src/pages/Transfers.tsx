
import { useMemo, useState } from "react";
import "./Transfers.css";

type TransferType = "all" | "confirmed" | "loan" | "free";

type Transfer = {
  id: number;
  player: string;
  position: string;
  from: string;
  to: string;
  fee: string;
  date: string;
  type: "confirmed" | "loan" | "free";
  fromLogo?: string;
  toLogo?: string;
  playerImage?: string;
};

/*
  صفحة Transfers جاهزة للـ API.
  ESPN API الحالي في footballApi.ts لا يوفر
  قائمة Transfers عامة، لذلك لا نضع بيانات وهمية.
*/
const transferData: Transfer[] = [];

function Transfers() {
  const [activeFilter, setActiveFilter] =
    useState<TransferType>("all");

  const [search, setSearch] = useState("");

  const filteredTransfers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return transferData.filter((transfer) => {
      const filterMatch =
        activeFilter === "all" ||
        transfer.type === activeFilter;

      const searchMatch =
        !value ||
        transfer.player.toLowerCase().includes(value) ||
        transfer.from.toLowerCase().includes(value) ||
        transfer.to.toLowerCase().includes(value);

      return filterMatch && searchMatch;
    });
  }, [activeFilter, search]);

  const totalTransfers = transferData.length;

  const confirmedTransfers = transferData.filter(
    (item) => item.type === "confirmed"
  ).length;

  const loanTransfers = transferData.filter(
    (item) => item.type === "loan"
  ).length;

  const freeTransfers = transferData.filter(
    (item) => item.type === "free"
  ).length;

  return (
    <main className="transfers-page" dir="rtl">
      {/* =========================================
          HERO
      ========================================== */}
      <section className="transfers-hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow hero-glow-right" />
        <div className="hero-glow hero-glow-left" />

        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            GOALZONE TRANSFER CENTER
          </div>

          <h1>
            سوق
            <br />
            <span>الانتقالات</span>
          </h1>

          <p>
            تابع حركة اللاعبين بين الأندية،
            الصفقات الجديدة، الإعارات وآخر
            أخبار سوق الانتقالات في مكان واحد.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              document
                .getElementById("transfer-market")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            <span>استكشف السوق</span>
            <b>←</b>
          </button>
        </div>

        <div className="hero-art">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />

          <div className="football">
            ⚽
          </div>

          <div className="floating-transfer-card card-a">
            <span className="floating-icon">↗</span>

            <div>
              <strong>TRANSFER</strong>
              <small>MARKET</small>
            </div>
          </div>

          <div className="floating-transfer-card card-b">
            <span className="floating-icon">✓</span>

            <div>
              <strong>GOALZONE</strong>
              <small>FOOTBALL CENTER</small>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          MARKET CONTENT
      ========================================== */}
      <section
        className="transfer-market"
        id="transfer-market"
      >
        {/* STATS */}
        <div className="transfer-stats">
          <div className="stat-box">
            <div className="stat-symbol">↔</div>

            <div>
              <span>إجمالي الانتقالات</span>
              <strong>{totalTransfers}</strong>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-symbol">✓</div>

            <div>
              <span>صفقات مؤكدة</span>
              <strong>{confirmedTransfers}</strong>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-symbol">↪</div>

            <div>
              <span>إعارات</span>
              <strong>{loanTransfers}</strong>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-symbol">★</div>

            <div>
              <span>انتقالات مجانية</span>
              <strong>{freeTransfers}</strong>
            </div>
          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="market-header">
          <div className="market-title">
            <span>TRANSFER MARKET</span>

            <h2>أحدث الانتقالات</h2>

            <p>
              أحدث حركة للاعبين بين الأندية
            </p>
          </div>

          <div className="transfer-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="ابحث عن لاعب أو نادي..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="transfer-filters">
          <button
            className={
              activeFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            الكل
          </button>

          <button
            className={
              activeFilter === "confirmed"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("confirmed")
            }
          >
            صفقات مؤكدة
          </button>

          <button
            className={
              activeFilter === "loan"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("loan")
            }
          >
            إعارات
          </button>

          <button
            className={
              activeFilter === "free"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("free")
            }
          >
            انتقال مجاني
          </button>
        </div>

        {/* =========================================
            TRANSFER LIST
        ========================================== */}
        {filteredTransfers.length > 0 ? (
          <div className="transfer-grid">
            {filteredTransfers.map((transfer) => (
              <article
                className="transfer-card"
                key={transfer.id}
              >
                <div className="transfer-card-head">
                  <span
                    className={`transfer-type ${transfer.type}`}
                  >
                    {transfer.type === "loan"
                      ? "إعارة"
                      : transfer.type === "free"
                      ? "مجاني"
                      : "مؤكد"}
                  </span>

                  <span className="transfer-date">
                    {transfer.date}
                  </span>
                </div>

                <div className="player-section">
                  {transfer.playerImage ? (
                    <img
                      className="player-image"
                      src={transfer.playerImage}
                      alt={transfer.player}
                    />
                  ) : (
                    <div className="player-placeholder">
                      ⚽
                    </div>
                  )}

                  <div>
                    <h3>{transfer.player}</h3>

                    <p>
                      {transfer.position}
                    </p>
                  </div>
                </div>

                <div className="clubs">
                  <div className="club">
                    {transfer.fromLogo ? (
                      <img
                        src={transfer.fromLogo}
                        alt=""
                      />
                    ) : (
                      <div className="club-placeholder">
                        🛡
                      </div>
                    )}

                    <div>
                      <small>من</small>
                      <strong>
                        {transfer.from}
                      </strong>
                    </div>
                  </div>

                  <div className="transfer-arrow">
                    <span />
                    →
                  </div>

                  <div className="club">
                    {transfer.toLogo ? (
                      <img
                        src={transfer.toLogo}
                        alt=""
                      />
                    ) : (
                      <div className="club-placeholder">
                        🛡
                      </div>
                    )}

                    <div>
                      <small>إلى</small>
                      <strong>
                        {transfer.to}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="transfer-footer">
                  <span>قيمة الصفقة</span>

                  <strong>
                    {transfer.fee}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* =========================================
             EMPTY STATE
          ========================================== */
          <div className="empty-state">
            <div className="empty-decoration" />

            <div className="empty-icon">
              <span>↔</span>
            </div>

            <span className="empty-kicker">
              TRANSFER CENTER
            </span>

            <h3>
              لا توجد انتقالات متاحة حاليًا
            </h3>

            <p>
              مصدر البيانات الحالي في GoalZone
              لا يوفر قائمة انتقالات اللاعبين،
              لذلك لن نعرض صفقات غير حقيقية.
            </p>

            <div className="empty-note">
              <span>i</span>

              <p>
                صفحة الانتقالات جاهزة لاستقبال
                البيانات الحقيقية بمجرد ربط
                مصدر انتقالات مناسب.
              </p>
            </div>
          </div>
        )}

        <div className="source-note">
          <span>⚡</span>
          GoalZone Football Center
        </div>
      </section>
    </main>
  );
}

export default Transfers;
