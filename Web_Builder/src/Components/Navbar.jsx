import React, { useState, useEffect } from 'react'
import { IoMdMoon } from "react-icons/io";
import { FaSun, FaUser } from "react-icons/fa";

const Navbar = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="nav flex items-center justify-between px-[120px] h-[70px] dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="logo">
        <h3 className="text-[25px] font-bold bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
          Webbuilder
        </h3>
      </div>
      <div className="icons flex items-center gap-[15px]">
        <button onClick={toggleTheme} className="text-[22px]">
          {theme === "light" ? <IoMdMoon /> : <FaSun />}
        </button>
        <a
          href="https://github.com/Mohammad-Sufyan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          <i className="icon text-[22px]">
            <FaUser />
          </i>
        </a>

      </div>
    </div>
  );
};

export default Navbar;
