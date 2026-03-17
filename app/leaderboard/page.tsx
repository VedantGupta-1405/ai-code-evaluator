"use client";

import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
  try {
    const res = await fetch(
      "https://enterally-unshedding-raelyn.ngrok-free.dev/webhook/leaderboard",
      { cache: "no-store" }
    );
    } catch (err) {
      console.error(err);
      alert("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const topThree = data.slice(0, 3);
  const rest = data.slice(3);

  const weakStudents = [...data]
    .sort((a, b) => a.avg_score - b.avg_score)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">

      {/* HEADER */}
      <div className="w-full border-b border-gray-800 px-8 py-5 flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">Leaderboard</h1>
        <span className="text-sm text-gray-400">Top Performers</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* PODIUM */}
        {!loading && topThree.length > 0 && (
          <div className="flex justify-center items-end gap-6 mb-12">

            {/* SECOND */}
            {topThree[1] && (
              <div className="flex flex-col items-center">
                <div className="bg-[#15171c] border border-gray-600 rounded-xl px-4 py-3 text-center w-28">
                  <p className="text-xs text-gray-400 mb-1">2</p>
                  <p className="font-medium capitalize">
                    {topThree[1].student}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {topThree[1].avg_score}
                  </p>
                </div>
                <div className="h-20 w-20 bg-gray-600 mt-2 rounded-t-lg" />
              </div>
            )}

            {/* FIRST */}
            {topThree[0] && (
              <div className="flex flex-col items-center">
                <div className="bg-[#15171c] border border-green-600 rounded-xl px-6 py-4 text-center w-32 shadow-lg shadow-green-900/20">
                  <p className="text-xs text-green-400 mb-1">1</p>
                  <p className="font-semibold text-lg capitalize">
                    {topThree[0].student}
                  </p>
                  <p className="text-green-400 text-xl">
                    {topThree[0].avg_score}
                  </p>
                </div>
                <div className="h-28 w-24 bg-green-700 mt-2 rounded-t-lg" />
              </div>
            )}

            {/* THIRD */}
            {topThree[2] && (
              <div className="flex flex-col items-center">
                <div className="bg-[#15171c] border border-gray-600 rounded-xl px-4 py-3 text-center w-28">
                  <p className="text-xs text-gray-400 mb-1">3</p>
                  <p className="font-medium capitalize">
                    {topThree[2].student}
                  </p>
                  <p className="text-orange-400 text-sm">
                    {topThree[2].avg_score}
                  </p>
                </div>
                <div className="h-16 w-20 bg-gray-500 mt-2 rounded-t-lg" />
              </div>
            )}

          </div>
        )}

        {/* TABLE */}
        <div className="bg-[#15171c] border border-gray-800 rounded-xl shadow-md mb-10">

          <div className="grid grid-cols-3 px-6 py-4 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
            <div>Rank</div>
            <div>Student</div>
            <div className="text-right">Score</div>
          </div>

          {loading && (
            <div className="p-6 text-center text-gray-400">
              Loading...
            </div>
          )}

          {!loading && rest.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 px-6 py-4 items-center border-b border-gray-800 hover:bg-[#1a1d23] transition"
            >
              <div className="text-sm text-gray-400">
                #{index + 4}
              </div>

              <div className="font-medium text-gray-200 capitalize">
                {item.student}
              </div>

              <div className="text-right font-semibold text-green-400">
                {item.avg_score}
              </div>
            </div>
          ))}

        </div>

        {/* WEAK STUDENTS */}
        {!loading && weakStudents.length > 0 && (
          <div>
            <h2 className="text-sm text-gray-400 mb-4">
              Needs Attention
            </h2>

            <div className="bg-[#15171c] border border-gray-800 rounded-xl">
              {weakStudents.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-6 py-4 border-b border-gray-800"
                >
                  <div className="capitalize text-gray-300">
                    {item.student}
                  </div>

                  <div className="text-red-400 font-semibold">
                    {item.avg_score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}