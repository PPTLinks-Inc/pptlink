import { Label } from "@/components/ui/label";
import Menu from "./Menu";
import { Switch } from "@/components/ui/switch";
import { IoIosArrowBack } from "react-icons/io";
import { RiBarChart2Line, RiFolderAddLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineScreenShare /*  MdNoiseControlOff */ } from "react-icons/md";
import { GoBell } from "react-icons/go";
import { PiPenNibLight } from "react-icons/pi";
import {
  IoReturnUpBackOutline,
  IoMusicalNotesOutline,
  IoOptions
} from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
// import { useOptionsStore } from "../store/optionsStore";
import { useCallback, useEffect, useState } from "react";
import { MIC_STATE } from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAudioStore } from "../store/audioStore";
import { useRtmStore } from "../store/rtmStore";
import { usepresentationStore } from "../store/presentationStore";
import { useOptionsStore } from "../store/optionsStore";
import { cn } from "@/lib/utils";
import { useModalStore } from "../store/modalStore";

function MainMenu({
  setCurrentMenuOption
}: {
  setCurrentMenuOption: (
    value: "main" | "poll" | "co-host" | "slides" | "screen"
  ) => void;
}) {
  const User = usepresentationStore((state) => state.presentation?.User);
  const toggleScreenShare = useOptionsStore((state) => state.toggleScreenShare);
  const screenShareEnabled = useAudioStore((state) => state.screenShareEnabled);
  const iAmScreenSharing = useAudioStore((state) => state.iAmScreenSharing);

  return (
    <div className="p-3 flex flex-col justify-between gap-2 pt-20 pb-10 h-full">
      <div className="flex flex-col gap-7 overflow-auto pr-5">
        <div className="flex justify-between items-center">
          <Label htmlFor="pen" className="text-lg font-normal flex gap-2">
            <PiPenNibLight size="28" />
            <span>Pen</span>
          </Label>
          <div className="flex gap-5 items-center">
            <Switch id="pen" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="music" className="text-lg font-normal flex gap-2">
            <IoMusicalNotesOutline size="28" />
            <span>Music</span>
          </Label>
          <div className="flex gap-5 items-center">
            <Switch id="music" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Label
            htmlFor="ping-audience"
            className="text-lg font-normal flex gap-2"
          >
            <GoBell size="28" />
            <span>Ping audience</span>
          </Label>
          <div className="flex gap-5 items-center">
            <Switch id="ping-audience" />
          </div>
        </div>
        <div>
          <button
            className="w-full flex justify-between items-center disabled:!cursor-not-allowed disabled:opacity-50 "
            onClick={() => setCurrentMenuOption("co-host")}
            disabled={User !== "HOST"}
          >
            <div className="flex gap-2 items-center">
              <AiOutlineUsergroupAdd size="28" />
              <span>Co-host</span>
            </div>
            <MdKeyboardArrowRight size="20" />
          </button>
        </div>
        <div>
          <button
            className="w-full flex justify-between items-center disabled:!cursor-not-allowed disabled:opacity-50"
            onClick={toggleScreenShare}
            disabled={screenShareEnabled && !iAmScreenSharing}
          >
            <div className="flex gap-2 items-center">
              <MdOutlineScreenShare
                size="28"
                className={cn(screenShareEnabled && "fill-[#05FF00]")}
              />
              {!screenShareEnabled ? (
                <span>Share Screen</span>
              ) : (
                <span>Stop Sharing</span>
              )}
            </div>
            <MdKeyboardArrowRight size="20" />
          </button>
        </div>
        <div>
          <button
            className="w-full flex justify-between items-center disabled:!cursor-not-allowed disabled:opacity-50"
            onClick={() => setCurrentMenuOption("slides")}
          >
            <div className="flex gap-2 items-center">
              <RiFolderAddLine size="28" />
              <span>Add Slides</span>
            </div>
            <MdKeyboardArrowRight size="20" />
          </button>
        </div>
        <div>
          <button className="w-full flex justify-between items-center disabled:!cursor-not-allowed disabled:opacity-50">
            <div className="flex gap-2 items-center">
              <RiBarChart2Line size="28" />
              <span>Poll</span>
            </div>
            <MdKeyboardArrowRight size="20" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CoHostMenu({
  users
}: {
  users: {
    id: string;
    userName: string;
    micState: MIC_STATE;
  }[];
}) {
  const getUserMicStatusColor = useCallback(function (micStatus: MIC_STATE) {
    if (micStatus === MIC_STATE.MIC_MUTED) {
      return "border-rose-500";
    } else if (micStatus === MIC_STATE.REQ_MIC) {
      return "border-orange-500 animate-pinging";
    } else if (micStatus === MIC_STATE.CAN_SPK) {
      return "border-green-500";
    } else {
      return "border-transparent";
    }
  }, []);

  const coHostId = useRtmStore((state) => state.coHostId);
  const coHostPrompt = useModalStore((state) => state.coHostPrompt);

  function handleMakeCohost(userId: string, userName: string) {
    const action =
      coHostId === userId ? "remove" : coHostId !== "" ? "replace" : "make";
    const id = coHostId === userId ? "" : userId;

    const message =
      action === "remove"
        ? `Are you sure you want to remove ${userName} as co-host?`
        : action === "replace"
          ? "Are you sure you want to replace the current co-host"
          : `Are you sure you want to make ${userName} a co-host?`;

    const successMessage =
      action === "remove"
        ? `${userName} is no longer a co-host`
        : `${userName} is now a co-host`;

    coHostPrompt({
      actionText: action === "remove" ? "Remove" : "Make",
      description: message,
      title: "Co-host",
      successMessage,
      userId: id,
      action
    });
  }

  return (
    <div className="text-sm p-3 grid grid-cols-5 sm:grid-cols-4 gap-y-5 overflow-y-auto pt-20">
      {users.map((user) => (
        <button
          key={user.id}
          className="flex flex-col w-full justify-start items-center"
          onClick={() => handleMakeCohost(user.id, user.userName)}
        >
          <div className="relative p-1 rounded-full">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}`}
              />
              <AvatarFallback>
                {user.userName.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute inset-0 rounded-full border-2 ${getUserMicStatusColor(user.micState)}`}
            ></span>
          </div>

          <p title={user.userName} className="w-16 truncate ...">
            {user.userName}
          </p>
          <div className="w-20 flex justify-center items-center gap-2">
            {coHostId === user.id && <span>(Co-host)</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function OptionMenu({
  open,
  onClose,
  users
}: {
  open: boolean;
  onClose: () => void;
  users: {
    id: string;
    userName: string;
    micState: MIC_STATE;
  }[];
}) {
  const [currentMenuOption, setCurrentMenuOption] = useState<
    "main" | "poll" | "co-host" | "slides" | "screen"
  >("main");

  useEffect(function() {
    if (!open) {
      setCurrentMenuOption("main");
    }
  }, [open]);

  return (
    <Menu right={false} open={open} onClose={onClose} small={true}>
      <div className="left-0 right-0 rounded-t-xl p-5 pb-1 flex items-center justify-between border-b-[1px] border-r-[1px] border-[#FF8B1C] fixed w-full bg-[#FFFFDB]">
        <div className="flex items-center">
          {currentMenuOption === "main" ? (
            <>
              <h4 className="text-2xl text-center text-black font-bold">
                Options
              </h4>
              <div className="rounded-full p-3">
                <IoOptions size="18" />
              </div>
            </>
          ) : (
            <button
              className="mr-8"
              onClick={() => setCurrentMenuOption("main")}
            >
              <IoIosArrowBack size="28" />
            </button>
          )}

          {currentMenuOption === "co-host" && (
            <h4 className="text-2xl text-center text-black font-bold">
              Choose Co-host
            </h4>
          )}
          {currentMenuOption === "slides" && (
            <h4 className="text-2xl text-center text-black font-bold">
              Add Slides
            </h4>
          )}
        </div>

        <button onClick={onClose}>
          <IoReturnUpBackOutline size="32" />
        </button>
      </div>
      {currentMenuOption === "main" && (
        <MainMenu setCurrentMenuOption={setCurrentMenuOption} />
      )}

      {currentMenuOption === "co-host" && <CoHostMenu users={users} />}
    </Menu>
  );
}
