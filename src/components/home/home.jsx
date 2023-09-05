import { FaBars } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { BsInstagram } from 'react-icons/bs';
import {
  AiFillFacebook,
  AiFillGithub,
  AiOutlineLinkedin,
} from 'react-icons/ai';
import { FiTwitter } from 'react-icons/fi';
import { TbWorldWww } from 'react-icons/tb';
import { useState } from 'react';
import Ellipse from './../../images/Ellipse.png';
import loading from './../../images/loading.png';

const Home = () => {
  const [page, setPage] = useState({
    dropdown: false,
  });

  const handleDropdown = () => {
    setPage({ ...page, dropdown: !page.dropdown });
  };

  return (
    <div className='w-full h-screen bg-slate-200 relative flex flex-col'>
      <div className='h-[10rem]'>
        {page.dropdown && (
          <div className='h-[10rem] flex justify-between items-center px-[2.5rem] border'>
            <div>
              <p className='text-xl tracking-widest font-bold cursor-pointer'>
                PPTLink.
              </p>
            </div>

            <div className='w-[10rem] flex justify-between items-center'>
              <button className='px-7 rounded-xl py-1 bg-black text-slate-200'>
                Present
              </button>
              <button
                className='border-none p-2 rounded-full transition duration-300 hover:bg-slate-100'
                onClick={handleDropdown}
              >
                <MdClose className='text-black w-[25px] h-[25px]' />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className='flex-1 border flex flex-wrap flex-row'>
        <div className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
          Home
        </div>
        <div className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
          About
        </div>
        <div className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
          Help
        </div>
        <div className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
          I too bad
        </div>
      </div>

      <div className='h-[7.5rem] border border-collapse flex'>
        <div className='px-14 border flex-1'>
          <h2 className='text-xl mb-6'>Our location</h2>

          <p>
            You can find us at Anguwan Cashew, Off dass road, opposite Elim
            church, 740102, Yelwa, Bauchi Nigeria
          </p>
        </div>
        <div className='px-14 border flex-1'>
          <div className='text-xl mb-6'>External</div>

          <div className='flex flex-row justify-between w-[230px]'>
            <TbWorldWww className='text-black text-2xl cursor-pointer' />

            <BsInstagram className='text-black text-2xl cursor-pointer' />

            <AiFillFacebook className='text-black text-2xl cursor-pointer' />

            <FiTwitter className='text-black text-2xl cursor-pointer' />

            <AiFillGithub className='text-black text-2xl cursor-pointer' />

            <AiOutlineLinkedin className='text-black text-2xl cursor-pointer' />
          </div>
        </div>
      </div>

      <div
        className={`min-h-screen bg-black min-w-full absolute top-[5px] rounded-t-[2.7rem] overflow-x-hidden-hidden text-slate-200 px-[2.5rem] ${
          page.dropdown
            ? 'transition-transform translate-y-[100vh] ease-in-out duration-500'
            : 'transition-transform translate-y-0 ease-in-out duration-300'
        }`}
      >
        <div className='h-[10rem]'>
          {!page.dropdown && (
            <div className='h-[10rem] flex justify-between items-center'>
              <div>
                <p className='text-xl tracking-widest font-bold cursor-pointer'>
                  PPTLink.
                </p>
              </div>

              <div className='w-[10rem] flex justify-between items-center'>
                <button className='px-7 rounded-xl py-1 bg-slate-200 text-black'>
                  Present
                </button>
                <button
                  className='border-none p-2 rounded-full transition duration-300 hover:bg-lightGray'
                  onClick={handleDropdown}
                >
                  <FaBars className='text-slate-200 w-[25px] h-[25px]' />
                </button>
              </div>
            </div>
          )}
        </div>

        <section className='h-full w-full flex px-[10%] py-[6%] relative'>
          <img
            src={Ellipse}
            alt='Ellipse'
            className='z-20 w-6 absolute left-24 top-56'
          />

          <img
            src={Ellipse}
            alt='Ellipse'
            className='z-20 w-6 absolute right-36 top-36'
          />

          <img
            src={Ellipse}
            alt='Ellipse'
            className='z-20 w-6 absolute left-65 bottom-24'
          />

          <img
            src={Ellipse}
            alt='Ellipse'
            className='z-20 w-6 absolute right-40 bottom-40'
          />

          <div className='flex-1'>
            <img src={loading} alt='loading' className='w-9/12' />
          </div>

          <div className='flex-1 pt-7'>
            <div className='absolute'>
              <h1 className='text-2xl leading-normal py-6'>
                Make your presentation, <br />
                and as you move from page <br />
                to page, so does your{' '}
                <span className='underline decoration-slate-200'>Audience</span>
              </h1>

              <form className='flex w-[305px] justify-between'>
                <input
                  type='text'
                  placeholder='Input presentation link'
                  className='border border-slate-200 px-[15px] py-[12px] text-black decoration-black rounded-xl bg-slate-200'
                />
                <button
                  type='submit'
                  className='px-7 rounded-xl py-[12px] bg-slate-200 text-black'
                >
                  Find
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className='w-full h-[80vh] flex flex-col'>
          <div className='grow-[.7]'></div>
          <div className='grow-[.3] border-t border-slate-950 flex flex-row justify-between items-center'>
            <div>
              <p className='text-xl tracking-widest font-bold cursor-pointer'>
                PPTLink.
              </p>
            </div>

            <small>
              &copy; PPTLink {new Date().getFullYear()}. All rights reserved
            </small>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
