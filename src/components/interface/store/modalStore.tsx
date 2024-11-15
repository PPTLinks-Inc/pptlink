import React from "react";
import { create } from "zustand";
import { usepresentationStore } from "./presentationStore";
import { toast } from "@/hooks/use-toast";
import { useAudioStore } from "./audioStore";
import { useRtmStore } from "./rtmStore";
import { useSlideStore } from "./slideStore";

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
}

export const useModalStore = create<ModalStore>((set, get) => ({
  isOpen: false,
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
      isLoading: false,
      title:
        presentation?.User === "HOST"
          ? presentation?.audio
            ? "Rejoin Audio"
            : "Start Audio"
          : "Join Audio",
      description: "",
      content: null,
      actionText:
        presentation?.User === "HOST"
          ? presentation?.audio
            ? "Rejoin"
            : "Start"
          : "Join",
      onClose: () => {
        set({ isOpen: false });
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
      title: "Enter your name",
      description: "",
      content: <NameForm />,
      actionText: "Join",
      onClose: () => {
        set({ isOpen: false });
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
      title: presentation?.User === "HOST" ? "End Audio" : "Leave Audio",
      description:
        presentation?.User === "HOST"
          ? "Are you sure you want to end the audio?"
          : "Are you sure you want to leave the audio?",
      content: null,
      actionText: presentation?.User ===  "HOST" ? "End" : "Leave",
      onClose: () => {
        set({ isOpen: false });
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
      title,
      description,
      content: null,
      actionText,
      onClose: () => {
        set({ isOpen: false });
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
  }
}));
