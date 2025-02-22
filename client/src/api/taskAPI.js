import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

export const getTasks = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const addTask = async (task) => {
  const { data } = await axios.post(API_URL, task);
  return data;
};

export const updateTask = async (id, updatedTask) => {
  const { data } = await axios.put(`${API_URL}/${id}`, updatedTask);
  return data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const reorderTasks = async (tasks) => {
  await axios.put(`${API_URL}/reorder`, { tasks });
};
