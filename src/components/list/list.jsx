// import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AiFillCaretDown } from 'react-icons/ai';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';

const List = () => {
  // const [user, setUser] = userContext();

  // useEffect(() => {
  //   axios
  //     .get('auth', { withCredentials: true })
  //     .then(({ user }) => {
  //       setUser(user);
  //     })
  //     .catch((err) => setUser(null));
  // }, [user]);

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

        <Link
          to=''
          className='border-l-4 pl-2 border-slate-200 h-[50px] flex items-center mb-[45px]'
        >
          ATBU Bauchi
        </Link>

        <Link
          to=''
          className='border-l-4 pl-2 border-slate-200 h-[50px] flex items-center mb-[45px]'
        >
          Federal Poly technique Bauchi
        </Link>

        <Link
          to=''
          className='border-l-4 pl-2 border-slate-200 h-[50px] flex items-center mb-[45px]'
        >
          Tatary Ali Polytechnique Bauchi
        </Link>

        <Link
          to=''
          className='border-l-4 pl-2 border-slate-200 h-[50px] flex items-center mb-[45px]'
        >
          University of Jos
        </Link>

        <div className='w-full h-[40px] flex items-center justify-center'>
          <AiFillCaretDown className='text-2xl cursor-pointer' />
        </div>
      </div>
    </section>
  );
};

export default List;
