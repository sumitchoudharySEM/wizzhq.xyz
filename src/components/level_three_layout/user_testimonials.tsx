"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "The best solution for anyone who wants to work a flexible schedule but still earn a full-time income.",
    name: "Darren Dunlap",
    location: "India",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    quote:
      "This platform transformed my career! Highly recommend it to anyone seeking flexible opportunities.",
    name: "Sara Smith",
    location: "USA",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    quote:
      "Absolutely love it! The best decision I've made for my work-life balance.",
    name: "Amit Gupta",
    location: "India",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
];

const UserTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[100vw] bg-white h-auto rounded-xl px-10 md:px-24 lg:px-40 py-9 shadow-sm shadow-[#e7e7e7] mb-4">
      {/* Title */}
      <h1 className="text-base md:text-lg text-[#17B459] font-bold text-center mb-5">
        Testimonials That Speak Volumes
      </h1>

      {/* Testimonial Slider using animate presence of framer motion */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {testimonials.map((testimonial, index) =>
            index === currentIndex ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  {/* SVG Quotes */}
                  <svg
                    className="absolute -top-5 -left-10 md:-top-4 md:-left-10 w-14 h-16 md:w-20 md:h-14 ml-5 md:ml-0"
                    width="84"
                    height="58"
                    viewBox="0 0 84 58"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M47.1438 35.3579C47.1438 29.2292 48.0867 23.9648 49.9725 19.5647C51.8582 15.0075 54.294 11.3145 57.2798 8.48589C60.2655 5.50012 63.6442 3.37864 67.4157 2.12147C71.3443 0.707158 75.1944 0 78.9659 0V8.25018C74.8801 8.25018 71.0301 9.66449 67.4157 12.4931C63.9585 15.1646 61.9156 18.8575 61.287 23.5719C61.7584 23.4148 62.3084 23.2576 62.937 23.1005C63.4085 22.9433 63.9585 22.7862 64.5871 22.629C65.3728 22.4719 66.2371 22.3933 67.18 22.3933C71.8943 22.3933 75.823 24.2005 78.9659 27.8149C82.1089 31.2721 83.6803 35.3579 83.6803 40.0723C83.6803 44.7866 82.0303 48.951 78.7302 52.5654C75.5873 56.0226 71.3443 57.7512 66.0014 57.7512C60.0298 57.7512 55.394 55.5512 52.0939 51.1511C48.7939 46.5938 47.1438 41.3294 47.1438 35.3579ZM0 35.3579C0 29.2292 0.942877 23.9648 2.82863 19.5647C4.71438 15.0075 7.15015 11.3145 10.1359 8.48589C13.1217 5.50012 16.5003 3.37864 20.2719 2.12147C24.2005 0.707158 28.0506 0 31.8221 0V8.25018C27.7363 8.25018 23.8862 9.66449 20.2719 12.4931C16.8146 15.1646 14.7717 18.8575 14.1432 23.5719C14.6146 23.4148 15.1646 23.2576 15.7932 23.1005C16.2646 22.9433 16.8146 22.7862 17.4432 22.629C18.229 22.4719 19.0933 22.3933 20.0361 22.3933C24.7505 22.3933 28.6792 24.2005 31.8221 27.8149C34.965 31.2721 36.5365 35.3579 36.5365 40.0723C36.5365 44.7866 34.8864 48.951 31.5864 52.5654C28.4434 56.0226 24.2005 57.7512 18.8575 57.7512C12.886 57.7512 8.25017 55.5512 4.9501 51.1511C1.65003 46.5938 0 41.3294 0 35.3579Z"
                      fill="#01CF57"
                      fill-opacity="0.13"
                    />
                  </svg>

                  <p className="text-center text-2xl lg:text-3xl font-bold text-[#2A3342]">
                    {testimonial.quote}
                  </p>
                  <svg
                    className="absolute -bottom-4 -right-10 md:-bottom-6 md:-right-4 w-14 h-16 md:w-20 md:h-14 mr-5 md:mr-0"
                    width="84"
                    height="59"
                    viewBox="0 0 84 59"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M36.8557 23.0015C36.8557 29.1302 35.9128 34.3946 34.027 38.7947C32.1413 43.3519 29.7055 47.0449 26.7197 49.8735C23.734 52.8593 20.3553 54.9807 16.5838 56.2379C12.6552 57.6522 8.80508 58.3594 5.03358 58.3594L5.03358 50.1092C9.11938 50.1092 12.9695 48.6949 16.5838 45.8663C20.041 43.1948 22.0839 39.5018 22.7125 34.7875C22.2411 34.9446 21.6911 35.1017 21.0625 35.2589C20.591 35.416 20.041 35.5732 19.4125 35.7303C18.6267 35.8875 17.7624 35.9661 16.8195 35.9661C12.1052 35.9661 8.1765 34.1589 5.03357 30.5445C1.89065 27.0873 0.319196 23.0015 0.319195 18.2871C0.319195 13.5727 1.96923 9.40837 5.26931 5.794C8.41223 2.33679 12.6552 0.608183 17.9981 0.608183C23.9697 0.608182 28.6055 2.80822 31.9056 7.20832C35.2056 11.7655 36.8557 17.0299 36.8557 23.0015ZM83.9995 23.0015C83.9995 29.1302 83.0566 34.3946 81.1709 38.7947C79.2851 43.3519 76.8494 47.0449 73.8636 49.8735C70.8778 52.8593 67.4992 54.9807 63.7277 56.2379C59.799 57.6522 55.9489 58.3594 52.1774 58.3594L52.1774 50.1092C56.2632 50.1092 60.1133 48.6949 63.7277 45.8663C67.1849 43.1948 69.2278 39.5018 69.8564 34.7875C69.3849 34.9446 68.8349 35.1017 68.2063 35.2589C67.7349 35.416 67.1849 35.5732 66.5563 35.7303C65.7706 35.8875 64.9063 35.966 63.9634 35.966C59.249 35.966 55.3203 34.1589 52.1774 30.5445C49.0345 27.0873 47.463 23.0015 47.463 18.2871C47.463 13.5727 49.1131 9.40837 52.4131 5.794C55.5561 2.33679 59.799 0.608179 65.142 0.608179C71.1135 0.608178 75.7493 2.80822 79.0494 7.20831C82.3495 11.7655 83.9995 17.0299 83.9995 23.0015Z"
                      fill="#01CF57"
                      fill-opacity="0.13"
                    />
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-2 mt-7 md:mt-8">
                  <div>
                    <img
                      className="w-12 h-12 object-cover rounded-full"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                  </div>
                  <div className="text-center">
                    <h1 className="text-base text-gray-700 font-semibold">
                      {testimonial.name}
                    </h1>
                    <h2 className="text-sm text-gray-500 font-normal">
                      {testimonial.location}
                    </h2>
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserTestimonials;
