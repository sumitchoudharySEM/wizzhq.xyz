/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRightCircleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BriefcaseIcon,
  CalendarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
  ChevronDownIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext.jsx";
import { signOut } from "next-auth/react";
// import UnderDevelopment from "@/components/level_three_layout/under_development";
import { toast, Slide } from "react-toastify";
import NavbarShimmer from "@/components/level_three_layout/NavbarShimmer";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

// const DefaultNavbar = ({user}: DefaultNavbarProps) => {
const DefaultNavbar = React.memo(() => {
  const { user } = useUser();
  const { status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loding, setLoding] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("overview");
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (user && user?.email) {
      setIsLoggedIn(true);
      setLoding(false);
    } else {
      if (status == "unauthenticated") {
        setLoding(false);
        setIsLoggedIn(false);
      } else if (status == "loading") {
        setLoding(true);
      }
    }
  }, [user, status]);

  // Show shimmer while loading
  if (loding) {
    return <NavbarShimmer />;
  }

  // Profile Links with user ID routes
  const profileRoute = `/profile/${user?.username}`;
  const editProfileRoute = `/edit`;

  const handleActiveItem = (item) => {
    setActiveItem(item);
  };

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="sticky top-0 z-50 drop-shadow-sm">
      <div className="flex justify-between items-center bg-white shadow md:px-12 py-[10px] px-4">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            )}
          </button>
          <div className="md:hidden ml-3">
            <Image
              height={80}
              width={120}
              src="/images/logo.png"
              alt="wizz"
              className="transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Search Bar (common to both logged-in and not-logged-in states) */}

        {user ? (
          <div className="flex items-center w-full justify-end lg:justify-between gap-5">
            {/* Left-aligned search bar */}
            <div className="flex-grow hidden lg:flex items-center w-[22rem] max-w-[25rem]">
              {/* <div className="flex w-full rounded-md border-2 border-gray-200 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search Something..."
                  className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-[9px]"
                />
                <button
                  type="button"
                  className="flex items-center justify-center bg-[#2FCC71] px-5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 192.904 192.904"
                    width="16px"
                    className="fill-white"
                  >
                    <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                  </svg>
                </button>
              </div> */}
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              {user?.is_partner == 0 ? (
                <Link href="/become_partner">
                  <button className="flex items-center px-4 py-[10px] md:px-5 md:py-[11px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-[12px] md:text-[15px] font-semibold">
                    Become a partner
                    <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-4" />
                  </button>
                </Link>
              ) : (
                // <></>
                <Link href="/dashboard">
                  <button
                    type="submit"
                    className={`text-gray-800 flex justify-center gap-2 items-center mx-auto text-basebackdrop-blur-sm lg:font-semibold isolation-auto ${
                      isMobile
                        ? ""
                        : "border-[#75EDA6]   bg-gray-50 border-2  rounded-full group"
                    } before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#2FCC71] hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden ${
                      isMobile ? "" : "border-2"
                    } rounded-full group`}
                  >
                    {!isMobile && <span>Switch to partner</span>}
                    <svg
                      className={`w-7 h-7 ${
                        isMobile ? "mx-auto" : ""
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
                </Link>
              )}

              {/* switch to partner button */}

              <div
                className="flex items-center gap-2 ml-2 md:ml-4"
                onClick={toggleProfile}
              >
                <div>
                  <img
                    className="w-10 h-10 rounded-full shadow-lg object-cover"
                    src={user.image}
                    alt="User Avatar"
                  />
                </div>
                <div className="hidden md:flex flex-col">
                  <h2 className="text-[17px] text-gray-800 font-semibold text-h navbar-name ">
                    {user?.name}
                  </h2>
                  <p className="text-[14px] text-gray-500 font-normal">
                    @{user?.username}
                  </p>
                </div>

                <div className="relative ml-[2px] md:ml-4">
                  <button className="flex items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-[24px] w-[12.3rem] bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    >
                      <ul className="py-1">
                        <li className="px-4 py-[9px] text-gray-500 hover:bg-gray-100 cursor-pointer font-medium">
                          <Link
                            href={profileRoute}
                            className="block w-full h-full"
                          >
                            Profile
                          </Link>
                        </li>
                        <li className="px-4 py-[9px] text-gray-500 hover:bg-gray-100 cursor-pointer font-medium">
                          <Link
                            href={editProfileRoute}
                            className="block w-full h-full"
                          >
                            Edit Profile
                          </Link>
                        </li>
                        <hr />
                        {/* <li className="px-4 py-[9px] text-gray-500 hover:bg-gray-100 cursor-pointer font-medium">
                          <a
                            // href="/email-preferences"
                            onClick={() => {
                              toast.info(
                                "Feature Under Development! Stay tuned for updates.",
                                {
                                  position: "top-center",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                  transition: Slide,
                                }
                              );
                            }}
                            className="block w-full h-full"
                          >
                            Email Preferences
                          </a>
                        </li> */}
                        <li className="px-4 py-[9px] text-gray-500 hover:bg-gray-100 cursor-pointer font-medium">
                          <a
                            href="mailto:socials.wizz@gmail.com"
                            className="block w-full h-full"
                          >
                            Get Help
                          </a>
                        </li>

                        <li className="px-4 py-[9px] text-red-500 hover:bg-gray-100 cursor-pointer font-medium">
                          <button onClick={() => signOut()}>
                            <div className="block w-full h-full">Logout</div>
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center w-full justify-end lg:justify-between">
            {/* Left-aligned search bar */}
            <div className="flex-grow hidden lg:flex items-center max-w-md">
              {/* <div className="flex w-full rounded-md border-2 border-gray-200 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search Something..."
                  className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-[9px]"
                />
                <button
                  type="button"
                  className="flex items-center justify-center bg-[#2FCC71] px-5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 192.904 192.904"
                    width="16px"
                    className="fill-white"
                  >
                    <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                  </svg>
                </button>
              </div> */}
            </div>

            <div className="flex items-center md:justify-end">
              {/* <button className="hidden md:flex items-center px-4 py-[10px] md:px-5 md:py-[12px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-sm md:text-[16.2px] font-normal">
                Sign Up
                <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-3" />
              </button> */}
              <Link href="/signin">
                <button className="flex items-center px-4 py-2 md:px-5 md:py-[12px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg ml-4 md:ml-6 text-sm md:text-[16.2px] font-normal">
                  Signin
                  <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-3" />
                </button>
              </Link>
            </div>
          </div>
        )}
        {/* Render the modal conditionally
        {isModalOpen && (
          <UnderDevelopment isOpen={isModalOpen} onRequestClose={closeModal} />
        )} */}
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="bg-white shadow-lg p-4 w-[220px] absolute z-5 h-screen flex flex-col">
          {/* <h1 className="text-2xl font-bold text-gray-800 mb-4">Wizz</h1> */}
          <nav className="flex flex-col justify-between">
            <ul>
              {/* Top Section - First three items */}
              <Link href="/">
                <li
                  onClick={() => handleActiveItem("overview")}
                  className={`flex items-center py-4 pr-4 cursor-pointer transition-colors duration-300 ease-in-out ${
                    activeItem === "overview"
                      ? "text-green-500 font-semibold"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {activeItem === "overview" && (
                    <div className="absolute left-0 h-8 w-[4.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
                  )}
                  <HomeIcon className="h-6 w-6 mr-5" />
                  <span>Overview</span>
                </li>
              </Link>

              <Link href="/bounty">
                <li
                  onClick={() => handleActiveItem("bounties")}
                  className={`flex items-center py-4 pr-4 cursor-pointer transition-colors duration-300 ease-in-out ${
                    activeItem === "bounties"
                      ? "text-green-500 font-semibold"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {activeItem === "bounties" && (
                    <div className="absolute left-0 h-8 w-[4.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
                  )}
                  <BriefcaseIcon className="h-6 w-6 mr-5" />
                  <span>Bounties</span>
                </li>
              </Link>

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
                  className={`flex items-center py-4 pr-4 cursor-pointer transition-colors duration-300 ease-in-out ${
                    activeItem === "hirings"
                      ? "text-green-500 font-semibold"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {activeItem === "hirings" && (
                    <div className="absolute left-0 h-8 w-[4.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
                  )}
                  <UserGroupIcon className="h-6 w-6 mr-5" />
                  <span>Hirings</span>
                </li>
              </Link>

              <li
                onClick={() => {
                  handleActiveItem("projects");
                  toast.info(
                    "Feature Under Development! Stay tuned for updates.",
                    {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      transition: Slide,
                    }
                  );
                }}
                className={`flex items-center py-4 pr-4 cursor-pointer transition-colors duration-300 ease-in-out ${
                  activeItem === "projects"
                    ? "text-green-500 font-semibold"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {activeItem === "projects" && (
                  <div className="absolute left-0 h-8 w-[4.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
                )}
                <CalendarIcon className="h-6 w-6 mr-5" />
                <span>Projects</span>
              </li>

              <li
                onClick={() => {
                  handleActiveItem("grants");
                  toast.info(
                    "Feature Under Development! Stay tuned for updates.",
                    {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      transition: Slide,
                    }
                  );
                }}
                className={`flex items-center py-4 pr-4 cursor-pointer transition-colors duration-300 ease-in-out ${
                  activeItem === "grants"
                    ? "text-green-500 font-semibold"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {activeItem === "grants" && (
                  <div className="absolute left-0 h-8 w-[4.5px] bg-green-500 rounded-r transition-all duration-300 ease-in-out"></div>
                )}
                <AcademicCapIcon className="h-6 w-6 mr-5" />
                <span>Grants</span>
              </li>
            </ul>

            {/* Bottom Section */}
            {/* <ul className="mt-2 mx-[2px]">
              <button
                type="submit"
                className="text-gray-800 flex justify-center gap-2 items-center mx-auto shadow-lg text-sm bg-gray-50 backdrop-blur-sm lg:font-semibold isolation-auto border-[#75EDA6] before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#2FCC71] hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
              >
                Switch to partner
                <svg
                  className="w-7 h-7 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-gray-800 group-hover:fill-gray-800"
                  ></path>
                </svg>
              </button>
            </ul> */}
          </nav>
        </div>
      )}
    </div>
  );
});

// Optional: Provide a display name for better debugging
DefaultNavbar.displayName = "DefaultNavbar";

export default DefaultNavbar;
