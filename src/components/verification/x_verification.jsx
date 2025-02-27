import React, { useState, useEffect } from "react";
import { AtSymbolIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const XVerification = () => {
  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex gap-3 justify-between items-center mb-5">
        <div className="flex gap-3 items-center">
          <div className="absolute left-[-24px] md:left-[-32px] top-[0.05rem] bg-[#383D38] w-2 h-11 rounded-r-md"></div>
          <div className="w-11 h-11 rounded-full flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.0497 48.0079H23.9441C10.7415 48.0079 0 37.2633 0 24.0568V23.9512C0 10.7446 10.7415 0 23.9441 0H24.0497C37.2523 0 47.9938 10.7446 47.9938 23.9512V24.0568C47.9938 37.2633 37.2523 48.0079 24.0497 48.0079ZM23.9441 1.62502C11.6366 1.62502 1.62454 11.64 1.62454 23.9512V24.0568C1.62454 36.3679 11.6366 46.3829 23.9441 46.3829H24.0497C36.3572 46.3829 46.3693 36.3679 46.3693 24.0568V23.9512C46.3693 11.64 36.3572 1.62502 24.0497 1.62502H23.9441Z"
                fill="#383D38"
              />
              <path
                d="M14.0468 15.873L21.5669 25.9302L14 34.1074H15.7035L22.329 26.9485L27.6817 34.1074H33.4777L25.5349 23.4845L32.5786 15.873H30.8751L24.774 22.4662L19.844 15.873H14.048H14.0468ZM16.5512 17.1279H19.2133L30.971 32.8525H28.309L16.5512 17.1279Z"
                fill="#383D38"
              />
            </svg>
          </div>
        </div>
        <div>
          <button className="flex px-6 py-[10px] rounded-md text-[#383D38] hover:text-white bg-transparent items-center gap-2 border border-[#383D38] hover:bg-[#383D38] transition duration-200 shadow hover:shadow-lg font-medium lg:font-normal text-sm text-medium lg:text-base lg:text-normal">
            <CheckBadgeIcon className="w-5 h-5 font-medium" />
            Verify Now
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-[#0F172A] text-xl md:text-2xl font-bold">
        Verify Your Twitter Handle
        </h1>
        <p className="text-base font-normal text-[#737791]">
        Link your Twitter account to gain bonus points for engagement and unlock more benefits.
        </p>
      </div>
    </div>
  );
};

export default XVerification;
