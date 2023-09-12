import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
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

export default function Root() {
  const [page, setPage] = useState({
    dropdown: false,
  });

  const handleDropdown = () => {
    setPage({ ...page, dropdown: !page.dropdown });
  };

  return (
    <>
      <div className='w-full h-screen bg-slate-200 relative flex flex-col'>
        <div className='h-[10rem]'>
          {page.dropdown && (
            <div className='h-[10rem] flex justify-between items-center px-[2.5rem] border'>
              <div>
                <p className='text-xl tracking-widest font-bold cursor-pointer'>
                  <Link to='/'>PPTLink.</Link>
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
          <Link className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
            Home
          </Link>

          <Link className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
            Insitutions
          </Link>

          <Link className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
            About
          </Link>

          <Link className='w-1/2 border border-collapse border-slate-100 hover:bg-slate-100 text-[40px] flex items-center px-14 font-medium '>
            Legal
          </Link>
        </div>

        <div className='h-[7.5rem] border border-slate-100 border-collapse flex'>
          <div className='px-14 border flex-1'>
            <h2 className='text-xl mb-6'>Our location</h2>

            <p>
              You can find us at Nascomsoft in Anguwan Cashew, Off dass road,
              opposite Elim church, 740102, Yelwa, Bauchi Nigeria
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
                    <Link to='/'>PPTLink.</Link>
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

          <Outlet />

          <footer className='w-full h-[80vh] mt-[10vh] flex flex-col'>
            <div className='grow-[.7] flex flex-row'>
              <div className='w-[60%] flex flex-row justify-between pr-[310px]'>
                <div className='h-full flex flex-col'>
                  <h4 className='text-lg font-bold my-1'>Internal</h4>
                  <Link to='/' className='py-2'>
                    Home
                  </Link>
                  <Link to='/' className='py-2'>
                    Present
                  </Link>
                  <Link to='/' className='py-2'>
                    Institutions
                  </Link>
                  <Link to='/' className='py-2'>
                    sign up
                  </Link>
                  <Link to='/' className='py-2'>
                    Log in
                  </Link>
                </div>

                <div className='h-full flex flex-col'>
                  <h4 className='text-lg font-bold my-1'>Documentation</h4>
                  <Link to='/' className='py-2'>
                    About us
                  </Link>
                  <Link to='/' className='py-2'>
                    How to use
                  </Link>
                  <Link to='/' className='py-2'>
                    Legal
                  </Link>
                </div>

                <div className='h-full flex flex-col'>
                  <h4 className='text-lg font-bold my-1'>External</h4>
                  <Link to='zutayah.com' className='py-2'>
                    Zutayah
                  </Link>
                  <Link to='/' className='py-2'>
                    Instagram
                  </Link>
                  <Link to='/' className='py-2'>
                    Facebook
                  </Link>
                  <Link to='/' className='py-2'>
                    Twitter
                  </Link>
                  <Link to='/' className='py-2'>
                    Github
                  </Link>
                  <Link to='/' className='py-2'>
                    Linkedin
                  </Link>
                </div>
              </div>

              <form className='w-[40%] flex flex-col items-start'>
                <div className='w-[450px] border border-slate-200 rounded-xl border-collapse'>
                  <div className='border-b border-slate-200 w-full p-[30px]'>
                    <h4 className='text-lg font-bold my-1'>Send us an email</h4>
                    <p className='my-1 text-sm leading-5 w-[410px]'>
                      If you have any suggestions, corrections or want to get in
                      contact with us, simply send us an email and we would be
                      excited to hear from you
                    </p>
                  </div>

                  <input
                    type='text'
                    placeholder='Type your email'
                    className='w-full p-[30px] bg-transparent border-b border-slate-200'
                  />
                  <textarea
                    placeholder='Send us a message'
                    className='w-full p-[30px] bg-transparent'
                  ></textarea>
                </div>
                <button
                  className='px-7 rounded-xl py-[9px] bg-slate-200 text-black my-[20px]'
                  type='submit'
                >
                  Send
                </button>
              </form>
            </div>

            <div className='grow-[.3] border-t border-slate-950 flex flex-row justify-between items-center'>
              <div>
                <p className='text-xl tracking-widest font-bold cursor-pointer'>
                  <Link to='/'>PPTLink.</Link>
                </p>
              </div>

              <small>
                &copy; PPTLink {new Date().getFullYear()}. All rights reserved
              </small>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
