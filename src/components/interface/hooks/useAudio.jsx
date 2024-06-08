import { useRef, useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { AGORA_APP_ID } from "../../../constants/routes";

export default function useAudio(isReady, presentation, tokens, setJoinAudio) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const audioTracks = useRef({
    localAudioTrack: null,
    remoteAudioTracks: {}
  });
  const rtcClient = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
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
        if (rtcClient.current.channelName) {
          rtcClient.current.leave();
        }
      }
      return;
    }

    async function init() {
      try {
        setError(false);
        setSuccess(false);
        setLoading(true);
        await rtcClient.current.join(
          AGORA_APP_ID,
          presentation.data.liveId,
          tokens.rtcToken,
          tokens.rtcUid
        );
        audioTracks.current.localAudioTrack =
          await AgoraRTC.createMicrophoneAudioTrack();
        audioTracks.current.localAudioTrack.setMuted(true);
        await rtcClient.current.publish(audioTracks.current.localAudioTrack);

        rtcClient.current.on("user-published", async (user, mediaType) => {
          await rtcClient.current.subscribe(user, mediaType);

          if (mediaType == "audio") {
            audioTracks.current.remoteAudioTracks[user.uid] = [user.audioTrack];
            user.audioTrack.play();
          }
        });
        rtcClient.current.on("user-left", (user) => {
          delete audioTracks.current.remoteAudioTracks[user.uid];
        });
        setSuccess(true);
      } catch (err) {
        setError(true);
        setJoinAudio(false);
      } finally {
        setLoading(false);
      }
    }

    init();

    return function() {
      if (audioTracks.current.localAudioTrack) {
        audioTracks.current.localAudioTrack.stop();
        audioTracks.current.localAudioTrack.close();
        if (rtcClient.current.channelName) {
          rtcClient.current.leave();
        }
      }
    };

  }, [isReady]);

  return {
    loading,
    success,
    error,
    setMute,
    rtcClient: rtcClient.current
  };
}
