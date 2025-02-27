"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { tokensList } from "@/lib/options";
import { motion } from "framer-motion";

const SingleJob = ({ key, job }) => {
  const isDashboard = usePathname().startsWith("/dashboard");
  const isAdmin = usePathname().startsWith("/admin");
  const [partner, setPartner] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState("");
  const [reward, setReward] = React.useState(0);
  const [tokenImage, setTokenImage] = React.useState("");

  const calculateTimeLeft = () => {
    const endDate = new Date(job.end_date);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffTime < 0) {
      return "Ended";
    } else if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffHours > 0) {
      return `${diffHours} hours left`;
    } else {
      return "Ending soon";
    }
  };

  // format to remove decimals
  const formatAmount = (amount) => {
    return Math.round(parseFloat(amount));
  };

  const getTokenImg = () => {
    const tokenImg = tokensList[job.reward] || " ";
    setTokenImage(tokenImg);
  };

  const showToken =
    job.payment_type === "range" || job.payment_type === "fixed";

  //get partner from the listing.partner_id
  const fetchPartner = async () => {
    try {
      const response = await fetch(
        `/api/partners_listing/partner?id=${job.partner_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setPartner(data.partner || null);
    } catch (error) {
      console.error("Error fetching partner data:", error);
      return null;
    }
  };

  React.useEffect(() => {
    fetchPartner();
    getTokenImg();
    setTimeLeft(calculateTimeLeft());

    // Update time left every minute
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  if (!partner) {
    return (
      <div
        id={key}
        className="flex flex-col w-full max-w-full gap-3 animate-pulse"
      >
        <div className="flex items-center gap-2 w-full">
          <div className="w-16 h-16 bg-gray-200 rounded-[10px]" />
          <div className="bg-gray-200 flex-1 h-16 rounded-[10px]" />
        </div>
        <div className="bg-gray-200 h-[235px] rounded-[10px]" />
      </div>
    );
  }

  if (job && partner) {
    return (
      <motion.div
        id={key}
        className="flex flex-col w-full min-w-0 gap-3"
        initial={{ opacity: 0 }} // Start with 0 opacity
        animate={{ opacity: 1 }} // Fade in
        exit={{ opacity: 0 }} // Fade out when removed
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileHover={{
          scale: 1.02, // Slight zoom on hover
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={
            isAdmin
              ? "/admin/hirings/" + job.slug
              : isDashboard
              ? "/dashboard/hirings/" + job.slug
              : "/hirings/" + job.slug
          }
          className="block w-full"
        >
          <div className="flex items-center gap-2 w-full">
            <div className="w-16 h-16 rounded-[10px] border flex-shrink-0">
              <Image
                src={partner?.profile_photo_url}
                width={64}
                height={64}
                alt="partner Logo"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div className="bg-white flex items-center flex-1 h-16 rounded-[10px] border overflow-hidden px-3 sm:px-5 py-2 min-w-0">
              <h1 className="text-sm md:text-base font-medium text-[#3e3e3e] line-clamp-2 break-words">
                {job.title}
              </h1>
            </div>
          </div>
        </Link>
        <Link
          href={
            isAdmin
              ? "/admin/hirings/" + job.slug
              : isDashboard
              ? "/dashboard/hirings/" + job.slug
              : "/hirings/" + job.slug
          }
          className="block w-full"
        >
          <div className="bg-white h-[235px] rounded-[10px] border px-3 sm:px-5 py-5 flex flex-col gap-7 justify-between overflow-hidden">
            <div>
              <div className="text-[#3e3e3e] flex flex-wrap gap-2 sm:gap-5 items-start justify-start">
                <h2 className="font-medium text-sm sm:text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                  {partner ? partner.name : ""}
                </h2>
                <h2 className="font-medium text-sm sm:text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                  {job.type?.charAt(0)?.toUpperCase() + job.type?.slice(1) ||
                    ""}{" "}
                </h2>
                <h2 className="font-medium text-sm sm:text-base border-l-2 border-[#2fcc71] pl-2 flex-shrink-0">
                  {timeLeft}
                </h2>
              </div>
              <p className="text-[14px] sm:text-[15px] leading-6 text-[#3e3e3e] mt-[1.5rem] line-clamp-3 md:line-clamp-2 lg:line-clamp-3 break-words">
                {job.short_description}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] sm:text-[16px] text-[#3e3e3e] font-semibold">
                Reward
              </span>
              <div className="flex gap-2 items-center justify-center">
                {showToken && (
                  <img
                    src={tokenImage}
                    alt="token logo"
                    className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] object-cover"
                  />
                )}
                <span className="text-[16px] sm:text-[19px] text-[#2fcc71] font-semibold">
                  {job.payment_type === "range"
                    ? `${formatAmount(job.min_amount)}-${formatAmount(
                        job.max_amount
                      )}`
                    : job.payment_type === "fixed"
                    ? `${formatAmount(job.fixed_amount)}`
                    : job.payment_type === "quote"
                    ? "Propose"
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }
};

export default SingleJob;
