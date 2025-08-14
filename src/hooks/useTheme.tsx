// hooks/useTheme.js
import { useContext } from "react";
import { UtilityProvider } from "../contexts/utilityContext";

export const useTheme = () => {
  const { darkTheme } = useContext(UtilityProvider);

  return {
    bg: darkTheme ? "bg-primaryTwo" : "bg-primaryThree",
    reverseBg: darkTheme ? "bg-primaryThree" : "bg-primaryTwo",
    text: darkTheme ? "text-primaryThree" : "text-primaryTwo",
    reverseText: darkTheme ? "text-primaryTwo" : "text-primaryThree",
    border: darkTheme ? "border-primaryThree" : "border-primaryTwo",
    backDropFilter: darkTheme ? "bg-primaryFive" : "bg-primarySix",
    lighterSwitch: darkTheme ? "bg-primarySeven" : "bg-primarySix",
    isDark: darkTheme
  };
};
