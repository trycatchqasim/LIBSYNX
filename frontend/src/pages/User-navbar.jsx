import { MdPerson } from "react-icons/md"

export function UserNavbar({ userData }) {
  const user = userData || {
    FirstName: "User",
    LastName: "",
    RoleName: "Member",
  }

  const getCurrentDate = () => {
    return new Date().toDateString()
  }

  return (
    <nav className="flex items-center justify-between bg-gray-50 p-4 shadow rounded-b mb-4">
      <div className="flex items-center space-x-3">
        <MdPerson size={28} className="text-gray-600" />
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {user.FirstName} {user.LastName}
          </div>
          <div className="text-sm text-gray-500">{user.RoleName || "Member"}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-base font-medium text-gray-700">{getCurrentDate()}</div>
      </div>
    </nav>
  )
}
