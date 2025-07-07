import { useState, useEffect } from "react";
import axios from "axios";

const BookFormModal = ({ show, book, isEdit, onClose, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Title: "",
    CategoryID: "",
    PublishYear: "",
    TotalCopies: "",
    Description: "",
    originalTotalCopies: 0,
  });

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  useEffect(() => {
    if (book && isEdit) {
      setFormData({
        Title: book.Title || "",
        CategoryID: book.CategoryID || "",
        PublishYear: book.PublishYear || "",
        TotalCopies: book.TotalCopies || book.AvailableCopies || "",
        Description: book.Description || "",
        originalTotalCopies: book.TotalCopies || 0,
      });
    } else if (!isEdit) {
      resetForm();
    }
  }, [book, isEdit, show]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, authorsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/category"),
        // Only fetch authors if we're not in edit mode
        !isEdit
          ? axios.get("http://localhost:3000/api/author")
          : Promise.resolve({ data: [] }),
      ]);

      setCategories(categoriesRes.data);
      if (!isEdit) {
        setAuthors(authorsRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Title: "",
      CategoryID: "",
      PublishYear: "",
      TotalCopies: "",
      Description: "",
      originalTotalCopies: 0,
    });
    setSelectedAuthors([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAuthorSelect = (e) => {
    const authorId = parseInt(e.target.value, 10);
    if (authorId && !selectedAuthors.includes(authorId)) {
      setSelectedAuthors([...selectedAuthors, authorId]);
    }
  };

  const removeAuthor = (authorId) => {
    setSelectedAuthors(selectedAuthors.filter((id) => id !== authorId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First, handle the book update/creation
      const bookData = {
        ...formData,
        CategoryID: parseInt(formData.CategoryID, 10),
        PublishYear: parseInt(formData.PublishYear, 10),
        TotalCopies: parseInt(formData.TotalCopies, 10),
        originalTotalCopies: parseInt(formData.originalTotalCopies, 10),
      };

      const bookResponse = await onSubmit(bookData);

      // Only handle author assignments for new books
      if (!isEdit && bookResponse?.BookID) {
        // For new books, add all selected authors
        for (const authorId of selectedAuthors) {
          await axios.post(
            "http://localhost:3000/api/books/insert/AuthorToBook",
            {
              AuthorID: authorId,
              BookID: bookResponse.BookID,
            }
          );
        }
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-[#211C1D]">
          {isEdit ? "Edit Book" : "Add New Book"}
        </h2>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="Title"
                value={formData.Title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="CategoryID"
                value={formData.CategoryID}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.CategoryID} value={category.CategoryID}>
                    {category.CategoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Year
              </label>
              <input
                type="number"
                name="PublishYear"
                value={formData.PublishYear}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Copies
              </label>
              <input
                type="number"
                name="TotalCopies"
                value={formData.TotalCopies}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              ></textarea>
            </div>

            {/* Only show author assignment for new books, not during editing */}
            {!isEdit && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Authors
                </label>
                <select
                  onChange={handleAuthorSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value=""
                >
                  <option value="">Select authors to assign</option>
                  {authors.map((author) => (
                    <option key={author.AuthorID} value={author.AuthorID}>
                      {author.AuthorName}
                    </option>
                  ))}
                </select>

                {selectedAuthors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Selected Authors:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAuthors.map((authorId) => {
                        const author = authors.find(
                          (a) => a.AuthorID === authorId
                        );
                        return author ? (
                          <div
                            key={author.AuthorID}
                            className="bg-[#E0D7C7] px-2 py-1 rounded-md flex items-center"
                          >
                            <span className="text-sm">{author.AuthorName}</span>
                            <button
                              type="button"
                              onClick={() => removeAuthor(author.AuthorID)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#56453E] text-white rounded-md hover:bg-opacity-90"
              >
                {isEdit ? "Update Book" : "Add Book"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookFormModal;
