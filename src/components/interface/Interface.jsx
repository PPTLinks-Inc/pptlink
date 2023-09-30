/* eslint-disable no-unused-vars */

import './interface.css';
import { FaUser, FaHome, FaAndroid } from 'react-icons/fa';
import { useState } from 'react';
import Header from './layout/Header';
import { Carousel } from './layout/Carousel';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from './layout/assets/spinner/Spinner';


function Interface() {
  const [sidebar, setSidebar] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleSideBar = (item) => {
    setSidebar(item);
  };

  const handleMouseEnter = (e) => {
    e.target.classList.add('hovered');
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove('hovered');
  };

  if(loading){
   return <Spinner/>
  }
  return (
    <main className={` min-h-screen overflow-hidden relative duration-300 transition-all bg-black ${sidebar && 'bg-white'}`}>
      <Header handleSideBar={handleSideBar} />
      {/* navigation */}
      <div
        className={`${
          sidebar ? 'md:w-60 ' : 'w-20'
        }  bg-black left-0  h-full fixed transition-all duration-500 overflow-hidden ${
          sidebar ? '' : 'active'
        }`}
      >
        <ul className='nav-item pl-6 py-8 w-full absolute top-0 left-0'>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='nav-side flex items-center gap-4 p-4  rounded-l-full relative text-white font-semibold hover:bg-white hover:text-black '
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaUser className='text-2xl relative z-10' />
              </span>
              <span
                className={`${
                  sidebar ? 'opacity-100' : 'opacity-0 '
                } transition-all duration-500 whitespace-nowrap`}
              >
                {' '}
                Brand Name
              </span>
            </a>
          </li>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to='/'
              className='nav-side flex items-center gap-4 p-4  rounded-l-full relative text-white font-semibold hover:bg-white hover:text-black'
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaHome className='text-2xl relative z-10' />
              </span>
              <span
                className={`${
                  sidebar ? 'opacity-100' : 'opacity-0 '
                } transition-all duration-500 whitespace-nowrap`}
              >
                {' '}
                Home
              </span>
            </Link>
          </li>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='nav-side flex items-center  p-4 gap-4 rounded-l-full relative text-white font-semibold hover:bg-white hover:text-black '
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaAndroid className='text-2xl relative z-10' />
              </span>
              <span
                className={`${
                  sidebar ? 'opacity-100' : 'opacity-0 '
                } transition-all duration-500 whitespace-nowrap`}
              >
                {' '}
                Adroid
              </span>
            </a>
          </li>
        </ul>
      </div>
      {/* body */}
      <section
        className={`main-body ${
          sidebar ? '' : 'active'
        } w-full  px-2  rounded-2xl relative  transition-all duration-500 bg-white`}
      >
        <div className=' h-fit max-h-[100vh] px-8'>
          <Carousel />
        </div>
      </section>
      
    </main>
  );
}

export default Interface;
