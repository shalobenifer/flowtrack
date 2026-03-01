import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "../api/projects";
import { format } from "date-fns";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa6";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const statusStyles = {
  "On track":
    "bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Pending:
    "bg-orange-200 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Completed: "bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const ProjectCard = ({ project }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: deleteProjectMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteProject(project.id),
    onSuccess: () => queryClient.invalidateQueries(["projects"]),
  });

  const progress =
    project.total_tasks === 0
      ? 0
      : (project.completed_tasks / project.total_tasks) * 100;

  const dueDate = format(new Date(project.due_date), "MMM d");

  return (
    <li className="border border-gray-200 dark:border-gray-700 rounded-2xl w-full sm:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)] p-4 sm:p-5 lg:p-6 cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <div onClick={() => navigate(`/projects/${project.id}`)}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <p className="bg-blue-100 dark:bg-blue-900/40 text-2xl p-2 rounded-lg">
              {project.icon}
            </p>
            <div>
              <h2 className="text-base sm:text-lg font-medium">
                {project.title}
              </h2>
              <span
                className={`inline-flex py-0.5 px-2 text-xs rounded-2xl ${statusStyles[project.status]}`}
              >
                {project.status}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete "${project.title}"?`)) {
                deleteProjectMutate();
              }
            }}
            disabled={isDeleting}
            className="text-gray-500 hover:text-red-600 transition"
          >
            <MdDeleteOutline className="text-xl" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {project.description}
        </p>

        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{project.total_tasks} tasks</span>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center text-gray-600 dark:text-gray-400 text-sm">
            <FaRegCalendar />
            <span>{dueDate}</span>
          </div>

          <IoCheckmarkDoneSharp
            className={
              project.status === "Completed"
                ? "text-green-500 text-xl"
                : "text-gray-400 dark:text-gray-500 text-xl"
            }
          />
        </div>
      </div>
    </li>
  );
};

export default ProjectCard;
