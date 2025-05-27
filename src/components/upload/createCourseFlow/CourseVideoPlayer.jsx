import { authFetch } from "@/lib/axios";
import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoJS from "@/components/VideoJS/player";
import { FaArrowLeft } from "react-icons/fa6";
import { useSuspenseQuery } from "@tanstack/react-query";
import useUser from "../../../hooks/useUser";

export default function CourseVideoPlayer() {
  const params = useParams();
  const { userQuery } = useUser();
  const user = userQuery.data;

  const { data } = useSuspenseQuery({
    queryKey: ["video-media", user?.id, params.courseId, params.contentId],
    queryFn: async function () {
      const { data } = await authFetch.get(
        `/api/v1/course/media/video/${params.courseId}/${params.contentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      return data;
    },
    enabled: !!user,
    staleTime: 0,
    gcTime: 0
  });

  const playerRef = useRef(null);
  const watchedChunks = useRef(new Set());
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    preload: "auto",
    width: "640",
    height: "360",
    sources: [
      {
        src: data.videoMedia.master_playlist
      }
    ]
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // resume playback from the last position if available
    player.currentTime(data.lastPosition ?? 0);

    player.on("timeupdate", function () {
      const currentTime = player.currentTime();
      const chunkIndex = Math.floor(currentTime / 10); // 10 seconds per chunk
      watchedChunks.current.add(chunkIndex);
    });

    intervalRef.current = setInterval(async function () {
      const watchedBlocks = Array.from(watchedChunks.current);
      const currentTime = player.currentTime();

      if (data.access !== "PURCHASED") {
        clearInterval(intervalRef.current);
        return;
      }

      // check if not playing
      if (player.paused()) {
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        await authFetch.patch(
          `/api/v1/course/media/video-analytics/${params.courseId}/${params.contentId}`,
          {
            watchedBlocks,
            lastPosition: currentTime
          },
          {
            signal: abortControllerRef.current.signal
          }
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error updating video analytics:", error);
        }
      }
    }, 15000);

    player.on("ended", async () => {
      const watchedBlocks = Array.from(watchedChunks.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        await authFetch.patch(
          `/api/v1/course/media/video-analytics/${params.courseId}/${params.contentId}`,
          {
            watchedBlocks,
            lastPosition: 0
          },
          {
            signal: abortControllerRef.current.signal
          }
        );
      } catch (error) {
        console.log("Error updating video analytics on end:", error);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    });

    player.on("dispose", () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    });

    // You can handle player events here, for example:
    // player.on("waiting", () => {
    //   videojs.log("player is waiting");
    // });

    // player.on("dispose", () => {
    //   videojs.log("player will dispose");
    // });
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="fixed md:static w-full p-4 bg-gray-800 text-white flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="hover:text-gray-300">
          <FaArrowLeft size={20} />
        </button>
        <p className="md:w-full w-10/12 truncate">{data.name}</p>
      </header>

      <div className="flex-1 w-full">
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </div>
  );
}
