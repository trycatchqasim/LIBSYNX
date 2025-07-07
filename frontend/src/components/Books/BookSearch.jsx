import { FaSearch } from "react-icons/fa";

const BookSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-6 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search books by title..."
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#F1E2A0]"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default BookSearch;
