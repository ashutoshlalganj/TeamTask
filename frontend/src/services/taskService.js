import api from "./api";

export const getTasks = async () => {
  const { data } = await api.get("/tasks");
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get("/tasks/dashboard");
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};
