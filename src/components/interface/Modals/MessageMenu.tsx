import { LuMessagesSquare } from "react-icons/lu";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { IoSendOutline, IoImages } from "react-icons/io5";
import { BsArrowDown } from "react-icons/bs";
import Menu from "./Menu";
import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { Message, useMessageStore } from "../store/messageStore";
import { useIntersection } from "react-use";
import { useRtmStore } from "../store/rtmStore";
import { usepresentationStore } from "../store/presentationStore";
import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "@/constants/routes";
import CircularProgressBar from "@/components/ui/CircularProgress";
import { cn } from "@/lib/utils";
import { PresentationContext } from "@/contexts/presentationContext";
import { authFetch, standardFetch } from "@/lib/axios";
import ImageViewer from "./ImageViewer";

export default function MessageMenu({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  // const { rtm, userName, presentation, tokens } =
  //   useContext(PresentationContext);
  const userName = useRtmStore((state) => state.userName);
  const presentation = usepresentationStore((state) => state.presentation);
  const tokens = useRtmStore((state) => state.token);
  const messages = useMessageStore((state) => state.readMessages);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const unreadMessages = useMessageStore((state) => state.unReadMessages);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [userText, setUserText] = useState("");
  const messageContainer = useRef<HTMLDivElement>(null);

  const { isMobilePhone } = useContext(PresentationContext);

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: messageContainer.current,
    rootMargin: "50px",
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendUserMessage = useMutation({
    mutationFn: async function () {
      if (!presentation) return;

      if (userText.trim() === "") return;

      const messageData: Message = {
        id: `${presentation.User === "HOST" ? "host.id" : tokens?.rtcUid}-${Date.now()}`,
        type: "text",
        content: userText.trim(),
        sender: presentation.User === "HOST" ? "HOST" : userName,
        senderId:
          presentation.User === "HOST" ? "host.id" : tokens?.rtcUid || "",
        time: ""
      };

      await sendMessage(messageData);
      setUserText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  });

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserText(e.target.value);
    e.target.style.height = "auto";
    const newHeight = e.target.scrollHeight;
    e.target.style.height = newHeight > 112 ? "112px" : `${newHeight}px`;
    e.target.style.overflowY = newHeight > 112 ? "auto" : "hidden";
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !isMobilePhone) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function handleSendMessage() {
    if (userText.trim()) {
      !sendUserMessage.isPending && sendUserMessage.mutate();
    }
  }

  const fileRef = useRef<HTMLInputElement>(null);

  const sendImages = useMutation({
    mutationFn: async function (e: React.ChangeEvent<HTMLInputElement>) {
      const files = e.target.files;
      if (!files) {
        fileRef.current!.value = "";
        return;
      }

      scrollToBottom();
      setUploadProgress(0);
      const { data: signData } = await authFetch.get(
        `${SERVER_URL}/api/v1/auth/signUpload/${presentation?.liveId}`
      );

      const formData = new FormData();

      const totalFiles = files.length;
      let uploadedFiles = 0;
      let totalProgress = 0;
      const images: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", signData.timestamp);
        formData.append("signature", signData.signature);
        formData.append("folder", `chat/${presentation?.liveId}`);

        const { data } = await standardFetch.post(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const fileProgress =
                  (progressEvent.loaded / progressEvent.total) * 100;
                totalProgress =
                  (uploadedFiles * 100 + fileProgress) / totalFiles;
                setUploadProgress(totalProgress);
                // Update your progress UI here using totalProgress
              }
            }
          }
        );
        images.push(data.secure_url);
        uploadedFiles++;
      }

      const messageData: Message = {
        id: `${presentation?.User === "HOST" ? "host.id" : tokens?.rtcUid}-${Date.now()}`,
        type: "image",
        content: "",
        sender: presentation?.User === "HOST" ? "HOST" : userName,
        senderId:
          presentation?.User === "HOST" ? "host.id" : tokens?.rtcUid || "",
        time: "",
        images
      };

      await sendMessage(messageData);
      setUploadProgress(0);
      fileRef.current!.value = "";
    },
    onError: function () {
      fileRef.current!.value = "";
      alert("Failed to upload images");
    }
  });

  const [imageView, setImageView] = useState<string[]>([]);
  const thumbnailImages = useMemo(function() {
    return imageView.map((img) =>(img.replace("/upload/", "/upload/w_34,h_34/")))
  }, [imageView]);

  return (
    <>
      <ImageViewer
        images={imageView}
        thumbnailImages={thumbnailImages}
        isOpen={imageView.length > 0}
        onClose={() => setImageView([])}
      />
      <Menu right={true} open={open} onClose={onClose}>
        <div className="left-0 right-0 z-50 rounded-t-xl p-5 pb-1 flex items-center justify-between border-b-[#FF8B1C] border-x-[#FF8B1C] border-[1px] fixed w-full bg-[#FFFFDB]">
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
                  {message.type === "text" && (
                    <p className="font-bold text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}

                  {message.type === "image" && (
                    <div
                      className={cn(
                        "grid grid-cols-2 gap-2 md:w-4/6 cursor-zoom-in",
                        (message.images?.length || 0) > 2 && "grid-rows-2"
                      )}
                      onClick={() => {
                        setImageView(message.images || []);
                      }}
                    >
                      {message.images?.slice(0, 4).map((img, index) => (
                        <div key={index} className="w-full relative">
                          <img
                            className="w-full object-cover rounded-lg"
                            src={img.replace(
                              "/upload/",
                              "/upload/w_64,h_36,c_fill/"
                            )}
                            alt={`Image ${index + 1}`}
                          />
                          {index === 3 && message.images!.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg font-bold">
                                +{message.images!.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sendImages.isPending && (
              <div className="w-full flex justify-center items-center flex-col gap-3">
                <CircularProgressBar
                  size={50}
                  progress={uploadProgress}
                  strokeWidth={5}
                  progressColor="#FF8B1C"
                  circleColor="#FFFFDB"
                />
                <p className="text-lg md:text-sm">Uploading...</p>
              </div>
            )}

            <div
              ref={intersectionRef}
              className="h-10 w-full flex gap-3 justify-start items-start"
            ></div>
          </div>
          <div className="w-full flex p-3 border-t-[1px] border-[#FF8B1C]">
            <input
              ref={fileRef}
              type="file"
              id="image"
              className="hidden"
              accept="image/*"
              onChange={(e) => !sendImages.isPending && sendImages.mutate(e)}
              multiple
              disabled={sendImages.isPending}
            />
            <button className="bg-white rounded-l-xl border-[1px] border-[#FF8B1C] border-r-0">
              <label
                htmlFor="image"
                className="cursor-pointer w-full p-2 h-full flex justify-center items-center"
              >
                <IoImages size="24" />
              </label>
            </button>
            <div className="bg-white rounded-r-xl border-[1px] border-[#FF8B1C] flex w-full p-2">
              <textarea
                ref={textareaRef}
                className="resize-none w-full p-2 flex-1 outline-none"
                placeholder="Type a message"
                rows={1} // Initially set to 1 row
                value={userText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button
                className="rounded-lg text-center flex justify-center items-center"
                onClick={handleSendMessage}
              >
                <IoSendOutline size="24" />
              </button>
            </div>
          </div>

          {intersection && intersection.intersectionRatio < 1 && (
            <button
              onClick={scrollToBottom}
              className="bg-[#FF8B1C] w-10 h-10 rounded-full absolute bottom-24 flex justify-center items-center shadow-2xl"
            >
              <BsArrowDown color="#fff" size="20" />
            </button>
          )}
        </div>
      </Menu>
    </>
  );
}
