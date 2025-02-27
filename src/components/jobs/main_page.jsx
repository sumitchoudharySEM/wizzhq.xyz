"use client";

import React, { useState, useEffect } from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
// import 'react-quill/dist/quill.snow.css';
import "react-quill/dist/quill.bubble.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
import "../../app/sec.css"

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // const removeSquareBracket = (content) => {
  //   if (title === "Deliverables" || title === "Eligibility Requirements") {
  //     try {
  //       // Attempt to parse the content
  //       let parsedContent;

  //       // Check if it's already an array
  //       if (Array.isArray(content)) {
  //         parsedContent = content;
  //       } else if (typeof content === "string") {
  //         // Try parsing the string into JSON
  //         parsedContent = JSON.parse(content);

  //         // If the parsed result is still not an array, parse it again (handles nested stringified data)
  //         if (typeof parsedContent === "string") {
  //           parsedContent = JSON.parse(parsedContent);
  //         }
  //       }

  //       // Check again if it's an array and map over it
  //       if (Array.isArray(parsedContent)) {
  //         return parsedContent.map((item, index) => (
  //           <li key={index} className="list-disc ml-5">
  //             {item}
  //           </li>
  //         ));
  //       } else {
  //         console.error("Parsed content is not an array:", parsedContent);
  //         return <li className="list-disc ml-5">{content}</li>;
  //       }
  //     } catch (error) {
  //       console.error("Error parsing content:", content, error);
  //       return <li className="list-disc ml-5">{content}</li>;
  //     }
  //   }
  //   return content; // Return as-is for other titles
  // };

  return (
    <div className="border border-[#2FCC71] rounded-lg mt-2 mb-5 px-4 py-1">
      <div
        onClick={toggleAccordion}
        className="flex justify-between items-center py-3 cursor-pointer"
      >
        <h2 className="text-base font-medium text-[#424242]">{title}</h2>
        <ArrowDownCircleIcon
          className={`h-6 w-6  text-[#2FCC71] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-fit" : "max-h-0"
        }`}
      >
        {title == "Short Description" ? (
          <div className="text-black pb-7 font-normal">{content}</div>
        ) : (
          <div >
          <ReactQuill value={content} readOnly={true} theme="bubble" className="pb-7 max-h-fit"/>
          </div>
        )}
      </div>
    </div>
  );
};

const Accordion = () => {
  const [job, setJob] = useState();
  const { job_id } = useParams();
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/jobs/create_job?slug=${job_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setJob(data.job);
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const items = [
    {
      title: "Short Description",
      content: job?.short_description,
    },
    {
      title: "Eligibility Requirements",
      content: job?.requirements,
    },
    {
      title: "Perks",
      content: job?.job_perks,
    },
    {
      title: "Roles & Responsibility",
      content: job?.roles_responsibility,
    },
    {
      title: "Detailed Description",
      content: job?.detailed_description,
    },
  ];

  return (
    <>
      {job ? (
        <div className="max-w-full mx-auto mt-8 px-2 md:px-4">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              title={item.title}
              content={item.content}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

// Main component for the page
const Page = () => {
  return (
    <div>
      <Accordion />
    </div>
  );
};

export default Page;
