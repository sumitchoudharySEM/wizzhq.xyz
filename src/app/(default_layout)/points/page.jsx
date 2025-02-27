"use client";

import React, { useState, useEffect } from "react";
import {
  RocketLaunchIcon,
  SparklesIcon,
  UserPlusIcon,
  WalletIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const Page = () => {
  const [UserData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pointIcons = {
    Referral: UserPlusIcon,
    Participation:  RocketLaunchIcon,
    Contribution: SparklesIcon,
  };

  const getGradient = (pointType) => {
    switch (pointType) {
      case "Referral":
        return "bg-gradient-to-r from-[#38BDF8] to-[#79F2FF]";
      case "Participation":
        return "bg-gradient-to-r from-[#ED4F9D] to-[#FFA3E5]";
      default:
        return "bg-gradient-to-r from-[#EA8E01] to-[#FFCB79]";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/points/breakdown");
        if (!response.ok) {
          throw new Error("Failed to fetch points");
        }
        const data = await response.json();
        // console.log(data, "data");
        setUserData(data.points || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleClaimPoints = async (pointType, pointId) => {
    try {
      const response = await fetch("/api/points/breakdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pointType, pointId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim points");
      }

      // Update local state to mark point as claimed
      setUserData(prevData => 
        prevData.map(entry => 
          entry.point_type === pointType && entry.id === pointId 
            ? { ...entry, claimed: 1 } 
            : entry
        )
      );

      toast.success(`Successfully claimed ${data.claimedPoints} points!`);
    } catch (err) {
      toast.error(err.message);
      console.error("Error claiming points:", err);
    }
  };

  return (
    <div>
      {/* User Entries */}
      <div className="mt-6 flex flex-col gap-4">
        {UserData.map((entry, index) => {
          const Icon = pointIcons[entry.point_type] || SparklesIcon;
          const gradientClass = getGradient(entry.point_type);
          return (
            <React.Fragment key={index}>
              <div className="flex items-center justify-between gap-2 md:gap-7 mb-3 md:mx-16 md:mt-2">
                <div className="flex items-center gap-3 md:gap-24">
                  {/* Rank */}
                  <div className="w-[22px] h-[22px] bg-[#2fcc71] rounded flex justify-center items-center text-white">
                    {index + 1}
                  </div>

                  {/* Profile */}
                  <div className="relative group flex items-center gap-4 w-16 md:w-40">
                    <div
                      className={`hidden w-9 h-9 rounded-full md:flex items-center justify-center ${gradientClass}`}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>

                    {/* Points For (Hover for Tooltip) */}
                    <h1 className="text-gray-800 font-medium text-base md:text-[17px] relative group">
                      {entry.point_type}
                      {/* Tooltip */}
                      {/* <span
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 scale-0 transition-all duration-200 group-hover:scale-100
                    bg-white text-gray-700 text-xs rounded-md p-3 w-40 md:w-72 text-center break-words
                    after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full after:border-4 after:border-transparent after:border-r-white
                    shadow-lg shadow-gray-300/50"
                      >
                        {entry.tooltip}
                      </span> */}
                    </h1>
                  </div>
                </div>

                {/* Rewards */}
                <div className="flex items-center gap-[6px] md:gap-3">
                  <img
                    src="/images/pb.png"
                    className="w-8 h-8 md:w-11 md:h-11 mt-1"
                    alt="points_icon"
                  />

                  <h1 className="text-[#2fcc71] font-semibold text-[16px] leading-3 md:text-2xl">
                    {entry.points}
                  </h1>
                </div>

                <div>
                  {entry.claimed === 0 ? (
                    <button 
                    onClick={() => handleClaimPoints(entry.point_type, entry.id)}
                    className="hidden md:block py-2 px-5 border text-sm md:text-base border-[#2FCC71] bg-[#F8FCF8] rounded-md text-[#2FCC71] font-semibold shadow hover:shadow-md transition duration-200">
                      Claim
                    </button>
                  ) : (
                    <span className="hidden md:block text-gray-500 text-sm md:text-base py-2 px-3">
                      Claimed
                    </span>
                  )}

                  {/* Wallet icon for mobile */}
                  {entry.claimed === 0 ? (
                    <button 
                    onClick={() => handleClaimPoints(entry.point_type, entry.id)}
                    className="block md:hidden py-2 px-5 border text-sm md:text-base border-[#2FCC71] bg-[#F8FCF8] rounded-md text-[#2FCC71] font-semibold shadow hover:shadow-md transition duration-200">
                      <WalletIcon className="w-5 h-5 text-[#2fcc71]" />
                    </button>
                  ) : (
                    <span className="block md:hidden text-gray-500 text-sm py-2 px-3">
                      <CheckCircleIcon className="w-5 h-5 text-gray-500" />
                    </span>
                  )}
                </div>
              </div>

              {/* Horizontal Line */}
              {index < UserData.length - 1 && (
                <hr className="border-gray-300" />
              )}
            </React.Fragment>
          );
        })}
        ;
      </div>
    </div>
  );
};

export default Page;