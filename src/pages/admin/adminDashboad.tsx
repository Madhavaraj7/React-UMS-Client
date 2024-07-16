import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const getAllUsers = useCallback(async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_BACKEND_ENV+ `/api/admin/get-users`,{
       credentials: "include"
      });
      if (!response.ok) {
    
        throw new Error("Failed to fetch users");
        
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(import.meta.env.VITE_APP_BACKEND_ENV + `/api/admin/delete-user/${userId}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUsers(users.filter(user => user._id !== userId));
        toast.success("User deleted successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/admin/edit-user/${user._id}`, { state: { user } });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      <ToastContainer />
      <div className="flex flex-col items-center mt-15">
        <div className="relative overflow-x-auto w-[80%] bg-white shadow-md rounded-lg p-6 mt-4">
          <div className="flex justify-between items-center my-4">
            <h1 className="text-3xl font-bold text-gray-800">Users List</h1>
            <button
              onClick={() => navigate("/admin/add-user")}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              Add User
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by username or email"
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Profile Picture</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 flex space-x-3">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 p-2 text-white rounded flex items-center"
                      onClick={() => handleEdit(user)}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 p-2 text-white rounded flex items-center"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
