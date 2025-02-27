import { BriefcaseIcon, GifIcon, GiftIcon, PresentationChartLineIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

const Statistics = () => {
  return (
    <div className="max-w-[100vw] bg-white h-auto rounded-xl px-9 py-7 shadow-sm shadow-[#e7e7e7]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
        {/* Stat 1 */}
        <div className="flex flex-col gap-4 items-start border-slate-200 lg:border-r">
          <div className="bg-[#FFFBEB] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
            <BriefcaseIcon className="text-[#F6A723] md:w-6 md:h-6 w-5 h-5" />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-[#64748B] text-base font-semibold">
              Bounties Listed
            </h3>
            <h1 className="text-2xl text-gray-900 font-bold tracking-wide">
              30K
            </h1>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col gap-4 items-start border-slate-200 lg:border-r">
          <div className="bg-[#EFFFEF] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
            <PresentationChartLineIcon className="text-[#2FCC71] md:w-6 md:h-6 w-5 h-5" />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-[#64748B] text-base font-semibold">
              Total Submissions
            </h3>
            <h1 className="text-2xl text-gray-900 font-bold tracking-wide">
              15K
            </h1>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col gap-4 items-start lg:border-r">
          <div className="bg-[#FDF2F8] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
            <GiftIcon className="text-[#ED4F9D] md:w-6 md:h-6 w-5 h-5" />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-[#64748B] text-base font-semibold">
              Rewards Distributed
            </h3>
            <h1 className="text-2xl text-gray-900 font-bold tracking-wide">
              50K
            </h1>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col gap-4 items-start">
          <div className="bg-[#F8FAFC] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
            <UserCircleIcon className="text-[#38BDF8] md:w-6 md:h-6 w-5 h-5" />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-[#64748B] text-base font-semibold">
              Active Users
            </h3>
            <h1 className="text-2xl text-gray-900 font-bold tracking-wide">
              10K
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
