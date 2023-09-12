import React from 'react';
import logo from './assets/logo.png';
import headerImg from './assets/header-gradient.webp';
import { FaBars } from 'react-icons/fa';


    const [sidebar, setSidebar] = useState(false)

function Header() {
  return (
    <>
      <div className='absolute w-full top-0 left-0 right-0 '>
        <div className='relative h-[550px] overflow-hidden w-full'>
          <picture className='w-[1440px] h-[550px] absolute top-0 left-1/2 -translate-x-1/2 right-0'>
            <img
              src={headerImg}
              alt=''
              className='absolute w-full h-full inset-0'
              draggable='false'
            />
          </picture>
        </div>
      </div>
      <header className='p-4 pl-6 flex justify-between items-center bg-gray-200  relative shadow-md'>
        <div className='mr-4 flex items-center'>
          <button className='border-none p-2 rounded-full transition duration-300 hover:bg-lightGray'>
            <FaBars className='text-gray-400 w-[25px] h-[25px]' />{' '}
          </button>
        </div>
        <form className='flex-1 relative '>
          .
          <input
            type='text'
            className='rounded-lg py-2 px-6 w-3/5 outline-none text-gray-500 bg-lightGray'
            placeholder='Search'
          />
        </form>
      </header>
    </>
  );

} 

export default Header
