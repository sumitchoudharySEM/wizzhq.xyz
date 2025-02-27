"use client";

import React, { useState, useEffect } from "react";
import UserProfile from "@/components/profiles/user_profile.jsx";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { User } from "@/lib/types";

type Tab = {
  name: string;
  path: string;
};

const TABS: Tab[] = [
  { name: "Submissions", path: "" },
  { name: "Proof Of Work", path: "proof_of_work" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user_id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loding, setLoding] = useState(true);

  const getUser = async () => {
    if (user_id) {
      try {
        const response = await fetch(
          `/api/users?key=username&value=${user_id}`
        );
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data in profile:", error);
      } finally {
        setLoding(false);
      }
    }
  };

  useEffect(() => {
    getUser();

    // // Redirect to "Proof Of Work" by default
    // const isProofOfWorkPath = pathname.endsWith("/proof_of_work");
    // if (!isProofOfWorkPath) {
    //   const userId = pathname.split("/")[2]; // Extract user ID from pathname
    //   router.replace(`/profile/${userId}/proof_of_work`);
    // }
  }, [user_id, pathname, router]);

  const handleTabClick = (tabPath: string) => {
    const userId = pathname.split("/")[2]; // Extract user ID from pathname
    router.push(`/profile/${userId}/${tabPath}`);
  };

  // Determine the active tab based on pathname
  const activeTab =
    pathname.endsWith("/proof_of_work") ? "Proof Of Work" : "Submissions";

  return (
    <div className="flex flex-col lg:flex-row px-4 lg:px-8 gap-6 pt-[64px] pb-8">
      {loding ? (
        <div className="w-full min-h-[90vh] flex items-center justify-center z-50 bg-[#F8FAFC] backdrop-blur-md">
          <iframe
            src="https://lottie.host/embed/0e906fb1-4db8-4ee5-83a1-571bf2354be3/swOYAUc0eE.json"
            title="Loading Animation"
            className="w-24 h-24"
          ></iframe>
        </div>
      ) : (
        <>
          {/* Left Container for User Profile */}
          <div className="w-full lg:w-[30%]">
            <UserProfile user={user} />
          </div>

          {/* Right Container for Tab Navigation and Content */}
          <div className="w-full lg:w-[70%]">
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
        </>
      )}
    </div>
  );
}
