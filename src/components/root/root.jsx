/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Outlet } from 'react-router';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { LoadingAssetSmall } from '../../assets/assets';
import {
  ABOUT,
  DASHBOARD,
  HOME,
  INSTITUTIONS,
  LEGAL,
  LOGIN,
  SIGNUP,
  UPLOAD,
} from '../../constants/routes';
import { useRef } from 'react';
import { useContext, useEffect } from 'react';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';
import { LoadingAssetBig2 } from '../../assets/assets';
// import { socket } from '../../socket';

export default function Root() {
  const controller = new AbortController();

  // context
  const { user, setUser } = useContext(userContext);

  // hooks
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef();

  useEffect(() => {
    setPage({ ...page, dropdown: false });
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    axios
      .get('/api/v1/auth/user')
      .then(({ data }) => {
        setUser(data.user);
        setPage({ ...page, pending: false });
      })
      .catch((err) => {
        setUser(null);
        setPage({ ...page, pending: false });
      });

    // socket.connect();

    return () => {
      // if user leaves the page disconnect the socket.io connection
      // socket.disconnect();
    };
  }, []);

  const [page, setPage] = useState({
    dropdown: false,

    email: '',
    message: '',

    pending: true,

    submitPending: false,
    submitErrors: [],
  });

  const handleDropdown = () => {
    setPage((prev) => ({ ...prev, dropdown: !prev.dropdown }));
  };

  let tempArr = [];
  const submitValidation = () => {
    tempArr = [];

    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        page.email
      )
    ) {
      tempArr = [...tempArr, 'Your Email is not Valid'];
    }

    if (page.message.length < 7) {
      tempArr = [
        ...tempArr,
        'Your message is too short, we want to hear more from you',
      ];

      setPage({ ...page, submitErrors: tempArr });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    submitValidation();
    if (tempArr.length === 0) {
      const sendData = { email: page.email, message: page.message };

      setPage({ ...page, submitPending: true, submitErrors: tempArr });

      axios
        .post('the route', {
          signal: controller.signal,
        })
        .then(({ data }) => {
          setPage({
            ...page,
            submitPending: false,
            submitSuccess: data.successMessage,
          });

          controller.abort();
        })
        .catch((err) => {
          setPage({
            ...page,
            submitPending: false,
            submitErrors: [err.response.message],
          });
        });
    }
  };

  const PresentButton = ({ color }) => {
    const handleClick = () => {
      if (!user) return navigate(LOGIN);
      if (user && user.presentations < 1) return navigate(UPLOAD);
      if (user.presentations > 0) return navigate(DASHBOARD);
    };

    return (
      <button
        className={`px-7 rounded-xl py-1 ${
          color === 'black'
            ? ' bg-black text-slate-200'
            : 'bg-slate-200 text-black'
        }`}
        onClick={() => handleClick()}
      >
        Present
      </button>
    );
  };

  return (
    <>
      <div className='w-full min-h-[100%] bg-slate-200 relative flex-wrap flex-col'>
        <div>
          {page.dropdown ? (
            <div className='h-[10rem] flex justify-between items-center py-3 px-[1.5rem] border lg:p-[2.5rem] lg:h-[10rem]'>
              <div>
                <p className='text-xl tracking-widest font-bold cursor-pointer'>
                  <Link to='/'>PPTLink.</Link>
                </p>
              </div>

              <div className='w-[10rem] flex justify-between items-center'>
                <PresentButton color={'black'} />
                <button
                  className='border-none p-2 rounded-full transition duration-300 hover:bg-slate-100'
                  onClick={handleDropdown}
                >
                  <MdClose className='text-black w-[25px] h-[25px] ' />
                </button>
              </div>
            </div>
          ) : (
            <div className='h-[10rem] flex justify-between items-center py-3 px-[1.5rem] border lg:p-[2.5rem] lg:h-[10rem]'></div>
          )}
        </div>

        <div className='flex-col w-[100%] flex-1 border justify-center flex lg:flex-wrap lg:flex-row '>
          <Link
            to={INSTITUTIONS}
            className='border text-center border-collapse border-slate-100 w-[100%] font-medium py-5 mx-0 text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center  lg:px-14  lg:text-[40px] lg:py-14'
          >
            Institutions
          </Link>

          <Link
            to={ABOUT}
            className='border text-center border-collapse border-slate-100 w-[100%] font-medium py-5 mx-0 text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center  lg:px-14  lg:text-[40px] lg:py-14'
          >
            About
          </Link>

          <Link
            to={LEGAL}
            className='border text-center border-collapse border-slate-100 w-[100%] font-medium py-5 mx-0 text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center  lg:px-14  lg:text-[40px] lg:py-14 '
          >
            Legal
          </Link>
          <Link
            to={UPLOAD}
            className='border text-center border-collapse border-slate-100 w-[100%] font-medium py-5 mx-0 text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center  lg:px-14  lg:text-[40px] lg:py-14'
          >
            Upload
          </Link>
        </div>

        <div className=' border border-slate-100 border-collapse text-left flex flex-col lg:flex-row lg:h-[7.5rem] lg:mb-4'>
          <div className='px-5 border flex-1'>
            <h2 className='text-2xl mt-4 mb-6 font-medium'>Our location</h2>

            <p>
              You can find us at Nascomsoft in Anguwan Cashew, Off dass road,
              opposite Elim church, 740102, Yelwa, Bauchi Nigeria
            </p>
          </div>
          <div className='px-5 border  flex-1'>
            <div className='text-xl font-medium my-6'>External</div>

            <div className='flex m-auto  mb-6 flex-row justify-between w-[230px]'>
              <TbWorldWww className='text-black text-2xl cursor-pointer' />

              <BsInstagram className='text-black text-2xl cursor-pointer' />

              <AiFillFacebook className='text-black text-2xl cursor-pointer' />

              <FiTwitter className='text-black text-2xl cursor-pointer' />

              <AiFillGithub className='text-black text-2xl cursor-pointer' />

              <AiOutlineLinkedin className='text-black text-2xl  cursor-pointer' />
            </div>
          </div>
        </div>

        <div
          ref={mainRef}
          className={`min-h-screen bg-black w-[100%] absolute rounded-t-[2.7rem] lg:rounded-t-[2.7rem] overflow-x-hidden  text-slate-200 lg:px-[2.5rem] lg:top-[5px] ${
            page.dropdown
              ? 'transition-transform translate-y-[100vh] rounded-t-[2.7rem] top-[10%] lg:translate-y-[100vh]  ease-in-out duration-500'
              : 'transition-transform translate-y-0 display-hidden ease-in-out duration-300 top-[10px]'
          }`}
        >
          <div className='h-[6rem]'>
            {!page.dropdown && (
              <div className='h-[10rem] px-[1.5rem] flex justify-between items-center'>
                <div>
                  <p className='text-xl tracking-widest font-bold cursor-pointer '>
                    <Link to='/'>PPTLink.</Link>
                  </p>
                </div>

                <div className='w-[10rem] flex justify-between items-center'>
                  <PresentButton color={'slate'} />
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
          {page.pending ? (
            <div className='w-full h-[85vh] flex justify-center items-center'>
              <LoadingAssetBig2 />
            </div>
          ) : (
            <Outlet />
          )}
          <footer className='w-[100%]  m-auto h-[100%] mt-[10vh] flex flex-col '>
            <div className='w-[100%]  flex justify-center m-auto flex-col lg:flex-row lg:justify-between'>
              <div className='w-[100%] px-[2.5rem]  m-auto lg:m-0 flex  mt-0 justify-around  lg:flex-row lg:w-[40%] lg:justify-between'>
                <div className='h-[100%] flex flex-col'>
                  <h4 className='text-lg font-bold my-1'>Internal</h4>
                  <Link to={HOME} className='py-2'>
                    Home
                  </Link>
                  <Link to={UPLOAD} className='py-2'>
                    Upload
                  </Link>
                  <Link to={INSTITUTIONS} className='py-2'>
                    Institutions
                  </Link>
                  <Link to={SIGNUP} className='py-2'>
                    sign up
                  </Link>
                  <Link to={LOGIN} className='py-2'>
                    Log in
                  </Link>
                </div>

                <div className='h-full flex flex-col mx-4'>
                  <h4 className='text-lg font-bold my-1'>Documentation</h4>
                  <Link to={ABOUT} className='py-2'>
                    About us
                  </Link>
                  <Link to='/' className='py-2'>
                    How to use
                  </Link>
                  <Link to='/' className='py-2'>
                    Legal
                  </Link>
                </div>

                <div className='h-full flex flex-col mx-2'>
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

              <form
                className='lg:w-[40%] w-[100%] pt-7 px-[1rem] m-auto lg:m-0 flex flex-col items-start'
                onSubmit={handleSubmit}
              >
                <div className='w-full m-0 border border-slate-200 rounded-xl border-collapse'>
                  <div className='border-b border-slate-200 w-[100%] p-[30px] flex flex-wrap flex-row'>
                    <h4 className='text-lg font-bold my-1'>Send us an email</h4>
                    <p className='my-1 text-sm   lg:w-[410px]'>
                      If you have any suggestions, corrections or want to get in
                      contact with us, simply send us an email and we would be
                      excited to hear from you
                    </p>
                  </div>

                  <input
                    type='email'
                    placeholder='Type your email'
                    value={page.email}
                    onChange={(e) =>
                      setPage({ ...page, email: e.target.value })
                    }
                    className='w-full p-[30px] bg-transparent border-b border-slate-200'
                  />

                  <textarea
                    placeholder='Send us a message'
                    value={page.message}
                    onChange={(e) =>
                      setPage({ ...page, message: e.target.value })
                    }
                    className={`w-full resize-none p-[30px] bg-transparent ${
                      page.submitErrors.length > 0 &&
                      'border-b border-slate-200'
                    }`}
                  />

                  {page.submitErrors.length > 0 && (
                    <ul className='flex flex-col justify-between p-[30px] list-[disc]'>
                      {page.submitErrors.map((error, i) => (
                        <li key={i} className='text-rose-600'>
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  className='px-7 text-center rounded-xl flex items-center justify-center bg-slate-200 text-black my-[20px]'
                  type='submit'
                >
                  {page.submitPending ? (
                    <LoadingAssetSmall />
                  ) : (
                    <p className='py-[9px]'>Send</p>
                  )}
                </button>
              </form>
            </div>

            <div className='grow-[.3] px-[1.5rem] py-16 w-[100%] border-t border-slate-950 flex flex-row justify-between items-center'>
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
