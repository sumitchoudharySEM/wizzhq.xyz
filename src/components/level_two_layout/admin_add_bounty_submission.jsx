"use client";

import React, { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
// import ConfettiExplosion from "react-confetti-explosion";
import { motion } from "framer-motion";
import Select from "react-select";

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

    const tweetText = `🎉 Excited to share my submission for "${listingTitle}"!\n\nCheck out my work here: ${submissionLinks}\n\n#WizzHQ #BountyHunting #Growth 🚀✨`;

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
          <img src="/images/meme/congo_meme.png" alt="congrats" />
        </div>

        <div className="flex flex-col gap-5 items-center">
          <h1 className="text-base md:text-[17px] font-medium text-[#424558] leading-7">
            Your application is in! 🎉 Winners coming soon—till then, spread the
            word and share your submissions with friends!{" "}
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

const AdminAddBountySubmission = ({
  isOpen,
  onRequestClose,
  listingId,
  type,
  listing,
  isAdminPage,
}) => {
  const isMultipleAllowed = type === "multiple";
  const [showCongrats, setShowCongrats] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(isOpen);
  const [submittedData, setSubmittedData] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    submission_links: [""],
    tweet_link: "",
    additional_info: "",
    wallet_address: "",
    user_id: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
    setFormData(prev => ({
      ...prev,
      user_id: selectedOption?.value || ''
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
    
    // Validate user selection
    if (!formData.user_id) {
      toast.error("Please select a user");
      return;
    }

    setIsSaving(true);

    // Filter out empty submission links
    const filteredLinks = formData.submission_links.filter(
      (link) => link.trim() !== ""
    );

    // Validate submission links
    if (filteredLinks.length === 0) {
      toast.error("Please provide at least one submission link");
      setIsSaving(false);
      return;
    }

    // Validate wallet address
    if (!formData.wallet_address.trim()) {
      toast.error("Wallet address is required");
      setIsSaving(false);
      return;
    }

    try {
      const submissionData = {
        user_id: formData.user_id,
        submission_links: filteredLinks,
        tweet_link: formData.tweet_link.trim() || null,
        additional_info: formData.additional_info.trim() || null,
        wallet_address: formData.wallet_address.trim(),
        listing_id: listingId
      };

      console.log("Submitting data:", submissionData);

      const response = await fetch('/api/admin/add_submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to add submission");
      }

      setSubmittedData(data.submission);
      setShowSubmissionModal(false);
      toast.success("Submission added successfully!");

      setTimeout(() => {
        setShowCongrats(true);
      }, 300);

    } catch (error) {
      console.error("Error adding submission:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error adding submission. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // show modal when isOpen prop changes
  useEffect(() => {
    setShowSubmissionModal(isOpen);
  }, [isOpen]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await fetch('/api/admin/add_submission');
        const data = await response.json();
        
        if (data.users) {
          const formattedUsers = data.users.map(user => ({
            value: user.id,
            label: user.username
          }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (isAdminPage && isOpen) {
      fetchUsers();
    }
  }, [isAdminPage, isOpen]);

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
          <div className="relative max-h-screen w-full max-w-2xl mx-4 overflow-y-auto rounded-lg shadow-lg bg-white">
            <div className="pt-5">
              <button
                className="absolute top-4 right-4 text-gray-500"
                onClick={handleSubmissionClose}
              >
                <XMarkIcon className="h-6 w-6 text-[#323232]" strokeWidth={2} />
              </button>

              <h2 className="text-lg font-bold text-[#323232] px-6">
                Add Bounty Submission
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col px-6 pb-4 pt-3"
            >
              {/* User Selection Dropdown for Admin */}
              {isAdminPage && (
                <div className="mb-4">
                  <label className="block mb-[2px] text-[16px] font-medium text-[#344054]">
                    Select Username <span className="text-red-500 font-semibold">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Choose the username you want to submit this bounty for
                  </p>
                  <Select
                    value={selectedUser}
                    onChange={handleUserChange}
                    options={users}
                    isLoading={isLoadingUsers}
                    className="text-sm text-gray-900"
                    placeholder="Select a user..."
                    isClearable
                    required
                  />
                </div>
              )}

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

export default AdminAddBountySubmission;
