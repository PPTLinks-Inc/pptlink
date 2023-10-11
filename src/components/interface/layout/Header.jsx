/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line react/prop-types */
import { useState } from 'react';
import shareIcon from '../layout/assets/shareIcon.svg';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

// eslint-disable-next-line react/prop-types
function Header({ presentation, makeLive }) {
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
        {presentation?.User === "HOST" ? <div className="flex-1 relative ">
          <p
            className='max-w-full bg-slate-500 hidden left-4 top-6 py-3 px-2 rounded-md md:max-w-sm lg:flex justify-between '
            onClick={() => {
              navigator.clipboard &&
                navigator.clipboard.writeText(window.location.href);
              toast.success('Link Copied successfully');
            }}
          >
            <span>{window.location.href}</span> <img src={shareIcon} alt='' />
          </p>
        </div> : (<h1 className="text-3xl text-white text-center flex-1 font-bold ">PPTLink</h1>)}
        {presentation && presentation?.User === "HOST" && (
          <div className="absolute hidden lg:inline-block z-20 top-6 right-6 ml-auto">
            <Button
              variant="contained"
              title={presentation.live ? "End live" : "Go live"}
              onClick={makeLive}
              className={` m-w-32 !text-slate-200 !rounded-xl space-x-2 ${
                presentation.live ? "!bg-rose-500" : " !bg-green-500"
              }`}
            >
              <p>{presentation.live ? "End live" : "Go live"}</p>
              <RadioButtonCheckedIcon className={`!text-3xl !text-slate-200`} />
            </Button>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
