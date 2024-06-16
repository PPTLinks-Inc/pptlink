import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import AgoraRTM from "agora-rtm-sdk";
import { AGORA_APP_ID, MIC_STATE } from "../../../constants/routes";
import micRequest from "../assets/mic-request.mp3";
import { toast } from "react-toastify";

export default function useSignalling(
  isReady,
  presentation,
  tokens,
  setJoinAudio,
  userName,
  setMicState,
  setMute
) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const rtm = useRef(null);

  const micRequestAudio = useRef(new Audio(micRequest));
  const [host, setHost] = useState(null);
  const [users, setUsers] = useState({});
  const numberOfUsers = useMemo(() => Object.keys(users).length, [users]);
  const userArr = useMemo(() => Object.values(users), [users]);

  const changeMicState = useCallback(function (state) {
    if (rtm.current) {
      setUsers(function (prevUsers) {
        if (prevUsers[tokens.rtcUid]) {
          prevUsers[tokens.rtcUid].status = state;
        }
        return prevUsers;
      });
      rtm.current.presence.setState(
        presentation.data.liveId,
        "MESSAGE",
        {
          status: state,
          userName: userName,
          user: presentation.data.User
        }
      );
    }
  }, [presentation.data?.User, presentation.data?.liveId, tokens?.rtcUid, userName]);

  const acceptMicRequest = useCallback(async function (userId, micState) {
    if (rtm.current) {
      try {
        await rtm.current.publish(userId, micState);
      } catch (err) {
        toast.error("Failed to accept mic request");
      }
    }
  }, []);

  const handleUserJoin = useCallback(function () {
    let tempUsersEvent = [];
    let timeout;

    return function (userData) {
      tempUsersEvent.push(userData);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const userDataChanged = tempUsersEvent
          .filter((userEvent) => userEvent.eventType === "REMOTE_STATE_CHANGED" && userEvent.stateChanged.user !== "HOST")
          .map((eventData) => ({
            id: eventData.publisher,
            ...eventData.stateChanged
          }));
          const usersLeft = tempUsersEvent.filter((userEvent) => userEvent.eventType === "REMOTE_LEAVE" && userEvent.publisher !== host?.id).map((eventData) => eventData.publisher);
          // usersleft from newUsers and userDataChanged
          
          const usersLeftFromUserDataChanged = userDataChanged.filter((user) => !usersLeft.includes(user.id));
          const micRequestCount = usersLeftFromUserDataChanged.reduce(function(acc, user) {
            if (user.status === MIC_STATE.REQ_MIC && !acc.includes(user.id)) {
              return acc.concat(user.id);
            }
            return acc;
          }, []).length;
          setUsers(prevUsers => {
            const updatedUsers = {};
            usersLeftFromUserDataChanged.forEach(user => {
              updatedUsers[user.id] = user;
            });
            for (const user of usersLeft) {
              delete prevUsers[user];
            }
            return {
              ...prevUsers,
              ...updatedUsers
            };
          });
          if (micRequestCount > 0 && presentation.data.User === "HOST") {
            toast.info(`${micRequestCount} user(s) requested mic`);
            micRequestAudio.current.play();
          }

          const hostEvent = tempUsersEvent.find((userEvent) => userEvent.eventType === "REMOTE_STATE_CHANGED" && userEvent.stateChanged.user === "HOST");
          const hostLeftEvent = tempUsersEvent.find((userEvent) => userEvent.eventType === "REMOTE_LEAVE" && userEvent.publisher === host?.id);
          // console.log("hostLeftEvent", hostLeftEvent);
          // console.log("tempUsersEvent", tempUsersEvent);
          // console.log("hostEvent", hostEvent);
          console.log("_host", host);

          if (hostLeftEvent) {
            setHost(null);
          }
          else {
            if (hostEvent) {
              setHost({
                id: hostEvent.publisher,
                ...hostEvent.stateChanged
              });
            }
          }

        tempUsersEvent = [];
      }, 1000);
    };
  }, [host, presentation.data?.User]);

  const leaveRtmChannel = useCallback(function() {
      rtm.current?.logout();
  }, [rtm]);

  useEffect(
    function () {
      if (!isReady) {
        setSuccess(false);
        setError(false);
        setLoading(false);
        setUsers({});
        setHost(null);
        if (rtm.current) {
          rtm.current?.logout();
        }
        return;
      }

      async function init() {
        try {
          setError(false);
          setSuccess(false);
          setLoading(true);
          rtm.current = new AgoraRTM.RTM(AGORA_APP_ID, tokens.rtcUid, {
            token: tokens.rtmToken,
            useStringUserId: true
          });
          setMicState(presentation.data.User === "HOST" ? MIC_STATE.MIC_MUTED : MIC_STATE.MIC_OFF);
          await rtm.current.login();
          await rtm.current.subscribe(presentation.data.liveId, {
            withMessage: true,
            withPresence: true,
            withMetadata: true
          });

          await rtm.current.subscribe(tokens.rtcUid);

          await rtm.current.presence.setState(
            presentation.data.liveId,
            "MESSAGE",
            {
              status:
                presentation.data?.User === "HOST"
                  ? MIC_STATE.MIC_MUTED
                  : MIC_STATE.MIC_OFF,
              userName: userName,
              user: presentation.data.User
            }
          );

          const currentUsers = await rtm.current.presence.getOnlineUsers(presentation.data.liveId, "MESSAGE", {
            includeUserId : true ,
            includedState : true
          });

          setUsers(function(prevUsers) {
            const updatedUsers = {};
            currentUsers.occupants.filter(user => user.states.user !== "HOST").forEach(user => {
              updatedUsers[user.userId] = {
                id: user.userId,
                ...user.states
              };
            });
            return {
              ...prevUsers,
              ...updatedUsers
            };
          });

          const hostUser = currentUsers.occupants.find(user => user.states.user === "HOST");
          if (hostUser) {
            setHost({
              id: hostUser.userId,
              ...hostUser.states
            });
          } else {
            setHost(null);
          }
          rtm.current.addEventListener("message", (event) => {
            if (event.message === MIC_STATE.MIC_MUTED) {
              micRequestAudio.current.play();
              toast.success("Mic request accepted");
            }
            setMute(true);
            setMicState(event.message);
            setUsers(function(prevUsers) {
              prevUsers[tokens.rtcUid].status = event.message;
              return {
                ...prevUsers
              };
            });
            rtm.current.presence.setState(presentation.data.liveId, "MESSAGE", {
              status: event.message,
              userName: userName,
              user: presentation.data.User
            });
          });
          // Presence

          rtm.current.addEventListener("presence", handleUserJoin());

          window.addEventListener("beforeunload", leaveRtmChannel);
          setSuccess(true);
        } catch (err) {
          console.log("rtm error", err);
          setError(true);
          setJoinAudio(false);
        } finally {
          setLoading(false);
        }
      }

      init();

      return () => {
        (async function () {
          if (rtm.current) {
            window.removeEventListener("beforeunload", leaveRtmChannel);
            await rtm.current?.logout();
          }
        })();
      };
    },
    [isReady]
  );

  return { error, loading, success, users: userArr, usersObj: users, numberOfUsers, host, changeMicState, acceptMicRequest };
}
