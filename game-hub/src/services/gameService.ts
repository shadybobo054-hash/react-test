import type { Game, GameDetails } from "../types/game";

const API_URL = "https://www.freetogame.com/api";

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch(`${API_URL}/games`);

  if (!response.ok) {
    throw new Error("Failed to load games");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid games response");
  }

  return data as Game[];
}

export async function fetchGameDetails(
  id: number
): Promise<GameDetails> {
  const response = await fetch(
    `${API_URL}/game?id=${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to load game details");
  }

  const data: unknown = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error("Invalid game details");
  }

  return data as GameDetails;
}