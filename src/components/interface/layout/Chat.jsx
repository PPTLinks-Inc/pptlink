import {
  ChatBubble,
  ChatBubbleRounded,
  Close,
  CloseOutlined,
  MessageRounded,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronUp, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import Waves from "./assets/images/waves.svg";
import MicGradient from "./assets/images/mic-gradient.svg";
import Speaker from "./assets/images/speaker.svg";
import Media from "react-media";

const participants = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export default function Chat() {
  const [chatOpen, setChatOpen] = useState({
    open: false,
    join: false,
    expand: false,
    messaging: false,
  });

  const [chatHeight, setChatHeight] = useState("2.5rem");

  const closeChat = () => {
    setChatOpen((prev) => ({
      ...prev,
      open: false,
      expand: false,
      expandMax: false,
    }));
    setChatHeight("2.5rem");
  };

  const leaveChat = () => {
    closeChat();
    setChatOpen((prev) => ({
      ...prev,
      join: false,
    }));
    setChatHeight("2.5rem");
  };

  const joinChat = () => {
    setChatOpen((prev) => ({ ...prev, join: true }));
  };

  const openChat = () => {
    setChatOpen((prev) => ({ ...prev, open: true, expand: false }));
    setChatHeight("12rem");
  };

  const expandChat = () => {
    if (!chatOpen.join) return;
    setChatOpen((prev) => ({ ...prev, expand: true, messaging: false }));
    setChatHeight("22rem");
  };

  const showMessaging = () => {
    setChatOpen((prev) => ({
      ...prev,
      messaging: true,
      expand: false,
    }));
    setChatHeight("31rem");
  };

  return (
    <Media queries={{ small: { maxWidth: 720 } }}>
      {(matches) => (
        <motion.div
          //   initial={{
          //     width: "3rem",
          //     height: "3rem",
          //   }}
          animate={{
            width: !matches.small
              ? chatOpen.open
                ? "30rem"
                : matches.small
                ? "100%"
                : "10rem"
              : "100%",
            height: chatHeight,
          }}
          drag={!matches.small && true}
          dragMomentum={false}
          dragElastic={false}
          className={`text-white fixed  rounded-2xl border-gray-500 ${
            !matches.small
              ? "bottom-20 right-24 cursor-grab active:cursor-grabbing"
              : "left-0 bottom-0 w-full"
          }  overflow-clip_  bg-gray-900 z-[10000]`}
        >
          <div className="flex flex-col h-full">
            <button
              onClick={() => {
                !chatOpen.open
                  ? openChat()
                  : !chatOpen.expand && chatOpen.open
                  ? expandChat()
                  : chatOpen.messaging
                  ? expandChat()
                  : chatOpen.expand && chatOpen.open
                  ? openChat()
                  : closeChat();
              }}
              className={`${!chatOpen.open ? "mx-auto w-full" : "self-end"} ${
                chatOpen.messaging && "ml-auto !mx-0 self-end "
              } ${
                matches.small && "!mx-auto"
              } w-fit flex items-center justify-center p-2 shrink-0`}
            >
              <FaChevronUp
                className={`w-6 h-6 fill-white text-white transition-all duration-150 ${
                  chatOpen.expand
                    ? "rotate-180"
                    : chatOpen.messaging
                    ? "-rotate-90"
                    : ""
                }`}
              />
            </button>
            {chatOpen.messaging ? (
              <AnimateInOut
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                show={chatOpen.messaging}
                className="gap-2 p-3 flex flex-col flex-1 overflow-hidden"
              >
                <Messaging />
              </AnimateInOut>
            ) : chatOpen.join ? (
              <>
                <AnimateInOut
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  show={chatOpen.open}
                  className="w-full flex gap-3 items-center p-2"
                >
                  <Host />{" "}
                  <div className="space-y-2 flex w-full flex-row-reverse gap-3">
                    <div className="p-2 flex-1 border border-gray-500 rounded-lg">
                      <p>Presentation name</p>
                    </div>
                    <div className="flex items-center gap-2">
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
                <AnimateInOut
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  show={chatOpen.expand}
                  className={
                    "flex mt-6 items-center gap-4 overflow-auto w-full mx-2"
                  }
                >
                  {participants.map((participant, i) => (
                    <Participant key={i} />
                  ))}
                </AnimateInOut>
              </>
            ) : chatOpen.open ? (
              <JoinConversation closeChat={closeChat} joinChat={joinChat} />
            ) : null}
          </div>
        </motion.div>
      )}
    </Media>
  );
}

//
function Host() {
  return (
    <div className="-space-y-1  w-fit text-center">
      <div>
        <span className="inline-block w-2 h-2 rounded-full bg-green-600 shadow-sm shadow-green-500/50" />
        <small className="ml-1">host</small>
      </div>
      <div className="rounded-full_ relative before:w-full before:h-full before:rounded-full before:bg-green-400/50 before:animate-ping before:absolute before:inset-0 before:m-auto before:-z-10 after:w-full after:h-full after:rounded-full after:bg-green-500/50 after:animate-ping-200 after:absolute after:inset-0 after:m-auto after:-z-20 after:delay-150 z-30 overflow-clip_ w-20 h-20">
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

// NOTE {status:"speaker" | "speaking" | "listener", role:"guest"|"host", muted:boolean}
function Participant({
  status = "speaking",
  img,
  name,
  role = "guest",
  muted,
}) {
  return (
    <div className="flex flex-col shrink-0 gap-1 items-center justify-center">
      <div className="rounded-full overflow-clip shrink-0 w-16 h-16">
        <img
          src="/team/ray.jpg"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <small className="capitalize text-white">{role}</small>
      <div className="flex items-center gap-1">
        <span className="text-green-400">
          {status === "speaking" && "speaking"}
        </span>
        <div className="w-5 h-5">
          {status === "speaking" ? (
            <img src={Speaker} alt="" className="w-full h-full" />
          ) : (
            <img src={MicGradient} alt="" className="w-full h-full" />
          )}
        </div>
      </div>
    </div>
  );
}

function AnimateInOut({ children, initial, animate, exit, className, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={initial}
          animate={animate}
          exit={exit}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const messages = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
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
      <div className="flex items-center gap-3 shrink-0">
        <Host />
        <div className="">
          <img src={Waves} />
        </div>
        <div className="p-2 border border-gray-500 rounded-lg">
          <p>Presentation name</p>
        </div>
      </div>
      <div className="space-y-2_ overscroll-none border-t-[1px] border-slate-200/30 flex-[3] overflow-y-auto py-2 divide-y divide-slate-200/30">
        {messages.map((message, i) => (
          <Message key={i} />
        ))}
      </div>
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
          <FaPaperPlane className="w-8 h-8 text-white fill-white" />
        </button>
      </form>
    </>
  );
}

function JoinConversation({ closeChat, joinChat }) {
  const [join, setJoin] = useState({
    joined: false,
    error: "",
  });

  const RequestToJoin = () => (
    <div className="w-fit mx-auto space-y-4">
      <p className="text-slate-200 text-xl font-semibold capitalize">
        Join Conversation
      </p>
      <div className="flex justify-between items-center">
        <button
          onClick={() => setJoin((prev) => ({ ...prev, joined: true }))}
          className="rounded-xl py-3 px-4 text-black bg-slate-200 uppercase"
        >
          yes
        </button>
        <button
          onClick={() => closeChat()}
          className="py-3 px-4 border border-slate-200 rounded-xl text-slate-200 uppercase"
        >
          no
        </button>
      </div>
    </div>
  );

  const JoinAs = () => {
    const [username, setUsername] = useState("");

    return (
      <div className="w-fit mx-auto space-y-4">
        <p className="text-slate-200 text-center text-xl font-semibold capitalize">
          Join Conversation As
        </p>
        <div className="text-center_">
          <div className="flex justify-between h-12 gap-2 items-stretch">
            <div className="flex-1 h-full overflow-clip border border-slate-200 rounded-md">
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-2 h-full bg-transparent"
              />
            </div>
            <button
              onClick={() => {
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
              className="py-3 px-6 font-bold text-slate-200 border border-slate-200 uppercase rounded-xl"
            >
              join
            </button>
          </div>
          {join.error && <small className="text-rose-600">{join.error}</small>}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[80%] mx-auto border rounded-xl p-4">
      {join.joined ? <JoinAs /> : <RequestToJoin />}
    </div>
  );
}
