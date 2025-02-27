import { PaintBrushIcon } from "@heroicons/react/24/outline";
import React from "react";

const choose_template = () => {
  return (
    <div className="bg-white px-6 py-8 rounded-2xl mt-3 shadow-md shadow-[#f5f5f5]">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-[#FFECD5] flex items-center justify-center">
          <PaintBrushIcon className="w-7 h-7 text-[#FFB65E]" />
        </div>
        <h2 className="text-lg font-medium text-[#0F172A]">Deep Dive</h2>
      </div>
      <div className="flex items-center justify-between w-full gap-4 mt-4">
        <button className="w-[48%] flex items-center justify-center px-4 py-[8px] md:px-4 md:py-2 text-[#2FCC71] bg-[#F8FAFC] border-2 border-[#2FCC71] rounded-full transition duration-200 shadow hover:shadow-md  text-[12px] lg:text-[14px] font-medium">
          Quick View
        </button>
      </div>
    </div>
  );
};

export default choose_template;
