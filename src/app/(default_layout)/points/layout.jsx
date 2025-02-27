"use client";

import React, {useState, useEffect} from "react";
import PointsHeader from "@/components/points/points_header.jsx";
import PointsOverview from "@/components/points/points_overview.jsx";
import Referral from "@/components/points/referral.jsx";
import TgVerification from "@/components/verification/tg_verification";
import XVerification from "@/components/verification/x_verification";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const TABS = [
  { name: "My Breakdown", path: "" },
  { name: "Leaderboard", path: "leaderboard" },
];

export default function RootLayout({ children }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },});
  const pathname = usePathname();
  const router = useRouter();
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimablePoints, setHasClaimablePoints] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect if user is not authenticated
    }
  }, [status, router]);

  const handleTabClick = (tabPath) => {
    router.push(`/points/${tabPath}`);
  };

  // Determine the active tab based on pathname
  const activeTab = pathname.endsWith("/leaderboard")
    ? "Leaderboard"
    : "My Breakdown";

  // Check for claimable points
  useEffect(() => {
    const checkClaimablePoints = async () => {
      try {
        const response = await fetch('/api/points/claim_all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setHasClaimablePoints(data.hasClaimablePoints);
      } catch (error) {
        console.error('Error checking claimable points:', error);
        setHasClaimablePoints(false);
      }
    };

    if (session?.user?.id) {
      checkClaimablePoints();
    }
  }, [session?.user?.id]);

  // Handle Claim All Points
  const handleClaimAll = async () => {
    if (isClaiming || !hasClaimablePoints) return;

    setIsClaiming(true);
    try {
      const response = await fetch('/api/points/claim_all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to claim points' }));
          throw new Error(errorData.error || 'Failed to claim points');
        }
  
        const data = await response.json();

        // console.log('data:', data);
  
        toast.success(`Successfully claimed ${data.pointsClaimed.total} points!`);
      } catch (error) {
          console.error('Error claiming all points:', error);
          // alert(`Failed to claim points: ${error.message}`);
      } finally {
        setIsClaiming(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  // Don't render anything if not authenticated
  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="px-7 py-5 lg:px-12">
      <PointsHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 md:my-11">
        <div className="md:col-span-1 bg-white px-6 py-8 md:p-8 rounded-lg shadow-md shadow-[#ececec]">
          <TgVerification />
        </div>
        <div className="md:col-span-1 bg-white px-6 py-8 md:p-8 rounded-lg shadow-md shadow-[#ececec]">
          <XVerification />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 md:my-11">
        <div className="md:col-span-2 bg-white px-6 py-8 md:p-8 rounded-lg shadow-md shadow-[#ececec]">
          <PointsOverview />
        </div>
        <div className="md:col-span-1 bg-white px-6 py-8 md:p-8 rounded-lg shadow-md shadow-[#ececec]">
          <Referral />
        </div>
      </div>

      <hr />

      <div className="w-full mt-8 md:mt-10 bg-white rounded-lg shadow-md shadow-[#ececec] p-5 md:p-7">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 lg:space-x-10">
            {TABS.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.path)}
                className={`py-2 px-5 md:px-7 transition-colors duration-200 text-sm md:text-base ${
                  activeTab === tab.name
                    ? "border border-[#2FCC71] bg-[#F8FCF8] rounded-md text-[#2FCC71] font-semibold"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          {/* Conditionally Render Claim All Button */}
          {activeTab === "My Breakdown" && (
            <button 
            onClick={handleClaimAll}
            disabled={isClaiming || !hasClaimablePoints}
            className={`hidden md:block ${
              !hasClaimablePoints ? 'opacity-50 cursor-not-allowed' : ''
              } py-2 px-5 bg-[#2FCC71] text-white font-semibold rounded-md hover:bg-[#28b865] transition duration-200`}
            >
              {isClaiming ? 'Claiming...' : 'Claim All'}
            </button>
          )}
        </div>

        {/* Render Content Based on Active Tab */}
        <div className="mt-9">{children}</div>

        {activeTab === "My Breakdown" && (
          <button 
          onClick={handleClaimAll}
          disabled={isClaiming || !hasClaimablePoints}
          className={`md:hidden ${
              !hasClaimablePoints ? 'opacity-50 cursor-not-allowed' : ''
              } py-2 px-5 bg-[#2FCC71] text-white font-semibold rounded-md hover:bg-[#28b865] transition duration-200`}
            >
            {isClaiming ? 'Claiming...' : 'Claim All'}
          </button>
        )}
      </div>
    </div>
  );
}
