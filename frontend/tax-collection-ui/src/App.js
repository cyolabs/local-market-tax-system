import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MainLayout from "./components/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
