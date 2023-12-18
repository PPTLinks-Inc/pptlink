/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useContext } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import Copy from "@mui/icons-material/CopyAll";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { LoadingAssetSmall2 } from "../../../assets/assets";
import { PresentationContext } from "../../../contexts/presentationContext";

function Header() {
  const { presentation, makeLive, livePending } =
    useContext(PresentationContext);
  return (
    <>
      {/* <div className="absolute w-full top-0 left-0 right-0 ">
    <div className="relative h-[550px] overflow-hidden w-full">
        <picture className="w-[1440px] h-[550px] absolute top-0 left-1/2 -translate-x-1/2 right-0">
        <img src={headerImg} alt="" className="absolute w-full h-full inset-0" draggable='false'/>
        </picture>
    </div>

   </div> */}

      <header className="p-4 pl-6 flex justify-between items-center bg-black relative shadow-[white] z-50 w-full">
        {presentation?.User === "HOST" ? (
          <div className="flex-1 relative ">
            <p
              className="max-w-full bg-slate-500 hidden left-4 top-6 py-3 px-2 rounded-md md:max-w-sm lg:flex justify-between "
              onClick={() => {
                navigator.clipboard &&
                  navigator.clipboard.writeText(window.location.href);
                toast.success("Link Copied successfully");
              }}
            >
              <span>{window.location.href}</span> <Copy />
            </p>
          </div>
        ) : (
          <h1 className="text-3xl text-white text-center flex-1 font-bold ">
            PPTLinks
          </h1>
        )}
        {presentation && presentation?.User === "HOST" && (
          <div className="absolute hidden lg:inline-block z-20 top-6 right-6 ml-auto">
            <Button
              variant="contained"
              title={presentation.live ? "End live" : "Go live"}
              onClick={makeLive}
              className={`w-[140px] h-[40px] !text-slate-200 !rounded-xl space-x-2  ${
                presentation.live ? "!bg-rose-500" : " !bg-green-500"
              }`}
            >
              {livePending ? (
                <LoadingAssetSmall2 />
              ) : (
                <>
                  <p>{presentation.live ? "End live" : "Go live"}</p>
                  <RadioButtonCheckedIcon
                    className={`!text-3xl !text-slate-200`}
                  />
                </>
              )}
            </Button>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
