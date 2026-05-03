import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";
import { getProjects } from "../services/projectService";
import { getUsers } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    dueDate: "",
  });
  const [error, setError] = useState(null);

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    }
  };

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects");
    }
  };

  useEffect(() => {
    loadTasks();
    if (isAdmin) {
      loadProjects();
      getUsers()
        .then(setUsers)
        .catch(() => {});
    }
  }, [isAdmin]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await createTask(form);
      setForm({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        dueDate: "",
      });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    }
  };

  const handleStatus = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Task manager
            </h1>
            <p className="mt-2 text-slate-500">
              Track work status across tasks and team members.
            </p>
          </div>
          <span className="rounded-3xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            {isAdmin ? "Admin controls" : "Own tasks"}
          </span>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isAdmin && (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Create a task
          </h2>
          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Title</span>
                <input
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Project</span>
                <select
                  value={form.projectId}
                  onChange={(e) => handleChange("projectId", e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Assignee</span>
                <select
                  value={form.assignedTo}
                  onChange={(e) => handleChange("assignedTo", e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select member</option>
                  {users.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Due date</span>
                <input
                  value={form.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  type="date"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
            >
              Add task
            </button>
          </form>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Task list</h2>
        {tasks.length === 0 ? (
          <p className="mt-4 text-slate-500">No tasks available yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {task.title}
                    </p>
                    <p className="mt-1 text-slate-600">
                      {task.description || "No description"} •{" "}
                      {task.projectId?.title || "Unknown project"}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Assigned to {task.assignedTo?.name || "Unassigned"} | Due{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                      {task.status}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {user.role === "admin" && (
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
                        >
                          Delete
                        </button>
                      )}
                      <select
                        value={task.status}
                        onChange={(e) => handleStatus(task._id, e.target.value)}
                        className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                      >
                        {["Pending", "In Progress", "Completed"].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Tasks;
