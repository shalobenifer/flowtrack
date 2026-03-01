import api from "../api/axios";

export const createTask = async (projectId, data) => {
  const response = await api.post(`projects/${projectId}/tasks`, data);
  return response;
};

export const updateTask = async (projectId, taskId, data) => {
  const response = await api.patch(
    `projects/${projectId}/tasks/${taskId}`,
    data,
  );
  return response;
};

export const deleteTask = async (projectId, taskId) => {
  const response = await api.delete(`projects/${projectId}/tasks/${taskId}`);
  return response;
};
