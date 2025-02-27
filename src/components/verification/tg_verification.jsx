import React, { useState, useEffect } from "react";
import {
  AtSymbolIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const TgVerification = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    telegram_username: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(null); 

  // Function to handle verification
  const handleVerification = async () => {
    if (!formData.telegram_username) {
      toast.error("Please enter a Telegram username");
      return;
    }

    try {
      const response = await fetch("/api/verification_request/tg_verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telegramUsername: formData.telegram_username,
        }),
      });

      if (!response.ok) {
        throw new Error("Verification request failed");
      }

      const { verificationCode, botUsername } = await response.json();

      // Set the verification code to state
      setVerificationCode(verificationCode);

      // Create the Telegram bot URL with the verification code
      const telegramBotUrl = `https://t.me/wizzhq_bot?start=${verificationCode}`;

      // setIsModalOpen(false);

      // Show a success message
      toast.success(
        <div className="space-y-1">
          <p>Redirecting you to Telegram...</p>
          <p className="text-sm">Verification code: {verificationCode}</p>
        </div>,
        {
          autoClose: 3000,
        }
      );

      // Redirect to Telegram bot
      window.open(telegramBotUrl, "_blank");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to start verification. Please try again.");
    }
  };
  
  // Handle copying verification code to clipboard
  const handleCopyCode = async () => {
    if (!verificationCode) {
      toast.error("Verification code is not available yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(verificationCode);
      toast.success("Verification code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy the verification code.");
    }
  };

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await fetch("/api/verification_request/tg_verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        //if data.isVerified is true, set isVerified to true
        if (data.isVerified) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }

      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch verification status.");
      }
    };

    // Call the check verification status API on component mount
    checkVerificationStatus();
  }, []);

  return (
    <>
      <div className="relative flex flex-col gap-3">
        <div className="flex gap-3 justify-between items-center mb-5">
          <div className="flex gap-3 items-center">
            <div className="absolute left-[-24px] md:left-[-32px] top-[0.05rem] bg-[#00B0F2] w-2 h-11 rounded-r-md"></div>
            <div className="w-11 h-11 rounded-full flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.0528 48.0073H23.9472C10.7428 48.0073 0 37.2613 0 24.053V23.9474C0 10.7392 10.7428 -0.00683594 23.9472 -0.00683594H24.0528C37.2572 -0.00683594 48 10.7392 48 23.9474V24.053C48 37.2613 37.2572 48.0073 24.0528 48.0073ZM23.9472 1.61839C11.6381 1.61839 1.62475 11.6347 1.62475 23.9474V24.053C1.62475 36.3658 11.6381 46.3821 23.9472 46.3821H24.0528C36.3619 46.3821 46.3753 36.3658 46.3753 24.053V23.9474C46.3753 11.6347 36.3619 1.61839 24.0528 1.61839H23.9472Z"
                  fill="#00B0F2"
                />
                <path
                  d="M11.582 23.9772C11.6329 23.9518 11.6837 23.9276 11.7333 23.9047C12.5956 23.5052 13.4693 23.1312 14.3418 22.7572C14.3888 22.7572 14.4677 22.7025 14.5122 22.6847C14.5796 22.6554 14.647 22.6274 14.7144 22.5982C14.8441 22.5422 14.9739 22.4875 15.1023 22.4315C15.3617 22.3208 15.6199 22.2102 15.8793 22.0995C16.397 21.8781 16.9146 21.6568 17.4322 21.4342C18.4674 20.9914 19.5039 20.5475 20.5392 20.1048C21.5744 19.662 22.6109 19.218 23.6461 18.7753C24.6814 18.3326 25.7179 17.8886 26.7531 17.4459C27.7883 17.0032 28.8249 16.5592 29.8601 16.1165C30.0903 16.0173 30.3396 15.8697 30.5863 15.8265C30.7936 15.7896 30.9958 15.7183 31.2043 15.6789C31.5999 15.6038 32.0361 15.5733 32.4151 15.7374C32.5461 15.7947 32.6669 15.8748 32.7674 15.9753C33.2481 16.4511 33.1807 17.2322 33.079 17.9014C32.3706 22.5651 31.6622 27.2301 30.9525 31.8938C30.8559 32.5337 30.7236 33.236 30.2187 33.6405C29.7914 33.9827 29.1835 34.0209 28.6557 33.8759C28.1279 33.7296 27.6624 33.423 27.2059 33.1215C25.3122 31.8671 23.4172 30.6128 21.5235 29.3584C21.0733 29.0607 20.5723 28.6715 20.5773 28.1308C20.5799 27.8051 20.7745 27.5151 20.9728 27.2568C22.6185 25.1094 24.993 23.6337 26.7595 21.5855C27.0087 21.2968 27.2046 20.7752 26.8625 20.6085C26.659 20.5093 26.425 20.6441 26.2393 20.7726C23.9043 22.3946 21.5706 24.0179 19.2356 25.6399C18.4738 26.1691 17.6751 26.7136 16.7569 26.8434C15.9353 26.9604 15.1087 26.7314 14.3138 26.4973C13.6474 26.3014 12.9822 26.1004 12.3196 25.8931C11.9673 25.7837 11.6036 25.6653 11.3314 25.4173C11.0593 25.1692 10.9029 24.7519 11.0669 24.4212C11.1699 24.2138 11.3696 24.0828 11.5795 23.9759L11.582 23.9772Z"
                  fill="#00B0F2"
                />
              </svg>
            </div>
          </div>
          <div>
            {/* if setisVerified is false then show verify now, if it is true then make it disabled and write verified   */}
            {isVerified === false ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex px-6 py-[10px] rounded-md text-[#00B0F2] hover:text-white bg-transparent items-center gap-2 border border-[#00B0F2] hover:bg-[#00B0F2] transition duration-200 shadow hover:shadow-lg font-medium lg:font-normal text-sm text-medium lg:text-base lg:text-normal"
              >
                <CheckBadgeIcon className="w-5 h-5 font-medium" />
                Verify Now
              </button>
            ) : isVerified === true ? (
              <button
                className="flex px-6 py-[10px] rounded-md text-[#00B0F2] bg-transparent items-center gap-2 border border-[#00B0F2] font-medium lg:font-normal text-sm text-medium lg:text-base lg:text-normal cursor-not-allowed"
                disabled
              >
                <CheckBadgeIcon className="w-5 h-5 font-medium" />
                Already Verified
              </button>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-[#0F172A] text-xl md:text-2xl font-bold">
            Verify Your Telegram Username
          </h1>
          <p className="text-base font-normal text-[#737791]">
            Connect your telegram account to earn points for every task you
            complete!
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-7 w-full max-w-md mx-4 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Modal content */}
            <div className="space-y-6">
              {/* Telegram icon */}
              <div className="flex justify-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center">
                  <svg
                    width="62"
                    height="62"
                    viewBox="0 0 62 62"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M31.0591 62H30.9227C13.8721 62 0 48.1238 0 31.0682V30.9318C0 13.8762 13.8721 0 30.9227 0H31.0591C48.1097 0 61.9817 13.8762 61.9817 30.9318V31.0682C61.9817 48.1238 48.1097 62 31.0591 62ZM30.9227 2.09864C15.0281 2.09864 2.09802 15.0325 2.09802 30.9318V31.0682C2.09802 46.9675 15.0281 59.9014 30.9227 59.9014H31.0591C46.9537 59.9014 59.8837 46.9675 59.8837 31.0682V30.9318C59.8837 15.0325 46.9537 2.09864 31.0591 2.09864H30.9227Z"
                      fill="#00B0F2"
                    />
                    <path
                      d="M14.9556 30.9697C15.0213 30.9368 15.087 30.9056 15.1511 30.8761C16.2645 30.3602 17.3927 29.8773 18.5193 29.3943C18.5801 29.3943 18.6818 29.3237 18.7393 29.3007C18.8264 29.2629 18.9134 29.2268 19.0005 29.189C19.168 29.1167 19.3355 29.0461 19.5013 28.9738C19.8364 28.8309 20.1697 28.6879 20.5047 28.545C21.1731 28.2592 21.8415 27.9734 22.5099 27.6859C23.8467 27.1142 25.1851 26.5409 26.5219 25.9692C27.8587 25.3976 29.1971 24.8243 30.5339 24.2526C31.8707 23.6809 33.2091 23.1076 34.5459 22.536C35.8827 21.9643 37.2211 21.391 38.5579 20.8193C38.8551 20.6912 39.177 20.5006 39.4956 20.4448C39.7633 20.3971 40.0244 20.3051 40.2937 20.2542C40.8044 20.1573 41.3677 20.1179 41.8571 20.3298C42.0263 20.4037 42.1823 20.5072 42.312 20.637C42.9328 21.2513 42.8457 22.26 42.7144 23.124C41.7996 29.1463 40.8849 35.1701 39.9685 41.1923C39.8437 42.0186 39.6729 42.9254 39.021 43.4478C38.4692 43.8897 37.6842 43.939 37.0027 43.7517C36.3211 43.5628 35.7201 43.1669 35.1305 42.7776C32.6852 41.1578 30.2383 39.5381 27.793 37.9184C27.2117 37.534 26.5646 37.0313 26.5712 36.3332C26.5745 35.9126 26.8257 35.5381 27.0819 35.2046C29.207 32.4317 32.273 30.5261 34.5541 27.8814C34.876 27.5085 35.1289 26.835 34.6871 26.6198C34.4244 26.4916 34.1222 26.6658 33.8824 26.8317C30.8673 28.9261 27.8538 31.0222 24.8386 33.1167C23.8549 33.8001 22.8236 34.5032 21.6379 34.6707C20.577 34.8219 19.5096 34.5262 18.4832 34.2239C17.6226 33.9709 16.7637 33.7114 15.9081 33.4436C15.4532 33.3024 14.9835 33.1496 14.6321 32.8292C14.2806 32.5089 14.0787 31.9701 14.2905 31.543C14.4236 31.2752 14.6814 31.106 14.9524 30.968L14.9556 30.9697Z"
                      fill="#00B0F2"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg md:text-xl font-semibold text-[#0F172A]">
                  Enter Your Telegram Username
                </h3>
                <p className="text-[13px] md:text-sm text-[#737791]">
                  Please enter your Telegram username to proceed with
                  verification
                </p>
              </div>

              {/* Input field */}
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 px-3 border border-gray-300 bg-gray-200 flex items-center pointer-events-none rounded-tl rounded-bl">
                    <AtSymbolIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    className="w-full pl-14 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-1 focus:ring-[#00B0F2]"
                    placeholder={`Enter telegram username`}
                    value={formData.telegram_username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telegram_username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Proceed button */}
              <button
                onClick={handleVerification}
                className="w-full text-sm md:text-base bg-[#00B0F2] hover:bg-[#00B0F2]/90 text-white py-3 rounded-lg font-medium transition duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                Proceed with Verification
              </button>
              
              {verificationCode && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={verificationCode}
                  readOnly
                  className="border p-2 w-full rounded text-gray-800"
                />
                <button
                  onClick={handleCopyCode}
                  className="bg-[#00B0F2] text-white px-4 py-2 rounded"
                >
                  Copy
                </button>
              </div>
              )}

              {/* Footer text */}
              <p className="text-xs text-center text-gray-500">
                By proceeding, you agree to connect your Telegram account for
                verification
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TgVerification;
