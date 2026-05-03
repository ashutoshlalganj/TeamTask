import { useEffect, useState } from "react";
import { getDashboardStats, getTasks } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };

    const loadTasks = async () => {
      try {
        const taskData = await getTasks();
        setTasks(taskData.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tasks");
      }
    };

    loadStats();
    loadTasks();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Welcome back
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              {user.name}
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your projects and tasks with role-based access control.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-950 px-6 py-4 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
              Role
            </p>
            <p className="mt-2 text-2xl font-semibold">{user.role}</p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["total", "completed", "inProgress", "pending", "overdue"].map(
          (key) => {
            const labels = {
              total: "Total Tasks",
              completed: "Completed",
              inProgress: "In Progress",
              pending: "Pending",
              overdue: "Overdue",
            };
            return (
              <div
                key={key}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {labels[key]}
                </p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {stats ? stats[key] : "—"}
                </p>
              </div>
            );
          },
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Latest tasks
            </h2>
            <p className="text-slate-500">Your most recent task work items.</p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="text-slate-500">No tasks available yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {task.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.projectId?.title || "Project"} • Assigned to{" "}
                      {task.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {task.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {task.description || "No description provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
