
// src/api/footballApi.ts
// =====================================================
// GOALZONE — ESPN SOCCER API
// لا يحتاج VITE_API_KEY
// =====================================================

const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

// =====================================================
// TYPES
// =====================================================

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

// =====================================================
// LEAGUES
// =====================================================

export const LEAGUES = {
  premierLeague: "eng.1",
  laLiga: "esp.1",
  serieA: "ita.1",
  bundesliga: "ger.1",
  ligue1: "fra.1",
  eredivisie: "ned.1",
  primeiraLiga: "por.1",
  superLig: "tur.1",
  championsLeague: "uefa.champions",
  europaLeague: "uefa.europa",
  egyptianLeague: "egy.1",
  saudiLeague: "ksa.1",
  mls: "usa.1",
} as const;

export const ALL_LEAGUES = [
  ["eng.1", "الدوري الإنجليزي الممتاز"],
  ["esp.1", "الدوري الإسباني"],
  ["ita.1", "الدوري الإيطالي"],
  ["ger.1", "الدوري الألماني"],
  ["fra.1", "الدوري الفرنسي"],
  ["ned.1", "الدوري الهولندي"],
  ["por.1", "الدوري البرتغالي"],
  ["tur.1", "الدوري التركي"],
  ["uefa.champions", "دوري أبطال أوروبا"],
  ["uefa.europa", "الدوري الأوروبي"],
  ["usa.1", "الدوري الأمريكي"],
  ["ksa.1", "الدوري السعودي"],
  ["egy.1", "الدوري المصري"],
].map(([id, name]) => ({
  id,
  name,
}));

// =====================================================
// HELPERS
// =====================================================

