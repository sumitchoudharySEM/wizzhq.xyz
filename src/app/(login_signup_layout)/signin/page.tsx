import { signIn } from "../../../../auth";
import Image from "next/image";

const Page = () => {
  return (
    <div className="mb-8 md:my-auto mx-auto flex flex-col justify-center px-6 pt-[11rem] md:pt-10 md:justify-start lg:w-[33rem]">
      
      <div className="absolute top-14 md:top-6 lg:top-14">
        <Image height={50} width={105} src="/images/logo.png" alt="wizz" className="transition-all duration-300 ease-in-out" />
      </div>
      <h2 className="text-2xl lg:text-[1.85rem] font-bold md:text-left md:leading-tight">
        Ready to Begin, Get Started Now!
      </h2>
      <p className="mt-3 text-base">
        Sign in to explore jobs, projects, and rewards tailored just for you.
        Start earning with every opportunity.
      </p>
      {/* <p className="mt-[10px] text-center font-normal md:text-left">
        Already using Wizz?
        <Link
          href="/login"
          className="transition-colors duration-300 hover:underline hover:text-green-600 ml-2 whitespace-nowrap font-semibold text-[#2FCC71]"
        >
          Login here
        </Link>
      </p> */}
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: "/", // or wherever you want to redirect after login
          });
        }}
      >
        <button className="w-full mt-9 flex items-center font-semibold text-[17px] gap-[10px] justify-center rounded-md border border-slate-300 px-4 py-[12px] outline-none ring-[#2fcc71] ring-offset-2 transition hover:bg-slate-50 focus:ring-2">
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
          Get started with Google
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github", {
            redirectTo: "/", // or wherever you want to redirect after login
          });
        }}
      >
        <button className="w-full mt-8 flex items-center font-semibold text-[17px] gap-[10px] justify-center rounded-md border px-4  border-slate-300 py-[12px] outline-none ring-[#2fcc71] ring-offset-2 transition hover:bg-slate-50 focus:ring-2">
          <svg
            width="21"
            height="21"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_498_6644)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24.0199 0C10.7375 0 0 10.8167 0 24.1983C0 34.895 6.87988 43.9495 16.4241 47.1542C17.6174 47.3951 18.0545 46.6335 18.0545 45.9929C18.0545 45.4319 18.0151 43.509 18.0151 41.5055C11.3334 42.948 9.94198 38.6209 9.94198 38.6209C8.86818 35.8164 7.27715 35.0956 7.27715 35.0956C5.09022 33.6132 7.43645 33.6132 7.43645 33.6132C9.86233 33.7735 11.1353 36.0971 11.1353 36.0971C13.2824 39.7827 16.7422 38.7413 18.1341 38.1002C18.3328 36.5377 18.9695 35.456 19.6455 34.8552C14.3163 34.2942 8.70937 32.211 8.70937 22.9161C8.70937 20.2719 9.66321 18.1086 11.1746 16.4261C10.9361 15.8253 10.1008 13.3409 11.4135 10.0157C11.4135 10.0157 13.4417 9.3746 18.0146 12.4996C19.9725 11.9699 21.9916 11.7005 24.0199 11.6982C26.048 11.6982 28.1154 11.979 30.0246 12.4996C34.5981 9.3746 36.6262 10.0157 36.6262 10.0157C37.9389 13.3409 37.1031 15.8253 36.8646 16.4261C38.4158 18.1086 39.3303 20.2719 39.3303 22.9161C39.3303 32.211 33.7234 34.2539 28.3544 34.8552C29.2296 35.6163 29.9848 37.0584 29.9848 39.3421C29.9848 42.5871 29.9454 45.1915 29.9454 45.9924C29.9454 46.6335 30.383 47.3951 31.5758 47.1547C41.12 43.9491 47.9999 34.895 47.9999 24.1983C48.0392 10.8167 37.2624 0 24.0199 0Z"
                fill="#24292F"
              />
            </g>
            <defs>
              <clipPath id="clip0_498_6644">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Get started with Github
        </button>
      </form>
      {/* <form
        action={async () => {
          "use server";
          await signIn("twitter", {
            redirectTo: "/", // or wherever you want to redirect after login
          });
        }}
      >
        <button className="w-full mt-8 flex items-center font-semibold text-[17px] gap-[10px] justify-center rounded-md border px-4  border-slate-300 py-[12px] outline-none ring-[#2fcc71] ring-offset-2 transition hover:bg-slate-50 focus:ring-2">
          <svg
            width="21"
            height="21"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.6526 3.80859H43.3995L28.6594 20.6556L46 43.5805H32.4225L21.7881 29.6767L9.61989 43.5805H2.86886L18.6349 25.5608L2 3.80859H15.9222L25.5348 16.5173L36.6526 3.80859ZM34.2846 39.5422H38.0232L13.8908 7.63486H9.87892L34.2846 39.5422Z"
              fill="black"
            />
          </svg>
          Get started with X
        </button>
      </form> */}

      <p className="text-base text-center mt-[6.8rem]">
        By continuing, you agree to Wizz&apos;s{" "}
        <a
          href="/terms_conditions"
          className="text-blue-500 hover:underline"
        >
          Terms & Conditions
        </a>
        {" "}and{" "}
        <a
          href="/privacy_policy"
          className="text-blue-500 hover:underline"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default Page;
