import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getProject } from "../api/projects";
import { createTask } from "../api/tasks";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import ProjectDetailsCard from "../components/ProjectDetailsCard";
import TaskCard from "../components/TaskCard";
import { IoIosAdd } from "react-icons/io";

const ProjectDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const queryClient = useQueryClient();
  const { projectId } = useParams();

  const { data, error, status } = useQuery({
    queryFn: () => getProject(projectId),
    queryKey: ["projects", projectId],
  });

  const { mutate: createTaskMutate, isPending: isCreating } = useMutation({
    mutationFn: (newTask) => createTask(projectId, newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["projects", projectId]);
      setShowModal(false);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    createTaskMutate({ title, description, priority, due_date: dueDate });
  };

  const renderFailure = (error) => (
    <p className="text-red-500 text-center mt-10">
      Request Failed : {error.message}
    </p>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 xl:px-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {status === "pending" && <Loader />}
      {status === "error" && renderFailure(error)}

      {status === "success" && (
        <>
          <ProjectDetailsCard project={data.project} />

          {data.project.tasks_list.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3 md:gap-4 p-0">
              {data.project.tasks_list.map((task) => (
                <TaskCard
                  key={task.id}
                  project={{
                    id: data.project.id,
                    title: data.project.title,
                    icon: data.project.icon,
                  }}
                  task={task}
                />
              ))}
            </ul>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="mx-auto mt-8 mb-6 text-white bg-blue-600 dark:bg-blue-500 rounded-md flex items-center gap-1 px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            type="button"
          >
            <IoIosAdd className="text-2xl" />
            New Task
          </button>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              Create Task
            </h2>

            {[
              ["Title", title, setTitle, "Task Title"],
              ["Description", description, setDescription, "Description"],
            ].map(([label, value, setter, placeholder]) => (
              <div key={label} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                {label === "Description" ? (
                  <textarea
                    className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  />
                ) : (
                  <input
                    className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required
                  />
                )}
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border p-3 rounded-xl bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                disabled={isCreating}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                type="button"
              >
                Cancel
              </button>

              <button
                disabled={isCreating}
                className="px-6 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 transition"
                type="submit"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
