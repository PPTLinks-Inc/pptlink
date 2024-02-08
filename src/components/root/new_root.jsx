// import { NavLink } from "react-router-dom";
import banner_img from "/team/pptlink_resources/slide.png"
import card_img from "/team/pptlink_resources/Rectangle 4.png"
import "../../assets/styles/general_css.css"
import { AiFillCaretDown } from "react-icons/ai";

export default function NewRoot() {
    console.log("it has begun...");
    return (
        <section className="parent_page_wrapper min-h-[100svh] w-full rounded-t-[50px]">
            <div className="banner rounded-t-[50px] relative w-full min-h-screen min-h-[100svh] text-white">
                <header className="pt-20 rounded-t-[50px]">
                    <div className="container flex justify-between items-center">
                        <div className="logo_wrapper">
                            <a href="/">PPTLINKS</a>
                        </div>
                        <button className="w-[25px] h-[25px]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="!w-full !h-full" viewBox="0 0 36 31.365">
                                <path id="Icon_open-menu" data-name="Icon open-menu" d="M0,0V4.5H36V0ZM0,13.365v4.5H36v-4.5Zm0,13.5v4.5H36v-4.5Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                </header>
                <div className="container h-full text-center">
                    <div className="flex flex-col justify-between items-center pt-[4rem]">
                        <h1 className="text-[4rem] mb-5">GET PRESENTIBLE</h1>
                        <p className="w-3/5 text-sm leading-6 text-center mb-10">Lorem ipsum dolor sit amet,
                            At vero eos et Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi animi sunt fugiat doloremque, iure aperiam magnam quod quia, placeat explicabo distinctio, doloribus mollitia quae asperiores unde perferendis perspiciatis quis incidunt?
                        </p>
                        <div className="banner_btns w-3/5 mx-[auto] flex justify-between items-center">
                            <button className="w-2/5 bg-[white] text-black text-2xl p-2 rounded-[2rem]">Present</button>
                            <button className="w-2/5 bg-[white] text-black text-2xl p-2 rounded-[2rem]">Libraries</button>
                        </div>
                    </div>
                    <div className="banner_img w-full m-auto">
                        <img src={banner_img}
                            alt={banner_img}
                            className="w-full" />
                    </div>
                </div>
            </div>
            <div className="recent relative w-full min-h-screen min-h-[100svh] text-white text-justify">
                <div className="container">
                    <div className="flex flex-col items-center text-black">
                        <h2 className="text-[3rem]">RECENT</h2>
                        <p className="p1 text-[1.8rem]">presentations</p>
                    </div>
                    <div className="cards_wrapper w-full my-20">
                        {/* ////////////////list start/////////////////////////////// */}
                        <div className="card _w-[300px] rounded-2xl">
                            <div className="card_img rounded-2xl border-2 border-solid border-slate-200">
                                <img
                                    src={card_img}
                                    alt={card_img}
                                    className="w-full _h-[150px] rounded-2xl" />
                            </div>
                            <div className="card_body pb-5">
                                <h3 className="title text-3xl text-ellipsis pt-3">Lorem, ipsum dolor.</h3>
                                <p className="pt-2"><strong>Presenter: </strong><em>Rvau  Alayna</em></p>
                                <p className="pt-2"><strong>Topc: </strong><em>edge computing</em></p>
                                <span>
                                    <AiFillCaretDown
                                        className="text-2xl cursor-pointer" /></span>
                            </div>
                        </div>


                        {/* //////////////////list end//////////////////////////////// */}
                    </div>
                </div>
            </div>
            <div className="why_pptlinks">

            </div>

            <div className="get_intouch">

            </div>

            <div className="footer">

            </div>
        </section>
    );
}
