/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState, useMemo } from "react";
import RTC, {
  IAgoraRTCClient,
  NetworkQuality,
  IRemoteAudioTrack,
  ILocalAudioTrack
} from "agora-rtc-sdk-ng";
import { AGORA_APP_ID } from "../../../constants/routes";
import { presentationData, rtmTokenI } from "../types";

let rtcClient: IAgoraRTCClient | null = null;

export default function useAudio(
  isReady: boolean,
  setJoinAudio: React.Dispatch<React.SetStateAction<boolean>>,
  rtcToken: string | null,
  tokens?: rtmTokenI,
  presentation?: presentationData
) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const audioTracks = useRef<{
    localAudioTrack: ILocalAudioTrack | null;
    remoteAudioTracks: { [key: string]: IRemoteAudioTrack };
  }>({
    localAudioTrack: null,
    remoteAudioTracks: {}
  });
  const [users, setUsers] = useState<string[]>([]);

  const [networkScore, setNetworkScore] = useState<NetworkQuality>();

  const networkStatus = useMemo(
    function () {
      const networkLabels = {
        0: "Unknown",
        1: "good",
        2: "mid",
        3: "poor",
        4: "poor",
        5: "poor",
        6: "No Connection"
      };
      return networkLabels[networkScore?.uplinkNetworkQuality || 0];
    },
    [networkScore]
  );

  function setMute(mute: boolean) {
    if (audioTracks.current.localAudioTrack) {
      audioTracks.current.localAudioTrack.setMuted(mute);
    }
  }

  useEffect(() => {
    if (!isReady) {
      setSuccess(false);
      setError(false);
      setLoading(false);
      if (audioTracks.current.localAudioTrack) {
        audioTracks.current.localAudioTrack.stop();
        audioTracks.current.localAudioTrack.close();
      }
      if (rtcClient?.channelName) {
        rtcClient.leave();
      }
      return;
    }

    async function init() {
      try {
        // if (rtcClient !== null) return;
        console.log("Init Audio");
        setError(false);
        setSuccess(false);
        setLoading(true);

        rtcClient = RTC.createClient({ mode: "rtc", codec: "vp8" });

        rtcClient.on("user-published", async (user, mediaType) => {
          await rtcClient?.subscribe(user, mediaType);

          if (mediaType == "audio") {
            if (!user.audioTrack) return;
            console.log("User Published", user.uid);
            setUsers((users) => [...users, user.uid as string]);
            audioTracks.current.remoteAudioTracks[user.uid] = user.audioTrack;
            user.audioTrack?.play();
          }
        });

        rtcClient.on("user-left", (user) => {
          setUsers((users) => users.filter((u) => u !== user.uid));
          delete audioTracks.current.remoteAudioTracks[user.uid];
        });

        rtcClient.on("network-quality", function (quality) {
          setNetworkScore(quality);
        });

        setUsers(rtcClient.remoteUsers.map((user) => user.uid as string));

        if (!rtcToken || !tokens || !presentation) {
          throw new Error("RTC Missing required data");
        }

        console.log(rtcToken);
        await rtcClient.join(
          AGORA_APP_ID,
          presentation.liveId,
          rtcToken,
          tokens.rtcUid
        );

        audioTracks.current.localAudioTrack = await RTC.createMicrophoneAudioTrack({
          encoderConfig: "speech_low_quality"
        });
        await rtcClient.publish(audioTracks.current.localAudioTrack);
        audioTracks.current.localAudioTrack.setMuted(true);

        setSuccess(true);
      } catch (err) {
        console.error(err);
        setError(true);
        setJoinAudio(false);

        if (audioTracks.current.localAudioTrack) {
          audioTracks.current.localAudioTrack.stop();
          audioTracks.current.localAudioTrack.close();
        }

        if (rtcClient) {
          rtcClient.leave().then(()=> {
            rtcClient = null;
          });
        }
      } finally {
        setLoading(false);
      }
    }

    init();

    return function () {
      if (audioTracks.current.localAudioTrack) {
        audioTracks.current.localAudioTrack.stop();
        audioTracks.current.localAudioTrack.close();
        if (rtcClient?.channelName) {
          rtcClient.leave();
        }
      }
    };
  }, [isReady]);

  return {
    loading,
    success,
    error,
    joinedAudio: users,
    setMute,
    networkStatus
  };
}
