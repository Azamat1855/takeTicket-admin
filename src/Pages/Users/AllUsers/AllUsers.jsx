import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../Contexts/ContextProvider";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => parseInt(localStorage.getItem("currentPage")) || 1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 10;
  const { currentColor } = useStateContext();
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) return setError("No access token found");
    
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_SERVER}users`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        
        const data = await response.json();
        setUsers(data.filter(user => Object.values(user).some(value => value && value !== "-")));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen font-semibold">
        Error: {error}
      </div>
    );

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">All Users</h2>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search users..."
          className="input input-bordered w-full max-w-md shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="table w-full border rounded-lg">
          <thead>
            <tr>
              {["#", "First Name", "Last Name", "Email", "Phone Number", "Birth Date", "Gender", "Country", "Role", "Address"].map((header, index) => (
                <th key={index} className="text-left p-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id || index}>
                <td className="p-3">{indexOfFirstUser + index + 1}</td>
                <td className="p-3">{user.firstName || "N/A"}</td>
                <td className="p-3">{user.lastName || "N/A"}</td>
                <td className="p-3">{user.email || "N/A"}</td>
                <td className="p-3">{user.phoneNumber || "N/A"}</td>
                <td className="p-3">{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "N/A"}</td>
                <td className="p-3">{user.gender || "N/A"}</td>
                <td className="p-3">{user.country || "N/A"}</td>
                <td className="p-3">{user.role || "N/A"}</td>
                <td className="p-3">{
                  user.address?.street || user.address?.city || user.address?.country
                    ? `${user.address?.street || "N/A"}, ${user.address?.city || "N/A"}, ${user.address?.country || "N/A"}`
                    : "N/A"
                }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6 space-x-2 p-4 rounded-lg sticky bottom-0">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            style={{ backgroundColor: currentPage === index + 1 ? currentColor : 'transparent', color: currentPage === index + 1 ? '#fff' : 'inherit' }}
            className={`btn ${currentPage === index + 1 ? 'text-white' : 'btn-outline border-gray-500 text-gray-500'} rounded-lg px-4 py-2`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
