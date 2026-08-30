export type Game = {
  id: number;
  title: string;
  thumbnail: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  short_description: string;
};

export type GameDetails = Game & {
  description?: string;
  freetogame_profile_url?: string;
  minimum_system_requirements?: {
    os?: string;
    processor?: string;
    memory?: string;
    graphics?: string;
    storage?: string;
  };
};

export type Language = "en" | "ar";

export type Theme = "dark" | "light";

export type Page =
  | "home"
  | "games"
  | "favorites"
  | "settings";