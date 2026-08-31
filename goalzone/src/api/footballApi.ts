// src/api/footballApi.ts

const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

// ======================================================
// TYPES
// ======================================================

export type ApiTeam = {
  id?: string;
  displayName: string;
  shortDisplayName?: string;
  abbreviation?: string;
  logo?: string;
};

export type ApiCompetitor = {
  id?: string;
  homeAway: "home" | "away";
  score?: string;
  team: ApiTeam;
};

// Compatibility alias
export type Competitor = ApiCompetitor;

export type ApiStatus = {
  type?: {
    id?: string;
    name?: string;
    state?: string;
    completed?: boolean;
    description?: string;
    detail?: string;
    shortDetail?: string;
  };
};

export type ApiCompetition = {
  id?: string;
  date?: string;
  competitors: ApiCompetitor[];
  status?: ApiStatus;

  venue?: {
    fullName?: string;
  };
};

export type ApiLeague = {
  id?: string;
  name?: string;
  abbreviation?: string;
  logo?: string;
};

export type ApiEvent = {
  id: string;
  name: string;
  date: string;

  competitions?: ApiCompetition[];

  league?: ApiLeague;

  season?: {
    name?: string;
    year?: number;
  };
};

// ======================================================
// NEWS
// ======================================================

export type NewsArticle = {
  id: string;
  headline: string;
  description?: string;
  published?: string;
  image?: string;
  link?: string;
  source?: string;
  category?: string;
};

// ======================================================
// TRANSFERS
// ======================================================

export type Transaction = {
  id: string;
  player: string;
  from: string;
  to: string;
  date: string;
  type?: string;
  image?: string;
};

// ======================================================
// LEAGUES
// ======================================================

export const LEAGUES = {
  premierLeague: "eng.1",
  laLiga: "esp.1",
  serieA: "ita.1",
  bundesliga: "ger.1",
  ligue1: "fra.1",
  eredivisie: "ned.1",
  primeiraLiga: "por.1",
  superLig: "tur.1",
  egyptianLeague: "egy.1",
  saudiLeague: "sau.1",
  belgianLeague: "bel.1",
  scottishLeague: "sco.1",
  greekLeague: "gre.1",
  brazilianLeague: "bra.1",
  argentineLeague: "arg.1",
  mexicanLeague: "mex.1",
  mls: "usa.1",
  championsLeague: "uefa.champions",
  europaLeague: "uefa.europa",
} as const;

// ======================================================
// LEAGUE INFORMATION
// ======================================================

export const ALL_LEAGUES = [
  {
    id: LEAGUES.premierLeague,
    name: "الدوري الإنجليزي الممتاز",
    country: "England",
    flag: "🇬🇧",
  },
  {
    id: LEAGUES.laLiga,
    name: "الدوري الإسباني",
    country: "Spain",
    flag: "🇪🇸",
  },
  {
    id: LEAGUES.serieA,
    name: "الدوري الإيطالي",
    country: "Italy",
    flag: "🇮🇹",
  },
  {
    id: LEAGUES.bundesliga,
    name: "الدوري الألماني",
    country: "Germany",
    flag: "🇩🇪",
  },
  {
    id: LEAGUES.ligue1,
    name: "الدوري الفرنسي",
    country: "France",
    flag: "🇫🇷",
  },
  {
    id: LEAGUES.eredivisie,
    name: "الدوري الهولندي",
    country: "Netherlands",
    flag: "🇳🇱",
  },
  {
    id: LEAGUES.primeiraLiga,
    name: "الدوري البرتغالي",
    country: "Portugal",
    flag: "🇵🇹",
  },
  {
    id: LEAGUES.superLig,
    name: "الدوري التركي",
    country: "Turkey",
    flag: "🇹🇷",
  },
  {
    id: LEAGUES.egyptianLeague,
    name: "الدوري المصري",
    country: "Egypt",
    flag: "🇪🇬",
  },
  {
    id: LEAGUES.saudiLeague,
    name: "الدوري السعودي",
    country: "Saudi Arabia",
    flag: "🇸🇦",
  },
  {
    id: LEAGUES.championsLeague,
    name: "دوري أبطال أوروبا",
    country: "Europe",
    flag: "🏆",
  },
  {
    id: LEAGUES.europaLeague,
    name: "الدوري الأوروبي",
    country: "Europe",
    flag: "🏆",
  },
  {
    id: LEAGUES.belgianLeague,
    name: "الدوري البلجيكي",
    country: "Belgium",
    flag: "🇧🇪",
  },
  {
    id: LEAGUES.scottishLeague,
    name: "الدوري الإسكتلندي",
    country: "Scotland",
    flag: "🏴",
  },
  {
    id: LEAGUES.greekLeague,
    name: "الدوري اليوناني",
    country: "Greece",
    flag: "🇬🇷",
  },
  {
    id: LEAGUES.brazilianLeague,
    name: "الدوري البرازيلي",
    country: "Brazil",
    flag: "🇧🇷",
  },
  {
    id: LEAGUES.argentineLeague,
    name: "الدوري الأرجنتيني",
    country: "Argentina",
    flag: "🇦🇷",
  },
  {
    id: LEAGUES.mexicanLeague,
    name: "الدوري المكسيكي",
    country: "Mexico",
    flag: "🇲🇽",
  },
  {
    id: LEAGUES.mls,
    name: "الدوري الأمريكي",
    country: "USA",
    flag: "🇺🇸",
  },
];

