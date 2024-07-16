import { useNavigate, useLocation } from "react-router-dom";
import { FormEvent, useState } from "react";

type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
};

const EditUser = () => {
  const location = useLocation();
  const { user } = location.state as { user: User };
  
  const [username, setUsername] = useState<string>(user ? user.username : "");
  const [email, setEmail] = useState<string>(user ? user.email : "");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_APP_BACKEND_ENV + `/api/admin/edit-user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
        credentials: 'include',  
      });
      const data = await response.json();
  
      if (data.success) {
        alert("User updated successfully!");
        navigate('/admin-dashboard');
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while updating the user.");
    }
  };
  

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <form className="border-2 border-solid p-6 rounded-md md:w-[40%]" onSubmit={handleSubmit}>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-center">Edit User</h1>
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="text-center">
          <button className="bg-gray-800 p-2 rounded text-white font-semibold w-32" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
