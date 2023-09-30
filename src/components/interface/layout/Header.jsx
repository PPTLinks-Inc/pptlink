// import logo from "./assets/logo.png";
// import headerImg from './assets/header-gradient.webp'
/* eslint-disable no-unused-vars */
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';
// import shareIcon from '../layout/assets/shareIcon.svg'
import { toast } from 'react-toastify';

// eslint-disable-next-line react/prop-types
function Header({ handleSideBar }) {
  const [copy, setCopy] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  // const handleClick = () => {
  //   console.log('hello')
  // }
  return (
    <>
      {/* <div className="absolute w-full top-0 left-0 right-0 ">
    <div className="relative h-[550px] overflow-hidden w-full">
        <picture className="w-[1440px] h-[550px] absolute top-0 left-1/2 -translate-x-1/2 right-0">
        <img src={headerImg} alt="" className="absolute w-full h-full inset-0" draggable='false'/>
        </picture>
    </div>

   </div> */}
      <header className='p-4 pl-6 flex justify-between items-center bg-black relative shadow-[white] z-50 w-full'>
        <div className='mr-4 flex items-center'>
          <button
            className='border-none p-2 rounded-full transition duration-400 hover:bg-blue'
            onClick={() => {
              setSidebar(!sidebar);
              handleSideBar(!sidebar);
            }}
          >
            <FaBars className='text-white w-[35px] h-[35px] lg:w-[25px] lg:h-[25px]' />{' '}
          </button>
        </div>
        <div className='flex-1 relative '>
          <p
            className='max-w-full bg-slate-500 py-3 px-2 rounded-md md:max-w-sm flex justify-between '
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopy(true);
              toast.success('Link Copied successfully');
              setTimeout(() => {
                setCopy(false);
              }, 3000);
            }}
          >
            {' '}
            <span>{window.location.href}</span> <img src={shareIcon} alt='' />
          </p>
        </div>
      </header>
    </>
  );
}

export default Header;

<input
  type='text'
  className='rounded-lg mb-3 py-3 px-6 w-full lg:py-2 lg:w-3/5 outline-none text-gray-500 bg-white'
  placeholder='Search'
/>;
