import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Socials from "../social/socials";
import {
  ABOUT,
  DOCUMENT,
  HOME,
  LEGAL,
  SIGNUP,
  PRIVACY_POLICY,
  TERMS_AND_SERVICES
} from "../../constants/routes";
import logo_orange from "/imgs/onemorecolor.png";
import useUser from "../../hooks/useUser";
import { useTheme } from "../../hooks/useTheme";

export default function Footer() {
  const { pathname } = useLocation();
  const { userQuery } = useUser();
  const user = userQuery.data;
  const { bg, text, border, isDark } = useTheme();
  const [getlocation] = useState(
    useLocation().pathname === "/newupload" ? true : false
  );

  return (
    <footer
      className={`footer pt-10 responsiveText ${getlocation ? "hidden" : "block"} ${pathname === "/" ? "text-primaryTwo" : "text-slate-200 bg-primaryTwo black_underline"} relative`}
    >
      <div className="container">
        <div className="footer_main w-full flex justify-between align-top gap-10 maxScreenMobile:flex-col mb-5">
          <div className="footerlft w-2/5 maxScreenMobile:w-full">
            <Link
              to={HOME}
              className="flogo flex flex-row justify-start items-end h-[4rem] text-[2rem] text-[#FFA500] 
                relative !baseline mb-5"
            >
              <img
                src={logo_orange}
                alt={logo_orange}
                className="block w-10 aspect-square mr-3"
              />
              <span className="block w-fit">PPTLINKS</span>
            </Link>
            <p className="mb-5 responsiveText">
              PPTLinks is your go-to source for presentation, inspiration,
              resource and expertise. Explore our vast library, collaborate with
              our community and achieve your goal with confidence.
            </p>
            <Socials />
          </div>
          <div className="footerrft w-3/5 flex justify-between gap-4 align-top maxScreenMobile:flex-col maxScreenMobile:w-full">
            <div>
              <h3 className="font-black mb-5 text-[1.2rem]">Quick Links</h3>
              <nav className="flex flex-col justify-between align-top">
                <Link
                  to={HOME}
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Home
                </Link>
                <NavLink
                  to={"/upload"}
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Upload
                </NavLink>
                <NavLink
                  to={"/signin"}
                  className={`block !responsiveText ${user && "hidden"} py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]`}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to={SIGNUP}
                  className={`block !responsiveText ${user && "hidden"} py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]`}
                >
                  Sign Up
                </NavLink>
              </nav>
            </div>
            <div>
              <h3 className="font-black mb-5 text-[1.2rem] maxScreenMobile:mt-5">
                Documentation
              </h3>
              <nav className="flex flex-col justify-between align-top">
                <NavLink
                  to={DOCUMENT}
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  All Documents
                </NavLink>
                <NavLink
                  to={ABOUT}
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/"
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  How to Use
                </NavLink>
                {/* <NavLink
                  to={TERMS_AND_SERVICES}
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Legal
                </NavLink> */}
                <NavLink
                  to={TERMS_AND_SERVICES}
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Terms and Services
                </NavLink>
                <NavLink
                  to={PRIVACY_POLICY}
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Privacy Policy
                </NavLink>
                {/* <a
                  href="https://docs.google.com/document/d/1-J6j0Pt7fjS479twAPzObB7sJxNztgEE4OO_kPL2YJE/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Terms of Service
                </a> */}
                {/* <a
                  href="https://docs.google.com/document/d/1-cqT7rNCgf2C0a67PS_Z4yql6fkgPp2pOhLDPayH5rc/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1]"
                >
                  Privacy Policy
                </a> */}
              </nav>
            </div>
            <div className="w-[300px]">
              <h3 className="font-black mb-5 text-[1.2rem] maxScreenMobile:mt-5">
                Location
              </h3>
              <nav className="flex flex-col justify-between align-top">
                <Link
                  to="/"
                  className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-primaryTwo before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1] leading-[30px]"
                >
                  You can find us at Nascomsoft in Anguwan Cashew, Off dass
                  road, opposite Elim church, 740102, Yelwa, Bauchi Nigeria
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <p
          className={`py-5 text-center border-t-[1px] ${pathname === "/" ? "border-black" : "border-white"} border-solid responsiveText`}
        >
          &copy; PPTLinks {new Date().getFullYear()}. All rights reserved
        </p>
      </div>
    </footer>
  );
}
