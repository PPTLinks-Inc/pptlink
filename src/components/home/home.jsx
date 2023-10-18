/* eslint-disable no-unused-vars */

import Ellipse from './../../images/Ellipse.png';
import loading from './../../images/loading.png';
import LogoBlack from '../../images/Logo-Black.png';
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <section className='min-h-full w-full flex flex-col flex-reverse px-[10%] py-[6%] relative lg:flex-row'>
      {/* meta and SEO information */}
      <Helmet>
        <title>{`Home - PPTLinks `}</title>
        <meta
          name='description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
        />
        <meta
          name='tags'
          content={`PPT, Presentations, Powerpoint, PPTLinks,`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`https://www.PPTLink.com`} />
        <meta property='og:title' content={`Home - PPTLinks `} />
        <meta
          property='og:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
        />
        <meta property='og:image' content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property='twitter:card' content='website' />
        <meta property='twitter:url' content={`https://www.PPTLink.com`} />

        <meta property='twitter:title' content={`Home - PPTLinks `} />
        <meta
          property='twitter:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
        />
        <meta property='twitter:image' content={LogoBlack} />
      </Helmet>

      <img
        draggable='false'
        loading='lazy'
        src={Ellipse}
        alt='Ellipse'
        className='hidden z-20 w-6 lg:block  lg:absolute left-4 top-10 lg:left-24 lg:top-56'
      />

      <img
        draggable='false'
        loading='lazy'
        src={Ellipse}
        alt='Ellipse'
        className='hidden z-20 w-6 lg:block lg:absolute right-10 top-10 lg:right-36 lg:top-16'
      />

      <img
        draggable='false'
        loading='lazy'
        src={Ellipse}
        alt='Ellipse'
        className=' hidden z-20 w-6 lg:block lg:absolute lg:left-65 bottom-24'
      />

      <img
        draggable='false'
        loading='lazy'
        src={Ellipse}
        alt='Ellipse'
        className='hidden z-20 w-6 lg:block lg:absolute lg:right-40 lg:bottom-40'
      />

      <div className='hidden lg:block flex-1'>
        <img
          draggable='false'
          loading='lazy'
          src={loading}
          alt='loading'
          className='w-9/12'
        />
      </div>

      <div className='flex-1 pt-7 flex justify-center'>
        <div className='lg:absolute'>
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
