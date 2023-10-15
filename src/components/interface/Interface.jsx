/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import "./interface.css";
import { FaHome, FaDownload, FaSync } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./layout/Header";
import { Carousel } from "./layout/Carousel";
import axios from "axios";
import io from "socket.io-client";
import { LoadingAssetBig2 } from "../../assets/assets";
import { isIOS } from "react-device-detect";

import { Spinner, SpinnerIos } from "./layout/assets/spinner/Spinner";

import { SERVER_URL } from "../../constants/routes";

const socket = io(SERVER_URL);

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
 
];
let mobileHeader;

if (window.innerWidth < 900) {
  mobileHeader = false;
} else {
  mobileHeader = true;
}

let requestCurrentIndex = true;
let socketId = null;

function Interface() {
  const controller = new AbortController();
  const [navbar, setNavbar] = useState(false);

  const [presentation, setPresentation] = useState(null);

  const params = useParams();

  const handleNavBar = (item) => {
    setNavbar(item);
  };

  useEffect(() => {
    console.log(socket.connected);

    socket.on("client-live", (live) => {
      requestCurrentIndex = false;
      setPresentation((prev) => ({ ...prev, live }));
    });

    socket.on("socketId", (id) => {
      socketId = id;
    });
  }, []);

  useEffect(() => {
    if (socket.connected && presentation) {
      socket.emit("join-presentation", {
        liveId: params.id,
        user: presentation.User,
        socketId
      });
    }
  }, [presentation]);

  useEffect(() => {
    axios
      .get(`/api/v1/ppt/presentations/present/${params.id}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        controller.abort();
        setPresentation(data.presentation);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [livePending, setLivePending] = useState(false);

  const makeLive = () => {
    if (presentation) {
      setLivePending(true);
      axios
        .put(`/api/v1/ppt/presentations/make-live/${presentation.id}`, {
          data: !presentation.live,
        })
        .then(({ data }) => {
          if (socket.connected) {
            socket.emit("client-live", {
              liveId: params.id,
              live: !presentation.live,
            });
          }
          setPresentation((prev) => ({ ...prev, live: !prev.live }));
          setLivePending(false);
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
          livePending={livePending}
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
                socket={socket}
                livePending={livePending}
                requestIndex={requestCurrentIndex}
                socketId={socketId}
              />
            ) : !isIOS ? (
              <Spinner />
            ) : (
              <SpinnerIos />
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
