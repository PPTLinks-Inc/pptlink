import { useState, useRef } from "react";
import documentImg from "/team/pptlink_resources/documentation-svgrepo-com (1).svg";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
import Ellipse from "/team/pptlink_resources/Ellipse23.png";
import Card from "../list/card";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CiSettings } from "react-icons/ci";

export default function NewDashboard() {
    const scrollRef = useRef();
    const [currentView, setCurrentView] = useState(1);
    const pageNo = 1;

    const presentationQuery = useQuery({
        queryKey: ["public-presentations"],
        queryFn: () => {
            return axios.get(//&public=true
                "/api/v1/ppt/presentations?noPerPage=10&pageNo=1")
        }
    });

    const containerVarient = {
        initial: {
            y: 50,
            opacity: 0
        },
        inView: {
            y: 0,
            opacity: 100,
            transition: {
                duration: 1,
                staggerChildren: 0.2,
                type: "spring",
                stiffness: 120
            }
        }
    };

    const handleView = (e) => {
        setCurrentView(parseInt(e.target.dataset.view));
    }

    return (<>
        <section className={`relative ${currentView === 3 ? "before:bg-[#FFFFF0] text-black" : "bg-black"}`}>
            <div className={`w-full h-fit pt-20`}>
                <div className={`container relative h-fit py-10 flex flex-col justify-between items-center ${currentView === 3 ? "bg-[#FFFFF0] rounded-t-lg" : "backdrop_el"} rounded-t-md`}>
                    <span className={`absolute top-8 right-8 text-2xl font-bold ${currentView !== 3 ? "text-[#FFA500]" : ""}`}><CiSettings /></span>
                    <span className="backdrop_el block mx-auto my-4 rounded px-3 py-1 text-[0.9rem]">My Profile</span>
                    <div className="w-[150px] aspect-square bg-[red] rounded-[50%]">
                        <img
                            src={Ellipse}
                            alt={Ellipse}
                            className="block w-full h-full"
                        />
                    </div>
                    <div className="w-[70%] mx-auto flex flex-col justify-between items-center gap-2 text-[0.9rem] text-center">
                        <h1 className="text-2xl mt-2">Blanda Shany</h1>
                        <p>Legacy Paradigm Executive</p>
                        <div className="flex justify-between items-center gap-4">
                            <span className="flax flex-col justify-between items-center">
                                <span className="block w-fit mx-auto">22</span>
                                <span className="block w-fit mx-auto">Courses</span>
                            </span>
                            <span className="text-2xl">|</span>
                            <span className="flax flex-col justify-between items-center">
                                <span className="block w-fit mx-auto">22</span>
                                <span className="block w-fit mx-auto">Courses</span>
                            </span>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur.</p>
                    </div>
                </div>
            </div>
        </section>

        <section className={`py-5 h-fit ${currentView === 3 ?  "bg-[#FFFFF0] text-black" : "bg-black text-white"}`}>
            <div className={`${currentView == 3 ? "bg-[#FFFFF0] container_" : "bg-black"} h-fit flex justify-evenly items-center border-b-2 ${currentView === 3 ?  "border-b-black" : "border-b-white"}`}>
                <button onClick={handleView} data-view="1" className={currentView === 1 ? `block w-[8rem] ${currentView === 3 ?  "text-black" : "text-white"} p-2 border-2 ${currentView === 3 ?  "border-black" : "border-white"} ${currentView === 3 ?  "!border-b-[white]" : "!border-b-[black]"} _!z-10 before:block before:w-full before:h-fit before:py-2 ${currentView === 3 ?  "before:bg-[#FFFFF0] bg-[#FFFFF0]" : "before:bg-black bg-black"} relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]` : ``}>Upload</button>
                <button onClick={handleView} data-view="2" className={currentView === 2 ? `block w-[8rem] ${currentView === 3 ?  "text-black" : "text-white"} p-2 border-2 ${currentView === 3 ?  "border-black" : "border-white"} ${currentView === 3 ?  "!border-b-[white]" : "!border-b-[black]"} _!z-10 before:block before:w-full before:h-fit before:py-2 ${currentView === 3 ?  "before:bg-[#FFFFF0] bg-[#FFFFF0]" : "before:bg-black bg-black"} relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]` : ``}>Library</button>
                <button onClick={handleView} data-view="3" className={currentView === 3 ?  `block w-[8rem] ${currentView === 3 ?  "text-black" : "text-white"} p-2 border-2 ${currentView === 3 ?  "border-black" : "border-white"} ${currentView === 3 ?  "!border-b-[white]" : "!border-b-[black]"} _!z-10 before:block before:w-full before:h-fit before:py-2 ${currentView === 3 ?  "before:bg-[#FFFFF0] bg-[#FFFFF0]" : "before:bg-black bg-black"} relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]` : ``}>History</button>
            </div>
            <div className="w-full h-fit">
                <div className={`public_presentations container pt-12 pb-5 h-fit ${currentView == 1 ? "block" : "hidden"}`}>
                    {/* search */}
                    <div className="w-[300px] maxScreenMobile:!w-[90%] mx-auto h-fit rounded-[.5rem] border border-white relative mb-5">
                        <input
                            type="text"
                            name="searcher"
                            placeholder="Search for Libraries"
                            className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-black text-white"
                        />
                        <img
                            src={searchImg}
                            alt={searchImg}
                            className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
                        />
                    </div>
                    {/* end search */}
                    <div className={`w-full min-h-[100vh] flex justify-center items-center _bg-[purple]`}>
                        {presentationQuery.isSuccess && (
                            <motion.div
                                variants={containerVarient}
                                initial="initial"
                                whileInView="inView"
                                viewport={{ once: true }}
                                className="cards_wrapper w-full mt-20 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth"
                                ref={scrollRef}
                            >
                                {presentationQuery.data.data.presentations.map((presentation) => (
                                    <Card key={presentation.id} presentation={presentation} />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
                <div className={`w-full min-h-[100vh] flex flex-col justify-center items-center pt-12 _bg-[gold] ${currentView == 2 ? "block" : "hidden"}`}>
                    {/* search */}
                    <div className="w-[300px] maxScreenMobile:!w-[90%] h-fit rounded-[.5rem] border border-white relative mb-5">
                        <input
                            type="text"
                            name="searcher"
                            placeholder="Search for Libraries"
                            className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-black text-white"
                        />
                        <img
                            src={searchImg}
                            alt={searchImg}
                            className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
                        />
                    </div>
                    {/* end search */}
                    <div className={`container _w-full min-h-[100vh] flex justify-center items-center _bg-[purple]`}>
                        <h1>No Librarey yet</h1>
                    </div>
                </div>
                <div className={`w-full min-h-[100vh] flex flex-col justify-center items-center pt-12 _bg-[purple] ${currentView == 3 ? "block" : "hidden"}`}>
                    {/* search */}
                    <div className="w-[300px] maxScreenMobile:!w-[90%] h-fit rounded-[.5rem] border border-white relative mb-5">
                        <input
                            type="text"
                            name="searcher"
                            placeholder="Search for Libraries"
                            className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-black text-white"
                        />
                        <img
                            src={searchImg}
                            alt={searchImg}
                            className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
                        />
                    </div>
                    {/* end search */}
                    <div className={`container _w-full min-h-[100vh] flex justify-center items-center _bg-[purple]`}>
                        <h1>No History yet</h1>
                    </div>
                </div>
            </div>
        </section>
    </>)
}
