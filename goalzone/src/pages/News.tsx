
// src/pages/News.tsx

import { useEffect, useState } from "react";

import {
  getNews,
  type NewsArticle,
} from "../api/footballApi";

import "./News.css";

function News() {
  const [news, setNews] =
    useState<NewsArticle[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const data = await getNews();

        if (!cancelled) {
          setNews(data);
        }
      } catch (err) {
        console.error(
          "News Error:",
          err
        );

        if (!cancelled) {
          setError(
            "فشل تحميل الأخبار."
          );

          setNews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="news-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="page-header">

        <span>
          FOOTBALL NEWS
        </span>

        <h1>
          LATEST{" "}
          <strong>NEWS</strong>
        </h1>

        <p>
          أحدث أخبار كرة القدم العالمية
          وآخر المستجدات.
        </p>

      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="page-content">

        {/* LOADING */}

        {loading && (
          <div className="api-message">

            <div className="news-loader" />

            <p>
              جاري تحميل الأخبار...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="api-message error">

            <div className="news-error-icon">
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
              onClick={() => {
                window.location.reload();
              }}
            >
              إعادة المحاولة
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          news.length === 0 && (
            <div className="empty-state">

              <div className="news-empty-icon">
                📰
              </div>

              <h3>
                لا توجد أخبار
              </h3>

              <p>
                لا توجد أخبار متاحة حاليًا.
              </p>

            </div>
          )}

        {/* NEWS GRID */}

        {!loading &&
          !error &&
          news.length > 0 && (
            <div className="news-grid">

              {news.map(
                (article, index) => (
                  <article
                    className="news-card"
                    key={
                      article.id ||
                      `news-${index}`
                    }
                  >

                    {/* IMAGE */}

                    {article.image ? (
                      <div className="news-image">

                        <img
                          src={article.image}
                          alt={
                            article.headline ||
                            "Football News"
                          }
                          loading="lazy"
                        />

                        <div className="news-image-overlay" />

                        <span className="news-category">
                          {article.category ||
                            "Football"}
                        </span>

                      </div>
                    ) : (
                      <div className="news-image news-placeholder">

                        <span>
                          ⚽
                        </span>

                        <small>
                          GOALZONE
                        </small>

                      </div>
                    )}

                    {/* BODY */}

                    <div className="news-card-body">

                      <div className="news-meta">

                        <span>
                          {article.source ||
                            "ESPN"}
                        </span>

                        {article.published && (
                          <span>
                            {formatNewsDate(
                              article.published
                            )}
                          </span>
                        )}

                      </div>

                      <h2>
                        {article.headline ||
                          "Football News"}
                      </h2>

                      {article.description && (
                        <p>
                          {article.description}
                        </p>
                      )}

                      {/* READ MORE */}

                      {article.link ? (
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="news-read-more"
                        >
                          اقرأ الخبر
                          <span>
                            →
                          </span>
                        </a>
                      ) : (
                        <span className="news-read-more disabled">
                          الخبر غير متاح
                        </span>
                      )}

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

/* ======================================================
   DATE FORMAT
====================================================== */

function formatNewsDate(
  dateString: string
): string {
  try {
    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleDateString(
      "ar-EG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return dateString;
  }
}

export default News;
