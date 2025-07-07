import { useState, useEffect } from "react";
import axios from "axios";

const AuthorFilter = ({ onAuthorChange, selectedAuthor }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/author");

        if (isMounted) {
          setAuthors(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAuthors();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthorChange = (e) => {
    const authorId = e.target.value ? parseInt(e.target.value, 10) : "";
    onAuthorChange(authorId);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Author
      </label>
      {loading ? (
        <div className="text-sm text-gray-500">Loading authors...</div>
      ) : (
        <select
          value={selectedAuthor || ""}
          onChange={handleAuthorChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1E2A0]"
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author.AuthorID} value={author.AuthorID}>
              {author.AuthorName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AuthorFilter;
