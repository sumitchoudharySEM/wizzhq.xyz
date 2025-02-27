"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/points/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const data = await response.json();

        // If the authenticated user is in the top 5, display all 5 entries otherwise top 4 and the auth user
        // and if the authuser returns null, display top 5
        if (data.isAuthUserInTop5) {
          setLeaderboardEntries(data.topUsers);
        } else {
          const entries = data.authUser
            ? [...data.topUsers.slice(0, 4), data.authUser]
            : data.topUsers;
          setLeaderboardEntries(entries);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching leaderboard", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading leaderboard...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );

  return (
    <div>
      {/* Leaderboard Entries */}
      <div className="mt-6 flex flex-col gap-4">
        {leaderboardEntries.map((entry, index) => (
          <React.Fragment key={entry.user_id}>
            <div className="flex items-center justify-between gap-3 md:gap-7 mb-3 md:mx-16 md:mt-2">
              <div className="flex items-center gap-5 md:gap-24">
                {/* Rank */}
                <div className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] bg-[#2fcc71] rounded flex justify-center items-center text-white text-sm md:text-base">
                  {entry.position}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4">
                  <img
                    className="w-11 h-11 rounded-full object-cover shadow-sm"
                    src={entry.image}
                    alt={`${entry.name}`}
                  />
                  <div className="max-w-[150px] md:max-w-[200px]">
                    <h1 className="text-gray-800 font-medium text-base md:text-overflow-hidden text-overflow-ellipsis line-clamp-1">
                      {entry.name}
                    </h1>
                    <h2 className="text-gray-500 text-xs md:text-sm font-medium overflow-hidden text-overflow-ellipsis line-clamp-1">
                      @{entry.username}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="flex items-center gap-[6px] md:gap-3">
                <img
                  src="/images/leaderboard_icon.png"
                  alt="leaderboard_icon"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                <div className="flex flex-col items-center gap-[6px] md:gap-0">
                  <h1 className="text-[#2fcc71] font-medium text-lg leading-3 md:text-3xl">
                    {entry.points}
                  </h1>
                  <h2 className="text-gray-500 text-xs md:text-base font-medium">
                    Points
                  </h2>
                </div>
              </div>
            </div>

            {/* Horizontal Line */}
            {index < leaderboardEntries.length - 1 && (
              <hr className="border-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Page;