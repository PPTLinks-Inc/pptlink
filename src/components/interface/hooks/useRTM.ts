import { useEffect, useRef, useState } from "react";
import AgoraRTM from "agora-rtm-sdk";
import { RTMClient, RTMEvents } from "agora-rtm-sdk/agora-rtm";
import { useQueryClient } from "@tanstack/react-query";
import { AGORA_APP_ID, MIC_STATE } from "../../../constants/routes";
import { PresentationContextI, presentationData } from "../types";
import { toast } from "react-toastify";
import { Message, useMessageStore } from "./messageStore";

export default function useRTM(
  endAudio: PresentationContextI["endAudio"],
  setStartPrompt: React.Dispatch<React.SetStateAction<boolean>>,
  changeMicState: (state: MIC_STATE, rtm: RTMClient | null) => void,
  tokens?: { rtcUid: string; rtmToken: string },
  presentation?: presentationData
) {
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const rtm = useRef<RTMClient | null>(null);
  const [rtmConnectionState, setRtmConnectionState] =
    useState<RTMEvents.RTMConnectionStatusChangeEvent["state"]>("DISCONNECTED");

  const addMessage = useMessageStore((state) => state.addUnreadMessage);

  async function leaveRtmChannel(e?: BeforeUnloadEvent) {
    if (!e) {
      await rtm.current?.logout();
      rtm.current = null;
      return; // No need to show confirmation message
    }
    e.preventDefault();
    const confirmationMessage =
      "You are about to leave the presentation. Are you sure?";
    if (window.confirm(confirmationMessage)) {
      await rtm.current?.logout();
      rtm.current = null;
    }
    return confirmationMessage;
  }

  async function messageListerner(rtm: RTMClient | null, messageData: RTMEvents.MessageEvent) {
    if (!presentation) return;
    if (messageData.message === "LIVE") {
      if (presentation.User === "GUEST") {
        let audio = presentation?.audio;
        if (audio && presentation.live) {
          await endAudio.mutateAsync({
            liveId: presentation.liveId,
            presentationId: presentation.id,
            User: presentation.User,
            hostEnd: true
          });
          audio = false;
        }

        queryClient.setQueryData<presentationData>(
          ["presentation", presentation.liveId],
          (prev) => {
            if (prev) {
              return {
                ...prev,
                live: !prev.live,
                audio
              };
            }
          }
        );
      }
    } else if (messageData.message === "START_AUDIO") {
      if (presentation.User === "GUEST") {
        setStartPrompt(true);
      }
    } else if (messageData.message === "END_AUDIO") {
      if (presentation.User === "GUEST") {
        setStartPrompt(false);
        endAudio.mutate({
          liveId: presentation.liveId,
          presentationId: presentation.id,
          User: presentation.User,
          hostEnd: true
        });
      }
    } else if (messageData.message === MIC_STATE.MIC_MUTED || messageData.message === MIC_STATE.MIC_OFF) {
      if (messageData.message === MIC_STATE.MIC_MUTED) {
        toast.info("Unmute your mic to speak");
      }
      else if (messageData.message === MIC_STATE.MIC_OFF) {
        toast.info("Your microphone is muted by the host");
      }
      changeMicState(messageData.message, rtm);
    } else if (typeof messageData.message === "string") {
      const message = JSON.parse(messageData.message) as Message;
      message.time = new Date().toLocaleTimeString("en-UK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      addMessage(message);
    }
  }

  useEffect(
    function () {
      if (!tokens && !presentation) {
        setSuccess(false);
        setError(false);
        setLoading(false);
        leaveRtmChannel();
        return;
      }

      if (success) return;

      async function init() {
        try {
          if (!tokens || !presentation) return;
          setError(false);
          setSuccess(false);
          setLoading(true);
          rtm.current = new AgoraRTM.RTM(
            AGORA_APP_ID,
            presentation.User === "HOST"
              ? `HOST${tokens.rtcUid}`
              : tokens.rtcUid
          );

          rtm.current.addEventListener("status", function (data) {
            setRtmConnectionState(
              data.state as RTMEvents.RTMConnectionStatusChangeEvent["state"]
            );
          });

          if (!rtm.current) throw new Error("RTM not initialized");

          // if (presentation.User === "GUEST") {
          rtm.current.addEventListener("message", function (message: RTMEvents.MessageEvent) {
            messageListerner(rtm.current, message);
          });
          // }

          await rtm.current.login({
            token: tokens.rtmToken,
          });

          if (!presentation) {
            throw new Error("Presentation data not found");
          }
          await rtm.current.subscribe(presentation.liveId, {
            withMetadata: true,
            withMessage: true,
            withPresence: true
          });

          setSuccess(true);

          window.addEventListener("beforeunload", leaveRtmChannel);
        } catch (err) {
          setError(true);
          setSuccess(false);
          console.error(JSON.stringify(err));
          leaveRtmChannel();
        } finally {
          setLoading(false);
        }
      }

      init();

      return function () {
        if (rtm.current) {
          leaveRtmChannel();
          window.removeEventListener("beforeunload", leaveRtmChannel);
        }
      };
    },
    [tokens]
  );

  return {
    error,
    loading,
    success,
    rtm: rtm.current,
    rtmConnectionState,
    leaveRtmChannel
  };
}
