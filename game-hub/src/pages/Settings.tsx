import type { Language, Theme } from "../types/game";
import type { Translation } from "../data/translations";

type Props = {
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  t: Translation;
};

export default function Settings({
  language,
  theme,
  setLanguage,
  setTheme,
  t
}: Props) {
  return (
    <section className="settings-page page-section">
      <div className="container">
        <div className="settings-page-header">
          <span className="eyebrow">⚙ {t.settings}</span>
          <h2>{t.settings}</h2>
          <p>{t.settingsDescription}</p>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <div className="settings-card-icon">🌐</div>

            <div className="settings-card-content">
              <h3>{t.language}</h3>
              <p>{t.chooseLanguage}</p>
            </div>

            <div className="settings-choice-grid">
              <button
                type="button"
                className={language === "en" ? "selected" : ""}
                onClick={() => setLanguage("en")}
              >
                🇬🇧
                <span>{t.english}</span>
              </button>

              <button
                type="button"
                className={language === "ar" ? "selected" : ""}
                onClick={() => setLanguage("ar")}
              >
                🇪🇬
                <span>{t.arabic}</span>
              </button>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-icon">🎨</div>

            <div className="settings-card-content">
              <h3>{t.theme}</h3>
              <p>{t.chooseTheme}</p>
            </div>

            <div className="settings-choice-grid">
              <button
                type="button"
                className={theme === "dark" ? "selected" : ""}
                onClick={() => setTheme("dark")}
              >
                🌙
                <span>{t.dark}</span>
              </button>

              <button
                type="button"
                className={theme === "light" ? "selected" : ""}
                onClick={() => setTheme("light")}
              >
                ☀️
                <span>{t.light}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}