import React, { useState, useEffect } from 'react';
import { useStateContext } from '../../../Contexts/ContextProvider';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Customers = () => {
  const { currentColor, currentMode } = useStateContext();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const token = localStorage.getItem("token")
  console.log(token)
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("action", "getUsers");
    try {
      const response = await fetch("https://api.taketicket.uz/api/v1/users", {
        method: "POST",
        headers: {
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTBiMmUwZDU0YTBlYjFjNjlkZjYwNiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3Mzg0MDQ0NTIsImV4cCI6MTczOTAwOTI1Mn0.cncDa6SlJo9EQApmjyAahzHTay37rdoZJz735bO45Mc`,
        },
        body: formData,
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Ошибка: API не вернул массив пользователей");
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter((user) =>
      user._id.toLowerCase().includes(value) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.phoneNumber.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getTextColor = () => (currentMode === 'dark' ? 'text-base-200' : 'text-base-content');
  const safeFilteredUsers = Array.isArray(filteredUsers) ? filteredUsers : [];
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = safeFilteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(safeFilteredUsers.length / usersPerPage);

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-4 ${getTextColor()}`} style={{ color: currentColor }}>
        Список пользователей
      </h2>

      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered w-full py-2 px-4 rounded-lg bg-base-300 text-black"
          placeholder="Поиск"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto bg-base-100 shadow-md rounded-lg p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black"></div>
          </div>
        ) : (
          <table className="table-auto w-full text-left">
            <thead className="bg-base-100">
              <tr>
                {['ID', 'Имя', 'Email', 'Телефон', 'Роль'].map((header, index) => (
                  <th key={index} className="py-3 px-6 text-sm font-medium text-base-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-neutral-content cursor-pointer border-b border-base-300"
                  onClick={() => handleUserClick(user)}
                >
                  <td className={`py-3 px-6 text-sm ${getTextColor()}`}>{user._id}</td>
                  <td className={`py-3 px-6 text-sm ${getTextColor()}`}>{user.firstName} {user.lastName}</td>
                  <td className={`py-3 px-6 text-sm ${getTextColor()}`}>{user.email}</td>
                  <td className={`py-3 px-6 text-sm ${getTextColor()}`}>{user.phoneNumber}</td>
                  <td className={`py-3 px-6 text-sm ${getTextColor()}`}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Customers;
