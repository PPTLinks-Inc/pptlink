import { authFetch } from "@/lib/axios";
import { useRef } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import VideoJS from "@/components/VideoJS/player";
import { FaArrowLeft } from "react-icons/fa6";

export async function VideoPlayerLoader({ params }) {
  const { data } = await authFetch.get(
    `/api/v1/course/media/${params.courseId}/${params.sectionId}/${params.contentId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );

  return data;
}

export default function CourseVideoPlayer() {
  const data = useLoaderData();
  const playerRef = useRef(null);
  const navigate = useNavigate();

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
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
        <button 
          onClick={() => navigate(-1)} 
          className="hover:text-gray-300"
        >
          <FaArrowLeft size={20} />
        </button>
        <p>{data.name}</p>
      </header>

      <div className="flex-1 w-full">
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </div>
  );
}
