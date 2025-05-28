import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useFullscreen, useOrientation } from "react-use";
import ShareAPI from "./Share";
import { FaRegUser } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { IoCloudDownloadOutline, IoSync } from "react-icons/io5";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import { CiVideoOff } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { PiHandWaving } from "react-icons/pi";
import { LuMessagesSquare } from "react-icons/lu";
import { MdOutlineScreenShare } from "react-icons/md";
// import { IoReturnUpBackOutline } from "react-icons/io5";
import { IoImages } from "react-icons/io5"; //IoSendOutline
import { MdOutlineStopScreenShare } from "react-icons/md";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiOutlineSend } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { LiaPenNibSolid } from "react-icons/lia";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { CgFileAdd } from "react-icons/cg";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CgPoll } from "react-icons/cg";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FaAngleRight } from "react-icons/fa6";

// enum SIDEBAR_STATES {
//   LIVE_AUDIENCE = "AUDIENCE",
//   LIVE_CHAT = "CHATS",
//   CONTROLS = "CONTROLS"
// }
// ratios: side-bar 23.75(342px), main-view 73.125(1053px), spacings 3.125(45px)
export default function InterfaceView() {
  // const { orientation } = useOrientation();
  const navigate = useNavigate();
  const [mic, setMic] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const [videoShare, setVideoShare] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [micRequest, setMicRequest] = useState(15);
  const [chooseCoHost, setChooseCoHost] = useState(15);
  const [chooseSlide, setChooseSlide] = useState(12);
  const [liveChatAudience, setLiveChatAudience] = useState({
    audience: true,
    chats: false,
    controls: false,
    requests: false,
    coHost: false,
    chooseSlide: false
  });

  return (
    // new interface page
    <div className="relative bg-black w-[100svw] h-[100svh] grid grid-rows-[40px_1fr] grid-cols-[1fr]">
      {/* header section */}
      <header className="w-full h-full p-1">
        <div className="w-full h-full mx-auto border-none rounded-sm flex justify-between items-center">
          <ShareAPI fitSize={true} />
          <div className="w-fit h-full flex justify-center items-center gap-4">
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
        className={`bg-black grid ${sideBar ? "grid-cols-[1fr_345px]" : "grid-cols-1"} grid-rows-[1fr]`}
      >
        {/* main interface/footer wrapper */}
        <div
          className={`w-full h-full p-1  grid grid-rows-[1fr_50px] grid-cols-[1fr] gap-1`}
        >
          {/* main interface */}
          <div className="relative w-full h-full bg-[white] border-none rounded-sm">
            <button
              onClick={() => alert("Sync... in progress")}
              className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl absolute bottom-4 right-20"
            >
              <IoSync color="white" size={28} />
            </button>
            <button
              onClick={() => setSideBar(!sideBar)}
              className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl absolute bottom-4 right-6"
            >
              {sideBar ? (
                <RxEnterFullScreen color="white" size={28} />
              ) : (
                <RxExitFullScreen color="white" size={28} />
              )}
            </button>
            {/* slider component goes here (ppt file slider) */}
            <div className="slider-view w-full h-full bg-[gray]"></div>
          </div>
          {/* interface footer */}
          <footer className="w-full h-full">
            {/* interface footer wrapper */}
            <div className="bg-[blue]_ w-[98%] h-full mx-auto border-none rounded-sm flex justify-between items-center">
              {/* first button section */}
              <div className="w-fit h-full flex justify-between items-center gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl"
                >
                  <FiHome size={24} />
                </button>
                <button className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl">
                  <IoCloudDownloadOutline size={24} />
                </button>
              </div>
              {/* second button section */}
              <div className="w-fit h-full flex justify-between items-center gap-2">
                <button
                  onClick={() =>
                    confirm(
                      `Are you sure you want to ${!screenShare ? "share" : "stop sharing"} your screen?`
                    )
                      ? setScreenShare(!screenShare)
                      : ""
                  }
                  className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl"
                >
                  {!screenShare ? (
                    <MdOutlineScreenShare size={24} />
                  ) : (
                    <MdOutlineStopScreenShare size={24} />
                  )}
                </button>
                {!sideBar && (
                  <button
                    onClick={() => setSideBar(true)}
                    className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl relative"
                  >
                    <span className="text-white text-xs flex justify-center items-center absolute -top-3 -right-3 border-none rounded-full p-1">
                      99+
                    </span>
                    <FaRegUser size={24} />
                  </button>
                )}
                <button
                  onClick={() => setMic(!mic)}
                  className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${mic ? "bg-orange-500" : "bg-gray-300"} hover:scale-[1.1] text-white text-xl`}
                >
                  {mic ? <PiHandWaving size={24} /> : <IoIosMic size={24} />}
                </button>
                <button
                  onClick={() => {
                    setLiveChatAudience({
                      audience: false,
                      chats: true,
                      controls: false,
                      requests: false,
                      coHost: false,
                      chooseSlide: false
                    });
                    setSideBar(true);
                  }}
                  className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl"
                >
                  <LuMessagesSquare size={24} />
                </button>
                <button
                  onClick={() => {
                    setLiveChatAudience({
                      audience: false,
                      chats: false,
                      controls: true,
                      requests: false,
                      coHost: false,
                      chooseSlide: false
                    });
                    setSideBar(true);
                  }}
                  className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl"
                >
                  <BsThreeDots size={24} />
                </button>
              </div>
              {/* third button section */}
              <button
                onClick={() => confirm("Are you sure you want to End session?")}
                className="bg-[#ff0000] w-16 h-[70%] flex justify-center items-center gap-2 px-2 border-none rounded-sm text-[0.8rem] font-semibold"
              >
                <MdCallEnd size={32} />
              </button>
            </div>
          </footer>
        </div>
        {/* sideBar section */}
        <div className={`w-full h-full p-1 ${!sideBar && "hidden"}`}>
          {/* sideBar wrapper */}
          <div className="w-full min-h-full grid grid-cols-[1fr] grid-rows-[20px_1fr] gap-1 relative">
            <button
              onClick={() => {
                setLiveChatAudience(
                  liveChatAudience.controls
                    ? {
                        audience: false,
                        chats: false,
                        controls: false,
                        requests: false,
                        coHost: false,
                        chooseSlide: false
                      }
                    : {
                        audience: false,
                        chats: false,
                        controls: true,
                        requests: false,
                        coHost: false,
                        chooseSlide: false
                      }
                );
                setSideBar(!liveChatAudience.controls ? true : false);
              }}
              className={`text-white ${!(liveChatAudience.controls || liveChatAudience.coHost || liveChatAudience.chooseSlide) ? "hidden" : "block"} w-fit h-fit p-1 border-none rounded-sm absolute top-8 right-2 z-10`}
            >
              <IoClose size={20} />
            </button>
            {/* SideBar toggle for Live audience and chat */}
            <div className="w-full h-full border-none rounded-sm grid grid-cols-2 grid-rows-1 gap-1">
              <span
                onClick={() => {
                  setLiveChatAudience({
                    audience: true,
                    chats: false,
                    controls: false,
                    requests: false,
                    coHost: false,
                    chooseSlide: false
                  });
                  setSideBar(true);
                }}
                className="flex w-full h-full justify-center items-center relative cursor-pointer"
              >
                <span
                  className={`${liveChatAudience.audience && "bg-primaryTwo"} border-none rounded-sm text-white text-xs flex justify-center items-center w-full h-full`}
                >
                  <span className="mr-1">Live Audience</span>
                  <span
                    className={`${liveChatAudience.audience ? "bg-black" : "bg-primaryTwo"} border-none rounded-sm text-[0.6rem] inline-block py-[0.5px] px-[2px]`}
                  >
                    99+
                  </span>
                </span>
              </span>
              <span
                onClick={() => {
                  setLiveChatAudience({
                    audience: false,
                    chats: true,
                    controls: false,
                    requests: false,
                    coHost: false,
                    chooseSlide: false
                  });
                  setSideBar(true);
                }}
                className="flex w-full h-full justify-center items-center relative cursor-pointer"
              >
                <span
                  className={`${liveChatAudience.chats && "bg-primaryTwo"} border-none rounded-sm text-white text-xs flex justify-center items-center w-full h-full`}
                >
                  <span className="mr-1">Live Chat</span>
                  <span
                    className={`${liveChatAudience.chats ? "bg-black" : "bg-primaryTwo"} border-none rounded-sm text-[0.6rem] inline-block py-[0.5px] px-[2px]`}
                  >
                    99+
                  </span>
                </span>
              </span>
            </div>
            {/* ********Live Audiences section********* */}
            <div
              className={`w-full h-full ${!liveChatAudience.audience ? "hidden" : "grid"} grid-cols-[1fr] grid-rows-[50px_minmax(50px,auto)_1fr] gap-1`}
            >
              {/* host user section */}
              <div className="w-full h-full bg-primaryTwo border-none rounded-sm">
                <div className="w-full h-full flex justify-between items-center gap-2 p-2">
                  <div className="flex justify-center items-center gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${2}`}
                        alt="Host"
                      />
                      <AvatarFallback>
                        <span className="text-white text-xs">Imoh</span>
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-xs block w-fit h-fit">
                      Amem
                    </span>
                    <span className="text-white text-[0.6rem] bg-black px-2 py-[1px] flex justify-center items-center w-fit h-fit border-none rounded-sm">
                      Host
                    </span>
                  </div>
                  <div className="w-fit h-full flex justify-between items-center gap-2">
                    <button
                      onClick={() => setMic(!mic)}
                      className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${!mic ? "bg-[#ff00005f]" : "bg-[#00800071]"} hover:scale-[1.1] text-white text-xl`}
                    >
                      {mic ? <IoIosMic size={24} /> : <IoIosMicOff size={24} />}
                    </button>
                    <button
                      onClick={() => setVideoShare(!videoShare)}
                      className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${!videoShare ? "bg-[#ff00005f]" : "bg-[#00800071]"} hover:scale-[1.1] text-white text-xl`}
                    >
                      {videoShare ? (
                        <CiVideoOn size={24} />
                      ) : (
                        <CiVideoOff size={24} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {/* mic requests section 1 */}
              <div className="w-full h-fit bg-black">
                <div className="w-full h-fit flex justify-between items-center">
                  <p className="text-white text-xs pt-2 pb-3">Mic requests</p>
                  {micRequest && (
                    <button
                      onClick={() =>
                        setLiveChatAudience({
                          audience: false,
                          chats: false,
                          controls: false,
                          requests: true,
                          coHost: false,
                          chooseSlide: false
                        })
                      }
                      className="block w-fit h-fit bg-primaryTwo py-0.5 px-2 text-white text-[0.6rem] border-none rounded-sm cursor-pointer"
                    >
                      {micRequest > 2 ? "See more" : ""} ({micRequest})
                    </button>
                  )}
                </div>
                <div className="w-full h-fit bg-primaryTwo border-none rounded-sm">
                  {/* users avaters here as lists: request to speak users, yet to be accepted */}
                  <ScrollArea className="h-full w-full border-none">
                    {!micRequest ? (
                      <p className="text-gray-400 text-xs w-full h-full flex justify-center items-center p-5">
                        No mic requests
                      </p>
                    ) : (
                      Array.from(
                        { length: Math.min(2, micRequest) },
                        (_, index) => (
                          <div
                            key={`user-${index}`}
                            className="w-full h-full flex justify-between items-center gap-2 p-2"
                          >
                            <div className="flex justify-center items-center gap-2">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                                  alt={`User ${index + 1}`}
                                />
                                <AvatarFallback>
                                  <span className="text-white text-xs">{`User ${index + 1}`}</span>
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white text-xs block w-fit h-fit">
                                {`User ${index + 1}`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <button className="text-white text-xs bg-[#00800071] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm">
                                Accept
                              </button>
                              <button className="text-white text-xs bg-[#ff00005f] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm">
                                Decline
                              </button>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </ScrollArea>
                  {/* end of users requests */}
                </div>
              </div>
              {/* users in attendance */}
              <div className="w-full h-full bg-primaryTwo border-none rounded-sm overflow-hidden">
                <ScrollArea
                  className={`${micRequest <= 1 ? "h-[calc(100vh-225px)]" : "h-[calc(100vh-280px)]"} w-full border-none`}
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <div
                      key={`user-${index}`}
                      className="w-full h-full flex justify-between items-center gap-2 p-2"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                            alt="Host"
                          />
                          <AvatarFallback>
                            <span className="text-white text-xs">Imoh</span>
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-xs block w-fit h-fit">
                          {`User ${index + 1}`}
                        </span>
                      </div>
                      <div className="w-fit h-full flex justify-between items-center gap-2">
                        <button
                          onClick={() => setMic(!mic)}
                          className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${!mic ? "bg-[#ff00005f]" : "bg-[#00800071]"} hover:scale-[1.1] text-white text-xl`}
                        >
                          {mic ? (
                            <IoIosMic size={24} />
                          ) : (
                            <IoIosMicOff size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
            {/* *******Live Chats section************* */}
            <div
              className={`w-full h-full ${!liveChatAudience.chats ? "hidden" : "grid"} grid-cols-[1fr] grid-rows-[1fr_45px] gap-1 bg-primaryTwo border-none rounded-sm`}
            >
              {/* users chat display */}{" "}
              <div className="w-full h-full border-none rounded-sm overflow-hidden">
                {/* users live chats start */}
                <div className="w-full h-full bg-primaryTwo border-none rounded-sm overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-130px)] w-full border-none">
                    {Array.from({ length: 10 }, (_, index) => (
                      <div
                        key={`user-${index}`}
                        className="w-full h-full flex justify-between items-center gap-2 p-2"
                      >
                        <div className="flex justify-center items-start gap-2">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                              alt="Host"
                            />
                            <AvatarFallback>
                              <span className="text-white text-xs">Imoh</span>
                            </AvatarFallback>
                          </Avatar>
                          <div className="w-full h-fit mt-[0.8rem]">
                            <div className="flex justify-start items-center gap-2">
                              <span className="text-white text-xs block w-fit h-fit">
                                {`User ${index + 1}`}
                              </span>
                              <span className="text-[gray] text-xs font-extralight block w-fit h-fit italic">
                                02:47 am
                              </span>
                            </div>
                            <p className="w-5/6 h-fit text-white text-xs bg-black px-2 py-1.5 mt-2 border-none rounded-sm">
                              Will of time, hope fore tomorrow... Lorem ipsum
                              dolor sit amet consectetur adipisicing elit.
                              Voluptatibus eligendi soluta, fuga repellendus
                              nihil incidunt! lorem
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                {/* users live chats end */}
              </div>
              {/* chat img-picker & input */}
              <div className="border-none w-full h-full grid grid-cols-[40px_1fr] grid-rows-[40px] gap-1 justify-evenly items-center px-1">
                <label
                  htmlFor="filePicker"
                  className="flex justify-center items-center w-full aspect-square bg-[red]_ border-none rounded-sm relative cursor-pointer"
                >
                  <input
                    type="file"
                    name="filePicker"
                    id="filePicker"
                    className="absolute -top-1 -left-1 w-0 h-0 opacity-0"
                    accept="*"
                  />
                  <IoImages size={28} className="w-full h-full" />
                </label>
                <span className="block w-[80%]_ w-full h-full relative py-[2.5px]">
                  <input
                    type="text"
                    className="block w-full h-full border-none rounded-sm py-1.5 indent-2 bg-black text-white text-xs"
                    placeholder="Send a message.."
                  />
                  <button className="absolute right-0 top-0 translate-y-0 text-white block w-fit h-full border-none rounded-sm p-1">
                    <AiOutlineSend size={20} />
                  </button>
                </span>
              </div>
            </div>
            {/* ******Controls for three Dots********** */}
            <div
              className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience.controls ? "hidden" : "grid"}`}
            >
              <ScrollArea className="h-[calc(100vh-150px)] w-full border-none pt-12 pb-2 px-2">
                <Label
                  htmlFor="pen-label"
                  className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
                >
                  <span className="flex justify-start items-center gap-2">
                    <LiaPenNibSolid size={20} />
                    <span className="text-sm">Pen</span>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <Switch id="pen-label" />
                  </span>
                </Label>
                <Label
                  htmlFor="music-label"
                  className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
                >
                  <span className="flex justify-start items-center gap-2">
                    <IoMusicalNotesOutline size={20} />
                    <span className="text-sm">Music</span>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <Switch id="music-label" />
                  </span>
                </Label>
                <Label
                  htmlFor="ping-label"
                  className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
                >
                  <span className="flex justify-start items-center gap-2">
                    <GoBell size={20} />
                    <span className="text-sm">Ping audience</span>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <Switch id="ping-label" />
                  </span>
                </Label>
                <button
                  onClick={() =>
                    setLiveChatAudience({
                      audience: false,
                      chats: false,
                      controls: false,
                      requests: false,
                      coHost: false,
                      chooseSlide: true
                    })
                  }
                  className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
                >
                  <span className="flex justify-start items-center gap-2">
                    <CgFileAdd size={20} />
                    <span className="text-sm">Add slides</span>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <FaAngleRight id="ping-label" />
                  </span>
                </button>
                <button
                  onClick={() =>
                    setLiveChatAudience({
                      audience: false,
                      chats: false,
                      controls: false,
                      requests: false,
                      coHost: true,
                      chooseSlide: false
                    })
                  }
                  className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
                >
                  <span className="flex justify-start items-center gap-2">
                    <AiOutlineUsergroupAdd size={20} />
                    <span className="text-sm">Co-host</span>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <FaAngleRight id="ping-label" />
                  </span>
                </button>
                <button className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9">
                  <span className="flex justify-start items-center gap-2">
                    <CgPoll size={20} />
                    <span className="text-sm">Poll</span>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <FaAngleRight id="ping-label" />
                  </span>
                </button>
              </ScrollArea>
            </div>
            {/* ******Mic Requests section 2 ********** */}
            <div
              className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience.requests ? "hidden" : "grid"}`}
            >
              {" "}
              <ScrollArea className="h-[calc(100vh-75px)] w-full border-none px-2">
                {!micRequest ? (
                  <p className="text-gray-400 text-xs w-full h-full flex justify-center items-center p-5">
                    No mic requests
                  </p>
                ) : (
                  Array.from({ length: micRequest }, (_, index) => (
                    <div
                      key={`user-${index}`}
                      className="w-full h-full flex justify-between items-center gap-2 p-2"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                            alt={`User ${index + 1}`}
                          />
                          <AvatarFallback>
                            <span className="text-white text-xs">{`User ${index + 1}`}</span>
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-xs block w-fit h-fit">
                          {`User ${index + 1}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <button className="text-white text-xs bg-[#00800071] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm">
                          Accept
                        </button>
                        <button className="text-white text-xs bg-[#ff00005f] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm">
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
            {/* ******Choose co-host********** */}
            <div
              className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience.coHost ? "hidden" : "grid"}`}
            >
              <p className="text-white text-xs mb-2 absolute top-3 left-4">
                Choose your co-host
              </p>
              <ScrollArea className="h-[calc(100vh-75px)] w-full border-none pt-12 pb-2 px-2">
                {Array.from({ length: chooseCoHost }, (_, index) => (
                  <Label
                    key={`user-${index}`}
                    className="w-full h-full flex justify-between items-center gap-2 p-2"
                  >
                    <span className="flex justify-center items-center gap-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                          alt={`User ${index + 1}`}
                        />
                        <AvatarFallback>
                          <span className="text-white text-xs">{`User ${index + 1}`}</span>
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white text-xs block w-fit h-fit">
                        {`User ${index + 1}`}
                      </span>
                    </span>
                    <span className="flex justify-center items-center gap-1">
                      <Switch id="ping-label" />
                    </span>
                  </Label>
                ))}
              </ScrollArea>
            </div>
            {/* ******Choose slide********** */}
            <div
              className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience.chooseSlide ? "hidden" : "grid"}`}
            >
              <p className="text-white text-xs mb-2 absolute top-3 left-4">
                Choose slide
              </p>
              <ScrollArea className="h-[calc(100vh-75px)] w-full border-none pt-12 pb-2 px-2">
                {Array.from({ length: chooseSlide }, (_, index) => (
                  <div
                    key={`user-${index}`}
                    className="w-full h-full grid grid-cols-[6rem_1fr] grid-rows-[6rem] gap-2 p-2 border border-gray-300 rounded-sm mb-4"
                  >
                    <div className="w-full h-full">
                      <img
                        src={`https://picsum.photos/200/300?random=${index + 1}`}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <div className="w-full h-full flex flex-col justify-between items-start gap-1">
                      <span className="text-white text-xs font-bold block w-[11.5625rem] truncate">
                        {`Embedded Slide ${index + 1} Lorem ipsum dolor sit amet.`}
                      </span>
                      <span className="text-white text-xs block w-[11.5625rem] truncate">
                        <span className="font-bold">Presenter:</span> Imoh
                        Omeizegba Lorem ipsum dolor sit amet.
                      </span>
                      <span className="text-white text-xs block w-[11.5625rem] truncate">
                        <span className="font-bold">Category:</span> Edge
                        computing Lorem, ipsum dolor sit amet consectetur
                        adipisicing elit. A, laborum?
                      </span>
                      <button className="text-white text-xs bg-black px-2 py-1 flex justify-center items-center w-full h-fit border-none rounded-sm">
                        Add+
                      </button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
