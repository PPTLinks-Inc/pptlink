/* eslint-disable @typescript-eslint/no-explicit-any */
import { RTMClient, RTMEvents } from "agora-rtm-sdk";
import { useEffect, useMemo, useState } from "react";
import { presentationData, rtmTokenI } from "../types";
import { MIC_STATE } from "../../../constants/routes";

export default function useAudioUsers(
  start: boolean,
  rtm: RTMClient | null,
  userName: string,
  tokens?: rtmTokenI,
  presentation?: presentationData
) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{
    [key: string]: { id: string; userName: string; micState: typeof MIC_STATE };
  }>({});
  const statusPriority: { [key: string]: number } = {
    REQ_MIC: 1,
    CAN_SPK: 2,
    MIC_MUTED: 3,
    MIC_OFF: 4
  };
  const userArr = useMemo(() => {
    return Object.values(users).sort((a, b) => {
      // Check if either user is the current user
      if (a.id === tokens?.rtcUid) return -1;
      if (b.id === tokens?.rtcUid) return 1;

      // Compare based on status priority
      return (
        statusPriority[String(a.micState)] - statusPriority[String(b.micState)]
      );
    });
  }, [tokens?.rtcUid, users]);

  function handleUserJoinAndLeave(presenceData: RTMEvents.PresenceEvent) {
    console.log(presenceData);
  }

  useEffect(
    function () {
      if (!start) {
        if (rtm && tokens && presentation) {
          rtm.addEventListener("presence", handleUserJoinAndLeave);

          (async function init() {
            try {
              setError(false);
              setSuccess(false);
              setLoading(true);
              await rtm.presence.setState(presentation.liveId, "MESSAGE", {
                id: tokens.rtcUid,
                userName: presentation.User === "HOST" ? "HOST" : userName,
                micState:
                  presentation.User === "HOST"
                    ? MIC_STATE.MIC_MUTED
                    : MIC_STATE.MIC_OFF
              });

              const data = await rtm.presence.getOnlineUsers(
                presentation.liveId,
                "MESSAGE",
                {
                  includedState: true
                }
              );

              const tempUsrs: any = {};
              for (let i = 0; i < data.occupants.length; i++) {
                const u = data.occupants[i];
                if (u.states.userName === "HOST") continue;
                tempUsrs[u.userId] = {
                  id: u.userId,
                  userName: u.states.userName,
                  micState: u.states.micState
                };
              }

              setUsers(tempUsrs);
              setSuccess(true);
              setLoading(false);
            } catch (error) {
              setError(true);
              setLoading(false);
            }
          })();
        }
      }

      return function () {
        rtm?.removeEventListener("presence", handleUserJoinAndLeave);
      };
    },
    [start]
  );

  return { success, error, loading, users: userArr };
}
