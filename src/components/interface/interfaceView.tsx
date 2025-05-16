import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFullscreen, useOrientation } from "react-use";
import ShareAPI from "./Share";
import { FaRegUser } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { IoCloudDownloadOutline, IoSync } from "react-icons/io5";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import { CiVideoOff } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { PiHandWaving } from "react-icons/pi";
import { LuMessagesSquare } from "react-icons/lu";
import { MdOutlineScreenShare } from "react-icons/md";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InterfaceViewProps {
  namePassed?: string;
}
// ratios: side-bar 23.75(342px), main-view 73.125(1053px), spacings 3.125(45px)
export default function InterfaceView({ namePassed }: InterfaceViewProps) {
  const navigate = useNavigate();
  const [mic, setMic] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [liveChatAudience, setLiveChatAudience] = useState(true);
  const [videoShare, setVideoShare] = useState(false);
  const { orientation } = useOrientation();

  return (
    <div className="relative bg-black w-[100svw] h-[100svh] grid grid-rows-[40px_1fr] grid-cols-[1fr]">
      <header className="w-full h-full p-1">
        <div className="w-full h-full mx-auto border-none rounded-sm flex justify-between items-center">
          <ShareAPI fitSize={true} />
          <div className="w-fit h-full flex justify-center items-center gap-4">
            <h2 className="text-xl font-light text-white">Meeting with YLN</h2>
            <sub className="text-[0.7rem] text-white">By {"Imoh Omezegba"}</sub>
          </div>
          <button className="bg-[#29db29] w-fit h-full flex justify-center items-center gap-2 px-2 border-none rounded-sm text-[0.8rem] font-semibold">
            <span>2:45</span>
            <span>Live</span>
          </button>
        </div>
      </header>
      <div
        className={`bg-black grid ${sideBar ? "grid-cols-[1fr_345px]" : "grid-cols-1"} grid-rows-[1fr]`}
      >
        <div
          className={`w-full h-full p-1  grid grid-rows-[1fr_50px] grid-cols-[1fr] gap-1`}
        >
          <div className="relative w-full h-full bg-[green] border-none rounded-sm">
            <button
              onClick={() => alert("Sync... in progress")}
              className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl absolute bottom-4 right-20"
            >
              <IoSync color="white" size={28} />
            </button>
            <button
              onClick={() => setSideBar(!sideBar)}
              className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl absolute bottom-4 right-6"
            >
              {sideBar ? (
                <RxEnterFullScreen color="white" size={28} />
              ) : (
                <RxExitFullScreen color="white" size={28} />
              )}
            </button>
            <h1 className="text-4xl text-white">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. A eum
              ipsam excepturi! Sunt, eius enim.
            </h1>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum
              ad vero, laborum enim quis, neque sint consequuntur perferendis
              officia voluptatum, odio tenetur illum optio! Dolore molestiae
              consequatur esse consectetur, rerum repellat? Eaque reprehenderit,
              incidunt voluptates hic ab necessitatibus quod est tempore vitae
              sit vel assumenda. Repudiandae quis incidunt, repellendus eos
              ullam omnis eius maxime hic, soluta quasi deserunt consequuntur
              consectetur veniam saepe, animi eum accusamus ipsa. Quam pariatur
              ipsam architecto hic perferendis repellat unde mollitia ab rem
              recusandae enim libero reiciendis officiis necessitatibus itaque,
              officia sint. Reprehenderit nihil consequuntur a accusamus magni
              expedita velit quae adipisci doloremque mollitia, deleniti iure
              architecto ratione enim numquam impedit laboriosam! Modi, nisi
              blanditiis. Quia repellat labore mollitia, hic sed et nulla
              temporibus ex accusantium. Totam quasi recusandae sint. Asperiores
              quia laborum perspiciatis accusantium exercitationem nihil, vitae
              excepturi aspernatur corrupti praesentium veritatis officiis,
              ducimus omnis nostrum reiciendis dolore! Asperiores fugit ab odit
              iste earum perspiciatis?
            </p>
          </div>
          <footer className="w-full h-full">
            <div className="bg-[blue]_ w-[98%] h-full mx-auto border-none rounded-sm flex justify-between items-center">
              <div className="w-fit h-full flex justify-between items-center gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl"
                >
                  <FiHome size={24} />
                </button>
                <button className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl">
                  <IoCloudDownloadOutline size={24} />
                </button>
              </div>
              <div className="w-fit h-full flex justify-between items-center gap-2">
                <button
                  onClick={() =>
                    confirm(
                      `Are you sure you want to ${!screenShare ? "share" : "stop sharing"} your screen?`
                    )
                      ? setScreenShare(!screenShare)
                      : ""
                  }
                  className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl"
                >
                  {!screenShare ? (
                    <MdOutlineScreenShare size={24} />
                  ) : (
                    <MdOutlineStopScreenShare size={24} />
                  )}
                </button>
                {!sideBar && (
                  <button
                    onClick={() => setSideBar(true)}
                    className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl relative"
                  >
                    <span className="text-white text-xs flex justify-center items-center absolute -top-3 -right-3 border-none rounded-full p-1">
                      99+
                    </span>
                    <FaRegUser size={24} />
                  </button>
                )}
                <button
                  onClick={() => setMic(!mic)}
                  className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${mic ? "bg-orange-500" : "bg-gray-300"} hover:scale-[1.1] text-white text-xl`}
                >
                  {mic ? <PiHandWaving size={24} /> : <IoIosMic size={24} />}
                </button>
                <button className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl">
                  <LuMessagesSquare size={24} />
                </button>
                <button className="w-10 h-10 border-none rounded-full flex justify-center items-center shadow bg-[#19191971] hover:bg-[#191919] text-white text-xl">
                  <BsThreeDots size={24} />
                </button>
              </div>
              <button
                onClick={() => confirm("Are you sure you want to End session?")}
                className="bg-[#ff0000] w-16 h-[70%] flex justify-center items-center gap-2 px-2 border-none rounded-sm text-[0.8rem] font-semibold"
              >
                <MdCallEnd size={32} />
              </button>
            </div>
          </footer>
        </div>
        {sideBar && (
          <div className={`w-full h-full p-1`}>
            <div className="w-full min-h-full grid grid-cols-[1fr] grid-rows-[20px_1fr] gap-1">
              <div className="w-full h-full border-none rounded-sm grid grid-cols-2 grid-rows-1 gap-1">
                <span
                  onClick={() => setLiveChatAudience(true)}
                  className="flex w-full h-full justify-center items-center relative"
                >
                  <span
                    className={`${liveChatAudience && "bg-primaryTwo"} border-none rounded-sm text-white text-xs flex justify-center items-center w-full h-full`}
                  >
                    <span className="mr-1">Live Audience</span>
                    <span
                      className={`${liveChatAudience ? "bg-black" : "bg-primaryTwo"} border-none rounded-sm text-[0.6rem] inline-block py-[0.5px] px-[2px]`}
                    >
                      99+
                    </span>
                  </span>
                </span>
                <span
                  onClick={() => setLiveChatAudience(false)}
                  className="flex w-full h-full justify-center items-center relative"
                >
                  <span
                    className={`${!liveChatAudience && "bg-primaryTwo"} border-none rounded-sm text-white text-xs flex justify-center items-center w-full h-full`}
                  >
                    <span className="mr-1">Live Chat</span>
                    <span
                      className={`${!liveChatAudience ? "bg-black" : "bg-primaryTwo"} border-none rounded-sm text-[0.6rem] inline-block py-[0.5px] px-[2px]`}
                    >
                      99+
                    </span>
                  </span>
                </span>
              </div>
              {/* Live Audiences */}
              <div
                className={`w-full h-full ${!liveChatAudience ? "hidden" : "grid"} grid-cols-[1fr] grid-rows-[50px_minmax(50px,auto)_1fr] gap-1`}
              >
                {/* host user */}
                <div className="w-full h-full bg-primaryTwo border-none rounded-sm">
                  <div className="w-full h-full flex justify-between items-center gap-2 p-2">
                    <div className="flex justify-center items-center gap-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${2}`}
                          alt="Host"
                        />
                        <AvatarFallback>
                          <span className="text-white text-xs">Imoh</span>
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white text-xs block w-fit h-fit">
                        Amem
                      </span>
                      <span className="text-white text-[0.6rem] bg-black px-2 py-[1px] flex justify-center items-center w-fit h-fit border-none rounded-sm">
                        Host
                      </span>
                    </div>
                    <div className="w-fit h-full flex justify-between items-center gap-2">
                      <button
                        onClick={() => setMic(!mic)}
                        className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${!mic ? "bg-[#ff00005f]" : "bg-[#00800071]"} hover:scale-[1.1] text-white text-xl`}
                      >
                        {mic ? (
                          <IoIosMic size={24} />
                        ) : (
                          <IoIosMicOff size={24} />
                        )}
                      </button>
                      <button
                        onClick={() => setVideoShare(!videoShare)}
                        className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${!videoShare ? "bg-[#ff00005f]" : "bg-[#00800071]"} hover:scale-[1.1] text-white text-xl`}
                      >
                        {videoShare ? (
                          <CiVideoOn size={24} />
                        ) : (
                          <CiVideoOff size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-fit bg-black">
                  <p className="text-white text-xs pt-2 pb-3">Mic requests</p>
                  <div className="w-full h-fit bg-primaryTwo border-none rounded-sm">
                    {/* users avaters here as lists: request to speak users, yet to be accepted */}
                    {Array.from({ length: 2 }, (_, index) => (
                      <div
                        key={`user-${index}`}
                        className="w-full h-full flex justify-between items-center gap-2 p-2"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                              alt={`User ${index + 1}`}
                            />
                            <AvatarFallback>
                              <span className="text-white text-xs">{`User ${index + 1}`}</span>
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white text-xs block w-fit h-fit">
                            {`User ${index + 1}`}
                          </span>
                        </div>
                        <button className="text-white text-xs bg-orange-600 px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm">
                          Accept
                        </button>
                      </div>
                    ))}
                    {/* end of users requests */}
                  </div>
                </div>
                <div className="w-full h-fit bg-primaryTwo border-none rounded-sm">
                  {/* users avaters here as lists: users attendance */}
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={`user-${index}`}
                      className="w-full h-full flex justify-between items-center gap-2 p-2"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                            alt="Host"
                          />
                          <AvatarFallback>
                            <span className="text-white text-xs">Imoh</span>
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-xs block w-fit h-fit">
                          {`User ${index + 1}`}
                        </span>
                      </div>
                      <div className="w-fit h-full flex justify-between items-center gap-2">
                        <button
                          onClick={() => setMic(!mic)}
                          className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow ${!mic ? "bg-[#ff00005f]" : "bg-[#00800071]"} hover:scale-[1.1] text-white text-xl`}
                        >
                          {mic ? (
                            <IoIosMic size={24} />
                          ) : (
                            <IoIosMicOff size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Live Chats */}
              <div
                className={`w-full h-full ${liveChatAudience ? "hidden" : "grid"} grid-cols-[1fr] grid-rows-[1fr_50px] gap-1 bg-primaryTwo border-none rounded-sm`}
              >
                <div className="w-full h-full border-none rounded-sm">{/* chat box */}</div>
                <div className="border-none w-full h-full flex justify-evenly items-center">
                  <span className="w-[40px] aspect-square bg-[red] flex justify-center items-center border-none rounded-sm">img</span>
                  <span className="block w-[80%] h-fit relative">
                    <input
                      type="text"
                      className="block w-full h-fit border-none rounded-sm py-2 indent-2 bg-black"
                      placeholder="Send a message.."
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
