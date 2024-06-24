import { useRef, useEffect, useState, useMemo } from "react";
import { createClient, createMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { AGORA_APP_ID } from "../../../constants/routes";

const rtcClient = createClient({ mode: "rtc", codec: "vp8" });

export default function useAudio(isReady, presentation, tokens, setJoinAudio) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const audioTracks = useRef({
    localAudioTrack: null,
    remoteAudioTracks: {}
  });
  // const rtcClient = useRef(
  //   createClient({ mode: "rtc", codec: "vp8" })
  // );
  const [networkScore, setNetworkScore] = useState(0);

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
      return networkLabels[networkScore.uplinkNetworkQuality];
    },
    [networkScore]
  );

  function setMute(mute) {
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
        if (rtcClient.channelName) {
          rtcClient.leave();
        }
      }
      return;
    }

    async function init() {
      try {
        setError(false);
        setSuccess(false);
        setLoading(true);

        rtcClient.on("user-published", async (user, mediaType) => {
          await rtcClient.subscribe(user, mediaType);

          if (mediaType == "audio") {
            audioTracks.current.remoteAudioTracks[user.uid] = [user.audioTrack];
            user.audioTrack?.play();
          }
        });

        rtcClient.on("user-left", (user) => {
          delete audioTracks.current.remoteAudioTracks[user.uid];
        });

        rtcClient.on("network-quality", function(quality) {
          setNetworkScore(quality);
        });

        await rtcClient.join(
          AGORA_APP_ID,
          presentation.data.liveId,
          tokens.rtcToken,
          tokens.rtcUid
        );

        audioTracks.current.localAudioTrack =
          await createMicrophoneAudioTrack({
            encoderConfig: "speech_low_quality"
          });
          await rtcClient.publish(audioTracks.current.localAudioTrack);
          audioTracks.current.localAudioTrack.setMuted(true);

        setSuccess(true);
      } catch (err) {
        setError(true);
        setJoinAudio(false);
      } finally {
        setLoading(false);
      }
    }

    init();

    return function () {
      if (audioTracks.current.localAudioTrack) {
        audioTracks.current.localAudioTrack.stop();
        audioTracks.current.localAudioTrack.close();
        if (rtcClient.channelName) {
          rtcClient.leave();
        }
      }
    };
  }, [isReady]);

  return {
    loading,
    success,
    error,
    setMute,
    networkStatus
  };
}
