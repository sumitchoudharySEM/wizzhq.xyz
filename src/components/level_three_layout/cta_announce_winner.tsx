import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface UnderDevelopmentProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({
  isOpen,
  onRequestClose,
}) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-[21.5rem] md:w-[29rem] p-6 md:p-8">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-gray-500"
          onClick={onRequestClose}
        >
          <XMarkIcon className="h-6 w-6 text-[#323232]" strokeWidth={2} />
        </button>

        {/* Illustration */}
        <div className="flex flex-col gap-5 md:gap-8 mt-3">
            <div>
                <h2 className="text-lg md:text-xl font-semibold text-[#1E293B]">Ready to Announce? Follow These Steps:</h2>
            </div>
            <div className="flex gap-7">
                <div className="flex flex-col items-center">
                    <div className="px-3 py-1 bg-[#2fcc71] rounded-[4px] text-white">
                        1
                    </div>
                    <div className="h-[4.2rem] md:h-[3.9rem] w-[1.5px] bg-[#8e8e8e]"></div>
                    <div className="px-3 py-1 bg-[#2fcc71] rounded-[4px] text-white">
                        2
                    </div>
                    <div className="h-[4.8rem] md:h-16 w-[1.5px] bg-[#8e8e8e]"></div>
                    <div className="px-3 py-1 bg-[#2fcc71] rounded-[4px] text-white">
                        3
                    </div>
                    <div className="h-[5.8rem] md:h-21 w-[1.5px] bg-[#8e8e8e]"></div>
                    <div className="px-3 py-1 bg-[#2fcc71] rounded-[4px] text-white">
                        4
                    </div>
                </div>
                <div className="flex flex-col gap-9">
                    <div>
                        <h3 className="text-[17px] leading-3 font-medium text-[#475569] mb-2">Pick & Match</h3>
                        <p className="text-[14.8px] leading-5 font-normal text-[#8e8e8e]">Use the dropdown to assign each prize to the perfect submission.</p>
                    </div>
                    <div>
                        <h3 className="text-[17px] leading-3 font-medium text-[#475569] mb-2">Complete Your Lineup</h3>
                        <p className="text-[14.8px] leading-5 font-normal text-[#8e8e8e]">Every prize needs a home. Make sure all rewards are assigned before moving to the next step.</p>
                    </div>
                    <div>
                        <h3 className="text-[17px] leading-3 font-medium text-[#475569] mb-2">Lock It In</h3>
                        <p className="text-[14.8px] leading-5 font-normal text-[#8e8e8e]">Once you're happy with your choices, hit “Announce Winners” to seal the deal and share results with everyone.</p>
                    </div>
                    <div>
                        <h3 className="text-[17px] leading-3 font-medium text-[#475569] mb-2">Reward the winners!</h3>
                        <p className="text-[14.8px] leading-5 font-normal text-[#8e8e8e]">As soon as the winners are announced, Wizz will take care of the prize distribution, ensuring they receive their rewards promptly.</p>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-[14px] md:text-base font-normal italic text-red-500">Pro Tip: You can't proceed without assigning all prizes!</h3>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
