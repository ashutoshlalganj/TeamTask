import api from "./api";

export const getUsers = async () => {
  const { data } = await api.get("/auth/users");
  return data;
};
