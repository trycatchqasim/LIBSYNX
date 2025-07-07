import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavBar";
import AdminSidebar from "../components/AdminSideBar";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#E0D7C7]">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
