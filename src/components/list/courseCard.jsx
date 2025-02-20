/* eslint-disable react/prop-types */
// import { useState } from "react";
import { motion } from "framer-motion";
import { CiFileOn } from "react-icons/ci";
import { CiPlay1 } from "react-icons/ci";

export default function CourseCard({ content }) {
  return (
    <>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, type: "tween" }
        }}
        viewport={{ once: true }}
        className="card snap_scrolling_child w-full maxSmallMobile:!min-w-[285px] maxSmallMobile:!max-w-[285px] rounded-lg !pt-0 cursor-pointer aspect-[1/1.2] md:aspect-square border border-[#FFFFF0] relative"
      >
        <span className="block !w-full h-fit mb-4 z-10 border-none rounded-t-[0.33rem] bg-[#FFFFF0]">
          <span
            className={`w-[90%] mx-auto text-black font-bold py-1 flex justify-start items-center ${content?.live === undefined && "justify-between"}`}
          >
            <span>{content.type}</span>
            <span
              className={`flex justify-between items-center gap-2 ${content?.live !== undefined && "hidden"}`}
            >
              <span
                className="block w-fit h-fit p-1 bg-[red] border-none rounded-full"
              ></span>
              <span>Live</span>
            </span>
          </span>
        </span>

        <div className="card_img rounded-lg border-[1px] border-solid border-slate-200 mx-4 maxScreenMobile:mx-2 relative">
          {content.thumbnail ? (
            <img
              src={content.thumbnail}
              alt={`${content.name} presentation thumbnail`}
              className="block w-full aspect-[1/0.8] rounded-md object-cover text-center"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-[1/0.8] h-full bg-black/50 flex justify-center items-center" />
          )}
          <span className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none text-6xl font-black flex justify-center items-center bg-black/50 border-none rounded-[0.33rem]">
            {content.type === "VIDEO" ? <CiPlay1 /> : <CiFileOn />}
          </span>
        </div>

        <div
          className={`card_body pb-5 maxScreenMobile:pb-2 text-white mx-4 maxScreenMobile:mx-2`}
        >
          <h3 title={content.name} className="title font-medium w-full text-xl !maxScreenMobile:text-xl text-left pt-3 overflow-x-hidden whitespace-nowrap text-ellipsis">
            {content.name}
          </h3>
          <p className="w-full text-[.8rem] !maxScreenMobile:text-[.8rem] pt-2 font-light overflow-x-hidden whitespace-nowrap text-ellipsis">
            <strong>Tutor: </strong>
            <em>{"Imoh Yohanna"}</em>
          </p>
          <p className="w-full text-[.8rem] !maxScreenMobile:text-[.8rem] pt-2 font-light overflow-x-hidden whitespace-nowrap text-ellipsis">
            {content.type === "VIDEO" && (
              <>
                <strong>Duration: </strong>
                <em>
                  {(() => {
                    const seconds = content.videoMedia.duration;
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    const remainingSeconds = seconds % 60;
                    
                    if (hours > 0) {
                      return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
                    }
                    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
                  })()}
                </em>
              </>
            )}
          </p>
        </div>

        <div className="w-[90%] maxScreenMobile:w-[95%] mb-2 mx-auto bg-[#FFFFF0] border-none rounded p-1 relative flex justify-start items-center">
          <span className="block my-[0.2px] py-2 w-3/6 bg-[#FFA500] border-none rounded-lg"></span>
          <span className="text-black !text-[0.7rem] font-bold my-[0.2px] z-10 absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            16%
          </span>
        </div>
      </motion.div>
    </>
  );
}
