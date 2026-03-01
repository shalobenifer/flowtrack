import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import Loader from "../components/Loader";
import ProjectCard from "../components/ProjectCard";
import { getProjects, createProject } from "../api/projects";
import { IoIosAdd } from "react-icons/io";
import { BiErrorAlt } from "react-icons/bi";

const emojiOptions = ["🚀", "🎨", "💻", "📈", "🏠", "🍕", "🔥", "💡"];

const Projects = () => {
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🚀");

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  const {
    data,
    status: queryStatus,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const filteredProjects = data?.projects
    ?.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    ?.filter((project) => {
      if (filter === "all") return true;
      if (filter === "active") return project.status !== "Completed";
      if (filter === "completed") return project.status === "Completed";
      return true;
    });

  const { mutate: createProjectMutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setShowModal(false);
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setDueDate("");
      setSelectedEmoji("🚀");
    },
    onError: (err) => alert(`Failed to create project: ${err.message}`),
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    createProjectMutate({
      title,
      description,
      status,
      due_date: dueDate,
      icon: selectedEmoji,
    });
  };

  const renderFailure = (error) => (
    <div className="flex justify-center items-center gap-2 text-red-500">
      <BiErrorAlt />
      <p>{error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
            My Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage and track all your projects
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="w-full sm:w-auto text-white bg-blue-600 rounded-md flex justify-center items-center gap-1 px-4 py-2 hover:bg-blue-700 transition"
        >
          <IoIosAdd className="text-2xl" />
          New Project
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "active", "completed"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              filter === key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {queryStatus === "pending" && <Loader />}
      {queryStatus === "error" && renderFailure(error)}
      {queryStatus === "success" &&
        (filteredProjects?.length ? (
          <ul className="m-0 p-0 flex flex-wrap gap-4 sm:gap-5 lg:gap-6 w-full">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col justify-center items-center h-80 w-full text-center">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
              No Projects yet
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Click the “New Project” button to get started!
            </p>
          </div>
        ))}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProject}
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-5 sm:p-6 rounded-2xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-6">Create Project</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border p-3 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="Pending">Pending</option>
                  <option value="On track">On track</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border p-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Project Icon
              </label>
              <div className="flex gap-2 flex-wrap">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-2 rounded-xl border transition ${
                      selectedEmoji === emoji
                        ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
                disabled={isPending}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                type="button"
              >
                Cancel
              </button>

              <button
                disabled={isPending}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition"
                type="submit"
              >
                {isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
      {console.log(data)}
    </div>
  );
};

export default Projects;
