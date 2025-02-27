export default function NavbarShimmer() {
    return (
      <div className="sticky top-0 z-50 drop-shadow-sm">
        <div className="flex justify-between items-center bg-white shadow md:px-12 py-[10px] px-4">
          <div className="flex items-center">
            {/* <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="md:hidden h-6 w-16 bg-gray-200 rounded ml-3 animate-pulse"></div> */}
          </div>
  
          <div className="flex items-center w-full justify-end lg:justify-between gap-5">
            {/* Left-aligned search bar shimmer */}
            <div className="flex-grow hidden lg:flex items-center w-[22rem] max-w-[25rem]">
              {/* <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse"></div> */}
            </div>
  
            <div className="flex items-center gap-3 md:gap-5">
              {/* Become partner button shimmer */}
              <div className="hidden md:block h-11 w-40 bg-gray-200 rounded-full animate-pulse"></div>
  
              {/* Profile section shimmer */}
              <div className="flex items-center gap-2 ml-2 md:ml-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="hidden md:flex flex-col gap-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse ml-[2px] md:ml-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }