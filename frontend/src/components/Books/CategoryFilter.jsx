import { useState, useEffect } from "react";
import axios from "axios";

const CategoryFilter = ({ onCategoryChange, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/category");

        if (isMounted) {
          setCategories(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Category
      </label>
      {loading ? (
        <div className="text-sm text-gray-500">Loading categories...</div>
      ) : (
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1E2A0]"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategoryFilter;
