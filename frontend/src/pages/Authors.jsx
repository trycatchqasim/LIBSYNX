import { useState, useEffect } from "react";
import axios from "axios";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [authorForm, setAuthorForm] = useState({
    AuthorID: null,
    AuthorName: "",
    Biography: "",
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/author");
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorDetails = async (authorId) => {
    try {
      const [authorResponse, booksResponse] = await Promise.all([
        axios.get(`http://localhost:3000/api/author/${authorId}`),
        axios.get(`http://localhost:3000/api/author/${authorId}/books`),
      ]);

      setSelectedAuthor(authorResponse.data);
      setAuthorBooks(booksResponse.data);
    } catch (error) {
      console.error("Error fetching author details:", error);
    }
  };

  const handleSubmitAuthor = async (e) => {
    e.preventDefault();
    try {
      if (isEditingAuthor) {
        await axios.patch(
          `http://localhost:3000/api/author/UpdateAuthor/${authorForm.AuthorID}`,
          { AuthorName: authorForm.AuthorName, Biography: authorForm.Biography }
        );

        if (selectedAuthor?.AuthorID === authorForm.AuthorID) {
          fetchAuthorDetails(authorForm.AuthorID);
        }
      } else {
        await axios.post("http://localhost:3000/api/author/insert", {
          AuthorName: authorForm.AuthorName,
          Biography: authorForm.Biography,
        });
      }

      resetForm();
      fetchAuthors();
    } catch (error) {
      console.error(
        `Error ${isEditingAuthor ? "updating" : "adding"} author:`,
        error
      );
      alert(`Failed to ${isEditingAuthor ? "update" : "add"} author`);
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/author/delete/${authorId}`);

      if (selectedAuthor?.AuthorID === authorId) {
        setSelectedAuthor(null);
      }

      fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
      alert("Failed to delete author");
    }
  };

  const startEdit = (author) => {
    setAuthorForm({
      AuthorID: author.AuthorID,
      AuthorName: author.AuthorName,
      Biography: author.Biography || "",
    });
    setIsEditingAuthor(true);
    setIsAddingAuthor(false);
  };

  const startAdd = () => {
    resetForm();
    setIsAddingAuthor(true);
  };

  const resetForm = () => {
    setAuthorForm({ AuthorID: null, AuthorName: "", Biography: "" });
    setIsAddingAuthor(false);
    setIsEditingAuthor(false);
  };

  if (loading) {
    return <div className="p-4">Loading authors...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-[#211C1D]">Authors</h1>

      <button
        onClick={startAdd}
        className="mb-5 px-4 py-2 bg-[#56453E] text-white"
      >
        Add New Author
      </button>

      {(isAddingAuthor || isEditingAuthor) && (
        <div className="mb-5 p-4 border border-gray-300 bg-white">
          <h2 className="text-lg font-semibold mb-2">
            {isEditingAuthor ? "Edit Author" : "Add New Author"}
          </h2>
          <form onSubmit={handleSubmitAuthor}>
            <div className="mb-3">
              <label className="block mb-1">Author Name</label>
              <input
                type="text"
                value={authorForm.AuthorName}
                onChange={(e) =>
                  setAuthorForm({ ...authorForm, AuthorName: e.target.value })
                }
                className="p-2 border border-gray-300 w-full"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Biography</label>
              <textarea
                value={authorForm.Biography}
                onChange={(e) =>
                  setAuthorForm({ ...authorForm, Biography: e.target.value })
                }
                className="p-2 border border-gray-300 w-full h-24"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className={`px-4 py-2 text-white ${
                  isEditingAuthor ? "bg-green-600" : "bg-[#56453E]"
                }`}
              >
                {isEditingAuthor ? "Update Author" : "Add Author"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <div className="bg-white border border-gray-300">
          <table className="w-full border-collapse">
            <thead className="bg-[#E0D7C7]">
              <tr>
                <th
                  className="p-2 text-left border border-gray-300"
                  style={{ width: "40%" }}
                >
                  Author Name
                </th>
                <th
                  className="p-2 text-left border border-gray-300"
                  style={{ width: "30%" }}
                >
                  Books
                </th>
                <th
                  className="p-2 text-left border border-gray-300"
                  style={{ width: "30%" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {authors.length > 0 ? (
                authors.map((author) => (
                  <tr
                    key={author.AuthorID}
                    className="border-b border-gray-300"
                  >
                    <td
                      className="p-2 border border-gray-300 cursor-pointer hover:bg-gray-100"
                      onClick={() => fetchAuthorDetails(author.AuthorID)}
                    >
                      {author.AuthorName}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {author.BookCount || 0}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <button
                        onClick={() => startEdit(author)}
                        className="px-3 py-1 bg-[#56453E] text-white mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAuthor(author.AuthorID)}
                        className="px-3 py-1 bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No authors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAuthor && (
        <div className="bg-white p-4 border border-gray-300 mt-5">
          <h2 className="text-xl font-bold mb-3">
            {selectedAuthor.AuthorName}
          </h2>

          {selectedAuthor.Biography && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Biography</h3>
              <p className="text-gray-700">{selectedAuthor.Biography}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-1">Books</h3>
            {authorBooks?.Books?.length ? (
              <ul className="list-disc pl-5">
                {authorBooks.Books.map((book, index) => (
                  <li key={index} className="mb-1">
                    {book}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No books found for this author</p>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={() => startEdit(selectedAuthor)}
              className="px-3 py-1 bg-[#56453E] text-white"
            >
              Edit Author
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authors;
