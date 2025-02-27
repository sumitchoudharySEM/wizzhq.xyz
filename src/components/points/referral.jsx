import React, { useState, useEffect } from "react";
import { ArrowUpTrayIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Referral = () => {
  const [referralData, setreferralData] = useState({
    referral_code: "",
    total_referrals: 0,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Generate the shareable link with referral code
  const generateShareableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    return `${baseUrl}/?ref=${referralData.referral_code}`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareableLink = generateShareableLink();
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy the link. Please try again.");
    }
  };

  const handleTwitterShare = () => {
    const shareText = encodeURIComponent("Join Wizz by clicking the link below!");
    const shareableLink = generateShareableLink();
    const referralURL = encodeURIComponent(shareableLink);
    const hashtags = encodeURIComponent("Wizz,Bounty,Growth,Explore");
    const twitterShareURL = `https://x.com/intent/tweet?text=${shareText}&url=${referralURL}&hashtags=${hashtags}`;

    window.open(twitterShareURL, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Join Wizz by clicking the link below!");
    const shareableLink = generateShareableLink();
    const body = encodeURIComponent(`Join Wizz by clicking the link below! ${shareableLink}`);
    const emailURL = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = emailURL;
  };

  const handleWhatsAppShare = () => {
    const shareableLink = generateShareableLink();
    const message = `Join Wizz by clicking the link below!\n\n${shareableLink}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await fetch("/api/points/referral");
        if (!response.ok) {
          throw new Error("Failed to fetch referral data");
        }
        const data = await response.json();
        setreferralData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  // if (loading) {
  //   return <div className="flex justify-center items-center">Loading...</div>;
  // }

  // if (error) {
  //   return <div className="text-red-500 text-center">Error loading points data</div>;
  // }

  return (
    <div>
      <div className="flex items-center justify-center gap-4 bg-[#F8FCF8] border-2 border-green-500 px-5 py-[6px] w-[fit-content] rounded-full">
        <UserPlusIcon
          className="w-5 h-5 text-[#2FCC71] mt-[2px]"
          strokeWidth={2}
        />
        <span className="text-xl md:text-2xl text-[#2FCC71] font-semibold">
          {referralData.total_referrals}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <h1 className="font-bold md:text-[22px] text-xl leading-5 text-gray-900">
          Referral Count
        </h1>
        <p className="font-normal text-base text-gray-500">
          Invite others and boost your points!
        </p>
      </div>

      <div className="flex flex-col gap-5 mt-8">
        <button
          onClick={handleCopyCode}
          className="bg-[#F8FCF8] w-full flex items-center justify-between rounded-md px-5 py-[10px] text-green-500 font-medium text-sm lg:text-base border-2 border-dashed border-green-500 hove transition duration-200 shadow hover:shadow-md"
        >
          <h1 className="text-lg md:text-xl text-green-900">
            {referralData.referral_code}
          </h1>
          <p className="text-sm text-gray-500">
            {copied ? "Copied!" : "Tap to Copy"}
          </p>
        </button>
        <button 
        onClick={openModal}
        className="w-full flex items-center justify-center px-4 py-3 rounded-md text-white gap-3 bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-md font-medium lg:font-normal text-sm lg:text-base">
          <ArrowUpTrayIcon className="w-5 h-5 text-white" strokeWidth={2} />
          <span className="font-medium">Invite Friends Now</span>
        </button>

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
                  Share Invite Link
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
                        value={generateShareableLink()}
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
      </div>
    </div>
  );
};

export default Referral;
