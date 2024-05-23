import React, { useContext, useMemo } from "react";
import { useFullscreen, useOrientation } from "react-use";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { IoIosMic } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";
import { MdCallEnd } from "react-icons/md";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { PresentationContext } from "../../contexts/presentationContext";

import "./styles/style.css";

export default function Controls({ containerRef, actionsActive }) {
  const orientation = useOrientation();
  const { fullScreenToggle, fullScreenShow, isMobile } = useContext(PresentationContext);
  const isFullscreen = useFullscreen(containerRef, fullScreenShow, {
    onClose: () => fullScreenToggle(false)
  });

  const styles = useMemo(() => {
    if ((isMobile({ iphone: false }) && orientation.type.includes("portrait")) || actionsActive) {
      return "opacity-100";
    }
    return "opacity-0";
  }, [actionsActive, isFullscreen, orientation]);

  return (
    <div
      className={`fixed z-10 bottom-5 right-0 left-0 h-30 flex justify-right items-center justify-center transition-opacity duration-1000 ${styles}`}
    >
      {document.fullscreenEnabled && (
        <div className="flex flex-row gap-20 items-center justify-center relative w-full">
          {/* Desktop controls */}
          <div className="flex-row items-center gap-5 flex-wrap sm:flex hidden">
            <button className="rounded-full p-3 bg-gray-300"><BsThreeDots size={24} /></button>
            <button className="rounded-full p-3 bg-gray-300"><FiHome size={24} /></button>
            <button className="rounded-full p-3 bg-gray-300"><IoCloudDownloadOutline size={24} /></button>
            <button className="bg-orange-500 rounded-full p-3"><IoIosMic size={60} /></button>
            <button className="rounded-full p-3 bg-gray-300"><FaRegUser size={24} /></button>
            <button className="rounded-full p-3 bg-gray-300"><LuMessagesSquare size={24} /></button>
            <button className="rounded-full p-3 bg-[#ff0000]"><MdCallEnd size={24} /></button>
          </div>
          {/* mobile controls */}
          <div className="flex-row items-center gap-5 flex-wrap sm:hidden flex">
            <button className="rounded-full p-3 bg-gray-300"><BsThreeDots size={24} /></button>
            <button className="rounded-full p-3 bg-gray-300"><FaRegUser size={24} /></button>
            <button className="bg-orange-500 rounded-full p-3"><IoIosMic size={60} /></button>
            <button className="rounded-full p-3 bg-gray-300"><LuMessagesSquare size={24} /></button>
            <button className="rounded-full p-3 bg-[#ff0000]"><MdCallEnd size={24} /></button>
          </div>
          <button
            onClick={() => fullScreenToggle()}
            className="bg-black rounded-full p-2 block w-fit h-fit absolute sm:bottom-5 bottom-24 right-5 border-gray-100 border-[1px]"
          >
            {isFullscreen ? (
              <RxExitFullScreen color="white" size={32} />
            ) : (
              <RxEnterFullScreen color="white" size={32} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