// ======================================================
// DATE HELPERS
// ======================================================

function formatDate(offset = 0): string {
  const date = new Date();

  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}${month}${day}`;
}

function formatDateObject(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}${month}${day}`;
}

// ======================================================
// GET ONE LEAGUE
// ======================================================

export async function getMatches(
  league: string,
  date?: string
): Promise<ApiEvent[]> {
  const selectedDate =
    date ?? formatDate(0);

  const url =
    `${BASE_URL}/${league}/scoreboard` +
    `?dates=${selectedDate}` +
    `&limit=1000`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `API Error ${response.status}`
    );
  }

  const data = await response.json();

  const leagueInfo = ALL_LEAGUES.find(
    item => item.id === league
  );

  return (data.events ?? []).map(
    (event: ApiEvent) => ({
      ...event,

      league: {
        id: league,

        name:
          leagueInfo?.name ??
          "Football",

        abbreviation:
          leagueInfo?.country ??
          league,
      },
    })
  );
}

// ======================================================
// GET ALL LEAGUES
// ======================================================

export async function getAllMatches(
  date?: string
): Promise<ApiEvent[]> {
  const selectedDate =
    date ?? formatDate(0);

  const results =
    await Promise.all(
      ALL_LEAGUES.map(async league => {
        try {
          return await getMatches(
            league.id,
            selectedDate
          );
        } catch (error) {
          console.warn(
            `Could not load ${league.name}`,
            error
          );

          return [];
        }
      })
    );

  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
}

// ======================================================
// TODAY
// ======================================================

export function getTodayMatches() {
  return getAllMatches(
    formatDate(0)
  );
}

// ======================================================
// YESTERDAY
// ======================================================

export function getYesterdayMatches() {
  return getAllMatches(
    formatDate(-1)
  );
}

// ======================================================
// TOMORROW
// ======================================================

export function getTomorrowMatches() {
  return getAllMatches(
    formatDate(1)
  );
}

// ======================================================
// CUSTOM DATE
// ======================================================

export function getMatchesByDate(
  date: Date
) {
  return getAllMatches(
    formatDateObject(date)
  );
}

// ======================================================
// LIVE
// ======================================================

export async function getLiveMatches(): Promise<ApiEvent[]> {
  const matches =
    await getTodayMatches();

  return matches.filter(
    match => isMatchLive(match)
  );
}

// ======================================================
// MATCH STATUS
// ======================================================

export function getMatchStatus(
  match: ApiEvent
): string {
  const status =
    match.competitions?.[0]
      ?.status?.type;

  if (!status) {
    return "لم تبدأ";
  }

  if (
    status.completed ||
    status.state === "post"
  ) {
    return "انتهت";
  }

  if (status.state === "in") {
    return "مباشر";
  }

  if (status.state === "pre") {
    return "لم تبدأ";
  }

  return (
    status.description ??
    status.detail ??
    "غير معروف"
  );
}

