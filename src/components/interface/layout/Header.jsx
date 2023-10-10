/* eslint-disable no-unused-vars */
// eslint-disable-next-line react/prop-types

import { useState } from 'react';
import shareIcon from '../layout/assets/shareIcon.svg';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

function Header() {
  const [copy, setCopy] = useState(false);
  const [isLive, setIsLive] = useState(true);

  return (
    <>
      <header className='p-4 pl-6 flex justify-between items-center bg-black relative shadow-[white] z-50 w-full'>
        <div className='flex-1 relative '>
          <p
            className='max-w-full bg-slate-500 hidden left-4 top-6 py-3 px-2 rounded-md md:max-w-sm lg:flex justify-between '
            onClick={() => {
              navigator.clipboard &&
                navigator.clipboard.writeText(window.location.href);
              setCopy(true);
              toast.success('Link Copied successfully');
              setTimeout(() => {
                setCopy(false);
              }, 3000);
            }}
          >
            <span>{window.location.href}</span> <img src={shareIcon} alt='' />
          </p>
        </div>
        <div className='absolute hidden lg:inline-block z-20 top-6 right-6 ml-auto'>
          <Button
            variant='contained'
            title={isLive ? 'End live' : 'Go live'}
            onClick={() => setIsLive((prev) => !prev)}
            className={` min-w-32 !text-slate-200 !rounded-xl space-x-2 ${
              isLive ? '!bg-rose-500' : ' !bg-green-500'
            }`}
          >
            <p>{isLive ? 'End live' : 'Go live'}</p>
            <RadioButtonCheckedIcon className={`!text-3xl !text-slate-200`} />
          </Button>
        </div>
      </header>
    </>
  );
}

export default Header;
