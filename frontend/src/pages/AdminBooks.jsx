import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import BookTable from "../components/Books/BookTable";
import BookSearch from "../components/Books/BookSearch";
import BookFormModal from "../components/Books/BookFormModal";
import CategoryFilter from "../components/Books/CategoryFilter";
import AuthorFilter from "../components/Books/AuthorFilter";
import BookDetailsCard from "../components/Books/BooksDetailCard";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [modalState, setModalState] = useState({
    showAdd: false,
    showEdit: false,
    showDetails: false,
  });
  const [currentBook, setCurrentBook] = useState(null);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedAuthor, allBooks]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/books");

      const uniqueBooks = Array.from(
        new Map(response.data.map((book) => [book.BookID, book])).values()
      );

      setAllBooks(uniqueBooks);
      setBooks(uniqueBooks);
      setError(null);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/author");
      setAuthors(response.data);
    } catch (err) {
      console.error("Error fetching authors:", err);
    }
  };

  const getAuthorNameById = (id) => {
    const author = authors.find((author) => author.AuthorID === id);
    return author ? author.AuthorName : null;
  };

  const applyFilters = () => {
    let filtered = [...allBooks];

    if (searchTerm) {
      filtered = filtered.filter((book) =>
        book.Title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (book) => book.CategoryID?.toString() === selectedCategory.toString()
      );
    }

    if (selectedAuthor) {
      const authorName = getAuthorNameById(selectedAuthor);
      if (authorName) {
        filtered = filtered.filter((book) => {
          if (!book.Authors) return false;

          return book.Authors.toLowerCase().includes(authorName.toLowerCase());
        });
      }
    }

    setBooks(filtered);
  };

  const closeAllModals = () => {
    setModalState({
      showAdd: false,
      showEdit: false,
      showDetails: false,
    });
    setCurrentBook(null);
  };

  const openModal = (modalType, book = null) => {
    setModalState({
      showAdd: modalType === "add",
      showEdit: modalType === "edit",
      showDetails: modalType === "details",
    });

    if (modalType === "add") {
      setCurrentBook(null);
    } else if (book) {
      setCurrentBook(book);
    }
  };

  const handleAddBook = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/books/insert/book",
        formData
      );
      closeAllModals();
      fetchBooks();
      return response.data.data && response.data.data[0];
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. Please try again.");
    }
  };

  const handleEditBook = async (formData) => {
    try {
      const originalTotal = parseInt(formData.originalTotalCopies, 10) || 0;
      const newTotal = parseInt(formData.TotalCopies, 10) || 0;
      const copyDifference = newTotal - originalTotal;

      const processedData = {
        Title: formData.Title,
        CategoryID: parseInt(formData.CategoryID, 10),
        PublishYear: parseInt(formData.PublishYear, 10),
        TotalCopies: newTotal,
        copyDifference,
        Description: formData.Description || "",
      };

      await axios.patch(
        `http://localhost:3000/api/books/BookDetails/${currentBook.BookID}`,
        processedData
      );

      closeAllModals();
      fetchBooks();
      return currentBook;
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Failed to update book. Please try again.");
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/books/delete/book/${bookId}`
      );
      closeAllModals();
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete book. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#211C1D]">Books</h1>
        <div className="text-center py-8">Loading books data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#211C1D]">Books</h1>
        <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#211C1D]">Books</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-[#56453E] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add New Book
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <BookSearch
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        <div className="w-full md:w-1/4">
          <AuthorFilter
            selectedAuthor={selectedAuthor}
            onAuthorChange={setSelectedAuthor}
          />
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          No books match your filter criteria
        </div>
      ) : (
        <BookTable
          books={books}
          onRowDoubleClick={(book) => openModal("details", book)}
        />
      )}

      <BookFormModal
        show={modalState.showAdd}
        isEdit={false}
        onClose={closeAllModals}
        onSubmit={handleAddBook}
      />

      <BookFormModal
        show={modalState.showEdit}
        book={currentBook}
        isEdit={true}
        onClose={closeAllModals}
        onSubmit={handleEditBook}
      />

      <BookDetailsCard
        book={currentBook}
        show={modalState.showDetails}
        onClose={closeAllModals}
        onEdit={(book) => openModal("edit", book)}
        onDelete={handleDeleteBook}
      />
    </div>
  );
};

export default Books;
