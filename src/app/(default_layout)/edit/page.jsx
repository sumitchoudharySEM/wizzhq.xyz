"use client";

import React from "react";
import CreatableSelect from "react-select/creatable";
import { ArrowRightCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext.jsx";
import Select from "react-select";
import Image from "next/image";
import { toast } from "react-toastify";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { skillsList, countriesList } from "@/lib/options";
import ImageUploader from "@/components/level_three_layout/ImageUploader";

// for community create select
const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    skills: "",
    bio: "",
    location: "",
    current_employment: "",
    communities: "",
    social_links: {
      twitter: "",
      github: "",
      linkedin: "",
    },
  });

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

  // Skills state
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsStrings, setSelectedOptionStrings] = useState("");

  // Communities state
  const [communityInputValue, setCommunityInputValue] = useState("");
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [communitiesString, setCommunitiesString] = useState("");

  // Skills handling
  const handleSkillsChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
    const skillsString = selectedOption.map((option) => option.value).join(",");
    setSelectedOptionStrings(skillsString);
    setFormData((prev) => ({
      ...prev,
      skills: skillsString,
    }));
  };

  // Communities handling
  const handleCommunityKeyDown = (event) => {
    if (!communityInputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        const newCommunity = createOption(communityInputValue);
        setSelectedCommunities((prev) => [...prev, newCommunity]);
        const updatedCommunitiesString = [...selectedCommunities, newCommunity]
          .map((community) => community.value)
          .join(",");
        setCommunitiesString(updatedCommunitiesString);
        setFormData((prev) => ({
          ...prev,
          communities: updatedCommunitiesString,
        }));
        setCommunityInputValue("");
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  const handleCommunityChange = (newValue) => {
    setSelectedCommunities(newValue || []);
    const commString = (newValue || [])
      .map((community) => community.value)
      .join(",");
    setCommunitiesString(commString);
    setFormData((prev) => ({
      ...prev,
      communities: commString,
    }));
  };

  const countryOptions = countriesList.map((country) => ({
    value: country,
    label: `${country}`, // You can add flag emoji here if you want: `🏳️ ${country}`
  }));

  // Transform into react-select format
  const skillOptions = skillsList.map((skill) => ({
    value: skill,
    label: skill,
  }));

  const checkUsernameAvailability = async (username, userId) => {
    try {
      const response = await fetch(
        `/api/check-username?username=${encodeURIComponent(
          username
        )}&userId=${encodeURIComponent(userId)}`,
        {
          method: "GET",
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

  useEffect(() => {
    setImage(user?.image);
  }, [user]);

  // Parse social links from user data
  const parseSocialLinks = (user) => {
    if (!user?.social_links) {
      return {
        twitter: "",
        github: "",
        linkedin: "",
      };
    }

    try {
      // If social_links is already an object
      const links = JSON.parse(user.social_links);
      return {
        twitter: links.twitter || "",
        github: links.github || "",
        linkedin: links.linkedin || "",
      };
    } catch (error) {
      console.error("Error parsing social links:", error);
      return {
        twitter: "",
        github: "",
        linkedin: "",
      };
    }
  };

  // Load initial user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        skills: user.skills || "",
        location: user.location || "",
        bio: user.bio || "",
        current_employment: user.current_employment || "",
        communities: user.communities || "",
        social_links: parseSocialLinks(user),
      });

      // Initialize skills
      if (user.skills) {
        const skillsArray = user.skills.split(",").map((skill) => ({
          value: skill,
          label: skill,
        }));
        setSelectedOptions(skillsArray);
        setSelectedOptionStrings(user.skills);
      }

      // Initialize communities
      if (user.communities) {
        const communitiesArray = user.communities
          .split(",")
          .map((community) => ({
            value: community,
            label: community,
          }));
        setSelectedCommunities(communitiesArray);
        setCommunitiesString(user.communities);
      }

      setLoading(false);
    }
  }, [user]);

  const handleInputChange = async (e) => {
    const { id, value } = e.target;

    // Handle social links separately
    if (["twitter", "github", "linkedin"].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [id]: value,
        },
      }));
    } else if (id === "username") {
      // Update form data first
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));

      // Then perform validation
      const validationError = validateInput(value, "Username");
      if (validationError) {
        setUsernameError(validationError);
      } else {
        try {
          const exists = await checkUsernameAvailability(value, user.id);
          if (exists) {
            setUsernameError("Username already exists");
          } else {
            setUsernameError("");
          }
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameError("Error checking username availability");
        }
      }
    } else if (id === "name") {
      // Update form data first
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));

      // Then perform validation
      const validationError = validateInput(value, "Name");
      if (validationError) {
        setNameError(validationError);
      } else {
        setNameError("");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // Update your handleSubmit function
  const handleSubmit = async () => {
    setFormSubmitted(true);
    setIsSaving(true);
  
    try {
      // First validate fields
      const usernameValidation = validateInput(formData.username, "Username");
      const nameValidation = validateInput(formData.name, "Name");
  
      if (usernameValidation || nameValidation || usernameError) {
        setIsSaving(false);
        return;
      }
  
      // If there's a new image in temporary storage, move it to permanent storage
      let permanentImagePath = image;
      if (image && image.includes('/uploads/temp/')) {
        const response = await fetch('/api/permanentimage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tempPath: image,
            oldPath: user?.image // Will only delete if it's a local file
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to process image');
        }
  
        const data = await response.json();
        permanentImagePath = data.permanentPath;
      }
  
      // Update user profile with permanent image path
      const response = await fetch(`/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          skills: selectedOptionsStrings,
          bio: formData.bio,
          communities: communitiesString,
          location: formData.location,
          current_employment: formData.current_employment,
          social_links: formData.social_links,
          image: permanentImagePath,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      toast.success("Profile updated successfully!");
      router.push(`/profile/${formData.username}`);
  
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up temporary image if it exists
      if (image && image.includes('/uploads/temp/')) {
        fetch(`/api/imageupload?path=${image}`, {
          method: 'DELETE',
        }).catch(console.error);
      }
    };
  }, [image]);

  // Add this validation function
  const validateInput = (value, type) => {
    // Different regex for username and name
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const nameRegex = /^[a-zA-Z0-9\s]+$/; // Allows letters, numbers, and spaces

    if (!value) {
      return `${type} is required`;
    }

    if (value.length < 3) {
      return `${type} must be at least 3 characters long`;
    }

    if (value.length > 15) {
      return `${type} cannot exceed 15 characters`;
    }

    // Apply different validation based on field type
    if (type === "Username") {
      if (!usernameRegex.test(value)) {
        return `Username can only contain letters and numbers`;
      }
    } else if (type === "Name") {
      if (!nameRegex.test(value)) {
        return `Name can only contain letters, numbers, and spaces`;
      }
      // Prevent names that are just spaces
      if (value.trim().length === 0) {
        return `Name cannot be just spaces`;
      }
      // Prevent multiple consecutive spaces
      if (/\s\s/.test(value)) {
        return `Name cannot contain consecutive spaces`;
      }
      // Check if name starts or ends with space
      if (value.startsWith(" ") || value.endsWith(" ")) {
        return `Name cannot start or end with spaces`;
      }
    }

    return "";
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
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="text-[20px] text-[#2f2f2f] font-bold">
          Complete Your Profile
        </h1>
        <div className="flex items-center justify-center">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="hidden md:flex items-center justify-center px-4 py-2 md:px-5 md:py-[10px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-[11px] md:text-base font-semibold disabled:bg-gray-400"
          >
            {isSaving ? (
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
                Saving...
              </div>
            ) : (
              "Save"
            )}
            <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-[32px]" />
          </button>
        </div>
      </div>

      <div className="bg-white flex flex-col md:flex-row md:gap-[3.5rem] px-4 md:px-7 py-4 md:py-8 rounded-[14px] w-full h-auto shadow-sm">
        <div className="md:w-[50%] flex flex-col items-center justify-evenly">
          {/* <CldUploadWidget
            uploadPreset="profileimages"
            onSuccess={({ event, info }) => {
              if (event == "success") {
                const transformedUrl = info.secure_url.replace(
                  "/upload/",
                  "/upload/w_200,h_200,c_fill,q_auto/"
                );
                setImage(transformedUrl);
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
                className="cursor-pointer w-[5.5rem] h-[5.5rem] border rounded-full mb-3"
                onClick={() => open()}
              >
                <Image
                  src={image}
                  alt="userpic"
                  width="100"
                  height="100"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="rounded-full w-7 h-7 bg-[#ffff] shadow-sm flex items-center justify-center mt-[-25px] ml-[56px]">
                  <PhotoIcon className="w-4 h-4 text-[#2FCC71]" />
                </div>
              </label>
            )}
          </CldUploadWidget> */}
          <ImageUploader
            currentImage={image}
            onImageUpload={(imagePath) => {
              setImage(imagePath);
            }}
          />

          <div className="md:flex gap-5 w-full">
            {/* Username */}
            <div className="flex flex-col pt-4 w-full">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                Username<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`bg-[#ffffff] border ${
                  usernameError ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]`}
                placeholder="Enter your username"
                required
              />
              {usernameError && (
                <p className="text-red-500 text-sm mt-1">{usernameError}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="flex flex-col pt-4 w-full">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                Full Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`bg-[#ffffff] border ${
                  nameError ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]`}
                placeholder="Enter your full name"
                required
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col pt-4 w-full">
            <label
              htmlFor="bio"
              className="block mb-2 text-sm font-normal text-[#344054]"
            >
              Bio
            </label>
            <input
              type="text"
              id="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
              placeholder="Bio"
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col pt-4 w-full">
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-normal text-[#344054]"
            >
              Location
            </label>
            <Select
              id="location"
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.value === formData.location
              )}
              onChange={(selectedOption) => {
                setFormData((prev) => ({
                  ...prev,
                  location: selectedOption.value,
                }));
              }}
              className="rounded-[6px] text-black "
              placeholder="Select your country"
              isClearable
              isSearchable
            />
          </div>

          {/* Skills Dropdown */}
          <div className="flex flex-col pt-4 w-full">
            <label
              htmlFor="skills"
              className="block mb-2 text-sm font-normal text-[#344054]"
            >
              Skills
            </label>
            <Select
              id="skills"
              options={skillOptions}
              value={selectedOptions}
              onChange={handleSkillsChange}
              isMulti
              className="rounded-[6px] text-black"
              placeholder="Select your skills"
              isClearable
              isSearchable
            />
          </div>
        </div>

        <div className="md:w-[50%] mt-7 md:mt-0">
          <h1 className="text-[20px] text-[#2f2f2f] font-semibold">
            Socials & Proof Of Work
          </h1>
          <div>
            {/* Communities Input */}
            <div className="flex flex-col pt-4">
              <label
                htmlFor="communities"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                Communities
              </label>
              <CreatableSelect
                components={components}
                inputValue={communityInputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={handleCommunityChange}
                onInputChange={(newValue) => setCommunityInputValue(newValue)}
                onKeyDown={handleCommunityKeyDown}
                placeholder="Type community name and press enter..."
                value={selectedCommunities}
                className="rounded-[6px] block w-full text-[#344054]"
              />
            </div>

            {/* current_employment*/}
            <div className="flex flex-col pt-4">
              <label
                htmlFor="current_employment"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                Current employment
              </label>
              <input
                type="text"
                id="current_employment"
                value={formData.current_employment}
                onChange={handleInputChange}
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                placeholder="Current employment"
                required
              />
            </div>

            {/* X Link */}
            <div className="flex flex-col pt-4">
              <label
                htmlFor="twitter"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                X Link
              </label>
              <input
                type="url"
                id="twitter"
                value={formData.social_links.twitter}
                onChange={handleInputChange}
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                placeholder="Your X (Twitter) Link"
                required
              />
            </div>

            {/* Github Link */}
            <div className="flex flex-col pt-4">
              <label
                htmlFor="github"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                Github Link
              </label>
              <input
                type="url"
                id="github"
                value={formData.social_links.github}
                onChange={handleInputChange}
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                placeholder="Your GitHub Link"
                required
              />
            </div>

            {/* LinkedIn Link */}
            <div className="flex flex-col pt-4">
              <label
                htmlFor="linkedin"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                LinkedIn Link
              </label>
              <input
                type="url"
                id="linkedin"
                value={formData.social_links.linkedin}
                onChange={handleInputChange}
                className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
                placeholder="Your LinkedIn Link"
                required
              />
            </div>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-center mt-7 mb-3">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full flex items-center justify-center px-4 py-[10px] md:px-5 md:py-[11px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-[1.1rem] leading-6 font-semibold"
          >
            {isSaving ? (
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
                Saving...
              </div>
            ) : (
              "Save"
            )}
            {/* <ArrowRightCircleIcon className="h-4 w-4 ml-3" /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
