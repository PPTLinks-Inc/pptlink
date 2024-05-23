/* eslint-disable react/prop-types */

import { createContext, useCallback, useEffect, useState } from "react";
import { useToggle, useOrientation } from "react-use";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

export const PresentationContext = createContext();

function OrientationPrompt({ setShowPrompt }) {
  return (
    <div className="bg-black absolute w-screen h-screen z-50">
      <button onClick={() => setShowPrompt(false)} className="absolute right-5 top-5">
        <IoCloseCircleOutline
          color="white"
          size={32}
        />
      </button>
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-white text-2xl text-center">
          Please rotate your device
        </p>
      </div>
    </div>
  );
}

const PresentationContextProvider = (props) => {
  const [start, setStart] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const orientation = useOrientation();
  const isMobile = useCallback(function ({ iphone = false }) {
    if (iphone) {
      return /iPhone/i.test(navigator.userAgent);
    }
    return /Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const data = useQuery({
    queryKey: ["orientation"],
    queryFn: function() {
      setStart(true);
      return true;
    }
  })

  useEffect(() => {
    if (orientation.type.includes("landscape") && start) {
      setShowPrompt(false);
    }
  }, [start, orientation]);

  return (
    <PresentationContext.Provider
      value={{ fullScreenShow, fullScreenToggle, isMobile }}
    >
      {isMobile({ isphone: false }) && showPrompt && (
        <OrientationPrompt setShowPrompt={setShowPrompt} />
      )}
      {props.children}
    </PresentationContext.Provider>
  );
};

export default PresentationContextProvider;
