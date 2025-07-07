import { useState, useEffect } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/category");
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await axios.post("http://localhost:3000/api/category/insert", {
        CategoryName: newCategoryName,
      });
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:3000/api/category/delete/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  const startEditing = (category) => {
    setEditingId(category.CategoryID);
    setEditName(category.CategoryName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/category/update/${editingId}`,
        {
          CategoryName: editName,
        }
      );
      setEditingId(null);
      setEditName("");
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert(
        "Failed to update category. The update endpoint might not be implemented."
      );
    }
  };

  if (loading) {
    return <div className="p-4">Loading categories...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-[#211C1D]">Categories</h1>

      <div className="mb-5 p-4 border border-gray-300 bg-white">
        <h2 className="text-lg font-semibold mb-2">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="flex">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            className="p-2 border border-gray-300 flex-grow mr-2"
            required
          />
          <button type="submit" className="px-4 py-2 bg-[#56453E] text-white">
            Add Category
          </button>
        </form>
      </div>

      <table className="w-full border-collapse bg-white">
        <thead className="bg-[#E0D7C7]">
          <tr>
            <th className="p-2 text-left border border-gray-300">ID</th>
            <th className="p-2 text-left border border-gray-300">
              Category Name
            </th>
            <th className="p-2 text-left border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr
                key={category.CategoryID}
                className="border-b border-gray-300"
              >
                <td className="p-2 border border-gray-300">
                  {category.CategoryID}
                </td>

                <td className="p-2 border border-gray-300">
                  {editingId === category.CategoryID ? (
                    <form onSubmit={handleUpdateCategory} className="flex">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="p-1 border border-gray-300 flex-grow"
                        required
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 bg-green-600 text-white mr-1"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-2 py-1 bg-gray-500 text-white"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    category.CategoryName
                  )}
                </td>

                <td className="p-2 border border-gray-300">
                  {editingId === category.CategoryID ? null : (
                    <div>
                      <button
                        onClick={() => startEditing(category)}
                        className="px-3 py-1 bg-[#56453E] text-white mr-2"
                      >
                        Edit Name
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCategory(category.CategoryID)
                        }
                        className="px-3 py-1 bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
