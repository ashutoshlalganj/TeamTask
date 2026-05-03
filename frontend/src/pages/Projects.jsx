import { useEffect, useMemo, useState } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../services/projectService";
import { getUsers } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState(null);

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
    if (isAdmin) {
      getUsers()
        .then(setUsers)
        .catch(() => {});
    }
  }, [isAdmin]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await createProject({ title, description, teamMembers: selectedMembers });
      setTitle("");
      setDescription("");
      setSelectedMembers([]);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Project creation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Project workspace
            </h1>
            <p className="mt-2 text-slate-500">
              Manage active projects and assigned teams in one place.
            </p>
          </div>
          <span className="rounded-3xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            {isAdmin ? "Admin view" : "Member view"}
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
            Create new project
          </h2>
          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Team members</span>
                <select
                  multiple
                  value={selectedMembers}
                  onChange={(e) =>
                    setSelectedMembers(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                      ),
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 h-40"
                >
                  {users.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} — {member.email}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
            >
              Create project
            </button>
          </form>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Active projects
        </h2>
        {projects.length === 0 ? (
          <p className="mt-4 text-slate-500">No projects found yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {project.title}
                    </p>
                    <p className="mt-2 text-slate-600">
                      {project.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {project.teamMembers?.map((member) => (
                      <span
                        key={member._id}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500">
                    <span>Created by you</span>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-400"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Projects;
