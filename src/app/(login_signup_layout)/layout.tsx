"use client";

import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/16/solid";
import { motion } from "framer-motion";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const testimonials = [
    {
      name: "Divyanshu Urmaliya",
      role: "Developer at TechCorp",
      comment:
        "This platform really helped me boost my productivity. The tools are incredibly user-friendly!",
      image:
        "https://img.freepik.com/free-photo/view-child-hair-salon_23-2150462483.jpg",
      rating: 5,
    },
    {
      name: "Divyanshu Urmaliya",
      role: "Designer at WebStudio",
      comment:
        "I love the UI and the ease of navigation. It made my workflow so much smoother.",
      image:
        "https://img.freepik.com/free-photo/view-child-hair-salon_23-2150462483.jpg",
      rating: 5,
    },
    {
      name: "Divyanshu Urmaliya",
      role: "Project Manager at Innovate Ltd.",
      comment:
        "A game-changer for project management! The features are intuitive and efficient.",
      image:
        "https://img.freepik.com/free-photo/view-child-hair-salon_23-2150462483.jpg",
      rating: 4,
    },
    {
      name: "Divyanshu Urmaliya",
      role: "SEO Specialist at WebVibe",
      comment:
        "Amazing platform! It saved me so much time, and I saw immediate results in my workflow.",
      image:
        "https://img.freepik.com/free-photo/view-child-hair-salon_23-2150462483.jpg",
      rating: 5,
    },
    {
      name: "Divyanshu Urmaliya",
      role: "Entrepreneur",
      comment:
        "Highly recommend this service. It provided me with the tools I needed to scale my business quickly.",
      image:
        "https://img.freepik.com/free-photo/view-child-hair-salon_23-2150462483.jpg",
      rating: 4,
    },
  ];

  // State to keep track of current testimonial index
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-change the testimonial every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prevIndex) => (prevIndex + 1) % testimonials.length
      );
    }, 4000);

    return () => clearInterval(interval); // Cleanup the interval
  }, [testimonials.length]);

  return (
    <div className="flex w-screen flex-wrap text-slate-800 max-h-screen">
      <div
        className="relative hidden h-screen select-none flex-col justify-center  md:flex md:w-1/2"
        style={{
          backgroundImage: "url('/images/login_signup_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1.5,
          zIndex: -1,
        }}
      >
        <div className="mx-auto py-16 px-8 text-[#ffff] xl:w-[40rem]">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
          Your skills are valuable, Get what you're worth!
          </h1>
          <p className="text-base lg:text-lg text-white mb-[150px]">
          Join a community where you can take on meaningful projects, land exciting roles, and build your future - all while getting paid for your expertise.
          </p>

          {/* Testimonial carousel */}
          {/* <motion.div
            className="flex gap-3 overflow-hidden relative"
            key={currentTestimonial}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 2 }}
          >
            <div key={currentTestimonial}>
              <div className="flex items-center gap-[10px] mb-[20px]">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <StarIcon key={i} className="w-6 h-6 text-[#ffff]" />
                  )
                )}
              </div>

              <blockquote className="text-[#ffff] font-medium italic text-[16.5px] mb-[23px]">
                {testimonials[currentTestimonial].comment}
              </blockquote>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-white">
                  <p className="font-bold text-[19px]">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-sm">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div> */}
          <div className="flex gap-3 overflow-hidden relative">
            <div>
              <div className="flex items-center gap-[10px] mb-[20px]">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-[#ffff]" />
                ))}
              </div>

              <blockquote className="text-[#ffff] font-medium italic text-[16.5px] mb-[23px]">
              Talent is everywhere; fair pay isn't. We need platforms like @WizzHQ to close the gap and unlock global collaboration.
              </blockquote>

              <div className="flex items-center space-x-4">
                <img
                  src="/images/feedback/deepak.jpg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-white">
                  <p className="font-bold text-[19px]">Deepak Jadhav</p>
                  <p className="text-sm">Engineer. Marketer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col md:w-1/2">{children}</div>
    </div>
  );
}
