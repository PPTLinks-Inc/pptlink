import { FaBars } from 'react-icons/fa';

const Home = () => {
  return (
    <div className='w-full min-h-max bg-slate-200 relative'>
      <div className=' min-h-screen bg-black min-w-full absolute top-[5px] rounded-t-[2.7rem] overflow-hidden text-slate-200 px-[4.5rem]'>
        <div className='h-[10rem] flex justify-between items-center'>
          <div>
            <p className='text-xl tracking-widest font-bold'>PPTLink.</p>
          </div>

          <div className='w-[10rem] flex justify-between items-center'>
            <button className='px-7 rounded-3xl py-1 bg-slate-200 text-black'>
              Present
            </button>
            <button className='border-none p-2 rounded-full transition duration-300 hover:bg-lightGray'>
              <FaBars className='text-slate-200 w-[25px] h-[25px]' />{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
