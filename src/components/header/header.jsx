/* eslint-disable react/prop-types */
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo_white from "/imgs/WHITE.png";
import logo_black from "/imgs/BLACK.png";
import { motion } from "framer-motion";
import { HiMenu } from "react-icons/hi";
import { CiUser } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import useUser from "../../hooks/useUser";
import Search from "../search/search.jsx";
// import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
// import { Input } from "@/components/ui/input"
import { UtilityProvider } from "../../contexts/utilityContext";
import { useTheme } from "../../hooks/useTheme";
import { useMediaQuery } from "react-responsive";

export default function Header() {
  const { dropdown, darkTheme, handleDarkTheme, handleDropdown } =
    useContext(UtilityProvider);
  const { bg, reverseBg, text, reverseText, border, isDark } = useTheme();
  const is768PxScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const location = useLocation();
  const getlocation = () => location.pathname === "/document";
  const getDashboardLocation = () => location.pathname === "/dashboard";
  const getUploadLocation = () => location.pathname === "/upload";
  const pathName = useMemo(
    () => location.pathname === "/",
    [location.pathname]
  );
  const pathNameDoc = useMemo(
    () => location.pathname.split("/")[1] === "documentation",
    [location.pathname]
  );
  // context
  const { userQuery } = useUser();
  const user = userQuery.data;

  const containertVarients = useMemo(
    () => ({
      hidden: { opacity: !pathNameDoc && 0 },
      visible: {
        opacity: 1,
        transition: { delay: pathName ? 0.5 : 1.5, duration: 1.5 }
      },
      exit: {
        x: !pathNameDoc ? "-100vw" : "0vw",
        transition: { ease: "easeInOut" }
      }
    }),
    [pathName, pathNameDoc]
  );

  return (
    <motion.header
      variants={containertVarients}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`w-full border-b-[0.1px] pt-8 pb-3 flex items-center justify-center ${bg} ${text} ${border} ${!dropdown && "z-50"}`}
    >
      <div className="container !mx-auto flex justify-between items-center relative">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 1, type: "tween" }
          }}
          viewport={{ once: true }}
          className="logo_wrapper"
        >
          <Link
            to="/"
            className="w-fit h-fit !flex !items-center !justify-center gap-2"
          >
            <img
              src={dropdown || !isDark ? logo_black : logo_white}
              alt="PPTLinks Logo"
              className="block w-8 aspect-square"
            />
            <span
              className={`block w-fit h-fit text-2xl md:text-3xl font-semibold ${dropdown || !isDark ? "text-primaryTwo" : "text-[#FFFFF0]"}`}
            >
              PPTLinks
            </span>
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
          className="w-3/5 flex flex-row justify-end !items-center gap-4 maxScreen:gap-4 maxScreenMobile:justify-end"
        >
          <button
            onClick={() => handleDarkTheme()}
            className={`static md:absolute md:-right-10 md:top-[50%] md:-translate-y-[50%] font-semibold ${text} {dropdown ? "text-primaryTwo" : "text-[#FFFFF0]"}`}
          >
            {darkTheme ? (
              <MdDarkMode size={28} />
            ) : (
              <MdOutlineDarkMode size={28} />
            )}
          </button>

          <Search dropdown={dropdown} />

          <Link
            to={
              !user
                ? "/signin"
                : getUploadLocation()
                  ? "/dashboard"
                  : getDashboardLocation()
                    ? "/create"
                    : "/dashboard"
            }
            className={`${!user && "!hidden"} !font-normal flex justify-center items-center w-fit md:px-6 md:py-[0.35rem] ${bg} md:bg-[#FFFFF0] md:border-[0.5px]  ${text}  ${border} md:text-primaryTwo md:responsiveText md:rounded-md maxScreenMobile:mb-3 md:text-nowrap $_{!dropdown ? "md:border-[#FFFFF0]" : "md:border-primaryTwo md:text-primaryTwo"}`}
          >
            <span className={`block text-sm maxScreenMobile:hidden`}>
              {!user
                ? "Sign In"
                : getUploadLocation()
                  ? "Dashboard"
                  : getDashboardLocation()
                    ? "Create Now"
                    : "Dashboard"}
            </span>
            {!user ? (
              "Sign In"
            ) : getUploadLocation() ? (
              <span className="hidden maxScreenMobile:block w-fit h-fit text-4xl -mb-3">
                <CiUser />
              </span>
            ) : getDashboardLocation() ? (
              <span
                className={`hidden maxScreenMobile:block w-fit h-fit text-3xl -mb-3 ${text} text-[#FFFFF0] ${dropdown && "text-primaryTwo"}`}
              >
                <FiUploadCloud />
              </span>
            ) : (
              <span
                className={`hidden p-1 maxScreenMobile:block w-fit h-fit text-3xl -mb-3 ${text} text-[#FFFFF0] ${dropdown && "text-primaryTwo"}`}
              >
                <CiUser />
              </span>
            )}
          </Link>

          <button
            className="block w-fit _md:hidden"
            onClick={() => handleDropdown()}
          >
            <span
              className={`block text-[2.5rem] text-[#FFFFF0] ${dropdown && "hidden"} ${text}`}
            >
              <HiMenu />
            </span>
            <span
              className={`hidden text-[2.5rem] text-[#FFFFF0] ${dropdown && "_text-primaryTwo !block"} ${text}`}
            >
              <IoClose />
            </span>
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
}
