import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const AboutUs = () => {
  const { darkMode } = useDarkMode();

  const handleNotify = () => {
    toast.success("🎉 You’ll be notified when AI_Routine_Maker updates!", {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center text-center p-6 transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#071126] to-[#061226] text-white"
          : "bg-gradient-to-br from-purple-300 via-purple-500 to-purple-300 text-black"
      }`}
    >
      <ToastContainer />

      <h1 className="text-5xl md:text-6xl font-bold animate-bounce drop-shadow-lg">
        🚀 About AI_Routine_Maker
      </h1>

      <p className="mt-5 text-lg opacity-90 max-w-2xl animate-pulse">
        AI_Routine_Maker is a smart and simple Class Routine Manager built for students. 
        It allows you to:
      </p>

      <ul className="mt-5 text-left max-w-xl space-y-2 list-disc list-inside text-lg opacity-90">
        <li>Add and manage your daily class routines easily.</li>
        <li>View today’s schedule in a clean, readable format.</li>
        <li>Highlight ongoing and upcoming classes automatically.</li>
        <li>Receive reminders 10–20 minutes before your next class.</li>
        <li>Save your routines using LocalStorage or Firebase.</li>
        <li>Enjoy a modern, clean interface with Dark Mode support.</li>
      </ul>

      <div className="mt-10">
        <button
          onClick={handleNotify}
          className="btn btn-outline btn-accent animate-[pulse_2s_infinite]"
        >
          Notify Me
        </button>
      </div>

      <div className="absolute bottom-6 text-sm animate-pulse">
        Developed by <span className="font-bold">Red_Coders 💎</span>
      </div>
    </div>
  );
};

export default AboutUs;
