/* eslint-disable react/prop-types */
import { Label } from "@radix-ui/react-label";
import { Switch } from "@radix-ui/react-switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiHandWaving } from "react-icons/pi";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { CiVideoOn } from "react-icons/ci";
import { CiVideoOff } from "react-icons/ci";

export default function PollElement({
  setLiveChatAudience,
  liveChatAudience,
  micRequest,
  isHost,
  mic,
  setMic,
  videoShare,
  setVideoShare,
  cycleMicState,
  chooseCoHost,
  chooseSlide
}) {
  return (
    <>
      <div
        className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience?.poll ? "hidden" : "grid"}`}
      >
        <p className="text-white text-xs mb-2 absolute top-3 left-4">
          Choose Poll
        </p>
        <ScrollArea className="h-[calc(100vh-75px)] w-full border-none pt-12 pb-2 px-2">
          {/* {Array.from({ length: chooseSlide }, (_, index) => (
                  <div
                    key={`user-${index}`}
                    className="w-full h-full grid grid-cols-[6rem_1fr] grid-rows-[6rem] gap-2 p-2 border border-gray-300 rounded-sm mb-4"
                  >
                    <div className="w-full h-full">
                      <img
                        src={`https://picsum.photos/200/300?random=${index + 1}`}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <div className="w-full h-full flex flex-col justify-between items-start gap-1">
                      <span className="text-white text-xs font-bold block w-[11.5625rem] truncate">
                        {`Embedded Slide ${index + 1} Lorem ipsum dolor sit amet.`}
                      </span>
                      <span className="text-white text-xs block w-[11.5625rem] truncate">
                        <span className="font-bold">Presenter:</span> Imoh
                        Omeizegba Lorem ipsum dolor sit amet.
                      </span>
                      <span className="text-white text-xs block w-[11.5625rem] truncate">
                        <span className="font-bold">Category:</span> Edge
                        computing Lorem, ipsum dolor sit amet consectetur
                        adipisicing elit. A, laborum?
                      </span>
                      <button className="text-white text-xs bg-black px-2 py-1 flex justify-center items-center w-full h-fit border-none rounded-sm">
                        Add+
                      </button>
                    </div>
                  </div>
                ))} */}
        </ScrollArea>
      </div>
    </>
  );
}
