"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRightCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const PartnerProfile = () => {
  const [socialLinks, setSocialLinks] = useState(null);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  // Fetch partner data when component mounts
  useEffect(() => {
    const fetchPartnerData = async () => {
      const partnerUsername = pathname.split("/")[3];
      try {
        const response = await fetch(
          `/api/partners?username=${partnerUsername}`
        );
        if (response.ok) {
          const data = await response.json();
          setPartner(data);
        } else {
          console.error("Failed to fetch partner data");
        }
      } catch (error) {
        console.error("An error occurred while fetching partner data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [pathname]);

  // Fetch social_links
  useEffect(() => {
    if (partner?.partner?.social_links) {
      try {
        const parsedLinks = JSON.parse(partner.partner.social_links);
        setSocialLinks(parsedLinks);
      } catch (error) {
        console.error("Failed to parse social links:", error);
      }
    }
  }, [partner]);

  const isValidLink = (link) => typeof link === "string";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!partner) return <div>No partner data available</div>;

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

  // :React.FC<{ partner: partner | null }>

  //   if (!partner) {
  //     return <div>No partner data available</div>;
  //   }

  return (
    <div className="relative bg-white pt-6 pb-8 px-9 rounded-lg shadow-md w-full mx-auto">
      {/* partner Logo */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[60px] h-[60px] rounded-[8px] flex items-center justify-center">
        <img
          src={
            partner.partner.profile_photo_url
              ? partner.partner.profile_photo_url
              : undefined
          }
          alt="partner Logo"
          className="w-full h-full rounded-[8px] object-cover border border-gray-200 shadow-sm bg-white"
        />
      </div>

      {/* Container */}
      <div className="mt-[27px] text-center">
        {/* Title and Subtitle */}
        <h1 className="text-[18px] font-semibold text-gray-800 mt-4">
          {partner.partner.name}
          {/* Blinkit */}
        </h1>
        <div className="mt-[4px] text-center">
          <h3 className="text-gray-600 text-sm font-medium">
            @{partner.partner.username}
            {/* @blinkit */}
          </h3>
        </div>

        {/* Location */}
        <p className="text-gray-500 font-medium text-[15px] mt-[9px]">
          {partner.partner.location}
        </p>

        {/* Socials */}
        <div className="flex justify-center items-center my-[17px] space-x-3">
          {isValidLink(socialLinks?.twitter) && socialLinks?.twitter !=="" && (
            <motion.a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[36px] h-[36px] rounded-full bg-white border flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_31_4401)">
                  <path
                    d="M9.77114 6.77143L15.5964 0H14.216L9.15792 5.87954L5.11803 0H0.458496L6.5676 8.8909L0.458496 15.9918H1.83898L7.18047 9.78279L11.4469 15.9918H16.1064L9.7708 6.77143H9.77114ZM7.88037 8.96923L7.26139 8.0839L2.33639 1.0392H4.45674L8.43127 6.7245L9.05025 7.60983L14.2167 14.9998H12.0963L7.88037 8.96957V8.96923Z"
                    fill="#8D96A0"
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
          )}

          {isValidLink(socialLinks?.website) && socialLinks?.website !=="" && (
            <motion.a
              href={socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[36px] h-[36px] rounded-full bg-white border flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_441_6575)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.7714 3.625H2.13799C2.2101 2.58793 2.57078 1.74689 2.92844 1.15079C2.98754 1.05228 3.04668 0.96025 3.1046 0.87491C1.86126 1.23048 0.92271 2.308 0.7714 3.625ZM2.138 4.375H0.7714C0.92271 5.692 1.86129 6.76955 3.10464 7.1251C3.04672 7.03975 2.98756 6.9477 2.92844 6.84915C2.57078 6.25305 2.21011 5.41205 2.138 4.375ZM2.89013 4.375H5.10985C5.0396 5.24275 4.73547 5.95155 4.42844 6.4633C4.27531 6.7185 4.12249 6.92285 4 7.0711C3.8775 6.92285 3.72468 6.7185 3.57156 6.4633C3.26453 5.95155 2.96039 5.24275 2.89013 4.375ZM5.1099 3.625H2.89012C2.96038 2.75723 3.26452 2.04838 3.57156 1.53666C3.72468 1.28145 3.8775 1.07707 4 0.92885C4.12249 1.07707 4.27531 1.28145 4.42844 1.53666C4.73547 2.04838 5.0396 2.75723 5.1099 3.625ZM5.862 4.375C5.7899 5.41205 5.4292 6.25305 5.07155 6.84915C5.01245 6.9477 4.95328 7.03975 4.89535 7.1251C6.1387 6.76955 7.0773 5.692 7.2286 4.375H5.862ZM7.2286 3.625H5.862C5.7899 2.58793 5.4292 1.74689 5.07155 1.15079C5.01245 1.05228 4.95331 0.96025 4.8954 0.874905C6.13875 1.23048 7.0773 2.308 7.2286 3.625ZM4 0C1.79086 0 0 1.79086 0 4C0 6.20915 1.79086 8 4 8C6.20915 8 8 6.20915 8 4C8 1.79086 6.20915 0 4 0Z"
                    fill="#868786"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_441_6575">
                    <rect width="8" height="8" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </motion.a>
          )}

          {isValidLink(socialLinks?.telegram) && socialLinks?.telegram !=="" && (
            <motion.a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[36px] h-[36px] rounded-full bg-white border flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                width="41"
                height="41"
                viewBox="0 0 41 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1081 16.0288C19.4465 16.7199 16.1256 18.1504 11.1455 20.3201C10.3368 20.6417 9.91318 20.9563 9.87461 21.2639C9.80944 21.7838 10.4605 21.9886 11.3471 22.2673L11.3472 22.2674C11.4678 22.3053 11.5927 22.3446 11.7207 22.3862C12.593 22.6697 13.7663 23.0014 14.3762 23.0146C14.9295 23.0266 15.5471 22.7985 16.2289 22.3303C20.882 19.1893 23.2839 17.6017 23.4347 17.5675C23.5411 17.5433 23.6885 17.513 23.7884 17.6018C23.8883 17.6905 23.8785 17.8587 23.8679 17.9038C23.8034 18.1787 21.2478 20.5547 19.9252 21.7843L19.9251 21.7843C19.5129 22.1676 19.2205 22.4395 19.1607 22.5015C19.0268 22.6406 18.8903 22.7722 18.7591 22.8987L18.7591 22.8987C17.9488 23.6799 17.3411 24.2657 18.7927 25.2223C19.4903 25.682 20.0486 26.0621 20.6055 26.4414C21.2137 26.8556 21.8203 27.2687 22.6052 27.7832C22.8051 27.9142 22.9961 28.0504 23.1821 28.183L23.1821 28.183C23.8899 28.6876 24.5258 29.141 25.3114 29.0687C25.7679 29.0267 26.2394 28.5974 26.4789 27.3172C27.0448 24.2917 28.1573 17.7364 28.4144 15.0352C28.4369 14.7985 28.4086 14.4956 28.3858 14.3627C28.3631 14.2297 28.3155 14.0403 28.1427 13.9C27.938 13.7339 27.622 13.6989 27.4807 13.7013C26.8382 13.7127 25.8523 14.0555 21.1081 16.0288Z"
                  stroke="#868786"
                  stroke-width="1.70833"
                  stroke-linejoin="round"
                />
              </svg>
            </motion.a>
          )}

          {isValidLink(socialLinks?.discord) && socialLinks?.discord !=="" && (
            <motion.a
              href={socialLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[36px] h-[36px] rounded-full bg-white border flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_210_6077)">
                  <path
                    d="M40.634 8.31212C37.5747 6.90836 34.294 5.87413 30.8638 5.28178C30.8013 5.27035 30.7389 5.29892 30.7067 5.35606C30.2848 6.10649 29.8175 7.08549 29.4902 7.85497C25.8008 7.30264 22.1304 7.30264 18.5166 7.85497C18.1893 7.06838 17.705 6.10649 17.2811 5.35606C17.249 5.30083 17.1866 5.27226 17.1241 5.28178C13.6958 5.87224 10.4151 6.90647 7.35387 8.31212C7.32737 8.32355 7.30465 8.34261 7.28958 8.36736C1.06678 17.6641 -0.6379 26.7323 0.19836 35.6881C0.202144 35.7319 0.22674 35.7738 0.260796 35.8004C4.36642 38.8155 8.34341 40.6459 12.2466 41.8592C12.309 41.8783 12.3752 41.8554 12.415 41.804C13.3383 40.5431 14.1613 39.2136 14.867 37.8156C14.9086 37.7337 14.8688 37.6365 14.7837 37.6042C13.4783 37.1089 12.2352 36.5052 11.0395 35.8195C10.9449 35.7643 10.9373 35.629 11.0243 35.5642C11.2759 35.3757 11.5276 35.1795 11.7679 34.9814C11.8114 34.9452 11.872 34.9376 11.9231 34.9604C19.7786 38.547 28.2831 38.547 36.0459 34.9604C36.097 34.9357 36.1576 34.9433 36.203 34.9795C36.4433 35.1776 36.6949 35.3757 36.9484 35.5642C37.0354 35.629 37.0298 35.7643 36.9352 35.8195C35.7394 36.5185 34.4964 37.1089 33.189 37.6023C33.1039 37.6347 33.0661 37.7337 33.1077 37.8156C33.8285 39.2117 34.6515 40.5412 35.5578 41.8021C35.5957 41.8554 35.6637 41.8783 35.7262 41.8592C39.6483 40.6459 43.6252 38.8155 47.7309 35.8004C47.7668 35.7738 47.7895 35.7338 47.7933 35.69C48.7942 25.3361 46.117 16.3423 40.6964 8.36925C40.6832 8.34261 40.6605 8.32355 40.634 8.31212ZM16.04 30.2349C13.675 30.2349 11.7263 28.0637 11.7263 25.3971C11.7263 22.7305 13.6372 20.5592 16.04 20.5592C18.4617 20.5592 20.3916 22.7496 20.3538 25.3971C20.3538 28.0637 18.4428 30.2349 16.04 30.2349ZM31.9895 30.2349C29.6245 30.2349 27.6758 28.0637 27.6758 25.3971C27.6758 22.7305 29.5867 20.5592 31.9895 20.5592C34.4113 20.5592 36.3411 22.7496 36.3033 25.3971C36.3033 28.0637 34.4113 30.2349 31.9895 30.2349Z"
                    fill="#868786"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_210_6077">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </motion.a>
          )}
        </div>

        {/* Edit Profile Button */}
        <div className="flex items-center justify-center my-4">
          <Link href="/dashboard/edit">
            <motion.button
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.95 }} 
              transition={{ duration: 0.2 }} 
              className="flex items-center justify-center px-4 py-[6px] md:px-4 md:py-[9px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-[15px] font-semibold"
            >
              Edit Profile
              <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-[32px]" />
            </motion.button>
          </Link>
        </div>
      </div>

      <hr className="mt-[22px]" />

      {/* Profile Stats */}
      {/* <div className="flex items-center justify-between mt-5">
        <div>
          <h2 className="text-[16.5px] font-semibold text-gray-700">$0</h2>
          <h3 className="text-gray-600 text-[15px] font-normal">Rewards</h3>
        </div>
        <div>
          <h2 className="text-[16.5px] font-semibold text-gray-700">0</h2>
          <h3 className="text-gray-600 text-[15px] font-normal">Listings</h3>
        </div>
        <div>
          <h2 className="text-[16.5px] font-semibold text-gray-700">0</h2>
          <h3 className="text-gray-600 text-[15px] font-normal">Submissions</h3>
        </div>
      </div> */}

      {/* industry */}
      <div className="mt-5 mb-5">
        <h2 className="text-[14px] font-semibold text-gray-700 mb-1">
          Industry
        </h2>
        <h3 className="text-gray-600 text-[15px] font-normal">
          {partner.partner.industry_name}
        </h3>
      </div>

      {/* Bio */}
      <div>
        <h2 className="text-[14px] font-semibold text-gray-700 mb-1">Bio</h2>
        <h3 className="text-gray-600 text-[15px] font-normal">
          {partner.partner.bio}
        </h3>
      </div>
    </div>
  );
};

export default PartnerProfile;
