"use client";

import React from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Create_partner_profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile_photo_url, setprofile_photo_url] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    industry_name: "",
    bio: "",
    description: "",
    social_links: {
      twitter: "",
      discord: "",
      telegram: "",
      website: "",
    },
  });

  // Fetch saved data when the page loads
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/partner`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch partner data");
          }

          const data = await response.json();

          if (data?.partners) {
            setprofile_photo_url(data.partners.profile_photo_url || "");
            setFormData({
              username: data.partners.username || "",
              name: data.partners.name || "",
              email: data.partners.email || "",
              industry_name: data.partners.industry_name || "",
              bio: data.partners.bio || "",
              description: data.partners.description || "",
              social_links: parseSocialLinks(data.partners),
            });
          }

          // setprofile_photo_url(data?.partners?.profile_photo_url || "");

          // setFormData({
          //   username: data?.partners?.username || "",
          //   name: data?.partners?.name || "",
          //   email: data?.partners?.email || "",
          //   industry_name: data?.partners?.industry_name || "",
          //   bio: data?.partners?.bio || "",
          //   description: data?.partners?.description || "",
          //   social_links: parseSocialLinks(data?.partners),
          // });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching partner data:", error);
        }
      }
    };

    fetchData();
  }, [session, status]);
  
  // Load data from localStorage when the page loads or when switching tabs
  useEffect(() => {
    const savedFormData = localStorage.getItem("partnerFormData");
    const savedPhotoUrl = localStorage.getItem("partnerPhotoUrl");
    const savedStep = localStorage.getItem("partnerCurrentStep");

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    if (savedPhotoUrl) {
      setprofile_photo_url(savedPhotoUrl);
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Persist form data to localStorage on change (for both new and existing partners)
  useEffect(() => {
    if (formData.username || session?.user?.id) { // Only save if username is set or user is logged in
      localStorage.setItem("partnerFormData", JSON.stringify(formData));
      localStorage.setItem("partnerPhotoUrl", profile_photo_url);
      localStorage.setItem("partnerCurrentStep", currentStep.toString());
    }
  }, [formData, profile_photo_url, currentStep]);

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(
        `/api/check-username?username=${encodeURIComponent(
          formData.username
        )}&userId=${encodeURIComponent(session?.user?.id)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check username");
      }

      const data = await response.json();
      return !data.available; // Return true if username exists (not available)
    } catch (error) {
      console.error("Error checking username:", error);
      throw error;
    }
  };

  const validateUsername = (username) => {
    if (!username || username.trim() === "") {
      return "Username is required";
    }
    if (username.length < 2) {
      return "Username must be at least 2 characters long";
    }
    if (username.length > 30) {
      return "Username cannot exceed 30 characters";
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return "Username can only contain letters and numbers";
    }
    return "";
  };

  const validateName = (name) => {
    if (!name || name.trim() === "") {
      return "Name is required";
    }
    if (name.length < 2) {
      return "name must be at least 2 characters long";
    }
    if (name.length > 30) {
      return "name cannot exceed 30 characters";
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      return "Name can only contain letters, numbers, and spaces";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    if (email.length > 255) {
      return "Email cannot exceed 255 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateBio = (bio) => {
    if (!bio || bio.trim() === "") {
      return "Bio is required";
    }
    return "";
  };

  const validateProfileImage = () => {
    if (!profile_photo_url) {
      return "Profile image is required";
    }
    return "";
  };

  const validateTwitter = (twitter) => {
    if (!twitter || twitter.trim() === "") {
      return "Twitter profile is required";
    }
    return "";
  };

  // Function to validate current step
  const validateStep = async (step) => {
    const newErrors = {};

    if (step === 1) {
      const usernameError = validateUsername(formData.username);
      const nameError = validateName(formData.name);
      const emailError = validateEmail(formData.email);
      const profileImageError = validateProfileImage();

      if (usernameError) {
        newErrors.username = usernameError;
      } else {
        try {
          const exists = await checkUsernameAvailability(formData.username);
          if (exists) {
            newErrors.username = "This username is already taken";
          }
        } catch (error) {
          console.error("Error checking username:", error);
          newErrors.username = "Error checking username availability";
        }
      }
      if (nameError) newErrors.name = nameError;
      if (emailError) newErrors.email = emailError;
      if (profileImageError) newErrors.profile_image = profileImageError;
    }

    if (step === 2) {
      const twitterError = validateTwitter(formData.social_links.twitter);
      if (twitterError) newErrors.twitter = twitterError;
    }

    if (step === 3) {
      const bioError = validateBio(formData.bio);
      if (bioError) newErrors.bio = bioError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Configuration object for the upload widget
  const uploadWidgetConfig = {
    sources: ["local"],
    multiple: false,
    maxFiles: 1,
    resourceType: "image",
    clientAllowedFormats: ["jpg", "jpeg", "png"],
    maxFileSize: 5000000, // 5MB max file size
    croppingAspectRatio: 1.0,
    croppingDefaultSelectionRatio: 0.8,
    croppingShowDimensions: true,
    croppingValidateDimensions: true,
    croppingShowBackButton: true,
    cropping: true,
    croppingCoordinatesMode: "custom",
    transformation: [
      { width: 200, height: 200, crop: "fill" },
      { quality: "auto" },
    ],
    styles: {
      palette: {
        window: "#FFFFFF",
        windowBorder: "#90A0B3",
        tabIcon: "#2FCC71",
        menuIcons: "#5A616A",
        textDark: "#000000",
        textLight: "#FFFFFF",
        link: "#2FCC71",
        action: "#2FCC71",
        inactiveTabIcon: "#0E2F5A",
        error: "#F44235",
        inProgress: "#0078FF",
        complete: "#20B832",
        sourceBg: "#E4EBF1",
      },
      fonts: {
        default: null,
        "'Poppins', sans-serif": {
          url: "https://fonts.googleapis.com/css?family=Poppins",
          active: true,
        },
      },
    },
  };

  //parse socila links from partners data
  const parseSocialLinks = (partners) => {
    if (!partners?.social_links)
      return {
        twitter: "",
        discord: "",
        telegram: "",
        website: "",
      };

    try {
      const links = JSON.parse(partners?.social_links);
      return {
        twitter: links?.twitter || "",
        discord: links?.discord || "",
        telegram: links?.telegram || "",
        website: links?.website || "",
      };
    } catch (error) {
      console.error("Error parsing social links:", error);
      return {
        twitter: "",
        discord: "",
        telegram: "",
        website: "",
      };
    }
  };

  const handleInputChange = async (e) => {
    const { id, value } = e.target;

    // Clear error for the field being changed
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));

    // Update form data immediately
    if (["twitter", "discord", "telegram", "website"].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [id]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && !errors.username) {
      // Double check username error
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle form submission when on Step 3
  const handleSubmit = async () => {
    if (currentStep === 3) {
      // Perform further actions, such as API calls or validation

      if (!validateStep(3)) {
        alert("form data is not currect");
        return;
      }

      try {
        setIsSubmitting(true);

        const response = await fetch(`/api/partner`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            industry_name: formData.industry_name,
            bio: formData.bio,
            description: formData.description,
            social_links: formData.social_links,
            profile_photo_url: profile_photo_url,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to add partner");
        }

        // Clear localStorage after successful submission
        localStorage.removeItem("partnerFormData");
        localStorage.removeItem("partnerPhotoUrl");
        localStorage.removeItem("partnerCurrentStep");

        toast.success("Partner profile updated successfully!");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error Adding partner:", error);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            backgroundColor: "#FEE2E2", // Light red background
            color: "#DC2626", // Red text
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    }
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
    <div className="md:px-16 md:py-9 px-5 py-5">
      <div className="mb-[12px]">
        <h1 className="text-[19px] text-[#2f2f2f] font-bold">
          Complete Your partner's Profile
        </h1>
      </div>

      <div className="flex flex-col items-center px-6 pt-1">
        {/* Stepper Header */}
        <div className="flex items-center justify-center w-full max-w-lg mb-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full text-white font-semibold ${
                currentStep >= 1 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              1
            </div>
          </div>

          {/* Line connecting steps */}
          <div
            className={`h-[2px] w-60 ${
              currentStep >= 2 ? "bg-green-500" : "bg-gray-300"
            }`}
          />

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full text-white font-semibold ${
                currentStep >= 2 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              2
            </div>
          </div>

          {/* Line connecting steps */}
          <div
            className={`h-[2px] w-60 ${
              currentStep >= 3 ? "bg-green-500" : "bg-gray-300"
            }`}
          />

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full text-white font-semibold ${
                currentStep === 3 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              3
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white flex flex-col items-center justify-center gap-3 md:gap-[1.2rem] px-4 md:px-7 mt-3 py-4 md:pt-[20px] md:pb-[17px] rounded-[14px] w-full h-auto shadow-sm">
        <div className="md:w-[55%] w-full flex flex-col items-center justify-evenly">
          {currentStep === 1 && (
            <>
              {/* Step 1: partner Basic Info */}
              <div className="w-full flex flex-col items-center">
                <CldUploadWidget
                  uploadPreset="profileimages"
                  onSuccess={({ event, info }) => {
                    if (event == "success") {
                      const transformedUrl = info.secure_url.replace(
                        "/upload/",
                        "/upload/w_200,h_200,c_fill,q_auto/"
                      );
                      setprofile_photo_url(transformedUrl);
                      // Clear profile image error when upload succeeds
                      setErrors((prev) => ({
                        ...prev,
                        profile_image: "",
                      }));
                    }
                  }}
                  onError={(error) => {
                    console.error("Upload error:", error);
                    toast.error("Error uploading image. Please try again.");
                  }}
                  options={uploadWidgetConfig}
                >
                  {({ open }) => (
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer w-[5.5rem] h-[5.5rem] border rounded-full mb-2"
                      onClick={() => open()}
                    >
                      {profile_photo_url ? (
                        <Image
                          src={profile_photo_url}
                          alt="Profile picture"
                          width="100"
                          height="100"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-100">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="rounded-full w-7 h-7 bg-[#ffff] shadow-sm flex items-center justify-center mt-[-25px] ml-[56px]">
                        <PhotoIcon className="w-4 h-4 text-[#2FCC71]" />
                      </div>
                    </label>
                  )}
                </CldUploadWidget>
                <label className="block mb-2 text-sm font-normal text-[#344054]">
                  Profile Image <span className="text-red-500">*</span>
                </label>
                {errors.profile_image && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.profile_image}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Partner Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  placeholder="Enter your partner's username"
                  required
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Partner Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  placeholder="Enter your partner's full name"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Partner Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  placeholder="partnername@gmail.com"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="pt-[2px] pb-0 w-full flex flex-col items-center justify-evenly">
              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="website"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  value={formData.social_links.website} // Use value to reflect state
                  onChange={handleInputChange}
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="telegram"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Telegram Link
                </label>
                <input
                  type="text"
                  id="telegram"
                  value={formData.social_links.telegram} // Use value to reflect state
                  onChange={handleInputChange}
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  placeholder="https://t.me/yourtelegramhandle"
                />
              </div>

              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="twitter"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Twitter Profile <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="twitter"
                  value={formData.social_links.twitter}
                  onChange={handleInputChange}
                  className={`bg-[#ffffff] border ${
                    errors.twitter ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]`}
                  placeholder="https://twitter.com/username"
                  required
                />
                {errors.twitter && (
                  <p className="mt-1 text-sm text-red-500">{errors.twitter}</p>
                )}
              </div>

              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="discord"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Discord Invite Link
                </label>
                <input
                  type="text"
                  id="discord"
                  value={formData.social_links.discord} // Use value to reflect state
                  onChange={handleInputChange}
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  placeholder="https://discord.gg/yourinvitecode"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="pt-[18px] pb-[2px] w-full flex flex-col items-center justify-evenly">
              {/* Step 3: Industry, Bio, Description */}
              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="industry_name"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  Industry
                </label>
                <select
                  id="industry_name"
                  value={formData.industry_name} // Use value to reflect state
                  onChange={handleInputChange} // Added onChange for consistent behavior
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                >
                  <option value="">Select Industry</option>
                  <option value="DeFi">DeFi (Decentralized Finance)</option>
                  <option value="GameFi">GameFi & Metaverse</option>
                  <option value="NFT">NFT & Digital Collectibles</option>
                  <option value="Web3Infrastructure">
                    Infrastructure & Development
                  </option>
                  <option value="CryptoEducation">
                    Education & Training
                  </option>
                  <option value="DAOs">DAOs & Governance</option>
                  <option value="ContentCreation">Content & Media</option>
                  <option value="DeBet">
                    Betting & Prediction Markets
                  </option>
                  <option value="ReFi">ReFi (Regenerative Finance)</option>
                  <option value="SocialFi">
                    SocialFi & Decentralized Social
                  </option>
                  <option value="Privacy">Privacy & Security Solutions</option>
                  <option value="TokenizedAssets">
                    Real-World Asset Tokenization
                  </option>
                  <option value="Layer1_2">Layer 1 & Layer 2 Solutions</option>
                  <option value="CryptoServices">
                    Crypto Services & Trading
                  </option>
                  {/* General Fields */}
                  <option value="Technology">
                    General Technology & Software
                  </option>
                  <option value="FinTech">Traditional FinTech</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Consulting">Business Consulting</option>
                  <option value="Consulting">Other</option>
                </select>
              </div>

              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  partner Bio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bio"
                  value={formData.bio}
                  onChange={handleInputChange} // Added onChange for consistent behavior
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  placeholder="Write a bio of your partner"
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
                )}
              </div>

              <div className="flex flex-col pt-[22px] w-full">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-normal text-[#344054]"
                >
                  partner Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange} // Added onChange for consistent behavior
                  className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                  rows={4}
                  placeholder="Describe your partner in detail"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:max-w-[55%] flex justify-end mt-2 space-x-4">
          <button
            className={`rounded-md flex items-center justify-center px-7 py-[7px] text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-base font-medium ${
              currentStep === 1 || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500"
            }`}
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1 || isSubmitting}
          >
            Back
          </button>
          <button
            className={`rounded-md flex items-center justify-center px-7 py-[7px] text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-base font-medium ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={async () => {
              if (currentStep === 3) {
                await handleSubmit();
              } else {
                await handleNext();
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </div>
            ) : currentStep === 3 ? (
              "Submit"
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create_partner_profile;
