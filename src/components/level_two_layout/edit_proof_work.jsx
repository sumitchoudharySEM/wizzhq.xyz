"use client";

import React, { use, useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select, { MultiValue } from "react-select";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";

const EditProofWork = ({ isOpen, onRequestClose, powId }) => {
  console.log("EditProofWork -> powId", powId);
  // Move all state declarations to the top
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [skillsUsed, setSkillsUsed] = useState([]);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [skillInputValue, setSkillInputValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [powData, setPowData] = useState(null);
  const [formData, setFormData] = useState({
    project_title: "",
    project_description: "",
    link: "",
    skills_used: "",
  });

  // Move useEffect before any conditional returns
  useEffect(() => {
    if (!powId) return;
  
    const controller = new AbortController();
  
    const fetchPowData = async () => {
      try {
        const response = await fetch(`/api/edit_pow?powId=${powId}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
  
        const text = await response.text();
        console.log('Response headers:', Object.fromEntries(response.headers));
        console.log('Response text:', text);
  
        const data = JSON.parse(text);
  
        if (data?.pow) {
          setFormData({
            project_title: data.pow.project_title || '',
            project_description: data.pow.project_description || '',
            link: data.pow.link || '',
            skills_used: data.pow.skills_used || ''
          });
  
          if (data.pow.skills_used) {
            setSelectedSkills(
              data.pow.skills_used.split(',')
                .filter(Boolean)
                .map(skill => ({
                  value: skill.trim(),
                  label: skill.trim()
                }))
            );
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message);
          console.error('Fetch error:', error);
        }
      }
    };
  
    fetchPowData();
    return () => controller.abort();
  }, [powId]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Title validation
    if (!formData.project_title?.trim()) {
      errors.project_title = "Project title is required";
      isValid = false;
    } else if (formData.project_title.length < 3) {
      errors.project_title = "Project title must be at least 3 characters";
      isValid = false;
    } else if (formData.project_title.length > 50) {
      errors.project_title = "Project title cannot exceed 50 characters";
      isValid = false;
    }

    // Description validation
    if (!formData.project_description?.trim()) {
      errors.project_description = "Project description is required";
      isValid = false;
    } else if (formData.project_description.length < 20) {
      errors.project_description =
        "Project description must be at least 20 characters";
      isValid = false;
    } else if (formData.project_description.length > 500) {
      errors.project_description =
        "Project description cannot exceed 500 characters";
      isValid = false;
    }

    // Link validation
    if (!formData.link?.trim()) {
      errors.link = "Project link is required";
      isValid = false;
    } else {
      try {
        new URL(formData.link);
      } catch (error) {
        errors.link = "Please enter a valid URL";
        isValid = false;
      }
    }

    // Skills validation
    if (!selectedSkills || selectedSkills.length === 0) {
      errors.skills_used = "At least one skill is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  if (!isOpen) return null;

  const handleSkillKeyDown = (event) => {
    if (!skillInputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        const newSkill = { value: skillInputValue, label: skillInputValue };
        setSelectedSkills((prev) => [...prev, newSkill]);
        setFormData((prev) => ({
          ...prev,
          skills_used: [...selectedSkills, newSkill]
            .map((skill) => skill.value)
            .join(","),
        }));
        setSkillInputValue("");
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  // Add this handler for skills change
  const handleSkillsChange = (newValue) => {
    setSelectedSkills(newValue || []);
    setFormData((prev) => ({
      ...prev,
      skills_used: (newValue || []).map((skill) => skill.value).join(","),
    }));
    if (formErrors.skills_used) {
      setFormErrors((prev) => ({ ...prev, skills_used: null }));
    }
  };


  //call the PUT api to update the proof of work data of particular powId
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`/api/edit_pow?powId=${powId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          skills_used: selectedSkills.map((skill) => skill.value).join(","),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("failed to update profile");
        throw new Error(data.error || "Failed to update proof of work");
      }
      toast.success("Proof of work updated successfully!");
      // Clear form and close modal on success
      setFormData({
        project_title: "",
        project_description: "",
        link: "",
        skills_used: "",
      });
      setSelectedSkills([]);
      setSkillInputValue("");
      onRequestClose();
    } catch (error) {
      console.error("Error updating proof of work:", error);
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <button className="text-gray-500 float-right" onClick={onRequestClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-bold mb-4 text-[#323232]">
          Edit Proof of Work
        </h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">Proof of work edited successfully!</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Project Title */}
          <div className="flex flex-col">
            <label className="block mb-2 text-sm font-medium text-[#344054]">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.project_title}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  project_title: e.target.value,
                }));
                if (formErrors.project_title) {
                  setFormErrors((prev) => ({ ...prev, project_title: null }));
                }
              }}
              className={`bg-[#ffffff] border ${
                formErrors.project_title ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 block w-full p-3`}
              placeholder="Enter project title"
            />
            {formErrors.project_title && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.project_title}
              </p>
            )}
          </div>

          {/* Project Description */}
          <div className="flex flex-col">
            <label className="block mb-2 text-sm font-medium text-[#344054]">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.project_description}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  project_description: e.target.value,
                }));
                if (formErrors.project_description) {
                  setFormErrors((prev) => ({
                    ...prev,
                    project_description: null,
                  }));
                }
              }}
              className={`resize-none bg-[#ffffff] border ${
                formErrors.project_description
                  ? "border-red-500"
                  : "border-gray-300"
              } text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 w-full p-3 h-32`}
              placeholder="Describe your project"
            />
            {formErrors.project_description && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.project_description}
              </p>
            )}
          </div>

          {/* Project Link */}
          <div className="flex flex-col">
            <label className="block mb-2 text-sm font-medium text-[#344054]">
              Project Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  link: e.target.value,
                }));
                if (formErrors.link) {
                  setFormErrors((prev) => ({ ...prev, link: null }));
                }
              }}
              className={`bg-[#ffffff] border ${
                formErrors.link ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 block w-full p-3`}
              placeholder="Enter project URL"
            />
            {formErrors.link && (
              <p className="text-red-500 text-sm mt-1">{formErrors.link}</p>
            )}
          </div>

          {/* Skills Used */}
          <div className="flex flex-col">
            <label className="block mb-2 text-sm font-medium text-[#344054]">
              Skills Used <span className="text-red-500">*</span>
            </label>
            <CreatableSelect
              components={{ DropdownIndicator: null }}
              inputValue={skillInputValue}
              isClearable
              isMulti
              menuIsOpen={false}
              onChange={handleSkillsChange}
              onInputChange={(newValue) => setSkillInputValue(newValue)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type skill and press enter..."
              value={selectedSkills}
              className={`rounded-[6px] ${
                formErrors.skills_used ? "border-red-500" : ""
              }`}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: formErrors.skills_used ? "#ef4444" : "#e5e7eb",
                  "&:hover": {
                    borderColor: "#2FCC71",
                  },
                }),
              }}
            />
            {formErrors.skills_used && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.skills_used}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end mt-4">
            {formErrors.submit && (
              <p className="text-red-500 text-sm mr-4">{formErrors.submit}</p>
            )}
            <button
              type="submit"
              className="rounded-md flex items-center justify-center px-4 py-2 text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProofWork;
