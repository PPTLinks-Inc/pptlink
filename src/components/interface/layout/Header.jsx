/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useContext } from 'react';
import { Button } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { LoadingAssetSmall2 } from '../../../assets/assets';
import { PresentationContext } from '../../../contexts/presentationContext';
import ShareAPI from './Share';

function Header() {
  const { presentation, makeLive, livePending } =
    useContext(PresentationContext);

  const shareData = {
    title: 'PPTLinks',
    text: 'Join the presentation',
    url: window.location.href,
  };
  function share() {
    navigator
      .share(shareData)
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }
  return (
    <>
      <header className='p-4 pl-6 flex justify-between items-center bg-black relative shadow-[white] z-50 w-full'>
        {presentation?.User === 'HOST' ? (
          <div className='flex-1 relative '>
            <ShareAPI outline={false} />
          </div>
        ) : (
          <h1 className='text-3xl text-white text-center flex-1 font-bold '>
            PPTLinks
          </h1>
        )}
        {presentation && presentation?.User === 'HOST' && (
          <div className='absolute hidden lg:inline-block z-20 top-6 right-6 ml-auto'>
            <Button
              variant='contained'
              title={presentation.live ? 'End live' : 'Go live'}
              onClick={makeLive}
              className={`w-[140px] h-[40px] !text-slate-200 !rounded-xl space-x-2  ${
                presentation.live ? '!bg-rose-500' : ' !bg-green-500'
              }`}
            >
              {livePending ? (
                <LoadingAssetSmall2 />
              ) : (
                <>
                  <p>{presentation.live ? 'End live' : 'Go live'}</p>
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
