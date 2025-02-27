"use client";
import React from "react";
import SearchbarFilter from "@/components/level_two_layout/searchbar_filter.jsx";
import SingleListing from "@/components/listings/single_listing.jsx";
import { BellAlertIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filteredListings, setFilteredListings] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  // Fetch listings only once when component mounts
  React.useEffect(() => {
    fetchListings();
  }, []);

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
      const fetchedListings = data.listings || [];
      // show all listings since middleware handles admin access
      setListings(fetchedListings);
      setFilteredListings(fetchedListings);
    } catch (error) {
      console.error("Error fetching listing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkListingStatus = React.useCallback((listing) => {
    if (!listing.end_date) return "active";
    const currentDate = new Date();
    const endDate = new Date(listing.end_date);
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return currentDate > endDate ? "completed" : "active";
  }, []);

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

  React.useEffect(() => {
    const filterListings = async () => {
      if (isSearching) return;

      setIsSearching(true);
      let filtered = [...listings];

      if (selectedStatus) {
        filtered = filtered.filter((listing) => {
          const listingStatus = checkListingStatus(listing);
          return listingStatus === selectedStatus;
        });
      }

      if (selectedCategory) {
        filtered = filtered.filter(
          (listing) => listing.categories === selectedCategory
        );
      }

      if (searchTerm) {
        const searchResults = await Promise.all(
          filtered.map(async (listing) => {
            const matchesTitle = listing.title
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesDescription = listing.short_description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesPartner = await checkPartnerNameMatch(
              listing.partner_id,
              searchTerm
            );

            return matchesTitle || matchesDescription || matchesPartner
              ? listing
              : null;
          })
        );

        filtered = searchResults.filter((result) => result !== null);
      }

      setFilteredListings(filtered);
      setIsSearching(false);
    };

    const timeoutId = setTimeout(() => {
      filterListings();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    listings,
    selectedStatus,
    selectedCategory,
    searchTerm,
    checkListingStatus,
    checkPartnerNameMatch,
  ]);

  const handleStatusChange = React.useCallback((status) => {
    setSelectedStatus(status);
  }, []);

  const handleSearchChange = React.useCallback((search) => {
    setSearchTerm(search);
  }, []);

  const handleCategoryChange = React.useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-12 w-full min-h-[90vh]">
      {loading && (
        <div className="w-full min-h-[90vh] flex items-center justify-center z-50 bg-[#F8FAFC] backdrop-blur-md">
          <iframe
            src="https://lottie.host/embed/0e906fb1-4db8-4ee5-83a1-571bf2354be3/swOYAUc0eE.json"
            title="Loading Animation"
            className="w-24 h-24"
          ></iframe>
        </div>
      )}

      {!loading && (
        <>
          <div className="space-y-1 mt-6">
            <p className="text-gray-900 text-lg md:text-xl font-semibold">Admin Hub - Streamline Operations, Monitor, and Control Seamlessly!</p>
            <p className="hidden md:block text-[#3b3d4e] text-base font-medium">Stay in control with real-time insights, seamless management, and powerful tools for effortless administration.</p>
          </div>

          <SearchbarFilter
            onStatusChange={handleStatusChange}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />

          {filteredListings.length === 0 && (
            <div className="flex flex-col items-center gap-3 lg:gap-5 mt-20">
              <BellAlertIcon className="w-[3.5rem] h-[3.5rem] lg:w-[5rem] lg:h-[5rem] text-[#2dc653]" />
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <h1 className="text-2xl lg:text-[27px] leading-8 font-bold text-[#2aba4e] text-center">
                  No Bounties Found
                </h1>
                <p className="text-base lg:text-[17px] leading-5 font-normal text-[#3E3E3E] text-center">
                  No bounties match your current filters.
                </p>
              </div>
            </div>
          )}

          {filteredListings.length > 0 && (
            <div className="mt-6 grid gap-[2rem] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <SingleListing 
                  key={listing.id} 
                  listing={listing}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}