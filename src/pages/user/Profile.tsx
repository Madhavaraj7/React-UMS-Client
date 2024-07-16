import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../../redux/user/userSlice";

interface User {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
}

interface RootState {
  user: {
    currentUser: User;
  };
}

function Profile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [image, setImage] = useState<File | null>(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (_error) => {
        setImageError(true);
        toast.error("Error uploading image (file size must be less than 2 MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: downloadURL,
          }))
        );
      }
    );
  };

  const handleFileClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(updateUserStart());
      const res = await fetch(import.meta.env.VITE_APP_BACKEND_ENV+ `/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!res.ok) {
        dispatch(updateUserFailure(data));
        toast.error(data.message || "Failed to update profile");
        return;
      }
  
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("Profile updated successfully");
    } catch (error) {
      setLoading(false);
      dispatch(updateUserFailure(error));
      toast.error("Error updating profile");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(import.meta.env.VITE_APP_BACKEND_ENV+ '/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="p-3 max-w-lg mx-auto mt-10">
      <ToastContainer />
      <h1 className="text-3xl font-semibold text-center my-7">PROFILE</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="Profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={handleFileClick}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-4">
        {/* <span className="text-red-700 cursor-pointer">Delete Account</span> */}
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      
    </div>
  );
}

export default Profile;
