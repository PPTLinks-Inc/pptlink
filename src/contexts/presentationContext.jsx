/* eslint-disable react/prop-types */

import { createContext, useCallback, useEffect, useState } from "react";
import { useToggle, useOrientation } from "react-use";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import rotateImage from "../components/interface/assets/rotate.gif";
import { Spinner, SpinnerIos } from "../components/interface/spinner/Spinner";
import { LoadingAssetBig2 } from "../assets/assets";
import PresentationNotFound from "../components/interface/404";

export const PresentationContext = createContext();

function OrientationPrompt({ setShowPrompt }) {
  return (
    <div className="bg-black absolute w-screen h-full z-50">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute right-5 top-5"
      >
        <IoCloseCircleOutline color="white" size={32} />
      </button>
      <div className="flex flex-col justify-center items-center h-full">
        <img src={rotateImage} alt="Rotate Image" className="w-fit" />
      </div>
    </div>
  );
}

const PresentationContextProvider = (props) => {
  const params = useParams();
  const [start, setStart] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const [joinAudio, setJoinAudio] = useState(false);
  const orientation = useOrientation();
  const isMobile = useCallback(function ({ iphone = false }) {
    if (iphone) {
      return /iPhone/i.test(navigator.userAgent);
    }
    return /Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const queryClient = useQueryClient();
  const presentationQuery = useQuery({
    queryKey: ["presentation", params.id],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      // const userUid = localStorage.getItem("userUid");
      const res = await axios.get(
        `/api/v1/ppt/presentations/present/${params.id}`
      );

      // if (!userUid) {
      //   localStorage.setItem("userUid", res.data.presentation.rtcUid);
      // }
      return res.data.presentation;
    }
  });

  useQuery({
    queryKey: ["orientation"],
    queryFn: function () {
      setStart(true);
      return true;
    }
  });

  useEffect(() => {
    if (
      orientation.type.includes("landscape") &&
      start &&
      presentationQuery.data?.live
    ) {
      setShowPrompt(false);
    }
  }, [start, orientation, presentationQuery.data?.live]);

  const makeLive = useMutation({
    mutationFn: async function () {
      await axios.put(
        `/api/v1/ppt/presentations/make-live/${presentationQuery.data.id}`,
        {
          data: !presentationQuery.data.live
        }
      );
      queryClient.setQueryData(["presentation", params.id], (prev) => ({
        ...prev,
        live: !prev.live
      }));
    }
  });

  return (
    <PresentationContext.Provider
      value={{
        fullScreenShow,
        fullScreenToggle,
        isMobile,
        presentation: presentationQuery,
        makeLive,
        joinAudio
      }}
    >
      {/* {isMobile({ isphone: false }) &&
        showPrompt &&
        presentationQuery.data?.live && (
          <OrientationPrompt setShowPrompt={setShowPrompt} />
        )}
      {isMobile({ isphone: true }) && !presentationQuery.data?.live && presentationQuery.data?.User !== "HOST" ? (
        <SpinnerIos />
      ) : (
        !presentationQuery.data?.live && presentationQuery.data?.User !== "HOST" && <Spinner />
      )}
      {(presentationQuery.data?.live || presentationQuery.data?.User === "HOST") && props.children} */}

      {presentationQuery.isLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <LoadingAssetBig2 />
        </div>
      ) : presentationQuery.isError ? (
        <PresentationNotFound />
      ) : (
        <>
          {isMobile({ isphone: false }) &&
            showPrompt &&
            presentationQuery.data.live && (
              <OrientationPrompt setShowPrompt={setShowPrompt} />
            )}
          {(!presentationQuery.data.live &&
          presentationQuery.data.User !== "HOST") ? (
            isMobile({ isphone: true }) ? (
              <SpinnerIos />
            ) : (
              <Spinner />
            )
          ) : (
            <>{props.children}</>
          )}
        </>
      )}
    </PresentationContext.Provider>
  );
};

export default PresentationContextProvider;
