/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFullscreen, useOrientation } from "react-use";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";
import { MdCallEnd, MdError } from "react-icons/md";
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
import Menu from "./Modals/Menu";
import { MIC_STATE } from "../../constants/routes";

// eslint-disable-next-line react/prop-types
export default function Controls({ containerRef, actionsActive }: {containerRef: React.MutableRefObject<any>, actionsActive: boolean}) {
  const orientation = useOrientation();
  const {
    fullScreenToggle,
    fullScreenShow,
    isMobilePhone,
    presentation,
    micState,
    setMicState,
    audioSuccess,
    startPrompt,
    setStartPrompt,
    audioError,
    audioLoading,
    setMute,
    joinAudio,
    setJoinAudio,
    userName,
    setUserName,
    rtcToken,
    networkStatus,
    fetchRtcToken,
    startAudio,
    syncSlide,
    synced,
  } = useContext(PresentationContext);
  const isFullscreen = useFullscreen(containerRef, fullScreenShow, {
    onClose: () => fullScreenToggle(false)
  });

  const [endAudioPrompt, setEndAudioPrompt] = useState(false);
  const [enterName, setEnterName] = useState(false);
  const [hideControls, setHideControls] = useState(true);
  const [showUsersList, setShowUsersList] = useState(false);

  const micStyle = useMemo(
    function () {
      if (micState === MIC_STATE.MIC_OFF && !audioSuccess) {
        return { style: "bg-gray-300", icon: <IoIosMic size={60} /> };
      } else if (micState === MIC_STATE.MIC_OFF) {
        return { style: "bg-[#ff0000]", icon: <IoIosMicOff size={60} /> };
      } else if (micState === MIC_STATE.REQ_MIC) {
        return { style: "bg-orange-500", icon: <PiHandWaving size={60} /> };
      } else if (micState === MIC_STATE.MIC_MUTED) {
        return { style: "bg-[#ff0000]", icon: <IoIosMic size={60} /> };
      } else if (micState === MIC_STATE.CAN_SPK) {
        return { style: "bg-green-500", icon: <IoIosMic size={60} /> };
      }
    },
    [micState, audioSuccess]
  );

  // useEffect(
  //   function () {
  //     if (audioSuccess) {
  //       changeMicState(micState);
  //     }
  //   },
  //   [audioSuccess, micState]
  // );

  const getUserMicStatusColor = useCallback(function (micStatus: MIC_STATE) {
    if (micStatus === MIC_STATE.MIC_MUTED) {
      return "bg-[#ff0000]";
    } else if (micStatus === MIC_STATE.REQ_MIC) {
      return "bg-orange-500";
    } else if (micStatus === MIC_STATE.CAN_SPK) {
      return "bg-green-500";
    } else {
      return "hidden";
    }
  }, []);

  // const handleAcceptMicRequest = useCallback(
  //   function (user: { status: MIC_STATE; id: string; }) {
  //     if (presentation.data?.User !== "HOST") return;

  //     if (user.status === MIC_STATE.REQ_MIC) {
  //       acceptMicRequest(user.id, MIC_STATE.MIC_MUTED);
  //     } else if (user.status === MIC_STATE.CAN_SPK) {
  //       acceptMicRequest(user.id, MIC_STATE.MIC_OFF);
  //     }
  //   },
  //   [acceptMicRequest, presentation.data?.User]
  // );

  const styles = useMemo(() => {
    if (
      (isMobilePhone && orientation.type.includes("portrait")) ||
      actionsActive ||
      enterName ||
      startPrompt ||
      audioLoading ||
      endAudioPrompt ||
      !hideControls ||
      showUsersList ||
      audioError
    ) {
      return "opacity-100";
    }
    return "opacity-0";
  }, [
    actionsActive,
    orientation,
    enterName,
    startPrompt,
    isMobilePhone,
    audioLoading,
    endAudioPrompt,
    hideControls,
    showUsersList,
    audioError
  ]);

  function actionMicButton() {
    if (!joinAudio) {
      setStartPrompt(true);
      return;
    }

    if (audioSuccess) {
      if (presentation?.data?.User === "HOST") {
        if (micState === MIC_STATE.CAN_SPK) {
          setMicState(MIC_STATE.MIC_MUTED);
          setMute(true);
        } else {
          setMicState(MIC_STATE.CAN_SPK);
          setMute(false);
        }
      } else {
        if (micState === MIC_STATE.MIC_OFF) {
          setMicState(MIC_STATE.REQ_MIC);
          setMute(true);
        } else if (micState === MIC_STATE.REQ_MIC) {
          setMicState(MIC_STATE.MIC_OFF);
          setMute(true);
        } else if (micState === MIC_STATE.CAN_SPK) {
          setMicState(MIC_STATE.MIC_MUTED);
          setMute(true);
        } else if (micState === MIC_STATE.MIC_MUTED) {
          setMicState(MIC_STATE.CAN_SPK);
          setMute(false);
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
      await startAudio.mutateAsync();
      setEndAudioPrompt(false);
      setMicState(MIC_STATE.MIC_OFF);
    } catch (error) {
      toast.error("Error ending audio");
    }
  }

  return (
    <div
      className={`fixed z-10 bottom-5 right-0 left-0 h-30 flex justify-right items-center justify-center ${styles}`}
      onMouseEnter={() => setHideControls(false)}
      onMouseLeave={() => setHideControls(true)}
    >
      {audioSuccess && (
        <div
          className={`absolute sm:bottom-5 bottom-24 left-5 network__bar ${networkStatus}`}
        >
          <span className="bar1"></span>
          <span className="bar2"></span>
          <span className="bar3"></span>
        </div>
      )}
      <div className="flex flex-row gap-20 items-center justify-center relative w-full">
        {/* Desktop controls */}
        <div className="flex-row items-center gap-5 flex-wrap sm:flex hidden">
          {audioSuccess && (
            <>
              <button className="rounded-full p-3 bg-gray-300 shadow">
                <BsThreeDots size={24} />
              </button>
              <a href="/" className="rounded-full p-3 bg-gray-300 shadow">
                <FiHome size={24} />
              </a>
              <button
                disabled={!presentation?.data?.downloadable}
                className="rounded-full p-3 bg-gray-300 shadow"
              >
                <IoCloudDownloadOutline
                  size={24}
                  color={presentation?.data?.downloadable ? "black" : "gray"}
                />
              </button>
            </>
          )}
          {(presentation?.data?.audio || presentation?.data?.User === "HOST") && (
            <button
              className={`${micStyle?.style} rounded-full p-3 shadow ${audioLoading && "!cursor-not-allowed"}`}
              onClick={actionMicButton}
              disabled={audioLoading}
            >
              {audioLoading ? (
                <LoadingAssetBig2 />
              ) : (
                <>
                  {(audioSuccess || !audioSuccess) && !audioError ? (
                    micStyle?.icon
                  ) : (
                    <MdError size={60} />
                  )}
                </>
              )}
            </button>
          )}
          {audioSuccess && (
            <>
              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onClick={() => setShowUsersList(true)}
                >
                  <FaRegUser size={24} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {/* {numberOfUsers} */}
                </span>
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
          {audioSuccess && (
            <>
              <button className="rounded-full p-3 bg-gray-300 shadow">
                <BsThreeDots size={24} />
              </button>
              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onClick={() => setShowUsersList(true)}
                >
                  <FaRegUser size={24} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {/* {numberOfUsers} */}
                </span>
              </div>
            </>
          )}
          {(presentation?.data?.audio || presentation?.data?.User === "HOST") && (
            <button
              className={`${micStyle?.style} rounded-full p-3 shadow`}
              onClick={actionMicButton}
              disabled={audioLoading}
            >
              {audioLoading ? (
                <LoadingAssetBig2 />
              ) : (
                <>
                  {(audioSuccess || !audioSuccess) && !audioError ? (
                    micStyle?.icon
                  ) : (
                    <MdError color="white" size={60} />
                  )}
                </>
              )}
            </button>
          )}
          {audioSuccess && (
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
          {!synced && presentation?.data?.User !== "HOST" && (
            <button
              onClick={syncSlide}
              className="shadow bg-black rounded-full p-2 block w-fit h-fit border-gray-100 border-[1px]"
            >
              <IoSync color="white" size={32} />
            </button>
          )}
          {document.fullscreenEnabled && <button
            onClick={() => fullScreenToggle()}
            className="shadow bg-black rounded-full p-2 block w-fit h-fit border-gray-100 border-[1px]"
          >
            {isFullscreen ? (
              <RxExitFullScreen color="white" size={32} />
            ) : (
              <RxEnterFullScreen color="white" size={32} />
            )}
          </button>}
        </div>
      </div>
      {/* <Menu open={showUsersList} onClose={() => setShowUsersList(false)}>
        <div className="rounded-t-xl p-5 flex items-center justify-between border-b-2 border-[#BFBFA4] fixed w-full bg-[#FFFFDB]">
          <div className="flex items-center">
            <h4 className="text-2xl text-center text-black font-bold">
              Live Audience
            </h4>
            <div className="relative w-fit">
              <div className="rounded-full p-3">
                <FaRegUser size={18} />
              </div>
              <span className="absolute -top-2 -right-2 bg-white rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                {numberOfUsers}
              </span>
            </div>
          </div>

          <button
            className="h-2 w-6 bg-black"
            onClick={() => setShowUsersList(false)}
          ></button>
        </div>

        <div className="p-3 flex justify-start gap-2 mt-20">
          <div className="flex flex-col justify-center items-center w-fit border-2 border-[#BFBFA4] p-3 rounded-2xl">
            {host ? (
              <>
                <img
                  className="w-16"
                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${host?.id}`}
                  alt=""
                />
                <p className="text-sm">{host?.userName}</p>
                <div className="flex justify-center items-center gap-1">
                  <span
                    className={`rounded w-2 h-2 ${getUserMicStatusColor(host.status)}`}
                  ></span>
                  <p className="text-sm">Host</p>
                </div>
              </>
            ) : (
              <p className="text-sm">No Host</p>
            )}
          </div>
          <div className="flex flex-col justify-between w-full border-2 border-[#BFBFA4] p-3 rounded-2xl">
            <p className="font-bold text-sm">{presentation?.data?.name}</p>
            {presentation?.data?.presenter && (
              <p className="text-sm">By {presentation?.data.presenter}</p>
            )}
          </div>
        </div>

        <div className="text-sm p-3 grid grid-cols-5 gap-y-5 overflow-y-auto">
          {users.map((user, index) => (
            <button
              key={user.id}
              className="flex flex-col w-full justify-center items-center"
              onClick={() => handleAcceptMicRequest(user)}
            >
              <img
                className="w-16"
                src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}`}
                alt={`${user.userName} Image`}
              />
              <p title={user.userName} className="w-20 truncate ...">{user.userName}</p>
              <div className="w-20 flex justify-center items-center gap-2">
                {index === 0 && tokens.rtcUid === user.id && <span>(You)</span>}
                <span
                  className={`rounded w-2 h-2 ${getUserMicStatusColor(user.status)}`}
                ></span>
              </div>
            </button>
          ))}
        </div>
      </Menu> */}
      <Modal
        open={enterName}
        onClose={fetchRtcToken.isPending ? null : () => setEnterName(false)}
        color="bg-black"
      >
        {fetchRtcToken.isPending ? (
          <LoadingAssetBig2 />
        ) : (
          <form
            className="flex flex-col gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!userName) return toast.error("Please enter your name");
              try {
                if (!rtcToken)
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
              autoFocus
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
        )}
      </Modal>

      <ConfirmModal
        open={startPrompt}
        onClose={startAudio.isPending ? null : () => setStartPrompt(false)}
        onSubmit={async (e) => {
          e.preventDefault();
          if (presentation?.data?.User === "HOST") {
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
          presentation?.data?.User === "HOST"
            ? "Start Conversation"
            : "Join Conversation"
        }
        actionText={presentation?.data?.User === "HOST" ? "Start" : "Join"}
      />

      <ConfirmModal
        open={endAudioPrompt}
        onClose={startAudio.isPending ? null : () => setEndAudioPrompt(false)}
        onSubmit={(e) => {
          e.preventDefault();
          endAudio();
        }}
        isLoading={startAudio.isPending}
        message={
          presentation?.data?.User === "HOST" ? "End Audio" : "Leave Audio"
        }
        actionText={presentation?.data?.User === "HOST" ? "End" : "Leave"}
      />
    </div>
  );
}
