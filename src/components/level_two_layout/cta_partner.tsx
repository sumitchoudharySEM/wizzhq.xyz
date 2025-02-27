import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Cta_partner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="h-[15rem] flex items-center justify-center"
        style={{
          backgroundImage: "url(/images/login_signup_bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "auto",
        }}
      >
        <div className="flex flex-col items-center justify-center gap-6 py-2 px-5 md:py-4 md:px-9">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#003B0C] lg:text-3xl">
                Launch Your Next Bounty Today
              </h1>
            </div>
            <div className="text-center">
              <p className="font-normal lg:text-[17px] text-[#002808] text-[14px] md:text-[15px] ">
                Get quality submissions and complete your projects faster—start
                by creating a new bounty now!
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 md:gap-6">
          <div className="flex gap-6">
            <motion.button
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.2 },
              }}
              onClick={() => setIsModalOpen(true)}
              className={`rounded-md md:py-2 px-6 py-[7px] flex items-center justify-center text-[#333F51] bg-[#f3f3f3] shadow-lg shadow-green-300/50 hover:shadow-green-500/70 text-[13px] lg:text-base font-medium`}
            >
              Launch a Bounty
            </motion.button>
            {/* <button
            className={`rounded-md md:py-2 px-6 py-[7px] flex items-center justify-center text-[#333F51] border-2 border-white shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-500 hover:scale-102 lg:text-base text-[13px] font-medium transform-gpu`}
          >
            Learn More
          </button> */}
          </div>
          <Link href="/dashboard/create_job/job">
          <div className="flex gap-6">
            <motion.button
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.2 },
              }}
              className={`rounded-md md:py-2 px-6 py-[7px] flex items-center justify-center text-[#333F51] bg-[#f3f3f3] shadow-lg shadow-green-300/50 hover:shadow-green-500/70 text-[13px] lg:text-base font-medium`}
            >
              Hire Talent Now
            </motion.button>
          </div>
          </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl p-5 md:p-7 w-full max-w-xl mx-4 relative animate-fadeIn max-h-[95vh] overflow-y-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-5 text-[#003B0C]">
                Bounty Creation Guidelines
              </h2>
              <ol className="space-y-4 text-[#002808] list-decimal pl-4">
                <li className="text-sm md:text-base">
                  To successfully create a bounty, please ensure you fill in all
                  the details accurately and provide a well-detailed description
                  that includes all necessary information for potential
                  participants.
                </li>
                <li className="text-sm md:text-base">
                  The prize distribution should be decided in advance, and
                  winners will be rewarded accordingly. We do not allow
                  non-specific prize pools, and prizes must be in USDC or USDT.
                </li>
                <li className="text-sm md:text-base">
                  The full amount, including total prizes and operational fees,
                  must be provided immediately after bounty creation. Without
                  full payment, the bounty will not be verified or made public.
                </li>
                <li className="text-sm md:text-base">
                  Winners will be selected by the entity creating the bounty
                  within 3 weeks after the bounty ends. If not, Wizz will handle
                  the selection. Payments to winners will be managed by Wizz.
                </li>
                <li className="text-sm md:text-base">
                  A bounty can only be edited until the Wizz team has verified
                  it. After verification, any updates will require contacting
                  our team.
                </li>
                <li className="text-sm md:text-base">
                  The deadline can only be extended once, for a maximum of 1
                  week. To request an extension, contact our team at least 36
                  hours before the original deadline.
                </li>
              </ol>
              <div className="mt-6 md:mt-8 flex justify-end gap-5">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 },
                  }}
                  onClick={() => setIsModalOpen(false)}
                  className="flex px-6 py-[10px] border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium rounded-md bg-transparent items-center gap-2 shadow hover:shadow-lg text-sm text-medium lg:text-base lg:text-normal"
                >
                  Cancel
                </motion.button>
                <Link href="/dashboard/create_listing/bounty">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { duration: 0.1 },
                    }}
                    onClick={() => setIsModalOpen(false)}
                    className="flex px-6 py-[10px] rounded-md text-white items-center gap-2 bg-[#2fcc71] transition duration-200 shadow hover:shadow-lg font-medium lg:font-normal text-sm text-medium lg:text-base lg:text-normal"
                  >
                    Proceed
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cta_partner;
