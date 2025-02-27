"use client";

import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

const Page = () => {
  const [formData, setFormData] = useState({
    type_x_tg: "",
    x_tg_username: "",
    points: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const platformOptions = [
    { value: "x", label: "X (Twitter)" },
    { value: "tg", label: "Telegram" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/give_contribution_points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type_x_tg: formData.type_x_tg,
          x_tg_username: formData.x_tg_username,
          points: Number(formData.points),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign points");
      }

      toast.success("Contribution points assigned successfully");
      setFormData({
        type_x_tg: "",
        x_tg_username: "",
        points: "",
      });
    } catch (err) {
      console.error("Error assigning points", err);
      toast.error(err.message || "Failed to assign points. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl mx-6 md:mx-3 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
          Assign Contribution Points
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="platform"
              className="block text-sm font-medium text-gray-700"
            >
              Platform <span className="text-red-500">*</span>
            </label>
            <Select
              isClearable
              options={platformOptions}
              onChange={(option) =>
                setFormData({
                  ...formData,
                  type_x_tg: option?.value || "",
                })
              }
              value={platformOptions.find(
                (option) => option.value === formData.type_x_tg
              )}
              placeholder="Select Twitter(X) or Telegram"
              className="rounded-[6px] text-black"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="Username"
              className="block text-sm font-medium text-gray-700"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 px-3 border border-gray-300 bg-gray-200 flex items-center pointer-events-none rounded-tl rounded-bl">
                <AtSymbolIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="username"
                type="text"
                className="w-full pl-14 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Enter ${formData.type_x_tg || ''} username`}
                value={formData.x_tg_username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    x_tg_username: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700"
            >
              Points <span className="text-red-500">*</span>
            </label>
            <input
              id="points"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter points"
              value={formData.points}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  points: e.target.value,
                })
              }
              required
              min="0"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#2FCC71] text-base md:text-[17px] text-white py-3 md:py-[10px] px-4 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Assigning Points..." : "Assign Points"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
