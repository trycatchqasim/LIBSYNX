import { useState, useEffect } from "react";
import axios from "axios";

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/borrowings"
      );
      console.log("Borrowings API Response:", response.data);

      const borrowingsData = response.data.borrowings;
      setBorrowings(borrowingsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching borrowings:", err);
      setError("Failed to load borrowings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading borrowings...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#211C1D]">Borrowings</h1>

      <table className="w-full bg-white border border-gray-200">
        <thead className="bg-[#E0D7C7]">
          <tr>
            <th className="p-2 text-left">Book</th>
            <th className="p-2 text-left">Author</th>
            <th className="p-2 text-left">Borrower</th>
            <th className="p-2 text-left">Borrow Date</th>
            <th className="p-2 text-left">Due Date</th>
            <th className="p-2 text-left">Return Date</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {borrowings.length > 0 ? (
            borrowings.map((borrowing) => (
              <tr
                key={borrowing.BorrowingID || borrowing.BorrowID}
                className="border-t border-gray-200"
              >
                <td className="p-2">
                  {borrowing.Title || borrowing.BookTitle}
                </td>
                <td className="p-2">
                  {borrowing.Author || borrowing.Authors || "Unknown"}
                </td>
                <td className="p-2">
                  {borrowing.Username || borrowing.UserName || "Unknown"}
                </td>
                <td className="p-2">
                  {borrowing.BorrowDate
                    ? new Date(borrowing.BorrowDate).toLocaleDateString()
                    : "Unknown"}
                </td>
                <td className="p-2">
                  {borrowing.DueDate
                    ? new Date(borrowing.DueDate).toLocaleDateString()
                    : "Unknown"}
                </td>
                <td className="p-2">
                  {borrowing.ReturnDate
                    ? new Date(borrowing.ReturnDate).toLocaleDateString()
                    : "Not returned"}
                </td>

                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      borrowing.Status === "Borrowed"
                        ? "bg-yellow-100 text-yellow-800"
                        : borrowing.Status === "Returned"
                        ? "bg-green-100 text-green-800"
                        : borrowing.Status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {borrowing.Status || "Unknown"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No borrowings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Borrowings;
