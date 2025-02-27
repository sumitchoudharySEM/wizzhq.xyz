import React from "react";

const winners_soon = () => {
  return (
    <div className="flex flex-col items-center gap-3 max-h-screen">
      <svg
        className="w-[3.5rem] h-[3.5rem] lg:w-[4.5rem] lg:h-[4.5rem] lg:mt-20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6045 3.50708L6.15445 13.0571C5.94796 13.4103 5.94856 13.8476 6.15601 14.2003C6.36347 14.553 6.74538 14.7659 7.15445 14.7571H10.0145C10.3822 14.7544 10.7358 14.8986 10.9967 15.1577C11.2577 15.4168 11.4045 15.7693 11.4045 16.1371V19.7471C11.4078 20.1856 11.6966 20.5708 12.1166 20.697C12.5366 20.8233 12.9899 20.6611 13.2345 20.2971L18.5145 12.3771C18.7455 12.0286 18.7673 11.5816 18.5712 11.2123C18.3751 10.8431 17.9926 10.6108 17.5745 10.6071H14.8545C14.0923 10.6071 13.4745 9.98924 13.4745 9.22708V4.00708C13.4776 3.55169 13.1727 3.15166 12.7328 3.03403C12.2928 2.9164 11.829 3.11087 11.6045 3.50708Z"
          fill="#2dc653"
        />
      </svg>

      <div className="flex flex-col items-center gap-2 md:gap-3">
        <h1 className="text-2xl lg:text-[27px] leading-8 font-bold text-[#2aba4e] text-center">
          Victory is near!
        </h1>
        <p className="text-base lg:text-[17px] leading-5 font-normal text-[#3E3E3E] text-center">
          Winners will be announced in no time. Stay thrilled!
        </p>
      </div>
    </div>
  );
};

export default winners_soon;
