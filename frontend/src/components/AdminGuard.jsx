import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarCog, Users, ClipboardCheck, ScanLine, LogOut } from "lucide-react";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/events", label: "Events", icon: CalendarCog },
  { to: "/admin/registrations", label: "Registrations", icon: Users },
  { to: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/admin/scanner", label: "Scanner", icon: ScanLine },
];

export default function AdminGuard() {
  const token = localStorage.getItem("airo6_admin_token");
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  function logout() {
    localStorage.removeItem("airo6_admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-void flex">
      <aside className="w-56 border-r border-steel/40 p-6 hidden md:flex flex-col justify-between">
        <div>
          <p className="font-display text-sm tracking-widest2 text-mist mb-10">AIRO 6.0 ADMIN</p>
          <nav className="space-y-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2 text-sm text-mist/70 hover:text-mist hover:bg-gunmetal rounded">
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-mist/50 hover:text-mist">
          <LogOut size={16} /> Log out
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
