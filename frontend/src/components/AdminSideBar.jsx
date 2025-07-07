import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdMenuBook,
  MdPerson,
  MdHistory,
  MdFolder,
  MdEdit,
  MdWarning,
  MdNotifications,
  MdLogout,
} from "react-icons/md";

const AdminSidebar = () => {
  return (
    <aside className="w-64 h-full bg-[#211C1D] text-white flex flex-col">
      <div className="p-4 border-b border-[#56453E] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#F1E2A0] rounded-full flex items-center justify-center">
            <span className="text-[#211C1D] text-lg font-bold">B</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">BookWorm</h1>
            <p className="text-xs opacity-70">Library</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <SidebarLink
            to="/admin/dashboard"
            icon={<MdDashboard />}
            label="Dashboard"
          />
          <SidebarLink to="/admin/books" icon={<MdMenuBook />} label="Books" />
          <SidebarLink to="/admin/users" icon={<MdPerson />} label="Users" />
          <SidebarLink
            to="/admin/borrowings"
            icon={<MdHistory />}
            label="Borrowings"
          />
          <SidebarLink
            to="/admin/categories"
            icon={<MdFolder />}
            label="Categories"
          />
          <SidebarLink to="/admin/authors" icon={<MdEdit />} label="Authors" />
          <SidebarLink
            to="/admin/overdues"
            icon={<MdWarning />}
            label="Overdues"
          />
          <SidebarLink
            to="/admin/notifications"
            icon={<MdNotifications />}
            label="Notifications"
          />
        </ul>
      </nav>

      <div className="p-4 border-t border-[#56453E]">
        <button className="flex items-center space-x-2 w-full px-4 py-2 rounded hover:bg-[#56453E] transition-colors">
          <MdLogout className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
            isActive ? "bg-[#56453E] text-[#F1E2A0]" : "hover:bg-[#56453E]"
          }`
        }
      >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default AdminSidebar;