function formatDate(date = new Date()) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}${month}${day}`;
}

function dateWithOffset(offset: number) {
  const date = new Date();

  date.setDate(
    date.getDate() + offset
  );

  return formatDate(date);
}

// =====================================================
// API REQUEST
// =====================================================

async function apiRequest(
  league: string,
  date?: string
) {
  const selectedDate =
    date ?? formatDate();

  const url =
    `${BASE_URL}/${league}/scoreboard` +
    `?dates=${selectedDate}` +
    `&limit=100`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `ESPN API Error: ${response.status}`
    );
  }

  return response.json();
}

// =====================================================
// STATUS
// =====================================================

function getStatusState(
  status: any
): string {
  if (!status) {
    return "pre";
  }

  if (status.type?.state) {
    return status.type.state;
  }

  const state =
    status.type?.name?.toLowerCase() ?? "";

  if (
    state.includes("progress") ||
    state.includes("live")
  ) {
    return "in";
  }

  if (
    status.type?.completed ||
    state.includes("final")
  ) {
    return "post";
  }

  return "pre";
}

// =====================================================
// NORMALIZE ESPN EVENT
// =====================================================

function normalizeFixture(
  event: any,
  leagueId: string
): ApiEvent {
  const competition =
    event.competitions?.[0];

  const competitors =
    competition?.competitors ?? [];

  const home =
    competitors.find(
      (team: any) =>
        team.homeAway === "home"
    );

  const away =
    competitors.find(
      (team: any) =>
        team.homeAway === "away"
    );

  const rawStatus =
    competition?.status;

  const statusState =
    getStatusState(rawStatus);

  const homeTeam: ApiTeam = {
    id: home?.team?.id
      ? String(home.team.id)
      : undefined,

    displayName:
      home?.team?.displayName ??
      home?.team?.name ??
      "الفريق المضيف",

    shortDisplayName:
      home?.team?.shortDisplayName ??
      home?.team?.displayName ??
      "Home",

    abbreviation:
      home?.team?.abbreviation ??
      "HOME",

    logo:
      home?.team?.logo ??
      "",
  };

  const awayTeam: ApiTeam = {
    id: away?.team?.id
      ? String(away.team.id)
      : undefined,

    displayName:
      away?.team?.displayName ??
      away?.team?.name ??
      "الفريق الضيف",

    shortDisplayName:
      away?.team?.shortDisplayName ??
      away?.team?.displayName ??
      "Away",

    abbreviation:
      away?.team?.abbreviation ??
      "AWAY",

    logo:
      away?.team?.logo ??
      "",
  };

  const homeCompetitor: ApiCompetitor = {
    id: home?.id
      ? String(home.id)
      : homeTeam.id,

    homeAway: "home",

    score:
      home?.score !== undefined
        ? String(home.score)
        : undefined,

    team: homeTeam,
  };

  const awayCompetitor: ApiCompetitor = {
    id: away?.id
      ? String(away.id)
      : awayTeam.id,

    homeAway: "away",

    score:
      away?.score !== undefined
        ? String(away.score)
        : undefined,

    team: awayTeam,
  };

  const date =
    event.date ??
    competition?.date ??
    new Date().toISOString();

  return {
    id: String(
      event.id ?? ""
    ),

    name:
      event.name ??
      `${homeTeam.displayName} vs ${awayTeam.displayName}`,

    date,

    competitions: [
      {
        id: String(
          competition?.id ??
          event.id ??
          ""
        ),

        date,

        competitors: [
          homeCompetitor,
          awayCompetitor,
        ],

        status: {
          type: {
            id:
              rawStatus?.type?.id ??
              "",

            name:
              rawStatus?.type?.name ??
              "",

            state:
              statusState,

            completed:
              Boolean(
                rawStatus?.type?.completed
              ),

            description:
              rawStatus?.type
                ?.description ??
              "",

            detail:
              rawStatus?.type?.detail ??
              "",

            shortDetail:
              rawStatus?.type
                ?.shortDetail ??
              "",
          },
        },

        venue: {
          fullName:
            competition?.venue
              ?.fullName ??
            competition?.venue
              ?.address ??
            "",
        },
      },
    ],

    league: {
      id: leagueId,

      name:
        event.league?.name ??
        getLeagueName(leagueId),

      abbreviation:
        leagueId,

      logo:
        event.league?.logo ??
        "",
    },

    season: {
      name:
        event.season?.displayName ??
        event.season?.name ??
        "",

      year:
        event.season?.year ??
        new Date(date).getFullYear(),
    },
  };
}

// =====================================================
// LEAGUE NAME
// =====================================================

function getLeagueName(
  leagueId: string
) {
  return (
    ALL_LEAGUES.find(
      (league) =>
        league.id === leagueId
    )?.name ??
    "Football"
  );
}

// =====================================================
// GET MATCHES
// =====================================================

export async function getMatches(
  league: string,
  date?: string
): Promise<ApiEvent[]> {
  const data =
    await apiRequest(
      league,
      date
    );

  return (
    data.events ?? []
  ).map(
    (event: any) =>
      normalizeFixture(
        event,
        league
      )
  );
}

// =====================================================
// GET ALL MATCHES
// =====================================================

export async function getAllMatches(
  date?: string
): Promise<ApiEvent[]> {
  const results =
    await Promise.all(
      ALL_LEAGUES.map(
        async (league) => {
          try {
            return await getMatches(
              league.id,
              date
            );
          } catch (error) {
            console.error(
              `Failed to load ${league.name}`,
              error
            );

            return [];
          }
        }
      )
    );

  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
}

// =====================================================
// DATE FILTERS
// =====================================================

export function getTodayMatches() {
  return getAllMatches(
    formatDate()
  );
}

export function getYesterdayMatches() {
  return getAllMatches(
    dateWithOffset(-1)
  );
}

export function getTomorrowMatches() {
  return getAllMatches(
    dateWithOffset(1)
  );
}

export function getMatchesByDate(
  date: Date
) {
  return getAllMatches(
    formatDate(date)
  );
}

// =====================================================
// LIVE MATCHES
// =====================================================

export async function getLiveMatches(): Promise<
  ApiEvent[]
> {
  const today =
    formatDate();

  const matches =
    await getAllMatches(
      today
    );

  return matches.filter(
    (match) =>
      isMatchLive(match)
  );
}

// =====================================================
// MATCH STATUS
// =====================================================

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

  if (
    status.state === "in"
  ) {
    return (
      status.detail ??
      status.description ??
      "مباشر"
    );
  }

  return "لم تبدأ";
}

// =====================================================
// LIVE CHECK
// =====================================================

export function isMatchLive(
  match: ApiEvent
) {
  return (
    match.competitions?.[0]
      ?.status?.type?.state ===
    "in"
  );
}

// =====================================================
// TEAMS
// =====================================================

export function getMatchTeams(
  match: ApiEvent
) {
  const competitors =
    match.competitions?.[0]
      ?.competitors ?? [];

  return {
    home:
      competitors.find(
        (team) =>
          team.homeAway === "home"
      ),

    away:
      competitors.find(
        (team) =>
          team.homeAway === "away"
      ),
  };
}

// =====================================================
// SCORE
// =====================================================

export function getMatchScore(
  match: ApiEvent
) {
  const {
    home,
    away,
  } =
    getMatchTeams(match);

  return {
    home:
      home?.score ?? "0",

    away:
      away?.score ?? "0",
  };
}

// =====================================================
// MATCH DETAILS
// =====================================================

export async function getMatchDetails(
  league: string,
  matchId: string
): Promise<ApiEvent | null> {
  try {
    const matches =
      await getMatches(
        league
      );

    return (
      matches.find(
        (match) =>
          match.id ===
          matchId
      ) ?? null
    );
  } catch (error) {
    console.error(
      "Failed to load match details:",
      error
    );

    return null;
  }
}

// =====================================================
// SCORE DETAILS
// =====================================================

export async function getMatchScoreDetails(
  matchId: string,
  league: string
) {
  return getMatchDetails(
    league,
    matchId
  );
}

// =====================================================
// NEWS
// =====================================================

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

export async function getNews(): Promise<
  NewsArticle[]
> {
  return [];
}

