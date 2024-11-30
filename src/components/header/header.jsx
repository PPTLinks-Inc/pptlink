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
import { CiSearch } from "react-icons/ci";
import { HiMenu } from "react-icons/hi";
// import { Input } from "@/components/ui/input"

export default function Header({ isBackMenu, handleDropdown }) {
  const location = useLocation();
  const [getlocation] = useState(
    useLocation().pathname === "/document"
      ? true
      : useLocation().pathname === "/newupload"
        ? true
        : false
  );
  const [getDashboardLocation] = useState(useLocation().pathname === "/dashboard");

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

  // const handlePresentationBtn = () => {
  //   if (!user) return navigate("/signin");
  //   if (user && user.presentations < 1 || getDashboardLocation) return navigate(UPLOAD);
  //   if (user.presentations > 0) return navigate(DASHBOARD);
  // };

  // const buttontext = () => {
  //   if (!user) return "Sign in";
  //   if (user && user.presentations < 1) return "Upload";
  //   if (user.presentations > 0 && getDashboardLocation) return "Upload";
  //   if (user.presentations > 0) return "Dashboard";
  // };
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
      className={`w-full border-b-[0.1px] pt-8 pb-3 flex items-center justify-center ${isBackMenu ? "bg-[#FFFFF0] border-b-black" : getlocation ? "!bg-transparent chokes" : "bg-black border-b-[#fffff022]"} ${!isBackMenu && "z-50"}`}
    >
      <div className="container !mx-auto flex justify-between items-center">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 1, type: "tween" }
          }}
          viewport={{ once: true }}
          className="logo_wrapper">
          <Link to="/" className="w-fit h-fit flex items-center justify-center gap-2">
            <img
              src={isBackMenu ? logo_black : logo_white}
              alt={isBackMenu ? logo_black : logo_white}
              className="block w-8 aspect-square"
            />
            <span className={`text-4xl font-semibold ${isBackMenu ? "text-black" : "text-white"}`}><span className="_text-[#FFA500]">PPT</span>Links</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 1, type: "tween" }
          }}
          viewport={{ once: true }}
          className="w-3/5 flex flex-row justify-between !items-center gap-4 maxScreen:gap-2 maxScreenMobile:justify-end">

          <span className={`hidden bg-[#FFFFF0] p-1 text-black ${isBackMenu && "border-black"} text-[1.3rem] 
          !border-[0.1px] maxScreenMobile:rounded-sm maxScreenMobile:!block`}><CiSearch /></span>

          <label htmlFor="searchAnything" className="flex justify-center items-center w-3/5 h-fit relative overflow-y-hidden maxScreen:ml-2 mr-6 maxScreenMobile:hidden">
            <span className={`block bg-black text-[#FFFFF0] text-xl absolute top-[50%] -translate-y-[50%] left-3 ${isBackMenu && "bg-[#FFFFF0]"} maxScreenMobile:text-3xl maxScreenMobile:border-2 maxScreenMobile:rounded-sm`}><CiSearch /></span>
            <input
              type="text"
              id="searchAnything"
              placeholder="Search for anything..."
              className={`block !w-full text-sm maxScreen:!w-full border-[0.5px] rounded-md py-[0.35rem] indent-12  ${!isBackMenu ? "border-[#FFFFF0] text-white bg-black" : "border-black text-black bg-[#FFFFF0]"}`}
            />
          </label>
          <Link
            to={user ? "/dashboard" : "/signin"}
            className={`flex justify-center items-center w-fit px-6 py-[0.18rem] text-[#FFFFF0] responsiveText border-[0.5px] border-[#FFFFF0] rounded-md maxScreenMobile:mb-3 maxScreenMobile:hidden text-nowrap ${getDashboardLocation && "hidden"}`}
          >
            {user ? "Dashboard" : "Sign In"}
          </Link>
          <Link
            to="/upload"
            className="flex justify-center items-center w-fit px-6 py-[0.18rem] bg-[#1f1f1d] text-black responsiveText rounded-md maxScreenMobile:mb-3 maxScreenMobile:hidden text-nowrap"
          >
            Create Now
          </Link>

          <button
            className="block w-fit md:hidden"
            onClick={() => handleDropdown()}
          >
            <span className="block text-[2.5rem]"><HiMenu /></span>
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
}
