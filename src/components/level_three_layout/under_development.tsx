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
      <div className="relative bg-white rounded-lg shadow-lg w-80 md:w-[28rem] p-6">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={onRequestClose}
        >
          <XMarkIcon className="h-6 w-6 text-[#323232]" strokeWidth={2} />
        </button>

        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/under_development.png" 
            alt="Under Construction"
            className="w-40 h-40"
          />
        </div>

        {/* Main Heading */}
        <h2 className="text-xl font-bold text-center text-[#323232]">
          Feature Under Development
        </h2>

        {/* Subheading */}
        <p className="text-center text-sm text-gray-600 mt-2">
          We're working hard to bring this feature to life! Stay tuned for updates as we continue building a better experience.
        </p>
      </div>
    </div>
  );
};

export default UnderDevelopment;
