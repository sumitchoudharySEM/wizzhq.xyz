"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRightCircleIcon,
  CheckBadgeIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { User } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";

const UserProfile = ({ user }) => {
  const { user_id } = useParams();
  // console.log("Username from URL:", user_id);
  const { data: usersession, userstatus } = useSession();
  const [socialLinks, setSocialLinks] = useState(null);
  const [stats, setStats] = useState({
    earned: 0,
    submissions: 0,
    won: 0,
  });
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user_id) {
        return;
      }

      try {
        const response = await fetch(
          `/api/user_profile/user_stats?user_id=${user_id}`
        );
        const data = await response.json();

        if (data.submissions) {
          // Total submissions
          const submissions = data.submissions.length;

          // Calculate totalreward & woncount
          let totalReward = 0;
          let wonCount = 0;

          data.submissions.forEach((submission) => {
            if (submission.reward) {
              const reward = JSON.parse(submission.reward);
              totalReward += reward.value || 0;
              wonCount++;
            }
          });

          // Update stats
          setStats({
            earned: totalReward,
            submissions,
            won: wonCount,
          });
        }
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetchSubmissions();
  }, [user_id]);

  useEffect(() => {
    if (user?.social_links) {
      try {
        const parsedLinks = JSON.parse(user.social_links);
        setSocialLinks(parsedLinks);
      } catch (error) {
        console.error("Failed to parse social_links JSON:", error);
      }
    }
  }, [user]);

  if (!user) {
    return <div>No user data available</div>;
  }

  // const { data: session } = useSession();

  // Utility function to check if a value is a string
  const isValidLink = (link) => typeof link === "string";

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

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleCopyLink = async () => {
    try {
      const profileURL = window.location.href; // current url
      await navigator.clipboard.writeText(profileURL);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy the link. Please try again.");
    }
  };

  const handleTwitterShare = () => {
    const shareText = encodeURIComponent(
      "Check out this awesome profile on Wizz!"
    );
    const profileURL = encodeURIComponent(window.location.href);
    const hashtags = encodeURIComponent("Wizz,Bounty,Growth,Profile,Explore");
    const twitterShareURL = `https://x.com/intent/tweet?text=${shareText}&url=${profileURL}&hashtags=${hashtags}`;

    window.open(twitterShareURL, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(
      "Check out this awesome profile on Wizz!"
    );
    const body = encodeURIComponent(
      `Check out this awesome profile on Wizz! ${window.location.href}`
    );
    const emailURL = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = emailURL;
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this awesome profile on Wizz! \n\n${window.location.href}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="relative bg-white pt-6 pb-8 px-9 rounded-lg shadow-md w-full">
      {/* partner Logo */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[60px] h-[60px] rounded-[8px] flex items-center justify-center">
        <img
          src={user.image ? user.image : undefined}
          alt="partner Logo"
          className="w-full h-full rounded-[8px] object-cover border border-gray-200 shadow-sm bg-white"
        />
      </div>

      <div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModal}
          className="p-[10px] rounded-full bg-white border border-gray-200 shadow-sm absolute top-3 right-3"
        >
          <ShareIcon className="w-[18px] h-[18px] text-[#757d85]" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          //a modal opens with two options copy link and share on twitter, with also a close button along
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-[80%] sm:w-[60%] lg:w-[40%] bg-[#f8fafc] rounded-lg shadow-lg"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4"
                onClick={closeModal}
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" strokeWidth={2} />
              </motion.button>
              <div className="p-6 flex flex-col">
                <h2 className="text-[20px] font-semibold text-gray-900">
                  Share Profile
                </h2>
                <hr className="my-3" />
                <div className="flex flex-col gap-4 mt-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-2"
                  >
                    <h2 className="text-base font-normal text-gray-800">
                      Share this link via
                    </h2>
                    <div className="flex gap-3 items-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-12 h-12 rounded-full bg-white border border-[#171717] flex items-center justify-center"
                        onClick={handleTwitterShare}
                      >
                        <svg
                          width="18"
                          height="17"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.77114 6.77143L15.5964 0H14.216L9.15792 5.87954L5.11803 0H0.458496L6.5676 8.8909L0.458496 15.9918H1.83898L7.18047 9.78279L11.4469 15.9918H16.1064L9.7708 6.77143H9.77114ZM7.88037 8.96923L7.26139 8.0839L2.33639 1.0392H4.45674L8.43127 6.7245L9.05025 7.60983L14.2167 14.9998H12.0963L7.88037 8.96957V8.96923Z"
                            fill="#171717"
                          />
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-12 h-12 rounded-full bg-white border border-[#00E510] flex items-center justify-center"
                        onClick={handleWhatsAppShare}
                      >
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.9433 16.2941C10.4244 16.2941 6.74797 12.6153 6.74673 8.09514C6.74797 6.94932 7.68069 6.01758 8.8237 6.01758C8.94122 6.01758 9.05749 6.02748 9.16882 6.04727C9.41375 6.08811 9.64632 6.17101 9.86033 6.29599C9.89126 6.31455 9.91228 6.34424 9.91723 6.37889L10.3947 9.38946C10.4009 9.42411 10.3898 9.45998 10.3663 9.48597C10.1028 9.77799 9.76631 9.98835 9.39149 10.0935L9.21089 10.1443L9.27892 10.3187C9.89496 11.8877 11.1493 13.1412 12.7191 13.7599L12.8935 13.8292L12.9442 13.6485C13.0494 13.2736 13.2597 12.937 13.5516 12.6735C13.5726 12.6537 13.6011 12.6438 13.6295 12.6438C13.6357 12.6438 13.6419 12.6438 13.6493 12.645L16.659 13.1227C16.6949 13.1288 16.7246 13.1486 16.7431 13.1796C16.8668 13.3936 16.9497 13.6275 16.9918 13.8725C17.0116 13.9814 17.0202 14.0965 17.0202 14.2165C17.0202 15.3611 16.0887 16.2928 14.9433 16.2941Z"
                            fill="#00E510"
                          />
                          <path
                            d="M22.9567 10.1342C22.713 7.37979 21.4513 4.82458 19.404 2.94004C17.3443 1.04436 14.6723 0 11.8779 0C5.74474 0 0.754597 4.99163 0.754597 11.1266C0.754597 13.1856 1.32238 15.1914 2.39735 16.9386L0 22.247L7.67574 21.4291C9.01049 21.976 10.4232 22.2532 11.8767 22.2532C12.2589 22.2532 12.6511 22.2334 13.0444 22.1926C13.3908 22.1555 13.7409 22.101 14.0848 22.0317C19.2209 20.9935 22.9703 16.4338 23 11.186V11.1266C23 10.7925 22.9852 10.4584 22.9555 10.1355L22.9567 10.1342ZM7.97139 19.0991L3.72469 19.552L4.99264 16.7419L4.73905 16.4016C4.72049 16.3768 4.70194 16.3521 4.68091 16.3236C3.57996 14.8029 2.99855 13.0062 2.99855 11.1278C2.99855 6.23026 6.98177 2.24586 11.8779 2.24586C16.4648 2.24586 20.3528 5.82563 20.7276 10.3953C20.7474 10.6403 20.7585 10.8866 20.7585 11.1291C20.7585 11.1984 20.7573 11.2664 20.756 11.3394C20.662 15.4364 17.8008 18.916 13.7978 19.8019C13.4922 19.87 13.1793 19.922 12.8675 19.9554C12.5434 19.9925 12.2107 20.0111 11.8804 20.0111C10.704 20.0111 9.56097 19.7834 8.48105 19.333C8.36105 19.2847 8.24353 19.2327 8.13343 19.1795L7.97263 19.1016L7.97139 19.0991Z"
                            fill="#00E510"
                          />
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-12 h-12 rounded-full bg-white border border-[#3e9bff] flex items-center justify-center"
                        onClick={handleEmailShare}
                      >
                        <svg
                          width="26"
                          height="20"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_54_4558)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1.75 2C0.783502 2 4.49654e-09 2.7835 4.49654e-09 3.75V4.48577C-0.000162957 4.49479 -0.000162567 4.50381 4.49654e-09 4.51282V12.25C4.49654e-09 13.2165 0.783501 14 1.75 14H14.25C15.2165 14 16 13.2165 16 12.25V4.51265C16.0002 4.50376 16.0002 4.49485 16 4.48594V3.75C16 2.7835 15.2165 2 14.25 2H1.75ZM14.5 4.07029V3.75C14.5 3.61193 14.3881 3.5 14.25 3.5H1.75C1.61193 3.5 1.5 3.61193 1.5 3.75V4.07029L8 7.88063L14.5 4.07029ZM1.5 5.80902V12.25C1.5 12.3881 1.61193 12.5 1.75 12.5H14.25C14.3881 12.5 14.5 12.3881 14.5 12.25V5.80902L8.37929 9.39702C8.14507 9.53432 7.85493 9.53432 7.62071 9.39702L1.5 5.80902Z"
                              fill="#3e9bff"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_54_4558">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col gap-2"
                  >
                    <h2 className="text-base font-normal text-gray-800">
                      or copy link
                    </h2>
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={window.location.href}
                        className="w-full h-11 rounded-md bg-[#f9f9f9] border border-[#cfcfcf] px-4 pr-16 text-gray-800"
                        readOnly
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-0 right-0 h-11 px-4 rounded-r-md bg-green-500 font-medium text-white flex items-center justify-center"
                        onClick={handleCopyLink}
                      >
                        Copy
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Container */}
      <div className="mt-[20px] text-center">
        {/* Title and Subtitle */}
        <h1 className="text-[20px] font-semibold text-gray-800 mt-4">
          {user.name}
        </h1>
        <div className="mt-[4px] text-center">
          <h3 className="text-gray-600 text-sm font-medium">
            @{user.username}
          </h3>
        </div>

        {/* Submissions Status */}
        <p className="text-gray-500 font-medium text-[15px] mt-[9px]">
          {user.location}
        </p>

        {/* Socials */}
        <div className="flex justify-center items-center my-[15px] space-x-3">
          {isValidLink(socialLinks?.twitter) && socialLinks?.twitter !== "" && (
            <motion.a
              href={socialLinks.twitter} // Now we are sure this is a string
              target="_blank"
              rel="noopener noreferrer"
              className="w-[39px] h-[39px] rounded-full bg-white border flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {/* Twitter SVG */}
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.77114 6.77143L15.5964 0H14.216L9.15792 5.87954L5.11803 0H0.458496L6.5676 8.8909L0.458496 15.9918H1.83898L7.18047 9.78279L11.4469 15.9918H16.1064L9.7708 6.77143H9.77114ZM7.88037 8.96923L7.26139 8.0839L2.33639 1.0392H4.45674L8.43127 6.7245L9.05025 7.60983L14.2167 14.9998H12.0963L7.88037 8.96957V8.96923Z"
                  fill="#8D96A0"
                />
              </svg>
            </motion.a>
          )}

          {isValidLink(socialLinks?.github) && socialLinks?.github !== "" && (
            <motion.a
              href={socialLinks.github} // Ensure it's a string
              target="_blank"
              rel="noopener noreferrer"
              className="w-[39px] h-[39px] rounded-full bg-white border flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {/* GitHub SVG */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C4.475 0 0 4.475 0 10C0 14.425 2.8625 18.1625 6.8375 19.4875C7.3375 19.575 7.525 19.275 7.525 19.0125C7.525 18.775 7.5125 17.9875 7.5125 17.15C5 17.6125 4.35 16.5375 4.15 15.975C4.0375 15.6875 3.55 14.8 3.125 14.5625C2.775 14.375 2.275 13.9125 3.1125 13.9C3.9 13.8875 4.4625 14.625 4.65 14.925C5.55 16.4375 6.9875 16.0125 7.5625 15.75C7.65 15.1 7.9125 14.6625 8.2 14.4125C5.975 14.1625 3.65 13.3 3.65 9.475C3.65 8.3875 4.0375 7.4875 4.675 6.7875C4.575 6.5375 4.225 5.5125 4.775 4.1375C4.775 4.1375 5.6125 3.875 7.525 5.1625C8.325 4.9375 9.175 4.825 10.025 4.825C10.875 4.825 11.725 4.9375 12.525 5.1625C14.4375 3.8625 15.275 4.1375 15.275 4.1375C15.825 5.5125 15.475 6.5375 15.375 6.7875C16.0125 7.4875 16.4 8.375 16.4 9.475C16.4 13.3125 14.0625 14.1625 11.8375 14.4125C12.2 14.725 12.5125 15.325 12.5125 16.2625C12.5125 17.6 12.5 18.675 12.5 19.0125C12.5 19.275 12.6875 19.5875 13.1875 19.4875C15.1727 18.8173 16.8977 17.5415 18.1198 15.8395C19.3419 14.1376 19.9995 12.0953 20 10C20 4.475 15.525 0 10 0Z"
                  fill="#8D96A0"
                />
              </svg>
            </motion.a>
          )}

          {isValidLink(socialLinks?.linkedin) &&
            socialLinks?.linkedin !== "" && (
              <motion.a
                href={socialLinks.linkedin} // Ensure it's a string
                target="_blank"
                rel="noopener noreferrer"
                className="w-[39px] h-[39px] rounded-full bg-white border flex items-center justify-center"
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                {/* GitHub SVG */}
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_31_4519)">
                    <path
                      d="M4.37647 2.44133C4.37629 2.83941 4.25732 3.22838 4.03479 3.55845C3.81225 3.88852 3.49629 4.14468 3.12733 4.29413C2.75836 4.44358 2.3532 4.47953 1.96369 4.39737C1.57418 4.31521 1.21805 4.11868 0.940883 3.83295C0.663716 3.54721 0.478125 3.18526 0.407864 2.79343C0.337604 2.4016 0.385871 1.99771 0.546487 1.63347C0.707104 1.26923 0.972762 0.961213 1.30946 0.748835C1.64615 0.536458 2.03856 0.429388 2.43647 0.44133C2.95643 0.456936 3.44986 0.674519 3.81205 1.04791C4.17424 1.42131 4.3767 1.92113 4.37647 2.44133ZM4.43647 5.92133H0.436466V18.4413H4.43647V5.92133ZM10.7565 5.92133H6.77647V18.4413H10.7165V11.8713C10.7165 8.21133 15.4865 7.87133 15.4865 11.8713V18.4413H19.4365V10.5113C19.4365 4.34133 12.3765 4.57133 10.7165 7.60133L10.7565 5.92133Z"
                      fill="#8D96A0"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_31_4519">
                      <rect
                        width="19"
                        height="18"
                        fill="white"
                        transform="translate(0.436523 0.441406)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </motion.a>
            )}
        </div>

        {/* communitites user involved in */}
        <div className="mt-5">
          {/* <h2 className="text-sm font-semibold text-gray-500 mb-2 text-start">
              Communities
            </h2> */}
          <div className="flex flex-wrap gap-[14px] text-center items-center justify-center">
            {user.communities ? (
              // If skills are a string, split it into an array
              user.communities.split(",").map((community, index) => (
                <div
                  key={index}
                  className="flex items-center gap-[8px] px-[10px] py-2 bg-[#e8fbeb] rounded-md"
                >
                  <span className="text-[15px] font-medium text-[#2ab664]">
                    {community.trim()} {/* Trim spaces from each skill */}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center items-center text-[15px] font-medium text-gray-600">
                No communities listed
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        {user?.id === usersession?.user?.id ? (
          <div className="flex items-center justify-center my-4">
            <Link href="/edit">
              <button className="flex items-center justify-center px-4 py-[6px] md:px-[18px] md:py-[9px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-sm md:text-base font-semibold">
                Edit Profile
                <ArrowRightCircleIcon className="h-6 w-6 ml-2 md:ml-[30px]" />
              </button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>

      <hr className="mt-[24px]" />

      {/* Profile Stats */}
      <div className="flex items-center justify-between mt-7">
        <div>
          <h2 className="text-[19px] font-semibold text-gray-700 text-center">
            {stats.earned}
          </h2>
          <h3 className="text-gray-600 text-[17px] font-normal text-center">
            Earned
          </h3>
        </div>
        <div>
          <h2 className="text-[19px] font-semibold text-gray-700 text-center">
            {stats.submissions}
          </h2>
          <h3 className="text-gray-600 text-[17px] font-normal text-center">
            Submissions
          </h3>
        </div>
        <div>
          <h2 className="text-[19px] font-semibold text-gray-700 text-center">
            {stats.won}
          </h2>
          <h3 className="text-gray-600 text-[17px] font-normal text-center">
            Won
          </h3>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-7">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-[13px]">
          {user.skills ? (
            // If skills are a string, split it into an array
            user.skills.split(",").map((skill, index) => (
              <div key={index} className="flex items-center gap-[8px]">
                <CheckBadgeIcon
                  className="text-[#2FCC71] w-[18px] h-[18px]"
                  style={{ strokeWidth: 2 }}
                />
                <span className="text-[15px] font-medium text-gray-600">
                  {skill.trim()} {/* Trim spaces from each skill */}
                </span>
              </div>
            ))
          ) : (
            <div className="text-[15px] font-medium text-gray-600">
              No skills listed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
