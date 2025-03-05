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
  CurrencyDollarIcon,
  BanknotesIcon,
  ClipboardDocumentIcon,
  ListBulletIcon,
  CheckIcon,
  PencilIcon,
  DocumentTextIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import templateData from "@/lib/template/job_templates";
import { skillsList, countriesList, tokensList } from "@/lib/options";
import Select from "react-select";
import { DateTime } from "luxon";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

// Dynamically import React Quill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

// Dynamically import DatePicker with no SSR
const DatePicker = dynamic(() => import("react-datepicker"), {
  ssr: false,
  loading: () => <p>Loading date picker...</p>,
});

// Import DatePicker CSS only on client side
import "react-datepicker/dist/react-datepicker.css";
import { type } from "os";

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
];

export default function JobForm() {
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
  const [job_perksValue, setJob_PerksValue] = useState("");
  const [roles_responsibilityValue, setRoles_ResponsibilityValue] =
    useState("");
  const [selectedPaymentPeriod, setSelectedPaymentPeriod] = useState(null);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    template: "",
    title: "",
    categories: "",
    skills: "",
    location: "",
    contact: "",
    duration: "",
    job_type: "",
    end_date: "",
    short_description: "",
    requirements: [],
    job_perks: [],
    roles_responsibility: [],
    detailed_description: "",
    reward: "",
    position: "",
    paymentType: "",
    minAmount: "",
    maxAmount: "",
    fixedAmount: "",
    paymentPeriod: "",
    questionnaire: {
      questions: [],
    },
  });

  const [rewards, setRewards] = useState({
    token: "USDC",
  });

  // Initialize other state variables
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedJob_Type, setSelectedJob_Type] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Check if component has mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && hasMounted) {
      try {
        const savedData = localStorage.getItem("jobFormData");
        const savedRewards = localStorage.getItem("jobRewards");
        const savedTemplateId = localStorage.getItem("selectedTemplateId");
        const savedValue = localStorage.getItem("detailedDescription");
        const savedCurrentStep = localStorage.getItem("currentStep");

        // if (savedData) setFormData(JSON.parse(savedData));
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
            questionnaire: parsedData.questionnaire || { questions: [] },
          }));
        }
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

  const [selectedTimezone, setSelectedTimezone] = useState({
    value: "UTC",
    label: "UTC (GMT)",
  });

  // Questionnaire
  //question types to select from
  const questionTypes = [
    { id: "radio", label: "Single Choice", icon: ListBulletIcon },
    { id: "checkbox", label: "Multiple Selection", icon: CheckIcon },
    { id: "short", label: "Single Line Text", icon: PencilIcon },
    { id: "long", label: "Paragraph Text", icon: DocumentTextIcon },
    { id: "dropdown", label: "Select One", icon: ChevronDownIcon },
  ];

  // add new question acc. to type
  const addNewQuestion = (type) => {
    const newQuestion = {
      id: formData.questionnaire.questions.length + 1,
      type,
      label: "",
      required: false,
      options:
        type === "radio" || type === "checkbox" || type === "dropdown"
          ? [""]
          : [],
    };

    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        questions: [...prev.questionnaire.questions, newQuestion],
      },
    }));
  };

  // update question field
  const updateQuestion = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        questions: prev.questionnaire.questions.map((q) =>
          q.id === id ? { ...q, [field]: value } : q
        ),
      },
    }));
  };

  // add option to question
  const addOption = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        questions: prev.questionnaire.questions.map((q) =>
          q.id === questionId ? { ...q, options: [...q.options, ""] } : q
        ),
      },
    }));
  };

  // update option value
  const updateOption = (questionId, optionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        questions: prev.questionnaire.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((opt, idx) =>
                  idx === optionIndex ? value : opt
                ),
              }
            : q
        ),
      },
    }));
  };

  // remove question
  const removeQuestion = (id) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        questions: prev.questionnaire.questions.filter((q) => q.id !== id),
      },
    }));
  };

  // remove option
  const removeOption = (questionId, optionIndex) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        questions: prev.questionnaire.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.filter((_, idx) => idx !== optionIndex),
              }
            : q
        ),
      },
    }));
  };

  // Load existing job data when editing
  useEffect(() => {
    const loadJobData = async () => {
      if (isEditing && slug) {
        try {
          const response = await fetch(`/api/jobs/edit_job?slug=${slug}`);
          if (!response.ok) throw new Error("Failed to fetch job data");
  
          const data = await response.json();
  
          // Initialize form data with defaults
          setFormData({
            title: data.job.title || "",
            categories: data.job.categories || "",
            reward: data.job.reward || "",
            job_type: data.job.job_type || "",
            skills: data.job.skills || "",
            contact: data.job.contact || "",
            duration: data.job.duration || "",
            end_date: data.job.end_date || "",
            location: data.job.location || "",
            short_description: data.job.short_description || "",
            position: data.job.position || "",
            paymentType: data.job.payment_type || "",
            minAmount: data.job.min_amount || "",
            maxAmount: data.job.max_amount || "",
            fixedAmount: data.job.fixed_amount || "",
            paymentPeriod: data.job.payment_period || "",
            questionnaire: data.job.questionnaire || { questions: [] }, // Default in case parsing fails
          });
  
          setValue(data.job.detailed_description || "");
          setRequirementsValue(data.job.requirements || "");
          setJob_PerksValue(data.job.job_perks || "");
          setRoles_ResponsibilityValue(data.job.roles_responsibility || "");
  
          if (data.job.categories) {
            setSelectedCategory(
              categoryOptions.find((opt) => opt.value === data.job.categories)
            );
          }
          if (data.job.job_type) {
            setSelectedJob_Type(
              job_typeOptions.find((opt) => opt.value === data.job.job_type)
            );
          }
          if (data.job.payment_period) {
            setSelectedPaymentPeriod(
              paymentPeriodOptions.find(
                (opt) => opt.value === data.job.payment_period
              )
            );
          }
  
          // Safely handle questionnaire parsing
          if (data.job.questionnaire) {
            try {
              const parsedQuestionnaire =
                typeof data.job.questionnaire === "string"
                  ? JSON.parse(data.job.questionnaire)
                  : data.job.questionnaire;
              setFormData((prev) => ({
                ...prev,
                questionnaire: parsedQuestionnaire || { questions: [] },
              }));
            } catch (parseError) {
              console.error("Error parsing questionnaire:", parseError);
              setFormData((prev) => ({
                ...prev,
                questionnaire: { questions: [] }, // Fallback to empty questionnaire
              }));
              toast.error("Invalid questionnaire format");
            }
          }
  
          // Handle skills parsing
          const skillsArray = data.job?.skills
            ? data.job.skills.split(",").map((skill) => {
                return (
                  skillOptions.find((option) => option.value === skill.trim()) ||
                  null
                );
              })
            : [];
          setSelectedOptions(skillsArray);
          setSelectedOptionStrings(data.job?.skills || "");
  
        } catch (error) {
          console.error("Error loading job data:", error);
          toast.error("Failed to load job data");
        }
      }
      setIsLoading(false);
    };
  
    loadJobData();
  }, [isEditing, slug]);

  // Modify all localStorage access with client-side checks
  useEffect(() => {
    if (!hasMounted) return;
    const savedData = localStorage.getItem("jobFormData");
    const savedRewards = localStorage.getItem("jobRewards");
    const savedTemplateId = localStorage.getItem("selectedTemplateId");
    const savedValue = localStorage.getItem("detailedDescription");
    const savedCurrentStep = localStorage.getItem("currentStep");
    const savedRequirements = localStorage.getItem("requirementsDescription");
    const savedJob_Perks = localStorage.getItem("job_perksDescription");
    const savedRoles_Responsibility = localStorage.getItem(
      "roles_responsibilityDescription"
    );

    if (savedRequirements) {
      setRequirementsValue(savedRequirements);
    }
    if (savedJob_Perks) {
      setJob_PerksValue(savedJob_Perks);
    }
    if (savedRoles_Responsibility) {
      setRoles_ResponsibilityValue(savedRoles_Responsibility);
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
    localStorage.setItem("jobFormData", JSON.stringify(formData));
    localStorage.setItem("jobRewards", JSON.stringify(rewards));
    // Only store the template ID instead of the full template object
    localStorage.setItem("selectedTemplateId", selectedTemplate?.id || "");
    localStorage.setItem("detailedDescription", value);
    localStorage.setItem("currentStep", currentStep.toString());
    localStorage.setItem("requirementsDescription", requirementsValue);
    localStorage.setItem("job_perksDescription", job_perksValue);
    localStorage.setItem(
      "roles_responsibilityDescription",
      roles_responsibilityValue
    );
  }, [
    hasMounted,
    formData,
    rewards,
    selectedTemplate,
    value,
    currentStep,
    requirementsValue,
    job_perksValue,
    roles_responsibilityValue,
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
      setJob_PerksValue("");
      setRoles_ResponsibilityValue("");
    } else {
      setFormData((prev) => ({
        ...prev,
        template: template.id,
        short_description: templateData.Data[template.id].short_description,
      }));
      setValue(templateData.Data[template.id].detailed_description);
      setRequirementsValue(templateData.Data[template.id].requirements);
      setJob_PerksValue(templateData.Data[template.id].job_perks);
      setRoles_ResponsibilityValue(
        templateData.Data[template.id].roles_responsibility
      );
    }
    if (errors.template) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.template;
        return newErrors;
      });
    }
  };

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

    if (!formData.job_type) {
      newErrors.job_type = "Job Type is required";
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

    if (!formData.duration.trim()) {
      newErrors.duration = "Job Duration is required";
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

    if (!job_perksValue.trim()) {
      newErrors.job_perks = "Job Perks are required";
      isValid = false;
    }

    if (!roles_responsibilityValue.trim()) {
      newErrors.roles_responsibility =
        "Roles and Responsibilities are required";
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

    if (!formData.questionnaire?.questions?.length) {
      return true;
    }

    // validate each question
    formData.questionnaire.questions.forEach((question, index) => {
      const questionNum = index + 1;

      // validate question label
      if (!question.label.trim()) {
        newErrors[
          `question_${question.id}_label`
        ] = `Question ${questionNum} requires a label`;
        isValid = false;
      } else if (question.label.length < 3) {
        newErrors[
          `question_${question.id}_label`
        ] = `Question ${questionNum} label is too short (minimum 3 characters)`;
        isValid = false;
      }

      // validate options wherever required
      if (["radio", "checkbox", "dropdown"].includes(question.type)) {
        if (!question.options?.length) {
          newErrors[
            `question_${question.id}_options`
          ] = `Question ${questionNum} requires at least one option`;
          isValid = false;
        } else {
          const nonEmptyOptions = question.options.filter((opt) => opt.trim());
          const uniqueOptions = new Set(nonEmptyOptions);

          if (nonEmptyOptions.length < question.options.length) {
            newErrors[
              `question_${question.id}_options`
            ] = `Question ${questionNum} contains empty options`;
            isValid = false;
          }

          if (uniqueOptions.size < nonEmptyOptions.length) {
            newErrors[
              `question_${question.id}_options`
            ] = `Question ${questionNum} contains duplicate options`;
            isValid = false;
          }

          if (nonEmptyOptions.length < 2) {
            newErrors[
              `question_${question.id}_options`
            ] = `Question ${questionNum} requires at least 2 options`;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateStep5 = () => {
    const newErrors = {};
    let isValid = true;

    if (!rewards.token) {
      newErrors.token = "Token selection is required";
      isValid = false;
    }

    if (!formData.position || !formData.position.trim()) {
      newErrors.position = "Number of positions are required";
      isValid = false;
    }

    // Payment Type Validation
    if (!formData.paymentType) {
      newErrors.paymentType = "Payment type selection is required";
      isValid = false;
    }

    // Validate Range Amount fields
    if (formData.paymentType === "range") {
      if (!formData.minAmount) {
        newErrors.minAmount = "Minimum amount is required";
        isValid = false;
      }
      if (!formData.maxAmount) {
        newErrors.maxAmount = "Maximum amount is required";
        isValid = false;
      }
      if (Number(formData.minAmount) >= Number(formData.maxAmount)) {
        newErrors.maxAmount =
          "Maximum amount must be greater than minimum amount";
        isValid = false;
      }
    }

    // Validate Fixed Amount field
    if (formData.paymentType === "fixed" && !formData.fixedAmount) {
      newErrors.fixedAmount = "Fixed amount is required";
      isValid = false;
    }

    // Validate Payment Period
    if (
      (formData.paymentType === "fixed" || formData.paymentType === "range") &&
      !formData.paymentPeriod
    ) {
      newErrors.paymentPeriod = "Payment period is required";
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
      case 5:
        isValid = validateStep5();
        break;
    }

    if (isValid) {
      if (currentStep === 5) {
        handleSubmit();
      } else {
        setCurrentStep((prev) => prev + 1);
        setErrors({});
      }
    }
  };

  // Add a cleanup function to clear localStorage on successful submission

  // Update the handleSubmit function
  const handleSubmit = async () => {
    setIsSaving(true);
    if (validateStep5()) {
      // Transform the form data to match the API expectations
      const transformedFormData = {
        ...formData,
        // Required fields from the API
        title: formData.title,
        end_date: formData.end_date,
        skills: formData.skills,
        contact: formData.contact,
        categories: formData.categories,
        short_description: formData.short_description,
        detailed_description: value,
        requirements: requirementsValue,
        position: formData.position,
        job_type: formData.job_type,
        payment_type: formData.paymentType,
        roles_responsibility: roles_responsibilityValue,
        questionnaire: formData.questionnaire,

        // Optional fields
        template: selectedTemplate?.id || "",
        location: formData.location || "",
        job_perks: job_perksValue || "",
        duration: formData.duration || "",

        reward: rewards.token || "",

        // Payment related fields
        min_amount:
          formData.paymentType === "range"
            ? Number(formData.minAmount)
            : undefined,
        max_amount:
          formData.paymentType === "range"
            ? Number(formData.maxAmount)
            : undefined,
        fixed_amount:
          formData.paymentType === "fixed"
            ? Number(formData.fixedAmount)
            : undefined,
        payment_period: formData.paymentPeriod || "",
      };

      setFormData(transformedFormData);
      setIsReadyToSubmit(true);
    }
  };

  // Update the submission effect
  useEffect(() => {
    if (isReadyToSubmit) {
      const submitJob = async () => {
        try {
          const url =
            isEditing && slug ? `/api/jobs/edit_job?slug=${slug}` : `/api/jobs/create_job`;
          const method = isEditing ? "PUT" : "POST";

          const response = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to save job");
          }

          // Clear all localStorage items
          const localStorageKeys = [
            "jobFormData",
            "jobRewards",
            "selectedTemplateId",
            "detailedDescription",
            "currentStep",
            "requirementsDescription",
            "job_perksDescription",
            "roles_responsibilityDescription",
          ];

          localStorageKeys.forEach((key) => localStorage.removeItem(key));

          // Handle redirect for new job
          if (data.redirectUrl && !isEditing) {
            router.push(data.redirectUrl);
          }

          toast.success(
            isEditing ? "Job updated successfully!" : "Job added successfully!"
          );
        } catch (error) {
          console.error("Error saving job:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to save job. Please try again."
          );
        } finally {
          setIsReadyToSubmit(false);
          setIsSaving(false);
        }
      };

      submitJob();
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

  const job_typeOptions = [
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Internship", label: "Internship" },
    { value: "Contract", label: "Contract" },
    { value: "Temporary", label: "Temporary" },
    { value: "Others", label: "Others" },
  ];

  const paymentPeriodOptions = [
    { value: "quarterly", label: "Quarterly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
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

  const handleJob_TypeChange = (selectedOption) => {
    setSelectedJob_Type(selectedOption);
    setFormData((prev) => ({
      ...prev,
      job_type: selectedOption ? selectedOption.value : "",
    }));
    if (errors.job_type) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.job_type;
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
        <h1 className="text-2xl text-[#0F172A] font-semibold">Create a Job</h1>
      </div>

      {/* Stepper */}
      <div className="flex flex-col items-center px-6 py-4">
        <div className="flex items-center justify-center w-full max-w-lg mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
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
              {step < 5 && (
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
                Job Title (65 characters max)
                <span className="text-red-500">*</span>
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
                Job Categories <span className="text-red-500">*</span>
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
                Job Geography
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

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-normal text-[#344054]">
                Job Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`bg-[#ffffff] border ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[8px]`}
                placeholder="Enter duration of the job"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                required
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-normal text-[#344054]">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <Select
                options={job_typeOptions}
                value={selectedJob_Type}
                onChange={handleJob_TypeChange}
                className="rounded-[6px] text-black"
                placeholder="Select employment type"
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
              {errors.job_type && (
                <p className="text-red-500 text-sm mt-1">{errors.job_type}</p>
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
              Describe Your Job
            </h2>
            <hr className="text-[#DCDCDC] w-[62%] md:w-[67%] lg:w-[80%]" />
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-4">
            <div className="w-full ">
              <label className="block mb-2 text-sm font-medium text-[#344054]">
                Job Description <span className="text-red-500">*</span>
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
                Job Perks <span className="text-red-500">*</span>
              </label>
              {errors.job_perks && (
                <p className="text-red-500 text-sm mb-2">{errors.job_perks}</p>
              )}
              <ReactQuill
                theme="snow"
                value={job_perksValue}
                onChange={setJob_PerksValue}
                className="min-h-[180px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full mt-8">
            <label className="block mb-2 text-sm  font-medium text-[#344054]">
              Roles & Responsibilities <span className="text-red-500">*</span>
            </label>
            {errors.roles_responsibility && (
              <p className="text-red-500 text-sm mb-2">
                {errors.roles_responsibility}
              </p>
            )}
            <ReactQuill
              theme="snow"
              className={`min-h-96 ${
                errors.roles_responsibility ? "border-red-500" : ""
              }`}
              value={roles_responsibilityValue}
              onChange={setRoles_ResponsibilityValue}
            />
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
              Application Questionnaire
            </h2>
            <hr className="text-[#DCDCDC] w-[62%] md:w-[67%] lg:w-[74%]" />
          </div>

          <div className="space-y-6">
            {/* Default Questions */}
            <div className="space-y-6">
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-900">
                    Question 1: Default Question
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      value="Have you worked in similar roles before? If yes, please describe your experience with company name."
                      disabled
                      data-type="exp"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-200"
                    />
                    <label className="text-sm text-gray-700">Required</label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-900">
                    Question 2: Default Question
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      value="Why do you want to join this role?"
                      disabled
                      data-type="reason"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-200"
                    />
                    <label className="text-sm text-gray-700">Required</label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-900">
                    Question 3: Default Question
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      value="Link to your resume/portfolio"
                      disabled
                      data-type="resume"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-200"
                    />
                    <label className="text-sm text-gray-700">Required</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              {questionTypes.map((type) => (
                <button
                  key={type.id}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                  focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => addNewQuestion(type.id)}
                >
                  <type.icon className="w-5 h-5" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {formData.questionnaire.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-900">
                      Question {index + 4} : {" "}
                      {
                        questionTypes.find((type) => type.id === question.type)
                          ?.label
                      }
                    </span>
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      {/* Question */}
                      <input
                        type="text"
                        className={`w-full text-gray-900 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                          errors[`question_${question.id}_label`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter question"
                        value={question.label}
                        onChange={(e) =>
                          updateQuestion(question.id, "label", e.target.value)
                        }
                      />
                      {errors[`question_${question.id}_label`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`question_${question.id}_label`]}
                        </p>
                      )}
                    </div>

                    {/* Question Options if any */}
                    {(question.type === "radio" ||
                      question.type === "checkbox" ||
                      question.type === "dropdown") && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <input
                              type="text"
                              className={`flex-1 text-gray-900 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                                errors[`question_${question.id}_options`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                removeOption(question.id, optionIndex)
                              }
                              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        {errors[`question_${question.id}_options`] && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[`question_${question.id}_options`]}
                          </p>
                        )}
                        <button
                          onClick={() => addOption(question.id)}
                          className="flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-2"
                        >
                          <PlusIcon className="w-5 h-5" />
                          Add Option
                        </button>
                      </div>
                    )}

                    {/* Required or not */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "required",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700">Required</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] md:text-lg lg:text-xl font-medium text-[#0F172A]">
              Payment Details
            </h2>
            <hr className="text-[#DCDCDC] w-[68%] md:w-[71%] lg:w-[85%]" />
          </div>

          <div className="max-w-xl mx-auto">
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

            <div className="flex flex-col mb-6">
              <label className="block mb-1 text-base font-normal text-[#344054]">
                Number Of Positions Available{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter no. of positions available for the job"
                className={`border ${
                  errors.position ? "border-red-500" : "border-gray-300"
                } text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full text-slate-800 p-[10px]`}
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                required
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
              )}
            </div>

            {/* Payment Type Selection */}
            <div className="flex flex-col mb-6">
              <label className="block mb-4 text-base font-normal text-[#344054]">
                Payment Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {/* Amount Range Option */}
                <div
                  className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer ${
                    formData.paymentType === "range"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => handleInputChange("paymentType", "range")}
                >
                  <div className="text-center">
                    <CurrencyDollarIcon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm text-gray-800 font-medium">
                      Amount Range
                    </span>
                  </div>
                </div>

                {/* Fixed Amount Option */}
                <div
                  className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer ${
                    formData.paymentType === "fixed"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => handleInputChange("paymentType", "fixed")}
                >
                  <div className="text-center">
                    <BanknotesIcon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm text-gray-800 font-medium">
                      Fixed Amount
                    </span>
                  </div>
                </div>

                {/* Quote Option */}
                <div
                  className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer ${
                    formData.paymentType === "quote"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => handleInputChange("paymentType", "quote")}
                >
                  <div className="text-center">
                    <ClipboardDocumentIcon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm text-gray-800 font-medium">
                      Allow Quotes
                    </span>
                  </div>
                </div>
              </div>
              {/* Range Amount Fields */}
              {formData.paymentType === "range" && (
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Minimum Amount"
                      className={`border text-gray-800 ${
                        errors.minAmount ? "border-red-500" : "border-gray-300"
                      } text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]`}
                      value={formData.minAmount}
                      onChange={(e) =>
                        handleInputChange("minAmount", e.target.value)
                      }
                    />
                    {errors.minAmount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.minAmount}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Maximum Amount"
                      className={`border text-gray-800 ${
                        errors.maxAmount ? "border-red-500" : "border-gray-300"
                      } text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]`}
                      value={formData.maxAmount}
                      onChange={(e) =>
                        handleInputChange("maxAmount", e.target.value)
                      }
                    />
                    {errors.maxAmount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.maxAmount}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* Fixed Amount Field */}
              {formData.paymentType === "fixed" && (
                <div className="mt-4">
                  <input
                    type="number"
                    placeholder="Enter Fixed Amount"
                    className={`border text-gray-800 ${
                      errors.fixedAmount ? "border-red-500" : "border-gray-300"
                    } text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]`}
                    value={formData.fixedAmount}
                    onChange={(e) =>
                      handleInputChange("fixedAmount", e.target.value)
                    }
                  />
                  {errors.fixedAmount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fixedAmount}
                    </p>
                  )}
                </div>
              )}
              {/* Payment Period Selection */}
              {(formData.paymentType === "fixed" ||
                formData.paymentType === "range") && (
                <div className="mt-4">
                  <label className="block mb-2 text-base font-normal text-[#344054]">
                    Payment Period <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={paymentPeriodOptions}
                    value={
                      formData.paymentPeriod
                        ? {
                            value: formData.paymentPeriod,
                            label:
                              formData.paymentPeriod.charAt(0).toUpperCase() +
                              formData.paymentPeriod.slice(1),
                          }
                        : null
                    }
                    onChange={(option) =>
                      handleInputChange("paymentPeriod", option.value)
                    }
                    className={`text-gray-800 ${
                      errors.paymentPeriod ? "border-red-500" : ""
                    }`}
                    classNamePrefix="react-select"
                    placeholder="Select payment period"
                  />
                  {errors.paymentPeriod && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.paymentPeriod}
                    </p>
                  )}
                </div>
              )}{" "}
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
          disabled={
            currentStep === 1 || isSaving || (isEditing && currentStep === 2)
          }
        >
          Back
        </button>
        <button
          className="rounded-md flex items-center justify-center px-7 py-[7px] text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-base font-medium"
          onClick={handleNext}
          disabled={isSaving}
        >
          {currentStep === 5 ? (
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
