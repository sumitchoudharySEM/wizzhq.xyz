// components/BountyLayout.tsx
"use client";

import React, { useState } from "react";
import LeftJobContainer from "@/components/single_job/left_job_container";
import { usePathname, useRouter } from "next/navigation";
import { toast, Slide } from "react-toastify";
import { motion } from "framer-motion";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface JobLayoutProps {
  children: React.ReactNode;
  isDashboard?: boolean;
}

export default function JobLayout({
  children,
  isDashboard = false,
}: JobLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(false);
  const [verified, setVerified] = useState(0);

  // Extract slug from pathname
  const getSlugFromPathname = () => {
    const pathParts = pathname.split("/");
    return pathParts[3];
  };

  const slug = getSlugFromPathname();

  const TABS = [
    { name: "Details", path: "" },
    // { name: "Submissions", path: "submissions" },
    // { name: "Comments", path: "comments" },
    // { name: "Winners", path: "winners" },
  ];

  const handleTabClick = (tab: string) => {
    const pathParts = pathname.split("/");
    const bountyId = isDashboard ? pathParts[3] : pathParts[2];
    const basePath = isDashboard ? "/dashboard/jobs" : "/jobs";

    router.push(
      `${basePath}/${bountyId}/${tab === "Details" ? "" : tab.toLowerCase()}`
    );
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

  if (loading && !display) {
    return (
      <>
        <LeftJobContainer
          setLoading={setLoading}
          loading={loading}
          display={display}
          verified={verified}
          setVerified={setVerified}
          setDisplay={setDisplay}
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
        {pathname.split("/").includes("dashboard") && (
          <>
            {verified == 0 && (
              <div className="redstip bg-red-500 text-white py-4 px-5 md:px-14 md:py-6 flex flex-col md:flex-row justify-between">
                <div className="textt max-w-full md:max-w-2/3">
                  Hey, your job has not been verified yet. <br />
                  It may take up to 2 days, or you can contact us for
                  assistance.
                </div>
                <div className="socials max-w-full pt-4 md:pt-0 md:max-w-1/3">
                  <div className="flex items-center gap-5 lg:gap-[27px]">
                    {/* twitter */}
                    <motion.a
                      href="https://x.com/WizzHQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:w-[36px] md:h-[36px] w-[32px] h-[32px] rounded-full bg-white border flex items-center justify-center"
                      variants={iconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_31_4401)">
                          <path
                            d="M9.77114 6.77143L15.5964 0H14.216L9.15792 5.87954L5.11803 0H0.458496L6.5676 8.8909L0.458496 15.9918H1.83898L7.18047 9.78279L11.4469 15.9918H16.1064L9.7708 6.77143H9.77114ZM7.88037 8.96923L7.26139 8.0839L2.33639 1.0392H4.45674L8.43127 6.7245L9.05025 7.60983L14.2167 14.9998H12.0963L7.88037 8.96957V8.96923Z"
                            fill="#303850"
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
                    </motion.a>

                    {/* telegram */}
                    <motion.a
                      href="https://t.me/sumitsem"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:w-[36px] md:h-[36px] w-[32px] h-[32px] rounded-full bg-white border flex items-center justify-center"
                      variants={iconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <svg
                        width="41"
                        height="41"
                        viewBox="0 0 41 41"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.1081 16.0288C19.4465 16.7199 16.1256 18.1504 11.1455 20.3201C10.3368 20.6417 9.91318 20.9563 9.87461 21.2639C9.80944 21.7838 10.4605 21.9886 11.3471 22.2673L11.3472 22.2674C11.4678 22.3053 11.5927 22.3446 11.7207 22.3862C12.593 22.6697 13.7663 23.0014 14.3762 23.0146C14.9295 23.0266 15.5471 22.7985 16.2289 22.3303C20.882 19.1893 23.2839 17.6017 23.4347 17.5675C23.5411 17.5433 23.6885 17.513 23.7884 17.6018C23.8883 17.6905 23.8785 17.8587 23.8679 17.9038C23.8034 18.1787 21.2478 20.5547 19.9252 21.7843L19.9251 21.7843C19.5129 22.1676 19.2205 22.4395 19.1607 22.5015C19.0268 22.6406 18.8903 22.7722 18.7591 22.8987L18.7591 22.8987C17.9488 23.6799 17.3411 24.2657 18.7927 25.2223C19.4903 25.682 20.0486 26.0621 20.6055 26.4414C21.2137 26.8556 21.8203 27.2687 22.6052 27.7832C22.8051 27.9142 22.9961 28.0504 23.1821 28.183L23.1821 28.183C23.8899 28.6876 24.5258 29.141 25.3114 29.0687C25.7679 29.0267 26.2394 28.5974 26.4789 27.3172C27.0448 24.2917 28.1573 17.7364 28.4144 15.0352C28.4369 14.7985 28.4086 14.4956 28.3858 14.3627C28.3631 14.2297 28.3155 14.0403 28.1427 13.9C27.938 13.7339 27.622 13.6989 27.4807 13.7013C26.8382 13.7127 25.8523 14.0555 21.1081 16.0288Z"
                          stroke="#303850"
                          stroke-width="1.70833"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </motion.a>
                    {/* mail */}
                    <motion.a
                      href="mailto:socials.wizz@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:w-[36px] md:h-[36px] w-[32px] h-[32px] rounded-full bg-white border flex items-center justify-center"
                      variants={iconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <svg
                        width="21"
                        height="19"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_483_6868)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2.19901 2.5C0.990883 2.5 0.0115051 3.47938 0.0115051 4.6875V5.60721C0.0113014 5.61849 0.0113019 5.62976 0.0115051 5.64102V15.3125C0.0115051 16.5206 0.990881 17.5 2.19901 17.5H17.824C19.0321 17.5 20.0115 16.5206 20.0115 15.3125V5.64081C20.0118 5.6297 20.0118 5.61856 20.0115 5.60742V4.6875C20.0115 3.47938 19.0321 2.5 17.824 2.5H2.19901ZM18.1365 5.08786V4.6875C18.1365 4.51491 17.9966 4.375 17.824 4.375H2.19901C2.02642 4.375 1.88651 4.51491 1.88651 4.6875V5.08786L10.0115 9.85079L18.1365 5.08786ZM1.88651 7.26128V15.3125C1.88651 15.4851 2.02642 15.625 2.19901 15.625H17.824C17.9966 15.625 18.1365 15.4851 18.1365 15.3125V7.26128L10.4856 11.7463C10.1928 11.9179 9.83017 11.9179 9.53739 11.7463L1.88651 7.26128Z"
                            fill="#303850"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_483_6868">
                            <rect
                              width="20"
                              height="20"
                              fill="white"
                              transform="translate(0.0115356)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Section - Shown for both verified and unverified jobs in dashboard */}
            <div
              className={`${
                verified === 0
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-[#f0f1f2] border-gray-200"
              } border-y py-4 px-5 md:px-14 flex flex-col md:flex-row justify-between md:items-center`}
            >
              <div className="text-gray-700 mb-4 md:mb-0">
                {verified === 0
                  ? "You can edit the bounty until it is being verified. If any issue occurs, contact us for more assistance."
                  : "This bounty has been verified. Contact us if you need to make any changes."}
              </div>
              <Link
                href={{
                  pathname: "/dashboard/create_job/job",
                  query: { edit: true, slug: slug }, 
                }}
              >
                <button
                  className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    verified === 0
                      ? "bg-yellow-100 text-yellow-800 hover:shadow-md hover:shadow-slate-100 border-2 border-yellow-300"
                      : "bg-[#f0f1f2] text-gray-500 cursor-not-allowed border-2 border-gray-300"
                  }`}
                  disabled={verified === 1}
                >
                  <PencilIcon className="w-[18px] h-[18px]" />
                  {verified === 0 ? "Edit Job" : "Editing Disabled"}
                </button>
              </Link>
            </div>
          </>
        )}

        <div className="flex flex-col lg:flex-row px-4 lg:px-12 gap-6 pt-[64px] pb-8">
          <div className="w-full lg:w-[32%]">
            <LeftJobContainer
              setLoading={setLoading}
              loading={loading}
              display={display}
              verified={verified}
              setVerified={setVerified}
              setDisplay={setDisplay}
            />
          </div>
          <div className="w-full lg:w-[68%]">
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
