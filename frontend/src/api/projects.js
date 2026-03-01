import api from "./axios";

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const createProject = (data) => {
  return api.post("/projects", data);
};

export const updateProject = (projectId, updates) => {
  return api.patch(`/projects/${projectId}`, updates);
};

export const deleteProject = (projectId) => {
  return api.delete(`/projects/${projectId}`);
};
