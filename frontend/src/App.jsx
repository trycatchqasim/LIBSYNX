import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import AdminLayout from "./pages/AdminPage";
import Dashboard from "./pages/AdminDashBoard";
import Books from "./pages/AdminBooks";
import Users from "./pages/AdminUser";
import Categories from "./pages/AdminCategory";
import Borrowings from "./pages/AdminBorrowings";
import Authors from "./pages/Authors";
import Overdues from "./pages/AdminOverdue";
import Notifications from "./pages/AdminNotification";

import Login from "./pages/forms/Login"
import LoginWithFetch from "./pages/forms/LoginWithFetch"
import Signup from "./pages/forms/Signup"
import { UserDashboard } from "./pages/userdashboard"
import { AuthProvider } from "./pages/context/AuthContext"
import ProtectedRoute from "./pages/ProtectedRoute"

import "./index.css"
import BookForm from "./pages/forms/BookForm";
import BookReviewForm from "./pages/forms/BookReviewForm";

// Admin-only route component
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole={1}>
      {children}
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Welcome Page */}
          <Route path="/" element={<WelcomePage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin routes (Protected) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="borrowings" element={<Borrowings />} />
            <Route path="authors" element={<Authors />} />
            <Route path="overdues" element={<Overdues />} />
            <Route path="notifications" element={<Notifications />} />
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* User dashboard route */}
          <Route
            path="/user/dashboard/:userId"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function App2()
{
return (

<BookReviewForm></BookReviewForm>

);

};

export default App;