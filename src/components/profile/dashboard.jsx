/* eslint-disable no-unused-vars */

import profile from '../../images/profile.jfif';
import { AiFillCaretDown } from 'react-icons/ai';
import { GrAdd } from 'react-icons/gr';
import beginnersguide from '../../images/beginners-guide.webp';
import chatgptWebiner from '../../images/chatgpt-webinar.webp';
import moreThan from '../../images/more-than.webp';
import sixStep from '../../images/the-six-step-guide.webp';
import humanResecource from '../../images/human-resource-management.webp';
import healthCare from '../../images/ppt-on-health-care-marketing-1-2048.webp';
import { userContext } from '../../contexts/userContext';
import { useEffect, useContext } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const controller = new AbortController();

  // script to authenticate and determine if the person is a user
  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    axios
      .get('auth', { withCredentials: true })
      .then(({ user }) => {
        setUser(user);
      })
      .catch((err) => setUser(null));
  }, [user]);

  return (
    <section className='min-h-full w-full py-[20px] relative flex flex-col justify-around'>
      <div className='flex flex-col md:flex-row max-w-[80%] mx-auto gap-20 items-center mb-[40px]'>
        <img
          className='w-[250px] h-[250px] rounded-full mb-[40px]'
          src={profile}
          alt='your profile'
          draggable='false'
          loading='lazy'
        />
        <div className=''>
          <h2 className='text-xl mb-6 font-bold'>Welcome to PPTLink,</h2>
          <p className='mb-6'>
            Your upload list and all other activities carried out on the
            platform will appear here. Feel free to upload more presentations,
            lets make this world paperless.
          </p>

          <button className='px-7 rounded-xl py-1 bg-slate-200 text-black flex items-center justify-around animate-bounce'>
            <GrAdd /> <span className='ml-3'>Upload</span>
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

        <div className='w-full h-fit flex justify-start flex-wrap gap-x-5 gap-y-[60px]'>
          <div className='w-[300px] cursor-pointer'>
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

          <div className='w-[300px] cursor-pointer'>
            <img
              src={chatgptWebiner}
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
              <small>Public</small>
            </span>
          </div>

          <div className='w-[300px] cursor-pointer'>
            <img
              src={moreThan}
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
              <small>Public</small>
            </span>
          </div>

          <div className='w-[300px] cursor-pointer'>
            <img
              src={sixStep}
              alt='presentation image'
              className='rounded-xl w-full h-[190px]'
              draggable='false'
              loading='lazy'
            />

            <p className='font-bold leading-10'>My first presentation</p>

            <span className='w-[40%] flex justify-between'>
              <small>11/9/2023</small>
              <small>Public</small>
            </span>
          </div>

          <div className='w-[300px] cursor-pointer'>
            <img
              src={healthCare}
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
              <small>Public</small>
            </span>
          </div>

          <div className='w-[300px] cursor-pointer'>
            <img
              src={humanResecource}
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
              <small>Public</small>
            </span>
          </div>
        </div>

        <div className='w-full h-[40px] flex items-center justify-center'>
          <AiFillCaretDown className='text-2xl cursor-pointer' />
        </div>
      </div>
    </section>
  );
};
export default Dashboard;
