/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFullscreen, useOrientation } from "react-use";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { IoIosMic } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { IoReturnUpBackOutline, IoMusicalNotesOutline } from "react-icons/io5";
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
import MessageMenu from "./Modals/MessageMenu";
import { MIC_STATE } from "../../constants/routes";
import axios from "axios";
import download from "./download";
import { useMessageStore } from "./hooks/messageStore";
import { IoOptions } from "react-icons/io5";
import { RiBarChart2Line, RiFolderAddLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineScreenShare, MdNoiseControlOff } from "react-icons/md";
import { GoBell } from "react-icons/go";
import { PiPenNibLight } from "react-icons/pi";
import { Switch } from "@/components/ui/switch";
import { Label } from "../ui/label";

// eslint-disable-next-line react/prop-types
export default function Controls({
  containerRef,
  actionsActive
}: {
  containerRef: React.MutableRefObject<any>;
  actionsActive: boolean;
}) {
  const orientation = useOrientation();
  const {
    fullScreenShow,
    isMobilePhone,
    presentation,
    micState,
    startPrompt,
    audioData,
    userName,
    networkStatus,
    startAudio,
    endAudio,
    synced,
    users,
    host,
    rtm,
    audioConnectionState,
    changeMicState,
    acceptMicRequest,
    fullScreenToggle,
    setMicState,
    setStartPrompt,
    setMute,
    setUserName,
    syncSlide
  } = useContext(PresentationContext);
  const isFullscreen = useFullscreen(containerRef, fullScreenShow, {
    onClose: () => fullScreenToggle(false)
  });

  const [endAudioPrompt, setEndAudioPrompt] = useState(false);
  const [enterName, setEnterName] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState<any>({});

  const unReadMessagesCount = useMessageStore(
    (state) => state.unReadMessages.length
  );

  useEffect(function() {
    // closes all menu when escape key is pressed
    function closeAllMenus(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowUsersList(false);
        setShowMessage(false);
        setShowOptions(false);
      }
    }
    window.addEventListener("keydown", closeAllMenus);
    return () => window.removeEventListener("keydown", closeAllMenus);
  }, []);

  const micStyle = useMemo(
    function () {
      if (micState === MIC_STATE.MIC_OFF || !audioData.success) {
        return { style: "bg-gray-300", icon: <IoIosMic size={60} /> };
      } else if (micState === MIC_STATE.REQ_MIC) {
        return { style: "bg-orange-500", icon: <PiHandWaving size={60} /> };
      } else if (micState === MIC_STATE.MIC_MUTED) {
        return { style: "bg-[#ff0000]", icon: <IoIosMic size={60} /> };
      } else if (micState === MIC_STATE.CAN_SPK) {
        return { style: "bg-green-500", icon: <IoIosMic size={60} /> };
      }
    },
    [micState, audioData.success]
  );

  useEffect(
    function () {
      if (audioData.success) {
        if (!presentation?.data) return;
        changeMicState(micState, rtm);
      }
    },
    [audioData.success, micState, presentation?.data, rtm]
  );

  const getUserMicStatusColor = useCallback(function (micStatus: MIC_STATE) {
    if (micStatus === MIC_STATE.MIC_MUTED) {
      return "border-[#ff0000]";
    } else if (micStatus === MIC_STATE.REQ_MIC) {
      return "border-orange-500 animate-pinging";
    } else if (micStatus === MIC_STATE.CAN_SPK) {
      return "border-green-500";
    } else {
      return "border-transparent";
    }
  }, []);

  const handleAcceptMicRequest = useCallback(
    async function (user: { status: MIC_STATE; id: string }) {
      if (!presentation?.data) return;
      if (presentation.data.User !== "HOST") return;

      if (user.status === MIC_STATE.REQ_MIC) {
        await acceptMicRequest(user.id, MIC_STATE.MIC_MUTED);
      } else if (user.status === MIC_STATE.CAN_SPK) {
        await acceptMicRequest(user.id, MIC_STATE.MIC_OFF);
      }
    },
    [presentation]
  );

  const styles = useMemo(() => {
    if (audioConnectionState === "RECONNECTING") {
      return "opacity-0";
    }
    if (
      (isMobilePhone && orientation.type.includes("portrait")) ||
      actionsActive ||
      enterName ||
      startPrompt ||
      audioData.loading ||
      endAudioPrompt ||
      showUsersList ||
      showMessage ||
      audioData.error ||
      showOptions
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
    audioData.loading,
    endAudioPrompt,
    showUsersList,
    showMessage,
    audioData.error,
    audioConnectionState,
    showOptions
  ]);

  function actionMicButton() {
    if (!audioData.success) {
      setStartPrompt(true);
      return;
    }

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

  async function endUserAudio() {
    if (!endAudioPrompt) {
      setEndAudioPrompt(true);
      return;
    }
    if (!presentation?.data) return;
    try {
      await endAudio.mutateAsync({
        liveId: presentation.data.liveId,
        presentationId: presentation.data.id,
        User: presentation.data.User,
        hostEnd: false
      });
      setEndAudioPrompt(false);
      setMicState(MIC_STATE.MIC_OFF);
    } catch (error) {
      toast.error("Error ending audio");
    }
  }

  function downloadFile(url: string, filename: string) {
    axios
      .get(url, {
        responseType: "blob"
      })
      .then((res) => {
        download(res.data, filename);
      });
  }

  return (
    <div
      className={`fixed z-10 bottom-5 right-0 left-0 h-30 flex justify-right items-center justify-center ${styles}`}
    >
      {audioData.success && (
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
          {audioData.success && (
            <>
              <button
                onClick={() => setShowOptions(true)}
                className="rounded-full p-3 bg-gray-300 shadow"
              >
                <BsThreeDots size={24} />
              </button>
              <a href="/" className="rounded-full p-3 bg-gray-300 shadow">
                <FiHome size={24} />
              </a>
              <button
                disabled={!presentation?.data?.downloadable}
                className={`rounded-full p-3 bg-gray-300 shadow ${!presentation?.data?.downloadable && "!cursor-not-allowed"}`}
                onClick={() =>
                  downloadFile(
                    presentation?.data?.pdfLink || "",
                    `${presentation?.data?.name}.pdf` || ""
                  )
                }
              >
                <IoCloudDownloadOutline
                  size={24}
                  color={
                    presentation?.data?.downloadable ? "black" : "bg-gray-400"
                  }
                />
              </button>
            </>
          )}
          {(presentation?.data?.audio ||
            presentation?.data?.User === "HOST") && (
            <button
              className={`${micStyle?.style} rounded-full p-3 shadow ${audioData.loading && "!cursor-not-allowed"}`}
              onClick={actionMicButton}
              disabled={audioData.loading}
            >
              {audioData.loading ? (
                <LoadingAssetBig2 />
              ) : (
                <>
                  {(audioData.success || !audioData.success) &&
                  !audioData.error ? (
                    micStyle?.icon
                  ) : (
                    <MdError size={60} />
                  )}
                </>
              )}
            </button>
          )}
          {audioData.success && (
            <>
              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onClick={() => setShowUsersList(true)}
                >
                  <FaRegUser size={24} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {users.length}
                </span>
              </div>
              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onClick={() => setShowMessage(true)}
                >
                  <LuMessagesSquare size={24} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {unReadMessagesCount}
                </span>
              </div>
              <button
                onClick={endUserAudio}
                className="rounded-full p-3 bg-[#ff0000]"
              >
                <MdCallEnd size={24} />
              </button>
            </>
          )}
        </div>
        {/* mobile controls */}
        <div className="flex-row items-center gap-5 flex-wrap sm:hidden flex">
          {audioData.success && (
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
                  {users.length}
                </span>
              </div>
            </>
          )}
          {(presentation?.data?.audio ||
            presentation?.data?.User === "HOST") && (
            <button
              className={`${micStyle?.style} rounded-full p-3 shadow`}
              onClick={actionMicButton}
              disabled={audioData.loading}
            >
              {audioData.loading ? (
                <LoadingAssetBig2 />
              ) : (
                <>
                  {(audioData.success || !audioData.success) &&
                  !audioData.error ? (
                    micStyle?.icon
                  ) : (
                    <MdError color="white" size={60} />
                  )}
                </>
              )}
            </button>
          )}
          {audioData.success && (
            <>
              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onClick={() => setShowMessage(true)}
                >
                  <LuMessagesSquare size={24} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {unReadMessagesCount}
                </span>
              </div>
              <button
                onClick={endUserAudio}
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
          {document.fullscreenEnabled && (
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
          )}
        </div>
      </div>

      <MessageMenu open={showMessage} onClose={() => setShowMessage(false)} />

      <Menu
        right={true}
        open={showUsersList}
        onClose={() => setShowUsersList(false)}
      >
        <div className="left-0 right-0 rounded-t-xl p-5 pb-1 flex items-center justify-between border-b-[1px] border-x-[1px] border-[#FF8B1C] fixed w-full bg-[#FFFFDB]">
          <div className="flex items-center">
            <h4 className="text-2xl text-center text-black font-bold">
              Live Audience
            </h4>
            <div className="relative w-fit">
              <div className="rounded-full p-3">
                <FaRegUser size={18} />
              </div>
              <span className="absolute -top-2 -right-2 bg-white rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                {users.length}
              </span>
            </div>
          </div>

          <button onClick={() => setShowUsersList(false)}>
            <IoReturnUpBackOutline size="32" />
          </button>
        </div>

        <div className="p-3 flex justify-start gap-2 mt-20">
          <div className="flex flex-col justify-center items-center w-fit border-[1px] border-[#FF8B1C] p-3 rounded-2xl">
            {host ? (
              <>
                <img
                  className={`w-16 rounded-full p-[0.10rem] border-[3px] ${getUserMicStatusColor(host.micState)}`}
                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=host.id`}
                  alt=""
                />
                <div className="flex justify-center items-center gap-1">
                  <p className="text-sm">Host</p>
                </div>
              </>
            ) : (
              <p className="text-sm">No Host</p>
            )}
          </div>
          <div className="flex flex-col justify-between w-full border-[1px] border-[#FF8B1C] p-3 rounded-2xl">
            <p className="font-bold text-sm">{presentation?.data?.name}</p>
            {presentation?.data?.presenter && (
              <p className="text-sm">By {presentation?.data.presenter}</p>
            )}
          </div>
        </div>

        <div className="text-sm p-3 grid grid-cols-5 sm:grid-cols-4 gap-y-5 overflow-y-auto">
          {users.map((user, index) => (
            <button
              key={user.id}
              className="flex flex-col w-full justify-start items-center"
              onClick={async () => {
                setLoadingStatus((prev: any) => ({ ...prev, [user.id]: true }));
                await handleAcceptMicRequest({
                  id: user.id,
                  status: user.micState
                });
                setLoadingStatus((prev: any) => ({
                  ...prev,
                  [user.id]: false
                }));
              }}
              disabled={loadingStatus[user.id]}
            >
              <div className="relative p-1 rounded-full">
                <img
                  className="w-16 rounded-full"
                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}`}
                  alt={`${user.userName} Image`}
                />
                <span
                  className={`absolute inset-0 rounded-full border-2 ${getUserMicStatusColor(user.micState)}`}
                ></span>
              </div>
              {loadingStatus[user.id] ? (
                <p>Loading...</p>
              ) : (
                <p title={user.userName} className="w-16 truncate ...">
                  {user.userName}
                </p>
              )}
              <div className="w-20 flex justify-center items-center gap-2">
                {index === 0 && presentation?.data?.rtc.rtcUid === user.id && (
                  <span>(You)</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </Menu>

      <Menu
        right={false}
        open={showOptions}
        onClose={() => setShowOptions(false)}
      >
        <div className="left-0 right-0 rounded-t-xl p-5 pb-1 flex items-center justify-between border-b-[1px] border-r-[1px] border-[#FF8B1C] fixed w-full bg-[#FFFFDB]">
          <div className="flex items-center">
            <h4 className="text-2xl text-center text-black font-bold">
              Options
            </h4>
            <div className="rounded-full p-3">
              <IoOptions size="18" />
            </div>
          </div>

          <button onClick={() => setShowUsersList(false)}>
            <IoReturnUpBackOutline size="32" />
          </button>
        </div>
        <div className="p-3 flex flex-col justify-between gap-2 pt-20 pb-10 h-full">
          <div className="flex flex-col gap-7">
            <div className="flex justify-between items-center">
              <Label htmlFor="pen" className="text-lg">Pen</Label>
              <div className="flex gap-5 items-center">
                <Label htmlFor="pen">
                  <PiPenNibLight size="28" />
                </Label>
                <Switch id="pen" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="music" className="text-lg">Music</Label>
              <div className="flex gap-5 items-center">
                <Label htmlFor="music">
                <IoMusicalNotesOutline size="28" />
                </Label>
                <Switch id="music" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="ping-audience" className="text-lg">Ping audience</Label>
              <div className="flex gap-5 items-center">
                <Label htmlFor="ping-audience">
                  <GoBell size="28" />
                </Label>
                <Switch id="ping-audience" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="noise-suppression" className="text-lg">Noise suppression</Label>
              <div className="flex gap-5 items-center">
                <Label htmlFor="noise-suppression">
                  <MdNoiseControlOff size="28" />
                </Label>
                <Switch id="noise-suppression" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-around">
            <button className="flex flex-col justify-center items-center">
              <RiBarChart2Line />
              <span>Poll</span>
            </button>
            <button className="flex flex-col justify-center items-center">
              <AiOutlineUsergroupAdd />
              <span>Co-host</span>
            </button>
            <button className="flex flex-col justify-center items-center">
              <RiFolderAddLine />
              <span>Add Slides</span>
            </button>
            <button className="flex flex-col justify-center items-center">
              <MdOutlineScreenShare />
              <span>Share Screen</span>
            </button>
          </div>
        </div>
      </Menu>

      <Modal
        open={enterName}
        onClose={startAudio.isPending ? null : () => setEnterName(false)}
        color="bg-black"
      >
        {startAudio.isPending ? (
          <LoadingAssetBig2 />
        ) : (
          <form
            className="flex flex-col gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!userName.trim() || userName.toLowerCase().includes("host"))
                return toast.error("Please enter your name");
              localStorage.setItem("userName", `"${userName}"`);
              if (!presentation?.data) return;
              try {
                await startAudio.mutateAsync({
                  live: presentation.data.live,
                  liveId: presentation.data.liveId,
                  presentationId: presentation.data.id,
                  User: presentation.data.User,
                  tokens: presentation.data.rtc
                });
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
                Join
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
          if (!presentation?.data) return;
          if (presentation.data.User === "HOST") {
            try {
              await startAudio.mutateAsync({
                live: presentation.data.live,
                liveId: presentation.data.liveId,
                presentationId: presentation.data.id,
                User: presentation.data.User,
                tokens: presentation.data.rtc
              });
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
            ? presentation?.data?.audio
              ? "Rejoin"
              : "Start"
            : "Join"
        }
        actionText={
          presentation?.data?.User === "HOST"
            ? presentation?.data?.audio
              ? "Rejoin"
              : "Start"
            : "Join"
        }
      />

      <ConfirmModal
        open={endAudioPrompt}
        onClose={startAudio.isPending ? null : () => setEndAudioPrompt(false)}
        onSubmit={(e) => {
          e.preventDefault();
          endUserAudio();
        }}
        isLoading={endAudio.isPending}
        message={
          presentation?.data?.User === "HOST" ? "End Audio" : "Leave Audio"
        }
        actionText={presentation?.data?.User === "HOST" ? "End" : "Leave"}
      />
    </div>
  );
}
