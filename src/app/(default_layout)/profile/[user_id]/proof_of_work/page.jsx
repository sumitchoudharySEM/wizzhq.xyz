"use client";
import React, { useState, useEffect } from "react";
import {
  CheckBadgeIcon,
  EyeIcon,
  PlusCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import AddProofWork from "@/components/level_two_layout/add_proof_work.jsx";
import EditProofWork from "@/components/level_two_layout/edit_proof_work.jsx";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext.jsx";
import { motion } from "framer-motion";

const Page = () => {
  const { user_id } = useParams();
  const [pow, setPow] = useState([]); // State to hold proof of work data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to handle error messages
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [powId, setPowId] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    async function fetchPowData() {
      if (user_id) {
        try {
          const res = await fetch(`/api/pow?user=${user_id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch proof of work data");
          }
          const data = await res.json();
          setPow(data.pow || []); // Set data or empty array if no data
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPowData();
  }, [user_id]);

  if (!user) {
    return <div>No user data available</div>;
  }

  // Function to handle preview button click
  const handlePreviewClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

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
    <div className="max-w-screen-lg mx-auto mt-8 px-4 md:px-4 flex gap-4 flex-col">
      {user?.username == user_id ? (
        <div className="flex flex-col w-full">
          <motion.button
            onClick={openModal}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center px-4 py-2 gap-2 border-2 border-dashed border-gray-300 h-[4.3rem] rounded-[8px] hover:bg-[#f9f9f9] transition duration-200"
          >
            <PlusCircleIcon className="h-6 w-6 text-[#2FCC71]" />
            <span className="text-[#2FCC71] font-semibold text-[17px]">
              Add Proof Of Work
            </span>
          </motion.button>
        </div>
      ) : (
        <></>
      )}
      {pow && pow.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 mt-3">
          {pow.map((entry) => (
            <motion.div
              key={entry.id}
              whileHover={{ scale: 1.01, boxShadow: "0 2px 10px #e5e5e5" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-md px-6 py-5 shadow-sm md:shadow-md shadow-slate-200 overflow-hidden w-full md:max-w-[370px] mx-auto flex flex-col justify-between"
            >
              {/* Title and Description */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h1 className="text-[20px] text-[#252B42] font-medium">
                    {entry.project_title}
                  </h1>
                  {user?.username == user_id ? (
                    <button 
                      onClick={() => { setPowId(entry.id); openEditModal(); }}
                      className="flex items-center gap-2 text-[#717171] font-normal text-base transition duration-200 px-3 py-[6px] bg-[#f3f3f3] rounded-md">
                      <PencilIcon className="w-[18px] h-[18px]"/>Edit
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="text-[15px] font-normal text-[#737373]">
                  {entry.project_description}
                </p>
              </div>

              {/* Skills Section */}
              {entry.skills_used && entry.skills_used.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-gray-500 mb-3">
                    Skills Used
                  </h2>
                  <div className="flex flex-wrap gap-[13px]">
                    {entry.skills_used.split(",").map((skill, index) => (
                      <div key={index} className="flex items-center gap-[8px]">
                        <CheckBadgeIcon
                          className="text-[#2FCC71] w-[18px] h-[18px]"
                          style={{ strokeWidth: 2 }}
                        />
                        <span className="text-[15px] font-normal text-gray-600">
                          {skill.trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Button */}
              <div className="flex items-center justify-center mt-4">
                <motion.button
                  onClick={() => handlePreviewClick(entry.link)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full rounded-md flex items-center justify-center px-3 py-[7px] text-white bg-green-500 hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-sm font-semibold"
                >
                  <EyeIcon strokeWidth={2} className="h-4 w-4 mr-2" />
                  Preview
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <>NO pow</>
      )}
      {/* Render the modal conditionally */}
      {isModalOpen && (
        <AddProofWork isOpen={isModalOpen} onRequestClose={closeModal} />
      )}
      {isEditModalOpen && (
        <EditProofWork powId={powId} isOpen={isEditModalOpen} onRequestClose={closeEditModal} />
      )}
    </div>
  );
};

export default Page;
