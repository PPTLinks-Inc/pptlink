import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import play from '/team/pptlink_resources/presentation-play-svgrepo-com.png';
import chat from '/team/pptlink_resources/presentation-svgrepo-com (1).png';
import meetingsvg from '/team/pptlink_resources/presentation-svgrepo-com (3).png';
import groupchats from '/team/pptlink_resources/presentation-svgrepo-com (4).png';
import flowchat from '/team/pptlink_resources/presentation-svgrepo-com (5).png';
import switchboard from '/team/pptlink_resources/presentation-whiteboard-svgrepo-com.png';
import "../../assets/styles/general_css.css";

export default function SignPage() {
    const [getlocation] = useState(useLocation().pathname === '/signup' ? true : false);

    return (
        <section className='signpage h-screen relative'>
            <div className="container h-full flex flex-row justify-between items-center gap-10  absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
                <div className="formwrapper relative w-[55%] bg-[#FFFFF0] h-[95vh] h-[95svh] rounded-[15px] p-10 maxScreenMobile:px-2 !text-[.8rem] overflow-auto maxScreenMobile:w-full">
                    <Link to="#" className="block text-md mb-3 font-[600]">PPTLINKS</Link>
                    <p className="mb-5 text-[.7rem]">{getlocation ? "Create Account" : "Welcome Back"}</p>
                    <h1 className="text-center text-3xl font-[400] mb-10">{getlocation ? "Sign Up" : "Sign In"}</h1>
                    <form action={getlocation ? "/signup" : "/signin"} method="post">
                        <div className={`flex justify-between items-center gap-4 mb-8 ${!getlocation && "!flex-col"} maxScreenMobile:flex-col`}>
                            <div className={`w-[50%] ${!getlocation && "!hidden"} maxScreenMobile:!w-full`}>
                                <label htmlFor="fullname" className="block w-full mb-2 pl-1" >*Username</label>
                                <input type="text" id="fullname" name="fullname" placeholder="Full Name" className="block w-full border-none indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md" />
                            </div>
                            <div className={`w-[50%] ${!getlocation && "!w-4/5"} maxScreenMobile:!w-full`}>
                                <label htmlFor="email" className="block w-full mb-2 pl-1" >*Email</label>
                                <input type="email" id="email" name="email" placeholder="eg: example@gmail.com" className="block w-full border-none indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md" />
                            </div>
                        </div>
                        <div className={`flex justify-between items-center gap-4 mb-8 ${!getlocation && "!flex-col !gap-2"}  maxScreenMobile:!flex-col`} >
                            <div className={`w-[50%] maxScreenMobile:!w-full ${!getlocation && "!w-4/5"}`}>
                                <label htmlFor="password" className="block w-full mb-2 pl-1" >*Password</label>
                                <input type="password" id="password" name="password" placeholder="**********" className="block w-full border-none indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md" />
                            </div>
                            <div className={`w-[50%] maxScreenMobile:!w-full ${!getlocation && "!hidden"}`}>
                                <label htmlFor="confirmpassword" className="block w-full mb-2 pl-1" >*confirmpassword</label>
                                <input type="password" id="confirmpassword" name="confirmpassword" placeholder="**********" className="block w-full border-none indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md" />
                            </div>
                        </div>
                        <button className="block w-3/5 m-auto mb-2 bg-black rounded-3xl text-white py-2 px-5 shadow-xl border-none maxScreenMobile:w-full">{getlocation ? "Sign Up" : "Sign In"}</button>
                        <p className="w-3/5 m-auto mt-4 text-center">{getlocation ? "Already have an account?" : "Don't have an account?"} <a href={getlocation ? "/signin" : "/signup"} className="text-[#FFA500]">{getlocation ? "Sign In" : "SIgn Up"}</a></p>
                        <a href="#" className={`block w-fit m-auto mt-4 text-center text-[#FFA500] ${getlocation && "hidden"}`}>Forgot password</a>
                    </form>
                    <div className="w-full mt-3 flex flex-col items-center justify-between gap-2">
                        <span className="flex w-full justify-center items-center mb-2">
                            <hr className="block w-[35%] h-[.1px] bg-black" />
                            <span className="block w-fit text-center mx-1 font-bold">Or</span>
                            <hr className="block w-[35%] h-[.1px] bg-black" />
                        </span>
                        <button disabled className="flex items-center justify-center w-3/5 border-[1px] border-black text-[.7rem] py-2 px-4 rounded-3xl maxScreenMobile:w-full hover:!font-normal hover:!cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-5 block w-[1.3rem] aspect-square" width="26.186" height="16.366" viewBox="0 0 26.186 16.366">
                                <path id="Icon_awesome-google-plus-g" data-name="Icon awesome-google-plus-g" d="M16.809,11.511a6.941,6.941,0,0,1,.134,1.362c0,4.678-3.137,7.993-7.859,7.993a8.183,8.183,0,0,1,0-16.366,7.817,7.817,0,0,1,5.481,2.143L12.343,8.776a4.6,4.6,0,0,0-3.26-1.262,5.17,5.17,0,0,0,0,10.338,4.432,4.432,0,0,0,4.644-3.528H9.083V11.511h7.725Zm7.9.274V9.41H22.324v2.375H19.949v2.387h2.375v2.375h2.387V14.172h2.375V11.785H24.711Z" transform="translate(-0.9 -4.5)" />
                            </svg>
                            <span>
                                Sign in with Google
                            </span>
                        </button>
                        <button disabled className="flex items-center justify-center w-3/5 border-[1px] border-black text-[.7rem] py-2 px-4 rounded-3xl maxScreenMobile:w-full hover:!font-normal hover:!cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-5 block w-[1.3rem] aspect-square" width="9.176" height="17.132" viewBox="0 0 9.176 17.132">
                                <path id="Icon_awesome-facebook-f" data-name="Icon awesome-facebook-f" d="M10.184,9.637l.476-3.1H7.685V4.524A1.55,1.55,0,0,1,9.433,2.849h1.352V.209A16.493,16.493,0,0,0,8.384,0C5.934,0,4.333,1.485,4.333,4.173V6.536H1.609v3.1H4.333v7.5H7.685v-7.5Z" transform="translate(-1.609)" />
                            </svg>
                            <span>
                                Sign in with Facebook
                            </span>
                        </button>
                    </div>
                    {/* svgs all over the area 😠🐱‍👤 */}
                    <img src={meetingsvg}
                        alt={meetingsvg}
                        className="block w-[8rem] h-[9rem] pointer-events-none  absolute top-[10%] left-[50%] translate-x-[-50%]" />

                    <img src={getlocation ? play : chat}
                        alt={getlocation ? play : chat}
                        className="block w-[4rem] aspect-square pointer-events-none  absolute bottom-[16%] left-[5%]" />

                    <img src={chat}
                        alt={chat}
                        className={`block w-[4rem] aspect-square pointer-events-none  absolute bottom-[25%] right-[2%] ${!getlocation && "hidden"}`} />

                    <img src={getlocation ? groupchats : switchboard}
                        alt={getlocation ? groupchats : switchboard}
                        className="block w-[4rem] aspect-square pointer-events-none  absolute bottom-[1%] right-[20%]" />

                    <img src={getlocation ? flowchat : play}
                        alt={getlocation ? flowchat : play}
                        className="block w-[4rem] aspect-square pointer-events-none  absolute top-[10%] right-[5%]" />
                </div>
                <div className="w-[45%] text-white maxScreenMobile:hidden">
                    <div className="min-h-[95vh] min-h-[95svh] flex flex-col justify-evenly items-center text-[#FFFFF0]">
                        <h1 className="block w-full text-right text-4xl">PPT LINKS</h1>
                        <p className="block w-full text-[.8rem] -mb-24 leading-6 text-justify">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor</p>
                    </div>
                </div>
            </div>
        </section>
    )
}