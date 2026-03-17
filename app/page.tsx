"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    student_name: "",
    roll: "",
    problem: "",
    code: "",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5678/webhook/submit-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);

      setForm({
        student_name: "",
        roll: "",
        problem: "",
        code: "",
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">

      {/* HEADER */}
      <div className="w-full border-b border-gray-800 px-6 py-4 flex justify-between items-center bg-[#0f1117]">
        <h1 className="text-lg font-semibold">AI Code Evaluator</h1>
        <span className="text-sm text-gray-400">LeetCode Style</span>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center px-4 py-8">

        <div className="w-full max-w-4xl">

          {/* INPUT SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <input
              value={form.student_name}
              placeholder="Name"
              className="input-box"
              onChange={(e) =>
                setForm({ ...form, student_name: e.target.value })
              }
            />

            <input
              value={form.roll}
              placeholder="Roll"
              className="input-box"
              onChange={(e) =>
                setForm({ ...form, roll: e.target.value })
              }
            />

            <input
              value={form.problem}
              placeholder="Problem"
              className="input-box"
              onChange={(e) =>
                setForm({ ...form, problem: e.target.value })
              }
            />
          </div>

          {/* CODE EDITOR */}
          <div className="editor-container">
            <div className="editor-header">
              Code Editor
            </div>

            <textarea
              value={form.code}
              placeholder="// Write your code here..."
              className="editor-area"
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="run-btn"
          >
            {loading ? "Running..." : "Run Code"}
          </button>

          {/* RESULT */}
          {result && (
            <div className="result-card">
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-300 font-medium">Result</h2>

                <div
                  className={`score-badge
                  ${
                    result.score >= 8
                      ? "bg-green-600"
                      : result.score >= 5
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {result.score}/10
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {result.feedback}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}