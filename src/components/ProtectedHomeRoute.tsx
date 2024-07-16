import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


interface RootState {
    user: {
      currentUser: {
        
        profilePicture: string;
      } | null; // currentUser could be null if user is not authenticated
      // Add other user-related state fields as needed
    };
    // Add other slices of your Redux state as needed
  }

const ProtectedHomeRoute = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);

  return currentUser ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedHomeRoute;
