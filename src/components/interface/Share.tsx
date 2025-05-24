import { toast } from "@/hooks/use-toast";
import { CiShare2 } from "react-icons/ci";
import { FaRegCopy } from "react-icons/fa6";
interface ShareAPIProps {
  addClass?: string;
  fitSize?: boolean;
}

// eslint-disable-next-line react/prop-types
function ShareAPI({ addClass, fitSize = false }: ShareAPIProps) {
  const shareAvailable = navigator?.share ? true : false;

  const shareData = {
    title: "PPTLinks",
    text: "Join the presentation",
    url: window.location.href
  };
  function shareLink() {
    navigator.share(shareData).catch(() => {
      /*  */
    });
  }

  function copyLink() {
    navigator.clipboard && navigator.clipboard.writeText(window.location.href);
    toast({
      description: "Link Copied successfully"
    });
  }

  return (
    <div
      className={`flex justify-between items-center ${!fitSize ? "p-2" : "h-full w-fit"} ${addClass}`}
    >
      <p
        className={`text-lg bg-slate-400 text-primaryTwo ${!fitSize ? "p-2" : " w-16"} flex items-center justify-center h-full rounded-md gap-1`}
      >
        {shareAvailable ? (
          <button
            onClick={shareLink}
            className={`bg-blue-500 text-primaryTwo ${!fitSize && "p-2"} rounded-md`}
          >
            <CiShare2 />
          </button>
        ) : (
          <button
            onClick={copyLink}
            className={`bg-blue-500 text-primaryTwo ${!fitSize && "p-2"} rounded-md`}
          >
            <FaRegCopy />
          </button>
        )}
      </p>
    </div>
  );
}

export default ShareAPI;
