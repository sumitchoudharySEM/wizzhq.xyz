"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchbarFilter from "@/components/level_two_layout/searchbar_filter.jsx";
import SingleJob from "@/components/jobs/single_job.jsx";
import CarouselHeader from "@/components/level_three_layout/carousel_header.jsx";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import CommunityPartners from "@/components/level_two_layout/community_partners";

function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filteredJobs, setFilteredJobs] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  // Check if the user landed with a referral code in the URL
  React.useEffect(() => {
    const handleReferralCode = () => {
      const referralCode = searchParams?.get('ref');
      if (referralCode) {
        // Store the code when someone lands with a referral link
        // localStorage.setItem('referralCode', referralCode);
        document.cookie = `referralCode=${referralCode}; path=/; max-age=2592000; SameSite=Lax`; // 30 days expiry
        // console.log("Stored referral code from URL:", referralCode);
      }
    };

    handleReferralCode();
  }, [searchParams]);

  // Fetch listings only once when component mounts
  React.useEffect(() => {
    fetchJobs();
  }, []);

  //test commit
  //fetch jobs from the server
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/all_jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const fetchedJobs = data.jobs || [];
      setJobs(fetchedJobs.filter(job => job.verified === 1));
      setFilteredJobs(fetchedJobs.filter(job => job.verified === 1));
    } catch (error) {
      console.error("Error fetching jobs data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check the status of a listing whether it is active or completed
  const checkJobStatus = React.useCallback((job) => {
    if (!job.end_date) return "active";
    const currentDate = new Date();
    const endDate = new Date(job.end_date);
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return currentDate > endDate ? "completed" : "active";
  }, []);

  // Check if the partner name matches the search term for a listing
  const checkPartnerNameMatch = React.useCallback(
    async (partnerId, searchTerm) => {
      try {
        const response = await fetch(
          `/api/partners_listing/partner?id=${partnerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const partnerName = data.partner?.name || "";
        return partnerName.toLowerCase().includes(searchTerm.toLowerCase());
      } catch (error) {
        console.error("Error fetching partner data:", error);
        return false;
      }
    },
    []
  );

  // Filter jobs based on selected status, category, and search term
  React.useEffect(() => {
    const filterJobs = async () => {
      if (isSearching) return; // Prevent multiple simultaneous searches

      setIsSearching(true);
      let filtered = [...jobs];

      // Filter by status
      if (selectedStatus) {
        filtered = filtered.filter((job) => {
          const jobStatus = checkJobStatus(job);
          return jobStatus === selectedStatus;
        });
      }

      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(
          (job) => job.categories === selectedCategory
        );
      }

      // Filter by search term
      if (searchTerm) {
        const searchResults = await Promise.all(
          filtered.map(async (job) => {
            const matchesTitle = job.title
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesDescription = job.short_description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesPartner = await checkPartnerNameMatch(
              job.partner_id,
              searchTerm
            );

            return matchesTitle || matchesDescription || matchesPartner
              ? job
              : null;
          })
        );

        filtered = searchResults.filter((result) => result !== null);
      }

      setFilteredJobs(filtered);
      setIsSearching(false);
    };

    // Debounce the filter operation
    const timeoutId = setTimeout(() => {
      filterJobs();
    }, 300); // Wait 300ms after last change before filtering

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    jobs,
    selectedStatus,
    selectedCategory,
    searchTerm,
    checkJobStatus,
    checkPartnerNameMatch,
  ]);

  // Handler for selecting status
  const handleStatusChange = React.useCallback((status) => {
    setSelectedStatus(status);
  }, []);

  // Handler for search input
  const handleSearchChange = React.useCallback((search) => {
    setSearchTerm(search);
  }, []);

  // Handler for selecting category
  const handleCategoryChange = React.useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-12 w-full min-h-[90vh]">
      {/* Loading Overlay */}
      {loading && (
        <div className="w-full min-h-[90vh] flex items-center justify-center z-50 bg-[#F8FAFC] backdrop-blur-md">
          <iframe
            src="https://lottie.host/embed/0e906fb1-4db8-4ee5-83a1-571bf2354be3/swOYAUc0eE.json"
            title="Loading Animation"
            className="w-24 h-24"
          ></iframe>
        </div>
      )}

      {/* <div className="w-full mt-6 mb-3"> 
        <CarouselHeader/>
      </div> */}

      {/* Content (Only renders after loading is complete) */}
      {!loading && (
        <>
          <SearchbarFilter
            onStatusChange={handleStatusChange}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* If there are no listings, show the banner outside the grid */}
          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center gap-3 lg:gap-5 mt-20">
              <BellAlertIcon className="w-[3.5rem] h-[3.5rem] lg:w-[5rem] lg:h-[5rem] text-[#2dc653]" />

              <div className="flex flex-col items-center gap-2 md:gap-3">
                <h1 className="text-2xl lg:text-[27px] leading-8 font-bold text-[#2aba4e] text-center">
                  It's Quiet Here—Time to Add a Hiring!
                </h1>
                <p className="text-base lg:text-[17px] leading-5 font-normal text-[#3E3E3E] text-center">
                Partner with us to hire top talent, showcase jobs, and grow your dream team!
                </p>
              </div>
            </div>
          )}
          

          {/* Listings Grid (only rendered when there are listings) */}
          {filteredJobs.length > 0 && (
            <div className="mt-6 grid gap-[2rem] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <SingleJob key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* <div className="mt-8 mb-9 md:mt-11 md:mb-7">
            <div className="flex flex-col items-center justify-center gap-1 px-2 md:px-7 mb-3">
              <h1 className="text-center text-[23px] lg:text-[28px] font-semibold text-[#151515]">
                Our Community Partners
              </h1>
              <p className="text-center text-sm lg:text-base font-normal text-[#646464]">
                Collaborating with like-minded partners to bring meaningful
                opportunities to the community we serve.
              </p>
            </div>
            <div className="w-full mx-auto max-w-screen">
              <CommunityPartners />
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPage />
    </Suspense>
  );
}
