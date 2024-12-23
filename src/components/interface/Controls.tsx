/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  lazy
} from "react";
import { useFullscreen, useOrientation } from "react-use";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { IoIosMic } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import { MdCallEnd } from "react-icons/md";
import { IoCloudDownloadOutline, IoSync } from "react-icons/io5";
import { PiHandWaving } from "react-icons/pi";
import { FiHome } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { PresentationContext } from "../../contexts/presentationContext";
import "./styles/style.css";
import { LoadingAssetBig2 } from "../../assets/assets";
import Menu from "./Modals/Menu";
import { MIC_STATE } from "../../constants/routes";
import download from "./download";
import { useMessageStore } from "./store/messageStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usepresentationStore } from "./store/presentationStore";
import { useAudioStore } from "./store/audioStore";
import { useRtmStore } from "./store/rtmStore";
import { useSlideStore } from "./store/slideStore";
import { useModalStore } from "./store/modalStore";
import { useOptionsStore } from "./store/optionsStore";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { standardFetch } from "@/lib/axios";

const MessageMenu = lazy(() => import("./Modals/MessageMenu"));
const OptionMenu = lazy(() => import("./Modals/optionMenu"));

// eslint-disable-next-line react/prop-types
export default function Controls({
  containerRef,
  actionsActive
}: {
  containerRef: React.MutableRefObject<any>;
  actionsActive: boolean;
}) {
  const orientation = useOrientation();
  const { fullScreenShow, isMobilePhone, fullScreenToggle } =
    useContext(PresentationContext);
  const isFullscreen = useFullscreen(containerRef, fullScreenShow, {
    onClose: () => fullScreenToggle(false)
  });

  const showUsersList = usepresentationStore((state) => state.showUsersList);
  const setShowUsersList = usepresentationStore(
    (state) => state.setShowUsersList
  );
  const showMessage = usepresentationStore((state) => state.showMessage);
  const setShowMessage = usepresentationStore((state) => state.setShowMessage);
  const showOptions = usepresentationStore((state) => state.showOptions);
  const setShowOptions = usepresentationStore((state) => state.setShowOptions);

  const micState = useAudioStore((state) => state.micState);
  const audioLoadingStatus = useAudioStore((state) => state.loadingStatus);
  const setMicState = useAudioStore((state) => state.setMicState);

  const presentation = usepresentationStore((state) => state.presentation);
  const acceptMicRequest = useAudioStore((state) => state.acceptMicRequest);
  const audioConnectionState = useAudioStore(
    (state) => state.audioConnectionState
  );
  const networkStatus = useAudioStore((state) => state.networkStatus);

  const users = useRtmStore((state) => state.sortedUsers);
  const host = useRtmStore((state) => state.host);

  const synced = useSlideStore((state) => state.synced);
  const syncSlide = useSlideStore((state) => state.syncSlide);

  const rtcUid = useRtmStore((state) => state.token?.rtcUid);
  const coHostId = useRtmStore((state) => state.coHostId);

  const [loadingStatus, setLoadingStatus] = useState<any>({});

  const unReadMessagesCount = useMessageStore(
    (state) => state.unReadMessages.length
  );

  useEffect(function () {
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
      if (micState === MIC_STATE.MIC_OFF || audioLoadingStatus !== "success") {
        const text =
          audioLoadingStatus === "success"
            ? "MIC OFF"
            : presentation?.User === "HOST" && presentation.status === "AUDIO"
              ? "REJOIN"
              : presentation?.User === "HOST" && presentation.status !== "AUDIO"
                ? "START"
                : "JOIN";
        return { style: "bg-gray-300", icon: <IoIosMic size={46} />, text };
      } else if (micState === MIC_STATE.REQ_MIC) {
        return {
          style: "bg-orange-500",
          icon: <PiHandWaving size={46} />,
          text: "REQUESTING"
        };
      } else if (micState === MIC_STATE.MIC_MUTED) {
        return {
          style: "bg-rose-500",
          icon: <IoIosMic size={46} />,
          text: "MIC MUTED"
        };
      } else if (micState === MIC_STATE.CAN_SPK) {
        return {
          style: "bg-[#05FF00]",
          icon: <IoIosMic size={46} />,
          text: "MIC ON"
        };
      }
    },
    [micState, audioLoadingStatus, presentation]
  );

  const getUserMicStatusColor = useCallback(function (micStatus: MIC_STATE) {
    if (micStatus === MIC_STATE.MIC_MUTED) {
      return "border-rose-500";
    } else if (micStatus === MIC_STATE.REQ_MIC) {
      return "border-orange-500 animate-pinging";
    } else if (micStatus === MIC_STATE.CAN_SPK) {
      return "border-[#05FF00]";
    } else {
      return "border-transparent";
    }
  }, []);

  const handleAcceptMicRequest = useCallback(
    async function (user: { status: MIC_STATE; id: string }) {
      if (!presentation) return;
      if (presentation.User === "GUEST") return;

      if (user.status === MIC_STATE.REQ_MIC) {
        await acceptMicRequest(user.id, MIC_STATE.MIC_MUTED);
      } else if (user.status === MIC_STATE.CAN_SPK) {
        await acceptMicRequest(user.id, MIC_STATE.MIC_OFF);
      }
    },
    [presentation]
  );

  const isModalOpen = useModalStore((state) => state.isOpen);
  const styles = useMemo(() => {
    if (audioConnectionState === "RECONNECTING") {
      return "opacity-0";
    }
    if (
      (isMobilePhone && orientation.type.includes("portrait")) ||
      actionsActive ||
      isModalOpen ||
      showUsersList ||
      showMessage ||
      showOptions
    ) {
      return "opacity-100";
    }
    return "opacity-0";
  }, [
    actionsActive,
    orientation,
    isMobilePhone,
    isModalOpen,
    showUsersList,
    showMessage,
    audioConnectionState,
    showOptions
  ]);

  const startPrompt = useModalStore((state) => state.startPrompt);
  const endPrompt = useModalStore((state) => state.endPrompt);

  function hapticFeedback() {
    if (navigator.vibrate) {
      navigator.vibrate([70]);
    }
  }

  function actionMicButton() {
    // hapticFeedback();
    if (audioLoadingStatus !== "success") {
      startPrompt();
      return;
    }

    if (presentation?.User === "HOST" || presentation?.User === "CO-HOST") {
      if (micState === MIC_STATE.CAN_SPK) {
        setMicState(MIC_STATE.MIC_MUTED);
      } else {
        setMicState(MIC_STATE.CAN_SPK);
      }
    } else {
      if (micState === MIC_STATE.MIC_OFF) {
        setMicState(MIC_STATE.REQ_MIC);
      } else if (micState === MIC_STATE.REQ_MIC) {
        setMicState(MIC_STATE.MIC_OFF);
      } else if (micState === MIC_STATE.CAN_SPK) {
        setMicState(MIC_STATE.MIC_MUTED);
      } else if (micState === MIC_STATE.MIC_MUTED) {
        setMicState(MIC_STATE.CAN_SPK);
      }
    }
  }

  function downloadFile(url: string, filename: string) {
    standardFetch
      .get(url, {
        responseType: "blob"
      })
      .then((res) => {
        download(res.data, filename);
      });
  }

  const screenShareEnabled = useAudioStore((state) => state.screenShareEnabled);
  const screenShareMinimized = useAudioStore(
    (state) => state.screenShareMinimized
  );
  const toggleScreenMinimize = useOptionsStore(
    (state) => state.toggleScreenMinimize
  );
  const toggleScreenShare = useOptionsStore((state) => state.toggleScreenShare);
  const iAmScreenSharing = useAudioStore((state) => state.iAmScreenSharing);

  return (
    <div
      className={`fixed z-50 bottom-5 right-0 left-0 h-30 flex justify-right items-center justify-center ${styles}`}
    >
      {audioLoadingStatus === "success" && (
        <div className="absolute md:bottom-5 bottom-24 left-1 md:left-5 flex justify-center items-center z-10">
          <div className={`network__bar ${networkStatus}`}>
            <span className="bar1"></span>
            <span className="bar2"></span>
            <span className="bar3"></span>
          </div>

          {iAmScreenSharing && (
            <button
              onClick={toggleScreenShare}
              className="rounded-full bg-[#05FF00] w-10 h-10 flex justify-center items-center"
            >
              <MdOutlineStopScreenShare size={20} />
            </button>
          )}
        </div>
      )}
      <div className="flex gap-20 items-center justify-center relative w-full mb-5">
        {screenShareEnabled && (
          <button
            onClick={toggleScreenMinimize}
            className="bg-primaryTwo border-[1px] border-[#FF8B1C] w-32 rounded aspect-video absolute bottom-40 md:bottom-20 md:left-5 left-1 cursor-pointer"
          >
            {screenShareMinimized ? (
              <p className="text-white rounded">Screen Share</p>
            ) : (
              <img src={presentation?.thumbnail} className="rounded" />
            )}
          </button>
        )}
        {/* Desktop controls */}
        <div className="items-center gap-5 flex-wrap sm:flex hidden">
          {audioLoadingStatus === "success" && (
            <>
              {(presentation?.User === "HOST" ||
                presentation?.User === "CO-HOST") && (
                <button
                  onClick={() => setShowOptions(true)}
                  className="rounded-full p-3 bg-gray-300 shadow"
                >
                  <BsThreeDots size={24} />
                </button>
              )}
              <a href="/" className="rounded-full p-3 bg-gray-300 shadow">
                <FiHome size={24} />
              </a>
              <button
                disabled={!presentation?.downloadable}
                className={`rounded-full p-3 bg-gray-300 shadow ${!presentation?.downloadable && "!cursor-not-allowed"}`}
                onClick={() =>
                  downloadFile(
                    presentation?.pdfLink || "",
                    `${presentation?.name}.pdf` || ""
                  )
                }
              >
                <IoCloudDownloadOutline
                  size={24}
                  color={presentation?.downloadable ? "primaryTwo" : "bg-gray-400"}
                />
              </button>
            </>
          )}
          {(presentation.status === "AUDIO" || presentation?.User === "HOST") && (
            <div className="flex flex-col items-center justify-center relative">
              <button
                className={`${micStyle?.style} rounded-full p-3 shadow ${audioLoadingStatus === "loading" && "!cursor-not-allowed"}`}
                onClick={actionMicButton}
                disabled={audioLoadingStatus === "loading"}
              >
                {audioLoadingStatus === "loading" ? (
                  <LoadingAssetBig2 />
                ) : (
                  micStyle?.icon
                )}
              </button>
              <span className="rounded mt-1 p-1 bg-primaryTwo/50 text-white absolute -bottom-9 w-28 text-center">
                {micStyle?.text}
              </span>
            </div>
          )}
          {audioLoadingStatus === "success" && (
            <>
              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onClick={() => setShowUsersList(true)}
                >
                  <FaRegUser size={24} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {users.length + (host ? 1 : 0)}
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
                onClick={endPrompt}
                className="rounded-full p-3 bg-rose-500"
              >
                <MdCallEnd size={24} />
              </button>
            </>
          )}
        </div>
        {/* mobile controls */}
        <div className=" items-center gap-6 flex-wrap sm:hidden flex">
          {audioLoadingStatus === "success" && (
            <>
              {presentation?.User === "HOST" ||
              presentation?.User === "CO-HOST" ? (
                <button
                  onMouseDown={hapticFeedback}
                  onClick={() => setShowOptions(true)}
                  className="rounded-full p-3 bg-gray-300 shadow"
                >
                  <BsThreeDots size={18} />
                </button>
              ) : presentation?.downloadable ? (
                <button
                  disabled={!presentation?.downloadable}
                  className={`rounded-full p-3 bg-gray-300 shadow ${!presentation?.downloadable && "!cursor-not-allowed"}`}
                  onMouseDown={hapticFeedback}
                  onClick={() =>
                    downloadFile(
                      presentation?.pdfLink || "",
                      `${presentation?.name}.pdf` || ""
                    )
                  }
                >
                  <IoCloudDownloadOutline
                    size={18}
                    color={presentation?.downloadable ? "primaryTwo" : "bg-gray-400"}
                  />
                </button>
              ) : (
                <a href="/" className="rounded-full p-3 bg-gray-300 shadow">
                  <FiHome size={18} />
                </a>
              )}

              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onMouseDown={hapticFeedback}
                  onClick={() => setShowUsersList(true)}
                >
                  <FaRegUser size={18} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {users.length + (host ? 1 : 0)}
                </span>
              </div>
            </>
          )}
          {(presentation.status === "AUDIO" || presentation.User === "HOST") && (
            <div className="flex flex-col items-center justify-center relative">
              <button
                className={`${micStyle?.style} rounded-full p-3 shadow`}
                onClick={actionMicButton}
                disabled={audioLoadingStatus === "loading"}
              >
                {audioLoadingStatus === "loading" ? (
                  <LoadingAssetBig2 />
                ) : (
                  micStyle?.icon
                )}
              </button>
              <span className="rounded mt-1 p-1 bg-primaryTwo/50 text-white absolute -bottom-9 w-28 text-center">
                {micStyle?.text}
              </span>
            </div>
          )}
          {audioLoadingStatus === "success" && (
            <>
              <div className="relative">
                <button
                  className="rounded-full p-3 bg-gray-300 shadow"
                  onMouseDown={hapticFeedback}
                  onClick={() => setShowMessage(true)}
                >
                  <LuMessagesSquare size={18} />
                </button>
                <span className="absolute -top-2 -right-2 bg-slate-400 rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                  {unReadMessagesCount}
                </span>
              </div>
              <button
                onClick={endPrompt}
                className="rounded-full p-3 bg-rose-500"
              >
                <MdCallEnd size={18} />
              </button>
            </>
          )}
        </div>
        <div className="absolute md:bottom-5 bottom-24 right-2 md:right-5 flex gap-4">
          {!synced && presentation.status !== "NOT_LIVE" && presentation?.User === "GUEST" && (
            <button
              onClick={syncSlide}
              className="shadow bg-primaryTwo rounded-full p-2 block w-fit h-fit border-gray-100 border-[1px]"
            >
              <IoSync color="white" size={28} />
            </button>
          )}
          {document.fullscreenEnabled && (
            <button
              onClick={() => fullScreenToggle()}
              className="shadow bg-primaryTwo rounded-full p-2 block w-fit h-fit border-gray-100 border-[1px]"
            >
              {isFullscreen ? (
                <RxExitFullScreen color="white" size={28} />
              ) : (
                <RxEnterFullScreen color="white" size={28} />
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
            <h4 className="text-2xl text-center text-primaryTwo font-bold">
              Live Audience
            </h4>
            <div className="relative w-fit">
              <div className="rounded-full p-3">
                <FaRegUser size={18} />
              </div>
              <span className="absolute -top-2 -right-2 bg-white rounded-full text-sm p-3 flex justify-center items-center w-3 h-3 text-center">
                {users.length + (host ? 1 : 0)}
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
            <p className="font-bold text-sm">{presentation?.name}</p>
            {presentation?.presenter && (
              <p className="text-sm">By {presentation?.presenter}</p>
            )}
          </div>
        </div>

        <div className="text-sm p-3 grid grid-cols-5 sm:grid-cols-4 gap-y-5 overflow-y-auto">
          {users.map((user) => (
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
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}`}
                  />
                  <AvatarFallback>
                    {user.userName.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
              <div className="w-20 flex flex-col justify-center items-center gap-2">
                {rtcUid === user.id && <span>(You)</span>}
                {coHostId === user.id && <span>(Co-host)</span>}
              </div>
            </button>
          ))}
        </div>
      </Menu>

      {(presentation?.User === "HOST" || presentation?.User === "CO-HOST") && (
        <OptionMenu
          open={showOptions}
          onClose={() => setShowOptions(false)}
          users={users}
        />
      )}
    </div>
  );
}
