import React from "react";
import Select from "react-select";

// Options for the select field
const statusOptions = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const categoryOptions = [
  { value: "Development", label: "Development" },
  { value: "Content", label: "Content" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Management", label: "Management" },
  { value: "Others", label: "Others" },
];

const Searchbar_filter = ({ onStatusChange, onSearchChange, onCategoryChange }) => {
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Handler for selecting status
  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
    onStatusChange(selectedOption?.value || null);
  };

  // Handler for selecting category
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    onCategoryChange(selectedOption?.value || null);
  };

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

   // Handler for search button click
   const handleSearchButtonClick = () => {
    onSearchChange(searchTerm);
  };

   // Handle pressing Enter key in the search input
   const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearchChange(searchTerm);
    }
  };

  return (
    <div className="w-full mt-8">
      {/* Search Bar Container */}
      <div className="flex md:flex-row items-center gap-1 md:gap-2 rounded-lg">
        {/* Search Input (Visible on all screens) */}
        <div className="w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search by title, partner name, or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress} // Trigger search on Enter key press
            className="w-full border text-[#444444] border-gray-300 rounded-[6px] px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
        </div>

        {/* Category Dropdown (Hidden on mobile) */}
        <div className="hidden sm:block w-full sm:w-auto">
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Category"
            isClearable
            className="text-[#444444] border border-gray-300 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-green-400"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#e5e7eb", // Tailwind gray-300
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#34d399", // Tailwind green-400 on hover
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: "#444444",
              }),
            }}
          />
        </div>

        {/* Status Dropdown (Hidden on mobile) */}
        <div className="hidden sm:block w-full sm:w-auto">
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder="Status" // Placeholder text
            isClearable // Adds a clear option to reset the field
            className="text-[#444444] border border-gray-300 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-green-400"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#e5e7eb", // Tailwind gray-300
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#34d399", // Tailwind green-400 on hover
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: "#444444",
              }),
            }}
          />
        </div>

        {/* Search Button (Visible on all screens) */}
        <div className="w-auto">
          <button onClick={handleSearchButtonClick} className="flex items-center justify-center bg-green-500 text-white rounded-[6px] px-4 py-[10px] hover:bg-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="18px"
              className="fill-white"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Searchbar_filter;
