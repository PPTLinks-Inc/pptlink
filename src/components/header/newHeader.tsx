import { useState } from "react";
import logo_white from "/imgs/WHITE.png";
import { HiMenu } from "react-icons/hi";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import useUser from "../../hooks/useUser";

export default function NewHeader({ scrolled }: { scrolled: boolean }) {
  const [menu, handleMenu] = useState(false);
  const { text } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const { userQuery } = useUser();
  const user = userQuery.data;

  const container = {
    hidden: prefersReducedMotion ? {} : { opacity: 0 },
    show: prefersReducedMotion
      ? {}
      : {
          opacity: 1,
          transition: { staggerChildren: 0.18, delayChildren: 0.12 }
        }
  };

  const fadeUp = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    show: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full border-none pt-8 maxScreenMobile:pt-6 maxScreenMobile:pb-2 pb-3 flex items-center justify-center z-50 transition-colors duration-300 ${scrolled ? "bg-gradient-to-r from-black to-[#00000000]" : "bg-transparent"} ${text} maxScreenMobile:bg-black maxScreenMobile:[box-shadow:0_0_65px_28px_rgba(0,0,0,0.231),0_0_65px_35px_rgba(0,0,0,0),inset_0_-5px_10px_-5px_rgba(255,255,255,0.25)]`}
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="container !mx-auto flex justify-start md:gap-44 maxScreenMobile:gap-4 maxScreenMobile:_w-full items-center relative maxScreenMobile:!static maxScreenMobile:justify-between"
        >
          <motion.div
            variants={fadeUp}
            className="logo_wrapper maxScreenMobile:z-20"
          >
            <Link
              to="/"
              className="w-fit h-fit !flex !items-center !justify-center gap-2"
            >
              <img
                src={logo_white}
                alt="PPTLinks Logo"
                className="block w-8 aspect-square"
              />
              <span
                className={`block w-fit h-fit text-2xl md:text-3xl font-semibold ${"text-[#FFFFF0]"}`}
              >
                PPTLinks
              </span>
            </Link>
          </motion.div>

          <motion.nav
            variants={fadeUp}
            className={`w-fit flex flex-row justify-between items-center gap-20 maxScreenMobile:gap-4 maxScreenMobile:w-full maxScreenMobile:justify-evenly maxScreenMobile:flex-col maxScreenMobile:absolute maxScreenMobile:top-0 maxScreenMobile:left-0 maxScreenMobile:right-0 maxScreenMobile:px-0 maxScreenMobile:pb-4 maxScreenMobile:bg-black maxScreenMobile:z-10 maxScreenMobile:pt-[76px] ${menu ? "maxScreenMobile:flex" : "maxScreenMobile:hidden"}`}
          >
            <Link
              to={"#"}
              className="text-white text-md font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray maxScreenMobile:block maxScreenMobile:w-full maxScreenMobile:text-center maxScreenMobile:py-2"
            >
              Pricing
            </Link>
            <Link
              to={"#"}
              className="text-white text-md font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray maxScreenMobile:block maxScreenMobile:w-full maxScreenMobile:text-center maxScreenMobile:py-2"
            >
              About
            </Link>
            <Link
              to={user ? "/signout" : "/signin"}
              className="text-white text-md font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray maxScreenMobile:block maxScreenMobile:w-full maxScreenMobile:text-center maxScreenMobile:py-2"
            >
              {user ? "Logout" : "Login"}
            </Link>
          </motion.nav>
          <button
            type="button"
            title="menu"
            onClick={() => handleMenu(!menu)}
            className="hidden w-fit h-fit p-2 text-white maxScreenMobile:block maxScreenMobile:z-20"
          >
            <HiMenu size={28} />
          </button>
        </motion.div>
      </header>
    </>
  );
}
