/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiHandWaving } from "react-icons/pi";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { CiVideoOn } from "react-icons/ci";
import { CiVideoOff } from "react-icons/ci";

export default function LiveAudienceElement({
  setLiveChatAudience,
  liveChatAudience,
  micRequest,
  isHost,
  mic,
  setMic,
  videoShare,
  setVideoShare,
  cycleMicState
}) {
  return (
    <>
      <div
        className={`w-full h-full ${!liveChatAudience.audience ? "hidden" : "grid"} grid-cols-[1fr] grid-rows-[50px_minmax(50px,auto)_1fr] gap-1`}
      >
        {/* host user section */}
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
              <span className="text-white text-xs block w-fit h-fit">Amem</span>
              <span className="text-white text-[0.6rem] bg-black px-2 py-[1px] flex justify-center items-center w-fit h-fit border-none rounded-sm">
                Host
              </span>
            </div>
            <div className="w-fit h-full flex justify-between items-center gap-2">
              <button
                onClick={() => setMic(!mic)}
                className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow  hover:scale-[1.1] ${!mic ? "text-[#F22B1F]" : "text-[#219882]"} text-xl relative before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:z-10 before:pointer-events-none before:border-none before:rounded-full ${!mic ? "before:bg-[#df96964d]" : "before:bg-[#a2c6bf4d]"}`}
              >
                {mic ? <IoIosMic size={24} /> : <IoIosMicOff size={24} />}
              </button>
              <button
                onClick={() => setVideoShare(!videoShare)}
                className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow relative before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:z-10 before:pointer-events-none before:border-none before:rounded-full ${!videoShare ? "before:bg-[#df96964d]" : "before:bg-[#a2c6bf4d]"} hover:scale-[1.1] ${!videoShare ? "text-[#F22B1F]" : "text-[#219882]"} text-xl`}
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
        {/* mic requests section 1 */}
        {isHost && (
          <div className={`w-full h-fit bg-black`}>
            <div className="w-full h-fit flex justify-between items-center">
              <p className="text-white text-xs pt-2 pb-3">Mic requests</p>
              {micRequest && (
                <button
                  onClick={() =>
                    setLiveChatAudience({
                      audience: false,
                      chats: false,
                      controls: false,
                      requests: true,
                      coHost: false,
                      chooseSlide: false,
                      poll: false
                    })
                  }
                  className="block w-fit h-fit bg-primaryTwo py-0.5 px-2 text-white text-[0.6rem] border-none rounded-sm cursor-pointer"
                >
                  {micRequest > 2 ? "See more" : ""} ({micRequest})
                </button>
              )}
            </div>
            <div className="w-full h-fit bg-primaryTwo border-none rounded-sm">
              {/* users avaters here as lists: request to speak users, yet to be accepted */}
              <ScrollArea className="h-full w-full border-none">
                {!micRequest ? (
                  <p className="text-gray-400 text-xs w-full h-full flex justify-center items-center p-5">
                    No mic requests
                  </p>
                ) : (
                  Array.from(
                    { length: Math.min(2, micRequest) },
                    (_, index) => (
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
                        <div className="flex justify-between items-center gap-2">
                          <button
                            className={`text-white text-xs bg-[#00800071] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm`}
                          >
                            Accept
                          </button>
                          <button
                            className={`text-white text-xs bg-[#ff00005f] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm`}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )
                  )
                )}
              </ScrollArea>
              {/* end of users requests */}
            </div>
          </div>
        )}
        {/* Present users in attendance */}
        <div className="w-full h-full bg-primaryTwo border-none rounded-sm overflow-hidden">
          <ScrollArea
            className={`${micRequest <= 1 && isHost ? "h-[calc(100vh-225px)]" : !isHost ? "h-[calc(100vh-130px)]" : "h-[calc(100vh-280px)]"} w-full border-none`}
          >
            {Array.from({ length: 12 }, (_, index) => (
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
                    onClick={cycleMicState}
                    className={`micBtn w-10 h-10 justify-self-center border-none rounded-full flex justify-center items-center shadow ${mic.hostNeutral || mic.userNeutral ? "bg-[#191919c0] text-white _bg-[#a2c6bf4d]" : mic.hostActive || mic.userActive ? "text-[#219882] bg-[#a2c6bf4d]" : "text-[#F22B1F] bg-[#df96964d]"} text-xl`}
                  >
                    {/* ${!mic ? "before:bg-[#df96964d]" : "before:bg-[#a2c6bf4d]"} */}
                    {isHost ? (
                      <>
                        {mic.hostNeutral || mic.hostActive ? (
                          <IoIosMic size={24} />
                        ) : (
                          <IoIosMicOff size={24} />
                        )}
                      </>
                    ) : (
                      <>
                        {mic.userNeutral || mic.userActive ? (
                          <IoIosMic size={24} />
                        ) : mic.userRequest ? (
                          <PiHandWaving size={24} />
                        ) : (
                          <IoIosMicOff size={24} />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
