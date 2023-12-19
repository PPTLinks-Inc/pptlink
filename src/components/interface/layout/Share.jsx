import { toast } from "react-toastify";
import CopyOutline from "@mui/icons-material/CopyAllOutlined";
import ShareIconOutline from "@mui/icons-material/ShareOutlined";
import Copy from "@mui/icons-material/CopyAll";
import ShareIcon from "@mui/icons-material/Share";

// eslint-disable-next-line react/prop-types
function ShareAPI({ outline }) {
  const shareAvailable = navigator?.share ? true : false;

  const shareData = {
    title: "PPTLinks",
    text: "Join the presentation",
    url: window.location.href,
  };
  function shareLink() {
    navigator
      .share(shareData)
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  }

  function copyLink() {
    navigator.clipboard && navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied successfully");
  }

  return (
    <p
      className={
        !outline
          ? "p-10 max-w-full bg-slate-500 hidden left-4 top-6 py-3 px-2 rounded-md md:w-fit lg:flex justify-between"
          : "p-10 max-w-full bg-black/60 text-white absolute z-[10] left-4 top-6 lg:hidden py-3 px-2 rounded-md md:max-w-sm flex justify-between"
      }
    >
      {!shareAvailable && <span>{window.location.href}</span>}
      {!outline ? (
        <>
          {shareAvailable ? (
            <ShareIcon
              className="cursor-pointer"
              onClick={() => {
                shareLink();
              }}
            />
          ) : (
            <Copy
              className="cursor-pointer"
              onClick={() => {
                copyLink();
              }}
            />
          )}
        </>
      ) : (
        <>
          {shareAvailable ? (
            <ShareIconOutline
              className="cursor-pointer"
              sx={{fontSize: 40}}
              onClick={() => {
                shareLink();
              }}
            />
          ) : (
            <CopyOutline
              className="cursor-pointer"
              onClick={() => {
                copyLink();
              }}
            />
          )}
        </>
      )}
    </p>
  );
}

export default ShareAPI;
