"use client";

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { EyeIcon } from "@heroicons/react/24/outline";
import Winners_Soon from "@/components/level_three_layout/winners_soon";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const Page = () => {
  const [listing, setListing] = useState(null);
  const { bountie_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState([]);
  const [allRewards, setAllRewards] = useState();
  const [isDashboard, setIsDashboard] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const [showConfetti, setShowConfetti] = useState(true);

  const { data: session } = useSession();
  const currentUser = session?.user?.id;

  const fetchListings = async () => {
    try {
      const response = await fetch(`/api/bounty?slug=${bountie_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setListing(data.listing);
    } catch (error) {
      console.error("Error fetching listing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    IsInPartnerDashboard();
    IsInAdminDashboard();
  }, []);

  // Check if user is in partner dashboard
  const IsInPartnerDashboard = () => {
    if (pathname.split("/").includes("dashboard")) {
      setIsDashboard(true);
    } else {
      setIsDashboard(false);
    }
  };

  // Check if user is admin
  const IsInAdminDashboard = () => {
    if (pathname.split("/").includes("admin")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // First, modify the fetchWinnersData function to include wallet addresses
  // Fetch winners with user data included
  useEffect(() => {
    async function fetchWinnersData() {
      if (!listing) return;

      try {
        // First fetch winners
        const res = await fetch(`/api/winners?listing=${listing.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch winners data");
        }
        const data = await res.json();

        // Process winners
        const processedWinners = data.winners.map((winner) => {
          const reward =
            typeof winner.reward === "string"
              ? JSON.parse(winner.reward)
              : winner.reward;
          return {
            ...winner,
            position:
              reward.type === "numbered"
                ? `${reward.position}${getOrdinalSuffix(reward.position)}`
                : "Bonus",
            rewardValue: reward.value,
            rewardType: reward.type,
          };
        });

        // Sort winners: numbered first by position, then bonus prizes
        const sortedWinners = processedWinners.sort((a, b) => {
          const aReward =
            typeof a.reward === "string" ? JSON.parse(a.reward) : a.reward;
          const bReward =
            typeof b.reward === "string" ? JSON.parse(b.reward) : b.reward;

          if (aReward.type === "numbered" && bReward.type === "numbered") {
            return aReward.position - bReward.position;
          }
          if (aReward.type === "numbered") return -1;
          if (bReward.type === "numbered") return 1;
          return 0;
        });

        console.log("Processed winners with wallet addresses:", sortedWinners);
        setWinners(sortedWinners);
      } catch (error) {
        console.error("Error fetching winners:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWinnersData();
  }, [listing]);

  // Check if user is creator of listing
  const isListingCreator = currentUser === listing?.creator_id;

  // Add copyToClipboard function to your Page component
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Wallet address copied!");
    } catch (err) {
      toast.error("Failed to copy:", err);
      console.error("Failed to copy:", err);
    }
  };

  // Helper function for ordinal suffixes
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  useEffect(() => {
    if (listing) {
      setAllRewards(JSON.parse(listing.reward));
    }
  }, [listing]);

  // Replace the confetti useEffect with:
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false); // Stop confetti after 2sec
    }, 10000);
    return () => clearTimeout(timer); // Clear timer
  }, []);

  const handlePreviewClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center z-50 bg-[#F8FAFC] backdrop-blur-md">
        <iframe
          src="https://lottie.host/embed/0e906fb1-4db8-4ee5-83a1-571bf2354be3/swOYAUc0eE.json"
          title="Loading Animation"
          className="w-24 h-24"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-4 md:px-4 relative">
      {!listing ||
      listing.rewarded_on == null ||
      listing.rewarded_on == undefined ||
      listing.rewarded_on == "" ? (
        <Winners_Soon />
      ) : (
        <>
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={dimensions.height}
              recycle={true}
              initialVelocityY={10}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 100,
                pointerEvents: "none",
              }}
            />
          )}

          {/* {isListingCreator && isDashboard && listing.rewarded_on !== null && (
            <div className="mb-[30px] bg-red-200 pt-6 pb-4 pl-6 pr-6 rounded-lg">
              <h2 className="text-[22px] leading-7 font-bold text-gray-800 mb-2">
                Important!
              </h2>
              <p className="text-gray-700 mb-4">
                Please distribute the prize to all winners if you haven’t
                already. copy the winners’ wallet addresses from the Winners tab
                and distribute their respective prizes to their wallet
                addresses.
                <br />
                <br />
                If you have already distributed the prizes, you can ignore this
                message.
                <br />
                <br /> This message is only visible to you.
              </p>
            </div>
          )} */}

          <div className="mb-[30px] mt-4">
            <h2 className="text-[22px] leading-7 font-bold text-gray-800 mb-4">
              Big Congratulations to the Winners!
            </h2>
            <p className="text-gray-600 mb-4">
              The competition was fierce, the submissions were outstanding, and
              your dedication has inspired us all. Let's celebrate the winners!
            </p>
          </div>

          <div>
            <div className="grid grid-cols-1 md-lg:grid-cols-2 gap-8 max-w-[100vw]">
              {winners.map((winner) => {
                const reward =
                  typeof winner.reward === "string"
                    ? JSON.parse(winner.reward)
                    : winner.reward;

                return (
                  <motion.div
                    key={winner.id}
                    initial={{ opacity: 1 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0px 10px 20px #e5e5e5",
                      transition: { duration: 0.3 },
                    }}
                    className="h-auto bg-white rounded-md px-5 py-6 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h1 className="text-2xl font-semibold text-black">
                          {reward.type === "numbered"
                            ? `${reward.position}${getOrdinalSuffix(
                                reward.position
                              )}`
                            : "Bonus Prize"}
                        </h1>
                        <h2 className="text-sm font-normal text-black">
                          {reward.type === "numbered"
                            ? "Position"
                            : "Special Prize"}
                        </h2>
                      </div>
                      <div className="px-4 py-2 bg-[#EFFFF1] text-[#2FCC71] text-[17px] font-medium rounded-md tracking-wide shadow-sm">
                        {reward.value + " " + allRewards.token}
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <h1 className="text-2xl font-semibold text-black">
                          {winner.user_name}
                        </h1>
                        <h3 className="text-base text-gray-700 font-normal">
                          @{winner.user_username}
                        </h3>
                      </div>
                      <div className="relative w-36 h-36 shadow-lg shadow-gray-300 rounded-lg">
                        {/* Only show crown for numbered prizes positions 1-3 */}
                        {reward.type === "numbered" && reward.position <= 3 && (
                          <img
                            src={`/images/crown_${
                              reward.position
                            }${getOrdinalSuffix(reward.position)}.png`}
                            alt={`${reward.position}${getOrdinalSuffix(
                              reward.position
                            )} place crown`}
                            className="absolute top-[-58px] left-[7%] transform -translate-x-1/2 w-[125px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                          />
                        )}
                        <img
                          className="w-full h-full rounded-lg object-cover"
                          src={winner.user_image}
                          alt={`${winner.user_name}'s profile`}
                        />
                      </div>
                    </div>

                    <hr className="my-6" />

                    <div className="flex flex-col gap-1">
                      {(() => {
                        try {
                          const links =
                            typeof winner.submission_links === "string"
                              ? JSON.parse(winner.submission_links)
                              : winner.submission_links || [];

                          return links.map((link, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-center mt-2"
                            >
                              <button
                                onClick={() => handlePreviewClick(link)}
                                className="w-full rounded-md flex items-center justify-center px-3 py-[7px] text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-sm font-semibold"
                              >
                                <EyeIcon
                                  strokeWidth={2}
                                  className="h-4 w-4 mr-2"
                                />
                                {links.length > 1 ? (
                                  <>Preview Submission {index + 1}</>
                                ) : (
                                  <>Preview Submission</>
                                )}
                              </button>
                            </div>
                          ));
                        } catch (error) {
                          console.error(
                            "Error parsing submission links:",
                            error
                          );
                          return null;
                        }
                      })()}
                    </div>
                    {/* WINNERS WALLET ADDRESS */}
                    {isListingCreator && isDashboard || isAdmin && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Wallet Address
                            </span>
                            <span className="text-sm font-mono text-gray-700">
                              {winner.wallet_address
                                ? `${winner.wallet_address.slice(
                                    0,
                                    12
                                  )}...${winner.wallet_address.slice(-4)}`
                                : "No wallet address"}
                            </span>
                          </div>
                          {winner.wallet_address && (
                            <button
                              onClick={() =>
                                copyToClipboard(winner.wallet_address)
                              }
                              className="p-2 hover:bg-gray-200 rounded-md transition-colors group"
                              title="Copy wallet address"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-600 group-hover:text-gray-800"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
