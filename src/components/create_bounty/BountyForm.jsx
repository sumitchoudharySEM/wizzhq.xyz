"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRightCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  PaintBrushIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import templateData from "@/lib/template/deep_dive";
import { skillsList, countriesList, tokensList } from "@/lib/options";
import Select from "react-select";
import { DateTime } from "luxon";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';

import dynamic from 'next/dynamic';

// Dynamically import React Quill with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Dynamically import DatePicker with no SSR
const DatePicker = dynamic(() => import('react-datepicker'), {
  ssr: false,
  loading: () => <p>Loading date picker...</p>
});

// Import DatePicker CSS only on client side
import "react-datepicker/dist/react-datepicker.css";

// Define the modules for the simplified Quill editor
const simplifiedModules = {
  toolbar: [["bold"], ["link"], [{ list: "ordered" }, { list: "bullet" }]],
};

const templates = [
  {
    id: "empty",
    title: "Start Empty",
    quickViewLink: "/empty",
    icon: <PlusIcon className="w-7 h-7 text-[#FFA02D]" />,
  },
  {
    id: "twitter_thread_creation",
    title: "Twitter Thread Creation",
    quickViewLink: "/twitter_thread_creation",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_31_4401)">
          <path
            d="M9.77114 6.77143L15.5964 0H14.216L9.15792 5.87954L5.11803 0H0.458496L6.5676 8.8909L0.458496 15.9918H1.83898L7.18047 9.78279L11.4469 15.9918H16.1064L9.7708 6.77143H9.77114ZM7.88037 8.96923L7.26139 8.0839L2.33639 1.0392H4.45674L8.43127 6.7245L9.05025 7.60983L14.2167 14.9998H12.0963L7.88037 8.96957V8.96923Z"
            fill="#FFA02D"
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
    ),
  },
  {
    id: "deep_dive",
    title: "Deep Dive Blog",
    quickViewLink: "/deep_dive",
    icon: <PencilSquareIcon className="w-7 h-7 text-[#FFA02D]" />,
  },
  {
    id: "designing",
    title: "Design Masterpieces",
    quickViewLink: "/designing",
    icon: <PaintBrushIcon className="w-7 h-7 text-[#FFA02D]" />,
  },
  {
    id: "feedback_review",
    title: "Feedback & Review",
    quickViewLink: "/feedback_review",
    icon: <ChatBubbleLeftRightIcon className="w-7 h-7 text-[#FFA02D]" />,
  },
];

