"use client";

import React, { useState, useEffect } from "react";
import { EyeIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import CtaAnnounceWinner from "@/components/level_three_layout/cta_announce_winner";
import Submissions_Soon from "@/components/level_three_layout/submissions_soon";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Select from "react-select";
import { motion } from "framer-motion";
import { toast, Slide } from "react-toastify";
import { Client, Wallet, xrpToDrops } from "xrpl";
import Image from "next/image";

const SubmissionLinkPreview = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinkPreview = async () => {
      try {
        // Parse the URL if it's coming from submission_links array string
        let firstUrl = url;
        if (typeof url === "string" && url.startsWith("[")) {
          const links = JSON.parse(url);
          firstUrl = links[0]; // Get only the first link
        }

        const response = await fetch("/api/unfurl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: firstUrl }),
        });
        const data = await response.json();
        setPreview(data);
      } catch (error) {
        console.error("Error fetching link preview:", error);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchLinkPreview();
    }
  }, [url]);

  if (loading) {
    return <div className="w-full h-full bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="w-full h-full relative">
      {preview?.image ? (
        <img
          src={preview.image}
          alt={preview.title || "Link preview"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {preview?.title ||
                (preview?.url
                  ? new URL(preview.url).hostname
                  : "No preview available")}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const [listing, setListing] = useState(null); //listing
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [wallet, setWallet] = useState(null); // User's wallet
  const [donationLoading, setDonationLoading] = useState({});

  const [availablePrizes, setAvailablePrizes] = useState([]);
  const [submissionPrizes, setSubmissionPrizes] = useState({});
  const [bonusPrizesAssigned, setBonusPrizesAssigned] = useState(0);

  const { bountie_id } = useParams();
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
  }, []);

  // Fetch user's wallet
  const fetchUserWallet = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch("/api/xrpl/check-wallet", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.wallet) {
          const client = new Client("wss://s.altnet.rippletest.net:51233");
          await client.connect();
          const balance = await client.getXrpBalance(
            data.wallet.public_address
          );
          await client.disconnect();

          setWallet({
            public_address: data.wallet.public_address,
            seed: data.wallet.seed,
            balance,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  useEffect(() => {
    fetchListings();
    if (session) fetchUserWallet();
  }, [session]);

  // Fetch submissions with user data included
  useEffect(() => {
    async function fetchSubmissionsData() {
      if (!listing) {
        return;
      }

      try {
        const res = await fetch(`/api/submissions?listing=${listing.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch submissions data");
        }
        const data = await res.json();
        console.log("submissions" + data.submissions || []);
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissionsData();
  }, [listing]);

  // Donation function
  const donateXRP = async (submissionId, recipientUserId, amount) => {
    if (!wallet) {
      toast.error("You need to create an XRPL wallet first!");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount!");
      return;
    }

    // Set both isLoading and keep the amount
  setDonationLoading((prev) => ({
    ...prev,
    [submissionId]: { amount: prev[submissionId]?.amount || amount, isLoading: true },
  }));

    let client;
    try {
      // Fetch recipient's public key
      // Inside the donateXRP function, replace the existing fetch for recipient's public key with this:
      let destination;
      try {
        const response = await fetch(
          `/api/xrpl/get-public-key?userId=${recipientUserId}`
        );
        if (!response.ok) {
          // Recipient has no wallet, create one
          const clientForNewWallet = new Client(
            "wss://s.altnet.rippletest.net:51233"
          );
          await clientForNewWallet.connect();
          const fundResult = await clientForNewWallet.fundWallet();
          const newWallet = fundResult.wallet;

          // Save the new wallet for the recipient
          const saveResponse = await fetch("/api/xrpl/save-wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: recipientUserId,
              public_address: newWallet.address,
              seed: newWallet.seed,
            }),
          });

          if (!saveResponse.ok)
            throw new Error("Failed to save recipient's new wallet");
          destination = newWallet.address;
          await clientForNewWallet.disconnect();

          toast.info(`Created a wallet for the recipient!`, {
            position: "top-center",
            autoClose: 3000,
            transition: Slide,
          });
        } else {
          const data = await response.json();
          destination = data.public_address;
        }
      } catch (err) {
        console.error("Error handling recipient wallet:", err);
        throw new Error(err.message || "Failed to process recipient wallet");
      }

      client = new Client("wss://s.altnet.rippletest.net:51233");
      await client.connect();

      const walletInstance = Wallet.fromSeed(wallet.seed);
      const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: walletInstance.address,
        Amount: xrpToDrops(amount),
        Destination: destination,
      });

      const signed = walletInstance.sign(prepared);
      const tx = await client.submitAndWait(signed.tx_blob);

      const newBalance = await client.getXrpBalance(walletInstance.address);
      setWallet({ ...wallet, balance: newBalance });

      toast.success(`Donated ${amount} XRP`, {
        position: "top-center",
        autoClose: 3000,
        transition: Slide,
      });
    } catch (err) {
      console.error("Error donating XRP:", err);
      toast.error(err.message || "Failed to donate XRP");
    } finally {
      if (client) await client.disconnect();
      setDonationLoading((prev) => ({
        ...prev,
        [submissionId]: { ...prev[submissionId], isLoading: false },
      }));
    }
  };

  // Calculate number of bonus prizes assigned
  const calculateBonusPrizesAssigned = (prizes) => {
    return Object.values(prizes).filter((prize) => prize?.type === "bonus")
      .length;
  };

  // Modified getAvailablePrizes to handle multiple bonus prizes
  // Modified getAvailablePrizes function
  const getAvailablePrizes = () => {
    if (!listing) return;

    const rewardData = JSON.parse(listing.reward);
    const { prizes, bonusPrize, token } = rewardData;

    // Get all currently selected positions instead of values
    const selectedPositions = Object.values(submissionPrizes)
      .filter((prize) => prize?.type === "numbered")
      .map((prize) => prize.position);

    // Create numbered prize options (1st, 2nd, etc.) with position
    const numberedPrizes = prizes.map((amount, index) => ({
      value: amount,
      label: `${index + 1}${getOrdinalSuffix(
        index + 1
      )} Prize - ${amount} ${token}`,
      type: "numbered",
      position: index + 1, // Add position for numbered prizes
    }));

    // Add bonus prize options if they exist and are still available
    const bonusPrizeOptions = [];
    if (bonusPrize) {
      const maxBonusPrizes = parseInt(bonusPrize.number);
      const currentBonusPrizes = calculateBonusPrizesAssigned(submissionPrizes);

      if (currentBonusPrizes < maxBonusPrizes) {
        bonusPrizeOptions.push({
          value: parseInt(bonusPrize.amount),
          label: `Bonus Prize - ${bonusPrize.amount} ${token} (${currentBonusPrizes}/${maxBonusPrizes})`,
          type: "bonus",
        });
      }
    }

    // Filter out already selected numbered prizes by position instead of value
    const availableNumberedPrizes = numberedPrizes.filter(
      (prize) => !selectedPositions.includes(prize.position)
    );

    // Add "Remove Prize" option
    const finalOptions = [
      { value: null, label: "Remove Prize", type: "remove" },
      ...availableNumberedPrizes,
      ...bonusPrizeOptions,
    ];

    setAvailablePrizes(finalOptions);
  };

  // Helper function for ordinal suffixes (unchanged)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  // Update available prizes whenever submission prizes change
  useEffect(() => {
    if (listing) {
      getAvailablePrizes();
    }
  }, [listing, submissionPrizes]);

  // Handle prize selection for a specific submission
  // Modified prize selection handler
  const handlePrizeChange = (submissionId, selectedOption) => {
    setSubmissionPrizes((prev) => {
      const newPrizes = { ...prev };

      // If removing a prize
      if (selectedOption === null || selectedOption.value === null) {
        delete newPrizes[submissionId];
      } else {
        // Check if we can add this bonus prize
        if (selectedOption.type === "bonus") {
          const rewardData = JSON.parse(listing.reward);
          const maxBonusPrizes = parseInt(rewardData.bonusPrize.number);
          const currentBonusPrizes = calculateBonusPrizesAssigned(newPrizes);

          if (currentBonusPrizes >= maxBonusPrizes) {
            toast.info(
              `Maximum ${maxBonusPrizes} bonus prizes can be assigned.`
            );
            return prev;
          }
        }

        newPrizes[submissionId] = selectedOption;
      }

      return newPrizes;
    });
  };

  // Reset prizes function
  const resetPrizes = () => {
    setSubmissionPrizes({});
    setBonusPrizesAssigned(0);
  };

  // Check if all required prizes have been assigned
  const areAllPrizesAssigned = () => {
    if (!listing) return false;

    const rewardData = JSON.parse(listing.reward);
    const requiredPrizes = rewardData.prizes.length;
    const assignedNumberedPrizes = Object.values(submissionPrizes).filter(
      (prize) => prize?.type === "numbered"
    ).length;

    return requiredPrizes === assignedNumberedPrizes;
  };

  // Modified handleSubmit function for your Page component
  // Modified handleSubmit function
  const handleSubmit = async () => {
    if (!areAllPrizesAssigned()) {
      toast.error("Please assign all required prizes first");
      return;
    }

    try {
      // Format the winners data
      const winners = Object.entries(submissionPrizes).map(
        ([submissionId, prizeOption]) => {
          const submission = submissions.find(
            (s) => s.id === parseInt(submissionId)
          );

          // Create the winner object with basic properties
          const winnerData = {
            user_id: submission.user_id,
            reward: prizeOption.value,
            type: prizeOption.type,
          };

          // Add position for numbered prizes
          if (prizeOption.type === "numbered") {
            winnerData.position = prizeOption.position;
          }

          return winnerData;
        }
      );

      console.log("Winners payload:", winners); // For debugging

      const response = await fetch("/api/winners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: listing.id,
          winners: winners,
        }),
      });

      // First check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || "Failed to announce winners");
        } catch (parseError) {
          throw new Error(`Server error: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log("Success response:", result);
      toast.success("All winners announced successfully!");
    } catch (error) {
      console.error("Error assigning winners:", error);
      toast.error(`Failed to announce winners: ${error.message}`);
    }
  };

  const handlePreviewClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Check if user is creator of listing
  const isListingCreator = currentUser === listing?.creator_id;

  // Check if user is in partner dashboard
  const IsInPartnerDashboard = () => {
    const pathname = usePathname();
    return pathname.split("/").includes("dashboard");
  };
  const iconVariants = {
    initial: {
      scale: 1,
      boxShadow: "none",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 2px 3px #dadada", // Light shadow
      transition: { duration: 0.1 },
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 2px 3px #dadada", // Subtle pressed effect
      transition: { duration: 0.1 },
    },
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
    <div className="max-w-screen-lg mx-auto mt-8 px-4 md:px-4 mb-44">
      {!listing ||
      (new Date(listing.end_date) > new Date() && !isListingCreator) ? (
        <Submissions_Soon />
      ) : (
        <>
          {isListingCreator && IsInPartnerDashboard() && (
            <div className="mb-[30px]">
              <h2 className="text-[22px] leading-7 font-bold text-gray-800 mb-2">
                Announce the Winners!
              </h2>
              <p className="text-gray-600 mb-4">
                Find out more about the selection process and celebrate top
                submissions by announcing the winners!
                <br />
                <br /> This Function is only visible to you.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={openModal}
                  className="flex items-center justify-center px-4 py-2 md:px-5 md:py-[10px] text-white bg-green-500 rounded-lg hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-md text-sm md:text-[15px] font-semibold"
                >
                  Learn More
                  <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-4" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !areAllPrizesAssigned() || listing.rewarded_on !== null
                  }
                  className={`flex items-center justify-center px-4 py-2 md:px-5 md:py-[10px] rounded-lg transition duration-200 shadow-sm hover:shadow-md text-sm md:text-[15px] font-medium 
              ${
                areAllPrizesAssigned()
                  ? "text-[#252525] bg-[#f8fafc] border border-[#252525]"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
                >
                  Announce Winners
                </button>
              </div>
              <hr className="my-8" />
            </div>
          )}
          {/* {isListingCreator &&
            IsInPartnerDashboard() &&
            listing.rewarded_on !== null && (
              <div className="mb-[30px] bg-red-200 pt-6 pb-4 pl-6 pr-6 rounded-lg">
                <h2 className="text-[22px] leading-7 font-bold text-gray-800 mb-2">
                  Important!
                </h2>
                <p className="text-gray-700 mb-4">
                  Please distribute the prize to all winners if you haven’t
                  already. copy the winners’ wallet addresses from the Winners
                  tab and distribute their respective prizes to their wallet
                  addresses.
                  <br />
                  <br />
                  If you have already distributed the prizes, you can ignore
                  this message.
                  <br />
                  <br /> This message is only visible to you.
                </p>
              </div>
            )} */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4">
            {submissions.map((submission) => (
              <motion.div
                key={submission.id}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 2px 10px #e5e5e5",
                  zIndex: 20,
                }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md w-full md:max-w-[300px] mx-auto"
              >
                <div className="h-40 relative">
                  {(() => {
                    try {
                      const links =
                        typeof submission.submission_links === "string"
                          ? JSON.parse(submission.submission_links)
                          : submission.submission_links || [];

                      return <SubmissionLinkPreview url={links[0]} />; // Pass only the first link
                    } catch (error) {
                      console.error("Error parsing submission links:", error);
                      return (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <p className="text-gray-500">No preview available</p>
                        </div>
                      );
                    }
                  })()}

                  {/* Twitter icon */}
                  {submission.tweet_link ? (
                    <motion.a
                      href={submission.tweet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={iconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="w-[34px] h-[34px] rounded-full bg-white border flex items-center justify-center absolute top-2 right-2 z-10"
                    >
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_31_4401)">
                          <path
                            d="M9.77114 6.77143L15.5964 0H14.216L9.15792 5.87954L5.11803 0H0.458496L6.5676 8.8909L0.458496 15.9918H1.83898L7.18047 9.78279L11.4469 15.9918H16.1064L9.7708 6.77143H9.77114ZM7.88037 8.96923L7.26139 8.0839L2.33639 1.0392H4.45674L8.43127 6.7245L9.05025 7.60983L14.2167 14.9998H12.0963L7.88037 8.96957V8.96923Z"
                            fill="#4D4D4D"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_31_4401">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(0.282471)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </motion.a>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="px-4 py-4 flex items-center">
                  <div className="w-full">
                    <div className="flex items-center">
                      <img
                        src={submission.user_image}
                        alt={submission.user_name}
                        className="w-[40px] h-[40px] rounded-full border-1 border-gray-100 mr-[10px]"
                      />
                      <div className="flex flex-col">
                        <h1 className="text-[17px] font-semibold text-[#252B42]">
                          {submission.user_name}
                        </h1>
                        <h1 className="text-[14px] font-semibold text-[#767676]">
                          {submission.user_username}
                        </h1>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      {(() => {
                        try {
                          const links =
                            typeof submission.submission_links === "string"
                              ? JSON.parse(submission.submission_links)
                              : submission.submission_links || [];

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
                      {/* Donation UI */}
                      {session ? (
                        <div className="flex w-full gap-2 flex-col mt-2">
                          <input
                            type="number"
                            placeholder="Enter XRP"
                            value={donationLoading[submission.id]?.amount || ""}
                            onChange={(e) =>
                              setDonationLoading((prev) => ({
                                ...prev,
                                [submission.id]: {
                                  ...prev[submission.id],
                                  amount: e.target.value,
                                },
                              }))
                            }
                            className="flex-1 bg-white border border-gray-300 text-sm rounded-[6px] p-[7px] text-[#344054] focus:outline-none focus:ring-1 focus:ring-green-500"
                            min="0"
                            step="0.001"
                          />
                          <button
                            onClick={() =>
                              donateXRP(
                                submission.id,
                                submission.user_id,
                                donationLoading[submission.id]?.amount
                              )
                            }
                            disabled={donationLoading[submission.id]?.isLoading}
                            className={`px-3 py-[7px] rounded-[6px] text-white text-sm font-semibold transition duration-200 ${
                              donationLoading[submission.id]?.isLoading
                                ? "bg-gray-400 cursor-not-allowed border-solid border-2 border-gray-400"
                                : "bg-white hover:bg-slate-50 border-solid border-2 border-green-500"
                            }`}
                          >
                            {donationLoading[submission.id]?.isLoading
                              ? "Donating..."
                              : <div className="flex items-center flex-row justify-center text-slate-950">Donate  <Image src="/images/tokens/xrpp.png" alt="XRP" height="36" width="36"></Image></div>}
                          </button>
                        </div>
                      ) : (
                        "SignIn to Donate"
                      )}
                      {isListingCreator &&
                        IsInPartnerDashboard() &&
                        listing.rewarded_on == null && (
                          <div className="flex items-center justify-center">
                            {/* <select
                            id="prizes"
                            className="bg-white border border-gray-300 text-sm rounded-[6px] block w-full p-[7px] text-[#344054] focus:outline-none focus:ring-1 focus:ring-green-500"
                          >
                            <option value="" className="hidden">
                              Select Prize
                            </option>
                            <option value="1st">1st Prize</option>
                            <option value="2nd">2nd Prize</option>
                            <option value="bonus">Bonus Prize</option>
                          </select> */}
                            <Select
                              options={availablePrizes}
                              onChange={(option) =>
                                handlePrizeChange(submission.id, option)
                              }
                              value={submissionPrizes[submission.id] || null}
                              placeholder="Select a prize"
                              className="w-full text-[#344054] z-[1000]"
                              styles={{
                                option: (provided, state) => ({
                                  ...provided,
                                  color:
                                    state.data.type === "remove"
                                      ? "#DC2626"
                                      : state.data.type === "bonus"
                                      ? "#2563EB"
                                      : "#344054",
                                  fontWeight:
                                    state.data.type === "remove"
                                      ? "600"
                                      : "400",
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 50,
                                  position: "relative",
                                }),
                                menuPortal: (provided) => ({
                                  ...provided,
                                  zIndex: 50,
                                }),
                                container: (provided) => ({
                                  ...provided,
                                  position: "relative",
                                  zIndex: 30,
                                }),
                              }}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {isModalOpen && (
            <CtaAnnounceWinner
              isOpen={isModalOpen}
              onRequestClose={closeModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Page;
