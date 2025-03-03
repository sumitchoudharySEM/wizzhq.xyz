"use client";
import React from "react";
import SearchbarFilter from "@/components/level_two_layout/searchbar_filter.jsx";
import SingleListing from "@/components/listings/single_listing";
import SingleJob from "@/components/jobs/single_job";
import Ctapartner from "@/components/level_two_layout/cta_partner";
import CommunityPartners from "@/components/level_two_layout/community_partners";
import { useSession } from "next-auth/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [listings, setListings] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = React.useState(true);
  const [filteredListings, setFilteredListings] = React.useState([]);
  const [filteredJobs, setFilteredJobs] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bounties`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      // Check if session exists and user is logged in
      if (session?.user?.id) {
        // Filter listings to only show those created by the current user
        const userListings = data.listings.filter(
          (listing) => listing.creator_id === session.user.id
        );
        setListings(userListings);
        setFilteredListings(userListings);
      } else {
        // If no user is logged in, set empty array
        setListings([]);
        setFilteredListings([]);
      }
    } catch (error) {
      console.error("Error fetching listing data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  React.useEffect(() => {
    fetchListings();
    fetchJobs();
  }, [session]); // Add session as dependency to refetch when auth state changes

  // Check the status of a listing whether it is active or completed
  const checkListingStatus = React.useCallback((listing) => {
    if (!listing.end_date) return "active";
    const currentDate = new Date();
    const endDate = new Date(listing.end_date);
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return currentDate > endDate ? "completed" : "active";
  }, []);

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

  // Filter listings based on selected status, category, and search term
  // React.useEffect(() => {
  //   const filterListings = async () => {
  //     if (isSearching) return; // Prevent multiple simultaneous searches

  //     setIsSearching(true);
  //     let filtered = [...listings];

  //     // Filter by status
  //     if (selectedStatus) {
  //       filtered = filtered.filter((listing) => {
  //         const listingStatus = checkListingStatus(listing);
  //         return listingStatus === selectedStatus;
  //       });
  //     }

  //     // Filter by category
  //     if (selectedCategory) {
  //       filtered = filtered.filter(
  //         (listing) => listing.categories === selectedCategory
  //       );
  //     }

  //     // Filter by search term
  //     if (searchTerm) {
  //       const searchResults = await Promise.all(
  //         filtered.map(async (listing) => {
  //           const matchesTitle = listing.title
  //             ?.toLowerCase()
  //             .includes(searchTerm.toLowerCase());
  //           const matchesDescription = listing.short_description
  //             ?.toLowerCase()
  //             .includes(searchTerm.toLowerCase());
  //           const matchesPartner = await checkPartnerNameMatch(
  //             listing.partner_id,
  //             searchTerm
  //           );

  //           return matchesTitle || matchesDescription || matchesPartner
  //             ? listing
  //             : null;
  //         })
  //       );

  //       filtered = searchResults.filter((result) => result !== null);
  //     }

  //     setFilteredListings(filtered);
  //     setIsSearching(false);
  //   };
    
  //   // Debounce the filter operation
  //   const timeoutId = setTimeout(() => {
  //     filterListings();
  //   }, 300); // Wait 300ms after last change before filtering

  //   // Cleanup function
  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [
  //   listings,
  //   selectedStatus,
  //   selectedCategory,
  //   searchTerm,
  //   checkListingStatus,
  //   checkPartnerNameMatch,
  // ]);

  React.useEffect(() => {
    const filterItems = async () => {
      if (isSearching) return;

      setIsSearching(true);
      let newFilteredListings = [...listings];
      let newFilteredJobs = [...jobs];

      // Apply status filter
      if (selectedStatus) {
        newFilteredListings = newFilteredListings.filter(
          listing => checkListingStatus(listing) === selectedStatus
        );
        newFilteredJobs = newFilteredJobs.filter(
          job => checkJobStatus(job) === selectedStatus
        );
      }

      // Apply category filter
      if (selectedCategory) {
        newFilteredListings = newFilteredListings.filter(
          listing => listing.categories === selectedCategory
        );
        newFilteredJobs = newFilteredJobs.filter(
          job => job.categories === selectedCategory
        );
      }

      // Apply search filter
      if (searchTerm) {
        const filteredListingsPromises = newFilteredListings.map(async (listing) => {
          const matchesTitle = listing.title?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesDescription = listing.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesPartner = await checkPartnerNameMatch(listing.partner_id, searchTerm);
          return matchesTitle || matchesDescription || matchesPartner ? listing : null;
        });

        const filteredJobsPromises = newFilteredJobs.map(async (job) => {
          const matchesTitle = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesDescription = job.description?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesPartner = await checkPartnerNameMatch(job.partner_id, searchTerm);
          return matchesTitle || matchesDescription || matchesPartner ? job : null;
        });

        const [filteredListingsResults, filteredJobsResults] = await Promise.all([
          Promise.all(filteredListingsPromises),
          Promise.all(filteredJobsPromises)
        ]);

        newFilteredListings = filteredListingsResults.filter(Boolean);
        newFilteredJobs = filteredJobsResults.filter(Boolean);
      }

      setFilteredListings(newFilteredListings);
      setFilteredJobs(newFilteredJobs);
      setIsSearching(false);
    };

    const timeoutId = setTimeout(() => {
      filterItems();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [listings, jobs, selectedStatus, selectedCategory, searchTerm, isSearching, checkListingStatus, checkJobStatus, checkPartnerNameMatch]);

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
    <div className="mt-6 mb-5">
      {/* Loading Overlay */}
      {/* {loading && (
        <div className="w-full min-h-[90vh] flex items-center justify-center z-50 bg-[#F8FAFC] backdrop-blur-md">
          <iframe
            src="https://lottie.host/embed/0e906fb1-4db8-4ee5-83a1-571bf2354be3/swOYAUc0eE.json"
            title="Loading Animation"
            className="w-24 h-24"
          ></iframe>
        </div>
      )} */}

      {/* {!loading && ( */}
        <>
          <div className="mb-5">
            <Ctapartner />
          </div>

          {/* Search bar with category and status dropdown */}
          <SearchbarFilter
            onStatusChange={handleStatusChange}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* Show alert if no listings and no jobs after filtering */}
          {(!filteredListings.length && !filteredJobs.length) ? (
            <div className="flex flex-col items-center gap-3 lg:gap-5 mt-20">
              <BellAlertIcon className="w-[3.5rem] h-[3.5rem] lg:w-[5rem] lg:h-[5rem] text-[#2dc653]" />
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <h1 className="text-2xl lg:text-[27px] leading-8 font-bold text-[#2aba4e] text-center">
                  It's Quiet Here—Time to Add a Bounty or Hire new Talen!
                </h1>
                <p className="text-base lg:text-[17px] leading-5 font-normal text-[#3E3E3E] text-center">
                  Create your first bounty or initiate a hiring to engage with the community.
                </p>
              </div>
            </div>
          ) : (
            <>
            {filteredListings.length > 0 && (
            <div className="my-6 grid gap-[2rem] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <SingleListing key={listing.id} listing={listing} />
              ))}
            </div>
            )}

            {filteredJobs.length > 0 && (
            <div className="my-6 grid gap-[2rem] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <SingleJob key={job.id} job={job} />
              ))}
            </div>
            )}
            </>
          )}

          <div className="mt-8 mb-9 md:mt-11 md:mb-7">
            <div className="flex flex-col items-center justify-center gap-1 px-2 md:px-7 mb-3">
              <h1 className="text-center text-[23px] lg:text-[28px] font-semibold text-[#151515]">
                Our Valued Partners
              </h1>
              <p className="text-center text-sm lg:text-base font-normal text-[#646464]">
                Collaborating with like-minded partners to bring meaningful,
                positive change to the communities we serve.
              </p>
            </div>
            <div className="w-full mx-auto max-w-screen">
              <CommunityPartners />
            </div>
          </div>
        </>
      {/* )} */}
    </div>
  );
}