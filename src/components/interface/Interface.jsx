import './interface.css';
import { FaUser, FaHome, FaAndroid } from 'react-icons/fa';
import { useState } from 'react';
import Header from './layout/Header';
import { Carousel } from './layout/Carousel';
import axios from 'axios';
import { userContext } from '../../contexts/userContext';

function Interface() {
  // script to authenticate and determine if the person is a user
  // const [user, setUser] = userContext();

  // useEffect(() => {
  //   axios
  //     .get('auth', { withCredentials: true })
  //     .then(({ user }) => {
  //       setUser(user);
  //     })
  //     .catch((err) => setUser(null));
  // }, [user]);

  const [sidebar, setSidebar] = useState(false);

  const handleSideBar = (item) => {
    setSidebar(item);
  };

  const handleMouseEnter = (e) => {
    e.target.classList.add('hovered');
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove('hovered');
  };

  return (
    <main className=' min-h-screen overflow-hidden  relative bg-[#04247D]'>
      <Header handleSideBar={handleSideBar} />
      {/* navigation */}
      <div
        className={`${
          sidebar ? 'w-60' : 'w-20'
        }  bg-[#04247D] left-0  h-full fixed transition-all duration-500 overflow-hidden ${
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
              className='nav-side flex items-center gap-4 p-4  rounded-l-full relative text-white font-semibold hover:bg-white hover:text-blue '
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
            <a
              href='/'
              className='nav-side flex items-center gap-4 p-4  rounded-l-full relative text-white font-semibold hover:bg-white hover:text-blue'
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
            </a>
          </li>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='nav-side flex items-center  p-4 gap-4 rounded-l-full relative text-white font-semibold hover:bg-white hover:text-blue '
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
        } w-full  px-2  rounded-2xl  transition-all duration-500 bg-white`}
      >
        <div className='overflow-y-scroll h-fit max-h-[85vh] p-8'>
          <Carousel />
        </div>
      </section>
      {/* <div className="absolute right-0 w-2 bg-[#04247D] ">
        
       </div> */}
    </main>
  );
}

export default Interface;
