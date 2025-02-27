import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.taketicket.uz/api/v1/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
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

  const safeFilteredUsers = Array.isArray(filteredUsers) ? filteredUsers : [];
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = safeFilteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(safeFilteredUsers.length / usersPerPage);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Список пользователей</h2>

      <input
        type="text"
        className="input input-bordered w-full py-2 px-4 rounded-lg bg-gray-200 text-gray-900 mb-4"
        placeholder="Поиск пользователей..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-900"></div>
          </div>
        ) : (
          <table className="table w-full rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-300 text-gray-900">
                {['ID', 'Имя', 'Email', 'Телефон', 'Роль'].map((header, index) => (
                  <th key={index} className="py-3 px-6 text-sm font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-300 cursor-pointer border-b border-gray-400">
                  <td className="py-3 px-6 text-sm text-gray-900">{user._id}</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.email}</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.phoneNumber}</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="btn btn-sm bg-gray-300 text-gray-900 mx-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        <span className="text-gray-900 px-4">{currentPage} / {totalPages}</span>
        <button
          className="btn btn-sm bg-gray-300 text-gray-900 mx-2"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Customers;
