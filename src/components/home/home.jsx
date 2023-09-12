import Ellipse from './../../images/Ellipse.png';
import loading from './../../images/loading.png';

const Home = () => {
  return (
    <section className='min-h-full w-full flex px-[10%] py-[6%] relative'>
      <img
        src={Ellipse}
        alt='Ellipse'
        className='z-20 w-6 absolute left-24 top-56'
        draggable='false'
        loading='lazy'
      />

      <img
        src={Ellipse}
        alt='Ellipse'
        className='z-20 w-6 absolute right-36 top-36'
        draggable='false'
      />

      <img
        src={Ellipse}
        alt='Ellipse'
        className='z-20 w-6 absolute left-65 bottom-24'
        draggable='false'
        loading='lazy'
      />

      <img
        src={Ellipse}
        alt='Ellipse'
        className='z-20 w-6 absolute right-40 bottom-40'
        draggable='false'
        loading='lazy'
      />

      <div className='flex-1'>
        <img
          src={loading}
          alt='loading'
          className='w-9/12'
          draggable='false'
          loading='lazy'
        />
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
              className='border border-slate-200 px-[15px] py-[12px] text-slate-200 decoration-black rounded-xl bg-transparent my-1'
            />

            <button
              className='px-7 rounded-xl py-[9px] bg-slate-200 text-black my-1'
              type='submit'
            >
              Find
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Home;
