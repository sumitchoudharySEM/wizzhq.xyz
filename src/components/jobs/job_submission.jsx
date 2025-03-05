"use client";

import React, { useState, useEffect } from "react";
import { XMarkIcon, AtSymbolIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
// import ConfettiExplosion from "react-confetti-explosion";
import { motion } from "framer-motion";
import Select from "react-select";

const CongratulationsModal = ({
  isOpen,
  onClose,
  submissionData,
  jobTitle,
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
    const tweetText = `🚀 Just took a big step towards my career goals! Applied for "${jobTitle}" on Wizz.\n\n Excited for new challenges and opportunities ahead! 💼✨ \n\n #WizzHQ #JobSearch #CareerGrowth #NewBeginnings`;

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

// Questionnaire Field Component based on type retrieved from API
const QuestionnaireField = ({ question, value, onChange }) => {
  const { id, type, label, required, options = [] } = question;

  switch (type) {
    case "checkbox":
      return (
        <div className="mb-4">
          <label className="block mb-3 text-[16px] font-medium text-[#344054]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${id}-${idx}`}
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const newValue = value || [];
                    if (e.target.checked) {
                      onChange([...newValue, option]);
                    } else {
                      onChange(newValue.filter((v) => v !== option));
                    }
                  }}
                  required={required}
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label
                  htmlFor={`${id}-${idx}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="mb-4">
          <label className="block mb-3 text-[16px] font-medium text-[#344054]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  id={`${id}-${idx}`}
                  name={`question-${id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  required={required}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label
                  htmlFor={`${id}-${idx}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      );

    case "short":
      return (
        <div className="mb-4">
          <label
            htmlFor={`question-${id}`}
            className="block mb-3 text-[16px] font-medium text-[#344054]"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id={`question-${id}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
          />
        </div>
      );

    case "long":
      return (
        <div className="mb-4">
          <label
            htmlFor={`question-${id}`}
            className="block mb-3 text-[16px] font-medium text-[#344054]"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            id={`question-${id}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            rows={4}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
          />
        </div>
      );

    case "dropdown":
      case "dropdown":
      const selectOptions = options.map(option => ({
        value: option,
        label: option
      }));
      return (
        <div className="mb-4">
          <label
            htmlFor={`question-${id}`}
            className="block mb-3 text-[16px] font-medium text-[#344054]"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <Select
            id={`question-${id}`}
            value={value ? selectOptions.find(opt => opt.value === value) : null}
            onChange={(selectedOption) => onChange(selectedOption.value)}
            options={selectOptions}
            required={required}
            className="text-sm text-gray-800"
            placeholder="Select an option"
          />
        </div>
      );

    default:
      return null;
  }
};

const JobSubmission = ({
  isOpen,
  onRequestClose,
  jobId,
  jobSlug,
  mySubmission,

  job,
  submissionData,
  isAdminPage,
}) => {
  const [showCongrats, setShowCongrats] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(isOpen);
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [defaultAnswers, setDefaultAnswers] = useState({
    exp: "",
    reason: "",
    resume: ""
  });
  const [submittedData, setSubmittedData] = useState(null);
  
  // Default questions for job submission
  const defaultQuestions = [
    {
      id: "exp",
      type: "long",
      label: "Have you worked in similar roles before? If yes, please describe your experience with company name.",
      required: true
    },
    {
      id: "reason",
      type: "long",
      label: "Why do you want to join this role?",
      required: true
    },
    {
      id: "resume",
      type: "short",
      label: "Link to your resume/portfolio",
      required: true
    }
  ];

  const [formData, setFormData] = useState({
    email: "",
    x_username: "",
    telegram_username: "",
    additional_info: "",
    // wallet_address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // show modal when isOpen prop changes
  useEffect(() => {
    setShowSubmissionModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/jobs/create_job?slug=${jobSlug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.job && data.job.questionnaire) {
          try {
            const questionnaire = typeof data.job.questionnaire === "string"
              ? JSON.parse(data.job.questionnaire)
              : data.job.questionnaire;
            setQuestions(questionnaire.questions || []);
          } catch (parseError) {
            console.error("Error parsing questionnaire:", parseError);
            toast.error("Invalid questionnaire format");
            setQuestions([]);
          }
        } else {
          console.warn("No questionnaire found for job:", jobSlug);
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questionnaire");
        setQuestions([]);
      }
    };
  
    if (jobSlug) {
      fetchQuestions();
    }
  }, [jobSlug]);

  useEffect(() => {
    // Determine which data source to use based on whether it's admin page
    const data = isAdminPage ? submissionData : mySubmission;

    if (data && data.id) {
      setFormData({
        submissionId: isAdminPage ? data.id : undefined, // Only include ID for admin
        email: data.email || "",
        x_username: data.x_username || "",
        telegram_username: data.telegram_username || "",
        additional_info: data.additional_info || "",
        // wallet_address: data.wallet_address || "",
      });
  
      // Set default answers
      if (data.default_answers) {
        setDefaultAnswers(data.default_answers);
      }

      // Set custom questionnaire answers
      if (data.questionnaire_answers) {
        setQuestionAnswers(data.questionnaire_answers);
      }
    }
  }, [submissionData, mySubmission, isAdminPage]);

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleQuestionChange = (questionId, value) => {
    setQuestionAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleDefaultAnswerChange = (type, value) => {
    setDefaultAnswers(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const submissionData = {
      ...formData,
      default_answers: defaultAnswers,
      questionnaire_answers: questionAnswers,
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
        response = await fetch(`/api/jobs/submissions?job=${jobId}`, {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="relative max-h-[90vh] w-full max-w-lg mx-4 overflow-y-auto rounded-lg shadow-lg bg-white">
            <div className="pt-5">
              <button
                className="absolute top-4 right-4 text-gray-500"
                onClick={handleSubmissionClose}
              >
                <XMarkIcon className="h-6 w-6 text-[#323232]" strokeWidth={2} />
              </button>

              <h2 className="text-lg font-bold text-[#323232] px-6">
                Job Submission
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col px-6 pb-4 pt-3"
            >
              {/* Email Address */}
              <label
                htmlFor="email"
                className="block mb-2 text-[16px] font-medium text-[#344054]"
              >
                Tell us your Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px] mb-4"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />

              {/* Twitter Username */}
              <label
                htmlFor="twitterUsername"
                className="block mb-2 text-[16px] font-medium text-[#344054]"
              >
                Enter your Twitter (X) Username
              </label>
              <div className="space-y-2 mb-5">
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 px-3 border border-gray-300 bg-gray-200 flex items-center pointer-events-none rounded-tl-md rounded-bl-md">
                    <AtSymbolIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    className="w-full pl-14 px-3 py-2 border border-gray-300 rounded-md text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                    placeholder={`Enter X username`}
                    value={formData.x_username}
                    onChange={(e) => handleInputChange("x_username", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Telegram Username */}
              <label
                htmlFor="telegramUsername"
                className="block mb-2 text-[16px] font-medium text-[#344054]"
              >
                Enter your Telegram Username
              </label>
              <div className="space-y-2 mb-5">
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 px-3 border border-gray-300 bg-gray-200 flex items-center pointer-events-none rounded-tl-md rounded-bl-md">
                    <AtSymbolIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    className="w-full pl-14 px-3 py-2 border border-gray-300 rounded-md text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                    placeholder={`Enter Telegram username`}
                    value={formData.telegram_username}
                    onChange={(e) => handleInputChange("telegram_username", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Default Questions */}
              {defaultQuestions.map(question => (
                <QuestionnaireField
                  key={question.id}
                  question={question}
                  value={defaultAnswers[question.id]}
                  onChange={(value) => handleDefaultAnswerChange(question.id, value)}
                />
              ))}

              {/* other questionnaire fields */}
              {questions.map((question) => (
                <QuestionnaireField
                  key={question.id}
                  question={question}
                  value={questionAnswers[question.id]}
                  onChange={(value) => handleQuestionChange(question.id, value)}
                />
              ))}

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
              {/* <label
                htmlFor="walletAddress"
                className="block mb-[2px] text-[16px] font-medium text-[#344054]"
              >
                Your Wallet Address{" "}
                <span className="text-red-500 font-semibold">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Enter your{" "}
                <span className="font-bold">
                  {job && job.wallet_inst ? job.wallet_inst : <></>}
                </span>{" "}
                wallet address, and get ready to receive the job!
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
              /> */}

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
        jobTitle={job?.title || "Job"}
      />
    </>
  );
};

export default JobSubmission;
