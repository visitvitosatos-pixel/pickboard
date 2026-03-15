import { NextRequest, NextResponse } from "next/server";

const FOOTBALL_DATA_API_BASE = "https://api.football-data.org/v4";
const MOSCOW_TIME_ZONE = "Europe/Moscow";

// Лиги, с которыми реально работаем в продукте.
// Их потом можно вынести в community settings / admin config.
const SUPPORTED_COMPETITIONS = [
  { code: "PL", name: "Premier League" },
  { code: "PD", name: "La Liga" },
  { code: "SA", name: "Serie A" },
  { code: "BL1", name: "Bundesliga" },
  { code: "FL1", name: "Ligue 1" },
  { code: "PPL", name: "Primeira Liga" },
  { code: "CL", name: "UEFA Champions League" },
  { code: "ELC", name: "Championship" },
] as const;

// Дата YYYY-MM-DD по Москве
function getMoscowDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MOSCOW_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function addDaysToDateString(dateString: string, days: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() + days);

  const nextYear = utcDate.getUTCFullYear();
  const nextMonth = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(utcDate.getUTCDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function resolveTargetDate(day: string) {
  const todayMoscow = getMoscowDateString();

  if (day === "tomorrow") {
    return addDaysToDateString(todayMoscow, 1);
  }

  return todayMoscow;
}

// Только полезные для выбора матча статусы
function isUsefulMatchStatus(status: string) {
  return status === "SCHEDULED" || status === "TIMED";
}

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  competition?: {
    name?: string;
  };
  homeTeam?: {
    name?: string;
  };
  awayTeam?: {
    name?: string;
  };
};

async function fetchCompetitionMatches(params: {
  apiKey: string;
  competitionCode: string;
  dateFrom: string;
  dateTo: string;
}) {
  const url =
    `${FOOTBALL_DATA_API_BASE}/competitions/${params.competitionCode}/matches` +
    `?dateFrom=${params.dateFrom}&dateTo=${params.dateTo}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": params.apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Competition ${params.competitionCode} failed with ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();
  return Array.isArray(data.matches) ? (data.matches as FootballDataMatch[]) : [];
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "FOOTBALL_DATA_API_KEY is missing in environment variables",
      },
      { status: 500 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const day = searchParams.get("day") ?? "today";

  const targetDate = resolveTargetDate(day);
  const dateFrom = targetDate;
  const dateTo = targetDate;

  try {
    const settledResponses = await Promise.allSettled(
      SUPPORTED_COMPETITIONS.map((competition) =>
        fetchCompetitionMatches({
          apiKey,
          competitionCode: competition.code,
          dateFrom,
          dateTo,
        }),
      ),
    );

    const matches = settledResponses
      .flatMap((result) => {
        if (result.status === "fulfilled") {
          return result.value;
        }

        return [];
      })
      .filter((match) => isUsefulMatchStatus(match.status))
      .map((match) => ({
        id: match.id,
        competition: match.competition?.name ?? "Неизвестный турнир",
        utcDate: match.utcDate,
        status: match.status,
        homeTeam: match.homeTeam?.name ?? "Unknown Home Team",
        awayTeam: match.awayTeam?.name ?? "Unknown Away Team",
      }))
      .sort(
        (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
      );

    const failedCompetitions = settledResponses
      .map((result, index) => ({
        result,
        competition: SUPPORTED_COMPETITIONS[index],
      }))
      .filter((item) => item.result.status === "rejected")
      .map((item) => item.competition.code);

    return NextResponse.json({
      ok: true,
      day,
      timeZone: MOSCOW_TIME_ZONE,
      dateFrom,
      dateTo,
      supportedCompetitions: SUPPORTED_COMPETITIONS.map((item) => item.code),
      failedCompetitions,
      count: matches.length,
      matches,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected server error while loading matches",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}