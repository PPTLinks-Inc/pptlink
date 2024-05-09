import React, { useContext } from "react";
import { useFullscreen } from "react-use";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { PresentationContext } from "../../contexts/presentationContext";

export default function Controls({ containerRef }) {
  const { fullScreenToggle, fullScreenShow } = useContext(PresentationContext);
  const isFullscreen = useFullscreen(containerRef, fullScreenShow, {
    onClose: () => fullScreenToggle(false)
  });

  return (
    <div className="w-4/5 mx-auto absolute z-10 bottom-0 right-0 left-0 h-20 flex justify-right items-center justify-end">
      {document.fullscreenEnabled && (
        <button
          onClick={() => fullScreenToggle()}
          className="bg-black absolute rounded-full p-2"
        >
          {isFullscreen ? (
            <RxExitFullScreen color="white" size={32} />
          ) : (
            <RxEnterFullScreen color="white" size={32} />
          )}
        </button>
      )}
    </div>
  );
}
