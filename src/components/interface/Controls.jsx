import { useContext, useMemo, useState } from "react";
import { useFullscreen, useOrientation } from "react-use";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { IoIosMic, IoIosMicOff, IoMdHand } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";
import { MdCallEnd } from "react-icons/md";
import { IoCloudDownloadOutline, IoSync } from "react-icons/io5";
import { PiHandWaving } from "react-icons/pi";
import { FiHome } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { PresentationContext } from "../../contexts/presentationContext";
import "./styles/style.css";
import Modal from "./Modals/Modal";
import ConfirmModal from "./Modals/confirmModal";
import { toast } from "react-toastify";
import { LoadingAssetBig2 } from "../../assets/assets";
import { useRemoteUsers } from "agora-rtc-react";
import Menu from "./Modals/Menu";

const REQ_MIC = "REQ_MIC";
const CAN_SPK = "CAN_SPK";
const MIC_OFF = "MIC_OFF";
const MIC_MUTED = "MIC_MUTED";

// eslint-disable-next-line react/prop-types
export default function Controls({ containerRef, actionsActive }) {
  const orientation = useOrientation();
  const {
    fullScreenToggle,
    fullScreenShow,
    isMobile,
    presentation,
    joinAudio,
    setJoinAudio,
    syncButton,
    syncSlide,
    startAudio,
    startPrompt,
    setStartPrompt,
    fetchRtcToken,
    userName,
    setUserName,
    audioData
  } = useContext(PresentationContext);
  const isFullscreen = useFullscreen(containerRef, fullScreenShow, {
    onClose: () => fullScreenToggle(false)
  });

  const [endAudioPrompt, setEndAudioPrompt] = useState(false);
  const [enterName, setEnterName] = useState(false);
  const [micState, setMicState] = useState(presentation.data?.User === "HOST" ? MIC_MUTED : MIC_OFF);
  const [hideControls, setHideControls] = useState(true);
  const [showUsersList, setShowUsersList] = useState(false);

  const micStyle = useMemo(
    function () {
      if (micState === MIC_OFF || micState === MIC_MUTED) {
        return { style: "bg-[#ff0000]", icon: <IoIosMicOff size={60} /> };
      } else if (micState === REQ_MIC) {
        return { style: "bg-orange-500", icon: <PiHandWaving size={60} /> };
      } else if (micState === CAN_SPK) {
        return { style: "bg-green-500", icon: <IoIosMic size={60} /> };
      }
    },
    [micState]
  );

  const styles = useMemo(() => {
    if (
      (isMobile({ iphone: false }) && (orientation.type.includes("portrait")) ||
      actionsActive ||
      enterName ||
      startPrompt ||
      audioData.loading ||
      endAudioPrompt ||
      !hideControls || showUsersList)
    ) {
      return "opacity-100";
    }
    return "opacity-0";
  }, [actionsActive, orientation, enterName, startPrompt, isMobile, audioData.loading, endAudioPrompt, hideControls, showUsersList]);

  function actionMicButton() {
    if (!joinAudio) {
      setStartPrompt(true);
      return;
    }

    if (audioData.success) {
      if (presentation.data?.User === "HOST") {
        if (micState === CAN_SPK) {
          setMicState(MIC_OFF);
          audioData.setMute(true);
        } else {
          setMicState(CAN_SPK);
          audioData.setMute(false);
        }
      } else {
        if (micState === MIC_OFF) {
          setMicState(REQ_MIC);
          audioData.setMute(true);
        } else if (micState === REQ_MIC) {
          setMicState(MIC_OFF);
          audioData.setMute(true);
        } else if (micState === CAN_SPK) {
          setMicState(MIC_MUTED);
          audioData.setMute(true);
        } else if (micState === MIC_MUTED) {
          setMicState(CAN_SPK);
          audioData.setMute(false);
        }
      }
    }
  }

  async function endAudio() {
    if (!endAudioPrompt) {
      setEndAudioPrompt(true);
      return;
    }
    try {
      if (presentation.data?.User === "HOST") {
        await startAudio.mutateAsync();
      } else {
        setJoinAudio(false);
      }
      setEndAudioPrompt(false);
      setMicState(MIC_OFF);
    } catch (error) {
      toast.error("Error ending audio");
    }
  }

  const remoteUsers = useRemoteUsers(audioData.rtcClient);

  return (
    <div
      className={`fixed z-10 bottom-5 right-0 left-0 h-30 flex justify-right items-center justify-center ${styles}`}
      onMouseEnter={() => setHideControls(false)}
      onMouseLeave={() => setHideControls(true)}
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
                className={`${micStyle.style} rounded-full p-3 shadow`}
                onClick={actionMicButton}
              >
                {audioData.loading ? (
                  <LoadingAssetBig2 />
                ) : (
                  <>
                    {audioData.success ? micStyle.icon : <IoIosMic size={60} />}
                  </>
                )}
              </button>
            )}
            {presentation.data?.audio && joinAudio && (
              <>
                <div className="relative">
                  <button className="rounded-full p-3 bg-gray-300 shadow" onClick={() => setShowUsersList(true)}>
                    <FaRegUser size={24} />
                  </button>
                  <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">{remoteUsers.length}</span>
                </div>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <LuMessagesSquare size={24} />
                </button>
                <button
                  onClick={endAudio}
                  className="rounded-full p-3 bg-[#ff0000]"
                >
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
                <div className="relative">
                  <button className="rounded-full p-3 bg-gray-300 shadow" onClick={() => setShowUsersList(true)}>
                    <FaRegUser size={24} />
                  </button>
                  <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">{remoteUsers.length}</span>
                </div>
              </>
            )}
            {(presentation.data?.audio ||
              presentation.data?.User === "HOST") && (
              <button
                className={`${micStyle.style} rounded-full p-3 shadow`}
                onClick={actionMicButton}
              >
                {audioData.loading ? (
                  <LoadingAssetBig2 />
                ) : (
                  <>
                    {audioData.success ? micStyle.icon : <IoIosMic size={60} />}
                  </>
                )}
              </button>
            )}
            {presentation.data?.audio && joinAudio && (
              <>
                <button className="rounded-full p-3 bg-gray-300 shadow">
                  <LuMessagesSquare size={24} />
                </button>
                <button
                  onClick={endAudio}
                  className="rounded-full p-3 bg-[#ff0000]"
                >
                  <MdCallEnd size={24} />
                </button>
              </>
            )}
          </div>
          <div className="absolute sm:bottom-5 bottom-24 right-5 flex gap-4">
            {!syncButton && (
              <button
                onClick={syncSlide}
                className="shadow bg-black rounded-full p-2 block w-fit h-fit border-gray-100 border-[1px]"
              >
                <IoSync color="white" size={32} />
              </button>
            )}
            <button
              onClick={() => fullScreenToggle()}
              className="shadow bg-black rounded-full p-2 block w-fit h-fit border-gray-100 border-[1px]"
            >
              {isFullscreen ? (
                <RxExitFullScreen color="white" size={32} />
              ) : (
                <RxEnterFullScreen color="white" size={32} />
              )}
            </button>
          </div>
        </div>
      )}
      <Menu open={showUsersList} onClose={() => setShowUsersList(false)}>
        <div className="p-5 flex items-center justify-between border-b-2 border-[#BFBFA4] fixed w-full bg-[#FFFFDB]">
          <div className="flex items-center">
            <h4 className="text-2xl text-center text-black font-bold">Live Audience</h4>
            <div className="relative w-fit">
              <div className="rounded-full p-3">
                <FaRegUser size={18} />
              </div>
              <span className="absolute -top-2 -right-2 bg-white rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">{remoteUsers.length}</span>
            </div>
          </div>

          <button className="h-2 w-6 bg-black" onClick={() => setShowUsersList(false)}></button>
        </div>

        <div className="p-3 flex justify-start gap-2 mt-20">
          <div className="flex flex-col justify-center items-center w-fit border-2 border-[#BFBFA4] p-3 rounded-2xl">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Fix" alt="" />
            <p className="text-sm">Yohanna</p>
            <div className="flex justify-center items-center gap-1">
              <span className="rounded bg-[#05EF00] w-2 h-2"></span>
              <p className="text-sm">Host</p>
            </div>
          </div>
          <div className="flex flex-col justify-between w-full border-2 border-[#BFBFA4] p-3 rounded-2xl">
            <p className="font-bold text-sm">{presentation.data.name}</p>
            <p className="text-sm">By Yohanna</p>
          </div>
        </div>

        <div className="text-sm p-3 grid grid-cols-5 gap-y-5 overflow-y-auto">
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <img className="w-16" src="https://api.dicebear.com/8.x/rings/svg?seed=Felix" alt="" />
            <p>Yohanna</p>
            <span className="rounded bg-[#05EF00] w-2 h-2"></span>
          </div>
        </div>
      </Menu>
      <Modal
        open={enterName}
        onClose={() => setEnterName(false)}
        color="bg-black"
      >
        <form
          className="flex flex-col gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await fetchRtcToken.mutateAsync();
              setJoinAudio(true);
              setEnterName(false);
            } catch (error) {
              toast.error("Could'nt join conversation");
            }
          }}
        >
          <h4 className="text-2xl text-white text-center">Enter your name</h4>
          <input
            type="text"
            placeholder="Enter your name"
            className="rounded p-2 w-full text-center"
            autoFocus={true}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
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

      <ConfirmModal
        open={startPrompt}
        onClose={() => setStartPrompt(false)}
        onSubmit={async (e) => {
          e.preventDefault();
          if (presentation.data?.User === "HOST") {
            try {
              await startAudio.mutateAsync();
            } catch (error) {
              toast.error("Could'nt start conversation");
              return;
            }
          } else setEnterName(true);
          setStartPrompt(false);
        }}
        isLoading={startAudio.isPending}
        message={
          presentation.data?.User === "HOST"
            ? "Start Conversation"
            : "Join Conversation"
        }
        actionText={presentation.data?.User === "HOST" ? "Start" : "Join"}
      />

      <ConfirmModal
        open={endAudioPrompt}
        onClose={() => setEndAudioPrompt(false)}
        onSubmit={(e) => {
          e.preventDefault();
          endAudio();
        }}
        isLoading={startAudio.isPending}
        message={
          presentation.data?.User === "HOST" ? "End Audio" : "Leave Audio"
        }
        actionText={presentation.data?.User === "HOST" ? "End" : "Leave"}
      />
    </div>
  );
}
