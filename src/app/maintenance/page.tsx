import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-[1.5rem] md:text-4xl font-bold text-[#171717] text-center mt-5">
        This Page is Under Maintenance
      </h1>
      <p className="text-sm md:text-base text-center text-gray-700 mt-2 md:mt-3">
        We are currently working on improvements. This Page will be active soon.
        Thank you for your patience!
      </p>

      <img
        src="/images/maintenance_image.png"
        alt="error_image"
        className="w-[18rem] h-[18rem] md:w-[23rem] md:h-[23rem] object-cover mb-6 mt-5"
      />

      <div>
        <Link href="/">
          <button
            // type="submit"
            className={`mt-7 text-gray-800 flex justify-center gap-2 items-center mx-auto text-base backdrop-blur-sm lg:font-semibold isolation-auto border-[#75EDA6] shadow-lg bg-gray-50 border-2 rounded-full group before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#2FCC71] hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden group`}
          >
            <span>Back to HomePage</span>
            <svg
              className="w-7 h-7 group-hover:rotate-90 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
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
      </div>
    </div>
  );
};

export default Page;
