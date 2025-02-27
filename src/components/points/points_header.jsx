import React from "react";
import {
  LightBulbIcon,
  RocketLaunchIcon,
  SparklesIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const points_header = () => {
  return (
    <div className="flex flex-col gap-7 mt-4">
      <div className="flex  justify-between gap-4 flex-col lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg lg:text-xl font-bold text-gray-900">
            Score Big, Your Way!
          </h1>
          <p className="text-sm lg:text-base font-normal text-gray-500">
            Discover simple ways to boost your points—get ready to level up!
          </p>
        </div>

        <div>
          <Link href="/learn_point_system">
            <button className="flex px-4 py-[10px] rounded-md text-white items-center gap-2 bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-md font-medium lg:font-normal text-sm text-medium lg:text-base lg:text-normal">
              <LightBulbIcon className="w-5 h-5 text-white" />
              Learn More
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Card 1 */}
        <div className="relative bg-white shadow-md shadow-[#ececec] rounded-2xl px-7 py-6 md:py-10 w-full md:w-96">
          <div className="flex gap-3 items-center mb-5">
            <div className="absolute left-0 top-6 md:top-10 bg-[#EA8E01] w-2 h-11 rounded-r-md"></div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#EA8E01] to-[#FFCB79] flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm md:text-base">Create Magic</p>
            <h2 className="text-lg md:text-[1.3rem] font-bold mt-1 text-gray-800">
              Contribute Like a Pro
            </h2>
          </div>
        </div>
        {/* Card 2 */}
        <div className="relative bg-white shadow-md shadow-[#ececec] rounded-2xl px-7 py-6 md:py-10 w-full md:w-96">
          <div className="flex gap-3 items-center mb-5">
            <div className="absolute left-0 top-6 md:top-10 bg-[#38BDF8] w-2 h-11 rounded-r-md"></div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#79F2FF]  flex items-center justify-center">
              <UserPlusIcon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm md:text-base">Share the Fun</p>
            <h2 className="text-lg md:text-[1.3rem] font-bold mt-1 text-gray-800">
              Refer & Earn
            </h2>
          </div>
        </div>
        {/* Card 3 */}
        <div className="relative bg-white shadow-md shadow-[#ececec] rounded-2xl px-7 py-6 md:py-10 w-full md:w-96">
          <div className="flex gap-3 items-center mb-5">
            <div className="absolute left-0 top-6 md:top-10  bg-[#ED4F9D] w-2 h-11 rounded-r-md"></div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#ED4F9D] to-[#FFA3E5] flex items-center justify-center">
              <RocketLaunchIcon
                className="w-5 h-5 text-white"
                strokeWidth={2}
              />
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm md:text-base">
              Join the Action
            </p>
            <h2 className="text-lg md:text-[1.3rem] font-bold mt-1 text-gray-800">
              Participate to Earn
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default points_header;
