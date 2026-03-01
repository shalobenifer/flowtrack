import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateProject } from "../api/projects";
import { format } from "date-fns";
import { FaRegCalendar } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

const statusStyles = {
  "On track":
    "bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-200",
  Pending:
    "bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-orange-200",
  Completed: "bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200",
};

const emojiOptions = ["🚀", "🎨", "💻", "📈", "🏠", "🍕", "🔥", "💡"];

const ProjectDetailsCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [updateDetails, setUpdateDetails] = useState({
    title: project.title,
    description: project.description,
    status: project.status,
    due_date: format(new Date(project.due_date), "yyyy-MM-dd"),
    icon: project.icon,
  });

  const queryClient = useQueryClient();

  const { mutate: updateProjectMutate, isPending: isEditing } = useMutation({
    mutationFn: (updateDetails) =>
      updateProject(project.id, { updates: updateDetails }),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects", project.id]);
      queryClient.invalidateQueries(["projects"]);
      setShowModal(false);
    },
  });

  const progress =
    project.total_tasks === 0
      ? 0
      : Math.round((project.completed_tasks / project.total_tasks) * 100);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
          <div className="flex gap-3 items-center">
            <span className="text-3xl sm:text-4xl bg-gray-50 dark:bg-gray-700 p-3 rounded-2xl border dark:border-gray-600">
              {project.icon}
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {project.title}
              </h1>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[project.status]}`}
              >
                {project.status}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-300 text-left sm:text-right">
            <div className="flex items-center gap-2 mb-1">
              <FaRegCalendar />
              Due {format(new Date(project.due_date), "MMMM d, yyyy")}
            </div>
            <p className="text-xs opacity-70">
              Created {format(new Date(project.created_at), "MMM d")}
            </p>
            <MdEdit
              onClick={() => setShowModal(true)}
              className="mt-2 text-xl cursor-pointer hover:text-blue-500 transition"
            />
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Project Completion</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {progress}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
            {project.completed_tasks} of {project.total_tasks} tasks completed
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProjectMutate(updateDetails);
            }}
            className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              Edit Project
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                value={updateDetails.title}
                onChange={(e) =>
                  setUpdateDetails({ ...updateDetails, title: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                value={updateDetails.description}
                onChange={(e) =>
                  setUpdateDetails({
                    ...updateDetails,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={updateDetails.status}
                  onChange={(e) =>
                    setUpdateDetails({
                      ...updateDetails,
                      status: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="On track">On track</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={updateDetails.due_date}
                  onChange={(e) =>
                    setUpdateDetails({
                      ...updateDetails,
                      due_date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Icon
              </label>
              <div className="flex gap-2 flex-wrap">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() =>
                      setUpdateDetails({ ...updateDetails, icon: emoji })
                    }
                    className={`text-2xl p-2 rounded-xl border transition ${
                      updateDetails.icon === emoji
                        ? "bg-blue-100 border-blue-500 dark:bg-blue-900/30"
                        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isEditing}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                type="button"
              >
                Cancel
              </button>

              <button
                disabled={isEditing}
                className="px-6 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 transition"
                type="submit"
              >
                {isEditing ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ProjectDetailsCard;
