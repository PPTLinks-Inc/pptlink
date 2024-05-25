import { useState, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { userContext } from "../../contexts/userContext";

import Socials from "../social/socials";
import {
  ABOUT,
  DOCUMENT,
  HOME,
  LEGAL,
  SIGNUP,
  UPLOAD
} from "../../constants/routes";
import logo_orange from "/imgs/onemorecolor.png";

export default function Footer() {
  const { pathname } = useLocation();
  const { user, setUser } = useContext(userContext);
  const [getlocation] = useState(
      useLocation().pathname === "/newupload" ? true : false
  );

  return (
    <footer
      className={`footer pt-10 text-[0.8rem] ${getlocation ? "hidden" : "block"} ${pathname === "/" ? "text-black" : "text-slate-200 bg-black black_underline"} relative`}
    >
      <div className="container">
        <div className="footer_main w-full flex justify-between align-top gap-10 maxScreenMobile:flex-col mb-5">
          <div className="footerlft w-2/5 maxScreenMobile:w-full">
            <Link to={HOME} className="flogo flex flex-row justify-start items-end h-[4rem] text-[2rem] text-[#FFA500] 
                relative !baseline mb-5">
              <img src={logo_orange} alt={logo_orange} className="block w-10 aspect-square mr-3" />
              <span className="block w-fit">
                PPTLINKS
              </span>
            </Link>
            <p className="mb-5">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore  et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus
            </p>
            <Socials />
          </div>
          <div className="footerrft w-3/5 flex justify-between align-top maxScreenMobile:flex-col maxScreenMobile:w-full">
            <div>
              <h3 className="font-black mb-5">Quick Links</h3>
              <nav className="flex flex-col justify-between align-top">
                <Link
                  to={HOME}
                  className="block py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Home
                </Link>
                <NavLink
                  to={"/upload"}
                  className="block py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Upload
                </NavLink>
                <NavLink
                  to={"/signin"}
                  className={`block ${user && "hidden"} py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]`}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to={SIGNUP}
                  className={`block ${user && "hidden"} py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]`}
                >
                  Sign Up
                </NavLink>
              </nav>
            </div>
            <div>
              <h3 className="font-black mb-5 maxScreenMobile:mt-5">Dcoumentation</h3>
              <nav className="flex flex-col justify-between align-top">
                <NavLink
                  to={DOCUMENT}
                  className="block py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  All Documents
                </NavLink>
                <NavLink
                  to={ABOUT}
                  className="block py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/"
                  className="block py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  How to Use
                </NavLink>
                <NavLink
                  to={LEGAL}
                  className="block py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Legal
                </NavLink>
              </nav>
            </div>
            <div className=" w-[300px]">
              <h3 className="font-black mb-5 maxScreenMobile:mt-5">Location</h3>
              <nav className="flex flex-col justify-between align-top">
                <Link
                  to="/"
                  className="block py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1] leading-[30px]"
                >
                  You can find us at Nascomsoft in Anguwan Cashew, Off dass
                  road, opposite Elim church, 740102, Yelwa, Bauchi Nigeria
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <p className="py-5 text-center border-t-[1px] border-black border-solid">
          &copy; PPTLinks {new Date().getFullYear()}. All rights reserved
        </p>
      </div>
    </footer>
  );
}
