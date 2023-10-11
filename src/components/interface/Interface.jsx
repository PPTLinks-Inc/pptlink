/* eslint-disable no-unused-vars */

import "./interface.css";
import { FaHome, FaDownload, FaSync } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./layout/Header";
import { Carousel } from "./layout/Carousel";
import axios from "axios";
import { LoadingAssetBig2 } from "../../assets/assets";
import Spinner from "./layout/assets/spinner/Spinner";

const navItems = [
  {
    name: "download",
    icon: <FaDownload className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "home",
    icon: <FaHome className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "sync",
    icon: <FaSync className="text-2xl relative z-10" />,
    link: "/",
  },
];
let mobileHeader;

if (window.innerWidth < 900) {
  mobileHeader = false;
} else {
  mobileHeader = true;
}

function Interface() {
  const controller = new AbortController();
  const [navbar, setNavbar] = useState(false);

  const [presentation, setPresentation] = useState(null);

  const params = useParams();

  const handleNavBar = (item) => {
    setNavbar(item);
  };

  useEffect(() => {
    axios
      .get(`/api/v1/ppt/presentations/present/${params.id}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        controller.abort();
        setPresentation(data.presentation);
        console.log(data.presentation);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const makeLive = () => {
    if (presentation) {
      axios
        .put(`/api/v1/ppt/presentations/make-live/${presentation.id}`, {
          data: !presentation.live,
        })
        .then(({ data }) => {
          setPresentation((prev) => ({ ...prev, live: !prev.live }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <main
      className={`overflow-hidden min-h-screen  relative duration-300 transition-all bg-black md:overflow-auto `}
    >
      {mobileHeader && (
        <Header
          handleNavBar={handleNavBar}
          presentation={presentation}
          makeLive={makeLive}
        />
      )}
      {/* navigation */}
      {/* body */}
      <section
        className={`main-body ${navbar ? "" : "active"} w-full ${
          mobileHeader && "px-0"
        }  rounded-2xl relative  transition-all duration-500 bg-white`}
      >
        {presentation ? (
          <div className=" h-fit min-h-[100%]">
            {presentation.live || presentation.User === "HOST" ? (
              <Carousel
                nav={{ navbar, setNavbar, navItems }}
                presentation={presentation}
                makeLive={makeLive}
              />
            ) : (
              <Spinner/>

)}
          </div>
        ) : (
          <div className="w-full h-[85vh] flex justify-center bg-black items-center">
            <LoadingAssetBig2 />
          </div>
        )}
      </section>
    </main>
  );
}

export default Interface;
