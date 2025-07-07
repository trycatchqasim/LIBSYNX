import { useState, useEffect } from "react";
import axios from "axios";
import { FaBook, FaUsers, FaExchangeAlt, FaClock } from "react-icons/fa";
import StatCard from "../components/StatCard.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrowings: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const booksResponse = await axios.get(
          "http://localhost:3000/api/books"
        );
        console.log(booksResponse);
        const totalBooks = booksResponse.data.length;

        const usersResponse = await axios.get(
          "http://localhost:3000/api/users"
        );
        console.log(usersResponse);
        const totalUsers = usersResponse.data.length;

        const borrowingsResponse = await axios.get(
          "http://localhost:3000/api/admin/borrowings"
        );
        console.log(borrowingsResponse);
        const { borrowings = [] } = borrowingsResponse.data;

        const activeBorrowings = borrowings.filter((b) => !b.ReturnDate).length;

        const overdueResponse = await axios.get(
          "http://localhost:3000/api/admin/overdue"
        );
        const overdue = overdueResponse.data.length;

        setStats({
          totalBooks,
          totalUsers,
          activeBorrowings,
          overdue,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100  text-red-700 p-4 rounded-lg">{error}</div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl m-auto font-bold text-gray-800">
          Library Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<FaBook size={32} />}
          color="bg-blue-100 text-blue-600"
          subtitle="Library collection"
        />
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          icon={<FaUsers size={32} />}
          color="bg-green-100 text-green-600"
          subtitle="Active members"
        />
        <StatCard
          title="Active Borrowings"
          value={stats.activeBorrowings}
          icon={<FaExchangeAlt size={32} />}
          color="bg-purple-100 text-purple-600"
          subtitle="Currently checked out"
        />
        <StatCard
          title="Overdue Returns"
          value={stats.overdue}
          icon={<FaClock size={32} />}
          color="bg-red-100 text-red-600"
          subtitle="Require attention"
        />
      </div>
    </div>
  );
};

export default Dashboard;
