/* eslint-disable react/prop-types */
import { BsRecord2 } from "react-icons/bs";
import { useContext, useMemo } from "react";
import { useOrientation } from "react-use";
import { PresentationContext } from "../../contexts/presentationContext";
import ShareAPI from "./Share";

export default function Header({actionsActive}) {
  const { fullScreenShow, isMobile } = useContext(PresentationContext);
  const orientation = useOrientation();

  const style = useMemo(function() {
    if ((isMobile({ iphone: false }) && orientation.type.includes("landscape") || fullScreenShow)) {
      return `absolute bg-transparent top-0 left-0 right-0 ${!actionsActive && "hidden"}`;
    }

    return "";
  }, [isMobile, orientation, fullScreenShow, actionsActive]);

  return (
    <header
      className={`bg-black w-full flex justify-between items-center sm:px-10 z-10 ${style}`}
    >
      <ShareAPI />
      { ((orientation.type.includes("portrait") && isMobile({isphone: false})) || !isMobile({isphone: false}) && !fullScreenShow) && <p className="text-white text-lg">PPTLINKS</p>}
      <button className="bg-green-500 w-[150px] h-[40px] !text-slate-200 !rounded-xl space-x-2 flex items-center justify-center gap-1">
        Go Live
        <BsRecord2 size={36} />
      </button>
    </header>
  );
}
