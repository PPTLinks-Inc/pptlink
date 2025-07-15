/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiHandWaving } from "react-icons/pi";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { CiVideoOn } from "react-icons/ci";
import { CiVideoOff } from "react-icons/ci";

export default function MicRequestElement({
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
        className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience.requests ? "hidden" : "grid"}`}
      >
        {" "}
        <ScrollArea className="h-[calc(100vh-75px)] w-full border-none px-2">
          {!micRequest ? (
            <p className="text-gray-400 text-xs w-full h-full flex justify-center items-center p-5">
              No mic requests
            </p>
          ) : (
            Array.from({ length: micRequest }, (_, index) => (
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
                  <button className="text-white text-xs bg-[#00800071] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm">
                    Accept
                  </button>
                  <button className="text-white text-xs bg-[#ff00005f] px-2 py-1 flex justify-center items-center w-fit h-fit border-none rounded-sm">
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    </>
  );
}
