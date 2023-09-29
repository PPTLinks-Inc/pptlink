/* eslint-disable no-unused-vars */

import { useState, useEffect, useCallback, useRef } from 'react';
import profile from '../../images/profile.jfif';
import { AiFillCaretDown } from 'react-icons/ai';
import { GrAdd } from 'react-icons/gr';
import beginnersguide from '../../images/beginners-guide.webp';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { LoadingAssetBig2, LoadingAssetSmall2 } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { UPLOAD } from '../../constants/routes';
import { Helmet } from 'react-helmet';
import LogoBlack from '../../images/Logo-Black.png';

let pageNo = 1;
let observer;
let isFetching = false;
const Dashboard = () => {
  const controller = new AbortController();

  const navigate = useNavigate();

  const [values, setValues] = useState({
    error: false,

    setPresentations: [],

    pending: true,
    isIntersecting: false,
  });

  const arrowRef = useRef();

  const getPresentations = () => {
    setValues((prev) => ({ ...prev, pending: true }));

    axios
      .get(`/api/v1/ppt/presentations?noPerPage=10&pageNo=${pageNo}`, {
        signal: controller.signal,
      })
      .then((data) => {
        setValues((prev) => ({
          ...prev,
          setPresentations: [...prev.setPresentations, ...data],
        }));
        isFetching = false;
        pageNo++;
        if (data.presentationCount < 10) observer && observer.disconnect();

        controller.abort();
      })
      .catch((err) => {
        setValues((prev) => ({
          ...prev,
          pending: false,
          error: true,
        }));
      });
  };

  useEffect(() => {
    if (!arrowRef.current) {
      setValues((prev) => ({ ...prev, isIntersecting: true }));
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        setValues((prev) => ({
          ...prev,
          isIntersecting: entries[0].isIntersecting,
        }));
      },
      {
        root: null,
        threshold: 0.8,
        rootMargin: '15%',
      }
    );
    observer.observe(arrowRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isFetching) return;

    if (values.isIntersecting) {
      isFetching = true;
      getPresentations();
    }
  }, [values.isIntersecting]);

  const handleRefresh = useCallback(() => {
    setValues({ ...values, pending: true, error: false });
    getPresentations();
  }, [values]);

  return (
    <section className='min-h-full w-full py-[20px] relative flex flex-col justify-around'>
      {/* meta and SEO information */}
      <Helmet>
        <title>{`Dashboard - PPTLink `}</title>
        <meta
          name='description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta
          name='tags'
          content={`PPT, Presentations, Powerpoint, PPTLink, Dashboard`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`https://www.PPTLink.com/dashboard`} />
        <meta property='og:title' content={`Dashboard - PPTLink `} />
        <meta
          property='og:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta property='og:image' content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property='twitter:card' content='website' />
        <meta
          property='twitter:url'
          content={`https://www.PPTLink.com/dashboard`}
        />

        <meta property='twitter:title' content={`Dashboard - PPTLink `} />
        <meta
          property='twitter:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta property='twitter:image' content={LogoBlack} />
      </Helmet>

      <div className='flex flex-col md:flex-row max-w-[80%] mx-auto gap-20 items-center mb-[40px]'>
        <label
          htmlFor='uploadImg'
          className='block min-w-[250px] h-fit relative rounded-full'
        >
          <img
            className='w-[250px] h-[250px] rounded-full mb-[40px]'
            src={profile}
            alt='your profile'
            draggable='false'
            loading='lazy'
          />
          <FaPlus
            size='30px'
            className='absolute z-10 top-[65%] right-0 border rounded border-slate-200 text-slate-200 '
          />
          <input type='file' id='uploadImg' className='absolute' hidden />
        </label>

        <div className=''>
          <h2 className='text-xl mb-6 font-bold'>Welcome to PPTLink,</h2>
          <p className='mb-6'>
            Your upload list and all other activities carried out on the
            platform will appear here. Feel free to upload more presentations,
            lets make this world paperless.
          </p>

          <button className='' onClick={() => navigate(UPLOAD)}>
            <span className='px-7 rounded-xl py-1 bg-slate-200 text-black flex items-center justify-around animate-bounce'>
              <GrAdd /> <span className='ml-3'>Upload</span>
            </span>
          </button>
        </div>
      </div>

      <div className=''>
        <div className='w-full flex justify-between items-center'>
          <h2 className='text-xl mb-6'>Your presentations</h2>

          <button className='px-7 rounded-xl py-1 bg-slate-200 text-black'>
            Log out
          </button>
        </div>
        {values.pending && values.setPresentations.length < 1 ? (
          <div className='w-full h-[25vh] flex justify-center items-center'>
            <LoadingAssetBig2 />
          </div>
        ) : (
          <>
            {values.error ? (
              <div className='w-full h-[25vh] flex justify-center items-center'>
                <button
                  className='px-7 rounded-xl py-1 bg-slate-200 text-black'
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <>
                <div className='w-full h-fit flex justify-start flex-wrap gap-x-5 gap-y-[60px]'>
                  {values.setPresentations.length < 1 ? (
                    <div className='w-full h-[25vh] flex justify-center items-center'>
                      <LoadingAssetBig2 />
                    </div>
                  ) : (
                    values.setPresentations.map((_, i) => (
                      <div key={i} className='w-[300px] cursor-pointer'>
                        <img
                          src={beginnersguide}
                          alt='presentation image'
                          className='rounded-xl w-full h-[190px]'
                          draggable='false'
                          loading='lazy'
                        />

                        <p className='font-bold leading-10 treading-6'>
                          My first presentation
                        </p>

                        <span className='w-[40%] flex justify-between'>
                          <small>11/9/2023</small>
                          <small>private</small>
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div
                  ref={arrowRef}
                  className='w-full h-[40px] flex items-center justify-center'
                >
                  {values.setPresentations.length > 0 && values.pending ? (
                    <LoadingAssetSmall2 />
                  ) : (
                    values.setPresentations.length > 0 && (
                      <AiFillCaretDown
                        className='text-2xl cursor-pointer'
                        onClick={getPresentations}
                      />
                    )
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};
export default Dashboard;
