import React from "react";

const LatestEarnings = () => {
  // Latest earnings data
  const earningsData = [
    {
      name: "Joel Smith",
      bounty: "bounty A",
      amount: "400 USDT",
      imgSrc:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Emily Johnson",
      bounty: "bounty B",
      amount: "350 USDT",
      imgSrc:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Michael Lee",
      bounty: "bounty C",
      amount: "300 USDT",
      imgSrc:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      name: "Sophia Williams",
      bounty: "bounty D",
      amount: "250 USDT",
      imgSrc:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ];

  return (
    <div className="max-w-[100vw] lg:w-[38%] bg-white rounded-lg shadow-sm shadow-[#e7e7e7] px-7 py-6">
      {/* Title */}
      <h1 className="text-lg text-gray-900 font-bold">Latest Earnings</h1>

      {/* Earnings List */}
      <div className="mt-6 flex flex-col gap-5">
        {earningsData.map((earning, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 mb-3"
          >
            {/* Profile Section */}
            <div className="flex items-center gap-4 flex-grow">
              <img
                className="w-11 h-11 rounded-full object-cover shadow-sm"
                src={earning.imgSrc}
                alt={`${earning.name}'s avatar`}
              />
              <div>
                <h1 className="text-gray-800 font-medium text-[16px]">
                  {earning.name}
                </h1>
                <h2 className="text-gray-500 text-sm font-medium">
                  {earning.bounty}
                </h2>
              </div>
            </div>

            {/* Earning Amount */}
            <div className="px-3 py-[6px] bg-[#EFFFF1] text-[#2FCC71] text-[16px] font-medium rounded-md">
              {earning.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestEarnings;
