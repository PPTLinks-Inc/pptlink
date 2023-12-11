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
    setChatOpen({ open: false, join: false, expand: false, expandMax: false });
    setChatHeight("2.5rem");
  };

  const openChat = () => {
    setChatOpen((prev) => ({ ...prev, open: true }));
    setChatHeight("12rem");
  };

  const expandChat = () => {
    setChatOpen((prev) => ({ ...prev, expand: true, messaging: false }));
    setChatHeight("22rem");
  };

  const showMessaging = () => {
    setChatOpen((prev) => ({
      ...prev,
      messaging: true,
      expand: false,
      join: false,
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
              ? "top-0 right-12 cursor-grab active:cursor-grabbing"
              : "left-0 bottom-0 w-full"
          }  overflow-clip  bg-gray-900`}
        >
          <div className="flex flex-col">
            <button
              onClick={() => {
                !chatOpen.open
                  ? openChat()
                  : !chatOpen.expand
                  ? expandChat()
                  : chatOpen.messaging
                  ? expandChat()
                  : closeChat();
              }}
              className={`${!chatOpen.open ? "mx-auto" : "self-end"} ${
                chatOpen.messaging && "ml-auto !mx-0 self-end "
              } ${
                matches.small && "!mx-auto"
              } w-fit flex items-center justify-center p-2`}
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
                className="space-y-2 px-3"
              >
                <Messaging />
              </AnimateInOut>
            ) : (
              <>
                <AnimateInOut
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  show={chatOpen.open}
                  className="w-full flex gap-3 items-center p-2"
                >
                  <div className="space-y-1 w-fit text-center">
                    <div className="rounded-full overflow-clip w-20 h-20">
                      <img
                        src="/team/sam.jpg"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-fit text-sm mx-auto">
                      <p>Jamilu...</p>
                      <span>host</span>
                    </div>
                  </div>
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
                        onClick={() => closeChat()}
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
            )}
          </div>
        </motion.div>
      )}
    </Media>
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

const messages = [1, 1, 1, 1, 1];
function Messaging() {
  const Message = () => (
    <div className="flex gap-2 items-center">
      <div className="rounded-full overflow-clip w-8 h-8">
        <img src="/team/bright.jpg" />
      </div>
      <p className="p-1 rounded-lg border border-gray-500 ">
        has the lecture started?
      </p>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="border border-gray-500 rounded-lg p-3">
          <div className="rounded-full overflow-clip w-20 h-20">
            <img src="/team/sam.jpg" className="w-full h-full object-cover" />
          </div>
          <div className="w-fit text-sm mx-auto">
            <p>Jamilu...</p>
            <span>host</span>
          </div>
        </div>
        <div className="">
          <img src={Waves} />
        </div>
        <div className="p-2 border border-gray-500 rounded-lg">
          <p>Presentation name</p>
        </div>
      </div>
      <div className="space-y-2 border-t-[1px] py-2">
        {messages.map((message, i) => (
          <Message key={i} />
        ))}
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <textarea className="rounded-lg border bg-transparent border-gray-500 text-gray-400 p-1 flex-1" />
        <button
          className="flex items-center justify-center p-3 rounded-lg border"
          type="submit"
        >
          <FaPaperPlane className="w-8 h-8 text-white fill-white" />
        </button>
        <button
          className="flex items-center justify-center p-3 rounded-lg border border-gray-500 bg-gradient-to-bl from-green-600 to-blue"
          type="button"
        >
          <FaMicrophone className="w-8 h-8 text-white fill-white " />
        </button>
      </form>
    </>
  );
}
