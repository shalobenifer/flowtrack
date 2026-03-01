import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/useUser";
import Loader from "../components/Loader";

const PublicRoute = () => {
  const { loading, userId } = useUser();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  if (userId) return <Navigate to="/projects" />;

  return <Outlet />;
};

export default PublicRoute;
