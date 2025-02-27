"use client";

import React, { useEffect, useState } from "react";
import PartnerProfile from "@/components/profiles/partner_profile.jsx";
import { usePathname, useRouter } from "next/navigation";
import { partner as PartnerType } from "@/lib/types";

type Tab = {
  name: string;
  path: string;
};

const TABS: Tab[] = [
  { name: "Description", path: "" },
  { name: "My listings", path: "my_listings" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleTabClick = (tabPath: string) => {
    const partnerUsername = pathname.split("/")[3]; // Extract user ID from pathname
    router.push(`/dashboard/profile/${partnerUsername}/${tabPath}`);
  };

  // Determine the active tab based on pathname
  const activeTab =
    TABS.find((tab) => pathname.endsWith(`/${tab.path}`))?.name ||
    "Description";

  return (
    <div className="flex flex-col lg:flex-row px-4 lg:px-8 gap-6 pt-[64px] pb-8">
      {/* Left Container for User Profile */}
      <div className="w-full lg:w-[32%]">
        <PartnerProfile  />
      </div>

      {/* Right Container for Tab Navigation and Content */}
      <div className="w-full lg:w-[68%]">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 lg:space-x-10 border-b">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.path)}
              className={`py-2 px-4 transition-colors duration-200 ${
                activeTab === tab.name
                  ? "border-b-2 border-green-500 text-green-500 font-semibold"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Render Content Based on Active Tab */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
