import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useOrientation } from "react-use";
import ShareAPI from "./Share";
import { FaRegUser } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { IoCloudDownloadOutline, IoSync } from "react-icons/io5";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { PiHandWaving } from "react-icons/pi";
import { LuMessagesSquare } from "react-icons/lu";
import { MdOutlineScreenShare } from "react-icons/md";
// import { IoReturnUpBackOutline } from "react-icons/io5";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import PopUpModal from "../Models/dashboardModel";
import AsideElement from "./interfaceSharedComponents/AsideElement";
import InterfaceFooterElement from "./interfaceSharedComponents/InterfaceFooter";
import MainInterfaceElement from "./interfaceSharedComponents/MainInterface";

const hostMicStates = ["hostNeutral", "hostActive", "hostInActive"];
const usersMicStates = [
  "userNeutral",
  "userRequest",
  "userActive",
  "userInActive"
];
// ratios: side-bar 23.75(342px), main-view 73.125(1053px), spacings 3.125(45px)
export default function InterfaceView() {
  const orientation = useOrientation();
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(true);
  const [micIndex, setMicIndex] = useState(0);
  const [mic, setMic] = useState({
    hostNeutral: true,
    hostActive: false,
    hostInActive: false,
    userNeutral: false,
    userRequest: false,
    userActive: false,
    userInActive: false
  });
  const [sideBar, setSideBar] = useState(true);
  const [videoShare, setVideoShare] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [micRequest] = useState(15);
  const [chooseCoHost] = useState(15);
  const [chooseSlide] = useState(12);
  const is768PxScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const [footerClass, setFooterClass] = useState({
    interfaceFooter: true,
    inAactiveSideBarDesktop: false,
    mobileViewHost: false,
    desktopViewUsers: false,
    mobileViewUsers: false
  });
  const [liveChatAudience, setLiveChatAudience] = useState({
    audience: true,
    chats: false,
    controls: false,
    requests: false,
    coHost: false,
    chooseSlide: false,
    poll: false
  });

  const cycleMicState = useCallback(() => {
    const filteredStates = isHost ? hostMicStates : usersMicStates;
    const nextIndex = (micIndex + 1) % filteredStates.length;
    const newMic = {};
    filteredStates.forEach((key) => {
      newMic[key] = false;
    });
    newMic[filteredStates[nextIndex]] = true;
    setMic(newMic);
    setMicIndex(nextIndex);
  }, [isHost, micIndex]);

  // Keeping trak of this component's fullscreen state and mobile
  useEffect(() => {
    setFooterClass({
      interfaceFooter: sideBar && !is768PxScreen && isHost ? true : false,
      inAactiveSideBarDesktop:
        !sideBar && !is768PxScreen && isHost ? true : false,
      mobileViewHost: is768PxScreen && isHost ? true : false,
      desktopViewUsers: !is768PxScreen && !isHost ? true : false,
      mobileViewUsers: is768PxScreen && !isHost ? true : false
    });
  }, [sideBar, is768PxScreen, isHost]);

  return (
    // new interface page new design
    <div className="relative bg-black maxScreenMobile:bg-primaryTwo w-[100svw] h-[100svh] grid grid-rows-[40px_1fr] grid-cols-[1fr]">
      {/* header section */}
      <header className="w-full h-full p-1">
        <div className="w-full h-full mx-auto border-none rounded-sm flex justify-between items-center">
          <ShareAPI fitSize={true} />
          <div
            className={`w-fit h-full flex justify-center items-center gap-4 ${!orientation.type.includes("landscape") && is768PxScreen && "hidden"}`}
          >
            <h2 className="text-xl font-light text-white">Meeting with YLN</h2>
            <sub className="text-[0.7rem] text-white">By {"Imoh Omezegba"}</sub>
          </div>
          <button className="bg-[#29db29] w-fit h-full flex justify-center items-center gap-2 px-2 border-none rounded-sm text-[0.8rem] font-semibold">
            <span>2:45</span>
            <span>Live</span>
          </button>
        </div>
      </header>
      {/* main interface/footer and sideBar wrapper */}
      <div
        className={`bg-black maxScreenMobile:bg-primaryTwo grid grid-rows-[1fr] ${sideBar && !is768PxScreen ? "grid-cols-[1fr_345px]" : "grid-cols-1"}`}
      >
        {/* main interface/footer wrapper */}
        <div
          className={`w-full h-full p-1  grid grid-rows-[1fr_50px] grid-cols-[1fr] gap-1`}
        >
          {/* main interface */}
          <MainInterfaceElement
            footerClass={footerClass}
            sideBar={sideBar}
            setSideBar={setSideBar}
            is768PxScreen={is768PxScreen}
            orientation={orientation}
          />
          {/* interface footer */}
          <InterfaceFooterElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
        </div>
        {/* sideBar section */}
        <AsideElement
          footerClass={footerClass}
          sideBar={sideBar}
          is768PxScreen={is768PxScreen}
          setLiveChatAudience={setLiveChatAudience}
          liveChatAudience={liveChatAudience}
          setSideBar={setSideBar}
          micRequest={micRequest}
          isHost={isHost}
          mic={mic}
          setMic={setMic}
          videoShare={videoShare}
          setVideoShare={setVideoShare}
          screenShare={screenShare}
          setScreenShare={setScreenShare}
          cycleMicState={cycleMicState}
          chooseCoHost={chooseCoHost}
          chooseSlide={chooseSlide}
          navigate={navigate}
        />
      </div>
    </div>
  );
}
