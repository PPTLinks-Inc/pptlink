/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import heroSection from "/Rectangle.png";
import box from "/imgs/Rectangle2.png";
import box2 from "/imgs/Rectangle150.png";
import React, { useEffect, useRef, useState } from "react";
import ChapterDropdown from "./ChapterDropdown";
import { motion, AnimatePresence } from "framer-motion";
import ChapterOverview from "./ChapterOverview";
import ChapterOverView1 from "./ChapterOverView1";
import Legacy from "./Legacy";
import { FaChevronCircleRight } from "react-icons/fa";

function Documentation({ activeDropdown, handleDropdownID }) {
  const currentRef = useRef();
  const documentWord = useRef();  
  const [nav, setNav] = useState(false);
const [chapterInfo,SetChapterInfo] = useState([ {chapter:"chapter one", path:'/'},{chapter:"chapter two",path:'/privacy'},{chapter:"chapter three",path:'/legacy'},{chapter:"chapter four",path:'/'},{chapter:"chapter five",path:'/'}])

 
 

  return (
    <main className="bg-black md:relative">
      <div className=" absolute top-0 hero-background bg-black_">
        <img
          src={heroSection}
          alt=""
          draggable="false"
          className="z-20 relative pointer-events-none w-full select-none"
        />
      </div>
      <div className="relative -top-3 md:-top-10 z-50 pointer-events-none select-none">
        <h1
          className="text-2xl md:text-4xl text-white text-center bg-transparent uppercase"
          ref={documentWord}
        >
          Documentation
        </h1>
      </div>
      <div className="flex container mx-auto items-start gap-4 md:gap-6">
        <aside
          className={`absolute text-black h-screen py-6 px-3 bg-body backdrop-blur-lg bg-opacity-50 left-0 top-0 md:flex-[0.4] z-[100]   ${nav ? "-translate-x-full" : "translate-x-0"} transition-all duration-1000 md:text-white md:sticky md:h-auto md:p-0 md:bg-opacity-100 md:bg-transparent md:backdrop-blur-0   md:translate-x-0`}
        >
          <ul className=" flex flex-col gap-4 md:gap-0 relative md:static">
            <button
              className="w-[25px] aspect-square absolute -top-5 -right-9 md:hidden"
              onClick={() => setNav((prevState) => !prevState)}
            >
              <FaChevronCircleRight
                className={`w-full h-full text-white ${nav ? "rotate-0" : "rotate-180"} transition-all duration-1000 `}
              />
            </button>
            {/* chapter one */}
            
            {chapterInfo.map((data,i) =>{
             return <ChapterDropdown key={i} data={data} id={i+1} activeDropdown={activeDropdown}
              handleDropdownID={handleDropdownID}  />
            })}

            {/* chapter 2 */}
            {/* <ChapterDropdown
              chapter={"chapter two"}
              key={2}
              id={2}
              activeDropdown={activeDropdown}
              handleDropdownID={handleDropdownID}
            /> */}
            {/* chapter 3 */}
            {/* <ChapterDropdown
              chapter={"chapter three"}
              key={3}
              id={3}
              activeDropdown={activeDropdown}
              handleDropdownID={handleDropdownID}
            /> */}
            {/* chapter 4 */}
            {/* <ChapterDropdown
              chapter={"chapter four"}
              key={4}
              id={4}
              activeDropdown={activeDropdown}
              handleDropdownID={handleDropdownID}
            /> */}
            {/* chapter 5 */}
            {/* <ChapterDropdown
              chapter={"chapter five"}
              key={5}
              id={5}
              activeDropdown={activeDropdown}
              handleDropdownID={handleDropdownID}
            /> */}
          </ul>{" "}
        </aside>
        <section className="flex-[1.8] relative z-[51] bg-body text-black rounded-tl-xl pt-12 p-5 documentation ">
          <Routes>
            <Route path="/" element={<ChapterOverView1 />} />
            <Route path="/privacy" element={<ChapterOverview />} />
            <Route path="/legacy" element={<Legacy />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

export default Documentation;

function DropDown({ item, onClick, i }) {
  console.log(item)
  const list = [1, 2, 3, 4];
  return (
    <div
      key={item.id}
      className="pl-10 whitespace-nowrap relative pb-1 cursor-pointer"
      id={item.id}
    >
      <div
        className="flex items-center gap-x-3"
        onClick={(e) => onClick(item, e)}
      >
        <div
          className={`${item.bool ? "rotate-90" : "rotate-0"} transition-all duration-300 pointer-events-none`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 "
            viewBox="0 0 9 18"
          >
            <path
              id="Icon_ionic-md-arrow-dropright"
              data-name="Icon ionic-md-arrow-dropright"
              d="M13.5,9l9,9-9,9Z"
              transform="translate(-13.5 -9)"
              fill="orange"
            />
          </svg>
        </div>
        <div className="bg-green-600_ text-sm font-medium ">
          sub chapter {item.id}.0{" "}
        </div>
      </div>
      <ul
        className={`overflow-hidden ${item.bool ? "h-[115px]" : "h-0"} pl-6 ml-8 sub-heading relative transition-all duration-300 flex flex-col gap-2_ text-sm`}
        onClick={(event) => {
          event.preventDefault();
          const target = event.target;
          const id = target.getAttribute("href")?.replace("#", "");
          const element = document.getElementById(id);
          console.log(id);
          element.scrollIntoView({
            behavior: "smooth"
          });
        }}
      >
        {list.map((number) => {
          return (
            <li className="mt-2" key={number}>
              <a href={`#${item.id}-1-${number}`}>
                sub chapter {item.id}.1.{number}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export { DropDown };
