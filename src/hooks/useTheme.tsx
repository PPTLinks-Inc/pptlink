// hooks/useTheme.js
import { useContext } from "react";
import { UtilityProvider } from "../contexts/utilityContext";

export const useTheme = () => {
  const { darkTheme, dropdown } = useContext(UtilityProvider);

  return {
    bg: (darkTheme && !dropdown) ? "bg-primaryTwo" : "bg-primaryThree",
    reverseBg: darkTheme ? "bg-primaryThree" : "bg-primaryTwo",
    text: darkTheme && !dropdown ? "text-primaryThree" : "text-primaryTwo",
    reverseText: darkTheme ? "text-primaryTwo" : "text-primaryThree",
    border: darkTheme && !dropdown ? "border-primaryThree" : "border-primaryTwo",
    reverseBorder: darkTheme ? "border-primaryTwo" : "border-primaryThree",
    backDropFilter: darkTheme ? "bg-primaryFive" : "bg-primarySix",
    lighterSwitch: darkTheme ? "bg-primarySeven" : "bg-primarySix",
    isDark: darkTheme
  };
};
