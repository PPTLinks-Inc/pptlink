import { authFetch } from "@/lib/axios";
import { useRef } from "react";
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
    queryKey: [
      "video-media",
      user?.id,
      params.courseId,
      params.contentId
    ],
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
    enabled: !!user
  });
  const playerRef = useRef(null);
  const navigate = useNavigate();

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

  const handlePlayerReady = (player) => {
    playerRef.current = player;

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
