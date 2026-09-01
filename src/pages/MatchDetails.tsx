import { useEffect,useState } from "react";
import { getMatchDetails,getMatchStatus,getMatchTeams,type ApiEvent,type MatchDetails as ApiMatchDetails } from "../api/footballApi";
import "./MatchDetails.css";
type Props={
  match:ApiEvent;
  onBack:()=>void;
};
function MatchDetails({match,onBack}:Props){
  const [details,setDetails]=useState<ApiMatchDetails|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const league=match.league?.id||"eng.1";
  const load=async()=>{
    try{
      setLoading(true);
      setError("");
      const data=await getMatchDetails(league,match.id);
      if(!data)throw new Error("No data");
      setDetails(data);
    }catch(e){
      console.error(e);
      setError("فشل تحميل تفاصيل المباراة.");
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{
    load();
    const live=isLive(match);
    if(!live)return;
    const timer=setInterval(load,30000);
    return()=>clearInterval(timer);
  },[match.id,league]);
  const current=details?.event||match;
  const {home,away}=getMatchTeams(current);
  const status=getMatchStatus(current);
  return(
    <main className="match-details-page">
      <section className="details-hero">
        <button className="back-btn" onClick={onBack}>← العودة</button>
        <div className="details-league">
          {current.league?.name||"Football"}
        </div>
        <div className="details-status">
          {isLive(current)&&<i/>}
          {status}
        </div>
        <div className="details-match">
          <div className="details-team">
            <div className="details-logo">
              {home?.team.logo?<img src={home.team.logo} alt={home.team.displayName}/>:<span>⚽</span>}
            </div>
            <h2>{home?.team.displayName||"Home Team"}</h2>
            <small>{home?.team.abbreviation||"HOME"}</small>
          </div>
          <div className="details-score">
            <strong>{home?.score??"0"}</strong>
            <span>:</span>
            <strong>{away?.score??"0"}</strong>
            <small>{current.competitions?.[0]?.status?.type?.shortDetail||"MATCH"}</small>
          </div>
          <div className="details-team">
            <div className="details-logo">
              {away?.team.logo?<img src={away.team.logo} alt={away.team.displayName}/>:<span>⚽</span>}
            </div>
            <h2>{away?.team.displayName||"Away Team"}</h2>
            <small>{away?.team.abbreviation||"AWAY"}</small>
          </div>
        </div>
      </section>
      <section className="details-content">
        {loading&&(
          <div className="details-state">
            <div className="details-loader"/>
            <h3>جاري تحميل التفاصيل</h3>
            <p>نحصل على أحدث بيانات المباراة من ESPN...</p>
          </div>
        )}
        {!loading&&error&&(
          <div className="details-state">
            <div className="details-state-icon">⚠</div>
            <h3>حدث خطأ</h3>
            <p>{error}</p>
            <button onClick={load}>إعادة المحاولة</button>
          </div>
        )}
        {!loading&&!error&&details&&(
          <>
            <div className="details-grid">
              <section className="details-panel">
                <div className="panel-title">
                  <span>LIVE TIMELINE</span>
                  <h3>أحداث المباراة</h3>
                </div>
                {details.plays.length===0?(
                  <div className="empty-details">لا توجد أحداث متاحة حتى الآن.</div>
                ):(
                  <div className="timeline">
                    {details.plays.slice().reverse().map((play,index)=>(
                      <div className={`timeline-item ${play.scoringPlay?"goal":""}`} key={play.id||index}>
                        <div className="timeline-time">
                          {play.clock?.displayValue||`${play.period?.number||""}'`}
                        </div>
                        <div className="timeline-dot">
                          {play.scoringPlay?"⚽":"•"}
                        </div>
                        <div className="timeline-text">
                          <strong>{play.shortText||play.text||"Match event"}</strong>
                          {play.team?.displayName&&<small>{play.team.displayName}</small>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section className="details-panel">
                <div className="panel-title">
                  <span>MATCH INFO</span>
                  <h3>معلومات المباراة</h3>
                </div>
                <div className="info-list">
                  <div><span>🏟 الملعب</span><strong>{details.venue||"غير متاح"}</strong></div>
                  <div><span>📅 التاريخ</span><strong>{new Date(current.date).toLocaleDateString("ar-EG")}</strong></div>
                  <div><span>🕐 الوقت</span><strong>{new Date(current.date).toLocaleTimeString("ar-EG",{hour:"2-digit",minute:"2-digit"})}</strong></div>
                  <div><span>🏆 البطولة</span><strong>{current.league?.name||"Football"}</strong></div>
                  {details.attendance&&<div><span>👥 الحضور</span><strong>{details.attendance.toLocaleString()}</strong></div>}
                </div>
              </section>
            </div>
            {details.statistics.length>0&&(
              <section className="details-panel stats-panel">
                <div className="panel-title">
                  <span>MATCH STATS</span>
                  <h3>إحصائيات المباراة</h3>
                </div>
                <div className="stats-table">
                  {details.statistics.map((stat,index)=>(
                    <div className="stat-row" key={`${stat.name}-${index}`}>
                      <strong>{stat.home||"-"}</strong>
                      <span>{stat.displayName||stat.name||"Stat"}</span>
                      <strong>{stat.away||"-"}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {details.leaders.length>0&&(
              <section className="details-panel">
                <div className="panel-title">
                  <span>TOP PLAYERS</span>
                  <h3>أبرز اللاعبين</h3>
                </div>
                <div className="leaders-grid">
                  {details.leaders.slice(0,6).map((leader,index)=>(
                    <div className="leader-card" key={index}>
                      {leader.athlete?.headshot?.href&&<img src={leader.athlete.headshot.href} alt=""/>}
                      <div>
                        <strong>{leader.athlete?.displayName||leader.displayName||"Player"}</strong>
                        <small>{leader.name||"Performance"}</small>
                      </div>
                      <b>{leader.value??"-"}</b>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
function isLive(match:ApiEvent){
  return match.competitions?.[0]?.status?.type?.state==="in";
}
export default MatchDetails;