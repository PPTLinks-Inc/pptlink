// Importing necessary components and libraries
import { CloseOutlined, MessageRounded } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FaChevronUp,
  FaMicrophone,
  FaPaperPlane,
  FaRegWindowMinimize,
  FaWindowMinimize,
} from "react-icons/fa";
import Waves from "./assets/images/waves.svg";
import MicGradient from "./assets/images/mic-gradient.svg";
import Speaker from "./assets/images/speaker.svg";
import Media from "react-media";
import AnimateInOut from "../../AnimateInOut";

// Dummy data for the number of participants
const participants = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// Chat component
export default function Chat({ setKeepChatOpen }) {
  // State to manage chat modal's open, join, expand, and messaging states
  const [chatOpen, setChatOpen] = useState({
    open: false,
    join: false,
    expand: false,
    participants: false,
    messaging: false,
  });

  // State to manage the height of the chat modal
  const [chatHeight, setChatHeight] = useState("2.5rem");

  // Function to open the chat modal
  const openChat = () => {
    setChatOpen((prev) => ({ ...prev, open: true, expand: false }));
    setChatHeight("12rem");
    setKeepChatOpen(true);
  };

  // Function to join the chat
  const joinChat = () => {
    setChatOpen((prev) => ({ ...prev, join: true }));
  };

  // Function to expand the chat modal
  const expandChat = () => {
    if (!chatOpen.join) return;
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
      participants: true,
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
    }));
    setChatHeight("2.5rem");
    setKeepChatOpen(false);
  };

  // Function to leave the chat
  const leaveChat = () => {
    closeChat();
    setChatOpen((prev) => ({
      ...prev,
      join: false,
    }));
    setChatHeight("2.5rem");
  };

  return (
    // Media query to handle responsiveness
    <Media queries={{ small: { maxWidth: 720 } }}>
      {(matches) => (
        <div className="fixed w-full z-40 h-fit bottom-0">
          <motion.div
            animate={{
              width: !matches.small
                ? chatOpen.open
                  ? "30rem"
                  : matches.small
                  ? "100%"
                  : "10rem"
                : "100%",
              height: chatHeight,
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
            className={`text-slate-200  rounded-2xl ${
              !matches.small
                ? "m-auto cursor-grab active:cursor-grabbing"
                : "left-0 bottom-0 w-full"
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
                        : !chatOpen.expand && chatOpen.open && chatOpen.join
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
                    <FaChevronUp
                      className={`w-6 h-6 fill-slate-200 text-slate-200 transition-all duration-150 ${
                        chatOpen.open && !chatOpen.join
                          ? "rotate-180"
                          : chatOpen.messaging || chatOpen.participants
                          ? "-rotate-90"
                          : ""
                      }`}
                    />
                  </button>
                </div>
                {/* MINIMIZE(close) BUTTON */}
                {/* To enable a user easily close the conversation modal, irrespective of current modal state (besides when a user is yet to join conversation) */}
                <AnimateInOut
                  // Should be rendered only If the conversation Modal is open and the user has joined the conversation
                  show={chatOpen.open && !!chatOpen.join}
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
                  <Messaging />
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
              ) : chatOpen.join ? (
                // Components for when user joins the chat
                <>
                  <AnimateInOut
                    initial={{ opacity: 0, scale: 0, translateY: -70 }}
                    exit={{ opacity: 0, scale: 0, translateY: -70 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    show={chatOpen.open}
                    className="w-full flex gap-3 items-center p-2"
                  >
                    <Host />{" "}
                    <div className="space-y-2 flex w-full flex-row-reverse gap-3">
                      <div className="p-2 flex-1 rounded-lg">
                        <p>Presentation name</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Buttons for microphone, messaging, and leaving chat */}
                        <button className="p-2 bg-gray-700 flex items-center justify-center rounded-full">
                          <FaMicrophone className="w-6 h-6 " />
                        </button>
                        <button
                          onClick={() => showMessaging()}
                          className="p-2 bg-gray-700 flex items-center justify-center rounded-full"
                        >
                          <MessageRounded className="w-6 h-6 " />
                        </button>
                        <button
                          onClick={() => leaveChat()}
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
                    {participants.slice(0, 5).map((participant, i) => (
                      <Participant key={i} />
                    ))}
                    <div
                      onClick={() => showParticipants()}
                      className="rounded-full overflow-clip shrink-0 w-16 h-16 flex items-center justify-center text-2xl font-bold border border-slate-200/20 cursor-pointer active:scale-90 transition-all duration-150"
                    >
                      +{participants.slice(5, participants.length).length}
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
                  <JoinConversation closeChat={closeChat} joinChat={joinChat} />
                </AnimateInOut>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </Media>
  );
}

// HOST COMPONENT (For reusability. writing the "double-ping" animation code more than once is a drag)
function Host() {
  return (
    <div className="space-y-1  w-fit text-center">
      <div>
        {/* Status indicator for host */}
        <span className="inline-block w-2 h-2 rounded-full bg-green-600 shadow-sm shadow-green-500/50 relative before:w-full before:h-full before:rounded-full before:bg-green-400/50 before:animate-ping before:absolute before:inset-0 before:m-auto before:-z-10 after:w-full after:h-full after:rounded-full after:bg-green-500/50 after:animate-ping-200 after:absolute after:inset-0 after:m-auto after:-z-20 after:delay-150 z-30" />
        <small className="ml-1">host</small>
      </div>
      {/* Circular avatar with ping animation */}
      <div className="rounded-full_  overflow-clip_ w-20 h-20">
        <img
          src="/team/sam.jpg"
          className="w-full rounded-full h-full z-30 object-cover"
        />
      </div>
      <div className="w-fit text-center text-sm mx-auto">
        <p className="font-semibold">Jamilu</p>
      </div>
    </div>
  );
}

// NOTE: Expected PropTypes => {status:"muted" | "speaking" | "listening", role:"speaker"|"listener",}
function Participant({ status = "muted", img, name, role = "guest", muted }) {
  return (
    <div className="flex flex-col shrink-0 gap-1 items-center justify-center">
      <div className="rounded-full overflow-clip shrink-0 w-16 h-16">
        <img
          src="/team/ray.jpg"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <small className="capitalize text-slate-200">{role}</small>
      <div className="flex items-center gap-1">
        {/* Status indicator for speaking */}
        <span className="text-green-400"></span>
        <div className="relative w-5 h-5">
          <img src={MicGradient} alt="" className="w-full h-full" />
          {/* <FaMicrophone className="w-5 h-5" /> */}
          <span
            className={`absolute z-10 -bottom-0 right-0 inline-block w-[0.65rem] h-[0.65rem] rounded-full ${
              status === "speaking"
                ? "bg-green-400"
                : status === "muted"
                ? "bg-yellow-400"
                : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// Dummy messages array for testing purposes
const messages = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// Messaging Component
function Messaging() {
  const [messageInput, setMessageInput] = useState("");

  const Message = () => (
    <div className="flex gap-2 py-2 items-center">
      <div className="rounded-full overflow-clip w-8 h-8">
        <img src="/team/bright.jpg" />
      </div>
      <p className="p-1 rounded-lg border_ border-gray-500 ">
        has the lecture started?
      </p>
    </div>
  );

  return (
    <>
      {/* Header for the messaging component */}
      <div className="flex items-center gap-3 shrink-0">
        <Host />
        <div className="">
          <img src={Waves} />
        </div>
        <div className="p-2 rounded-lg">
          <p>Presentation name</p>
        </div>
      </div>
      {/* Container for displaying messages */}
      <div className="space-y-2_ overscroll-none border-t-[1px] border-slate-200/30 flex-[3] overflow-y-auto py-2 divide-y divide-slate-200/30">
        {messages.map((message, i) => (
          <Message key={i} />
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
function Participants() {
  const Participant = () => (
    <div className="w-fit -space-y-1 text-center">
      <div className="rounded-full col-span-1 overflow-clip shrink-0 w-12 h-12">
        <img
          src="/team/ray.jpg"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <small className="mx-auto">guest</small>
    </div>
  );

  return (
    <>
      {/* Header for the messaging component */}
      <div className="flex items-center gap-3 shrink-0">
        <Host />
        <div className="">
          <img src={Waves} />
        </div>
        <div className="p-2 rounded-lg">
          <p>Presentation name</p>
        </div>
      </div>
      {/* Container for displaying messages */}
      <div className="overscroll-none border-t-[1px] border-slate-200/30 grid flex-1 grid-cols-8 gap-y-3 gap-2 overflow-y-auto py-2 divide-slate-200/30">
        {messages.map((participant, i) => (
          <Participant key={i} />
        ))}
      </div>
      {/* Form for sending new messages */}
    </>
  );
}

// Component for joining the conversation
function JoinConversation({ closeChat, joinChat }) {
  const [join, setJoin] = useState({
    accepted: false,
    error: "",
  });

  // Component to request joining the conversation
  const RequestToJoin = () => (
    <div className="w-fit mx-auto space-y-4">
      <p className="text-slate-200 text-xl font-semibold capitalize">
        Join Conversation
      </p>
      <div className="flex justify-between items-center">
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
  const JoinAs = () => {
    const [username, setUsername] = useState("");

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
    join.accepted ? <JoinAs /> : <RequestToJoin />
  );
}
