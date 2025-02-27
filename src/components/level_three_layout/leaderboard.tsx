import React from "react";

const Leaderboard = () => {
  // Leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "Suraj Singh",
      location: "India",
      rewards: "1300 USDT",
      imgSrc:
        "https://plus.unsplash.com/premium_photo-1688740375397-34605b6abe48?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      rank: 2,
      name: "Priya Sharma",
      location: "USA",
      rewards: "1100 USDT",
      imgSrc:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      rank: 3,
      name: "Rahul Verma",
      location: "UK",
      rewards: "1000 USDT",
      imgSrc:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      rank: 4,
      name: "Aisha Khan",
      location: "Canada",
      rewards: "900 USDT",
      imgSrc:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ];

  return (
    <div className="max-w-[100vw] lg:w-[62%] rounded-lg shadow-sm shadow-[#e7e7e7] bg-white px-7 md:px-9 py-6">
      {/* Title */}
      <h1 className="text-lg text-gray-900 font-bold">Leaderboard</h1>

      {/* Leaderboard Entries */}
      <div className="mt-6 flex flex-col gap-4">
        {leaderboardData.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 md:gap-7 mb-3"
          >
            {/* Rank */}
            <div className="w-[22px] h-[22px] bg-[#2fcc71] rounded flex justify-center items-center text-white">
              {entry.rank}
            </div>

            {/* Profile*/}
            <div className="flex items-center gap-4 flex-grow">
              <img
                className="w-11 h-11 rounded-full object-cover shadow-sm"
                src={entry.imgSrc}
                alt={`${entry.name}`}
              />
              <div>
                <h1 className="text-gray-800 font-medium text-[16px]">
                  {entry.name}
                </h1>
                <h2 className="text-gray-500 text-sm font-medium">
                  {entry.location}
                </h2>
              </div>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-[6px] md:gap-3">
              <img
                src="/images/leaderboard_icon.png"
                alt="leaderboard_icon"
                className="w-6 h-6"
              />
              <div className="flex flex-col items-center gap-[6px]">
                <h1 className="text-[#2fcc71] font-medium text-[16px] leading-3">
                  {entry.rewards}
                </h1>
                <h2 className="text-gray-500 text-[13.5px] font-medium">Reward</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
