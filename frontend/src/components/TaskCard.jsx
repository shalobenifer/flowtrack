import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateTask, deleteTask } from "../api/tasks";
import { format } from "date-fns";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdOutlineEditCalendar, MdEdit, MdDelete } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";

const priorityStyles = {
  Low: "bg-blue-500 text-white",
  Medium: "bg-amber-500 text-white",
  High: "bg-red-500 text-white",
};

const TaskCard = ({ project, task }) => {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "",
    due_date: "",
  });

  const openEditModal = () => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      due_date: format(new Date(task.due_date), "yyyy-MM-dd"),
    });
  };

  const { mutate: updateTaskMutate } = useMutation({
    mutationFn: (updatedFields) =>
      updateTask(project.id, task.id, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects", project.id]);
      queryClient.invalidateQueries(["projects"]);
      setEditingTask(null);
    },
  });

  const { mutate: deleteTaskMutate } = useMutation({
    mutationFn: () => deleteTask(project.id, task.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects", project.id]);
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const toggleTaskStatus = () => {
    const newStatus = task.status === "Completed" ? "Active" : "Completed";
    updateTaskMutate({ status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutate();
    }
  };

  return (
    <>
      <li
        className="border border-gray-200 dark:border-gray-700 rounded-2xl 
        flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 
        bg-white dark:bg-gray-900 
        hover:shadow-md transition-all duration-300"
      >
        <button
          type="button"
          onClick={toggleTaskStatus}
          className={`flex justify-center items-center border rounded-xl h-9 w-9
            transition 
            ${
              task.status === "Completed"
                ? "bg-green-600 border-green-600"
                : "bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600"
            }`}
        >
          <IoCheckmarkDoneSharp
            className={`text-xl ${
              task.status === "Completed"
                ? "text-white"
                : "text-gray-400 dark:text-gray-500"
            }`}
          />
        </button>

        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-medium text-sm sm:text-base ${
                task.status === "Completed"
                  ? "line-through text-gray-400"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="text-base">{project.icon}</span>
              <span>{project.title}</span>
            </div>

            <div className="flex items-center gap-1 text-green-600">
              <MdOutlineEditCalendar />
              <span>{format(new Date(task.created_at), "MMM d")}</span>
            </div>

            <div
              className={`flex items-center gap-1 ${
                task.status !== "Completed" ? "text-red-500" : "text-gray-400"
              }`}
            >
              <RiCalendarScheduleLine />
              <span>{format(new Date(task.due_date), "MMM d")}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col flex-row gap-3 ml-auto">
          <button
            onClick={openEditModal}
            className="text-gray-400 hover:text-blue-600 transition"
          >
            <MdEdit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition"
          >
            <MdDelete size={20} />
          </button>
        </div>
      </li>

      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateTaskMutate(editForm);
            }}
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Edit Task
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Title
                </label>
                <input
                  required
                  className="w-full border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 
                    p-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none
                    text-gray-900 dark:text-gray-100"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 
                    p-3 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none
                    text-gray-900 dark:text-gray-100"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Priority
                  </label>
                  <select
                    className="w-full border border-gray-200 dark:border-gray-700 
                      bg-white dark:bg-gray-800 p-3 rounded-xl mt-1
                      text-gray-900 dark:text-gray-100"
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm({ ...editForm, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 dark:border-gray-700 
                      bg-white dark:bg-gray-800 p-3 rounded-xl mt-1
                      text-gray-900 dark:text-gray-100"
                    value={editForm.due_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, due_date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200/30"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TaskCard;
