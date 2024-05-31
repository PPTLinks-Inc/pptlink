import { useContext, useMemo, useState } from "react";
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
import Modal from "./Modal";

// eslint-disable-next-line react/prop-types
export default function Controls({ containerRef, actionsActive }) {
  const orientation = useOrientation();
  const {
    fullScreenToggle,
    fullScreenShow,
    isMobile,
    presentation,
    joinAudio
  } = useContext(PresentationContext);
  const isFullscreen = useFullscreen(containerRef, fullScreenShow, {
    onClose: () => fullScreenToggle(false)
  });

  const [enterName, setEnterName] = useState(false);
  const [startConversation, setStartConversation] = useState(false);

  const styles = useMemo(() => {
    if (
      (isMobile({ iphone: false }) && orientation.type.includes("portrait")) ||
      actionsActive ||
      enterName ||
      startConversation
    ) {
      return "opacity-100";
    }
    return "opacity-0";
  }, [actionsActive, orientation, enterName, startConversation, isMobile]);

  return (
    <div
      className={`fixed z-10 bottom-5 right-0 left-0 h-30 flex justify-right items-center justify-center ${styles}`}
    >
      {document.fullscreenEnabled && (
        <div className="flex flex-row gap-20 items-center justify-center relative w-full">
          {/* Desktop controls */}
          <div className="flex-row items-center gap-5 flex-wrap sm:flex hidden">
            {presentation.data?.audio && joinAudio && (
              <>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <BsThreeDots size={24} />
                </button>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <FiHome size={24} />
                </button>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <IoCloudDownloadOutline size={24} />
                </button>
              </>
            )}
            {(presentation.data?.audio ||
              presentation.data?.User === "HOST") && (
              <button
                className="bg-orange-500 rounded-full p-3 shadow"
                onClick={() => setStartConversation(true)}
              >
                <IoIosMic size={60} />
              </button>
            )}
            {presentation.data?.audio && joinAudio && (
              <>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <FaRegUser size={24} />
                </button>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <LuMessagesSquare size={24} />
                </button>
                <button className="rounded-full p-3 bg-[#ff0000]">
                  <MdCallEnd size={24} />
                </button>
              </>
            )}
          </div>
          {/* mobile controls */}
          <div className="flex-row items-center gap-5 flex-wrap sm:hidden flex">
            {presentation.data?.audio && joinAudio && (
              <>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <BsThreeDots size={24} />
                </button>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <FaRegUser size={24} />
                </button>
              </>
            )}
            {(presentation.data?.audio ||
              presentation.data?.User === "HOST") && (
              <button
                className="bg-orange-500 rounded-full p-3 shadow"
                onClick={() => setStartConversation(true)}
              >
                <IoIosMic size={60} />
              </button>
            )}
            {presentation.data?.audio && joinAudio && (
              <>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <LuMessagesSquare size={24} />
                </button>
                <button className="rounded-full p-3 bg-[#ff0000]">
                  <MdCallEnd size={24} />
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => fullScreenToggle()}
            className="shadow bg-black rounded-full p-2 block w-fit h-fit absolute sm:bottom-5 bottom-24 right-5 border-gray-100 border-[1px]"
          >
            {isFullscreen ? (
              <RxExitFullScreen color="white" size={32} />
            ) : (
              <RxEnterFullScreen color="white" size={32} />
            )}
          </button>
        </div>
      )}
      <Modal
        open={enterName}
        onClose={() => setEnterName(false)}
        color="bg-black"
      >
        <form className="flex flex-col gap-5">
          <h4 className="text-2xl text-white text-center">Enter your name</h4>
          <input
            type="text"
            placeholder="Enter your name"
            className="rounded p-2 w-full text-center"
            autoFocus={true}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setEnterName(false)}
              className="bg-slate-200 p-2 w-full rounded"
              type="button"
            >
              Cancel
            </button>
            <button className="bg-slate-200 p-2 w-full rounded" type="submit">
              Join Conversation
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        open={startConversation}
        onClose={() => setStartConversation(false)}
        color="bg-black"
      >
        <form className="flex flex-col gap-3">
          <h4 className="text-2xl text-white text-center">
            Start Conversation
          </h4>
          <div className="flex gap-3">
            <button
              onClick={() => setStartConversation(false)}
              className="bg-slate-200 p-2 w-full rounded"
              type="button"
            >
              Cancel
            </button>
            <button className="bg-slate-200 p-2 w-full rounded" type="submit">
              Start
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
