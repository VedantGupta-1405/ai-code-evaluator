"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"overview" | "problems" | "students">("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/webhook/teacher-dashboard`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const text = await res.text();
        let json = JSON.parse(text);
        if (Array.isArray(json)) json = json[0];
        setData(json);
      } catch (err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#00b8a3";
    if (score >= 5) return "#ffc01e";
    return "#ef4743";
  };

  const getStatusColor = (status: string) => {
    if (status === "Excellent") return "#00b8a3";
    if (status === "Good") return "#00b8a3";
    if (status === "Average") return "#ffc01e";
    return "#ef4743";
  };

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #eff1f6; font-family: 'Outfit', sans-serif; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6b6b", fontFamily: "Outfit, sans-serif" }}>
        Loading dashboard...
      </div>
    </>
  );

  const meta = data?.meta || {};
  const topPerformer = data?.topPerformer || null;
  const leaderboard = data?.leaderboard || [];
  const problemStats = data?.problemStats || [];

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

        .nav-logo { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 16px; color: #ffa116; text-decoration: none; }
        .nav-logo span { color: #eff1f6; }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link { padding: 4px 12px; border-radius: 4px; font-size: 13px; color: #eff1f6; text-decoration: none; transition: background 0.15s; }
        .nav-link:hover { background: #2a2a2a; }
        .nav-link.active { color: #ffa116; }

        .page-wrap { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }

        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
        .page-title { font-size: 24px; font-weight: 700; color: #eff1f6; margin-bottom: 4px; }
        .page-subtitle { font-size: 14px; color: #6b6b6b; }

        .section-tabs { display: flex; gap: 4px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 3px; }
        .section-tab { padding: 5px 16px; border-radius: 5px; font-size: 13px; font-weight: 500; cursor: pointer; color: #6b6b6b; transition: all 0.15s; }
        .section-tab.active { background: #2a2a2a; color: #eff1f6; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }

        .stat-card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; padding: 18px; transition: border-color 0.2s; }
        .stat-card:hover { border-color: #3a3a3a; }

        .stat-card-label { font-size: 12px; color: #6b6b6b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
        .stat-card-value { font-size: 28px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #eff1f6; margin-bottom: 4px; }
        .stat-card-sub { font-size: 12px; color: #4a4a4a; }

        .top-performer-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #1f1800 100%);
          border: 1px solid #ffa11630;
          border-radius: 10px;
          padding: 20px 24px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tp-left { display: flex; align-items: center; gap: 14px; }

        .tp-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffa11620;
          border: 2px solid #ffa11640;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #ffa116;
          text-transform: uppercase;
        }

        .tp-badge { font-size: 11px; color: #ffa116; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
        .tp-name { font-size: 18px; font-weight: 700; color: #eff1f6; text-transform: capitalize; }
        .tp-sub { font-size: 13px; color: #6b6b6b; margin-top: 2px; }
        .tp-score { font-family: 'JetBrains Mono', monospace; font-size: 36px; font-weight: 700; color: #ffa116; }
        .tp-score span { font-size: 16px; color: #6b6b6b; }

        .section-title { font-size: 15px; font-weight: 600; color: #eff1f6; margin-bottom: 12px; }

        .table-wrap { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; overflow: hidden; margin-bottom: 24px; }

        .table-head-students { display: grid; grid-template-columns: 48px 1fr 80px 100px 100px 100px; padding: 10px 16px; border-bottom: 1px solid #2a2a2a; background: #111; }
        .table-row-students { display: grid; grid-template-columns: 48px 1fr 80px 100px 100px 100px; padding: 12px 16px; border-bottom: 1px solid #1f1f1f; align-items: center; transition: background 0.1s; }
        .table-row-students:hover { background: #1f1f1f; }
        .table-row-students:last-child { border-bottom: none; }

        .table-head-problems { display: grid; grid-template-columns: 1fr 80px 100px 90px; padding: 10px 16px; border-bottom: 1px solid #2a2a2a; background: #111; }
        .table-row-problems { display: grid; grid-template-columns: 1fr 80px 100px 90px; padding: 12px 16px; border-bottom: 1px solid #1f1f1f; align-items: center; transition: background 0.1s; }
        .table-row-problems:hover { background: #1f1f1f; }
        .table-row-problems:last-child { border-bottom: none; }

        .th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #4a4a4a; }

        .rank-cell { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #6b6b6b; }

        .name-cell { display: flex; align-items: center; gap: 10px; }
        .avatar { width: 26px; height: 26px; border-radius: 50%; background: #2a2a2a; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #ffa116; text-transform: uppercase; flex-shrink: 0; }
        .student-name { font-size: 14px; font-weight: 500; color: #eff1f6; text-transform: capitalize; }

        .mono-cell { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #6b6b6b; }

        .score-cell { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; }

        .status-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }

        .diff-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 500; }
        .diff-easy { color: #00b8a3; background: #00b8a315; }
        .diff-medium { color: #ffc01e; background: #ffc01e15; }
        .diff-hard { color: #ef4743; background: #ef474315; }

        .problem-name { font-size: 14px; color: #eff1f6; text-transform: capitalize; font-weight: 500; }

        .empty-state { text-align: center; padding: 50px; color: #3a3a3a; font-size: 14px; }

        .progress-bar-wrap { width: 60px; height: 3px; background: #2a2a2a; border-radius: 2px; overflow: hidden; display: inline-block; vertical-align: middle; margin-left: 6px; }
        .progress-bar-fill { height: 100%; border-radius: 2px; }
      `}</style>

      <nav className="navbar">
        <a href="/" className="nav-logo">{"<"}code<span>{"Eval/>"}</span></a>
        <div className="nav-links">
          <a href="/" className="nav-link">Problems</a>
          <a href="/leaderboard" className="nav-link">Leaderboard</a>
          <a href="/teacher" className="nav-link active">Dashboard</a>
        </div>
        <div style={{ width: 80 }} />
      </nav>

      <div className="page-wrap">
        <div className="page-header">
          <div>
            <div className="page-title">Teacher Dashboard</div>
            <div className="page-subtitle">Class performance overview & analytics</div>
          </div>
          <div className="section-tabs">
            {(["overview", "problems", "students"] as const).map(s => (
              <div
                key={s}
                className={`section-tab ${activeSection === s ? "active" : ""}`}
                onClick={() => setActiveSection(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid">
          {[
            { label: "Total Students", value: meta.totalStudents ?? 0, sub: "Enrolled" },
            { label: "Avg Score", value: meta.avgScore ?? 0, sub: "Out of 10" },
            { label: "Submissions", value: meta.totalSubmissions ?? 0, sub: "Total" },
            { label: "Problems", value: problemStats.length, sub: "Attempted" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* TOP PERFORMER */}
        {topPerformer && (
          <div className="top-performer-card">
            <div className="tp-left">
              <div className="tp-avatar">{topPerformer.student_name?.[0] || "?"}</div>
              <div>
                <div className="tp-badge">🏆 Top Performer</div>
                <div className="tp-name">{topPerformer.student_name}</div>
                <div className="tp-sub">{topPerformer.submissions} submissions · {topPerformer.status}</div>
              </div>
            </div>
            <div className="tp-score">{topPerformer.avgScore}<span>/10</span></div>
          </div>
        )}

        {/* OVERVIEW / STUDENTS TABLE */}
        {(activeSection === "overview" || activeSection === "students") && leaderboard.length > 0 && (
          <div>
            <div className="section-title">Student Rankings</div>
            <div className="table-wrap">
              <div className="table-head-students">
                <div className="th">#</div>
                <div className="th">Student</div>
                <div className="th">Subs</div>
                <div className="th">Avg Score</div>
                <div className="th">Problems</div>
                <div className="th">Status</div>
              </div>
              {leaderboard.map((item: any, i: number) => (
                <div key={i} className="table-row-students">
                  <div className="rank-cell">{item.rank}</div>
                  <div className="name-cell">
                    <div className="avatar">{item.student_name?.[0] || "?"}</div>
                    <div className="student-name">{item.student_name}</div>
                  </div>
                  <div className="mono-cell">{item.submissions}</div>
                  <div className="score-cell" style={{ color: getScoreColor(item.avgScore) }}>
                    {item.avgScore}
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${item.avgScore * 10}%`, background: getScoreColor(item.avgScore) }} />
                    </div>
                  </div>
                  <div className="mono-cell">{item.problemsSolved}</div>
                  <div>
                    <span className="status-pill" style={{ color: getStatusColor(item.status), background: `${getStatusColor(item.status)}15` }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROBLEMS TABLE */}
        {(activeSection === "overview" || activeSection === "problems") && problemStats.length > 0 && (
          <div>
            <div className="section-title">Problem Analytics</div>
            <div className="table-wrap">
              <div className="table-head-problems">
                <div className="th">Problem</div>
                <div className="th">Attempts</div>
                <div className="th">Avg Score</div>
                <div className="th">Difficulty</div>
              </div>
              {problemStats.map((p: any, i: number) => (
                <div key={i} className="table-row-problems">
                  <div className="problem-name">{p.problem}</div>
                  <div className="mono-cell">{p.attempts}</div>
                  <div className="score-cell" style={{ color: getScoreColor(p.avgScore) }}>{p.avgScore}</div>
                  <div>
                    <span className={`diff-pill diff-${p.difficulty?.toLowerCase()}`}>{p.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && leaderboard.length === 0 && (
          <div className="empty-state">No submissions yet. Students need to submit code first.</div>
        )}
      </div>
    </>
  );
}