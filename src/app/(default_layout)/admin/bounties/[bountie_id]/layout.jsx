"use client";

import React, { useState } from "react";
import LeftBountyContainer from "@/components/single_bounty/left_bounty_container";
import { usePathname, useRouter } from "next/navigation";
import { toast, Slide } from "react-toastify";
import { motion } from "framer-motion";
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


export default function AdminBountyLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(false);
  const [verified, setVerified] = useState(0);
  const [verifying, setVerifying] = useState(false);

  // Extract slug from pathname
  const getSlugFromPathname = () => {
    const pathParts = pathname.split("/");
    return pathParts[3];
  };

  const slug = getSlugFromPathname();

  const TABS = [
    { name: "Details", path: "" },
    { name: "Submissions", path: "submissions" },
    { name: "Comments", path: "comments" },
    { name: "Winners", path: "winners" },
  ];

  const handleTabClick = (tab) => {
    const pathParts = pathname.split("/");
    const bountyId = pathParts[3];
    const basePath = "/admin/bounties";

    if (tab === "Comments") {
      toast.info("Feature Under Development! Stay tuned for updates.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    } else {
      router.push(
        `${basePath}/${bountyId}/${tab === "Details" ? "" : tab.toLowerCase()}`
      );
    }
  };

  let activeTab = "Details";
  if (pathname.endsWith("/submissions")) {
    activeTab = "Submissions";
  } else if (pathname.endsWith("/comments")) {
    activeTab = "Comments";
  } else if (pathname.endsWith("/winners")) {
    activeTab = "Winners";
  }

  const iconVariants = {
    initial: { scale: 1, opacity: 1 },
    hover: {
      scale: 1.05,
      opacity: 0.95,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.97, opacity: 0.9 },
  };

  const handleVerifyBounty = async () => {
    try {
      setVerifying(true);
      
      const response = await fetch(`/api/admin/verify?slug=${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify bounty');
      }
  
      const data = await response.json();
      
      // Update local state
      setVerified(data.newStatus);
      
      // Show success message
      toast.success(data.message, { position: "top-center" });
    } catch (error) {
      toast.error(error.message || 'Failed to verify bounty', { position: "top-center" });
    } finally {
      setVerifying(false);
    }
  };

  if (loading && !display) {
    return (
      <>
        <LeftBountyContainer
          setLoading={setLoading}
          loading={loading}
          display={display}
          verified={verified}
          setVerified={setVerified}
          setDisplay={setDisplay}
          isAdmin={true}
        />
        <div className="w-full min-h-[90vh] flex items-center justify-center z-50 bg-[#F8FAFC] backdrop-blur-md">
          <iframe
            src="https://lottie.host/embed/0e906fb1-4db8-4ee5-83a1-571bf2354be3/swOYAUc0eE.json"
            title="Loading Animation"
            className="w-24 h-24"
          />
        </div>
      </>
    );
  }

  if (!loading && !display) {
    return <>No such bounty found</>;
  }

  if (!loading && display) {
    return (
      <>
        {/* Verification Status Section - Always visible for admin */}
        <div className={`${
          verified === 0 ? "bg-yellow-50 border-yellow-200" : "bg-[#f0f1f2] border-gray-200"
        } border-y py-4 px-5 md:px-14 flex flex-col md:flex-row justify-between md:items-center`}>
          <div className="text-gray-700 mb-4 md:mb-0">
            {verified === 0
              ? "This bounty is not verified yet."
              : "This bounty has been verified."}
          </div>
          <div className="flex items-center gap-3">
              <button
              onClick={handleVerifyBounty}
              disabled={verifying}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 
                ${verifying 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : verified === 0 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'} 
                text-white`}
            >
              <CheckCircleIcon className="w-6 h-6" />
              {verifying ? 'Processing...' : verified === 0 ? 'Verify Now' : 'Unverify'}
            </button>
            
            <Link
              href={{
                pathname: "/admin/create_listing/bounty",
                query: { edit: true, slug: slug },
              }}
            >
              <button className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600">
                <PencilIcon className="w-[18px] h-[18px]" />
                Edit Bounty
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row px-4 lg:px-12 gap-6 pt-[64px] pb-8">
          <div className="w-full lg:w-[30%]">
            <LeftBountyContainer
              setLoading={setLoading}
              loading={loading}
              display={display}
              verified={verified}
              setVerified={setVerified}
              setDisplay={setDisplay}
              isAdmin={true}
            />
          </div>
          <div className="w-full lg:w-[70%]">
            <div className="flex space-x-2 lg:space-x-10 border-b">
              {TABS.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`py-2 px-2 md:px-4 transition-colors duration-200 text-[14px] md:text-base ${
                    activeTab === tab.name
                      ? "border-b-2 border-green-500 text-green-500 font-semibold"
                      : "text-gray-500 hover:text-green-500"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </>
    );
  }
}