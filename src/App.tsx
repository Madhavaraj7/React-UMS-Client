import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Profile from "./pages/user/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRouter";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/adminDashboad";
import AdminPrivateRoute from "./components/ProtectedAdminRoute";
import AddUser from "./pages/admin/Adduser";
import EditUser from "./pages/admin/EditUser";
import { useSelector } from 'react-redux';
import { RootState } from "./redux/store";

function App() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentAdmin} = useSelector((state: RootState) => state.admin);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={currentUser ? <Navigate to="/home" /> : <Login />} />
        <Route path="/sign-up" element={currentUser ? <Navigate to="/home" /> : <Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin-login" element={currentAdmin ? <Navigate to="/admin-dashboard" /> : <AdminLogin />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-user" element={<AddUser />} />
          <Route path="/admin/edit-user/:id" element={<EditUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
