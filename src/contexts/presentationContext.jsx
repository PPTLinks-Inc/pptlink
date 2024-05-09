/* eslint-disable react/prop-types */

import { createContext, useCallback } from "react";
import { useToggle } from "react-use";

export const PresentationContext = createContext();

const PresentationContextProvider = (props) => {
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const isMobile = useCallback(function ({ iphone = false }) {
    if (iphone) {
      return /iPhone/i.test(navigator.userAgent);
    }
    return /Android|iPhone/i.test(navigator.userAgent);
  }, []);
  return (
    <PresentationContext.Provider
      value={{ fullScreenShow, fullScreenToggle, isMobile }}
    >
      {props.children}
    </PresentationContext.Provider>
  );
};

export default PresentationContextProvider;
