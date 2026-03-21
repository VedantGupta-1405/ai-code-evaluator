"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function Home() {
  const [form, setForm] = useState({
    student_name: "",
    roll: "",
    problem: "",
    code: "",
  });
  const [difficulty, setDifficulty] = useState("Medium");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "result">("code");

  const handleSubmit = async () => {
    if (!form.student_name || !form.roll || !form.problem || !form.code) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setActiveTab("result");
      const res = await fetch(`${API_URL}/webhook/submit-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
      setForm({ student_name: "", roll: "", problem: "", code: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Make sure the backend is running.");
      setActiveTab("code");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#00b8a3";
    if (score >= 5) return "#ffc01e";
    return "#ef4743";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Accepted";
    if (score >= 5) return "Partially Correct";
    return "Wrong Answer";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0a;
          color: #eff1f6;
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
        }

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
          padding: 0 16px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          font-size: 16px;
          color: #ffa116;
          text-decoration: none;
        }

        .nav-logo span {
          color: #eff1f6;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 13px;
          color: #eff1f6;
          text-decoration: none;
          transition: background 0.15s;
          font-weight: 400;
        }

        .nav-link:hover { background: #2a2a2a; }

        .nav-btn {
          padding: 4px 14px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: 'Outfit', sans-serif;
        }

        .nav-btn-primary {
          background: #ffa116;
          color: #1a1a1a;
        }

        .layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          height: calc(100vh - 44px);
        }

        /* LEFT PANEL */
        .left-panel {
          background: #1a1a1a;
          border-right: 1px solid #2a2a2a;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-tabs {
          display: flex;
          border-bottom: 1px solid #2a2a2a;
          padding: 0 16px;
        }

        .panel-tab {
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #6b6b6b;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .panel-tab.active {
          color: #eff1f6;
          border-bottom-color: #ffa116;
        }

        .panel-content {
          padding: 20px 16px;
          overflow-y: auto;
          flex: 1;
        }

        .problem-header {
          margin-bottom: 20px;
        }

        .problem-title {
          font-size: 18px;
          font-weight: 600;
          color: #eff1f6;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .difficulty-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .difficulty-badge {
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s;
        }

        .diff-easy { color: #00b8a3; border-color: #00b8a320; background: #00b8a310; }
        .diff-easy.active { background: #00b8a330; border-color: #00b8a3; }
        .diff-medium { color: #ffc01e; border-color: #ffc01e20; background: #ffc01e10; }
        .diff-medium.active { background: #ffc01e30; border-color: #ffc01e; }
        .diff-hard { color: #ef4743; border-color: #ef474320; background: #ef474310; }
        .diff-hard.active { background: #ef474330; border-color: #ef4743; }

        .form-section {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #6b6b6b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 14px;
          color: #eff1f6;
          font-family: 'Outfit', sans-serif;
          transition: border-color 0.15s;
          outline: none;
        }

        .form-input:focus { border-color: #ffa116; }
        .form-input::placeholder { color: #3a3a3a; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .description-box {
          background: #0f0f0f;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          padding: 14px;
          font-size: 13px;
          color: #8a8a8a;
          line-height: 1.6;
        }

        .description-box strong { color: #eff1f6; }

        /* RESULT PANEL */
        .result-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #3a3a3a;
          font-size: 14px;
          gap: 8px;
        }

        .result-empty svg { opacity: 0.3; }

        .result-card {
          background: #0f0f0f;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          overflow: hidden;
        }

        .result-header {
          padding: 16px;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .result-status {
          font-size: 18px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
        }

        .result-score-ring {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          border: 3px solid;
        }

        .result-body {
          padding: 16px;
        }

        .result-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b6b6b;
          margin-bottom: 8px;
        }

        .result-feedback {
          font-size: 13px;
          color: #abb2bf;
          line-height: 1.7;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          padding: 12px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 12px;
          color: #6b6b6b;
          font-size: 13px;
        }

        .spinner {
          width: 28px;
          height: 28px;
          border: 2px solid #2a2a2a;
          border-top-color: #ffa116;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* RIGHT PANEL - CODE EDITOR */
        .right-panel {
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
          overflow: hidden;
        }

        .editor-toolbar {
          height: 40px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
        }

        .editor-lang {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #abb2bf;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 4px;
          padding: 3px 10px;
          cursor: pointer;
        }

        .editor-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-run {
          padding: 5px 16px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: 'Outfit', sans-serif;
          background: #2a2a2a;
          color: #eff1f6;
          transition: background 0.15s;
        }

        .btn-run:hover { background: #333; }

        .btn-submit {
          padding: 5px 16px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: 'Outfit', sans-serif;
          background: #ffa116;
          color: #1a1a1a;
          transition: all 0.15s;
        }

        .btn-submit:hover { background: #ffb84d; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .code-editor-wrap {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .line-numbers {
          position: absolute;
          left: 0;
          top: 0;
          width: 48px;
          padding: 16px 0;
          text-align: right;
          padding-right: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #3a3a3a;
          pointer-events: none;
          user-select: none;
          background: #0a0a0a;
          border-right: 1px solid #1a1a1a;
          height: 100%;
          overflow: hidden;
        }

        .code-textarea {
          position: absolute;
          left: 48px;
          top: 0;
          right: 0;
          bottom: 0;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          padding: 16px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #abb2bf;
          caret-color: #ffa116;
          tab-size: 2;
        }

        .code-textarea::placeholder { color: #2a2a2a; }

        /* BOTTOM CONSOLE */
        .console-area {
          height: 120px;
          background: #111;
          border-top: 1px solid #2a2a2a;
          display: flex;
          flex-direction: column;
        }

        .console-header {
          height: 32px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-size: 12px;
          color: #6b6b6b;
          gap: 8px;
        }

        .console-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffa116;
        }

        .console-body {
          flex: 1;
          padding: 8px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #6b6b6b;
          overflow-y: auto;
        }

        .console-ready { color: #00b8a3; }

        /* STATS BAR */
        .stats-bar {
          display: flex;
          gap: 16px;
          padding: 12px 16px;
          background: #111;
          border-top: 1px solid #2a2a2a;
          border-bottom: 1px solid #2a2a2a;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label-sm {
          font-size: 10px;
          color: #4a4a4a;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .stat-value-sm {
          font-size: 13px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          color: #eff1f6;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="nav-logo">
          {"<"}code<span>{"Eval/>"}</span>
        </a>
        <div className="nav-links">
          <a href="/" className="nav-link">Problems</a>
          <a href="/leaderboard" className="nav-link">Leaderboard</a>
          <a href="/teacher" className="nav-link">Dashboard</a>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="nav-btn nav-btn-primary">Premium</button>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="layout">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="panel-tabs">
            <div
              className={`panel-tab ${activeTab === "code" ? "active" : ""}`}
              onClick={() => setActiveTab("code")}
            >
              Description
            </div>
            <div
              className={`panel-tab ${activeTab === "result" ? "active" : ""}`}
              onClick={() => setActiveTab("result")}
            >
              Submission
            </div>
          </div>

          <div className="panel-content">
            {activeTab === "code" && (
              <>
                <div className="problem-header">
                  <div className="problem-title">Submit Your Solution</div>
                  <div className="difficulty-badges">
                    {DIFFICULTIES.map(d => (
                      <span
                        key={d}
                        className={`difficulty-badge diff-${d.toLowerCase()} ${difficulty === d ? "active" : ""}`}
                        onClick={() => setDifficulty(d)}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">Problem Title</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Two Sum, Binary Search..."
                    value={form.problem}
                    onChange={e => setForm({ ...form, problem: e.target.value })}
                  />
                </div>

                <div className="form-section">
                  <div className="form-row">
                    <div>
                      <label className="form-label">Your Name</label>
                      <input
                        className="form-input"
                        placeholder="Full name"
                        value={form.student_name}
                        onChange={e => setForm({ ...form, student_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Roll No.</label>
                      <input
                        className="form-input"
                        placeholder="e.g. 001"
                        value={form.roll}
                        onChange={e => setForm({ ...form, roll: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="description-box">
                    <strong>How it works</strong>
                    <br /><br />
                    1. Enter the problem title and your details above<br />
                    2. Write your solution in the code editor →<br />
                    3. Click <strong>Submit</strong> to get AI evaluation<br />
                    4. Receive a score out of 10 with detailed feedback
                  </div>
                </div>
              </>
            )}

            {activeTab === "result" && (
              <>
                {loading && (
                  <div className="loading-state">
                    <div className="spinner" />
                    <span>AI is evaluating your code...</span>
                  </div>
                )}

                {!loading && !result && (
                  <div className="result-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Submit your code to see results</span>
                  </div>
                )}

                {!loading && result && (
                  <div className="result-card">
                    <div className="result-header">
                      <div>
                        <div className="result-status" style={{ color: getScoreColor(result.score) }}>
                          {getScoreLabel(result.score)}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>
                          AI Evaluation Complete
                        </div>
                      </div>
                      <div
                        className="result-score-ring"
                        style={{
                          color: getScoreColor(result.score),
                          borderColor: getScoreColor(result.score),
                          background: `${getScoreColor(result.score)}15`
                        }}
                      >
                        {result.score}/10
                      </div>
                    </div>
                    <div className="result-body">
                      <div className="result-label">Feedback</div>
                      <div className="result-feedback">{result.feedback}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - CODE EDITOR */}
        <div className="right-panel">
          <div className="editor-toolbar">
            <div className="editor-lang">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Any Language
            </div>
            <div className="editor-actions">
              <button className="btn-run">Run</button>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          <div className="code-editor-wrap">
            <div className="line-numbers">
              {(form.code || "\n").split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              className="code-textarea"
              placeholder="// Write your solution here..."
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
              spellCheck={false}
              onKeyDown={e => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  const newCode = form.code.substring(0, start) + "  " + form.code.substring(end);
                  setForm({ ...form, code: newCode });
                  setTimeout(() => {
                    e.currentTarget.selectionStart = start + 2;
                    e.currentTarget.selectionEnd = start + 2;
                  }, 0);
                }
              }}
            />
          </div>

          <div className="console-area">
            <div className="console-header">
              <div className="console-dot" />
              Console
            </div>
            <div className="console-body">
              {loading && <span style={{ color: "#ffa116" }}>▶ Submitting to AI evaluator...</span>}
              {!loading && result && (
                <span className="console-ready">
                  ✓ Evaluation complete — Score: {result.score}/10
                </span>
              )}
              {!loading && !result && (
                <span>Ready. Write your solution and click Submit.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}