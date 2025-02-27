import React from "react";
import Link from "next/link";
import { toast, Slide } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";

const DefaultFooter = () => {
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

  return (
    <footer className="max-w-[100vw] shadow-lg">
      <div className="bg-gradient-to-r from-[#18A14F] to-[#2FCC71] text-white flex flex-col gap-2 md:gap-[11px] md:flex-row justify-between md:items-center px-5 md:px-9 lg:px-14 py-3">
        <div className="text-white font-medium text-[16px] lg:text-[17px] leading-7">
          <h1>Get connected with us on social networks!</h1>
        </div>
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
          {/* instagram */}
          {/* <a href="">
            <svg
              width="19"
              height="19"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_210_6135)">
                <path
                  d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70313 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3313 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2813 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z"
                  fill="#000100"
                />
                <path
                  d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z"
                  fill="#000100"
                />
                <path
                  d="M39.6937 11.1848C39.6937 12.7785 38.4 14.0629 36.8156 14.0629C35.2219 14.0629 33.9375 12.7691 33.9375 11.1848C33.9375 9.59102 35.2313 8.30664 36.8156 8.30664C38.4 8.30664 39.6937 9.60039 39.6937 11.1848Z"
                  fill="#000100"
                />
              </g>
              <defs>
                <clipPath id="clip0_210_6135">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a> */}
          {/* telegram */}
          <motion.a
            href="https://t.me/wizz_hq/1"
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

      {/* <hr className=" border-gray-200 my-[9px]" /> */}

      <div className="px-5 md:px-9 lg:px-14 pb-[16px] md:pb-[16px] md:pt-[26px] pt-7">
        <div className="grid grid-cols-1  lg:flex lg:justify-between gap-5 ">
          {/* First column */}
          <div className="lg:w-1/3 mr-11">
            <Image height={60} width={80} src="/images/logo.png" alt="wizz" className="transition-all duration-300 ease-in-out mb-3" />
            <p className="text-gray-600 text-base font-normal">
              WIZZ is your gateway to endless opportunities—bounties, projects,
              grants, and hirings—connecting talents with partners for
              meaningful rewards.
            </p>
            <div className="flex items-center space-x-1 pt-[8px] md:pt-[10px]">
              <h1 className="text-[16px] text-gray-600">Email:</h1>
              <a
                href="mailto:socials.wizz@gmail.com"
                className="text-blue-500 hover:text-blue-600 font-normal hover:font-semibold transition duration-300 text-[16px] rounded-lg p-2"
              >
                socials.wizz@gmail.com
              </a>
            </div>
          </div>

          {/* Second column */}
          <div className="lg:w-2/3 lg:flex lg:justify-around lg:space-x-12">
            <div className="flex flex-col mb-6 lg:mb-0">
              <p className="text-[#303850] text-lg font-semibold">
                OPPORTUNITIES
              </p>
              <div className="flex flex-col items-start mt-2 space-y-3">
                <Link
                  href="/"
                  className="text-gray-600 text-base font-normal transition-colors duration-300 hover:underline hover:text-green-600"
                >
                  Bounties
                </Link>
                <button
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
                  className="text-gray-600 text-base font-normal transition-colors duration-300 hover:underline hover:text-green-600"
                >
                  Projects
                </button>
              </div>
            </div>

            {/* Third colum */}
            <div className="flex flex-col mr-[20px]">
              <p className="text-[#303850] text-lg font-semibold">CATEGORIES</p>
              <div className="flex flex-col items-start mt-2 space-y-3">
                <Link
                  href="#"
                  className="text-gray-600 text-base font-normal transition-colors duration-300 hover:underline hover:text-green-600"
                >
                  Development
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 text-base font-normal transition-colors duration-300 hover:underline hover:text-green-600"
                >
                  Content
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 text-base font-normal transition-colors duration-300 hover:underline hover:text-green-600"
                >
                  Design
                </Link>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:mt-8 mb-[20px]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
          <div>
            <h3 className="text-gray-600 text-base font-normal">
              © {new Date().getFullYear()} — Copyright Wizz. All rights
              reserved.
            </h3>
          </div>

          <div className="flex gap-6">
            <Link
              href="/terms_conditions"
              className="text-gray-600 text-base font-normal hover:underline hover:text-green-600"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy_policy"
              className="text-gray-600 text-base font-normal hover:underline hover:text-green-600"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DefaultFooter;
