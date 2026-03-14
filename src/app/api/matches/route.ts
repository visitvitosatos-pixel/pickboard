import { NextResponse } from "next/server";

const FOOTBALL_DATA_API_URL = "https://api.football-data.org/v4/matches";

function formatDateToIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "FOOTBALL_DATA_API_KEY is missing in .env.local",
      },
      { status: 500 },
    );
  }

  const today = new Date();
  const dateFrom = formatDateToIso(addDays(today, -1));
  const dateTo = formatDateToIso(addDays(today, 1));

  const requestUrl = `${FOOTBALL_DATA_API_URL}?dateFrom=${dateFrom}&dateTo=${dateTo}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "X-Auth-Token": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          ok: false,
          error: "Football Data API request failed",
          status: response.status,
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    const matches = Array.isArray(data.matches)
      ? data.matches.map((match: any) => ({
          id: match.id,
          competition: match.competition?.name ?? "Неизвестный турнир",
          utcDate: match.utcDate,
          status: match.status,
          homeTeam: match.homeTeam?.name ?? "Unknown Home Team",
          awayTeam: match.awayTeam?.name ?? "Unknown Away Team",
        }))
      : [];

    return NextResponse.json({
      ok: true,
      dateFrom,
      dateTo,
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