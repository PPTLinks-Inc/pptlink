/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiOutlineSend } from "react-icons/ai";
import { IoImages } from "react-icons/io5";

export default function LiveChatElement({
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
        className={`w-full h-full ${!liveChatAudience?.chats ? "hidden" : "grid"} grid-cols-[1fr] grid-rows-[1fr_45px] gap-1 bg-primaryTwo border-none rounded-sm`}
      >
        {/* users chat display */}{" "}
        <div className="w-full h-full border-none rounded-sm overflow-hidden">
          {/* users live chats start */}
          <div className="w-full h-full bg-primaryTwo border-none rounded-sm overflow-hidden">
            <ScrollArea className={`h-[calc(100vh-130px)] w-full border-none`}>
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={`user-${index}`}
                  className="w-full h-full flex justify-between items-center gap-2 p-2"
                >
                  <div className="flex justify-center items-start gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${index + 3}`}
                        alt="Host"
                      />
                      <AvatarFallback>
                        <span className="text-white text-xs">Imoh</span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full h-fit mt-[0.8rem]">
                      <div className="flex justify-start items-center gap-2">
                        <span className="text-white text-xs block w-fit h-fit">
                          {`User ${index + 1}`}
                        </span>
                        <span className="text-[gray] text-xs font-extralight block w-fit h-fit italic">
                          02:47 am
                        </span>
                      </div>
                      <p className="w-5/6 h-fit text-white text-xs bg-black px-2 py-1.5 mt-2 border-none rounded-sm">
                        Will of time, hope fore tomorrow... Lorem ipsum dolor
                        sit amet consectetur adipisicing elit. Voluptatibus
                        eligendi soluta, fuga repellendus nihil incidunt! lorem
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          {/* users live chats end */}
        </div>
        {/* chat img-picker & input */}
        <div className="border-none w-full h-full grid grid-cols-[40px_1fr] grid-rows-[40px] gap-1 justify-evenly items-center px-1">
          <label
            htmlFor="filePicker"
            className="flex justify-center items-center w-full aspect-square bg-[red]_ border-none rounded-sm relative cursor-pointer"
          >
            <input
              type="file"
              name="filePicker"
              id="filePicker"
              className="absolute -top-1 -left-1 w-0 h-0 opacity-0"
              accept="*"
            />
            <IoImages size={28} className="w-full h-full" />
          </label>
          <span className="block w-[80%]_ w-full h-full relative py-[2.5px]">
            <input
              type="text"
              className="block w-full h-full border-none rounded-sm py-1.5 indent-2 bg-black text-white text-xs"
              placeholder="Send a message.."
            />
            <button className="absolute right-0 top-0 translate-y-0 text-white block w-fit h-full border-none rounded-sm p-1">
              <AiOutlineSend size={20} />
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
