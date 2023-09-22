import { Outlet } from 'react-router'
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { BsInstagram } from 'react-icons/bs';
import {
    AiFillFacebook,
    AiFillGithub,
    AiOutlineLinkedin,
} from 'react-icons/ai';
import { FiTwitter } from 'react-icons/fi';
import { TbWorldWww } from 'react-icons/tb';
import { useState } from 'react';

export default function Root() {
    const [page, setPage] = useState({
        dropdown: false,
    });

    const handleDropdown = () => {
        setPage({ ...page, dropdown: !page.dropdown });
    };

    return (
        <>
            <div className='w-full h-[100%] bg-slate-200 relative flex-wrap flex-col'>
                <div>
                    {page.dropdown && (
                        <div className='h-[8rem] flex justify-between items-center py-2 px-3 border lg:p-[2.5rem] lg:h-[10rem]'>
                            <div>
                                <p
                                    className='text-xl tracking-widest font-bold cursor-pointer'

                                >
                                    <Link to='/'>PPTLink.</Link>
                                </p>
                            </div>

                            <div className='w-[10rem] flex justify-between items-center -'>
                                <button className='px-5 rounded-xl py-1 bg-black text-slate-200'>
                                    Present
                                </button>
                                <button
                                    className='border-none p-2 rounded-full transition duration-300 hover:bg-slate-100'
                                    onClick={handleDropdown}
                                >
                                    <MdClose className='text-black w-[25px] h-[25px] ' />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex-col w-[100%] flex-1 border justify-center flex lg:flex-wrap lg:flex-row '>
                    <Link className='border text-center border-collapse border-slate-100 w-[90%] font-medium py-3 mx-auto text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center lg:mx-0 lg:px-14  lg:text-[40px] lg:py-14'>
                        Home
                    </Link>

                    <Link className='border text-center border-collapse border-slate-100 w-[90%] font-medium py-3 mx-auto text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center lg:mx-0 lg:px-14  lg:text-[40px] lg:py-14'>
                        Institutions
                    </Link>

                    <Link className='border text-center border-collapse border-slate-100 w-[90%] font-medium py-3 mx-auto text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center lg:mx-0 lg:px-14  lg:text-[40px] lg:py-14'>
                        About
                    </Link>

                    <Link className='border text-center border-collapse border-slate-100 w-[90%] font-medium py-3 mx-auto text-[40px] hover:bg-slate-100 lg:w-1/2 lg:flex lg:items-center lg:mx-0 lg:px-14  lg:text-[40px] lg:py-14 '>
                        Legal
                    </Link>
                </div>

                <div className=' border border-slate-100 border-collapse text-left flex flex-col lg:flex-row lg:h-[7.5rem] lg:mb-4'>
                    <div className='px-5 border flex-1'>
                        <h2 className='text-2xl mt-4 mb-6 font-medium'>Our location</h2>

                        <p>
                            You can find us at Nascomsoft in Anguwan Cashew, Off dass road,
                            opposite Elim church, 740102, Yelwa, Bauchi Nigeria
                        </p>
                    </div>
                    <div className='px-5 border flex-1'>
                        <div className='text-xl font-medium my-6'>External</div>

                        <div className='flex m-auto  flex-row justify-between w-[230px]'>
                            <TbWorldWww className='text-black text-2xl cursor-pointer' />

                            <BsInstagram className='text-black text-2xl cursor-pointer' />

                            <AiFillFacebook className='text-black text-2xl cursor-pointer' />

                            <FiTwitter className='text-black text-2xl cursor-pointer' />

                            <AiFillGithub className='text-black text-2xl cursor-pointer' />

                            <AiOutlineLinkedin className='text-black text-2xl  cursor-pointer' />
                        </div>
                    </div>
                </div>

                <div
                    className={`min-h-screen bg-black w-[100%] absolute top-0  lg:rounded-t-[2.7rem] overflow-x-hidden text-slate-200 lg:px-[2.5rem] lg:top-[5px] ${page.dropdown
                        ? 'transition-transform translate-y-[100vh] lg:translate-y-[100vh]  ease-in-out rounded-t-[2.7rem] duration-500 top-[5rem]  lg:top-9 '
                        : 'transition-transform translate-y-0 display-hidden ease-in-out duration-300'
                        }`}
                >
                    <div className='h-[6rem]'>
                        {!page.dropdown && (
                            <div className='h-[10rem] px-[1.5rem] flex justify-between items-center'>
                                <div>
                                    <p
                                        className='text-xl tracking-widest font-bold cursor-pointer '

                                    >
                                        <Link to='/'>PPTLink.</Link>
                                    </p>
                                </div>

                                <div className='w-[10rem] flex justify-between items-center'>
                                    <button className='px-7 rounded-xl py-1 bg-slate-200 text-black'>
                                        Present
                                    </button>
                                    <button
                                        className='border-none p-2 rounded-full transition duration-300 hover:bg-lightGray'
                                        onClick={handleDropdown}
                                    >
                                        <FaBars className='text-slate-200 w-[25px] h-[25px]' />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <Outlet />

                    <footer className='w-[100%] m-auto h-[100%] mt-[10vh] flex flex-col '>
                        <div className='w-[100%]  flex justify-center m-auto flex-col lg:flex-row lg:justify-between'>
                            <div className='w-[100%] px-[2.5rem] gap-2 m-auto flex  mt-0 justify-around  lg:flex-row lg:w-[40%] lg:justify-between'>
                                <div className='h-[100%] flex flex-col'>
                                    <h4 className='text-lg font-bold my-1'>Internal</h4>
                                    <Link to='/' className='py-2'>
                                        Home
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Present
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Institutions
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        sign up
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Log in
                                    </Link>
                                </div>

                                <div className='h-full flex flex-col'>
                                    <h4 className='text-lg font-bold my-1'>Documentation</h4>
                                    <Link to='/' className='py-2'>
                                        About us
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        How to use
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Legal
                                    </Link>
                                </div>

                                <div className='h-full flex flex-col  lg:mx-2'>
                                    <h4 className='text-lg font-bold my-1'>External</h4>
                                    <Link to='zutayah.com' className='py-2'>
                                        Zutayah
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Instagram
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Facebook
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Twitter
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Github
                                    </Link>
                                    <Link to='/' className='py-2'>
                                        Linkedin
                                    </Link>
                                </div>
                            </div>

                            <form className='lg:w-[40%] w-[100%] pt-7 px-[1rem] m-auto flex flex-col items-start'>
                                <div className='w-full m-0 border border-slate-200 rounded-xl border-collapse'>
                                    <div className='border-b border-slate-200 w-[100%] p-[30px] flex flex-wrap flex-row'>
                                        <h4 className='text-lg font-bold my-1'>Send us an email</h4>
                                        <p className='my-1 text-sm   lg:w-[410px]'>
                                            If you have any suggestions, corrections or want to get in
                                            contact with us, simply send us an email and we would be
                                            excited to hear from you
                                        </p>
                                    </div>

                                    <input
                                        type='text'
                                        placeholder='Type your email'
                                        className='w-full p-[30px] bg-transparent border-b border-slate-200'
                                    />
                                    <textarea
                                        placeholder='Send us a message'
                                        className='w-full p-[30px] bg-transparent'
                                    ></textarea>
                                </div>
                                <button
                                    className='px-7 text-center rounded-xl py-[9px] bg-slate-200 text-black my-[20px]'
                                    type='submit'
                                >
                                    Send
                                </button>
                            </form>
                        </div>

                        <div className='grow-[.3] px-[1.5rem] py-16 w-[100%] gap-5 border-t border-slate-950 flex flex-row justify-between items-center'>
                            <div>
                                <p
                                    className='text-xl tracking-widest font-bold cursor-pointer'

                                >
                                    <Link to='/'>PPTLink.</Link>
                                </p>
                            </div>

                            <small>
                                &copy; PPTLink {new Date().getFullYear()}. All rights reserved
                            </small>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

