import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import News from "./pages/News";
import Transfers from "./pages/Transfers";
import Live from "./pages/Live";
import MatchDetails from "./pages/MatchDetails";
import type { ApiEvent } from "./api/footballApi";
type Page="home"|"matches"|"live"|"news"|"transfers"|"matchDetails";
function App(){
  const [page,setPage]=useState<Page>("home");
  const [selectedMatch,setSelectedMatch]=useState<ApiEvent|null>(null);
  const navigate=(newPage:Page)=>{
    setPage(newPage);
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const openMatchDetails=(match:ApiEvent)=>{
    setSelectedMatch(match);
    setPage("matchDetails");
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const backFromDetails=()=>{
    setPage("live");
    setSelectedMatch(null);
  };
  return(
    <div className="app">
      <Navbar navigate={navigate} currentPage={page==="matchDetails"?"live":page}/>
      {page==="home"&&<Home/>}
      {page==="matches"&&<Matches onDetails={openMatchDetails}/>}
      {page==="live"&&<Live onDetails={openMatchDetails}/>}
      {page==="news"&&<News/>}
      {page==="transfers"&&<Transfers/>}
      {page==="matchDetails"&&selectedMatch&&(
        <MatchDetails match={selectedMatch} onBack={backFromDetails}/>
      )}
    </div>
  );
}
export default App;