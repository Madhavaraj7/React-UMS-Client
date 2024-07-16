import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

// Define your Redux state interface
interface RootState {
  user: {
    currentUser: {
      profilePicture: string;
      // Add other fields as needed
    } | null; // currentUser could be null if user is not authenticated
  };
  // Add other slices of your Redux state as needed
}

export default function PrivateRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (currentUser && location.pathname === '/login') {
    return <Navigate to='/' />;
  }

  return currentUser ? <Outlet /> : <Navigate to='/login' />;
}