export default function BountyForm() {
  // Move all state initializations inside useEffect
  const [hasMounted, setHasMounted] = useState(false);
  const searchParams = useSearchParams();
  const isEditing = searchParams?.get("edit") === "true";
  const slug = searchParams?.get("slug");
  const router = useRouter();
  
  // Initialize all state variables
  const [currentStep, setCurrentStep] = useState(1);
  const [value, setValue] = useState("");
  const [requirementsValue, setRequirementsValue] = useState("");
  const [deliverablesValue, setDeliverablesValue] = useState("");
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isBonusPrizeAdded, setIsBonusPrizeAdded] = useState(false);

  
  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    template: "",
    title: "",
    categories: "",
    skills: "",
    location: "",
    contact: "",
    end_date: "",
    short_description: "",
    requirements: [],
    deliverables: [],
    detailed_description: "",
    reward: "",
    wallet_inst: "",
    submission_type: "single",
  });

  const [rewards, setRewards] = useState({
    token: "USDC",
    prizes: [0], // Initialize with one prize
    bonusPrize: {
      number: "",
      amount: "",
    },
  });

  // Initialize other state variables
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Check if component has mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && hasMounted) {
      try {
        const savedData = localStorage.getItem("bountyFormData");
        const savedRewards = localStorage.getItem("bountyRewards");
        const savedTemplateId = localStorage.getItem("selectedTemplateId");
        const savedValue = localStorage.getItem("detailedDescription");
        const savedCurrentStep = localStorage.getItem("currentStep");
        
        if (savedData) setFormData(JSON.parse(savedData));
        if (savedRewards) setRewards(JSON.parse(savedRewards));
        if (savedTemplateId) {
          const template = templates.find((t) => t.id === savedTemplateId);
          setSelectedTemplate(template);
        }
        if (savedValue) setValue(savedValue);
        if (savedCurrentStep) setCurrentStep(parseInt(savedCurrentStep));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading saved data:", error);
        setIsLoading(false);
      }
    }
  }, [hasMounted]);

  const [selectedOptionsStrings, setSelectedOptionStrings] = useState("");
  const timezoneOptions = [
    { value: "UTC", label: "UTC (GMT)" },
    { value: "America/New_York", label: "New York (EST/EDT)" },
    { value: "Europe/London", label: "London (BST/GMT)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST)" },
  ];
  
  const [selectedTimezone, setSelectedTimezone] = useState({ value: "UTC", label: "UTC (GMT)" });



  // Fetch bounty data when editing
  useEffect(() => {
    const fetchBountyData = async () => {
      if (isEditing && slug) {
        try {
          const response = await fetch(`/api/edit_bounty?slug=${slug}`);
          if (!response.ok) {
            throw new Error("Failed to fetch bounty data");
          }
          const data = await response.json();

          // console.log("Fetched bounty data:", data);

          // Update all form states
          setFormData({
            template: data.listing.template || "",
            title: data.listing.title || "",
            categories: data.listing.categories || "",
            skills: data.listing.skills || "",
            location: data.listing.location || "",
            contact: data.listing.contact || "",
            end_date: data.listing.end_date || "",
            short_description: data.listing.short_description || "",
            requirements: data.listing.requirements || [],
            deliverables: data.listing.deliverables || [],
            detailed_description: data.listing.detailed_description || "",
            reward: data.listing.reward || "",
            wallet_inst: data.listing.wallet_inst || "",
            submission_type: data.listing.submission_type || "single",
          });

          // Handle skills (comma-separated string to array of objects)
          const skillsArray = data.listing.skills
            ? data.listing.skills.split(",").map((skill) => {
                const foundSkill = skillOptions.find(
                  (option) => option.value === skill.trim()
                );
                return foundSkill || null; 
              })
            : [];
          setSelectedOptions(skillsArray); 
          setSelectedOptionStrings(data.listing.skills || ""); 

          // handle the category
          if (data.listing.categories) {
            const categoryOption = categoryOptions.find(
              (option) => option.value === data.listing.categories
            );
            setSelectedCategory(categoryOption || null);
          }

          // Parse the reward field (JSON string), extract the token, set rewards
          const rewardData = data.listing.reward ? JSON.parse(data.listing.reward) : {};
          const token = rewardData.token || ""; 

          setRewards({
            token,
            prizes: rewardData.prizes || [],
            bonusPrize: rewardData.bonusPrize || { number: "", amount: "" },
          });
          
          // handle the timezone
          const endDateUTC = data.listing.end_date;
          const localDate = DateTime.fromISO(endDateUTC).toLocal().toJSDate();
          setSelectedDate(localDate);

          // Update other state values
          setValue(data.listing.detailed_description || "");
          setRequirementsValue(data.listing.requirements || "");
          setDeliverablesValue(data.listing.deliverables || "");
          setAllowMultipleSubmissions(
            data.listing.submission_type === "multiple"
          );

          // If there's a template, set it
          if (data.listing.template) {
            const template = templates.find(
              (t) => t.id === data.listing.template
            );
            setSelectedTemplate(template || null);
          }

          setCurrentStep(2);
        } catch (error) {
          console.error("Error fetching bounty data:", error);
          toast.error("Failed to load bounty data");
        }
      }
      setIsLoading(false);
    };

    fetchBountyData();
  }, [isEditing, slug]);

  // Modify all localStorage access with client-side checks
  useEffect(() => {
    if (!hasMounted) return;
    const savedData = localStorage.getItem("bountyFormData");
    const savedRewards = localStorage.getItem("bountyRewards");
    const savedTemplateId = localStorage.getItem("selectedTemplateId");
    const savedValue = localStorage.getItem("detailedDescription");
    const savedCurrentStep = localStorage.getItem("currentStep");
    const savedRequirements = localStorage.getItem("requirementsDescription");
    const savedDeliverables = localStorage.getItem("deliverablesDescription");

    if (savedRequirements) {
      setRequirementsValue(savedRequirements);
    }
    if (savedDeliverables) {
      setDeliverablesValue(savedDeliverables);
    }

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards));
    }
    if (savedTemplateId) {
      // Find and set the full template object based on the saved ID
      const template = templates.find((t) => t.id === savedTemplateId);
      setSelectedTemplate(template);
    }
    if (savedValue) {
      setValue(savedValue);
    }
    if (savedCurrentStep) {
      setCurrentStep(parseInt(savedCurrentStep));
    }
  }, [hasMounted]); // Add hasMounted to dependencies

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem("bountyFormData", JSON.stringify(formData));
    localStorage.setItem("bountyRewards", JSON.stringify(rewards));
    // Only store the template ID instead of the full template object
    localStorage.setItem("selectedTemplateId", selectedTemplate?.id || "");
    localStorage.setItem("detailedDescription", value);
    localStorage.setItem("currentStep", currentStep.toString());
    localStorage.setItem("requirementsDescription", requirementsValue);
    localStorage.setItem("deliverablesDescription", deliverablesValue);
  }, [
    hasMounted,
    formData,
    rewards,
    selectedTemplate,
    value,
    currentStep,
    requirementsValue,
    deliverablesValue,
  ]);

  // Modify the template selection handler
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (template.id === "empty") {
      setFormData((prev) => ({
        ...prev,
        template: template.id,
        short_description: "",
      }));
      setValue("");
      setRequirementsValue("");
      setDeliverablesValue("");
    } else {
      setFormData((prev) => ({
        ...prev,
        template: template.id,
        short_description: templateData.Data[template.id].short_description,
      }));
      setValue(templateData.Data[template.id].detailed_description);
      setRequirementsValue(templateData.Data[template.id].requirements);
      setDeliverablesValue(templateData.Data[template.id].deliverables);
    }
    if (errors.template) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.template;
        return newErrors;
      });
    }
  };

  useEffect(() => {
    if (rewards.prizes.length === 0) {
      setRewards((prev) => ({
        ...prev,
        prizes: [0],
      }));
    }
  }, []);

  const getMinDate = () => {
    return DateTime.now().plus({ hours: 48 }).toJSDate();
  };

  const getMaxDate = () => {
    return DateTime.now().plus({ years: 1 }).toJSDate();
  };

  const validateStep1 = () => {
    if (!selectedTemplate) {
      setErrors((prev) => ({ ...prev, template: "Please select a template" }));
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length < 10 || formData.title.length > 100) {
      newErrors.title = "Title must be between 10 and 100 characters";
      isValid = false;
    }

    if (!formData.categories) {
      newErrors.categories = "Category is required";
      isValid = false;
    }

    if (!formData.skills) {
      newErrors.skills = "Skills are required";
      isValid = false;
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact information is required";
      isValid = false;
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
      isValid = false;
    } else {
      const selectedDate = DateTime.fromISO(formData.end_date);
      const minDate = DateTime.now().plus({ hours: 48 });
      const maxDate = DateTime.now().plus({ years: 1 });

      if (selectedDate < minDate) {
        newErrors.end_date = "End date must be at least 48 hours from now";
        isValid = false;
      }
      if (selectedDate > maxDate) {
        newErrors.end_date = "End date cannot be more than 1 year from now";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep3 = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.short_description.trim()) {
      newErrors.short_description = "Task description is required";
      isValid = false;
    } else if (
      formData.short_description.length < 40 ||
      formData.short_description.length > 400
    ) {
      newErrors.short_description =
        "Short description must be between 40 and 400 characters";
      isValid = false;
    }

    if (!requirementsValue.trim()) {
      newErrors.requirements = "Requirements are required";
      isValid = false;
    }

    if (!deliverablesValue.trim()) {
      newErrors.deliverables = "Deliverables are required";
      isValid = false;
    }

    if (!value.trim()) {
      newErrors.detailed_description = "Additional information is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep4 = () => {
    const newErrors = {};
    let isValid = true;

    if (!rewards.token) {
      newErrors.token = "Token selection is required";
      isValid = false;
    }

    // Validate wallet instructions
    if (!formData.wallet_inst || !formData.wallet_inst.trim()) {
      newErrors.wallet_inst = "Wallet instructions are required";
      isValid = false;
    }

    if (!rewards.prizes[0] || rewards.prizes[0] <= 0) {
      newErrors.firstPrize =
        "First prize amount is required and must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
    }

    if (isValid) {
      if (currentStep === 4) {
        handleSubmit();
      } else {
        setCurrentStep((prev) => prev + 1);
        setErrors({});
      }
    }
  };

  // Add a cleanup function to clear localStorage on successful submission

  const handleSubmit = async () => {
    setIsSaving(true);
    if (validateStep4()) {
      setFormData((prevState) => ({
        ...prevState,
        reward: JSON.stringify(rewards),
        detailed_description: value,
        requirements: requirementsValue,
        deliverables: deliverablesValue,
        template: selectedTemplate.id || "",
      }));
      setIsReadyToSubmit(true);
    }
  };

  useEffect(() => {
    if (isReadyToSubmit && formData.reward) {
      const submitBounty = async () => {
        try {
          const url = isEditing && slug 
            ? `/api/edit_bounty?slug=${slug}`
            : `/api/bounty`;
          
          const method = isEditing ? 'PUT' : 'POST';
  
          const response = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
  
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to save bounty");
          }
  
          // Clear localStorage after successful submission
          localStorage.removeItem("bountyFormData");
          localStorage.removeItem("bountyRewards");
          localStorage.removeItem("selectedTemplateId");
          localStorage.removeItem("detailedDescription");
          localStorage.removeItem("currentStep");

          // redirect for new bounty
          if (data.redirectUrl && !isEditing) {
            router.push(data.redirectUrl);
          }
  
          toast.success(isEditing ? "Bounty updated successfully!" : "Bounty added successfully!");
        } catch (error) {
          console.error("Error saving bounty:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to save bounty. Please try again."
          );
        } finally {
          setIsReadyToSubmit(false);
          setIsSaving(false);
        }
      };
  
      submitBounty();
    }
  }, [isReadyToSubmit, formData, isEditing, slug, router]);
  
  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Update formData whenever the toggle changes
  const handleToggle = (checked) => {
    setAllowMultipleSubmissions(checked);
    handleInputChange("submission_type", checked ? "multiple" : "single");
  };

  // const handleTemplateSelect = (template) => {
  //   setSelectedTemplate(template);
  //   if (template.id === "empty") {
  //     setFormData((prev) => ({
  //       ...prev,
  //       template: template.id,
  //       short_description: "",
  //       requirements: [],
  //       deliverables: [],
  //     }));
  //     setValue("");
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       template: template.id,
  //       short_description: templateData.Data[template.id].short_description,
  //       requirements: templateData.Data[template.id].requirements,
  //       deliverables: templateData.Data[template.id].deliverables,
  //     }));
  //     setValue(templateData.Data[template.id].detailed_description);
  //   }
  //   if (errors.template) {
  //     setErrors((prev) => {
  //       const newErrors = { ...prev };
  //       delete newErrors.template;
  //       return newErrors;
  //     });
  //   }
  // };

  // Prepare options for react-select
  const tokenOptions = Object.entries(tokensList).map(([key, imagePath]) => ({
    value: key,
    label: (
      <div className="flex items-center gap-2">
        <img src={imagePath} alt={key} className="w-4 h-4" />
        {key}
      </div>
    ),
  }));

  // Handle token change
  const handleTokenChange = (selectedOption) => {
    setRewards((prev) => ({ ...prev, token: selectedOption.value }));
    if (errors.token) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.token;
        return newErrors;
      });
    }
  };

  const duplicatePrize = (index) => {
    setRewards((prev) => ({
      ...prev,
      prizes: [...prev.prizes, prev.prizes[index] || 0],
    }));
  };

  const addPrize = () => {
    setRewards((prev) => ({
      ...prev,
      prizes: [...prev.prizes, 0],
    }));
  };

  const deletePrize = (index) => {
    if (rewards.prizes.length > 1) {
      setRewards((prev) => ({
        ...prev,
        prizes: prev.prizes.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAmountChange = (index, value) => {
    const numValue = parseFloat(value) || 0;
    setRewards((prev) => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => (i === index ? numValue : prize)),
    }));
    if (errors.firstPrize && index === 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.firstPrize;
        return newErrors;
      });
    }
  };

  const handleBonusPrizeChange = (field, value) => {
    setRewards((prev) => ({
      ...prev,
      bonusPrize: { ...prev.bonusPrize, [field]: value },
    }));
  };

  const addBonusPrize = () => {
    setRewards((prev) => ({
      ...prev,
      bonusPrize: { number: "", amount: "" },
    }));
    setIsBonusPrizeAdded(true);
  };

  const removeBonusPrize = () => {
    setRewards((prev) => ({
      ...prev,
      bonusPrize: { number: "", amount: "" },
    }));
    setIsBonusPrizeAdded(false);
  };

  const calculateTotalAmount = () => {
    const totalPrizes = rewards.prizes.reduce((acc, prize) => acc + prize, 0);
    const numberOfBonusPrizes = parseInt(rewards.bonusPrize.number) || 0;
    const bonusPrizeAmount = parseFloat(rewards.bonusPrize.amount) || 0;
    const totalBonusPrizes = numberOfBonusPrizes * bonusPrizeAmount;
    return totalPrizes + totalBonusPrizes;
  };

  const totalPrize = calculateTotalAmount();
  let commission = 0;
  let commissionType = '';

  if (totalPrize > 500) {
    commission = totalPrize * 0.1 + 50; // 10%+50 dollar
    commissionType = '$50 + 10% Commission (for prizes > $500)';
  } else {
    commission = totalPrize * 0.2; // 20% commission
    commissionType = '20% Commission (for prizes < 500 tokens)';
  }

  const totalPayable = totalPrize + commission;

  const handleSkillsChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
    const skillsString = selectedOption.map((option) => option.value).join(",");
    setSelectedOptionStrings(skillsString);
    setFormData((prev) => ({
      ...prev,
      skills: skillsString,
    }));
  };

  const skillOptions = skillsList.map((skill) => ({
    value: skill,
    label: skill,
  }));

  // Listing Geography
  const countryOptions = [
    { value: "global", label: "Global" },
    { value: "Community", label: "Community" },
    { value: "Onsite", label: "Onsite" },
    ...countriesList.map((country) => ({
      value: country.toLowerCase(),
      label: country,
    })),
  ];

  const categoryOptions = [
    { value: "Development", label: "Development" },
    { value: "Content", label: "Content" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Management", label: "Management" },
    { value: "Others", label: "Others" },
  ];

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setFormData((prev) => ({
      ...prev,
      categories: selectedOption ? selectedOption.value : "",
    }));
    if (errors.categories) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.categories;
        return newErrors;
      });
    }
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Convert to UTC for storage
    const utcDate = DateTime.fromJSDate(date)
      .setZone(selectedTimezone.value)
      .toUTC()
      .toISO();

    handleInputChange("end_date", utcDate);
  };

  const handleTimezoneChange = (selected) => {
    setSelectedTimezone(selected);
    // Keep the same local time but in new timezone
    const newDate = DateTime.fromJSDate(selectedDate)
      .setZone(selectedTimezone.value)
      .setZone(selected.value)
      .toJSDate();

    setSelectedDate(newDate);

    // Convert to UTC for storage
    const utcDate = DateTime.fromJSDate(newDate)
      .setZone(selected.value)
      .toUTC()
      .toISO();

    handleInputChange("end_date", utcDate);
  };

  if (!hasMounted) {
    return null; // or return a loading skeleton
  }

  return (
    <div className="md:px-16 md:py-9 px-5 py-5">
      <div className="mb-[12px] text-center">
        <h1 className="text-2xl text-[#0F172A] font-semibold">
          Create a Bounty
        </h1>
      </div>

      {/* Stepper */}
      <div className="flex flex-col items-center px-6 py-4">
        <div className="flex items-center justify-center w-full max-w-lg mb-8">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-white font-semibold ${
                    currentStep >= step ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {step}
                </div>
              </div>
              {step < 4 && (
                <div
                  className={`h-[2px] w-60 ${
                    currentStep > step ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Template Selection */}
      {currentStep === 1 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] md:text-lg lg:text-xl font-medium text-[#0F172A]">
              Choose a template
            </h2>
            <hr className="text-[#DCDCDC] w-[65%] md:w-[70%] lg:w-[83%]" />
          </div>
          {errors.template && (
            <p className="text-red-500 text-sm mb-2">{errors.template}</p>
          )}
          <div className="grid gap-2 md:gap-4 lg:gap-[2rem] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`bg-white px-6 py-8 rounded-2xl mt-3 shadow-md shadow-[#f5f5f5] cursor-pointer transition-transform hover:scale-105 ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-[#2FCC71]"
                    : ""
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#FFECD5] flex items-center justify-center">
                    {template.icon}
                  </div>
                  <h2 className="text-lg font-medium text-[#0F172A]">
                    {template.title}
                  </h2>
                </div>
                {/* <div className="flex items-center justify-between w-full gap-4 mt-4">
                  <a
                    href={template.quickViewLink}
                    className="w-[48%] flex items-center justify-center px-4 py-[8px] md:px-4 md:py-2 text-[#2FCC71] bg-[#F8FAFC] border-2 border-[#2FCC71] rounded-full transition duration-200 shadow hover:shadow-md text-[12px] lg:text-[14px] font-medium"
                  >
                    Quick View
                  </a>
                </div> */}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2: Basic Details */}
      {currentStep === 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] md:text-lg lg:text-xl font-medium text-[#0F172A]">
              Share Details
            </h2>
            <hr className="text-[#DCDCDC] w-[65%] md:w-[70%] lg:w-[87%]" />
          </div>

          <div className="pt-[2px] pb-0 max-w-xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-normal text-[#344054]">
                Title (65 characters max)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`bg-[#ffffff] border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[8px]`}
                placeholder="Enter Listing Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-normal text-[#344054]">
                Listing Categories <span className="text-red-500">*</span>
              </label>
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="rounded-[6px] text-black"
                placeholder="Select category"
                isClearable
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: errors.categories
                      ? "rgb(239, 68, 68)"
                      : baseStyles.borderColor,
                  }),
                }}
              />
              {errors.categories && (
                <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2 flex flex-col">
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
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-normal text-[#344054]"
              >
                Listing Geography
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

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-normal text-[#344054]">
                Point of Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`bg-[#ffffff] border ${
                  errors.contact ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[8px]`}
                placeholder="Enter Contact (TG/X/Email)"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                required
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block mb-2 text-sm font-normal text-[#344054]">
                End Date & Time <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeInput
                    dateFormat="MMM d, yyyy h:mm aa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black"
                    minDate={getMinDate()}
                    maxDate={getMaxDate()}
                    calendarClassName="rounded-lg shadow-lg border-0"
                    popperClassName="react-datepicker-left"
                  />
                </div>

                <Select
                  options={timezoneOptions}
                  value={selectedTimezone}
                  onChange={handleTimezoneChange}
                  className="text-sm text-black"
                  classNamePrefix="select"
                  placeholder="Select timezone"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: "38px",
                      height: "38px",
                      borderColor: errors.end_date ? "#ef4444" : "#e5e7eb",
                      boxShadow: state.isFocused ? "none" : base.boxShadow,
                      borderWidth: "1px",
                      "&:hover": {
                        borderColor: "#2FCC71",
                      },
                      transition: "none",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "2px 8px",
                      height: "36px",
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                  }}
                />
              </div>

              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] md:text-lg lg:text-xl font-medium text-[#0F172A]">
              Describe Your Listing
            </h2>
            <hr className="text-[#DCDCDC] w-[62%] md:w-[67%] lg:w-[80%]" />
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-4">
            <div className="w-full ">
              <label className="block mb-2 text-sm font-medium text-[#344054]">
                Task Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`resize-none bg-[#ffffff] border ${
                  errors.short_description
                    ? "border-red-500"
                    : "border-gray-300"
                } text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 w-full p-3 h-[100px] md:h-[100px]`}
                placeholder="Enter a detailed task description"
                value={formData.short_description}
                onChange={(e) =>
                  handleInputChange("short_description", e.target.value)
                }
                required
              />
              {errors.short_description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.short_description}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mb-4">
            <div className="w-full md:w-1/2 overflow-auto max-h-[500px]">
              <label className="block mb-2 text-sm font-medium text-[#344054]">
                Eligibility Requirements <span className="text-red-500">*</span>
              </label>
              {errors.requirements && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.requirements}
                </p>
              )}
              <ReactQuill
                theme="snow"
                value={requirementsValue}
                onChange={setRequirementsValue}
                className="min-h-[180px]"
              />
            </div>

            <div className="w-full md:w-1/2 overflow-auto max-h-[500px]">
              <label className="block mb-2 text-sm font-medium text-[#344054]">
                Expected Deliverables <span className="text-red-500">*</span>
              </label>
              {errors.deliverables && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.deliverables}
                </p>
              )}
              <ReactQuill
                theme="snow"
                value={deliverablesValue}
                onChange={setDeliverablesValue}
                className="min-h-[180px]"
              />
            </div>
            {/* <RequirementsEditor />
            <DeliverablesEditor /> */}
            {/* <div className="w-full md:w-1/2 ">
              <label className="block mb-2 text-sm font-medium text-[#344054]">
                Eligibility Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`resize-none bg-[#ffffff] border ${
                  errors.requirements ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 w-full p-3 h-[180px]`}
                placeholder="List the eligibility requirements"
                value={
                  Array.isArray(formData.requirements)
                    ? formData.requirements
                        .map((requirement) => `• ${requirement}`) // Prefix each requirement with a bullet
                        .join("\n")
                    : ""
                }
                onChange={(e) => {
                  const updatedRequirements = e.target.value
                    .split("\n")
                    .map((line) => line.replace(/^• /, "")); // Remove bullet points
                  handleInputChange("requirements", updatedRequirements);
                }}
                required
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.requirements}
                </p>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-[#344054]">
                Expected Deliverables <span className="text-red-500">*</span>
              </label>
              
              <textarea
                className={`resize-none bg-[#ffffff] border ${
                  errors.deliverables ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 w-full p-3 h-[180px]`}
                placeholder="Specify expected deliverables"
                value={
                  Array.isArray(formData.deliverables)
                    ? formData.deliverables
                        .map((deliverable) => `• ${deliverable}`) // Prefix each deliverable with a bullet
                        .join("\n")
                    : ""
                }
                onChange={(e) => {
                  const updatedDeliverables = e.target.value
                    .split("\n")
                    .map((line) => line.replace(/^• /, "")); // Remove bullet points
                  handleInputChange("deliverables", updatedDeliverables);
                }}
                required
              />
              {errors.deliverables && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.deliverables}
                </p>
              )}
            </div> */}
          </div>

          <div className="flex flex-col gap-4 w-full mt-8">
            <label className="block mb-2 text-sm  font-medium text-[#344054]">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            {errors.detailed_description && (
              <p className="text-red-500 text-sm mb-2">
                {errors.detailed_description}
              </p>
            )}
            <ReactQuill
              theme="snow"
              className={`min-h-96 ${
                errors.detailed_description ? "border-red-500" : ""
              }`}
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] md:text-lg lg:text-xl font-medium text-[#0F172A]">
              Reward Entry
            </h2>
            <hr className="text-[#DCDCDC] w-[68%] md:w-[71%] lg:w-[85%]" />
          </div>

          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <label className="block mb-2 text-base font-normal text-[#344054]">
                Would you like to allow multiple submissions?
              </label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={allowMultipleSubmissions}
                  onChange={(e) => handleToggle(e.target.checked)}
                />
                <div className="group peer bg-white rounded-full duration-300 w-12 h-6 ring-2 ring-gray-500 after:duration-300 after:bg-gray-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95"></div>
              </label>
            </div>

            <div className="flex flex-col mb-6">
              <label className="block mb-1 text-base font-normal text-[#344054]">
                Wallet Instruction <span className="text-red-500">*</span>
              </label>
              <p className="text-sm font-normal text-[#425069] mb-3">
                Please provide the type of wallet address (e.g., Solana,
                Ethereum, etc.) users should submit to securely receive their
                reward.
              </p>
              <input
                type="text"
                placeholder="Enter wallet type (e.g., Ethereum, Solana, etc.)"
                className={`border ${
                  errors.wallet_inst ? "border-red-500" : "border-gray-300"
                } text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full text-slate-800 p-[10px]`}
                value={formData.wallet_inst}
                onChange={(e) =>
                  handleInputChange("wallet_inst", e.target.value)
                }
                required
              />
              {errors.wallet_inst && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.wallet_inst}
                </p>
              )}
            </div>

            <div className="flex flex-col mb-5">
              <label className="block mb-2 text-base font-normal text-[#344054]">
                Select Token <span className="text-red-500">*</span>
              </label>
              <Select
                options={tokenOptions}
                defaultValue={tokenOptions.find(
                  (option) => option.value === rewards.token
                )}
                onChange={handleTokenChange}
                className={`border ${
                  errors.token ? "border-red-500" : "border-gray-300"
                } focus:ring-green-500 focus:border-green-500 block w-full text-slate-800 rounded-[6px]`}
              />
              {errors.token && (
                <p className="text-red-500 text-sm mt-1">{errors.token}</p>
              )}
            </div>

            <div className="mt-4 bg-gray-50 pt-5 pb-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base  text-[#344054]">Total Prize Amount</h3>
                <p className="text-base font-semibold  text-[#344054]">
                  {totalPrize.toFixed(2)} {rewards.token}
                </p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col items-start gap-[2px]">
                  <h3 className="text-base  text-[#344054]">Wizz's Commission</h3>
                  <span className="text-[13px] font-normal text-gray-600">({commissionType})</span>
                </div>
                <p className="text-base font-semibold  text-[#344054]">
                  {commission.toFixed(2)} {rewards.token} 
                </p>
              </div>
              <hr className="my-3 border-[#cbcbcb]" />
              <div className="flex justify-between items-center">
                <h3 className="text-base  text-[#344054]">Total Amount to be Paid</h3>
                <p className="text-base font-semibold text-[#344054]">
                  {totalPayable.toFixed(2)} {rewards.token}
                </p>
              </div>
              <hr className="my-3 border-[#cbcbcb]" />
            </div>

            {errors.firstPrize && (
              <p className="text-red-500 text-sm mb-2">{errors.firstPrize}</p>
            )}

            <div className="flex flex-col gap-2">
              {rewards.prizes.map((prize, index) => (
                <div key={index} className="flex items-center gap-3 mt-2">
                  <div className="flex items-center justify-center py-2 bg-[#2FCC71] rounded w-[15%] md:w-[8%]">
                    {index + 1}
                  </div>

                  <div className="w-[60%] md:w-[80%]">
                    <input
                      type="number"
                      className={`bg-[#ffffff] border ${
                        index === 0 && errors.firstPrize
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]`}
                      placeholder="Set the amount"
                      value={prize || ""}
                      onChange={(e) =>
                        handleAmountChange(index, e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="px-3 py-2 bg-[#EFFFF1] border-[1.3px] border-[#2FCC71] rounded-md">
                    <h2 className="text-[#2FCC71]">{rewards.token}</h2>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {/* <PlusIcon
                      className="w-5 h-5 text-[#636363] cursor-pointer"
                      onClick={() => duplicatePrize(index)}
                    /> */}
                    <TrashIcon
                      className={`w-5 h-5 ${
                        index === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-[#636363] cursor-pointer"
                      }`}
                      onClick={() => index !== 0 && deletePrize(index)}
                      aria-disabled={index === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <button
                onClick={() => addPrize()}
                className="w-full rounded-md flex items-center justify-center px-7 py-[8px] text-[#2f56cc] border border-[#2f56cc] transition duration-200 shadow hover:shadow-lg text-base font-medium mt-4"
              >
                + Add a Ranked Prize
              </button>

              <hr className="my-5" />
            </div>

            <div>
              {isBonusPrizeAdded ? (
                <div className="flex gap-2 mt-4 items-end">
                  <div className="flex flex-col">
                    <label className="block mb-2 text-sm font-normal text-[#344054]">
                      # Bonus Of Prizes
                    </label>
                    <input
                      type="number"
                      className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 w-full p-[10px]"
                      placeholder="Select the number"
                      value={rewards.bonusPrize.number}
                      onChange={(e) =>
                        handleBonusPrizeChange("number", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="flex flex-col md:w-full">
                    <label className="block mb-2 text-sm font-normal text-[#344054]">
                      Bonus Per Prize
                    </label>
                    <input
                      type="number"
                      className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 w-full p-[10px]"
                      placeholder="Set the bonus prize"
                      value={rewards.bonusPrize.amount}
                      onChange={(e) =>
                        handleBonusPrizeChange("amount", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="px-3 py-2 bg-[#EFFFF1] border-[1.3px] border-[#2FCC71] rounded-md self-end">
                    <h2 className="text-[#2FCC71]">{rewards.token}</h2>
                  </div>

                  <div className="flex items-center self-end mb-3">
                    <TrashIcon
                      className="w-5 h-5 text-[#636363] cursor-pointer"
                      onClick={removeBonusPrize}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={addBonusPrize}
                  className="w-full rounded-md flex items-center justify-center px-7 py-[8px] text-[#2FCC71] border border-green-500 transition duration-200 shadow hover:shadow-lg text-base font-medium mt-4"
                >
                  + Add a Bonus Prize
                </button>
              )}

              <hr className="my-5" />
            </div>
          </div>
        </div>
      )}
      {/* Navigation Buttons */}
      <div className="w-full flex justify-end mt-6 space-x-4">
        <button
          className={`rounded-md flex items-center justify-center px-7 py-[7px] text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-base font-medium ${
          currentStep === 1 || (isEditing && currentStep === 2)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500"
          }`}
          onClick={() => {
          if (!isEditing || currentStep > 2) {
          setCurrentStep((prev) => Math.max(prev - 1, 1));
          }
          }}
          disabled={currentStep === 1 || isSaving || (isEditing && currentStep === 2)}
        >
         Back
        </button>
        <button
          className="rounded-md flex items-center justify-center px-7 py-[7px] text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-base font-medium"
          onClick={handleNext}
          disabled={isSaving}
        >
          {currentStep === 4 ? (
            <>
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
                "Submit"
              )}{" "}
            </>
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
}
