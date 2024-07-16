import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // Send user data to your backend API
      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();

      dispatch(signInSuccess(data));

      // Navigate to the home page after successful sign-in
      navigate("/"); // Replace "/" with your desired home page route
    } catch (error) {
      console.error("Could not sign in with Google:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-lg py-2 px-4 uppercase hover:opacity-95 focus:outline-none transition duration-300 shadow-md"
      style={{ maxWidth: "550px", width: "100%" }}
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
