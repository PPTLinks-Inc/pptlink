import { toast } from "react-toastify";
import { CiShare2 } from "react-icons/ci";
import { FaRegCopy } from "react-icons/fa6";

// eslint-disable-next-line react/prop-types
function ShareAPI() {
  const shareAvailable = navigator?.share ? true : false;

  const shareData = {
    title: "PPTLinks",
    text: "Join the presentation",
    url: window.location.href
  };
  function shareLink() {
    navigator
      .share(shareData)
      .catch(() => toast.error("Error sharing the link"));
  }

  function copyLink() {
    navigator.clipboard && navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied successfully");
  }

  return (
    <div className="flex justify-between items-center p-2">
      <p className="text-lg bg-slate-400 text-black p-2 flex items-center rounded-md gap-1">
        {shareAvailable ? (
          <button
            onClick={shareLink}
            className="bg-blue-500 text-black p-2 rounded-md"
          >
            <CiShare2 />
          </button>
        ) : (
          <button
            onClick={copyLink}
            className="bg-blue-500 text-black p-2 rounded-md"
          >
            <FaRegCopy />
          </button>
        )}
      </p>
    </div>
  );
}

export default ShareAPI;
