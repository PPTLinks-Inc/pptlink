import { useEffect, useRef, useState } from "react";
import AgoraRTM from "agora-rtm-sdk";
import { RTMClient, RTMEvents } from "agora-rtm-sdk/agora-rtm";
import { useQueryClient } from "@tanstack/react-query";
import { AGORA_APP_ID } from "../../../constants/routes";
import { presentationData } from "../types";

export default function useRTM(endAudio: (hostEnd: boolean)=>void, setStartPrompt: React.Dispatch<React.SetStateAction<boolean>>, tokens?: { rtcUid: string; rtmToken: string }, presentation?: presentationData) {
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const rtm = useRef<RTMClient | null>(null);
  const [rtmConnectionState, setRtmConnectionState] = useState<RTMEvents.RTMConnectionStatusChangeEvent["state"]>("DISCONNECTED");

  function leaveRtmChannel() {
    rtm.current?.logout().then(() => {
      rtm.current = null;
    });
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
          rtm.current = new AgoraRTM.RTM(AGORA_APP_ID, presentation.User === "HOST" ? `HOST${tokens.rtcUid}` : tokens.rtcUid, {
            token: tokens.rtmToken,
            useStringUserId: true
          });

          rtm.current.addEventListener("status",function(data) {
            setRtmConnectionState(data.state as RTMEvents.RTMConnectionStatusChangeEvent["state"]);
          });

          if (presentation.User === "GUEST") {
            rtm.current.addEventListener("message", function(messageData) {
              if (messageData.message === "LIVE") {
                let audio = presentation.audio;
                if (presentation.audio && presentation.live) {
                  endAudio(true);
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
              else if (messageData.message === "AUDIO") {
                if (presentation.audio) {
                  endAudio(true);
                }
                else {
                  queryClient.setQueryData<presentationData>(
                    ["presentation", presentation.liveId],
                    (prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          audio: true
                        };
                      }
                    }
                  );
                  setStartPrompt(true);
                }
              }
            });
          }

          await rtm.current.login();

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

  return { error, loading, success, rtm: rtm.current, rtmConnectionState, leaveRtmChannel };
}
