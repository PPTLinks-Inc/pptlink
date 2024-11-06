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
        <SplitButton
          primaryLabel={presentation.live ? "End Live" : "Go Live"}
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
            presentation.live
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
