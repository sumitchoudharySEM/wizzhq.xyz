"use client";

import React from "react";
import { motion } from "framer-motion";

const communityPartnersData = [
  {
    name: "Partner 1",
    logo: "/images/partners/dao_logo.png",
    members: 1500,
  },
  {
    name: "Partner 5",
    logo: "/images/partners/cdb.png",
    members: 3000,
  },
  {
    name: "Partner 4",
    logo: "/images/partners/pdname.png",
    members: 2000,
  },
  {
    name: "Partner 6",
    logo: "/images/partners/aotbig.png",
    members: 3000,
  },
  {
    name: "Partner 2",
    logo: "/images/partners/lds.png",
    members: 1000,
  },
  {
    name: "Partner 3",
    logo: "/images/partners/gs5.png",
    members: 1000,
  },
 
];

const community_partners = () => {
  return (
    <>
      <div className="hidden py-6 md:flex flex-wrap justify-center gap-7 lg:gap-6">
        {communityPartnersData.map((partner, index) => (
          <div
            key={index}
            className="bg-[#fafafa]] rounded-lg w-[275px] h-[110px] lg:w-[310px] lg:h-[135px] lg:max-h-[160px] p-4 lg:p-7 flex items-center justify-center shadow-sm shadow-[#B8B8B8] border-t-2 border-b-2 border-black"
          >
            <div className="flex gap-4 items-center justify-center">
              <div className="w-[5.2rem] h-[5.2rem] lg:w-24 lg:h-24 object-cover flex items-center justify-center">
                <img src={partner.logo} alt="dao_logo" />
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <h1 className="text-center font-extrabold tracking-wide text-[1.7rem] leading-6 lg:text-3xl text-[#1AC462]">
                  {partner.members}+{" "}
                </h1>
                <p className="text-center font-medium text-sm  text-[#1AC462]">
                  Community Members
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view with fixed animation */}
      <div className="md:hidden relative overflow-hidden w-full">
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex w-fit"
        >
          {/* First set */}
          <div className="flex gap-5 pt-6 shrink-0">
            {communityPartnersData.map((partner, index) => (
              <div
                key={index}
                className="bg-[#fafafa] rounded-lg w-[280px] max-h-[120px] p-4 flex items-center justify-center shadow-sm shadow-[#B8B8B8] border-t-2 border-b-2 border-black"
              >
                <div className="flex gap-5 items-center justify-center">
                  <div className="w-[5.2rem] h-[5.2rem] object-cover flex items-center justify-center">
                    <img src={partner.logo} alt="dao_logo" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="text-center font-extrabold tracking-wide text-[1.5rem] leading-6 text-[#1AC462]">
                      {partner.members}+
                    </h1>
                    <p className="text-center font-medium text-[12px] leading-5 text-[#1AC462]">
                      Community Members
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-5 shrink-0" />

          {/* Second set */}
          <div className="flex gap-5 pt-6 shrink-0">
            {communityPartnersData.map((partner, index) => (
              <div
                key={`second-${index}`}
                className="bg-[#fafafa] rounded-lg w-[280px] max-h-[120px] p-4 flex items-center justify-center shadow-sm shadow-[#B8B8B8] border-t-2 border-b-2 border-black"
              >
                <div className="flex gap-5 items-center justify-center">
                  <div className="w-[5.2rem] h-[5.2rem] object-cover flex items-center justify-center">
                    <img src={partner.logo} alt="dao_logo" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="text-center font-extrabold tracking-wide text-[1.5rem] leading-6 text-[#1AC462]">
                      {partner.members}+
                    </h1>
                    <p className="text-center font-medium text-[12px] leading-5 text-[#1AC462]">
                      Community Members
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default community_partners;