// ======================================================
// IS MATCH LIVE
// ======================================================

export function isMatchLive(
  match: ApiEvent
): boolean {
  const status =
    match.competitions?.[0]
      ?.status?.type;

  return status?.state === "in";
}

// ======================================================
// GET MATCH TEAMS
// ======================================================

export function getMatchTeams(
  match: ApiEvent
) {
  const competitors =
    match.competitions?.[0]
      ?.competitors ?? [];

  const home =
    competitors.find(
      competitor =>
        competitor.homeAway === "home"
    );

  const away =
    competitors.find(
      competitor =>
        competitor.homeAway === "away"
    );

  return {
    home,
    away,
  };
}

// ======================================================
// GET MATCH SCORE
// ======================================================

export function getMatchScore(
  match: ApiEvent
) {
  const {
    home,
    away,
  } = getMatchTeams(match);

  return {
    home:
      home?.score ??
      "0",

    away:
      away?.score ??
      "0",
  };
}

// ======================================================
// GET MATCH DETAILS
// ======================================================

export async function getMatchDetails(
  league: string,
  matchId: string
): Promise<ApiEvent | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/${league}/summary?event=${matchId}`
    );

    if (!response.ok) {
      throw new Error(
        `API Error ${response.status}`
      );
    }

    const data =
      await response.json();

    const header =
      data.header;

    if (!header) {
      return null;
    }

    const competition =
      header.competitions?.[0];

    const competitors =
      competition?.competitors ?? [];

    const event: ApiEvent = {
      id:
        header.id ??
        matchId,

      name:
        competitors
          .map(
            (competitor: ApiCompetitor) =>
              competitor.team.displayName
          )
          .join(" vs ") ||
        "Football Match",

      date:
        competition?.date ??
        header.date ??
        new Date().toISOString(),

      competitions:
        header.competitions ??
        [],

      league: {
        id: league,

        name:
          ALL_LEAGUES.find(
            item => item.id === league
          )?.name ??
          "Football",

        abbreviation: league,
      },

      season: {
        name:
          header.season?.displayName ??
          header.season?.name,

        year:
          header.season?.year,
      },
    };

    return event;
  } catch (error) {
    console.error(
      "getMatchDetails error:",
      error
    );

    return null;
  }
}

// ======================================================
// GET MATCH SCORE FROM API
// ======================================================

export async function getMatchScoreDetails(
  matchId: string,
  league: string
): Promise<ApiEvent | null> {
  return getMatchDetails(
    league,
    matchId
  );
}

// ======================================================
// NEWS
// ======================================================

export async function getNews(): Promise<
  NewsArticle[]
> {
  try {
    const response = await fetch(
      `${BASE_URL}/news`
    );

    if (!response.ok) {
      throw new Error(
        `News API Error ${response.status}`
      );
    }

    const data =
      await response.json();

    return (
      data.articles ?? []
    ).map(
      (
        article: any,
        index: number
      ): NewsArticle => ({
        id:
          article.id ??
          String(index),

        headline:
          article.headline ??
          article.title ??
          "Football News",

        description:
          article.description ??
          article.story ??
          "",

        published:
          article.published ??
          article.date ??
          "",

        image:
          article.images?.[0]?.url ??
          "",

        link:
          article.links?.[0]?.href ??
          "",

        source:
          article.source?.name ??
          "ESPN",

        category:
          article.categories?.[0]
            ?.description ??
          "Football",
      })
    );
  } catch (error) {
    console.error(
      "getNews error:",
      error
    );

    return [];
  }
}

// ======================================================
// TRANSFERS
// ======================================================

export async function getTransfers(): Promise<
  Transaction[]
> {
  /*
   * ESPN Soccer API لا يوفر endpoint عام
   * للانتقالات بنفس طريقة المباريات.
   *
   * نرجع مصفوفة فارغة بدل بيانات وهمية.
   * الصفحة ستبقى شغالة بدون Error.
   */

  return [];
}