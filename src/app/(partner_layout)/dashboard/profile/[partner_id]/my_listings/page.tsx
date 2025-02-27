import React from "react";
import SingleListing from "@/components/listings/single_listing";
import { ArrowRightCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Page = () => {
  const partnerId = "partner_id";

  return (
    <div className="py-3 px-4">
      <div className="grid gap-[2rem] grid-cols-1 lg:grid-cols-2">
        {/* {[...Array(2)].map((_, index) => (
          <SingleListing key={index} />
        ))} */}
      </div>

      <div className="flex flex-col items-center justify-center mt-5 md:mt-8 mb-2 gap-4">
        <div className="w-14 h-14 rounded-full bg-[#F8FFFB] shadow-md flex items-center justify-center">
          <PlusIcon className="w-11 h-w-11 text-[#2FCC71]" />
        </div>
        <Link href={`/dashboard/${partnerId}/create_bounty`}>
        <button className="flex items-center justify-center px-4 py-[6px] md:px-4 md:py-[9px] text-white bg-green-500 rounded-full hover:bg-[#2FCC71] transition duration-200 shadow hover:shadow-lg text-[15px] font-semibold">
          Create a new listing
          <ArrowRightCircleIcon className="h-5 w-5 ml-2 md:ml-[20px]" />
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
