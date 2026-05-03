import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 text-slate-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-white"
        >
          Team Task Manager
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-3 md:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md bg-slate-700 px-3 py-2 text-sm font-medium"
                    : "rounded-md px-3 py-2 text-sm hover:bg-slate-800"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md bg-slate-700 px-3 py-2 text-sm font-medium"
                    : "rounded-md px-3 py-2 text-sm hover:bg-slate-800"
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md bg-slate-700 px-3 py-2 text-sm font-medium"
                    : "rounded-md px-3 py-2 text-sm hover:bg-slate-800"
                }
              >
                Tasks
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md bg-slate-700 px-3 py-2 text-sm font-medium"
                    : "rounded-md px-3 py-2 text-sm hover:bg-slate-800"
                }
              >
                Profile
              </NavLink>
            </nav>
            <div className="hidden rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-200 sm:block">
              {user.name} ({user.role})
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-md border border-slate-600 px-4 py-2 text-sm transition hover:border-slate-400"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
