/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { PiHandWaving } from "react-icons/pi";
import { MdOutlineScreenShare } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { IoCloudDownloadOutline, IoSync } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { LuMessagesSquare } from "react-icons/lu";
import { MdOutlineStopScreenShare } from "react-icons/md";

export default function InterfaceFooterElement({
  sideBar,
  is768PxScreen,
  setLiveChatAudience,
  setSideBar,
  isHost,
  mic,
  screenShare,
  setScreenShare,
  cycleMicState,
  footerClass,
  navigate
}) {
  return (
    <>
      <footer
        className={`interfaceFooter ${
          footerClass.inAactiveSideBarDesktop
            ? "inAactiveSideBarDesktop"
            : footerClass.mobileViewHost
              ? "mobileViewHost"
              : footerClass.desktopViewUsers
                ? "desktopViewUsers"
                : footerClass.mobileViewUsers
                  ? "mobileViewUsers"
                  : ""
        } w-full h-full maxScreenMobile:!z-50`}
      >
        {/* Home button */}
        <button
          onClick={() => navigate("/")}
          className={`homeBtn ${is768PxScreen && "hidden"} w-10 h-10 justify-self-center border-none rounded-full flex justify-center items-center shadow hover:bg-[#19191971] _hover:bg-[#191919] text-white text-xl`}
        >
          <FiHome size={24} />
        </button>

        {/* Download button */}
        <button
          // ${footerClass.cant_speaking_mobile && "!hidden"}
          className={`downloadBtn ${footerClass.mobileViewHost && "hidden"} justify-self-start w-10 h-10 border-none rounded-full flex justify-center items-center shadow hover:bg-[#19191971] _hover:bg-[#191919] text-white text-xl`}
        >
          <IoCloudDownloadOutline size={24} />
        </button>

        {/* Share screen button */}
        <button
          onClick={() =>
            confirm(
              `Are you sure you want to ${!screenShare ? "share" : "stop sharing"} your screen?`
            )
              ? setScreenShare(!screenShare)
              : ""
          }
          // ${(footerClass.cant_speaking_mobile || footerClass.interface_page_footer) && "!hidden"}
          className={`shareBtn ${is768PxScreen && "hidden"} w-10 h-10 justify-self-end border-none rounded-full flex justify-center items-center shadow hover:bg-[#19191971] _hover:bg-[#191919] text-white text-xl`}
        >
          {!screenShare ? (
            <MdOutlineScreenShare size={24} />
          ) : (
            <MdOutlineStopScreenShare size={24} />
          )}
        </button>

        {/* Mic request button */}
        <button
          onClick={cycleMicState}
          className={`micBtn w-10 h-10 justify-self-center border-none rounded-full flex justify-center items-center shadow ${mic.hostNeutral || mic.userNeutral ? "bg-[#191919c0] text-white _bg-[#a2c6bf4d]" : mic.hostActive || mic.userActive ? "text-[#219882] bg-[#a2c6bf4d]" : "text-[#F22B1F] bg-[#df96964d]"} text-xl`}
        >
          {/* ${!mic ? "before:bg-[#df96964d]" : "before:bg-[#a2c6bf4d]"} */}
          {isHost ? (
            <>
              {mic.hostNeutral || mic.hostActive ? (
                <IoIosMic size={24} />
              ) : (
                <IoIosMicOff size={24} />
              )}
            </>
          ) : (
            <>
              {mic.userNeutral || mic.userActive ? (
                <IoIosMic size={24} />
              ) : mic.userRequest ? (
                <PiHandWaving size={24} />
              ) : (
                <IoIosMicOff size={24} />
              )}
            </>
          )}
        </button>

        {/* Audience present */}
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
          className={`audienceBtn ${sideBar && !is768PxScreen && "!hidden"} w-10 h-10 justify-self-start border-none rounded-full flex justify-center items-center shadow hover:bg-[#19191971] _hover:bg-[#191919] text-white text-xl relative`}
        >
          <span className="!absolute -top-1.5 -right-1 flex justify-center items-center w-5 h-5 aspect-square border-none rounded-full text-[0.6rem] font-semibold text-white bg-[#19191991]">
            10
          </span>
          <FaRegUser size={24} />
        </button>

        {/* Messages */}
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
          className={`messageBtn ${!is768PxScreen && "!hidden"} w-10 h-10 justify-self-start border-none rounded-full flex justify-center items-center shadow hover:bg-[#19191971] _hover:bg-[#191919] text-white text-xl relative`}
        >
          <span className="!absolute -top-1.5 -right-1 flex justify-center items-center w-5 h-5 aspect-square border-none rounded-full text-[0.6rem] font-semibold text-white bg-[#19191991]">
            10
          </span>
          <LuMessagesSquare size={24} />
        </button>

        {/* Settings/controls button */}
        <button
          onClick={() => {
            setLiveChatAudience({
              audience: false,
              chats: false,
              controls: true,
              requests: false,
              coHost: false,
              chooseSlide: false,
              poll: false
            });
            setSideBar(true);
          }}
          // ${(footerClass.interface_page_footer || footerClass.interface_page_footer) && "!hidden"}
          className={`settingsBtn ${!isHost && is768PxScreen && "hidden"} w-10 h-10 justify-self-start border-none rounded-full flex justify-center items-center shadow hover:bg-[#19191971] _hover:bg-[#191919] text-white text-xl`}
        >
          <BsThreeDots size={24} />
        </button>

        {/* End call button */}
        <button
          onClick={() => confirm("Are you sure you want to End session?")}
          className="endCallBtn justify-self-end bg-[#ff0000] _w-full w-16 h-[70%] flex justify-center items-center gap-2 px-2 border-none rounded-sm text-[0.8rem] font-semibold"
        >
          <MdCallEnd size={32} />
        </button>
      </footer>
    </>
  );
}
