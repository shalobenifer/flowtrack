import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import { logout } from "../api/auth";
import { useUser } from "../context/useUser";
import { MdLogout } from "react-icons/md";
import { BiMoon, BiSun } from "react-icons/bi";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import flowTrackLogo from "../assets/flowtrack-logo.png";
import userAvatar from "../assets/user-avatar.png";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

const NavBar = () => {
  const navigate = useNavigate();

  const { setUserId } = useUser();

  const logoutUser = async () => {
    try {
      const response = await logout();
      console.log(response);
      setUserId(null);
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    const value = e.target.value;
    navigate(`/projects?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white dark:bg-gray-900 p-4 shadow-sm h-20 sticky top-0 z-20">
      <img
        src={flowTrackLogo}
        className="w-38 h-38 cursor-pointer"
        alt="FlowTrack"
      />
      <input
        onChange={handleSearch}
        placeholder="Search projects and tasks"
        type="search"
        className="rounded-2xl border border-gray-300 w-1/3 p-2 px-4 focus:outline-none focus:border-none  focus:ring-2 focus:ring-blue-500 placeholder:text-center"
      />
      <div className="flex justify-center items-center">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:scale-105 transition-all duration-200"
        >
          {theme === "light" ? (
            <BiMoon size={25} className="text-gray-800" />
          ) : (
            <BiSun size={25} className="text-yellow-400" />
          )}
        </button>

        <Menu
          menuButton={
            <MenuButton>
              <img
                src={userAvatar}
                alt="avatar"
                aria-label="User menu"
                className="h-8 w-8 m-5 cursor-pointer"
              />
            </MenuButton>
          }
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem onClick={logoutUser} className="text-red-600">
            <MdLogout />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};
export default NavBar;

document.documentElement.classList.contains("dark");
