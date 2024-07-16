import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

// Define your Redux state interface
interface RootState {
  admin: {
    currentAdmin: {
      // Define the structure of currentAdmin as per your actual data
      // For example, if currentAdmin has profilePicture and other fields
      profilePicture: string;
      // Add other fields as needed
    } | null; // currentAdmin could be null if admin is not authenticated
    // Add other admin-related state fields as needed
  };
  // Add other slices of your Redux state as needed
}

export default function AdminPrivateRoute() {
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  return currentAdmin ? <Outlet /> : <Navigate to='/admin-login' />;
}
