// import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AiFillCaretDown } from 'react-icons/ai';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { LoadingAssetSmall2, LoadingAssetBig2 } from '../../assets/assets';
import useIntersection from '../../hooks/useIntersection';

const List = () => {
  const controller = new AbortController();
  const arrowRef = useRef();

  const [institutionsData, setInstitutionsData] = useState([1, 1, 1]);

  const getInstitutions = () => {};

  const { result, loading } = useIntersection({
    func: getInstitutions,
    ref: arrowRef,
    initialValue: [],
  });

  useEffect(() => {
    setInstitutionsData(result);
  }, [result]);

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

        {institutionsData?.map((_, i) => (
          <Link
            key={i}
            to=''
            className='border-l-4 pl-2 border-slate-200 h-[50px] flex items-center mb-[45px]'
          >
            University of Jos
          </Link>
        ))}

        <div
          ref={arrowRef}
          className='w-full h-[40px] flex items-center justify-center'
        >
          {loading && <LoadingAssetSmall2 />}
        </div>
      </div>
    </section>
  );
};

export default List;
