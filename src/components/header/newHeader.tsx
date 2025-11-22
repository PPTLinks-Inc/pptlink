import { useState } from "react";
import logo_white from "/imgs/WHITE.png";
import { HiMenu } from "react-icons/hi";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import useUser from "../../hooks/useUser";
import { useMediaQuery } from "react-responsive";
import { GoSignOut } from "react-icons/go";

export default function NewHeader({ scrolled }: { scrolled: boolean }) {
  const is768PxScreen = useMediaQuery({ query: "(max-width: 768px)" });
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

  // Simple vertical fade animation
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full border-none pt-8 maxScreenMobile:pt-6 maxScreenMobile:pb-2 pb-3 flex items-center justify-center z-50 transition-colors duration-300 ${scrolled ? "bg-gradient-to-r from-black to-[#00000000]" : "bg-transparent"} ${text} _maxScreenMobile:_bg-black maxScreenMobile:_[box-shadow:0_0_65px_28px_rgba(0,0,0,0.231),0_0_65px_35px_rgba(0,0,0,0),inset_0_-5px_10px_-5px_rgba(255,255,255,0.25)]`}
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

          {/* Desktop Navigation */}
          <motion.nav
            variants={fadeUp}
            className="w-fit flex flex-row justify-between items-center gap-20 maxScreenMobile:gap-4 maxScreenMobile:hidden"
          >
            <Link
              to={"#"}
              className="text-white text-md font-semibold"
            >
              Pricing
            </Link>
            <Link
              to={"#"}
              className="text-white text-md font-semibold"
            >
              About
            </Link>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="text-white text-md font-semibold"
            >
              {user ? "Dashboard" : "Sign Up"}
            </Link>
          </motion.nav>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {menu && (
              <motion.nav
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className={`w-fit flex flex-row justify-between items-center gap-20 maxScreenMobile:gap-4 maxScreenMobile:w-full maxScreenMobile:justify-evenly maxScreenMobile:flex-col maxScreenMobile:absolute maxScreenMobile:top-0 maxScreenMobile:left-0 maxScreenMobile:right-0 maxScreenMobile:px-0 maxScreenMobile:bg-black/95 maxScreenMobile:z-10 maxScreenMobile:pt-[76px]`}
              >
                <Link
                  to={"#"}
                  className="text-white text-md font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray/5 maxScreenMobile:block maxScreenMobile:w-5/6 maxScreenMobile:mx-auto maxScreenMobile:text-center maxScreenMobile:py-2"
                  onClick={() => handleMenu(false)}
                >
                  Pricing
                </Link>
                <Link
                  to={"#"}
                  className="text-white text-md font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray/5 maxScreenMobile:block maxScreenMobile:w-5/6 maxScreenMobile:mx-auto maxScreenMobile:text-center maxScreenMobile:py-2"
                  onClick={() => handleMenu(false)}
                >
                  About
                </Link>
                {<Link
                  to={user ? "/dashboard" : "/signup"}
                  className="text-white text-md font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray/5 maxScreenMobile:block maxScreenMobile:w-5/6 maxScreenMobile:mx-auto maxScreenMobile:text-center maxScreenMobile:py-2"
                  onClick={() => handleMenu(false)}
                >
                  {user ? "Dashboard" : "Sign Up"}
                </Link>}
              </motion.nav>
            )}
          </AnimatePresence>

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