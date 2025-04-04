"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-[11rem] md:pt-8 md:justify-start lg:w-[28rem]">
      <p className="text-center text-3xl font-bold md:text-left md:leading-tight">
        Log In to your account
      </p>
      <p className="mt-[10px] text-center font-normal md:text-left">
        Are you new here?
        <Link href="/signup" className="transition-colors duration-300 hover:underline hover:text-green-600 ml-2 whitespace-nowrap font-semibold text-[#2FCC71]">
          Sign Up here
        </Link>
      </p>
      <button className=" mt-8 flex items-center font-semibold text-[17px] gap-[10px] justify-center rounded-md border px-4 py-[12px] outline-none ring-[#2fcc71] ring-offset-2 transition hover:bg-slate-50 focus:ring-2">
        <svg
          width="21"
          height="21"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_190_6510)">
            <path
              d="M21.1696 9.08734L12.196 9.08691C11.7997 9.08691 11.4785 9.40806 11.4785 9.80432V12.671C11.4785 13.0672 11.7997 13.3884 12.1959 13.3884H17.2493C16.696 14.8244 15.6632 16.0271 14.3455 16.7913L16.5002 20.5213C19.9567 18.5223 22.0002 15.0148 22.0002 11.0884C22.0002 10.5293 21.959 10.1297 21.8766 9.67967C21.814 9.33777 21.5171 9.08734 21.1696 9.08734Z"
              fill="#167EE6"
            />
            <path
              d="M10.9999 17.6954C8.52689 17.6954 6.36797 16.3442 5.20846 14.3447L1.47852 16.4946C3.37666 19.7844 6.9325 21.9997 10.9999 21.9997C12.9953 21.9997 14.878 21.4625 16.4999 20.5263V20.5211L14.3452 16.791C13.3595 17.3627 12.219 17.6954 10.9999 17.6954Z"
              fill="#12B347"
            />
            <path
              d="M16.5 20.5262V20.5211L14.3452 16.791C13.3596 17.3626 12.2192 17.6954 11 17.6954V21.9997C12.9953 21.9997 14.8782 21.4625 16.5 20.5262Z"
              fill="#0F993E"
            />
            <path
              d="M4.30435 10.9998C4.30435 9.78079 4.63702 8.64036 5.20854 7.65478L1.4786 5.50488C0.537195 7.12167 0 8.99932 0 10.9998C0 13.0002 0.537195 14.8779 1.4786 16.4947L5.20854 14.3448C4.63702 13.3592 4.30435 12.2188 4.30435 10.9998Z"
              fill="#FFD500"
            />
            <path
              d="M10.9999 4.30435C12.6126 4.30435 14.0939 4.87738 15.2509 5.83056C15.5363 6.06568 15.9512 6.04871 16.2127 5.78725L18.2438 3.75611C18.5405 3.45946 18.5193 2.97387 18.2024 2.69895C16.2639 1.0172 13.7416 0 10.9999 0C6.9325 0 3.37666 2.21534 1.47852 5.50511L5.20846 7.65501C6.36797 5.65555 8.52689 4.30435 10.9999 4.30435Z"
              fill="#FF4B26"
            />
            <path
              d="M15.251 5.83056C15.5364 6.06568 15.9513 6.04871 16.2128 5.78725L18.2439 3.75611C18.5405 3.45946 18.5194 2.97387 18.2025 2.69895C16.264 1.01716 13.7417 0 11 0V4.30435C12.6126 4.30435 14.094 4.87738 15.251 5.83056Z"
              fill="#D93F21"
            />
          </g>
          <defs>
            <clipPath id="clip0_190_6510">
              <rect width="22" height="22" fill="white" />
            </clipPath>
          </defs>
        </svg>
        Login with Google
      </button>
      <div className="relative mt-8 flex h-px place-items-center bg-gray-200">
        <div className="absolute left-1/2 h-6 -translate-x-1/2 bg-white px-4 text-center text-sm text-gray-500">
          Or use email instead
        </div>
      </div>
      <form
        className="flex flex-col items-stretch pt-3 md:pt-[20px]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col pt-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-normal text-[#344054]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px]"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col pt-4 relative">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-normal text-[#344054]"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"} // Toggle input type
            id="password"
            className="bg-[#ffffff] border border-gray-300 text-gray-900 text-sm rounded-[6px] focus:ring-green-500 focus:border-green-500 block w-full p-[10px] pr-10"
            placeholder="•••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 pt-[43px]"
          >
            {showPassword ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_54_4231)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.142598 2.31017C0.385538 1.97468 0.854448 1.89966 1.18994 2.1426L15.6899 12.6426C16.0254 12.8855 16.1005 13.3544 15.8575 13.6899C15.6146 14.0254 15.1457 14.1005 14.8102 13.8575L12.5615 12.2292C11.3457 13.1889 9.7922 14.0001 8.00006 14.0001C6.0187 14.0001 4.32923 13.0084 3.06667 11.9225C1.79722 10.8308 0.8805 9.57698 0.42968 8.89876C0.0668461 8.35291 0.0657162 7.64896 0.429259 7.10198C0.783329 6.56925 1.4245 5.68192 2.2979 4.7969L0.310172 3.35751C-0.0253172 3.11457 -0.100343 2.64566 0.142598 2.31017ZM3.52875 5.6882C2.66555 6.5303 2.02476 7.4113 1.6785 7.93227C1.66294 7.95569 1.65707 7.97881 1.65708 7.99992C1.65709 8.02107 1.66303 8.04455 1.67888 8.0684C2.09147 8.68911 2.92065 9.81854 4.04474 10.7853C5.17571 11.7579 6.52743 12.5001 8.00006 12.5001C9.19465 12.5001 10.3095 12.0116 11.2907 11.3089L9.06202 9.69505C8.75428 9.88827 8.39019 10 8 10C6.89543 10 6 9.10458 6 8.00001C6 7.83446 6.02011 7.6736 6.05803 7.51976L3.52875 5.6882ZM8.00006 3.50005C7.48367 3.50005 6.98343 3.59079 6.50129 3.7511C6.10823 3.88179 5.68365 3.6691 5.55296 3.27604C5.42227 2.88299 5.63496 2.45841 6.02802 2.32772C6.64531 2.12247 7.30538 2.00005 8.00006 2.00005C9.98141 2.00005 11.6709 2.99172 12.9334 4.07756C14.2029 5.16932 15.1196 6.42313 15.5704 7.10135C15.9337 7.64779 15.9336 8.3524 15.5704 8.89879C15.4598 9.0652 15.3223 9.26447 15.1596 9.48627C14.9146 9.82026 14.4452 9.8924 14.1113 9.6474C13.7773 9.4024 13.7051 8.93304 13.9501 8.59905C14.0979 8.39766 14.2221 8.2175 14.3212 8.06843C14.35 8.02506 14.35 7.97502 14.3212 7.93171C13.9086 7.311 13.0795 6.18157 11.9554 5.21482C10.8244 4.24216 9.47268 3.50005 8.00006 3.50005Z"
                    fill="#979797"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_54_4231">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.67884 7.93165C2.09143 7.31094 2.9206 6.18152 4.0447 5.21477C5.17567 4.2421 6.52738 3.5 8.00001 3.5C9.47264 3.5 10.8244 4.2421 11.9553 5.21477C13.0794 6.18152 13.9086 7.31094 14.3212 7.93165C14.35 7.975 14.35 8.025 14.3212 8.06835C13.9086 8.68906 13.0794 9.81848 11.9553 10.7852C10.8244 11.7579 9.47264 12.5 8.00001 12.5C6.52738 12.5 5.17567 11.7579 4.0447 10.7852C2.9206 9.81848 2.09143 8.68906 1.67884 8.06835C1.65002 8.025 1.65002 7.975 1.67884 7.93165ZM8.00001 2C6.01865 2 4.32919 2.99167 3.06662 4.07751C1.79718 5.16926 0.880454 6.42307 0.429635 7.10129C0.0664231 7.64771 0.0664245 8.35229 0.429635 8.89871C0.880455 9.57693 1.79718 10.8307 3.06662 11.9225C4.32919 13.0083 6.01865 14 8.00001 14C9.98137 14 11.6708 13.0083 12.9334 11.9225C14.2028 10.8307 15.1196 9.57693 15.5704 8.89871C15.9336 8.35229 15.9336 7.64771 15.5704 7.10129C15.1196 6.42307 14.2028 5.16926 12.9334 4.07751C11.6708 2.99167 9.98137 2 8.00001 2ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                  fill="#979797"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          className="mt-[30px] rounded-lg bg-[#2FCC71] px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-green-500 ring-offset-2 transition hover:bg-green-600 focus:ring-2"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Page;
