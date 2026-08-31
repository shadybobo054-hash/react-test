
import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import News from "./pages/News";
import Transfers from "./pages/Transfers";
import MatchDetails from "./pages/MatchDetails";

type Page =
  | "home"
  | "matches"
  | "news"
  | "transfers"
  | "details";

function App() {
  const [page, setPage] =
    useState<Page>("home");

  const [selectedMatchId, setSelectedMatchId] =
    useState<string | null>(null);

  const navigate = (newPage: string) => {
    if (
      newPage === "matches" ||
      newPage === "news" ||
      newPage === "transfers" ||
      newPage === "home"
    ) {
      setPage(newPage);
      return;
    }

    setPage("home");
  };

  const openMatchDetails = (id: string) => {
    setSelectedMatchId(id);
    setPage("details");
  };

  return (
    <div className="app">
      <Navbar navigate={navigate} />

      {page === "home" && (
        <Home />
      )}

      {page === "matches" && (
        <Matches />
      )}

      {page === "news" && (
        <News />
      )}

      {page === "transfers" && (
        <Transfers />
      )}

      {page === "details" && (
        <MatchDetails />
      )}
    </div>
  );
}

export default App;

