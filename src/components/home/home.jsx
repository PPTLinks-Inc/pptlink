// import MenuIcon from '@mui/icons-material/Menu';

const Home = () => {
  return (
    <div className='box-border w-full min-h-max bg-slate-200 relative'>
      <div className=' min-h-screen bg-black min-w-full absolute top-[5px] rounded-t-[2.7rem] overflow-hidden text-slate-200 px-[4rem]'>
        <div className='h-24 flex justify-between items-center'>
          <div>
            <p>PPTLink</p>
          </div>

          <div>
            <button className='px-7 rounded-3xl py-1 bg-slate-200 text-black'>
              Present
            </button>

            {/* <MenuIcon className='rounded-full w-7 h-7 bg-slate-200 border-green-900' /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
