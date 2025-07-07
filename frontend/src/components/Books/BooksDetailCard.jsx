import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const BookDetailsCard = ({ book, show, onClose, onEdit, onDelete }) => {

  if (!show || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
         
          <div className="w-full md:w-1/3 bg-[#E0D7C7] rounded-md flex items-center justify-center h-48 md:h-auto">
            <span className="text-4xl text-[#56453E]">📚</span>
          </div>

        
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-[#211C1D] mb-2">
              {book.Title}
            </h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{book.CategoryName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="font-medium">{book.PublishYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Copies</p>
                <p className="font-medium">
                  <span
                    className={
                      book.AvailableCopies > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {book.AvailableCopies}
                  </span>{" "}
                  / {book.TotalCopies}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Book ID</p>
                <p className="font-medium">{book.BookID}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Authors</p>
              <p className="font-medium">{book.Authors}</p>
            </div>

            {book.Description && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm mt-1">{book.Description}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onEdit(book)}
                className="flex items-center gap-1 px-4 py-2 bg-[#56453E] text-white rounded-md hover:bg-opacity-90"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this book?")
                  ) {
                    onDelete(book.BookID);
                    onClose();
                  }
                }}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-opacity-90"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsCard;
