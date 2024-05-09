/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useState, useContext } from "react";
import { useOrientation } from "react-use";
import Header from "./Header";
import Slider from "./Slider";
import Controls from "./Controls";
import { PresentationContext } from "../../contexts/presentationContext";

function Interface() {
  const ref = useRef(null);
  const [loaded, setIsLoaded] = useState(false);
  const { isMobile } = useContext(PresentationContext);
  const orientation = useOrientation();
  return (
    <div className={`bg-black w-full ${isMobile({iphone: false}) && !orientation.type.includes("portrait") && "relative"}`} ref={ref}>
      <Header />
      <Slider setIsLoaded={setIsLoaded} />
      {loaded && <Controls containerRef={ref} />}
    </div>
  );
}

export default Interface;
