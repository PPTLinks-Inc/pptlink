/* eslint-disable react/prop-types */
import { BsRecord2 } from "react-icons/bs";
import { useContext, useMemo } from "react";
import { useOrientation } from "react-use";
import { PresentationContext } from "../../contexts/presentationContext";
import ShareAPI from "./Share";
import { LoadingAssetSmall2 } from "../../assets/assets";
import { usepresentationStore } from "./store/presentationStore";
import { useMutation } from "@tanstack/react-query";

export default function Header({ actionsActive }: { actionsActive: boolean }) {
  const { fullScreenShow, isMobilePhone } = useContext(PresentationContext);
  const orientation = useOrientation();

  const presentation = usepresentationStore((state) => state.presentation);
  const makeLive = usepresentationStore((state) => state.makeLive);

  const style = useMemo(
    function () {
      if (
        (isMobilePhone && orientation.type.includes("landscape")) ||
        fullScreenShow
      ) {
        return `absolute bg-transparent top-0 left-0 right-0 ${!actionsActive && "hidden"}`;
      }

      return "";
    },
    [isMobilePhone, orientation, fullScreenShow, actionsActive]
  );

  const togglePresentationLive = useMutation({
    mutationFn: makeLive
  });

  return (
    <header
      className={`bg-black w-full flex justify-between items-center sm:px-10 z-10 ${style}`}
    >
      <ShareAPI />
      {((orientation.type.includes("portrait") && isMobilePhone) ||
        (!isMobilePhone && !fullScreenShow)) && (
        <p className="text-white text-lg">PPTLINKS</p>
      )}
      {presentation?.User === "HOST" ? (
        <button
          onClick={() => togglePresentationLive.mutate()}
          disabled={togglePresentationLive.isPending}
          className={`${presentation.live ? "bg-rose-500" : "bg-green-500"} w-[150px] h-[40px] !text-slate-200 !rounded-xl space-x-2 flex items-center justify-center gap-1`}
        >
          {togglePresentationLive.isPending ? (
            <LoadingAssetSmall2 />
          ) : (
            <>
              {presentation.live ? "End Live" : "Go Live"}
              <BsRecord2 size={36} />
            </>
          )}
        </button>
      ) : (
        <div className="w-[150px] h-[40px]"></div>
      )}
    </header>
  );
}
