import React from "react";
import Leaderboard from "@/components/level_three_layout/leaderboard";
import Latest_Earnings from "@/components/level_three_layout/latest_earnings";
import Statistics from "@/components/level_three_layout/statistics";
import User_Testimonials from "@/components/level_three_layout/user_testimonials";

const page = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 mt-6">
      <Statistics />

      <div className="max-w-[100vw] flex flex-col lg:flex-row gap-7 my-4">
        <Leaderboard />
        <Latest_Earnings />
      </div>

      <User_Testimonials />

      <div className="mt-6 grid gap-[2rem] sm:grid-cols-1 lg:grid-cols-3 mb-5">
        <div className="flex flex-col max-w-full lg:max-w-[23.5rem] gap-3">
          <a href="/bounties/amazing-bounty-challenge">
            <div className="flex items-center gap-2">
              <div className="w-[4rem] h-[4rem] rounded-[10px] border">
                <img
                  src="https://i.pinimg.com/736x/2c/42/bc/2c42bc75e7f07f3561e0b5160ecc98d6.jpg"
                  alt="partner Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div className="bg-white flex items-center flex-1 h-16 rounded-[10px] border overflow-hidden px-5 py-2">
                <h1 className="text-sm md:text-base font-medium text-[#3e3e3e] line-clamp-2">
                  Amazing Bounty Challenge Amazing Bounty Challenge Chal
                  Challenge Chal
                </h1>
              </div>
            </div>
          </a>

          <a href="/bounties/amazing-bounty-challenge">
            <div className="bg-white h-[235px] rounded-[10px] border px-5 py-5 flex flex-col gap-7 justify-between overflow-hidden">
              <div>
                <div className="text-[#3e3e3e] flex flex-wrap gap-5 md:gap-5 items-start justify-start">
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    Blinkit ewfbwaubcuef
                  </h2>
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    Bounty
                  </h2>
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    10 days left
                  </h2>
                </div>

                <p className="text-[15px] leading-6 text-[#3e3e3e] mt-[10px] line-clamp-3">
                  Join the amazing challenge to win amazing rewards! This
                  competition is very exciting and promises to deliver great
                  rewards for the top participants. You won't want to miss out!
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-[#3e3e3e] font-semibold">
                  Reward
                </span>
                <div className="flex gap-2 items-center justify-center">
                  <img
                    src="/images/usdt_logo.png"
                    alt="usdt_logo"
                    className="w-[26px] h-[26px] object-cover"
                  />
                  <span className="text-[19px] text-[#2fcc71] font-semibold">
                    650
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="flex flex-col max-w-full lg:max-w-[23.5rem] gap-3">
          <a href="/bounties/amazing-bounty-challenge">
            <div className="flex items-center gap-2">
              <div className="w-[4rem] h-[4rem] rounded-[10px] border">
                <img
                  src="https://i.pinimg.com/736x/2c/42/bc/2c42bc75e7f07f3561e0b5160ecc98d6.jpg"
                  alt="partner Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div className="bg-white flex items-center flex-1 h-16 rounded-[10px] border overflow-hidden px-5 py-2">
                <h1 className="text-sm md:text-base font-medium text-[#3e3e3e] line-clamp-2">
                  Amazing Bounty Challenge
                </h1>
              </div>
            </div>
          </a>

          <a href="/bounties/amazing-bounty-challenge">
            <div className="bg-white h-[235px] rounded-[10px] border px-5 py-5 flex flex-col gap-7 justify-between overflow-hidden">
              <div>
                <div className="text-[#3e3e3e] flex flex-wrap gap-5 md:gap-5 items-start justify-start">
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    Zepto
                  </h2>
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    Bounty
                  </h2>
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    10 days left
                  </h2>
                </div>

                <p className="text-[15px] leading-6 text-[#3e3e3e] mt-[10px] line-clamp-3">
                  Join the amazing challenge to win amazing rewards! This
                  competition is very 
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-[#3e3e3e] font-semibold">
                  Reward
                </span>
                <div className="flex gap-2 items-center justify-center">
                  <img
                    src="/images/usdt_logo.png"
                    alt="usdt_logo"
                    className="w-[26px] h-[26px] object-cover"
                  />
                  <span className="text-[19px] text-[#2fcc71] font-semibold">
                    650
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="flex flex-col max-w-full lg:max-w-[23.5rem] gap-3">
          <a href="/bounties/amazing-bounty-challenge">
            <div className="flex items-center gap-2">
              <div className="w-[4rem] h-[4rem] rounded-[10px] border">
                <img
                  src="https://i.pinimg.com/736x/2c/42/bc/2c42bc75e7f07f3561e0b5160ecc98d6.jpg"
                  alt="partner Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div className="bg-white flex items-center flex-1 h-16 rounded-[10px] border overflow-hidden px-5 py-2">
                <h1 className="text-sm md:text-base font-medium text-[#3e3e3e] line-clamp-2">
                  Amazing Bounty
                </h1>
              </div>
            </div>
          </a>

          <a href="/bounties/amazing-bounty-challenge">
            <div className="bg-white h-[235px] rounded-[10px] border px-5 py-5 flex flex-col gap-7 justify-between overflow-hidden">
              <div>
                <div className="text-[#3e3e3e] flex flex-wrap gap-5 md:gap-5 items-start justify-start">
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    Blinkit Blinkit Zepto
                  </h2>
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    Bounty
                  </h2>
                  <h2 className="font-medium text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                    10 days left
                  </h2>
                </div>

                <p className="text-[15px] leading-6 text-[#3e3e3e] mt-[10px] line-clamp-3">
                  Join the amazing 
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-[#3e3e3e] font-semibold">
                  Reward
                </span>
                <div className="flex gap-2 items-center justify-center">
                  <img
                    src="/images/usdt_logo.png"
                    alt="usdt_logo"
                    className="w-[26px] h-[26px] object-cover"
                  />
                  <span className="text-[19px] text-[#2fcc71] font-semibold">
                    650
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default page;
