import { NavLink, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import LogoprimaryTwo from "../../images/Logo-primaryTwo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LibraryPage() {
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
            <div className="container h-fit py-10 flex flex-col justify-between items-start">
                <h1 className="text-3xl font-[400] uppercase mb-5">UI/UX Strategy Essentials</h1>
                <p className="uppercase text-[#FFA500]">Paid Program</p>
                <p className="text-[0.9rem] py-3 w-2/5 maxScreenMobile:w-4/5 maxSmallMobile:w-full maxSmallMobile:text-justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia sequi, dolor molestias repudiandae nobis voluptate quidem in voluptas id maiores, quae repellendus esse praesentium illum recusandae unde commodi tempora asperiores.</p>
                <div className="relative flex items-center justify-between gap-4 w-fit">
                    <span className="flex -space-x-4">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(index => (
                            <Avatar
                                key={index.toString()}
                                className="border-2 border-background block w-[2rem] h-[2rem] !rounded-[1rem]"
                                style={{ zIndex: index + 1 }}
                            >
                                <AvatarImage src={"/team/imoh.jpg"} alt={"imoh"} className="object-cover" />
                                <AvatarFallback>{"B"}</AvatarFallback>
                            </Avatar>
                        ))}
                    </span>
                    <span className="block w-fit responsiveTex text-white">25+ enrolled</span>
                </div>
                <div className="flex justify-between items-center gap-3 py-4">
                    <Link to="/pay" className="flex justify-between items-center gap-3 py-4 `w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]">Enroll Now</Link>
                    <span className="text-[#FFA500] font-bold text-xl">$45,330</span>
                </div>
            </div>
        </section>
        <div className="border-t-2 border-b-2 bg-primaryTwo border-t-white border-b-white">
            <div className="container py-3 flex justify-between items-center gap-2 maxScreenMobile:flex-col maxScreenMobile:items-start">
                <p><span>#</span>3 Months</p>
                <p><span>#</span>Beginner</p>
                <p><span>#</span>Last Uploaded August 17 2024</p>
            </div>
        </div>
        <section className="bg-primaryTwo min-h-[50vh]">
            <h2 className="container text-xl font-bold text-white capitalize pt-8 pb-4">Courses in this Program</h2>
            {/* start */}
            <div className="container !pb-8">
                <p className="px-6 py-4 bg-[#FFFFF0] border-0 !rounded-md">
                    <span className="block w-fit text-[#FFA500] text-md mb-1 font-semibold">Course 1-47 minutes</span>
                    <span className="block w-fit text-primaryTwo text-xl capitalize">Welcome to UI/UX Course</span>
                </p>
                <div className="courses my-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3 maxScreenMobile:grid-cols-2 maxSmallMobile:grid-cols-1">
                    {/* start */}

                    {Array.from({ length: 3 }, (_, i) => i + 1).map(idx => (
                        <div key={idx.toString()} className="border-2 border-[#FFFFF0] rounded-md p-3">
                            <img src="/team/imoh.jpg" alt="imoh" className="block mb-3 w-12 aspect-square border-0 rounded-md object-cover" />
                            <div className="flex flex-col justify-between items-start gap-2">
                                <h3 className="font-semibold text-base">Ideation and Validation</h3>
                                <p className="text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. Minus repudiandae at incidunt hic nihil unde nulla odit?</p>
                                <NavLink to="#" target="_blank" className="block underline">Learn More...</NavLink>
                            </div>
                        </div>
                    ))}
                    {/* end */}

                </div>
            </div>
            <div className="container !pb-8">
                <p className="px-6 py-4 bg-[#FFFFF0] border-0 !rounded-md">
                    <span className="block w-fit text-[#FFA500] text-md mb-1 font-semibold">Course 1-47 minutes</span>
                    <span className="block w-fit text-primaryTwo text-xl capitalize">Welcome to UI/UX Course</span>
                </p>
                <div className="courses my-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3 maxScreenMobile:grid-cols-2 maxSmallMobile:grid-cols-1">
                    {/* start */}

                    {Array.from({ length: 5 }, (_, i) => i + 1).map(idx => (
                        <div key={idx.toString()} className="border-2 border-[#FFFFF0] rounded-md p-3">
                            <img src="/team/imoh.jpg" alt="imoh" className="block mb-3 w-12 aspect-square border-0 rounded-md object-cover" />
                            <div className="flex flex-col justify-between items-start gap-2">
                                <h3 className="font-semibold text-base">Ideation and Validation</h3>
                                <p className="text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. Minus repudiandae at incidunt hic nihil unde nulla odit?</p>
                                <NavLink to="#" target="_blank" className="block underline">Learn More...</NavLink>
                            </div>
                        </div>
                    ))}
                    {/* end */}

                </div>
            </div>
            <div className="container !pb-8">
                <p className="px-6 py-4 bg-[#FFFFF0] border-0 !rounded-md">
                    <span className="block w-fit text-[#FFA500] text-md mb-1 font-semibold">Course 1-47 minutes</span>
                    <span className="block w-fit text-primaryTwo text-xl capitalize">Welcome to UI/UX Course</span>
                </p>
                <div className="courses my-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3 maxScreenMobile:grid-cols-2 maxSmallMobile:grid-cols-1">
                    {/* start */}

                    {Array.from({ length: 4 }, (_, i) => i + 1).map(idx => (
                        <div key={idx.toString()} className="border-2 border-[#FFFFF0] rounded-md p-3">
                            <img src="/team/imoh.jpg" alt="imoh" className="block mb-3 w-12 aspect-square border-0 rounded-md object-cover" />
                            <div className="flex flex-col justify-between items-start gap-2">
                                <h3 className="font-semibold text-base">Ideation and Validation</h3>
                                <p className="text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. Minus repudiandae at incidunt hic nihil unde nulla odit?</p>
                                <NavLink to="#" target="_blank" className="block underline">Learn More...</NavLink>
                            </div>
                        </div>
                    ))}
                    {/* end */}

                </div>
                <NavLink
                    to="/public_presentation"
                    className="block text-center text-[#FFA500] underline"
                >
                    See 8 more courses
                </NavLink>
            </div>
            {/* end */}
        </section>
        <section className="bg-primaryTwo w-full pb-4">
            <h3 className="container text-xl font-semibold pb-6 capitalize">Your Course Instructor</h3>
            <div className="instructors container my-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3 maxScreenMobile:grid-cols-2 maxSmallMobile:grid-cols-1">
                {/* start */}
                {Array.from({ length: 4 }, (_, i) => i + 1).map(idx => (
                    <div key={idx.toString()} className="border-2 border-[#FFFFF0] rounded-md p-3">
                        <img src="/team/imoh.jpg" alt="imoh" className="block mb-3 w-12 aspect-square border-0 rounded-md object-cover" />
                        <div className="flex flex-col justify-between items-start gap-2">
                            <h3 className="font-semibold text-base">Raahi H. Aljareem</h3>
                            <p className="text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. a odit?</p>
                            <NavLink to="#" target="_blank" className="block underline">Learn More...</NavLink>
                        </div>
                    </div>
                ))}
                {/* end */}
            </div>
        </section>
        <section className="bg-primaryTwo w-full pt-8 pb-16">
            <h3 className="container text-2xl text-center font-semibold pb-2 uppercase">PPTLINKS main selling points</h3>
            <p className="container text-sm text-center pb-6">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum quas, ullam odit consectetur suscipit corrupti nostrum tempora?</p>
            <div className="instructors container my-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3 maxScreenMobile:grid-cols-2 maxSmallMobile:grid-cols-1">
                {/* start */}
                {Array.from({ length: 4 }, (_, i) => i + 1).map(idx => (
                    <div key={idx.toString()} className="border-2 border-[#FFFFF0] rounded-md p-3">
                        <img src="/team/imoh.jpg" alt="imoh" className="block mb-3 w-12 aspect-square border-0 rounded-md object-cover" />
                        <div className="flex flex-col justify-between items-start gap-2">
                            <h3 className="font-semibold text-base">Raahi H. Aljareem</h3>
                            <p className="text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. a odit?</p>
                            <NavLink to="#" target="_blank" className="block underline">Learn More...</NavLink>
                        </div>
                    </div>
                ))}
                {/* end */}
            </div>
        </section>
    </>)
}