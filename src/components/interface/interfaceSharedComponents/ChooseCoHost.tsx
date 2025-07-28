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

export default function ChooseCoHostElement({
  setLiveChatAudience,
  liveChatAudience,
  micRequest,
  isHost,
  mic,
  setMic,
  videoShare,
  setVideoShare,
  cycleMicState,
  chooseCoHost
}) {
  return (
    <>
      <div
        className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience?.coHost ? "hidden" : "grid"}`}
      >
        <p className="text-white text-xs mb-2 absolute top-3 left-4">
          Choose your co-host
        </p>
        <ScrollArea className="h-[calc(100vh-75px)] w-full border-none pt-12 pb-2 px-2">
          {Array.from({ length: chooseCoHost }, (_, index) => (
            <Label
              key={`user-${index}`}
              className="w-full h-full flex justify-between items-center gap-2 p-2"
            >
              <span className="flex justify-center items-center gap-2">
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
              </span>
              <span className="flex justify-center items-center gap-1">
                <Switch id="ping-label" />
              </span>
            </Label>
          ))}
        </ScrollArea>
      </div>
    </>
  );
}
