import { useCallback, useEffect, useState } from "react";
import type { Game } from "../types/game";
import { fetchGames } from "../services/gameService";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchGames();
      setGames(data);
    } catch {
      setError("Unable to connect to the free game database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGames();
  }, [loadGames]);

  return { games, loading, error, loadGames };
}