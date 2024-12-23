import { NavLink } from "react-router-dom";
import documentImg from "/team/pptlink_resources/documentation-svgrepo-com (1).svg";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
import { BsLockFill, BsUnlockFill } from 'react-icons/bs';
import { Helmet } from "react-helmet";
import LogoprimaryTwo from "../../images/Logo-primaryTwo.png";

export default function Library() {
    const courseUnlocked = true;

    return (<>
        <Helmet>
            <title>{`Library - PPTLinks `}</title>
            <meta
                name='description'
                content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
            />
            <meta
                name='tags'
                content={`PPT, Presentations, Powerpoint, PPTLinks, publicPresentation, PPTLINKSLibrary, library, `}
            />

            {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
            <meta property='og:type' content='website' />
            <meta property='og:url' content={`https://www.PPTLink.com/library`} />
            <meta property='og:title' content={`Library - PPTLinks `} />
            <meta
                property='og:description'
                content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
            />
            <meta property='og:image' content={LogoprimaryTwo} />

            {/* meta tags to display information on twitter  */}
            <meta property='twitter:card' content='website' />
            <meta
                property='twitter:url'
                content={`https://www.PPTLink.com/library`}
            />

            <meta property='twitter:title' content={`Library - PPTLinks `} />
            <meta
                property='twitter:description'
                content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
            />
            <meta property='twitter:image' content={LogoprimaryTwo} />
        </Helmet>
        <section className="bg-primaryTwo">
            <div className="container h-fit py-10 flex flex-col justify-between items-center">
                <h1 className="text-5xl font-[400] uppercase mb-5">LIBRARY</h1>
                <div className="w-[150px] aspect-square mb-5">
                    <img
                        src={documentImg}
                        alt={documentImg}
                        className="block w-full h-full"
                    />
                </div>
                <div className="w-[300px] h-fit rounded-[.5rem] border border-white relative mb-5">
                    <input
                        type="text"
                        name="searcher"
                        placeholder="Search for Libraries"
                        className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-primaryTwo text-white"
                    />
                    <img
                        src={searchImg}
                        alt={searchImg}
                        className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
                    />
                </div>
            </div>
        </section>

        <section className="library container py-5 h-fit bg-[#FFFFF0]">
            <div className="w-full my-20">
                {/* {Array(3).fill(0).map((_, i) => ({ id: i })).map(({ id }) => */}
                <NavLink to={'#'}
                    className="_min-w-[350px] bg-primaryTwo
                 h-fit border-[.1px]
                 border-primaryTwo rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{courseUnlocked ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-primaryTwo px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">GNS</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Department of General Studies</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">The Federal Polytechnic Bauchi</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Students Lecture Guide for FPTB GNS courses</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        {/* <span className="text-[1.005rem]">View Library <span className="font-bold text-xl">&rarr;</span></span> */}
                        <span className="block mt-2"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 192 512" className="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-primaryTwo px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>

                <NavLink to={'#'}
                    className="_min-w-[350px] bg-primaryTwo
                 h-fit border-[.1px]
                 border-primaryTwo rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{courseUnlocked ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-primaryTwo px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">Friday presentations</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Soft Skills Class</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">Nasomsoft Embedded Hub</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Notes on presentations every friday at Nasomsoft Embedded Hub</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        {/* <span className="text-[1.005rem]">View Library <span className="font-bold text-xl">&rarr;</span></span> */}
                        <span className="block mt-2"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 192 512" className="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-primaryTwo px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>

                <NavLink to={'#'}
                    className="_min-w-[350px] bg-primaryTwo
                 h-fit border-[.1px]
                 border-primaryTwo rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{courseUnlocked ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-primaryTwo px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">GNS</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Department of General Studies</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">Abubakar Tafawa Balewa University Bauchi</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Students Lecture Guide from 100 Level to 300 Level</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        {/* <span className="text-[1.005rem]">View Library <span className="font-bold text-xl">&rarr;</span></span> */}
                        <span className="block mt-2"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 192 512" className="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-primaryTwo px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>
                {/* )} */}
            </div>
        </section>
    </>)
}