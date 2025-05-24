/* eslint-disable react/prop-types */
import React from "react";
import videojs from "video.js";
import "videojs-youtube";
import "videojs-landscape-fullscreen";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import qalitySelectorHls from "videojs-quality-selector-hls";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      // Register plugins before creating player instance
      videojs.registerPlugin("qalitySelectorHls", qalitySelectorHls);

      const player = (playerRef.current = videojs(
        videoElement,
        {
          ...options,
          html5: {
            hls: {
              enableLowInitialPlaylist: true,
              smoothQualityChange: true,
              overrideNative: true
            }
          }
        },
        () => {
          videojs.log("player is ready");

          try {
            // Initialize plugins in correct order
            player.qalitySelectorHls();
            player.landscapeFullscreen({
              fullscreen: {
                enterOnRotate: true,
                exitOnRotate: true,
                alwaysInLandscapeMode: true,
                iOS: true
              }
            });
          } catch (error) {
            console.error("Plugin initialization error:", error);
          }

          onReady && onReady(player);
        }
      ));
    } else {
      const player = playerRef.current;
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      data-vjs-player
      className="h-screen md:h-fit w-full flex items-center md:items-start justify-center"
    >
      <div ref={videoRef} className="w-full max-w-[90vw] 2xl:max-w-[70vw]" />
    </div>
  );
};

export default VideoJS;
