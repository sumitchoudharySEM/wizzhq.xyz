"use client";

import React, { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
// import ConfettiExplosion from "react-confetti-explosion";
import { motion } from "framer-motion";

const CongratulationsModal = ({
  isOpen,
  onClose,
  submissionData,
  listingTitle,
}) => {
  // const [isExploding, setIsExploding] = useState(false);

  // useEffect(() => {
  //   console.log("Modal isOpen:", isOpen)
  //   if (isOpen) {
  //     // Reset and trigger confetti when modal opens
  //     setIsExploding(false);

  //     setTimeout(() => {
  //       console.log("Triggering confetti explosion");
  //       setIsExploding(true);
  //     }, 100);
  //   }
  // }, [isOpen]);

  if (!isOpen) return null;

  const handleTwitterShare = () => {
    const submissionLinks = Array.isArray(submissionData.submission_links)
      ? submissionData.submission_links[0]
      : submissionData.submission_links;

    // const tweetText = `Just submitted for the bounty: ${listingTitle} on @WizzHQ\n\nCheck out my submission here ${submissionLinks} \n\nhopefully, they love it as much as I do. If not, I’ll just pretend it never happened. 😂🔥\n\nWish me luck!`;
    const tweetText = `Just submitted for the bounty on @WizzHQ\n\nCheck out my submission here ${submissionLinks} \n\nhopefully, they love it as much as I do. If not, I’ll just pretend it never happened. 😂🔥\n\nWish me luck!`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Fixed position container for confetti
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {isExploding && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div>Confetti should be here!</div>
            <ConfettiExplosion
              force={1.2}
              duration={3000}
              particleCount={200}
              width={2000}
              height={2000}
              colors={['#2FCC71', '#27a661', '#424558', '#344054', '#FFD700']}
              particleSize={8}
            />
          </div>
        )}
      </div> */}

      {/* modal content */}
      <div className="relative z-[52] bg-white rounded-lg py-9 px-7 md:p-12 max-w-lg w-full mx-4 text-center flex flex-col items-center gap-8">
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6 text-[#323232]" strokeWidth={2} />
        </button>

        <div>
          <img
            className="h-60"
            src="/images/meme/kancolle-dance.gif"
            alt="congrats"
          />
        </div>

        <div className="flex flex-col gap-5 items-center">
          <h1 className="text-base md:text-[17px] font-medium text-[#424558] leading-7">
            Your application is in! Winners coming soon—till then, share your
            submissions with friends!{" "}
          </h1>

          <motion.button
            onClick={handleTwitterShare}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex gap-5 items-center px-4 py-2 md:py-[10px] justify-center text-gray-800 font-medium text-base md:text-[18px] border-2 border-gray-800 rounded-lg shadow-sm shadow-[#c1c1c1] transition-all"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.58643 17.9335L9.60294 11.917M9.60294 11.917L3.58643 3.58643H7.57172L11.917 9.60294M9.60294 11.917L13.9482 17.9335H17.9335L11.917 9.60294M17.9335 3.58643L11.917 9.60294"
                stroke="black"
                strokeWidth="1.34504"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Share on Twitter</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const BountySubmission = ({
  isOpen,
  onRequestClose,
  listingId,
  mySubmission,
  type,
  listing,
  submissionData,
  isAdminPage,
}) => {
  const isMultipleAllowed = type === "multiple";
  const [showCongrats, setShowCongrats] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(isOpen);
  const [submittedData, setSubmittedData] = useState(null);

  const [formData, setFormData] = useState({
    submission_links: [""],
    tweet_link: "",
    additional_info: "",
    wallet_address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // show modal when isOpen prop changes
  useEffect(() => {
    setShowSubmissionModal(isOpen);
  }, [isOpen]);

  // useEffect(() => {
  //   if (mySubmission && mySubmission.id) {
  //     let submissionLinks;
  //     if (Array.isArray(mySubmission.submission_links)) {
  //       submissionLinks = mySubmission.submission_links;
  //     } else {
  //       try {
  //         submissionLinks = JSON.parse(mySubmission.submission_links) || [""];
  //       } catch (error) {
  //         submissionLinks = [""];
  //       }
  //     }
  //     const links = isMultipleAllowed
  //       ? submissionLinks
  //       : [submissionLinks[0] || ""];

  //     setFormData({
  //       submission_links: links,
  //       tweet_link: mySubmission.tweet_link || "",
  //       additional_info: mySubmission.additional_info || "",
  //       wallet_address: mySubmission.wallet_address || "",
  //     });
  //   }
  // }, [mySubmission, isMultipleAllowed]);

  useEffect(() => {
    // Determine which data source to use based on whether it's admin page
    const data = isAdminPage ? submissionData : mySubmission;

    if (data && data.id) {
      let submissionLinks;
      if (Array.isArray(data.submission_links)) {
        submissionLinks = data.submission_links;
      } else {
        try {
          submissionLinks = JSON.parse(data.submission_links) || [""];
        } catch (error) {
          submissionLinks = [""];
        }
      }

      const links = isMultipleAllowed
        ? submissionLinks
        : [submissionLinks[0] || ""];

      setFormData({
        submissionId: isAdminPage ? data.id : undefined, // Only include ID for admin
        submission_links: links,
        tweet_link: data.tweet_link || "",
        additional_info: data.additional_info || "",
        wallet_address: data.wallet_address || "",
      });
    }
  }, [submissionData, mySubmission, isAdminPage, isMultipleAllowed]);

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmissionLinkChange = (index, value) => {
    setFormData((prevState) => {
      const newLinks = [...prevState.submission_links];
      newLinks[index] = value;
      return {
        ...prevState,
        submission_links: newLinks,
      };
    });
  };

  const addSubmissionLink = () => {
    if (!isMultipleAllowed) return;

    setFormData((prevState) => ({
      ...prevState,
      submission_links: [...prevState.submission_links, ""],
    }));
  };

  const removeSubmissionLink = (index) => {
    if (formData.submission_links.length === 1 || !isMultipleAllowed) return;

    setFormData((prevState) => ({
      ...prevState,
      submission_links: prevState.submission_links.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Filter out empty submission links
    const filteredLinks = formData.submission_links.filter(
      (link) => link.trim() !== ""
    );
    if (filteredLinks.length === 0) {
      toast.error("Please provide at least one submission link");
      setIsSaving(false);
      return;
    }

    const submissionData = {
      ...formData,
      submission_links: filteredLinks,
    };

    try {
      let response;

      if (isAdminPage) {
        response = await fetch(
          `/api/admin/edit_submission?submission_id=${formData.submissionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submissionData),
          }
        );
      } else {
        // If a regular user, submit a new entry
        response = await fetch(`/api/submission?listing=${listingId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to add Submission");
      }

      setSubmittedData(submissionData);
      setShowSubmissionModal(false);

      // congrats modal after 300ms
      setTimeout(() => {
        setShowCongrats(true);
      }, 300);

      // toast.success("Submission done successfully!");
      // onRequestClose();
    } catch (error) {
      console.error("Error adding Submission:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error adding Submission. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCongratsClose = () => {
    setShowCongrats(false);
    onRequestClose();
  };

  const handleSubmissionClose = () => {
    setShowSubmissionModal(false);
    onRequestClose();
  };

  if (!showSubmissionModal && !showCongrats) return null;

  // if (!isOpen) return null;

  return (
    <>
      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-screen w-full max-w-lg mx-4 overflow-y-auto rounded-lg shadow-lg bg-white">
            <div className="pt-5">
              <button
                className="absolute top-4 right-4 text-gray-500"
                onClick={handleSubmissionClose}
              >
                <XMarkIcon className="h-6 w-6 text-[#323232]" strokeWidth={2} />
              </button>

              <h2 className="text-lg font-bold text-[#323232] px-6">
                Bounty Submission
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col px-6 pb-4 pt-3"
            >
              {/* Submission Links */}
              <label className="block mb-[2px] text-[16px] font-medium text-[#344054]">
                Submission {isMultipleAllowed ? "Links" : "Link"}{" "}
                <span className="text-red-500 font-semibold">*</span>
              </label>
              <p className="text-sm font-normal text-gray-500 mb-3">
                Provide {isMultipleAllowed ? "links" : "a link"} to your{" "}
                {isMultipleAllowed ? "submissions" : "submission"}, such as Doc,
                article, tweet, Notion, IG, YT, or any other link depending on
                the bounty. Ensure {isMultipleAllowed ? "they're" : "it's"}{" "}
                accessible to everyone!
              </p>

              {formData.submission_links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-4">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="flex-1 bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 p-[10px]"
                    value={link}
                    onChange={(e) =>
                      handleSubmissionLinkChange(index, e.target.value)
                    }
                    required
                  />
                  {isMultipleAllowed && (
                    <>
                      <button
                        type="button"
                        onClick={() => removeSubmissionLink(index)}
                        className="p-2 text-gray-500 hover:text-red-500"
                        disabled={formData.submission_links.length === 1}
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      {index === formData.submission_links.length - 1 && (
                        <button
                          type="button"
                          onClick={addSubmissionLink}
                          className="p-2 text-gray-500 hover:text-green-500"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Tweet Link */}
              <label
                htmlFor="tweetLink"
                className="block mb-[2px] text-[16px] font-medium text-[#344054]"
              >
                Tweet Link (optional)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                If you have posted a tweet about your submission for this bounty
                on Wizz, share it here.
              </p>
              <input
                type="url"
                id="tweetLink"
                placeholder="https://twitter.com/yourtweet"
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px] mb-4"
                value={formData.tweet_link}
                onChange={(e) =>
                  handleInputChange("tweet_link", e.target.value)
                }
              />

              {/* Anything else */}
              <label
                htmlFor="additional_info"
                className="block mb-[2px] text-[16px] font-medium text-[#344054]"
              >
                Anything Else
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Got something to share? Drop it here for us!
              </p>
              <input
                type="text"
                id="additional_info"
                placeholder="Additional Info"
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px] mb-4"
                value={formData.additional_info}
                onChange={(e) =>
                  handleInputChange("additional_info", e.target.value)
                }
              />

              {/* Wallet Address */}
              <label
                htmlFor="walletAddress"
                className="block mb-[2px] text-[16px] font-medium text-[#344054]"
              >
                Your Wallet Address{" "}
                <span className="text-red-500 font-semibold">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Enter your{" "}
                <span className="font-bold">
                  {listing && listing.wallet_inst ? listing.wallet_inst : <></>}
                </span>{" "}
                wallet address, and get ready to receive the bounty!
              </p>
              <input
                type="text"
                id="walletAddress"
                placeholder="0x123...ABC"
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px] mb-4"
                value={formData.wallet_address}
                onChange={(e) =>
                  handleInputChange("wallet_address", e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="mt-1 w-full bg-[#2FCC71] text-white p-2 rounded hover:bg-[#27a661]"
              >
                {!isSaving ? "Submit" : "Submitting..."}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* congo modal */}
      <CongratulationsModal
        isOpen={showCongrats}
        onClose={handleCongratsClose}
        submissionData={submittedData}
        listingTitle={listing?.title || "Bounty"}
      />
    </>
  );
};

export default BountySubmission;
