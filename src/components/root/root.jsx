/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Outlet } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import { DASHBOARD, LOGIN, UPLOAD } from "../../constants/routes";
import { userContext } from "../../contexts/userContext";
import axios from "axios";
import MovingEllipses from "../animation/MovingEllipes";
import Header from "../header/header";
import Footer from "../footer/footer";
import Backmenu from "../backmenu/backmenu";
// import { MdModelTraining } from "react-icons/md";

export default function Root() {
  const controller = new AbortController();
  // context
  const { user } = useContext(userContext);
  // hooks
  const location = useLocation();
  const navigate = useNavigate();
  // scroll to the top on route change
  const mainScrollRef = useRef(null);
  // const [getlocation] = useState(useLocation().pathname.includes("public_presentation") ? true : false);
  const keywords = ["public_presentation", "dashboard"];
  const [getlocation] = useState(keywords.some(keyword => location.pathname.includes(keyword)) ? true : false);
  useEffect(() => {
    setPage({ ...page, dropdown: false });

    if (mainScrollRef.current) {
      mainScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  const [page, setPage] = useState({
    dropdown: false,

    email: "",
    message: "",

    submitPending: false,
    submitErrors: []
  });

  const handleDropdown = () => {
    setPage((prev) => ({ ...prev, dropdown: !prev.dropdown }));
  };

  let tempArr = [];
  const submitValidation = () => {
    tempArr = [];

    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        page.email
      )
    ) {
      tempArr = [...tempArr, "Your Email is not Valid"];
    }

    if (page.message.length < 7) {
      tempArr = [
        ...tempArr,
        "Your message is too short, we want to hear more from you"
      ];

      setPage({ ...page, submitErrors: tempArr });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    submitValidation();
    if (tempArr.length === 0) {
      const sendData = { email: page.email, message: page.message };

      setPage({ ...page, submitPending: true, submitErrors: tempArr });

      axios
        .post("the route", {
          signal: controller.signal
        })
        .then(({ data }) => {
          setPage({
            ...page,
            submitPending: false,
            submitSuccess: data.successMessage
          });

          controller.abort();
        })
        .catch((err) => {
          setPage({
            ...page,
            submitPending: false,
            submitErrors: [err.response.message]
          });
        });
    }
  };

  const PresentButton = ({ color }) => {
    const handleClick = () => {
      if (!user) return navigate(LOGIN);
      if (user && user.presentations < 1) return navigate(UPLOAD);
      if (user.presentations > 0) return navigate(DASHBOARD);
    };

    return (
      <button
        className={`px-7 rounded-xl py-1 ${color === "black"
          ? " bg-black text-slate-200"
          : "bg-slate-200 text-black"
          }`}
        onClick={() => handleClick()}
      >
        Present
      </button>
    );
  };

  return (
    <div
      className={`w-full min-h-screen bg-[#FFFFF0] relative flex-col tall:w-[1440px] tall:m-auto ${page.dropdown ? "overflow-y-hidden" : "overflow-y-auto"}`}
    >
      <Backmenu handleDropdown={handleDropdown} />
      <div
        className={`h-fit flex flex-col justify-between ${!getlocation ? "bg-[#FFFFF0]" : "bg-black"} w-[100%] _pt-[5.5rem] absolute overflow-x-hidden  text-slate-200 ${page.dropdown
          ? "transition-transform translate-y-[100vh] top-0 lg:translate-y-[100vh]  ease-in-out"
          : "transition-transform translate-y-0 ease-in-out top-0"
          }`}
        ref={mainScrollRef}
      >
        <Header isBackMenu={false} handleDropdown={handleDropdown} />
        <Outlet />
        <MovingEllipses />
        {!getlocation && <Footer />}
      </div>
    </div>
  );
}
