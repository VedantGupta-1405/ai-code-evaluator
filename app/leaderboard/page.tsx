"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/webhook/leaderboard`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filtered = data.filter(d =>
    d.student?.toLowerCase().includes(filter.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#00b8a3";
    if (score >= 5) return "#ffc01e";
    return "#ef4743";
  };

  const getScoreBar = (score: number) => {
    return `${(score / 10) * 100}%`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #eff1f6; font-family: 'Outfit', sans-serif; min-height: 100vh; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

        .navbar {
          height: 44px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-logo {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          font-size: 16px;
          color: #ffa116;
          text-decoration: none;
        }

        .nav-logo span { color: #eff1f6; }

        .nav-links { display: flex; align-items: center; gap: 4px; }

        .nav-link {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 13px;
          color: #eff1f6;
          text-decoration: none;
          transition: background 0.15s;
        }

        .nav-link:hover { background: #2a2a2a; }
        .nav-link.active { color: #ffa116; }

        .page-wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .page-header {
          margin-bottom: 28px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #eff1f6;
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 14px;
          color: #6b6b6b;
        }

        .top3-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }

        .top-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 20px 16px;
          text-align: center;
          position: relative;
          transition: border-color 0.2s;
        }

        .top-card:hover { border-color: #3a3a3a; }

        .top-card.rank1 {
          border-color: #ffa11640;
          background: linear-gradient(160deg, #1a1a1a 0%, #1f1800 100%);
          order: 2;
        }

        .top-card.rank2 { order: 1; }
        .top-card.rank3 { order: 3; }

        .rank-medal {
          font-size: 28px;
          margin-bottom: 10px;
          display: block;
        }

        .rank1 .rank-medal { font-size: 36px; }

        .top-name {
          font-size: 15px;
          font-weight: 600;
          color: #eff1f6;
          margin-bottom: 6px;
          text-transform: capitalize;
        }

        .top-score {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 700;
        }

        .rank1 .top-score { font-size: 28px; color: #ffa116; }

        .score-bar-wrap {
          margin-top: 10px;
          height: 3px;
          background: #2a2a2a;
          border-radius: 2px;
          overflow: hidden;
        }

        .score-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s ease;
        }

        .controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 12px;
        }

        .search-input {
          flex: 1;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          padding: 7px 14px 7px 36px;
          font-size: 13px;
          color: #eff1f6;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: border-color 0.15s;
          position: relative;
        }

        .search-input:focus { border-color: #ffa116; }
        .search-input::placeholder { color: #3a3a3a; }

        .search-wrap {
          position: relative;
          flex: 1;
          max-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #3a3a3a;
          pointer-events: none;
        }

        .count-badge {
          font-size: 13px;
          color: #6b6b6b;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          padding: 6px 14px;
          font-family: 'JetBrains Mono', monospace;
        }

        .table-wrap {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          overflow: hidden;
        }

        .table-head {
          display: grid;
          grid-template-columns: 64px 1fr 120px 120px;
          padding: 10px 16px;
          border-bottom: 1px solid #2a2a2a;
          background: #111;
        }

        .th {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #4a4a4a;
        }

        .th:last-child { text-align: right; }

        .table-row {
          display: grid;
          grid-template-columns: 64px 1fr 120px 120px;
          padding: 12px 16px;
          border-bottom: 1px solid #1f1f1f;
          align-items: center;
          transition: background 0.1s;
          cursor: default;
        }

        .table-row:hover { background: #1f1f1f; }
        .table-row:last-child { border-bottom: none; }

        .rank-cell {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #6b6b6b;
        }

        .name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #ffa116;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .student-name {
          font-size: 14px;
          font-weight: 500;
          color: #eff1f6;
          text-transform: capitalize;
        }

        .submissions-cell {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #6b6b6b;
        }

        .score-cell {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .score-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 700;
        }

        .mini-bar {
          width: 60px;
          height: 2px;
          background: #2a2a2a;
          border-radius: 1px;
          overflow: hidden;
        }

        .mini-bar-fill {
          height: 100%;
          border-radius: 1px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #3a3a3a;
          font-size: 14px;
        }

        .loading-row {
          padding: 40px;
          text-align: center;
          color: #3a3a3a;
          font-size: 13px;
        }
      `}</style>

      <nav className="navbar">
        <a href="/" className="nav-logo">{"<"}code<span>{"Eval/>"}</span></a>
        <div className="nav-links">
          <a href="/" className="nav-link">Problems</a>
          <a href="/leaderboard" className="nav-link active">Leaderboard</a>
          <a href="/teacher" className="nav-link">Dashboard</a>
        </div>
        <div style={{ width: 80 }} />
      </nav>

      <div className="page-wrap">
        <div className="page-header">
          <div className="page-title">Leaderboard</div>
          <div className="page-subtitle">{data.length} students ranked by average score</div>
        </div>

        {/* TOP 3 PODIUM */}
        {!loading && data.length >= 3 && (
          <div className="top3-grid">
            {[data[1], data[0], data[2]].map((item, i) => {
              if (!item) return null;
              const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const medals = ["🥈", "🥇", "🥉"];
              return (
                <div key={i} className={`top-card rank${realRank}`}>
                  <span className="rank-medal">{medals[i]}</span>
                  <div className="top-name">{item.student}</div>
                  <div className="top-score" style={{ color: getScoreColor(item.avg_score) }}>
                    {item.avg_score}
                  </div>
                  <div className="score-bar-wrap">
                    <div
                      className="score-bar-fill"
                      style={{ width: getScoreBar(item.avg_score), background: getScoreColor(item.avg_score) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONTROLS */}
        <div className="controls">
          <div className="search-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              placeholder="Search students..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
          <div className="count-badge">{filtered.length} results</div>
        </div>

        {/* TABLE */}
        <div className="table-wrap">
          <div className="table-head">
            <div className="th">Rank</div>
            <div className="th">Student</div>
            <div className="th">Submissions</div>
            <div className="th" style={{ textAlign: "right" }}>Avg Score</div>
          </div>

          {loading && <div className="loading-row">Loading rankings...</div>}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">No students found</div>
          )}

          {!loading && filtered.map((item, index) => (
            <div key={index} className="table-row">
              <div className="rank-cell">{getRankIcon(index + 1)}</div>
              <div className="name-cell">
                <div className="avatar">{item.student?.[0] || "?"}</div>
                <div className="student-name">{item.student}</div>
              </div>
              <div className="submissions-cell">
                {item.submissions ?? "—"} submissions
              </div>
              <div className="score-cell">
                <span className="score-text" style={{ color: getScoreColor(item.avg_score) }}>
                  {item.avg_score}
                </span>
                <div className="mini-bar">
                  <div
                    className="mini-bar-fill"
                    style={{ width: getScoreBar(item.avg_score), background: getScoreColor(item.avg_score) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}