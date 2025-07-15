/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { MdOutlineScreenShare } from "react-icons/md";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { MdOutlineStopScreenShare } from "react-icons/md";
import LiveAudienceElement from "./LiveAudience";
import LiveChatElement from "./LiveChat";
import ControlsDotsElement from "./ControlsDots";
import MicRequestElement from "./MicRequest";
import ChooseCoHostElement from "./ChooseCoHost";
import ChooseSlideElement from "./ChooseSlide";
import PollElement from "./Poll";

export default function AsideElement({
  sideBar,
  is768PxScreen,
  setLiveChatAudience,
  liveChatAudience,
  setSideBar,
  micRequest,
  isHost,
  mic,
  setMic,
  videoShare,
  setVideoShare,
  screenShare,
  setScreenShare,
  cycleMicState,
  chooseCoHost,
  chooseSlide
}) {
  return (
    <>
      {/* orientation.type.includes("portrait") */}
      <div
        className={`w-full h-full p-1 overflow-auto ${!sideBar && "hidden"} ${is768PxScreen && "!absolute !top-[50%] -translate-y-[50%] !left-0 !bottom-auto !w-full !h-[calc(100vh-150px)] bg-black z-50"} !border-none`}
      >
        {/* sideBar wrapper */}
        <div
          className={`w-full !h-full grid grid-cols-[1fr] ${is768PxScreen ? "grid-rows-[1fr]" : "grid-rows-[20px_1fr]"} gap-1 relative`}
        >
          {/* floating button for closing controls area */}
          <button
            onClick={() => {
              setLiveChatAudience({
                audience: liveChatAudience.controls ? true : false,
                chats: false,
                controls: liveChatAudience.controls ? false : true,
                requests: false,
                coHost: false,
                chooseSlide: false,
                poll: false
              });
              setSideBar(!liveChatAudience.controls ? true : false);
            }}
            className={`text-white ${
              !(
                liveChatAudience.controls ||
                liveChatAudience.coHost ||
                liveChatAudience.chooseSlide ||
                liveChatAudience.poll
              )
                ? "hidden"
                : "block"
            } w-fit h-fit p-1 border-none rounded-sm absolute top-8 right-2 z-10`}
          >
            <IoClose size={20} />
          </button>
          {/* SideBar toggle for Live audience and chat */}
          <div
            className={`${is768PxScreen && "hidden"} w-full h-full border-none rounded-sm grid grid-cols-2 grid-rows-1 gap-1`}
          >
            <button
              onClick={() => {
                setLiveChatAudience({
                  audience: true,
                  chats: false,
                  controls: false,
                  requests: false,
                  coHost: false,
                  chooseSlide: false,
                  poll: false
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
            </button>
            <button
              onClick={() => {
                setLiveChatAudience({
                  audience: false,
                  chats: true,
                  controls: false,
                  requests: false,
                  coHost: false,
                  chooseSlide: false,
                  poll: false
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
            </button>
          </div>
          {/* ********Live Audiences section********* */}
          <LiveAudienceElement
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
          {/* *******Live Chats section************* */}
          <LiveChatElement
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
          {/* ******Controls for three Dots********** */}
          <ControlsDotsElement
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
            screenShare={screenShare}
          />
          {/* ******Mic Requests section 2 ********** */}
          <MicRequestElement
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
            screenShare={screenShare}
          />
          {/* ******Choose co-host********** */}
          <ChooseCoHostElement
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
            screenShare={screenShare}
          />
          {/* ******Choose slide********** */}
          <ChooseSlideElement
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
            screenShare={screenShare}
          />
          {/* ******Poll********** */}
          <PollElement
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
            screenShare={screenShare}
          />
        </div>
      </div>
    </>
  );
}
