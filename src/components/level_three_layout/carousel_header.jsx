"use client";

import React, { useState } from "react";
import {
  BriefcaseIcon,
  GifIcon,
  GiftIcon,
  PresentationChartLineIcon,
  UserCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Swiper component
const Carousel_header = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="w-full max-w-vw mx-auto shadow-md shadow-gray-100">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-[400px] lg:h-[300px]"
      >
        <SwiperSlide className="bg-white flex-slide flex-col lg:flex-row-reverse items-center justify-between gap-4 lg:justify-start lg:gap-16 relative">
          <div className="px-4 lg:pl-7 flex flex-col gap-2 lg:gap-1 text-center lg:text-left pt-4 sm:pt-7 lg:py-12">
            <h1 className="text-2xl lg:text-[26px] text-black font-bold flex flex-wrap justify-center lg:justify-start">
              <span className="block lg:inline">Get Started with Wizz in</span>
              <span className="text-[#119947]">
                <span className="hidden lg:inline ml-2">Minutes!</span>
                <span className="lg:hidden">Minutes!</span>
                <img
                  src="/images/yt_vector3.png"
                  className="w-28 lg:w-[136px] mt-1 lg:mt-2 mx-auto lg:mx-0"
                  alt="vector3"
                />
              </span>
            </h1>
            <p className="lg:text-[17px] leading-7 font-normal text-gray-400 ">
              Watch our easy-to-follow video guide to quickly get up to speed
              and start exploring all the exciting bounties and rewards Wizz has
              to offer.
            </p>
            <Link href="/signin">
              <button className="hidden lg:flex items-center px-5 py-[12px] mt-7 text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-sm text-[16.2px] font-normal">
                Sign Up For Free
                <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-3" />
              </button>
            </Link>
          </div>

          <div className="hidden lg:block absolute top-0 right-0 mt-10 lg:mt-[8.8rem]">
            <img src="/images/yt_vector2.png" className="w-36" alt="vector2" />
          </div>

          <div className="hidden lg:block absolute top-0 left-[37.3%] transform -translate-x-1/2 mt-12">
            <img src="/images/yt_vector1.png" className="w-24" alt="vector1" />
          </div>

          <div className="h-[210px] sm:h-[250px] lg:h-full mt-auto w-full lg:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1455849318743-b2233052fcff?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmFuZG9tfGVufDB8fDB8fHww"
              className="w-full h-full object-cover"
              alt="Thumbnail"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313cc] via-[#22222299] to-[#44444466] opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={openModal}
                class="relative bg-gradient-to-b from-green-400 to-[#2fcc71] rounded-full p-3 sm:p-4 text-white text-5xl grid place-items-center mb-8 sm:mb-0"
              >
                <PlayIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                <span class="absolute inset-0 rounded-full bg-[#2fcc71] opacity-70 animate-pulse-custom"></span>
                <span class="absolute inset-0 rounded-full bg-[#2fcc71] opacity-70 animate-pulse-custom delay-1000"></span>
              </button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="bg-white px-9 py-7 flex flex-col items-start justify-center">
          <div className="flex flex-col mb-5 lg:mb-8 gap-1">
            <h1 className="text-2xl lg:text-[26px] font-bold text-[#002c04f1]">
              Milestones in Motion
            </h1>
            <p className="text-[15px] lg:text-[17px] font-normal text-gray-400">
              Witness the metrics that celebrate our journey and collective
              impact.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 lg:gap-y-6 lg:gap-x-8 ">
            <div className="flex flex-col gap-4 items-start border-slate-200 lg:border-r">
              <div className="bg-[#FFFBEB] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="text-[#F6A723] md:w-6 md:h-6 w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <h3 className="text-[#64748B] text-base font-semibold">
                  Bounties Listed
                </h3>
                <h1 className="text-xl lg:text-2xl text-gray-900 font-bold tracking-wide">
                  30K
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-start border-slate-200 lg:border-r">
              <div className="bg-[#EFFFEF] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
                <PresentationChartLineIcon className="text-[#2FCC71] md:w-6 md:h-6 w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <h3 className="text-[#64748B] text-base font-semibold">
                  Total Submissions
                </h3>
                <h1 className="text-xl lg:text-2xl text-gray-900 font-bold tracking-wide">
                  15K
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-start lg:border-r">
              <div className="bg-[#FDF2F8] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
                <GiftIcon className="text-[#ED4F9D] md:w-6 md:h-6 w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <h3 className="text-[#64748B] text-base font-semibold">
                  Rewards Granted
                </h3>
                <h1 className="text-xl lg:text-2xl text-gray-900 font-bold tracking-wide">
                  50K
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-start">
              <div className="bg-[#F8FAFC] md:w-11 md:h-11 w-9 h-9 rounded-lg flex items-center justify-center">
                <UserCircleIcon className="text-[#38BDF8] md:w-6 md:h-6 w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <h3 className="text-[#64748B] text-base font-semibold">
                  Active Users
                </h3>
                <h1 className="text-xl lg:text-2xl text-gray-900 font-bold tracking-wide">
                  10K
                </h1>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="bg-[#1AC462] flex items-center justify-center relative">
          <div
            className="absolute inset-0 lg:bg-cover bg-[length:150%_auto] bg-center"
            style={{ backgroundImage: "url('/images/points_cta.png')" }}
          ></div>
          <div className="flex lg:flex-row flex-col lg:items-center items-start justify-between z-10 p-7 lg:p-10 lg:mt-5">
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-bold">
                Refer, Engage,
                <br />
                Contribute, Earn!
              </h1>
              <p className="text-[#EFF0F6] mt-4 md:leading-7 leading-6 text-base">
                Your active engagement and contributions on Wizz are rewarded!
                Earn points by referring friends, staying consistently active,
                participating in discussions, and sharing valuable insights.
                Start earning today!
              </p>
            </div>
            <div className="mt-6 flex md:space-x-4 flex-col justify-start md:items-center space-y-4 md:space-y-0 md:flex-row">
              <button
                type="submit"
                className="h-12 w-56 md:w-52 md:h-[76px] text-[#1AC462] hover:text-white flex justify-center md:justify-start gap-2 items-center md:mx-auto text-base backdrop-blur-sm lg:font-semibold isolation-auto bg-gray-50 group before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-transparent hover:before:bg-[#12CA5F] hover:border-2 hover:border-white before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 p-3 md:px-6 md:pb-4 md:pt-6 overflow-hidden rounded-[12px] group"
              >
                <span className="text-left hidden md:block">
                  Track <br /> Your Progress
                </span>
                <span className="text-left md:hidden">Track Your Progress</span>
                <svg
                  className="w-8 h-8 group-hover:rotate-90 text-gray-50 ease-linear duration-300 group-hover:border-none p-2 rotate-45 md:mt-[1.5rem]"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-[#1AC462] group-hover:fill-white"
                  ></path>
                </svg>
              </button>

              <button
                type="submit"
                className="h-12 w-56 md:w-52 md:h-[76px] text-white hover:text-[#1AC462 ] flex justify-center md:justify-start gap-2 items-center md:mx-auto text-base backdrop-blur-sm lg:font-semibold isolation-auto bg-transparent group before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-transparent hover:before:bg-[#ffff] border-2 border-white before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 p-3 md:px-6 md:pb-4 md:pt-6 overflow-hidden rounded-[12px] group"
              >
                <span className="text-left hidden md:block">
                  Explore <br /> How It Works
                </span>
                <span className="text-left md:hidden">
                  Explore How It Works
                </span>
                <svg
                  className="w-8 h-8 group-hover:rotate-90 text-gray-50 ease-linear duration-300 group-hover:border-none p-2 rotate-45 md:mt-[1.5rem]"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-white group-hover:fill-[#1AC462]"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-[90%] lg:w-[60%] bg-[#f8fafc] rounded-lg shadow-lg">
            <button className="absolute top-2 right-2" onClick={closeModal}>
              <XMarkIcon className="h-6 w-6 text-white" strokeWidth={2} />
            </button>
            <iframe
              className="w-full h-64 sm:h-80 lg:h-[500px] rounded-lg"
              src="https://www.youtube.com/embed/R4qSazNLn0Q?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel_header;
