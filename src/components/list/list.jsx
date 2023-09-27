/* eslint-disable no-unused-vars */

import { Link } from 'react-router-dom';
import { AiFillCaretDown } from 'react-icons/ai';
import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';
import { LoadingAssetSmall2, LoadingAssetBig2 } from '../../assets/assets';

let pageNo = 1;
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

  return (
    <section className='min-h-full w-full flex px-[25%] '>
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
                    to=''
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
