import { LuMessagesSquare } from "react-icons/lu";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { IoSendOutline } from "react-icons/io5";
import { BsArrowDown } from "react-icons/bs";
import Menu from "./Menu";
import { useContext, useEffect, useRef, useState } from "react";
import { PresentationContext } from "../../../contexts/presentationContext";
import { Message, useMessageStore } from "../hooks/messageStore";
import { useIntersection } from "react-use";

export default function MessageMenu({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { rtm, userName, presentation, tokens } =
    useContext(PresentationContext);
  const messages = useMessageStore((state) => state.readMessages);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const unreadMessages = useMessageStore((state) => state.unReadMessages);

  const [userText, setUserText] = useState("");
  const messageContainer = useRef<HTMLDivElement>(null);

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: messageContainer.current,
    rootMargin: '50px',
    threshold: 1
  });

  useEffect(
    function () {
      if (unreadMessages.length > 0 && open) {
        useMessageStore.getState().addReadMessage(unreadMessages);

        useMessageStore.getState().unReadMessages = [];
      }
    },
    [unreadMessages, open]
  );

  useEffect(
    function () {
      scrollToBottom();
    },
    [messages]
  );

  function scrollToBottom() {
    messageContainer.current?.scrollTo({
      top: messageContainer.current.scrollHeight,
      behavior: "smooth"
    });
  }

  async function sendUserMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!rtm || !presentation?.data) return;

    if (userText.trim() === "") return;

    const messageData: Message = {
      type: "text",
      content: userText.trim(),
      sender: presentation.data.User === "HOST" ? "HOST" : userName,
      senderId:
        presentation.data.User === "HOST" ? "host.id" : tokens?.rtcUid || "",
      time: ""
    };

    await sendMessage(messageData, rtm, presentation.data.liveId);
    setUserText("");
  }

  return (
    <Menu open={open} onClose={onClose}>
      <div className="z-50 rounded-t-xl p-5 pb-1 flex items-center justify-between border-b-[#FF8B1C] border-[1px] fixed w-full bg-[#FFFFDB]">
        <div className="flex items-center">
          <h4 className="text-2xl text-center text-black font-bold">
            Live Chat
          </h4>
          <div className="w-fit">
            <div className="rounded-full p-3">
              <LuMessagesSquare size={18} />
            </div>
          </div>
        </div>

        <button onClick={onClose}>
          <IoReturnUpBackOutline size="32" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-end h-full relative">
        <div
          ref={messageContainer}
          className="w-full p-3 pt-24 flex flex-col gap-5 overflow-y-auto h-full sm"
        >
          {messages.map((message) => (
            <div
              key={message.content}
              className="w-full flex gap-3 justify-start items-start"
            >
              <img
                className="w-8 rounded-full"
                src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${message.senderId}`}
                alt={`user Image`}
              />
              <div className="flex gap-3 flex-col w-full">
                <div className="flex gap-3">
                  <p className="text-sm font-light" title={message.sender}>
                    {message.sender}
                  </p>
                  <p className="text-sm font-light">{message.time}</p>
                </div>
                <p className="font-bold text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          <div ref={intersectionRef as any} className="h-10 w-full flex gap-3 justify-start items-start"></div>
        </div>
        <form
          onSubmit={sendUserMessage}
          className="w-full flex p-3 gap-2 border-t-[1px] border-[#FF8B1C]"
        >
          <input
            type="text"
            className="bg-transparent w-full flex-grow p-4 border-[1px] border-[#FF8B1C] rounded-lg"
            placeholder="Message"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#1F1F1A] flex-grow-[2] w-20 rounded-lg text-center flex justify-center items-center"
          >
            <IoSendOutline color="#F1F1F1" size="24" />
          </button>
        </form>

        {intersection && intersection.intersectionRatio < 1 && <button
          onClick={scrollToBottom}
          className="bg-[#FF8B1C] w-10 h-10 rounded-full absolute bottom-24 flex justify-center items-center shadow-2xl"
        >
          <BsArrowDown color="#fff" size="20" />
        </button>}
      </div>
    </Menu>
  );
}
