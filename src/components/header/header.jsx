/* eslint-disable react/prop-types */
// import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo_white from "/imgs/WHITE.png";
import logo_black from "/imgs/BLACK.png";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { HiMenu } from "react-icons/hi";
import { CiUser } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import useUser from "../../hooks/useUser";
// import { Input } from "@/components/ui/input"

export default function Header({ isBackMenu, handleDropdown }) {
  const location = useLocation();
  const getlocation = () => location.pathname === "/document";
  const getDashboardLocation = () => location.pathname === "/dashboard";
  const getUploadLocation = () => location.pathname === "/upload";
  const getPathName = () => location.pathname === "/" ? true : false;
  const getPathNameDoc = () => location.pathname.split("/")[1] === "documentation" ? true : false;
  // context
  const { userQuery } = useUser();
  const user = userQuery.data;

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
      className={`w-full border-b-[0.1px] pt-8 pb-3 flex items-center justify-center ${isBackMenu ? "bg-[#FFFFF0] border-b-primaryTwo" : getlocation() ? "!bg-transparent chokes" : "bg-primaryTwo border-b-[#fffff022]"} ${!isBackMenu && "z-50"}`}
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
            <span className={`block w-fit h-fit text-2xl md:text-3xl font-semibold ${isBackMenu ? "text-primaryTwo" : "text-[#FFFFF0]"}`}>PPTLinks</span>
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

          <span className={`hidden bg-[#FFFFF0] p-1 text-primaryTwo ${isBackMenu && "border-primaryTwo"} text-[1.3rem] 
          !border-[0.1px] maxScreenMobile:rounded-sm maxScreenMobile:!block`}><CiSearch /></span>

          <label htmlFor="searchAnything" className="flex justify-center items-center w-3/5 h-fit relative overflow-y-hidden maxScreenMobile:hidden">
            <span className={`block text-xl absolute top-[50%] -translate-y-[50%] left-3 maxScreenMobile:text-3xl maxScreenMobile:border-2 maxScreenMobile:rounded-sm`}><CiSearch /></span>
            <input
              type="text"
              id="searchAnything"
              placeholder="Search for anything..."
              className={`block !w-full text-sm maxScreen:!w-full border-[0.5px] rounded-md py-[0.35rem] indent-12  ${!isBackMenu ? "border-[#FFFFF0] text-white bg-primaryTwo" : "border-primaryTwo text-primaryTwo bg-[#FFFFF0]"}`}
            />
          </label>

          <Link
            to={!user ? "/signin" : getUploadLocation() ? "/dashboard" : getDashboardLocation() ? "/upload" : "/dashboard"}
            className={`${!user && "!hidden"} flex justify-center items-center w-fit md:px-6 md:py-[0.35rem] md:bg-[#FFFFF0] md:border-[0.5px] md:text-primaryTwo md:responsiveText md:rounded-md maxScreenMobile:mb-3 md:text-nowrap ${!isBackMenu ? "md:border-[#FFFFF0]" : "md:border-primaryTwo md:text-primaryTwo"}`}
          >
            <span className="block text-sm maxScreenMobile:hidden">{!user ? "Sign In" : getUploadLocation() ? "Dashboard" : getDashboardLocation() ? "Upload" : "Dashboard"}</span>
            {!user ? "Sign In" : getUploadLocation() ?
              <span className="hidden maxScreenMobile:block w-fit h-fit text-4xl -mb-3"><CiUser /></span> : getDashboardLocation() ?
                <span className={`hidden maxScreenMobile:block w-fit h-fit text-3xl -mb-3 text-[#FFFFF0] ${isBackMenu && "text-primaryTwo"}`}><FiUploadCloud /></span> :
                <span className={`hidden p-1 maxScreenMobile:block w-fit h-fit text-3xl -mb-3 text-[#FFFFF0] ${isBackMenu && "text-primaryTwo"}`}><CiUser /></span>}
          </Link>

          <button
            className="block w-fit _md:hidden"
            onClick={() => handleDropdown()}
          >
            <span className={`block text-[2.5rem] text-[#FFFFF0] ${isBackMenu && "hidden"}`}><HiMenu /></span>
            <span className={`hidden text-[2.5rem] text-[#FFFFF0] ${isBackMenu && "text-primaryTwo !block"}`}><IoClose /></span>
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
}
