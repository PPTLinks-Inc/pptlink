import { useRef } from "react";
import documentImg from "/team/pptlink_resources/documentation-svgrepo-com (1).svg";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
import Card from "../list/card";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function PublicPresentation() {
    const scrollRef = useRef();

    const presentationQuery = useQuery({
        queryKey: ["public-presentations"],
        queryFn: () => {
            return axios.get(
                "/api/v1/ppt/presentations?noPerPage=10&pageNo=1&public=true"
            );
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

    return (<>
        <section className="bg-black">
            <div className="container h-fit py-10 flex flex-col justify-between items-center">
                <h1 className="text-5xl font-[400] uppercase mb-5 maxScreenMobile:text-3xl maxScreenMobile:text-center">PUBLIC PRESENTATIONS</h1>
                <div className="w-[150px] aspect-square mb-5">
                    <img
                        src={documentImg}
                        alt={documentImg}
                        className="block w-full h-full"
                    />
                </div>
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
            </div>
        </section>

        <section className="public_presentations container py-5 h-fit bg-black">
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
        </section>
    </>)
}