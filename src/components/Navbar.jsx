import { Link } from "react-router";
import logo from "../Media/Logo.png";
import MyContainer from "./MyContainer";
import MyLink from "./MyLink";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const Navbar = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const { user, signoutUserFunc, loading, setUser } = useContext(AuthContext);

  const handleSignout = () => {
    signoutUserFunc()
      .then(() => {
        toast.success("Signout successful");
        setUser(null);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <div
      className={`py-2 border-b border-b-slate-300 transition-colors ${
        darkMode ? "bg-[#0f172a] text-white" : "bg-slate-100 text-black"
      }`}
    >
      <MyContainer className="flex items-center justify-between">
        <figure>
          <img src={logo} className="w-[55px]" alt="logo" />
        </figure>

        <ul className="flex items-center gap-2">
          <li>
            <MyLink to={"/"}>Home</MyLink>
          </li>
          <li>
            <MyLink to={"/about-us"}>About US</MyLink>
          </li>
          {user && (
            <li>
              <MyLink to={"/profile"}>Profile</MyLink>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>

          {loading ? (
            <ClockLoader color="#e74c3c" />
          ) : user ? (
            <div className="text-center space-y-3 relative">
              <button className="btn">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/88"}
                  className="h-[40px] w-[40px] rounded-full mx-auto"
                  alt=""
                />
              </button>

              <div className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm">
                <h2 className="text-xl font-semibold">{user?.displayName}</h2>
                <p className="text-white/80">{user?.email}</p>
                <button onClick={handleSignout} className="my-btn">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md font-semibold cursor-pointer">
              <Link to={"/Signin"}>Sign in</Link>
            </button>
          )}
        </div>
      </MyContainer>
    </div>
  );
};

export default Navbar;
