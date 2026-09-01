
// src/api/footballApi.ts

const BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

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

export type ApiCompetition = {
  id?: string;
  date?: string;
  competitors: ApiCompetitor[];
  status?: {
    type?: {
      state?: string;
      completed?: boolean;
      description?: string;
      detail?: string;
      shortDetail?: string;
    };
  };
  venue?: {
    fullName?: string;
  };
};

export type ApiEvent = {
  id: string;
  name: string;
  date: string;
  competitions?: ApiCompetition[];
  league?: {
    id?: string;
    name?: string;
    abbreviation?: string;
    logo?: string;
  };
};

export const LEAGUES = {
  premierLeague: "eng.1",
  laLiga: "esp.1",
  serieA: "ita.1",
  bundesliga: "ger.1",
  ligue1: "fra.1",
  championsLeague: "uefa.champions",
  europaLeague: "uefa.europa",
};

export const ALL_LEAGUES = [
  ["eng.1", "الدوري الإنجليزي"],
  ["esp.1", "الدوري الإسباني"],
  ["ita.1", "الدوري الإيطالي"],
  ["ger.1", "الدوري الألماني"],
  ["fra.1", "الدوري الفرنسي"],
  ["uefa.champions", "دوري أبطال أوروبا"],
  ["uefa.europa", "الدوري الأوروبي"],
].map(([id, name]) => ({
  id,
  name,
}));

function dateFormat(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function espnDate(date: string) {
  return date.replaceAll("-", "");
}

function normalize(
  event: any,
  leagueId: string
): ApiEvent {
  const comp = event.competitions?.[0];

  const competitors =
    comp?.competitors ?? [];

  const makeTeam = (
    item: any
  ): ApiCompetitor => ({
    id: item?.id,
    homeAway: item?.homeAway,
    score:
      item?.score !== undefined
        ? String(item.score)
        : undefined,
    team: {
      id: item?.team?.id,
      displayName:
        item?.team?.displayName ??
        "فريق",
      shortDisplayName:
        item?.team?.shortDisplayName,
      abbreviation:
        item?.team?.abbreviation,
      logo:
        item?.team?.logo ??
        item?.team?.logos?.[0]?.href ??
        "",
    },
  });

  const home = competitors.find(
    (x: any) =>
      x.homeAway === "home"
  );

  const away = competitors.find(
    (x: any) =>
      x.homeAway === "away"
  );

  return {
    id: String(event.id),

    name:
      event.name ??
      `${home?.team?.displayName} vs ${away?.team?.displayName}`,

    date:
      event.date ??
      new Date().toISOString(),

    competitions: [
      {
        id: comp?.id,
        date: event.date,
        competitors: [
          makeTeam(home),
          makeTeam(away),
        ],
        status: {
          type: {
            state:
              event.status?.type
                ?.state ?? "pre",
            completed:
              event.status?.type
                ?.completed ?? false,
            description:
              event.status?.type
                ?.description,
            detail:
              event.status?.type?.detail,
            shortDetail:
              event.status?.type
                ?.shortDetail,
          },
        },
        venue: {
          fullName:
            comp?.venue?.fullName,
        },
      },
    ],

    league: {
      id: leagueId,
      name:
        ALL_LEAGUES.find(
          x => x.id === leagueId
        )?.name ?? "Football",
      abbreviation: leagueId,
      logo:
        event.league?.logos?.[0]
          ?.href ?? "",
    },
  };
}

export async function getMatches(
  league: string,
  date = dateFormat()
): Promise<ApiEvent[]> {
  const url =
    `${BASE}/${league}/scoreboard?dates=${espnDate(
      date
    )}`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `ESPN Error ${response.status}`
    );
  }

  const data =
    await response.json();

  return (
    data.events ?? []
  ).map((event: any) =>
    normalize(event, league)
  );
}

export async function getAllMatches(
  date = dateFormat()
): Promise<ApiEvent[]> {
  const results =
    await Promise.all(
      ALL_LEAGUES.map(
        league =>
          getMatches(
            league.id,
            date
          ).catch(() => [])
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

export function getTodayMatches() {
  return getAllMatches();
}

export function getYesterdayMatches() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getAllMatches(
    dateFormat(d)
  );
}

export function getTomorrowMatches() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getAllMatches(
    dateFormat(d)
  );
}

export function getMatchesByDate(
  date: Date
) {
  return getAllMatches(
    dateFormat(date)
  );
}

export async function getLiveMatches() {
  const matches =
    await getAllMatches();

  return matches.filter(
    isMatchLive
  );
}

export function isMatchLive(
  match: ApiEvent
) {
  return (
    match.competitions?.[0]
      ?.status?.type?.state ===
    "in"
  );
}

export function getMatchStatus(
  match: ApiEvent
) {
  const status =
    match.competitions?.[0]
      ?.status?.type;

  if (!status) return "لم تبدأ";

  if (status.completed)
    return "انتهت";

  if (status.state === "in")
    return (
      status.detail ??
      status.description ??
      "مباشر"
    );

  return (
    status.description ??
    "لم تبدأ"
  );
}

export function getMatchTeams(
  match: ApiEvent
) {
  const teams =
    match.competitions?.[0]
      ?.competitors ?? [];

  return {
    home: teams.find(
      x => x.homeAway === "home"
    ),
    away: teams.find(
      x => x.homeAway === "away"
    ),
  };
}

export function getMatchScore(
  match: ApiEvent
) {
  const {
    home,
    away,
  } = getMatchTeams(match);

  return {
    home: home?.score ?? "0",
    away: away?.score ?? "0",
  };
}

export async function getMatchDetails(
  league: string,
  matchId: string
) {
  const response =
    await fetch(
      `${BASE}/${league}/summary?event=${matchId}`
    );

  if (!response.ok)
    return null;

  const data =
    await response.json();

  return data.header
    ? normalize(
        data.header,
        league
      )
    : null;
}

export async function getMatchScoreDetails(
  matchId: string,
  league: string
) {
  return getMatchDetails(
    league,
    matchId
  );
}

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

export type Transaction = {
  id: string;
  player: string;
  from: string;
  to: string;
  date: string;
  type?: string;
  image?: string;
};

export async function getNews(): Promise<
  NewsArticle[]
> {
  return [];
}

export async function getTransfers(): Promise<
  Transaction[]
> {
  return [];
}

