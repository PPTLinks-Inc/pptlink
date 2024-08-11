/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useMemo } from "react";
import RTC, {
  IAgoraRTCClient,
  NetworkQuality,
  IRemoteAudioTrack,
  ILocalAudioTrack,
  IAgoraRTCRemoteUser,
  ConnectionState
} from "agora-rtc-sdk-ng";
import { AGORA_APP_ID } from "../../../constants/routes";

let rtcClient: IAgoraRTCClient | null = null;

export default function useAudio() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [audioConnectionState, setAudioConnectionState] = useState<ConnectionState | null>(null);
  const audioTracks = useRef<{
    localAudioTrack: ILocalAudioTrack | null;
    remoteAudioTracks: { [key: string]: IRemoteAudioTrack };
  }>({
    localAudioTrack: null,
    remoteAudioTracks: {}
  });

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

  function endAudio(error = false) {
    setSuccess(false);
    setError(error);
    setLoading(false);
    audioTracks.current?.localAudioTrack?.stop();
    audioTracks.current?.localAudioTrack?.close();
    audioTracks.current.localAudioTrack = null;
    rtcClient?.leave().then(() => {
      rtcClient = null;
    });
  }

  async function startAudio(
    liveId: string,
    rtcToken: string,
    rtcUid: string,
    removeUsers: (uid: IAgoraRTCRemoteUser["uid"]) => void
  ) {
    try {
      setError(false);
      setSuccess(false);
      setLoading(true);

      rtcClient = RTC.createClient({ mode: "rtc", codec: "vp8" });

      rtcClient.on("connection-state-change",function(state) {
        setAudioConnectionState(state);
      });
      rtcClient.on("user-published", async (user, mediaType) => {
        await rtcClient?.subscribe(user, mediaType);

        if (mediaType == "audio") {
          if (!user.audioTrack) return;
          audioTracks.current.remoteAudioTracks[user.uid] = user.audioTrack;
          user.audioTrack?.play();
        }
      });

      rtcClient.on("user-left", (user) => {
        removeUsers(user.uid);
        delete audioTracks.current.remoteAudioTracks[user.uid];
      });

      rtcClient.on("network-quality", function (quality) {
        setNetworkScore(quality);
      });

      await rtcClient.join(AGORA_APP_ID, liveId, rtcToken, rtcUid);

      audioTracks.current.localAudioTrack =
        await RTC.createMicrophoneAudioTrack({
          encoderConfig: "speech_low_quality"
        });
      await rtcClient.publish(audioTracks.current.localAudioTrack);
      audioTracks.current.localAudioTrack.setMuted(true);

      setSuccess(true);
    } catch (err) {
      endAudio(true);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    success,
    error,
    networkStatus,
    audioConnectionState,
    setMute,
    endAudio,
    startAudio
  };
}
