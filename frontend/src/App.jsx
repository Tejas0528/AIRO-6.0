import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminGuard from "./components/AdminGuard";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import Ticket from "./pages/Ticket";
import Schedule from "./pages/Schedule";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminScanner from "./pages/admin/AdminScanner";

function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/events" element={<SiteLayout><Events /></SiteLayout>} />
      <Route path="/events/:eventId" element={<SiteLayout><EventDetails /></SiteLayout>} />
      <Route path="/register" element={<SiteLayout><Register /></SiteLayout>} />
      <Route path="/ticket/:registrationId" element={<SiteLayout><Ticket /></SiteLayout>} />
      <Route path="/schedule" element={<SiteLayout><Schedule /></SiteLayout>} />
      <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
      <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminGuard />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/registrations" element={<AdminRegistrations />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/scanner" element={<AdminScanner />} />
      </Route>

      <Route
        path="*"
        element={
          <SiteLayout>
            <div className="h-screen flex items-center justify-center text-mist/50">Page not found.</div>
          </SiteLayout>
        }
      />
    </Routes>
  );
}
