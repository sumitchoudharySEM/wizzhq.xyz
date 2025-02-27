import React, { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const Points_overview = () => {
  const [pointsData, setPointsData] = useState({
    claimed_points: 0,
    participation_points: 0,
    referral_points: 0,
    contribution_points: 0,
    totalUnclaimedPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch("/api/points/overview");
        if (!response.ok) {
          throw new Error("Failed to fetch points");
        }
        const data = await response.json();
        setPointsData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  // if (loading) {
  //   return <div className="flex justify-center items-center">Loading...</div>;
  // }

  // if (error) {
  //   return <div className="text-red-500 text-center">Error loading points data</div>;
  // }

  return (
    <div className="flex flex-col md:flex-row gap-7">
      <div className="w-full md:w-[72%] flex flex-col justify-between gap-8 md:gap-20">
        <div>
          <div className="flex flex-col gap-1 md:mt-4">
            <h1 className="font-bold md:text-2xl text-xl leading-5 text-gray-900">
              Points Overview
            </h1>
            <p className="font-normal text-base text-gray-500">
              View Your Total Points and Track Your Progress!
            </p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <img
              src="/images/leaderboard_icon.png"
              alt="leaderboard_icon"
              className="w-9 h-9 md:w-11 md:h-11"
            />
            <span className="text-4xl md:text-6xl leading-tight tracking-wide font-bold text-[#2FCC71]">
              {pointsData.claimed_points}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <InformationCircleIcon className="w-7 h-7 md:w-5 md:h-5 text-gray-500" />
            <p className="font-medium text-base text-gray-500">
              There are {pointsData.totalUnclaimedPoints} more points waiting
              for you to be claimed!
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:w-[28%] md:flex md:flex-col gap-[16px]">
        <div className="relative p-[0.8px] rounded-xl bg-gradient-to-r from-[#2FCC71] to-[#68ff74] shadow-md shadow-slate-100">
          <div className="bg-[#F8FCF8] rounded-xl px-3 py-2 flex flex-col items-center justify-between gap-[2px]">
            <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-[#2FCC71] to-[#68ff74] text-transparent bg-clip-text">
              {pointsData.contribution_points}
            </h1>
            <h2 className="text-base font-medium text-[#02773A]">
              Contribution
            </h2>
          </div>
        </div>
        <div className="relative p-[0.8px] rounded-xl bg-gradient-to-r from-[#2FCC71] to-[#68ff74] shadow-md shadow-slate-100">
          <div className="bg-[#F8FCF8] rounded-xl px-3 py-2 flex flex-col items-center justify-between gap-[2px]">
            <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-[#2FCC71] to-[#68ff74] text-transparent bg-clip-text">
              {pointsData.referral_points}
            </h1>
            <h2 className="text-base font-medium text-[#02773A]">
              Referral Points
            </h2>
          </div>
        </div>
        <div className="relative p-[0.8px] rounded-xl bg-gradient-to-r from-[#2FCC71] to-[#68ff74] shadow-md shadow-slate-100">
          <div className="bg-[#F8FCF8] rounded-xl px-3 py-2 flex flex-col items-center justify-between gap-[2px]">
            <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-[#2FCC71] to-[#68ff74] text-transparent bg-clip-text">
              {pointsData.participation_points}
            </h1>
            <h2 className="text-base font-medium text-[#02773A]">
              Participation
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Points_overview;
