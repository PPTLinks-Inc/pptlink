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
import { CiUser } from "react-icons/ci";
import { FaFileUpload } from "react-icons/fa";
// import { Input } from "@/components/ui/input"

export default function Header({ isBackMenu, handleDropdown }) {
  const location = useLocation();
  const [getlocation] = useState(useLocation().pathname === "/document");
  const [getDashboardLocation] = useState(useLocation().pathname === "/dashboard");
  const [getUploadLocation] = useState(useLocation().pathname === "/upload");

  const getPathName = () => location.pathname === "/" ? true : false;
  const getPathNameDoc = () => location.pathname.split("/")[1] === "documentation" ? true : false;
  // context
  const { user } = useContext(userContext);
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
          <Link to="/" className="w-fit h-fit !flex !items-center !justify-center gap-2">
            <img
              src={isBackMenu ? logo_black : logo_white}
              alt={isBackMenu ? logo_black : logo_white}
              className="block w-8 aspect-square"
            />
            <span className={`block w-fit h-fit text-2xl md:text-3xl font-semibold ${isBackMenu ? "text-black" : "text-[#FFFFF0]"}`}>PPTLinks</span>
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
          className="w-3/5 flex flex-row justify-end !items-center gap-4 maxScreen:gap-4 maxScreenMobile:justify-end">

          <span className={`hidden bg-[#FFFFF0] p-1 text-black ${isBackMenu && "border-black"} text-[1.3rem] 
          !border-[0.1px] maxScreenMobile:rounded-sm maxScreenMobile:!block`}><CiSearch /></span>

          <label htmlFor="searchAnything" className="flex justify-center items-center w-3/5 h-fit relative overflow-y-hidden maxScreenMobile:hidden">
            <span className={`block text-xl absolute top-[50%] -translate-y-[50%] left-3 maxScreenMobile:text-3xl maxScreenMobile:border-2 maxScreenMobile:rounded-sm`}><CiSearch /></span>
            <input
              type="text"
              id="searchAnything"
              placeholder="Search for anything..."
              className={`block !w-full text-sm maxScreen:!w-full border-[0.5px] rounded-md py-[0.35rem] indent-12  ${!isBackMenu ? "border-[#FFFFF0] text-white bg-black" : "border-black text-black bg-[#FFFFF0]"}`}
            />
          </label>

          <Link
            to={!user ? "/signin" : getUploadLocation ? "/dashboard" : getDashboardLocation ? "/upload" : "/dashboard"}
            className={`${!user && "!hidden"} flex justify-center items-center w-fit md:px-6 md:py-[0.35rem] md:bg-[#FFFFF0] md:border-[0.5px] md:text-black md:responsiveText md:rounded-md maxScreenMobile:mb-3 md:text-nowrap ${!isBackMenu ? "md:border-[#FFFFF0]" : "md:border-black md:text-black"}`}
          >
            <span className="block text-sm maxScreenMobile:hidden">{!user ? "Sign In" : getUploadLocation ? "Dashboard" : getDashboardLocation ? "Upload" : "Dashboard"}</span>
            {!user ? "Sign In" : getUploadLocation ?
              <span className="hidden maxScreenMobile:block w-fit h-fit text-4xl -mb-3"><CiUser /></span> : getDashboardLocation ?
                <span className={`hidden maxScreenMobile:block w-fit h-fit text-3xl -mb-3 text-[#FFFFF0] ${isBackMenu && "text-black"}`}><FaFileUpload /></span> :
                <span className={`hidden maxScreenMobile:block w-fit h-fit text-4xl -mb-3 text-[#FFFFF0] ${isBackMenu && "text-black"}`}><CiUser /></span>}
          </Link>

          <button
            className="block w-fit _md:hidden"
            onClick={() => handleDropdown()}
          >
            <span className={`block text-[2.5rem] text-[#FFFFF0] ${isBackMenu && "text-black"}`}><HiMenu /></span>
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
}
