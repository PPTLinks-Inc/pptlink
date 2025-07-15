/* eslint-disable react/prop-types */
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { CgFileAdd } from "react-icons/cg";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CgPoll } from "react-icons/cg";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlineScreenShare } from "react-icons/md";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { LiaPenNibSolid } from "react-icons/lia";

export default function ControlsDotsElement({
  setLiveChatAudience,
  liveChatAudience,
  micRequest,
  isHost,
  mic,
  setMic,
  videoShare,
  setVideoShare,
  cycleMicState,
  screenShare,
  setScreenShare
}) {
  return (
    <>
      <div
        className={`relative w-full h-full bg-primaryTwo border-none rounded-sm ${!liveChatAudience.controls ? "hidden" : "grid"}`}
      >
        <ScrollArea className="h-[calc(100vh-150px)] w-full border-none pt-12 pb-2 px-2">
          {/* pen */}
          <Label
            htmlFor="pen-label"
            className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
          >
            <span className="flex justify-start items-center gap-2">
              <LiaPenNibSolid size={20} />
              <span className="text-sm">Pen</span>
            </span>
            <span className="flex justify-center items-center gap-1">
              <Switch id="pen-label" />
            </span>
          </Label>
          {/* music */}
          <Label
            htmlFor="music-label"
            className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
          >
            <span className="flex justify-start items-center gap-2">
              <IoMusicalNotesOutline size={20} />
              <span className="text-sm">Music</span>
            </span>
            <span className="flex justify-center items-center gap-1">
              <Switch id="music-label" />
            </span>
          </Label>
          {/* ping */}
          <Label
            htmlFor="ping-label"
            className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
          >
            <span className="flex justify-start items-center gap-2">
              <GoBell size={20} />
              <span className="text-sm">Ping audience</span>
            </span>
            <span className="flex justify-center items-center gap-1">
              <Switch id="ping-label" />
            </span>
          </Label>
          {/* Add slides */}
          <button
            onClick={() =>
              setLiveChatAudience({
                audience: false,
                chats: false,
                controls: false,
                requests: false,
                coHost: false,
                chooseSlide: true,
                poll: false
              })
            }
            className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
          >
            <span className="flex justify-start items-center gap-2">
              <CgFileAdd size={20} />
              <span className="text-sm">Add slides</span>
            </span>
            <span className="flex justify-center items-center gap-1">
              <FaAngleRight id="ping-label" />
            </span>
          </button>
          {/* Co-host */}
          <button
            onClick={() =>
              setLiveChatAudience({
                audience: false,
                chats: false,
                controls: false,
                requests: false,
                coHost: true,
                chooseSlide: false,
                poll: false
              })
            }
            className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
          >
            <span className="flex justify-start items-center gap-2">
              <AiOutlineUsergroupAdd size={20} />
              <span className="text-sm">Co-host</span>
            </span>
            <span className="flex justify-center items-center gap-1">
              <FaAngleRight id="ping-label" />
            </span>
          </button>
          {/* Poll */}
          <button
            onClick={() =>
              setLiveChatAudience({
                audience: false,
                chats: false,
                controls: false,
                requests: false,
                coHost: false,
                chooseSlide: false,
                poll: true
              })
            }
            className="w-full h-fit text-left flex justify-between items-center gap-1 text-white mb-9"
          >
            <span className="flex justify-start items-center gap-2">
              <CgPoll size={20} />
              <span className="text-sm">Poll</span>
            </span>
            <span className="flex justify-center items-center gap-1">
              <FaAngleRight id="ping-label" />
            </span>
          </button>
          {/* share screen */}
          <button
            onClick={() =>
              confirm(
                `Are you sure you want to ${!screenShare ? "share" : "stop sharing"} your screen?`
              )
                ? setScreenShare(!screenShare)
                : ""
            }
            className="hidden w-full h-fit text-left maxScreenMobile:flex justify-between items-center gap-1 text-white mb-9"
          >
            <span className="flex justify-start items-center gap-2">
              {!screenShare ? (
                <MdOutlineScreenShare size={24} />
              ) : (
                <MdOutlineStopScreenShare size={24} />
              )}
              <span className="text-sm">Sharescreen</span>
            </span>
          </button>
          {/* download file */}
          <button className="hidden w-full h-fit text-left maxScreenMobile:flex justify-between items-center gap-1 text-white mb-9">
            <span className="flex justify-start items-center gap-2">
              <IoCloudDownloadOutline size={24} />
              <span className="text-sm">Download file</span>
            </span>
          </button>
        </ScrollArea>
      </div>
    </>
  );
}
