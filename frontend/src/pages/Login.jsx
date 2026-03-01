import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { login } from "../api/auth";
import { BiHide, BiShow } from "react-icons/bi";
import flowTrackLogo from "../assets/flowtrack-logo.png";
import { useUser } from "../context/useUser";

const Login = () => {
  const navigate = useNavigate();
  const { setUserId } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const loginUser = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    try {
      const response = await login({ email, password });
      setUserId(response.data.userId);
      navigate("/projects", { replace: true });
      console.log(response.data?.message);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login Failed");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <img src={flowTrackLogo} className="w-38 h-38" alt="FlowTrack" />

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Please enter your details to sign in.
        </p>

        <form onSubmit={loginUser} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={email}
              type="email"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
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

          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
