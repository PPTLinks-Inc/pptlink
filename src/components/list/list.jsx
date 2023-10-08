/* eslint-disable no-unused-vars */

import { Link } from 'react-router-dom';
import { AiFillCaretDown } from 'react-icons/ai';
import axios from 'axios';
import { useEffect, useRef, useState, useCallback, useReducer } from 'react';
import { LoadingAssetSmall2, LoadingAssetBig2 } from '../../assets/assets';
import { Helmet } from 'react-helmet';
import LogoBlack from '../../images/Logo-Black.png';

// let pageNo = 1;

const initialPageNo = 1;

const pageNoReducer = (state, action) => {
  console.log({ state, action });
  return state++;
};

let isFetching = false;
let observer;
const List = () => {
  const controller = new AbortController();
  const arrowRef = useRef();

  const [values, setValues] = useState({
    pending: true,

    isIntersecting: false,

    error: false,

    institutions: [],
  });

  const getInstitutions = () => {
    setValues((prev) => ({ ...prev, pending: true }));

    axios
      .get(`/api/v1/institution?noPerPage=10&pageNo=${pageNo}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        console.log(data);

        setValues((prev) => ({
          ...prev,
          institutions: [...prev.institutions, ...data.institutions],
          pending: false,
        }));

        isFetching = false;
        pageNo++;
        if (data.pageInstitutionCount < 10) observer && observer.disconnect();

        controller.abort();
      })
      .catch((err) => {
        setValues((prev) => ({ ...prev, pending: false, error: true }));
      });
  };

  const [pageNo, dispatch] = useReducer(pageNoReducer, initialPageNo);

  useEffect(() => {
    console.log('REACHED');
    dispatch('add');
  }, []);

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
      getInstitutions();
    }
  }, [values.isIntersecting]);

  const handleRefresh = useCallback(() => {
    setValues({ ...values, pending: true, error: false });
    getInstitutions();
  }, [values]);

  function SpacesWithUnderscores(inputString) {
    // Use the replace method with a regular expression to replace all spaces with underscores
    var resultString = inputString.replace(/\s+/g, '_');
    return resultString;
  }

  return (
    <section className='min-h-full w-full flex px-[25%] '>
      {/* meta and SEO information */}
      <Helmet>
        <title>{`Institutions - PPTLink `}</title>
        <meta
          name='description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta
          name='tags'
          content={`PPT, Presentations, Powerpoint, PPTLink,`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property='og:type' content='website' />
        <meta
          property='og:url'
          content={`https://www.PPTLink.com/institions`}
        />
        <meta property='og:title' content={`Institutions - PPTLink `} />
        <meta
          property='og:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta property='og:image' content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property='twitter:card' content='website' />
        <meta
          property='twitter:url'
          content={`https://www.PPTLink.com/institions`}
        />

        <meta property='twitter:title' content={`Institutions - PPTLink `} />
        <meta
          property='twitter:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta property='twitter:image' content={LogoBlack} />
      </Helmet>

      <div className='w-full flex flex-col justify-between'>
        <h1 className='text-[40px] font-medium mb-[45px]'>
          List of all institutions
        </h1>

        <p className='text-xl mb-[45px]'>
          Click on an institution to find all public presentations made by them
        </p>

        <form className='flex w-[305px] justify-between mb-[45px]'>
          <input
            type='text'
            placeholder='Find institution'
            className='border border-slate-200 px-[15px] py-[12px] text-slate-200 decoration-black rounded-xl bg-transparent my-1'
          />

          <button
            className='px-7 rounded-xl py-[9px] bg-slate-200 text-black my-1'
            type='submit'
          >
            Find
          </button>
        </form>
        {values.pending && values.institutions.length < 1 ? (
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
                {values.institutions.map((_, i) => (
                  <Link
                    key={i}
                    to={`/institutions/${SpacesWithUnderscores(_.name)}`}
                    className='border-l-4 pl-2 border-slate-200 h-[50px] flex items-center mb-[45px]'
                  >
                    {_.name}
                  </Link>
                ))}

                {
                  <div
                    ref={arrowRef}
                    className='w-full h-[40px] flex items-center justify-center'
                  >
                    {values.institutions.length > 0 && values.pending ? (
                      <LoadingAssetSmall2 />
                    ) : (
                      values.institutions.length > 0 && (
                        <AiFillCaretDown
                          className='text-2xl cursor-pointer'
                          onClick={getInstitutions}
                        />
                      )
                    )}
                  </div>
                }
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default List;
