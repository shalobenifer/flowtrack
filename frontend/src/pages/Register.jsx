import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { register, login } from "../api/auth";
import { BiHide, BiShow } from "react-icons/bi";
import flowTrackLogo from "../assets/flowtrack-logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const registerUser = async (event) => {
    event.preventDefault();
    if (name.trim() === "") setErrorMsg("Name can't be blank");
    else if (email.trim() === "") setErrorMsg("Email can't be blank");
    else if (password.trim() === "") setErrorMsg("Password can't be blank");
    else if (password.trim() !== confirmPassword.trim())
      setErrorMsg("Both passwords are different");
    else {
      try {
        await register({ name, email, password });
        setErrorMsg("Registration Successful!");
        await login({ email, password });
        navigate("/projects", { replace: true });
      } catch (error) {
        setErrorMsg(error.response?.data?.message || "Registration Failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <img src={flowTrackLogo} className="w-38 h-38" alt="FlowTrack" />

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create an account
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Join FlowTrack to start managing projects.
        </p>

        <form onSubmit={registerUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={name}
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={email}
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={password}
              type={hidePassword ? "password" : "text"}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setHidePassword(!hidePassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {hidePassword ? <BiHide size={20} /> : <BiShow size={20} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={confirmPassword}
              type={hidePassword ? "password" : "text"}
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p
              className={`text-sm ${errorMsg.includes("Successful") ? "text-green-600" : "text-red-500"}`}
            >
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 mt-2"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
