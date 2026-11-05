import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LawyerProfileSetup from "./pages/LawyerProfileSetup";
import Home from "./pages/Home";
import FindLawyers from "./pages/FindLawyers";
import LawyerDetails from "./pages/LawyerDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import ClientDashboard from "./pages/ClientDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lawyers" element={<FindLawyers />} />
          <Route path="/lawyer/:id" element={<LawyerDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lawyer-profile-setup" element={<LawyerProfileSetup />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;