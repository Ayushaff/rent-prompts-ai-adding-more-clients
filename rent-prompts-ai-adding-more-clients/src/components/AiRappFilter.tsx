import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/providers/User";

interface AiRappFilterProps {
  onFilterChange: (filter: string) => void;
  rappType: string;
}

const AiRappFilter = ({ onFilterChange, rappType }: AiRappFilterProps) => {
  const [activeFilter, setActiveFilter] = useState(rappType);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useUser();

  const filterOptions = ["all", "public", "private"];

if (user?.role === "member") {
  filterOptions.push("shared");
}

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    onFilterChange(value);
    setIsDropdownOpen(false); // Close dropdown after selecting an option
  };

  return (
    <div className="relative  flex flex-col items-center">
      <motion.div
        className="relative w-full sm:w-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Dropdown Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full sm:w-auto px-2 md:px-6 py-2  gap-1 rounded-lg text-sm font-medium border-white border text-white flex justify-between items-center"
          aria-label="Filter dropdown"
        >
          <span>
            {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Apps
          </span>
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.div>
        </button>

        {/* Dropdown Options */}
        {isDropdownOpen && (
          <motion.div
            className="absolute left-0 right-0 flex flex-col sm:right-auto w-full sm:left-0 bg-indigo-800 text-white rounded-lg shadow-2xl z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleFilterChange(option)}
                className={`w-full text-left pl-3 py-2 hover:bg-indigo-700 rounded-lg ${
                  activeFilter === option ? "bg-indigo-600" : ""
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)} Apps
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AiRappFilter;
