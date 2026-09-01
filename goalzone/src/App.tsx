import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import News from "./pages/News";
import Transfers from "./pages/Transfers";

type Page = "home" | "matches" | "news" | "transfers";

function App() {
  const [page, setPage] = useState<Page>("home");

  const navigate = (newPage: string) => {
    if (
      newPage === "home" ||
      newPage === "matches" ||
      newPage === "news" ||
      newPage === "transfers"
    ) {
      setPage(newPage);
    }
  };

  return (
    <div className="app">
      <Navbar navigate={navigate} />
      {page === "home" && <Home />}
      {page === "matches" && <Matches />}
      {page === "news" && <News />}
      {page === "transfers" && <Transfers />}
    </div>
  );
}

export default App;