/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import MovingEllipses from "../animation/MovingEllipes";
import Header from "../header/header";
import Footer from "../footer/footer";
import Backmenu from "../backmenu/backmenu";
import { UtilityProvider } from "../../contexts/utilityContext";

export default function Root() {
  const { dropdown, setDropdown } = useContext(UtilityProvider);
  // hooks
  const location = useLocation();
  // scroll to the top on route change
  const mainScrollRef = useRef(null);
  // effects
  useEffect(() => {
    setDropdown(false);

    if (mainScrollRef.current) {
      mainScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div
      className={`w-full min-h-screen bg-[#FFFFF0] relative flex-col tall:w-[1440px] tall:m-auto ${dropdown ? "overflow-y-hidden" : "overflow-y-auto"}`}
    >
      <Backmenu />
      <div
        className={`h-fit flex flex-col justify-between bg-[#FFFFF0] w-[100%] _pt-[5.5rem] absolute overflow-x-hidden  text-slate-200 ${dropdown
            ? "transition-transform translate-y-[100vh] top-0 lg:translate-y-[100vh]  ease-in-out"
            : "transition-transform translate-y-0 ease-in-out top-0"
          }`}
        ref={mainScrollRef}
      >
        <Header
          isBackMenu={false}
        />
        <Outlet />
        <MovingEllipses />
        <Footer />
      </div>
    </div>
  );
}
