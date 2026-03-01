import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

const UserContext = createContext(null);
export default UserContext;

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/user");
        setUserId(response.data.userId);
      } catch {
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ loading, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
