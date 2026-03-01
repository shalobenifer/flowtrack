import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/useUser";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const { userId, loading } = useUser();

  if (loading)
    return (
      <div className="flex justify-center items-center h-180">
        <Loader />
      </div>
    );

  if (!userId) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
