import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../firebase/firebase.config";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(result.user, { displayName: form.name, photoURL: form.photo });
      navigate("/signin");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#071126] to-[#061226] text-white"
          : "bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border transition-colors duration-300 shadow-lg ${
          darkMode
            ? "border-white/10 bg-white/5 text-white"
            : "border-gray-300 bg-white text-black"
        }`}
      >
        <h1
          className={`text-3xl md:text-4xl font-extrabold text-center mb-6 tracking-tight ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Sign Up
        </h1>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6">
          <label className={`text-sm mb-2 ${darkMode ? "text-white/80" : "text-gray-800"}`}>
            Profile Photo
          </label>
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 mb-3">
            <img
              src={form.photo || "../Media/profile icon.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? "text-white/70" : "text-gray-800"}`}>
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              className={`input input-bordered w-full placeholder-gray-500 transition-colors duration-300 ${
                darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-black"
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-1 ${darkMode ? "text-white/70" : "text-gray-800"}`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
              className={`input input-bordered w-full placeholder-gray-500 transition-colors duration-300 ${
                darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-black"
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-1 ${darkMode ? "text-white/70" : "text-gray-800"}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                className={`input input-bordered w-full placeholder-gray-500 transition-colors duration-300 ${
                  darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-black"
                }`}
              />
              <span
                className={`absolute right-3 top-3 cursor-pointer transition-colors duration-300 ${
                  darkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-full bg-gradient-to-r from-purple-700 to-pink-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className={`text-center mt-4 transition-colors duration-300 ${darkMode ? "text-white/60" : "text-gray-800"}`}>
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-yellow-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
