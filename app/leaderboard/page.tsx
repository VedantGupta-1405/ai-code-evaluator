"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/webhook/teacher-dashboard`);

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="p-6 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">

      {/* HEADER */}
      <div className="w-full border-b border-gray-800 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-white transition text-sm">← Back</a>
          <h1 className="text-xl font-semibold tracking-tight">
            Teacher Dashboard
          </h1>
        </div>
        <span className="text-sm text-gray-400">
          Overview & Analytics
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* TOP PERFORMER */}
        {data?.topPerformer && (
          <div className="mb-8 p-6 bg-[#15171c] border border-gray-800 rounded-xl">
            <p className="text-sm text-gray-400 mb-2">Top Performer</p>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold capitalize">
                  {data.topPerformer.student_name}
                </p>
                <p className="text-sm text-gray-500">
                  {data.topPerformer.submissions} submissions
                </p>
              </div>

              <div className="text-green-400 text-xl font-bold">
                {data.topPerformer.avgScore} / 10
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="stat-card">
            <p className="stat-title">Total Students</p>
            <p className="stat-value">{data?.meta?.totalStudents ?? 0}</p>
          </div>

          <div className="stat-card">
            <p className="stat-title">Average Score</p>
            <p className="stat-value">{data?.meta?.avgScore ?? 0}</p>
          </div>

          <div className="stat-card">
            <p className="stat-title">Total Submissions</p>
            <p className="stat-value">{data?.meta?.totalSubmissions ?? 0}</p>
          </div>

        </div>

        {/* PROBLEM INSIGHTS */}
        {data?.problemStats?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm text-gray-400 mb-4">Problem Insights</h2>

            <div className="bg-[#15171c] border border-gray-800 rounded-xl">
              {data.problemStats.map((p: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-6 py-4 border-b border-gray-800"
                >
                  <div className="capitalize">{p.problem}</div>

                  <div className="text-gray-400 text-sm">
                    {p.attempts} attempts
                  </div>

                  <div className="flex items-center gap-4">

                    <span
                      className={`font-semibold ${
                        p.avgScore >= 8
                          ? "text-green-400"
                          : p.avgScore >= 6
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {p.avgScore}
                    </span>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        p.difficulty === "Easy"
                          ? "bg-green-900 text-green-400"
                          : p.difficulty === "Medium"
                          ? "bg-yellow-900 text-yellow-400"
                          : "bg-red-900 text-red-400"
                      }`}
                    >
                      {p.difficulty}
                    </span>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADERBOARD TABLE */}
        {data?.leaderboard?.length > 0 && (
          <div className="bg-[#15171c] border border-gray-800 rounded-xl">

            <div className="grid grid-cols-4 px-6 py-4 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
              <div>Student</div>
              <div>Submissions</div>
              <div>Avg Score</div>
              <div className="text-right">Status</div>
            </div>

            {data.leaderboard.map((item: any) => (
              <div
                key={item.rank}
                className="grid grid-cols-4 px-6 py-4 border-b border-gray-800 hover:bg-[#1a1d23] transition"
              >
                <div className="capitalize">{item.student_name}</div>

                <div>{item.submissions} submissions</div>

                <div
                  className={`font-semibold ${
                    item.avgScore >= 9
                      ? "text-green-400"
                      : item.avgScore >= 7
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {item.avgScore}
                </div>

                <div
                  className={`text-right ${
                    item.status === "Excellent"
                      ? "text-green-500"
                      : item.status === "Good"
                      ? "text-green-400"
                      : item.status === "Average"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}