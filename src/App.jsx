import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Hierarchy from "./pages/public/Hierarchy";
import Gallery from "./pages/public/Gallery";
import Events from "./pages/public/Events";
import EventDetail from "./pages/public/EventDetail";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/public/NotFound";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageYears from "./pages/admin/ManageYears";
import ManageMembers from "./pages/admin/ManageMembers";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageEvents from "./pages/admin/ManageEvents";
import Messages from "./pages/admin/Messages";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/bureau" element={<Hierarchy />} />
        <Route path="/galerie" element={<Gallery />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/evenements/:id" element={<EventDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="annees" element={<ManageYears />} />
        <Route path="membres" element={<ManageMembers />} />
        <Route path="galerie" element={<ManageGallery />} />
        <Route path="evenements" element={<ManageEvents />} />
        <Route path="messages" element={<Messages />} />
      </Route>
    </Routes>
  );
}