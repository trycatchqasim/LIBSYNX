

import { FaEdit, FaTrash } from "react-icons/fa";

const BookTable = ({ books, onRowDoubleClick }) => {
  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <table className="min-w-full divide-gray-200">
        <thead className="bg-[#E0D7C7]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
              Available
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
              Authors
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.length > 0 ? (
            books.map((book) => (
              <tr
                key={book.BookID}
                className="hover:bg-gray-50 cursor-pointer"
                onDoubleClick={() => onRowDoubleClick(book)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {book.Title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {book.CategoryName || "Unknown"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {book.PublishYear}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.AvailableCopies > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.AvailableCopies || 0} / {book.TotalCopies || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {book.Authors}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
