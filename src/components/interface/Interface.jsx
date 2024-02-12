/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import "./interface.css";
import { useState, useContext, useRef, useEffect } from "react";
import Header from "./layout/Header";
import { Carousel } from "./layout/Carousel";
import { LoadingAssetBig2 } from "../../assets/assets";
import { isIOS } from "react-device-detect";

import { Spinner, SpinnerIos } from "./layout/assets/spinner/Spinner";
import PresentationNotFound from "./404";
import { PresentationContext } from "../../contexts/presentationContext";

let mobileHeader;

if (window.innerWidth < 900) {
  mobileHeader = false;
} else {
  mobileHeader = true;
}

function Interface() {
  const { presentation, presentationQuery, setInterfaceRef } =
    useContext(PresentationContext);

  const interfaceRef = useRef();

  useEffect(() => {
    setInterfaceRef(interfaceRef);
  }, []);

  return !presentationQuery.isError ? (
    <main
      className={`overflow-hidden min-h-screen  relative duration-300 transition-all bg-black md:overflow-auto `}
    >
      {mobileHeader && presentationQuery.isSuccess && <Header />}
      {/* navigation */}
      {/* body */}
      <section
        className={`main-body w-full ${
          mobileHeader && "px-0"
        }  rounded-2xl relative  transition-all duration-500 bg-white`}
      >
        {presentationQuery.isSuccess ? (
          <div ref={interfaceRef} className=" h-fit min-h-[100%]">
            {presentation.live || presentation.User === "HOST" ? (
              <Carousel />
            ) : !isIOS ? (
              <Spinner />
            ) : (
              <SpinnerIos />
            )}
          </div>
        ) : (
          <div className="w-full h-[85vh] flex justify-center bg-black items-center">
            <LoadingAssetBig2 />
          </div>
        )}
      </section>
    </main>
  ) : (
    <PresentationNotFound />
  );
}

export default Interface;
