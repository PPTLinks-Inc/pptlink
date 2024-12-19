/* eslint-disable react/prop-types */
import { BsRecord2 } from "react-icons/bs";
import { useContext, useMemo } from "react";
import { useOrientation } from "react-use";
import { PresentationContext } from "../../contexts/presentationContext";
import ShareAPI from "./Share";
import { LoadingAssetSmall2 } from "../../assets/assets";
import { usepresentationStore } from "./store/presentationStore";
import { useMutation } from "@tanstack/react-query";
import SplitButton from "@/components/ui/split-button";
import { cn } from "@/lib/utils";

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
        <p className={cn("text-white text-lg", presentation?.User !== "HOST" && "absolute left-1/2 transform -translate-x-1/2")}>
          PPTLINKS
        </p>
      )}
      {presentation?.User === "HOST" ? (
        <SplitButton
          primaryLabel={
            presentation.status !== "NOT_LIVE" ? "End Live" : "Go Live"
          }
          options={["Edit", "Delete"]}
          onPrimaryClick={() => togglePresentationLive.mutate()}
          onOptionClick={(option) => console.log(option)}
          icon={
            togglePresentationLive.isPending ? (
              <LoadingAssetSmall2 />
            ) : (
              <BsRecord2 size={32} />
            )
          }
          backgroundColor={
            presentation.status !== "NOT_LIVE"
              ? "bg-rose-500 hover:bg-rose-600"
              : "bg-green-500 hover:bg-green-600"
          }
        />
      ) : (
        <div className="w-[150px] h-[40px]"></div>
      )}
    </header>
  );
}
