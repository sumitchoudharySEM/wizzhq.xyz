"use client";

import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Submission {
  listing_id: string;
  submission_reward?: string;
  image?: string;
  profile_photo_url: string;
  name: string;
  username: string;
  title: string;
  submission_links: string[];
  token: string;
  slug: string;
}

interface LinkPreview {
  image?: string;
  title?: string;
  url?: string;
}

const SubmissionLinkPreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinkPreview = async () => {
      try {
        const response = await fetch("/api/unfurl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });
        const data = await response.json();
        setPreview(data);
      } catch (error) {
        console.error("Error fetching link preview:", error);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchLinkPreview();
    }
  }, [url]);

  if (loading) {
    return <div className="w-full h-full bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="w-full h-full border-b border-gray-200">
      {preview?.image ? (
        <img
          src={preview.image}
          alt={preview.title || "Link preview"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {preview?.title ||
                (preview?.url
                  ? new URL(preview.url).hostname
                  : "No preview available")}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const { user_id } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user_id) return;

      try {
        const response = await fetch(
          `/api/user_profile/user_submissions?user_id=${user_id}`
        );
        const data = await response.json();

        if (data.submissions) {
          const parsedSubmissions = data.submissions.map(
            (submission: any): Submission => ({
              ...submission,
              submission_links: JSON.parse(submission.submission_links),
              token: submission.token.replace(/['"]+/g, ""),
            })
          );

          setSubmissions(parsedSubmissions);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user_id]);

  const handlePreviewClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleViewBounty = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-4 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
        {submissions.map((submission) => {
          const links =
            typeof submission.submission_links === "string"
              ? JSON.parse(submission.submission_links)
              : submission.submission_links || [];

          return (
            <div
              key={submission.listing_id}
              className="bg-white rounded-md shadow-md overflow-hidden w-full md:max-w-[360px] mx-auto"
            >
              {/* Bounty Image & Earning */}
              <div className="h-40 relative">
                {submission.submission_reward && (
                  <div className="ml-[18px] mt-[18px] absolute bg-[#eefff5] shadow-lg rounded-md border border-[#32f784]">
                    <h1 className="px-4 py-2 font-semibold text-[17px] text-[#2FCC71]">
                      {submission.submission_reward} {submission.token}
                    </h1>
                  </div>
                )}

                <SubmissionLinkPreview url={links[0] || ""} />
              </div>

              {/* Content Section */}
              <div className="px-4 py-4 flex flex-col">
                {/* Partner Name & Logo */}
                <div className="flex my-2 items-center">
                  <img
                    src={submission.profile_photo_url}
                    alt={submission.name}
                    className="object-cover w-11 h-w-11 rounded-full border border-gray-200 mr-3 shadow-sm"
                  />
                  <div className="flex flex-col gap-0">
                    <h2 className="text-[18px] text-gray-800 font-semibold">
                      {submission.name}
                    </h2>
                    <h3 className="text-sm text-gray-500 font-normal">
                      @{submission.username}
                    </h3>
                  </div>
                </div>

                {/* Bounty Title and Link */}
                <div className="w-full flex flex-col justify-between mt-1">
                  <div className="flex items-center">
                    <h1 className="text-[17px] font-semibold text-[#252B42]">
                      {submission.title}
                    </h1>
                  </div>

                  {/* Buttons for Preview and View Bounty */}
                  <div className="flex flex-col items-center justify-center gap-3 mt-4">
                    {links.map((link: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handlePreviewClick(link)}
                        className="w-full rounded-md flex items-center justify-center px-3 py-2 text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-md text-sm font-semibold"
                      >
                        <EyeIcon
                          strokeWidth={2}
                          className="h-4 w-4 mr-2"
                        />
                        {links.length > 1 ? (
                          <>Preview Submission {index + 1}</>
                        ) : (
                          <>Preview Submission</>
                        )}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        handleViewBounty(`/bounties/${submission.slug}`)
                      }
                      className="w-full rounded-md flex items-center justify-center px-3 py-[7px] text-[#2fcc71] bg-transparent border-2 border-green-500 transition duration-200 shadow hover:shadow-md text-sm font-semibold"
                    >
                      View Bounty
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;