import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Signin = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/"); // Redirect to homepage
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/"); // Redirect after login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#071126] to-[#061226] text-white"
          : "bg-gradient-to-br from-purple-300 via-purple-500 to-purple-300 text-black"
      }`}
    >
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border border-white/10 bg-white/5 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 tracking-tight">
          Sign In
        </h1>

        <form onSubmit={handleSignin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 opacity-70">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-white/10 placeholder-white/50 text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 opacity-70">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                className="input input-bordered w-full bg-white/10 placeholder-white/50 text-white"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-white/70 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-full bg-gradient-to-r from-purple-700 to-pink-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-white/20" />
          <span className="mx-2 text-white/50 text-sm">OR</span>
          <hr className="flex-1 border-white/20" />
        </div>

        {/* Google Sign-In */}
<button
  onClick={handleGoogleSignin}
  className="w-full flex items-center justify-center gap-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium shadow hover:shadow-md transition-shadow"
>
  {/* Inline Google Icon */}
  <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
    <path
      fill="#4285F4"
      d="M533.5 278.4c0-18.4-1.5-36.1-4.4-53.3H272v100.9h146.9c-6.3 34.1-25.2 63-53.7 82.3v68.3h86.8c50.7-46.7 80.5-115.7 80.5-198.2z"
    />
    <path
      fill="#34A853"
      d="M272 544.3c72.6 0 133.5-24 178-65.2l-86.8-68.3c-24.1 16.1-55 25.5-91.2 25.5-70.1 0-129.5-47.3-150.8-111.2H32.1v69.9c44.5 87.3 135.8 149.3 239.9 149.3z"
    />
    <path
      fill="#FBBC05"
      d="M121.2 331.3c-10.4-31-10.4-64.3 0-95.3V166.1H32.1c-42.9 85.5-42.9 187.6 0 273.1l89.1-69.9z"
    />
    <path
      fill="#EA4335"
      d="M272 107.4c37.8-.6 73.8 13.4 101.2 39.6l75.7-75.7C404.9 24 343 0 272 0 167.9 0 76.6 62 32.1 149.3l89.1 69.9C142.5 154.7 201.9 107.4 272 107.4z"
    />
  </svg>

  Continue with Google
</button>

        

        <p className="text-center mt-4 text-white/60">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-300 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
