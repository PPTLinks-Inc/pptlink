// Importing components and libraries
import { CloseOutlined, MessageRounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import {
  FaChevronUp,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaWindowMinimize,
} from "react-icons/fa";
import Waves from "./assets/images/waves.svg";
import MicGradient from "./assets/images/mic-gradient.svg";
import Media from "react-media";
import AnimateInOut from "../../AnimateInOut";
import { toast } from "react-toastify";
import { PresentationContext } from "../../../contexts/presentationContext";
import { userContext } from "../../../contexts/userContext";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import { AGORA_APP_ID } from "../../../constants/routes";

let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const activePingSTyles =
  "shadow-green-500/50 before:bg-green-400/50 after:bg-green-500/50  shadow-green-500/50 before:bg-green-400/50 after:bg-green-500/50 relative before:w-full before:h-full before:rounded-full  before:animate-ping before:absolute before:inset-0 before:m-auto before:-z-10 after:w-full after:h-full after:rounded-full  after:animate-ping-200 after:absolute after:inset-0 after:m-auto after:-z-20 after:delay-150 z-30";

// MIC States
const BASE_MIC = "base mic";
const REQ_MIC = "request to speak";
const CAN_SPK = "user is allowed to speak";
const MIC_OFF = "mic is off";

// Chat component
const Chat = React.memo(
  ({
    closeChatModal,
    setCloseChatModal,
    setKeepChatOpen,
    active: CHAT_ACTIVE,
    keepChatOpen,
  }) => {
  // const [guests, setGuests] = useState(DUMMY_GUESTS);
  const { presentation, setPresentation, socket } =
    useContext(PresentationContext);
  // const user = useContext(userContext);
  const [isHost, setIsHost] = useState(presentation.User === "HOST");
  const [hostMuted, setHostMuted] = useState(true);
  const [conversationLive, setConversationLive] = useState(presentation.audio);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [micState, setMicState] = useState(MIC_OFF);
  const [username, setUsername] = useState("");
  const [hostName, setHostName] = useState("The Host 😎");

  // status: CAN_SPEAK | REQUESTED | CANNOT_SPEAK
  const [participants, setParticipants] = useState([]);

  const currentUser = "me";

  // State to manage chat modal's open, join, expand, and messaging states
  const [chatOpen, setChatOpen] = useState({
    open: false,
    active: false,
    join: false,
    expand: false,
    participants: false,
    messaging: false,
  });

  useEffect(() => {
    if (isHost) {
      if (micState === CAN_SPK) {
        // socket.emit("host-audio-on", presentation.liveId);
        audioTracks.localAudioTrack?.setMuted(false);
      }
      if (micState === MIC_OFF) {
        // socket.emit("host-audio-off", presentation.liveId);
        audioTracks.localAudioTrack?.setMuted(true);
      }
    }
  }, [micState]);

  useEffect(() => {
    console.log({ closeChatModal });
    if (closeChatModal) {
      closeChat();
    }
  }, [closeChatModal]);

  useEffect(() => {
    if (isHost && presentation.audio) {
      openChat();
      joinChat();
    }
    if (!isHost && presentation.audio) openChat();

    if (!isHost && !presentation.audio) {
      socket.on("client-audio-on", () => {
        setConversationLive(true);
        openChat();
      });
    }

    if (!isHost) {
      socket.on("client-audio-off", () => {
        leaveChat({ emitEvent: false });
        setConversationLive(false);
        toast.success("Audio is no longer active");
      });
    }

    if (chatOpen.join) {
      (async () => {
        await rtcClient.join(
          AGORA_APP_ID,
          presentation.liveId,
          presentation.rtcToken,
          presentation.rtcUid
        );

        audioTracks.localAudioTrack =
          await AgoraRTC.createMicrophoneAudioTrack();
        // audioTracks.localAudioTrack.setMuted(true);
        await rtcClient.publish(audioTracks.localAudioTrack);

        // console.log("publish success");
      })();

      rtcClient.on("user-published", async (user, mediaType) => {
        await rtcClient.subscribe(user, mediaType);

        if (mediaType == "audio") {
          audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
          user.audioTrack.play();
        }
      });
      rtcClient.on("user-left", (user) => {
        delete audioTracks.remoteAudioTracks[user.uid];

        setParticipants((prev) =>
          prev.filter((participant) => participant.id !== user.uid)
        );
      });

      socket.on("new-user-audio", (newUser) => {
        setParticipants((prev) => [...prev, newUser]);
      });
    }

    return () => {
      if (chatOpen.join) {
        audioTracks.localAudioTrack?.stop();
        audioTracks.localAudioTrack?.close();

        rtcClient?.unpublish();
        rtcClient?.leave();
      }
    };
  }, [chatOpen.join]);

  // State to manage the height of the chat modal
  const [chatHeight, setChatHeight] = useState("2.5rem");

  // Function to open the chat modal
  const openChat = () => {
    setChatOpen((prev) => ({ ...prev, open: true, expand: false }));
    setChatHeight("12rem");
    setKeepChatOpen(true);
    setCloseChatModal(false);
  };

  // Function to initialize chat
  const activateChat = () => {
    if (!isHost) return;
    if (!presentation.live) {
      toast.error("Presentation not live");
      return;
    }
    socket.emit(
      "client-audio-on",
      {
        liveId: presentation.liveId,
        presentationId: presentation.id,
      },
      (response) => {
        if (response) {
          joinChat();
          setChatOpen((prev) => ({ ...prev, active: true }));
          expandChat();
          toast.success("Audio activated");
        } else {
          toast.error("Audio activation failed");
        }
      }
    );
  };

  // Function to join the chat
  const joinChat = async () => {
    if (isHost) {
      socket.emit(
        "host-audio-connect",
        {
          hostName: "HOST",
          liveId: presentation.liveId,
          presentationId: presentation.id,
          hostId: presentation.rtcUid,
        },
        (response) => {
          if (!response) {
            toast.error("Failed to join conversation");
            return;
          }
          // setHostName(user.username);
          setChatOpen((prev) => ({ ...prev, join: true }));
          toast.success("Joined conversation");
        }
      );
    } else {
      socket.emit(
        "join-audio-session",
        {
          username,
          userId: presentation.rtcUid,
          liveId: presentation.liveId,
        },
        (response) => {
          if (!response) {
            toast.error("Failed to join conversation");
            return;
          }
          setHostName(response.host.name);
          setParticipants(response.users);
          setChatOpen((prev) => ({ ...prev, join: true }));
          toast.success("Joined conversation");
        }
      );
    }
  };

  // Function to expand the chat modal
  const expandChat = () => {
    if (!chatOpen.join && !chatOpen.active) return;
    setChatOpen((prev) => ({
      ...prev,
      expand: true,
      messaging: false,
      participants: false,
    }));
    setChatHeight("22rem");
  };

  // Function to show messaging in the chat modal
  const showMessaging = () => {
    setChatOpen((prev) => ({
      ...prev,
      messaging: true,
      participants: false,
      expand: false,
    }));
    setChatHeight("31rem");
  };

  // Function to show participants list in the chat modal
  const showParticipants = () => {
    setChatOpen((prev) => ({
      ...prev,
      participants: true,
      messaging: false,
      expand: false,
    }));
    setChatHeight("31rem");
  };

  // Function to close the chat modal
  const closeChat = () => {
    setChatOpen((prev) => ({
      ...prev,
      open: false,
      expand: false,
      expandMax: false,
      messaging: false,
      participants: false,
    }));
    setChatHeight("2.5rem");
    setKeepChatOpen(false);
    setCloseChatModal(true);
  };

  // Function to leave the chat
  const leaveChat = ({ emitEvent }) => {
    if (!isHost && emitEvent) {
      socket.emit(
        "leave-audio-session",
        {
          userId: presentation.rtcUid,
          liveId: presentation.liveId,
        },
        (response) => {
          if (!response) {
            toast.error("Failed to leave conversation");
            return;
          }
          toast.success("Left conversation");
          setParticipants([]);
          closeChat();
          setChatOpen((prev) => ({
            ...prev,
            join: false,
          }));
          setChatHeight("2.5rem");
          audioTracks.localAudioTrack?.stop();
          audioTracks.localAudioTrack?.close();

          rtcClient?.unpublish();
          rtcClient?.leave();
        }
      );
    } else {
      setParticipants([]);
      closeChat();
      setChatOpen((prev) => ({
        ...prev,
        join: false,
      }));
      setChatHeight("2.5rem");
      audioTracks.localAudioTrack?.stop();
      audioTracks.localAudioTrack?.close();

      rtcClient?.unpublish();
      rtcClient?.leave();
    }
  };

  const endChat = () => {
    setPresentation((prev) => ({ ...prev, audio: false }));
    setChatOpen((prev) => ({ ...prev, active: false }));
    socket.emit("client-audio-off", presentation.liveId, (response) => {
      if (response) {
        toast.success("Audio deactivated");
        leaveChat({emitEvent: true});
      } else {
        toast.error("Audio deactivation failed");
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setConversationLive(true);
    }, 3000);
  }, []);

  useEffect(() => {
    console.log({ active: CHAT_ACTIVE, open: chatOpen.open, keepChatOpen });
  }, [CHAT_ACTIVE, keepChatOpen, chatOpen.open]);

  const LeaveConversationModal = () => {
    return (
      <>
        <div
          title="close modal"
          onClick={() => setShowLeave(false)}
          className="w-full h-full fixed top-0 left-0 backdrop-blur-sm bg-slate-200/20 z-40"
        />

        <div className="w-96 h-60 flex flex-col items-center justify-center  p-3 rounded-2xl fixed inset-0 m-auto bg-black  py-8 border-slate-200 border mx-auto space-y-4 z-50">
          <p className="text-slate-200 text-xl text-center font-semibold capitalize">
            {isHost ? "End Conversation" : "Leave chat"}
          </p>
          <div className="flex gap-8 justify-center items-center">
              <button
                onClick={() => {
                  setShowLeave(false);
                  if (isHost) return endChat();
                  leaveChat({ emitEvent: true});
                }}
                className="rounded-xl p-2 text-black bg-slate-200 uppercase"
              >
                confirm
              </button>
              <button
                onClick={() => setShowLeave(false)}
                className="p-2 border border-slate-200/10 rounded-xl text-slate-200 uppercase"
              >
                cancel
              </button>
            </div>
          </div>
        </>
      );
    };

    return (
      (isHost || conversationLive) && (
        <>
          {/*  Media query to handle responsiveness */}
          <Media queries={{ small: { maxWidth: 900 } }}>
            {(matches) => (
              <div
                className={`transition-all duration-200 ${
                  CHAT_ACTIVE || chatOpen.open || keepChatOpen ? "" : "hidden"
                } fixed w-full z-50 h-fit ${
                  matches.small && chatOpen.open
                    ? "bottom-0"
                    : "bottom-[4.5rem]"
                } 
          `}
              >
                <div className="relative flex items-center justify-center w-full h-full md:h-auto_">
                  <motion.div
                    animate={{
                      width: !matches.small
                        ? chatOpen.open
                          ? "30rem"
                          : matches.small
                          ? "100%"
                          : "10rem"
                        : matches.small
                        ? !chatOpen.open
                          ? "10rem"
                          : "100%"
                        : "100%",
                      height: matches.small
                        ? chatOpen.open
                          ? chatOpen.participants || chatOpen.messaging
                            ? "95vh"
                            : chatOpen.expand
                            ? "80vh"
                            : "12rem"
                          : "3rem"
                        : chatHeight,
                      translateY: !matches.small
                        ? chatOpen.open && chatOpen.expand
                          ? -150
                          : chatOpen.open &&
                            (chatOpen.messaging || chatOpen.participants)
                          ? -250
                          : chatOpen.open
                          ? -50
                          : 0
                        : null,

                      // translateX: chatOpen.open
                      //   ? "15rem"
                      //   : matches.small
                      //   ? "100%"
                      //   : "5rem",
                    }}
                    transition={{ type: "keyframes" }}
                    drag={!matches.small && true}
                    dragMomentum={false}
                    dragElastic={false}
                    className={`absolute text-slate-200  rounded-2xl ${
                      !matches.small
                        ? "m-auto w-full cursor-grab active:cursor-grabbing"
                        : chatOpen.open
                        ? "bottom-0" //COMEBACK
                        : ""
                    }  overflow-clip_  bg-black border border-slate-200`}
                  >
                    <div className="flex flex-col h-full">
                      <div
                        className={`flex items-center gap-2 w-full mx-auto ${
                          !chatOpen.open ? "w-full" : ""
                        } ${matches.small && "!mx-auto w-full"} `}
                      >
                        {/* ARROW(chevron) TOGGLE */}
                        {/* Button to toggle the chat modal */}
                        <div className="flex-1">
                          <button
                            onClick={() => {
                              !chatOpen.open
                                ? openChat()
                                : !chatOpen.expand &&
                                  chatOpen.open &&
                                  (chatOpen.join || chatOpen.active)
                                ? expandChat()
                                : chatOpen.messaging || chatOpen.participants
                                ? expandChat()
                                : chatOpen.expand && chatOpen.open
                                ? openChat()
                                : closeChat();
                            }}
                            className={`w-fit ${
                              !chatOpen.open && "w-full"
                            } flex items-center justify-center p-2 shrink-0 mx-auto`}
                          >
                            {/* Icon for the toggle button */}
                            {chatOpen.open ? (
                              <FaChevronUp
                                className={`w-6 h-6 fill-slate-200 text-slate-200 transition-all duration-150 ${
                                  chatOpen.expand ||
                                  !(chatOpen.join || chatOpen.active)
                                    ? "rotate-180"
                                    : chatOpen.messaging ||
                                      chatOpen.participants
                                    ? "-rotate-90"
                                    : ""
                                }`}
                              />
                            ) : (
                              <FaMicrophone className="`w-6 h-6 fill-slate-200 text-slate-200" />
                            )}
                          </button>
                        </div>
                        {/* MINIMIZE(close) BUTTON */}
                        {/* To enable a user easily close the conversation modal, irrespective of current modal state (besides when a user is yet to join conversation) */}
                        <AnimateInOut
                          // Should be rendered only If the conversation Modal is open and the user has joined the conversation
                          show={
                            chatOpen.open &&
                            (!!chatOpen.join || !!chatOpen.active)
                          }
                          initial={{ scale: 0 }}
                          exit={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-fit absolute top-1 right-1 ml-auto"
                        >
                          <button
                            onClick={() => closeChat()}
                            className="w-fit flex items-center justify-center p-2 shrink-0 hover:bg-slate-200/10 rounded-full"
                          >
                            {/* Icon for minimizing the chat modal */}
                            <FaWindowMinimize className="w-5 fill-slate-200 text-slate-200 transition-all duration-150" />
                          </button>
                        </AnimateInOut>
                      </div>
                      {/* Rendering different components based on the chat modal state */}
                      {chatOpen.messaging ? (
                        // Animated messaging component
                        <AnimateInOut
                          initial={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          show={chatOpen.messaging}
                          className="gap-2 p-3 flex flex-col flex-1 overflow-hidden"
                        >
                          <Messaging
                            currentUser={currentUser}
                            hostMuted={hostMuted}
                          />
                        </AnimateInOut>
                      ) : chatOpen.participants ? (
                        <AnimateInOut
                          initial={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          show={chatOpen.participants}
                          className="gap-2 p-3 flex-1 overflow-hidden"
                        >
                          <Participants />
                        </AnimateInOut>
                      ) : chatOpen.join || chatOpen.active ? (
                        // Components for when user joins the chat
                        <>
                          <AnimateInOut
                            initial={
                              !matches.small
                                ? { opacity: 0, scale: 0, translateY: -70 }
                                : { opacity: 0 }
                            }
                            exit={
                              !matches.small
                                ? { opacity: 0, scale: 0, translateY: -70 }
                                : { opacity: 0 }
                            }
                            animate={
                              !matches.small
                                ? { opacity: 1, scale: 1, translateY: 0 }
                                : { opacity: 1 }
                            }
                            show={chatOpen.open}
                            className="w-full flex gap-3 items-center p-2"
                          >
                            <Host muted={hostMuted} name={hostName} />
                            <div className="space-y-2 flex w-full flex-row-reverse gap-3">
                              <div className="p-2 flex-1 rounded-lg">
                                <p>Presentation name</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Buttons for microphone, messaging, and leaving chat */}

                                <button
                                  onClick={() => {
                                    if (isHost) return;
                                    if (
                                      micState === CAN_SPK ||
                                      micState === MIC_OFF
                                    ) {
                                      return setMicState(BASE_MIC);
                                    }
                                    if (micState === MIC_OFF) {
                                      return setMicState(CAN_SPK);
                                    }
                                    if (micState === BASE_MIC && !isHost) {
                                      return setMicState(REQ_MIC);
                                    }
                                    if (micState === REQ_MIC) {
                                      return setMicState(BASE_MIC);
                                    }
                                  }}
                                  className="p-2 relative bg-gray-700 flex items-center justify-center rounded-full"
                                >
                                  <FaMicrophone className="w-6 h-6 " />
                                  <div className="absolute z-10 -bottom-0 right-0 ">
                                    <span
                                      className={`inline-block w-[0.65rem] h-[0.65rem] rounded-full ${
                                        micState === CAN_SPK
                                          ? "bg-green-400 " + activePingSTyles
                                          : micState === REQ_MIC
                                          ? "bg-yellow-400"
                                          : micState === MIC_OFF
                                          ? "bg-rose-500"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                </button>
                                {
                                  <AnimateInOut
                                    show={
                                      micState === CAN_SPK ||
                                      micState === MIC_OFF
                                    }
                                    animate={{ scale: 1 }}
                                    initial={{ scale: 0 }}
                                    exit={{ scale: 0 }}
                                  >
                                    <button
                                      onClick={() => {
                                        if (micState === CAN_SPK)
                                          return setMicState(MIC_OFF);
                                        setMicState(CAN_SPK);
                                      }}
                                      className={`p-2 relative flex items-center ${
                                        micState === MIC_OFF
                                          ? "bg-gray-700"
                                          : ""
                                      } justify-center rounded-full`}
                                    >
                                      <FaMicrophoneSlash className="w-6 h-6 " />
                                    </button>
                                  </AnimateInOut>
                                }
                                <button
                                  onClick={() => showMessaging()}
                                  className="p-2 bg-gray-700 flex items-center justify-center rounded-full"
                                >
                                  <MessageRounded className="w-6 h-6 " />
                                </button>
                                <button
                                  onClick={() => setShowLeave(true)}
                                  className="p-2 bg-gray-700 flex items-center justify-center rounded-full"
                                >
                                  <CloseOutlined className="w-6 h-6 fill-rose-500 text-rose-500" />
                                </button>
                              </div>
                            </div>
                          </AnimateInOut>
                          {/* Animated component to show expanded chat participants */}
                          <AnimateInOut
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            show={chatOpen.expand}
                            className={
                              "flex mt-6 items-center_ gap-4 overflow-auto w-[98%] rounded-xl mx-auto"
                            }
                          >
                            {[...participants]
                              .sort(compareGuests)
                              .slice(0, 5)
                              .map((participant, i) => (
                                <Participant
                                  key={i}
                                  participant={participant}
                                />
                              ))}
                            <div
                              onClick={() => showParticipants()}
                              className="rounded-full overflow-clip shrink-0 w-16 h-16 flex items-center justify-center text-2xl font-bold border border-slate-200/20 cursor-pointer active:scale-90 transition-all duration-150"
                            >
                              +
                              {
                                participants.slice(5, participants.length)
                                  .length
                              }
                            </div>
                          </AnimateInOut>
                        </>
                      ) : chatOpen.open ? (
                        // Component for joining the conversation
                        <AnimateInOut
                          show={chatOpen.open}
                          initial={{ opacity: 0, scale: 0, translateY: -70 }}
                          exit={{ opacity: 0, scale: 0, translateY: -70 }}
                          animate={{ opacity: 1, scale: 1, translateY: 0 }}
                          className="w-[80%] mx-auto border border-slate-200/20 rounded-xl p-4"
                        >
                          {isHost ? (
                            <InitalizeConversation
                              closeChat={closeChat}
                              activateChat={activateChat}
                            />
                          ) : (
                            <JoinConversation
                              closeChat={closeChat}
                              joinChat={joinChat}
                              username={username}
                              setUsername={setUsername}
                            />
                          )}
                        </AnimateInOut>
                      ) : null}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </Media>
          <AnimateInOut
            show={showLeave}
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <LeaveConversationModal />
          </AnimateInOut>
        </>
      )
    );
  }
);
Chat.displayName = "Chat";
export default Chat;

// HOST COMPONENT (For reusability. writing the "double-ping" animation code more than once is a drag)
function Host({ muted, name }) {
  return (
    <div className="space-y-1  w-fit text-center">
      <div>
        {/* Status indicator for host */}
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            muted ? "bg-rose-700" : "bg-green-600"
          } shadow-sm ${!muted && activePingSTyles} `}
        />
        <small className="ml-1">host</small>
      </div>
      {/* Circular avatar with ping animation */}
      <div className="rounded-full_  overflow-clip_ w-14 h-14  md:w-20 md:h-20">
        <img
          src="/team/sam.jpg"
          className="w-full rounded-full h-full z-30 object-cover"
        />
      </div>
      <div className="w-fit text-center text-sm mx-auto">
        <p className="font-semibold">{name}</p>
      </div>
    </div>
  );
}

// NOTE: Expected PropTypes => {status:"muted" | "speaking" | "listening", role:"speaker"|"listener",}
function Participant({ participant, className }) {
  return (
    <div className="flex flex-col text-center shrink-0 gap-1 items-center justify-center whitespace-nowrap ">
      <div
        className={`rounded-full overflow-clip shrink-0 w-12 h-12 md:w-16 md:h-16 ${className}`}
      >
        <img
          src="/team/ray.jpg"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <small className="capitalize text-slate-200 text-ellipsis w-full overflow-hidden">
        {participant.name}
      </small>
      <div className="flex items-center gap-1">
        {/* Status indicator for speaking */}
        <span className="text-green-400"></span>
        <div className="relative w-5 h-5">
          {participant.status !== "CANNOT_SPEAK" && (
            <img src={MicGradient} alt="" className="w-full h-full" />
          )}
          {/* <FaMicrophone className="w-5 h-5" /> */}
          <span
            className={`absolute z-10 -bottom-0 right-0 inline-block w-[0.65rem] h-[0.65rem] rounded-full ${
              participant.status === "CAN_SPEAK"
                ? "bg-green-400"
                : participant.status === "REQUESTED"
                ? "bg-orange-400"
                : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// Dummy messages array for testing purposes
const messages = [
  { sender: "me" },
  { sender: "" },
  { sender: "" },
  { sender: "me" },
  { sender: "" },
  { sender: "" },
  { sender: "" },
];

// Messaging Component
function Messaging({ hostMuted, currentUser, hostName }) {
  const [messageInput, setMessageInput] = useState("");

  const Message = ({ message }) => (
    <div
      className={`flex gap-2 py-2 items-center w-full ${
        message.sender === currentUser && "flex-row-reverse justify-start"
      }`}
    >
      <div className="rounded-full overflow-clip w-8 h-8">
        <img src="/team/bright.jpg" />
      </div>
      <p className="p-1 rounded-lg border_ border-gray-500 w-fit max-w-[70%]">
        has the lecture started? Lorem ipsum dolor, sit amet consectetur
        adipisicing elit. Explicabo quia, mollitia facere nulla molestias saepe
        cumque ratione dolores assumenda veniam.
      </p>
    </div>
  );

  return (
    <>
      {/* Header for the messaging component */}
      <div className="flex items-center gap-3 shrink-0">
        <Host muted={hostMuted} name={hostName} />
        <div className="w-16 md:w-32">
          <img src={Waves} className="w-full h-full object-cover" />
        </div>
        <div className="p-2 rounded-lg">
          <p className="font-bold">Presentation name</p>
        </div>
      </div>
      {/* Container for displaying messages */}
      <div className="space-y-2_ overscroll-none border-t-[1px] border-slate-200/30 flex-[3] overflow-y-auto py-2 divide-y divide-slate-200/30">
        {messages.map((message, i) => (
          <Message key={i} message={message} />
        ))}
      </div>
      {/* Form for sending new messages */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-2 shrink-0"
      >
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="rounded-lg border bg-transparent border-gray-500 text-gray-400 p-1 flex-1"
        />
        <button
          className="flex h-fit items-center justify-center p-3 rounded-lg border"
          type="submit"
        >
          {/* Icon for sending a message */}
          <FaPaperPlane className="w-8 h-8 text-slate-200 fill-slate-200" />
        </button>
      </form>
    </>
  );
}

// Participants Component
function Participants({ participants }) {
  // const Participant = () => (
  //   <div className='w-fit -space-y-1 text-center'>
  //     <div className='rounded-full col-span-1 overflow-clip shrink-0 w-8 h-8 lg:w-12 lg:h-12'>
  //       <img
  //         src='/team/ray.jpg'
  //         className='w-full h-full object-cover'
  //         alt=''
  //       />
  //     </div>
  //     <small className='mx-auto'>guest</small>
  //   </div>
  // );

  return (
    <>
      {/* Header for the messaging component */}
      <div className="flex items-center gap-3 shrink-0">
        <Host />
        {
          <div className="">
            <img src={Waves} />
          </div>
        }
        <div className="p-2 rounded-lg">
          <p>Presentation name</p>
        </div>
      </div>
      {/* Container for displaying messages */}
      <div className="overscroll-none border-t-[1px] border-slate-200/30 grid flex-1 grid-cols-8 gap-y-3 gap-2 overflow-y-auto py-2 divide-slate-200/30">
        {[...participants].sort(compareGuests).map((participant, i) => (
          <Participant
            key={i}
            participant={participant}
            className={"w-8 h-8 lg:w-12 lg:h-12"}
          />
        ))}
      </div>
      {/* Form for sending new messages */}
    </>
  );
}

// Component for joining the conversation
function JoinConversation({ closeChat, joinChat, username, setUsername }) {
  const [join, setJoin] = useState({
    accepted: false,
    error: "",
  });

  // Component to request joining the conversation
  const RequestToJoin = () => (
    <div className="w-fit mx-auto space-y-4">
      <p className="text-slate-200 text-xl font-semibold capitalize text-center">
        Join Conversation
      </p>
      <div className="flex justify-between items-center w-44">
        <button
          onClick={() => setJoin((prev) => ({ ...prev, accepted: true }))}
          className="rounded-xl py-3 px-4 text-black bg-slate-200 uppercase"
        >
          yes
        </button>
        <button
          onClick={() => closeChat()}
          className="py-3 px-4 border border-slate-200/10 rounded-xl text-slate-200 uppercase"
        >
          no
        </button>
      </div>
    </div>
  );

  // Component to enter username to join the conversation
  const JoinAs = ({ username, setUsername }) => {
    return (
      <div className="w-fit mx-auto space-y-4">
        <p className="text-slate-200 text-center text-xl font-semibold capitalize">
          Join Conversation As
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Check if username is empty
            if (!username)
              return setJoin((prev) => ({
                ...prev,
                error: "Please enter a valid username",
              }));

            setJoin((prev) => ({
              ...prev,
              error: "",
            }));
            joinChat();
          }}
          className="text-center_"
        >
          <div className="flex justify-between h-12 gap-2 items-stretch">
            <div className="flex-1 h-full overflow-clip border border-slate-200/10 bg-[#968E8E]/20 rounded-md">
              <input
                type="text"
                autoFocus
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-2 h-full bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 font-bold text-slate-200 border-[1px] border-slate-200/30 uppercase rounded-xl"
            >
              join
            </button>
          </div>
          {/* Error message upon invalid input submission */}
          {join.error && <small className="text-rose-600">{join.error}</small>}
        </form>
      </div>
    );
  };

  return (
    /* Conditionally render */
    join.accepted ? (
      <JoinAs username={username} setUsername={setUsername} />
    ) : (
      <RequestToJoin />
    )
  );
}

// Component for joining the conversation
function InitalizeConversation({ closeChat, activateChat }) {
  return (
    <div className="w-fit mx-auto space-y-4">
      <p className="text-slate-200 text-xl font-semibold capitalize text-center">
        Start conversation
      </p>
      <div className="flex justify-between items-center w-44">
        <button
          onClick={() => activateChat()}
          className="rounded-xl py-3 px-4 text-black bg-slate-200 uppercase"
        >
          yes
        </button>
        <button
          onClick={() => closeChat()}
          className="py-3 px-4 border border-slate-200/10 rounded-xl text-slate-200 uppercase"
        >
          no
        </button>
      </div>
    </div>
  );
}

////////////////////////////////////UTILS/////////////////////////////////////////////
// Custom sorting function
const compareGuests = (a, b) => {
  // Order by status: CAN_SPEAK > REQUESTED > CANNOT_SPEAK
  const statusOrder = { CAN_SPEAK: 0, REQUESTED: 1, CANNOT_SPEAK: 2 };
  if (a.status !== b.status) {
    return statusOrder[a.status] - statusOrder[b.status];
  }

  // For guests with the same status, prioritize unmuted CAN_SPEAK guests
  if (a.status === "CAN_SPEAK" && b.status === "CAN_SPEAK") {
    if (a.muted !== b.muted) {
      return a.muted ? 1 : -1;
    }
  }

  // Keep the original order if everything else is equal
  return 0;
};
