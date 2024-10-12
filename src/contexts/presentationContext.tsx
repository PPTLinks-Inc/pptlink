/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */

import {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect
} from "react";
import { useToggle, useOrientation, useLocalStorage } from "react-use";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import rotateImage from "../components/interface/assets/rotate.gif";
import { LoadingAssetBig2 } from "../assets/assets";
import PresentationNotFound from "../components/interface/404";
import { userContext } from "./userContext";
import {
  PresentationContextI,
  presentationData
} from "../components/interface/types";
import { usepresentationStore } from "@/components/interface/store/presentationStore";
import { useRtmStore } from "@/components/interface/store/rtmStore";
import { useAudioStore } from "@/components/interface/store/audioStore";
import { useSlideStore } from "@/components/interface/store/slideStore";

const contextValues = {
  fullScreenShow: false,
  fullScreenToggle: () => {},
  isIphone: false,
  isMobilePhone: false
} as unknown as PresentationContextI;

export const PresentationContext = createContext(contextValues);

function OrientationPrompt({
  setShowPrompt
}: {
  setShowPrompt: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className="bg-black absolute w-screen h-full z-50"
      onClick={() => setShowPrompt(false)}
    >
      <button className="absolute right-5 top-5">
        <IoCloseCircleOutline color="white" size={32} />
      </button>
      <div className="flex flex-col justify-center items-center h-full">
        <img src={rotateImage} alt="Rotate Image" className="w-fit" />
      </div>
    </div>
  );
}

const PresentationContextProvider = (props: { children: any }) => {
  const { user } = useContext(userContext);
  const params = useParams();
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const orientation = useOrientation();
  const [userUid, setUserUid] = useLocalStorage<string>("userUid");
  const [prevUsername] = useLocalStorage<string>("userName");

  const isMobile = useCallback(function ({ iphone = false }) {
    if (iphone) {
      return /iPhone/i.test(navigator.userAgent);
    }
    return /Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const setToken = useRtmStore((state) => state.setToken);
  const setStartPrompt = usepresentationStore(
    (state) => state.setShowStartPrompt
  );
  const setPresentation = usepresentationStore(
    (state) => state.setPresentation
  );
  const initRTM = useRtmStore((state) => state.init);
  const setUserName = useRtmStore((state) => state.setUserName);

  const presentationQuery = useQuery<presentationData>({
    queryKey: ["presentation", params.id],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      setUserName(prevUsername || user?.username || "");
      const { data } = await axios.get<{
        sucess: boolean;
        presentation: presentationData;
      }>(`/api/v1/ppt/presentations/present/${params.id}`, {
        params: { userUid }
      });

      setPresentation(data.presentation);

      setToken({
        rtmToken: data.presentation.rtc.rtmToken,
        rtcUid: data.presentation.rtc.rtcUid,
        rtcToken: data.presentation.rtc.rtcToken || ""
      });

      setUserUid(data.presentation.rtc.rtcUid);

      await initRTM();

      if (data.presentation.audio) {
        setStartPrompt(true);
      }
      return data.presentation;
    }
  });

  const presentation = usepresentationStore((state) => state.presentation);
  useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryKey: ["orientation-prompt"],
    enabled: presentation !== null,
    queryFn: function () {
      if (
        (orientation.type.includes("landscape") && presentation !== null) ||
        !("orientation" in screen)
      ) {
        setShowPrompt(false);
      }
      return true;
    }
  });

  const isIphone = isMobile({ iphone: true });
  const isMobilePhone = isMobile({ iphone: false });

  const users = useRtmStore((state) => state.users);
  useEffect(
    function () {
      if (users) {
        useRtmStore.getState().setSortedUsers();
      }
    },
    [users]
  );

  useEffect(function () {
    window.addEventListener("beforeunload", function (e?: BeforeUnloadEvent) {
      if (!e) {
        useSlideStore.getState().setSwiperRef(null);
        useAudioStore.getState().endAudio({ hostEnd: false });
        useRtmStore.getState().rtm?.logout();
        return; // No need to show confirmation message
      }
      e.preventDefault();
      const confirmationMessage =
        "You are about to leave the presentation. Are you sure?";
      if (window.confirm(confirmationMessage)) {
        useSlideStore.getState().setSwiperRef(null);
        useAudioStore.getState().endAudio({ hostEnd: false });
        useRtmStore.getState().rtm?.logout();
      }
      return confirmationMessage;
    });

    return function () {
      useSlideStore.getState().setSwiperRef(null);
      useAudioStore.getState().endAudio({ hostEnd: false });
      useRtmStore.getState().rtm?.logout();
    };
  }, []);

  return (
    <PresentationContext.Provider
      value={{
        fullScreenShow,
        isIphone,
        isMobilePhone,
        fullScreenToggle
      }}
    >
      {presentationQuery.isLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <LoadingAssetBig2 />
        </div>
      ) : presentationQuery.isError ? (
        <PresentationNotFound />
      ) : (
        <>
          {isMobilePhone && showPrompt && (
            <OrientationPrompt setShowPrompt={setShowPrompt} />
          )}
          {props.children}
        </>
      )}
    </PresentationContext.Provider>
  );
};

export default PresentationContextProvider;
