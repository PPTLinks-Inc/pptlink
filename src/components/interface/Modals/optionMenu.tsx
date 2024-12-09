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
          <Label htmlFor="pen" className="flex gap-2 items-center">
            <PiPenNibLight size="24" />
            <span>Pen</span>
          </Label>
          <div className="flex gap-5 items-center">
            <Switch id="pen" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="music" className="flex gap-2 items-center">
            <IoMusicalNotesOutline size="24" />
            <span>Music</span>
          </Label>
          <div className="flex gap-5 items-center">
            <Switch id="music" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Label
            htmlFor="ping-audience"
            className="flex gap-2 items-center"
          >
            <GoBell size="24" />
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
              <AiOutlineUsergroupAdd size="24" />
              <span className="text-sm font-medium">Co-host</span>
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
                size="24"
                className={cn(screenShareEnabled && "fill-[#05FF00]")}
              />
              {!screenShareEnabled ? (
                <span className="text-sm font-medium">Share Screen</span>
              ) : (
                <span className="text-sm font-medium">Stop Sharing</span>
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
              <RiFolderAddLine size="24" />
              <span className="text-sm font-medium">Add Slides</span>
            </div>
            <MdKeyboardArrowRight size="20" />
          </button>
        </div>
        <div>
          <button className="w-full flex justify-between items-center disabled:!cursor-not-allowed disabled:opacity-50">
            <div className="flex gap-2 items-center">
              <RiBarChart2Line size="24" />
              <span className="text-sm font-medium">Poll</span>
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

function AddSlideMenu() {
  const { userQuery, setUser } = useUser();
  const { data: user } = userQuery;

  const presentationQuery = useUserPresentations({
    enabled: !!user
  });

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "100px",
    threshold: 1
  });

  useEffect(
    function () {
      if (intersection && intersection?.isIntersecting) {
        if (presentationQuery.hasNextPage) presentationQuery.fetchNextPage();
      }
    },
    [intersection, intersection?.isIntersecting, presentationQuery]
  );

  function OpenLoginWindow() {
    const signInWindow = window.open(
      "/signin",
      "_blank",
      "width=500,height=600"
    );

    // Set up a message event listener
    function handleMessage(event: MessageEvent) {
      // Validate the event's origin for security
      if (event.origin !== window.location.origin) {
        console.warn("Untrusted origin:", event.origin);
        return;
      }

      // Update user data
      if (event.data.type === "SIGN_IN") {
        setAuthFetchToken(event.data.token);
        setUser(event.data.payload);
        signInWindow?.close(); // Optionally close the sign-in window
        window.removeEventListener("message", handleMessage);
      }
    }

    window.addEventListener("message", handleMessage);
  }

  const addPresentation = usepresentationStore(
    (state) => state.addPresentation
  );
  const removePresentation = usepresentationStore(
    (state) => state.removePresentation
  );
  const currentPresentation = usepresentationStore(
    (state) => state.currentPresentation
  );
  const allPresentationData = usepresentationStore(
    (state) => state.allPresentationData
  );
  const originalPresentationData = usepresentationStore(
    (state) => state.presentation
  );

  const loadPresentation = usepresentationStore(
    (state) => state.loadPresentation
  );

  function handleAddPresentation(presentation: UploadPresentation) {
    const presentationAdded = allPresentationData.find(
      (data) => data.liveId === presentation.liveId
    );

    const rtm = useRtmStore.getState().rtm!;
    if (presentationAdded) {
      rtm?.publish(
        originalPresentationData!.liveId,
        `present-${presentationAdded.liveId}`
      );
      safeAwait(
        rtm.storage.setChannelMetadata(
          originalPresentationData!.liveId,
          "MESSAGE",
          [
            {
              key: "slideData",
              value: JSON.stringify({
                maxSlides: 0,
                hostSlide: 0,
                prevHostSlide: 0
              })
            },
            {
              key: "all-presentations",
              value: JSON.stringify(
                allPresentationData.map((data) => {
                  if (data.liveId === presentationAdded.liveId) {
                    return {
                      ...data,
                      presenting: true
                    }
                  }

                  return {
                    ...data,
                    presenting: false
                  };
                })
              )
            }
          ],
          { addUserId: true }
        )
      );
      useSlideStore.setState({ lockSlide: false });
      loadPresentation(presentationAdded.url, presentationAdded.liveId);
      return;
    }

    if (originalPresentationData?.liveId === presentation.liveId) {
      rtm?.publish(
        originalPresentationData!.liveId,
        `present-${originalPresentationData.liveId}`
      );
      safeAwait(
        rtm.storage.setChannelMetadata(
          originalPresentationData!.liveId,
          "MESSAGE",
          [
            {
              key: "slideData",
              value: JSON.stringify({
                maxSlides: 0,
                hostSlide: 0,
                prevHostSlide: 0
              })
            }
          ],
          { addUserId: true }
        )
      );
      loadPresentation(
        originalPresentationData.pdfLink,
        originalPresentationData.liveId
      );
      return;
    }

    addPresentation({
      url: presentation.pdfLink,
      liveId: presentation.liveId
    });
  }

  function handleRemovePresentation(liveId: string) {
    const rtm = useRtmStore.getState().rtm!;
    const originalPresentationData = usepresentationStore.getState().presentation!;
    rtm?.publish(
      originalPresentationData.liveId,
      `present-${originalPresentationData.liveId}`
    );
    removePresentation(liveId);
  }

  function presentingStyle(presentation: UploadPresentation) {
    const presentationAdded = allPresentationData.find(
      (data) => data.liveId === presentation.liveId
    );
    return {
      text:
        originalPresentationData?.liveId === presentation.liveId &&
        originalPresentationData?.liveId !== currentPresentation?.liveId
          ? "Present Original"
          : currentPresentation?.liveId === presentation.liveId
            ? "Presenting"
            : presentationAdded
              ? "Present"
              : "Add +",
      presenting: currentPresentation?.liveId === presentation.liveId,
      presentationAdded
    };
  }

  return (
    <div className="text-sm p-3 flex flex-col gap-4 overflow-y-auto h-full pt-20">
      {!user && (
        <div>
          <p className="text-center text-lg font-bold">
            You need to be logged in to add slides
          </p>
          <Button
            onClick={OpenLoginWindow}
            className="bg-black text-white mx-auto block mt-3 md:w-20 w-full p-2 rounded-lg"
          >
            Login
          </Button>
        </div>
      )}

      {presentationQuery?.data && user && (
        <>
          {presentationQuery.data.pages.flat().map((presentation) => (
            <div
              key={presentation.id}
              className="flex border p-3 gap-4 rounded-lg border-[#FF8B1C]"
            >
              <img
                src={presentation.thumbnail}
                alt={`${presentation.name}`}
                className="rounded-lg object-cover aspect-video w-1/3"
              />
              <div className="flex flex-col gap-2 w-full">
                <p className="font-bold">{presentation.name}</p>
                <p>
                  <span className="font-bold">Presenter:</span>{" "}
                  {presentation.presenterName}
                </p>
                <p>
                  <span className="font-bold">Category:</span>{" "}
                  {presentation.category.name}
                </p>
                <div className="flex w-full gap-4">
                  {presentingStyle(presentation).presentationAdded && (
                    <Button
                      className="w-full border-rose-500 bg-[#FFFFDB] text-rose-500 hover:bg-rose-500 hover:text-white"
                      variant="outline"
                      onClick={() => {
                        handleRemovePresentation(presentation.liveId);
                      }}
                    >
                      Remove -
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      handleAddPresentation(presentation);
                    }}
                    className="bg-black text-white w-full rounded-lg disabled:!cursor-not-allowed disabled:bg-gray-500"
                    disabled={presentingStyle(presentation).presenting}
                  >
                    {presentingStyle(presentation).text}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {presentationQuery.isLoading && (
        <div className="flex justify-center">
          <LoadingAssetSmall />
        </div>
      )}

      {presentationQuery.isError ||
        (presentationQuery.isFetchNextPageError && (
          <div className="flex justify-center flex-col items-center gap-3">
            <p className="text-whte">Failed to fetch</p>
            <Button
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (presentationQuery as any).fetchNextPage();
              }}
              className="block w-fit h-fit p-2 border-2 border-white rounded-[.5rem] bg-black text-white"
            >
              Load more
            </Button>
          </div>
        ))}

      <div ref={intersectionRef}></div>
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
      <div className="left-0 right-0 rounded-t-xl p-5 pb-1 flex items-center justify-between border-b-[1px] border-r-[1px] border-[#FF8B1C] fixed w-full pr-9 md:pr-12 bg-[#FFFFDB]">
        <div className="flex items-center w-full">
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
