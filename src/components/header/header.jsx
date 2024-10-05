/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { userContext } from "../../contexts/userContext";
import {
  DASHBOARD,
  UPLOAD
} from "../../constants/routes";
import logo_white from "/imgs/WHITE.png";
import logo_black from "/imgs/BLACK.png";
import { motion } from "framer-motion";

export default function Header({ isBackMenu, handleDropdown }) {
  const location = useLocation();
  const [getlocation] = useState(
    useLocation().pathname === "/document"
      ? true
      : useLocation().pathname === "/newupload"
        ? true
        : false
  );

  const getPathName = () => {
    return location.pathname === "/" ? true : false;
  };
  const getPathNameDoc = () => {
    return location.pathname.split("/")[1] === "documentation"
      ? true
      : false;
  };

  // context
  const { user, setUser } = useContext(userContext);

  const navigate = useNavigate();

  const handlePresentationBtn = () => {
    if (!user) return navigate("/signin");
    if (user && user.presentations < 1) return navigate(UPLOAD);
    if (user.presentations > 0) return navigate(DASHBOARD);
  };

  const buttontext = () => {
    if (!user) return "Sign in";
    if (user && user.presentations < 1) return "Upload";
    if (user.presentations > 0) return "Dashboard";
  };
  const containertVarients = {
    hidden: {
      opacity: !getPathNameDoc() && 0
    },
    visible: {
      opacity: 1,
      transition: {
        delay: getPathName ? 0.5 : 1.5,
        duration: 1.5
      }
    },
    exit: {
      x: !getPathNameDoc() ? "-100vw" : "0vw",
      transition: {
        ease: "easeInOut"
      }
    }
  };
  return (
    <motion.header
      variants={containertVarients}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`border-b-[0.1px] py-8 flex items-center justify-center ${isBackMenu ? "bg-[#FFFFF0] border-b-black" : getlocation ? "!bg-transparent chokes" : "bg-black border-b-[#FFFFF0]"} ${!isBackMenu && "z-50"}`}
    >
      <div className="container flex justify-between items-center">
        <div className="logo_wrapper">
          <Link to="/" className="hlogo uppercase block w-10 h-10">
            <img
              src={isBackMenu ? logo_black : logo_white}
              alt={isBackMenu ? logo_black : logo_white}
            />
          </Link>
        </div>

        <div className="btnGroup1 flex flex-row justify-between items-center w-[225px]">
          <button
            onClick={() => handlePresentationBtn()}
            type="submit"
            className={`w-[10rem] h-[2rem] flex items-center justify-center text-[.8rem] font-medium rounded-md ${!isBackMenu ? "bg-[#FFFFF0] text-black" : "bg-black text-white"}`}
          >
            {buttontext()}
          </button>

          <button
            className="w-[25px] aspect-square"
            onClick={() => handleDropdown()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="!w-full !h-full"
              viewBox="0 0 36 31.365"
            >
              <path
                id="Icon_open-menu"
                data-name="Icon open-menu"
                d="M0,0V4.5H36V0ZM0,13.365v4.5H36v-4.5Zm0,13.5v4.5H36v-4.5Z"
                strokeLinecap="rounded"
                stroke="#FFFFF0"
                fill={isBackMenu ? "black" : "#FFFFF0"}
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
