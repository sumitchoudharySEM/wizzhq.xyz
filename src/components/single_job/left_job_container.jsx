"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  ArrowRightCircleIcon,
  CheckBadgeIcon,
  ShareIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  ClockIcon,
  WalletIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import JobSubmission from "@/components/jobs/job_submission.jsx";
import { useParams } from "next/navigation";
import Image from "next/image";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { tokensList } from "@/lib/options";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/lib/constants";

const LeftJobContainer = ({
  loading,
  setLoading,
  display,
  setDisplay,
  verified,
  setVerified,
  isAdmin,
}) => {
  // console.log('isAdmin prop value:', isAdmin);
  const [job, setJob] = useState();
  const { data: session, status } = useSession();
  const [partner, setPartner] = useState(null);
  const { job_id } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [mySubmission, setMySubmission] = useState();
  const [totalSubmission, setTotalSubmission] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [jobStatus, setJobStatus] = useState("Submissions Open");
  const [isExpired, setIsExpired] = useState(false);
  const [tokenImage, setTokenImage] = useState("");
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const pathname = usePathname();

  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/jobs/create_job?slug=${job_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.job == null || data.job == undefined) {
        setJob(null);
        setLoading(false);
        setDisplay(false);
      } else if (
        data.job.verified == 0 &&
        !pathname.split("/").includes("dashboard") &&
        !isAdmin // Admin can view unverified bounties
      ) {
        setJob(data.job);
        setDisplay(false);
        setLoading(false);
        setVerified(0);
      } else {
        setJob(data.job);
        setVerified(data.job.verified == 0 ? 0 : 1);
        // Don't set loading false here - wait for partner data
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      setLoading(false);
      setDisplay(false);
    }
  };

  const fetchPartner = async () => {
    if (!job?.partner_id) return;

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
      setPartner(data.partner);
      setDisplay(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching partner data:", error);
      setLoading(false);
      setDisplay(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/jobs/submissions?job=${job.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to get submissions");
        throw new Error(data.error || "Failed to update user");
      }
  
      if (data.submissions) {
        const allMySub = data.submissions.filter(
          (submission) => submission.user_id === session?.user?.id
        );
  
        if (allMySub.length > 0) {
          const mySub = allMySub[0];
  
          // Safely parse or assign default_answers
          try {
            mySub.default_answers =
              typeof mySub.default_answers === "string"
                ? JSON.parse(mySub.default_answers)
                : mySub.default_answers || {};
          } catch (parseError) {
            console.error("Error parsing default_answers:", parseError);
            mySub.default_answers = {}; // Fallback to empty object
            toast.error("Invalid default answers format");
          }
  
          // Safely parse or assign questionnaire_answers
          try {
            mySub.questionnaire_answers =
              typeof mySub.questionnaire_answers === "string"
                ? JSON.parse(mySub.questionnaire_answers)
                : mySub.questionnaire_answers || {};
          } catch (parseError) {
            console.error("Error parsing questionnaire_answers:", parseError);
            mySub.questionnaire_answers = {}; // Fallback to empty object
            toast.error("Invalid questionnaire answers format");
          }
  
          setMySubmission(mySub);
          console.log("Parsed submission:", mySub);
        }
  
        setTotalSubmission(data.submissions.length);
      } else {
        throw new Error(data.message || "Failed to get submissions data");
      }
    } catch (error) {
      console.error("Failed to get submissions data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to get submissions data. Please try again."
      );
    }
  };

  const openModal = () => {
    if (!isExpired) {
      setModalOpen(true);
    }
  };

  const closeModal = () => setModalOpen(false);

  // share bounty modal
  const openShareModal = () => setShareModalOpen(true);
  const closeShareModal = () => setShareModalOpen(false);

  // func to share the url of the job
  const getShareURL = () => {
    const baseURL = "wizzhq.xyz";
    return `https://${baseURL}/hirings/${job_id}`;
  };

  // func to share the text of the bounty in correct format
  const getShareText = (prefix = "") => {
    return job?.title
      ? `${prefix}${job.title}" on Wizz!`
      : "Check out this awesome job on Wizz!";
  };

  const handleCopyLink = async () => {
    try {
      const shareURL = getShareURL();
      await navigator.clipboard.writeText(shareURL);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy the link. Please try again.");
    }
  };

  const handleTwitterShare = () => {
    const shareText = encodeURIComponent(getShareText('Check out this job "'));
    const shareURL = encodeURIComponent(getShareURL());
    const hashtags = encodeURIComponent("Wizz,Job,Growth,Web3");
    const twitterShareURL = `https://x.com/intent/tweet?text=${shareText}&url=${shareURL}&hashtags=${hashtags}`;

    window.open(twitterShareURL, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(getShareText("Job: "));
    const body = encodeURIComponent(
      `Check out this exciting job on Wizz! ${getShareURL()}`
    );
    const emailURL = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = emailURL;
  };

  const handleWhatsAppShare = () => {
    const message = `${getShareText(
      'Check out this job "'
    )} \n\n${getShareURL()}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const endDate = job ? new Date(job.end_date) : new Date();
    const timeDifference = endDate - now;

    if (timeDifference > 0) {
      setTimeLeft({
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((timeDifference / (1000 * 60)) % 60),
        seconds: Math.floor((timeDifference / 1000) % 60),
      });
      setIsExpired(false);
      setJobStatus("Applications Open");
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsExpired(true);
      setJobStatus("Applications Closed");
    }
  };

  // format to remove decimals
  const formatAmount = (amount) => {
    return Math.round(parseFloat(amount));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (job && job !== null && job !== undefined) {
      fetchPartner();
      fetchSubmissions();
      calculateTimeLeft();

      const timerInterval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [job]); // Only depend on job changes

  useEffect(() => {}, [mySubmission]);

  if (job && partner?.id) {
    return (
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full">
        {/* partner Logo */}
        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 w-[4rem] h-[4rem] rounded-[9px] border border-gray-200 shadow-sm bg-white flex items-center justify-center">
          <Image
            src={partner.profile_photo_url}
            alt="partner Logo"
            width={"64"}
            height={"64"}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openShareModal}
            className="p-[10px] rounded-full bg-white border border-gray-200 shadow-sm absolute top-3 right-3"
          >
            <ShareIcon className="w-[18px] h-[18px] text-[#757d85]" />
          </motion.button>
        </div>

        <AnimatePresence>
          {isShareModalOpen && (
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
                  onClick={closeShareModal}
                >
                  <XMarkIcon
                    className="h-6 w-6 text-gray-600"
                    strokeWidth={2}
                  />
                </motion.button>
                <div className="p-6 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Share Profile
                  </h2>
                  <hr className="my-3" />

                  {pathname.includes("/dashboard") && verified === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-2"
                    >
                      <div className="flex items-start space-x-2">
                        <ExclamationTriangleIcon
                          className="w-9 h-9 text-amber-600"
                          strokeWidth={2}
                        />
                        <div className="mt-[2px]">
                          <h3 className="text-amber-800 font-medium text-lg">
                            Job Pending Verification
                          </h3>
                          <p className="text-amber-700 mt-1 text-[15px]">
                            This job is currently under review. You'll be able
                            to share it once it's verified by our team, which
                            may take up to 2 days.
                          </p>
                          <p className="text-amber-700 text-sm mt-3">
                            Need assistance?{" "}
                            <a
                              href={`mailto:${CONTACT.EMAIL}`}
                              className="text-amber-900 underline hover:text-amber-800"
                            >
                              Contact our support team
                            </a>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
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
                            value={getShareURL()}
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
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Container */}
        <div className="mt-[35px] text-center">
          {/* Title and Subtitle */}
          <h1 className="text-[18px] font-bold text-gray-800 mt-4">
            {job.title}
          </h1>

          <div className="mt-[10px] flex items-center gap-[14px] justify-center">
            <p className="text-[14px] font-medium text-gray-500">
              {partner.name}
            </p>
            <p className="text-[14px] font-medium text-gray-500">|</p>
            <p className="text-[14px] font-medium text-gray-500">
              {job.type?.charAt(0)?.toUpperCase() + job.type?.slice(1) || ''}
            </p>
            <p className="text-[14px] font-medium text-gray-500">|</p>
            <p className="text-[14px] font-medium text-gray-500">
              {job.location || "Global"}
            </p>
          </div>

          <div className="mt-[10px] flex items-center gap-[14px] justify-center">
            <p className="text-[14px] font-medium text-gray-500">
              {job.job_type}
            </p>
            <p className="text-[14px] font-medium text-gray-500">|</p>
            <p className="text-[14px] font-medium text-gray-500">
              {job.duration}
            </p>
          </div>

          {/* Submissions Status */}
          <p className="text-[#16A800] font-semibold text-[16px] mt-[10px]">
            {jobStatus}
          </p>

          {/* No. of Submissions */}
          <p className="text-[#242424] font-normal text-[16px] mb-3 mt-2">
            {totalSubmission}{" "}
            {totalSubmission > 1 ? "Applications" : "Application"}{" "}
          </p>

          {/* Apply Button */}
          <div className="flex items-center justify-center">
            {!isExpired && status !== "authenticated" ? (
              <Link href="/signin">
                <button
                  className={`flex items-center justify-center px-4 py-2 md:px-5 md:py-[11px] text-white rounded-full transition duration-200 shadow hover:shadow-lg text-sm md:text-[15px] font-semibold bg-green-500 hover:bg-[#2FCC71] `}
                >
                  Signin to Apply
                  <ArrowRightCircleIcon className="h-5 w-5 ml-4  md:ml-[10px]" />
                </button>
              </Link>
            ) : (
              <button
                onClick={
                  !isExpired && status === "authenticated" ? openModal : null
                }
                disabled={isExpired}
                className={`flex items-center justify-center px-4 py-2 md:px-5 md:py-[11px] text-white rounded-full transition duration-200 shadow hover:shadow-lg text-sm md:text-[15px] font-semibold ${
                  isExpired || status !== "authenticated"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-[#2FCC71]"
                }`}
              >
                {isExpired ? (
                  "Applications Closed"
                ) : (
                  <>
                    {status === "authenticated" && session?.user?.email ? (
                      <>
                        {mySubmission && mySubmission.id
                          ? "Edit Application"
                          : "Apply Now"}
                      </>
                    ) : (
                      "Signin to Apply"
                    )}
                  </>
                )}
                {!isExpired && status === "authenticated" && (
                  <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-[28px]" />
                )}
              </button>
            )}
          </div>
        </div>

        <hr className="mt-[20px]" />

        {/* Countdown Timer */}
        <div className="mt-4 text-gray-800 font-semibold text-center">
          <div className="flex items-center justify-center gap-3">
            <div>
              <p className="text-[21px]">
                {String(timeLeft.days).padStart(2, "0")}
              </p>
              <p className="text-[10px] text-gray-500">DAYS</p>
            </div>
            <div className="mb-5 text-xl">:</div>
            <div>
              <p className="text-[21px]">
                {String(timeLeft.hours).padStart(2, "0")}
              </p>
              <p className="text-[10px] text-gray-500">HOURS</p>
            </div>
            <div className="mb-5 text-xl">:</div>
            <div>
              <p className="text-[21px]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </p>
              <p className="text-[10px] text-gray-500">MINUTES</p>
            </div>
            <div className="mb-5 text-xl">:</div>
            <div>
              <p className="text-[21px]">
                {String(timeLeft.seconds).padStart(2, "0")}
              </p>
              <p className="text-[10px] text-gray-500">SECONDS</p>
            </div>
          </div>
        </div>

        <hr className="mt-[18px]" />

        {job.payment_type !== "quote" ? (
          <>
            {/* positions available & payment period for range/fixed types */}
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-[#F8FAFC] rounded-lg p-[18px] lg:p-4 space-y-2 shadow drop-shadow-sm shadow-gray-200">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-[18px] w-[18px] text-gray-500" />
                  <span className="text-sm text-gray-500 font-medium">
                    Positions
                  </span>
                </div>
                <p className="text-[18px] font-semibold text-gray-800">
                  {job.position} Available
                </p>
              </div>
              <div className="bg-[#F8FAFC] rounded-lg p-[18px] lg:p-4 space-y-2 shadow drop-shadow-sm shadow-gray-200">
                <div className="flex items-center gap-2 text-gray-800">
                  <ClockIcon className="h-[18px] w-[18px] text-gray-500" />
                  <span className="text-sm text-gray-500 font-medium">
                    Pay. Cycle
                  </span>
                </div>
                <p className="text-[18px] font-semibold text-gray-800">
                  {job.payment_period.charAt(0).toUpperCase() +
                    job.payment_period.slice(1)}
                </p>
              </div>
            </div>

            {/* payment token & range/fixed amount */}
            <div className="bg-[#F8FAFC] rounded-lg p-[18px] lg:p-4 space-y-4 mb-6 shadow drop-shadow-sm shadow-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-[18px] w-[18px] text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Payment Token
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{job.reward}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Payment
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {job.payment_type === "range"
                      ? `${formatAmount(job.min_amount)}-${formatAmount(job.max_amount)}`
                      : `${formatAmount(job.fixed_amount)}`}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          //    Combined container for quote type
          <div className="bg-[#F8FAFC] rounded-lg p-[18px] lg:p-4 space-y-4 my-6 shadow drop-shadow-sm shadow-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UsersIcon className="h-[18px] w-[18px] text-gray-500" />
                <span className="text-sm text-gray-500 font-medium">
                  Positions
                </span>
              </div>
              <p className="font-semibold text-gray-800">
                {job.position} Available
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WalletIcon className="h-[18px] w-[18px] text-gray-500" />
                <span className="text-sm font-medium text-gray-500">
                  Payment Token
                </span>
              </div>
              <p className="font-semibold text-gray-900">{job.reward}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">
                  Payment
                </span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">Propose</span>
              </div>
            </div>
          </div>
        )}

        <hr />

        {/* Skills and Contact Section */}
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-[12px]">
            {job.skills.split(",").map((skill, index) => (
              <div className="flex items-center gap-[8px]" key={index}>
                <CheckBadgeIcon
                  className="text-[#2FCC71] w-[17px] h-[17px]"
                  style={{ strokeWidth: 2 }}
                />
                <span className="text-[14px] font-medium text-gray-600">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Contact</h2>
          <p className="text-[14px] font-normal text-gray-600">
            Reach out here if you have any query regarding the listing.
          </p>
          <a
            href={job.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-semibold text-[#2FCC71] mt-1 block"
          >
            {job.contact}
          </a>
        </div>

        {/* Render the modal conditionally */}
        {isModalOpen && (
          <JobSubmission
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            jobId={job.id}
            jobSlug={job.slug}
            mySubmission={mySubmission}
            job={job}
          />
        )}
      </div>
    );
  }
  return null;
};

// Add PropTypes for type-checking
LeftJobContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  display: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  setDisplay: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

export default LeftJobContainer;
