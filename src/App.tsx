
import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Live from "./pages/Live";
import Transfers from "./pages/Transfers";
import News from "./pages/News";
import MatchDetails from "./pages/MatchDetails";

import type { ApiEvent } from "./api/footballApi";

type Page =
  | "home"
  | "matches"
  | "live"
  | "transfers"
  | "news"
  | "matchDetails";

function App() {
  const [page, setPage] = useState<Page>("home");

  const [selectedMatch, setSelectedMatch] =
    useState<ApiEvent | null>(null);

  const [previousPage, setPreviousPage] =
    useState<"matches" | "live">("live");

  const navigate = (newPage: Page) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openMatchDetails = (
    match: ApiEvent,
    from: "matches" | "live"
  ) => {
    setSelectedMatch(match);
    setPreviousPage(from);
    setPage("matchDetails");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const backFromDetails = () => {
    setPage(previousPage);
    setSelectedMatch(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      <Navbar
        navigate={navigate}
        currentPage={
          page === "matchDetails"
            ? previousPage
            : page
        }
      />

      {page === "home" && <Home />}

      {page === "matches" && (
        <Matches
          onDetails={(match) =>
            openMatchDetails(match, "matches")
          }
        />
      )}

      {page === "live" && (
        <Live
          onDetails={(match) =>
            openMatchDetails(match, "live")
          }
        />
      )}

      {page === "transfers" && <Transfers />}

      {page === "news" && <News />}

      {page === "matchDetails" &&
        selectedMatch && (
          <MatchDetails
            match={selectedMatch}
            onBack={backFromDetails}
          />
        )}
    </div>
  );
}

export default App;

