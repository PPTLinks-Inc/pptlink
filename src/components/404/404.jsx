import { LoadingAssetBig, LoadingAssetSmall } from '../../assets/assets';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className='min-h-full w-[100%] flex px-7 md:px-[25%] '>
      <div className='h-[100%]  text-[12px] w-full flex flex-col justify-between pb-4 '>
        <h1 className='text-[40px] my-6 font-medium'>
          404: We could not find this page
        </h1>
        <p className='text-xl mb-6'>
          Please check the link you entered properly or choose one the links
          below
        </p>

        <Link
          to=''
          className='border-l-4 pl-2 my-2 border-slate-200 h-10 flex items-center'
        >
          Home - takes you back to the home page
        </Link>
        <Link
          to=''
          className='border-l-4 pl-2 my-2 h-10  border-slate-200 flex items-center'
        >
          Present - If you need to make a presentation, click and follow the
          intructions
        </Link>
        <Link
          to=''
          className='border-l-4 pl-2 my-2 h-10  border-slate-200 flex items-center'
        >
          Log in - Already registered? then log in, else sign up and join the
          platform
        </Link>
        <Link
          to=''
          className='border-l-4 pl-2 h-10  my-2 border-slate-200  flex items-center'
        >
          Institutions - If you are looking for presentations belonging to an
          institution
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
