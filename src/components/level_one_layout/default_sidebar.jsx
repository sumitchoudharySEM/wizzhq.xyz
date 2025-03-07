/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Bars3Icon,
  HomeIcon,
  BriefcaseIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { toast, Slide } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

const DefaultSidebar = () => {
  const [activeItem, setActiveItem] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleActiveItem = (item) => {
    setActiveItem(item);
  };

  return (
    <div
      className={`h-screen bg-white shadow-lg flex flex-col ${
        isCollapsed ? "w-20" : "w-[230px]"
      } transition-all duration-300 sticky top-0`}
    >
      <div
        className={`p-4 gap-4 flex items-center ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <button onClick={toggleSidebar}>
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
        <h1
          className={`text-2xl font-bold text-gray-800 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          {" "}
          <Link href="/" passHref>
            <Image
              height={55}
              width={110}
              src="/images/logo.png"
              alt="wizz"
              className="transition-all duration-300 ease-in-out"
            />
          </Link>
        </h1>
      </div>

      <nav className="flex-grow mt-8">
        <ul>
          {/* Overview */}
          <Link href="/">
            <li
              onClick={() => handleActiveItem("overview")}
              className={`relative flex items-center p-4 cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "overview"
                  ? " text-green-500"
                  : "hover:bg-gray-100"
              }`}
            >
              {activeItem === "overview" && (
                <div className="absolute left-0 h-10 w-[5.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
              )}
              <HomeIcon
                className={`h-6 w-6 transition-colors duration-300 ease-in-out ${
                  activeItem === "overview" ? "text-green-500" : "text-gray-500"
                } ${isCollapsed ? "mx-auto" : "mr-4"}`}
              />
              {!isCollapsed && (
                <span
                  className={`text-lg text-gray-500 transition-all duration-300 ease-in-out ${
                    activeItem === "overview"
                      ? "text-green-500 font-semibold"
                      : ""
                  }`}
                >
                  Overview
                </span>
              )}
            </li>
          </Link>

          {/* Bounties */}
          <Link href="/bounty">
            <li
              onClick={() => handleActiveItem("bounties")}
              className={`relative flex items-center p-4 cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "bounties"
                  ? " text-green-500"
                  : "hover:bg-gray-100"
              }`}
            >
              {activeItem === "bounties" && (
                <div className="absolute left-0 h-10 w-[5.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
              )}
              <BriefcaseIcon
                className={`h-6 w-6 transition-colors duration-300 ease-in-out ${
                  activeItem === "bounties" ? "text-green-500" : "text-gray-500"
                } ${isCollapsed ? "mx-auto" : "mr-4"}`}
              />
              {!isCollapsed && (
                <span
                  className={`text-lg text-gray-500 transition-all duration-300 ease-in-out ${
                    activeItem === "bounties"
                      ? "text-green-500 font-semibold"
                      : ""
                  }`}
                >
                  Bounties
                </span>
              )}
            </li>
          </Link>

          {/* Hirings */}
          <Link href="/hirings">
            <li
              onClick={() => {
                handleActiveItem("hirings");
                // toast.info(
                //   "Feature Under Development! Stay tuned for updates.",
                //   {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "light",
                //     transition: Slide,
                //   }
                // );
              }}
              className={`relative flex items-center p-4 cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "hirings"
                  ? " text-green-500"
                  : "hover:bg-gray-100"
              }`}
            >
              {activeItem === "hirings" && (
                <div className="absolute left-0 h-10 w-[5.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
              )}
              <UserGroupIcon
                className={`h-6 w-6 transition-colors duration-300 ease-in-out ${
                  activeItem === "hirings" ? "text-green-500" : "text-gray-500"
                } ${isCollapsed ? "mx-auto" : "mr-4"}`}
              />
              {!isCollapsed && (
                <span
                  className={`text-lg text-gray-500 transition-all duration-300 ease-in-out ${
                    activeItem === "hirings"
                      ? "text-green-500 font-semibold"
                      : ""
                  }`}
                >
                  Hirings
                </span>
              )}
            </li>
          </Link>

          {/* Projects */}
          <li
            onClick={() => {
              // handleActiveItem("projects");
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
            }}
            className={`relative flex items-center p-4 cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "projects"
                ? " text-green-500"
                : "hover:bg-gray-100"
            }`}
          >
            {activeItem === "projects" && (
              <div className="absolute left-0 h-10 w-[5.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
            )}
            <CalendarIcon
              className={`h-6 w-6 transition-colors duration-300 ease-in-out ${
                activeItem === "projects" ? "text-green-500" : "text-gray-500"
              } ${isCollapsed ? "mx-auto" : "mr-4"}`}
            />
            {!isCollapsed && (
              <span
                className={`text-lg text-gray-500 transition-all duration-300 ease-in-out ${
                  activeItem === "projects"
                    ? "text-green-500 font-semibold"
                    : ""
                }`}
              >
                Freelance
              </span>
            )}
          </li>

          {/* Grants */}
          <li
            onClick={() => {
              // handleActiveItem("grants");
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
            }}
            className={`relative flex items-center p-4 cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "grants" ? " text-green-500" : "hover:bg-gray-100"
            }`}
          >
            {activeItem === "grants" && (
              <div className="absolute left-0 h-10 w-[5.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
            )}
            <AcademicCapIcon
              className={`h-6 w-6 transition-colors duration-300 ease-in-out ${
                activeItem === "grants" ? "text-green-500" : "text-gray-500"
              } ${isCollapsed ? "mx-auto" : "mr-4"}`}
            />
            {!isCollapsed && (
              <span
                className={`text-lg text-gray-500 transition-all duration-300 ease-in-out ${
                  activeItem === "grants" ? "text-green-500 font-semibold" : ""
                }`}
              >
                Hackathons
              </span>
            )}
          </li>
        </ul>
      </nav>

      {/* switch to partner button */}
      {/* <nav className="mb-8 mx-3">
        <button
          type="submit"
          className={`text-gray-800 flex justify-center gap-2 items-center mx-auto text-basebackdrop-blur-sm lg:font-semibold isolation-auto ${
            isCollapsed ? "" : "border-[#75EDA6] shadow-lg  bg-gray-50 border-2  rounded-full group"
          } before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#2FCC71] hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden ${
            isCollapsed ? "" : "border-2"
          } rounded-full group`}
        >
          {!isCollapsed && <span>Switch to partner</span>}
          <svg
            className={`w-7 h-7 ${
              isCollapsed ? "mx-auto" : ""
            } group-hover:rotate-90 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45`}
            viewBox="0 0 16 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
              className="fill-gray-800 group-hover:fill-gray-800"
            ></path>
          </svg>
        </button>
      </nav> */}
    </div>
  );
};

export default DefaultSidebar;
