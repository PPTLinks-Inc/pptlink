/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import MovingEllipses from "../animation/MovingEllipes";
import Header from "../header/header";
import Footer from "../footer/footer";
import Backmenu from "../backmenu/backmenu";

export default function Root() {
  // hooks
  const location = useLocation();
  // scroll to the top on route change
  const mainScrollRef = useRef(null);
  // const [getlocation] = useState(useLocation().pathname.includes("public_presentation") ? true : false);
  const keywords = ["public_presentation", "dashboard"];
  const [getlocation] = useState(
    keywords.some((keyword) => location.pathname.includes(keyword))
      ? true
      : false
  );
  // states
  const [dropdown, setDropdown] = useState(false);
  // effects
  useEffect(() => {
    setDropdown(false);

    if (mainScrollRef.current) {
      mainScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  const handleDropdown = () => {
    setDropdown((prevState) => !prevState);
  };

  return (
    <div
      className={`w-full min-h-screen bg-[#FFFFF0] relative flex-col tall:w-[1440px] tall:m-auto ${dropdown ? "overflow-y-hidden" : "overflow-y-auto"}`}
    >
      <Backmenu backmenu={dropdown} handleDropdown={handleDropdown} />
      <div
        className={`h-fit flex flex-col justify-between ${!getlocation ? "bg-[#FFFFF0]" : "bg-primaryTwo"} w-[100%] _pt-[5.5rem] absolute overflow-x-hidden  text-slate-200 ${
          dropdown
            ? "transition-transform translate-y-[100vh] top-0 lg:translate-y-[100vh]  ease-in-out"
            : "transition-transform translate-y-0 ease-in-out top-0"
        }`}
        ref={mainScrollRef}
      >
        <Header
          isBackMenu={false}
          backmenu={dropdown}
          handleDropdown={handleDropdown}
        />
        <Outlet />
        <MovingEllipses />
        {!getlocation && <Footer />}
      </div>
    </div>
  );
}
