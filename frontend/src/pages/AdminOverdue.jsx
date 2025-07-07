import { useState, useEffect } from "react";
import axios from "axios";
import { MdWarning } from "react-icons/md";

const Overdues = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  const fetchOverdueBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/overdue"
      );
      console.log("Overdue books:", response.data);
      setOverdueBooks(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching overdue books:", err);
      setError("Failed to load overdue books");
    } finally {
      setLoading(false);
    }
  };

  // Calculate days overdue
  const calculateDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="p-4">Loading overdue books...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-5">
      <div className="flex items-center mb-5">
        <MdWarning className="text-red-500 text-2xl mr-2" />
        <h1 className="text-2xl font-bold text-[#211C1D]">Overdue Books</h1>
      </div>

      {overdueBooks.length === 0 ? (
        <div className="bg-green-100 p-4 rounded text-green-700">
          No overdue books! All borrowers have returned their books on time.
        </div>
      ) : (
        <div className="bg-white border border-gray-300">
          <table className="w-full border-collapse">
            <thead className="bg-[#E0D7C7]">
              <tr>
                <th className="p-2 text-left border border-gray-300">
                  Book Title
                </th>
                <th className="p-2 text-left border border-gray-300">
                  Borrower
                </th>
                <th className="p-2 text-left border border-gray-300">
                  Due Date
                </th>
                <th className="p-2 text-left border border-gray-300">
                  Days Overdue
                </th>
              </tr>
            </thead>
            <tbody>
              {overdueBooks.map((book) => {
                const daysOverdue = calculateDaysOverdue(book.DueDate);
                return (
                  <tr
                    key={book.BorrowingID}
                    className="border-b border-gray-300"
                  >
                    <td className="p-2 border border-gray-300">{book.Title}</td>
                    <td className="p-2 border border-gray-300">
                      {book.Username || book.UserName}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {new Date(book.DueDate).toLocaleDateString()}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          daysOverdue > 7
                            ? "bg-red-100 text-red-800"
                            : daysOverdue > 3
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {daysOverdue} days
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Overdues;
