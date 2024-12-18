import React from "react";
import { create } from "zustand";
import { usepresentationStore } from "./presentationStore";
import { toast } from "@/hooks/use-toast";
import { useAudioStore } from "./audioStore";
import { useRtmStore } from "./rtmStore";
import { useSlideStore } from "./slideStore";
import ImageViewer from "../Modals/ImageViewer";

function NameForm() {
  const userName = useRtmStore((state) => state.userName);
  const setUserName = useRtmStore((state) => state.setUserName);
  return (
    <div className="flex flex-col gap-5">
      <input
        type="text"
        placeholder="Enter your name"
        className="rounded p-2 w-full text-center border-[1px] border-[#FF7A00]"
        autoFocus
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
    </div>
  );
}

interface ModalStore {
  isOpen: boolean;
  showBottomAction: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description: string;
  content: React.ReactNode | null;
  actionText: string;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;

  startPrompt: () => void;
  namePrompt: () => void;
  endPrompt: () => void;
  coHostPrompt: (data: {
    actionText: string;
    description: string;
    title: string;
    successMessage: string;
    userId: string;
    action: "make" | "remove" | "replace";
  }) => void;
  stopScreenShare: () => void;
  showImagePrompt: (images: string[]) => void;

  resetStore: () => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  isOpen: false,
  showBottomAction: true,
  setIsOpen: function (open) {
    set({ isOpen: open });
  },
  title: "",
  description: "",
  content: null,
  actionText: "",
  onClose: () => {},
  onSubmit: () => {},
  isLoading: false,
  startPrompt: function () {
    const presentation = usepresentationStore.getState().presentation;
    const startAudio = useAudioStore.getState().startAudio;
    set({
      isOpen: true,
      showBottomAction: true,
      isLoading: false,
      title:
        presentation?.User === "HOST"
          ? presentation.status === "AUDIO"
            ? "Rejoin Audio"
            : "Start Audio"
          : "Join Audio",
      description: "",
      content: null,
      actionText:
        presentation?.User === "HOST"
          ? presentation.status === "AUDIO"
            ? "Rejoin"
            : "Start"
          : "Join",
      onClose: () => {
        get().setIsOpen(false);
      },
      onSubmit: () => {
        if (presentation?.User === "HOST") {
          set({ isLoading: true });
          startAudio()
            .then(() => {
              set({ isLoading: false, isOpen: false });
            })
            .catch(() => {
              set({ isLoading: false });
              toast({
                title: "Error",
                description: "Could'nt start conversation",
                variant: "destructive"
              });
            });
        } else {
          get().namePrompt();
        }
      }
    });
  },
  namePrompt: function () {
    set({
      isOpen: true,
      showBottomAction: true,
      title: "Enter your name",
      description: "",
      content: <NameForm />,
      actionText: "Join",
      onClose: () => {
        get().setIsOpen(false);
      },
      onSubmit: () => {
        const userName = useRtmStore.getState().userName;
        const startAudio = useAudioStore.getState().startAudio;
        if (!userName.trim() || userName.toLowerCase().includes("host"))
          return toast({
            title: "Error",
            description: "Please enter your name",
            variant: "destructive"
          });

        set({ isLoading: true });
        startAudio()
          .then(function () {
            localStorage.setItem("userName", `"${userName}"`);
            set({ isOpen: false, isLoading: false });
          })
          .catch(function () {
            set({ isLoading: false });
            toast({
              title: "Error",
              description: "Could'nt start audio",
              variant: "destructive"
            });
          });
      }
    });
  },
  endPrompt: function () {
    const stopAudio = useAudioStore.getState().endAudio;
    const presentation = usepresentationStore.getState().presentation;
    set({
      isOpen: true,
      showBottomAction: true,
      title: presentation?.User === "HOST" ? "End Audio" : "Leave Audio",
      description:
        presentation?.User === "HOST"
          ? "Are you sure you want to end the audio?"
          : "Are you sure you want to leave the audio?",
      content: null,
      actionText: presentation?.User === "HOST" ? "End" : "Leave",
      onClose: () => {
        get().setIsOpen(false);
      },
      onSubmit: () => {
        set({ isLoading: true });
        stopAudio({ hostEnd: false })
          .then(() => {
            set({ isLoading: false, isOpen: false });
          })
          .catch(() => {
            set({ isLoading: false });
            toast({
              title: "Error",
              description: "Could'nt end audio",
              variant: "destructive"
            });
          });
      }
    });
  },
  coHostPrompt: function ({
    actionText,
    description,
    title,
    successMessage,
    userId,
    action
  }) {
    const makeCohost = useAudioStore.getState().makeCohost;
    const rtm = useRtmStore.getState().rtm;
    set({
      isOpen: true,
      showBottomAction: true,
      title,
      description,
      content: null,
      actionText,
      onClose: () => {
        get().setIsOpen(false);
      },
      onSubmit: () => {
        set({ isLoading: true });
        makeCohost(userId).then(function () {
          set({ isLoading: false, isOpen: false });
          useRtmStore.setState({ coHostId: userId });
          useRtmStore.getState().setSortedUsers();

          if (action === "make") {
            rtm?.addEventListener(
              "storage",
              useSlideStore.getState().slidesEvent
            );
          } else if (action === "remove") {
            rtm?.removeEventListener(
              "storage",
              useSlideStore.getState().slidesEvent
            );
          }

          toast({
            title: "Success",
            description: successMessage
          });
        });
      }
    });
  },
  stopScreenShare: function () {
    const stopScreenShare = useAudioStore.getState().stopScreenShare;
    set({
      isOpen: true,
      showBottomAction: true,
      title: "Stop Screen Share",
      description: "Are you sure you want to stop screen share?",
      content: null,
      actionText: "Stop",
      onClose: () => {
        get().setIsOpen(false);
      },
      onSubmit: () => {
        set({ isLoading: true });
        stopScreenShare()
          .then(() => {
            set({ isLoading: false, isOpen: false });
            toast({
              description: "Screen share stopped"
            });
          })
          .catch(() => {
            set({ isLoading: false });
            toast({
              title: "Error",
              description: "Could'nt stop screen share",
              variant: "destructive"
            });
          });
      }
    });
  },
  showImagePrompt: function (images) {
    set({
      isOpen: true,
      showBottomAction: false,
      title: "Images",
      description: "",
      content: <ImageViewer images={images} />,
      actionText: "Close",
      onClose: () => {
        // get().setIsOpen(false);
      },
      onSubmit: () => {
        // get().setIsOpen(false);
      }
    });
  },
  resetStore: function () {
    set({
      isOpen: false,
      showBottomAction: true,
      title: "",
      description: "",
      content: null,
      actionText: "",
      onClose: () => {},
      onSubmit: () => {},
      isLoading: false
    });
  }
}));
