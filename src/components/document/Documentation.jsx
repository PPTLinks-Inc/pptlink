/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import heroSection from "/Rectangle.png";
import box from "/imgs/Rectangle2.png";
import box2 from "/imgs/Rectangle150.png";
import React, { useEffect, useRef, useState } from "react";
import ChapterDropdown from "./ChapterDropdown";
import { motion, AnimatePresence } from "framer-motion";
import Pptlinks from "./Pptlinks";
import Start from "./Start";
import Legal from "./legal";
import Others from "./Other";
import Guidelines from "./Guidelines";
import Upload from "./Upload_presentation";
import { FaChevronCircleRight, FaArrowRight } from "react-icons/fa";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";

function Documentation({ activeDropdown, handleDropdownID }) {
  const currentRef = useRef();
  const documentWord = useRef();
  const [nav, setNav] = useState(false);
  const [chapterInfo, SetChapterInfo] = useState([
    { chapter: "what is pptLinks", path: '/what_is_pptLinks' }, { chapter: "getting started", path: '/getting_started' }, { chapter: "file upload", path: '/file_upload' }, { chapter: "guidelines", path: '/guidelines' }, { chapter: "others", path: '/others' }, { chapter: "legal", path: '/legal' }])




  return (
    <main className="bg-black md:relative">
      <Helmet>
        <title>{`Documentation - PPTLinks `}</title>
        <meta
          name='description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
        />
        <meta
          name='tags'
          content={`PPT, Presentations, Powerpoint, PPTLinks, publicPresentation, documentation/*, `}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`https://www.PPTLink.com/documentation/*`} />
        <meta property='og:title' content={`Documentation - PPTLinks `} />
        <meta
          property='og:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
        />
        <meta property='og:image' content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property='twitter:card' content='website' />
        <meta
          property='twitter:url'
          content={`https://www.PPTLink.com/documentation/*`}
        />

        <meta property='twitter:title' content={`Documentation - PPTLinks `} />
        <meta
          property='twitter:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
        />
        <meta property='twitter:image' content={LogoBlack} />
      </Helmet>
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
      <div className="hide_scroll w-full h-screen relative flex container mx-auto items-start gap-4 md:gap-6">
        <aside
          className={`sticky_grid text-black h-screen py-6 px-3 bg-body backdrop-blur-lg bg-opacity-50 left-0 top-0 md:flex-[0.4] z-[100]   ${nav ? "-translate-x-full" : "translate-x-0"} transition-all duration-1000 md:text-white md:sticky md:h-auto md:p-0 md:bg-opacity-100 md:bg-transparent md:backdrop-blur-0   md:translate-x-0`}
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

            {chapterInfo.map((data, i) => {
              return <ChapterDropdown key={i} data={data} id={i + 1} activeDropdown={activeDropdown}
                handleDropdownID={handleDropdownID} />
            })}


          </ul>{" "}
        </aside>
        <section className="flex-[1.8] relative z-[51] bg-body text-black rounded-tl-xl pt-12 p-5 documentation ">
          <Routes>
            <Route path="/what_is_pptLinks" element={<Pptlinks />} />
            <Route path="/getting_started" element={<Start />} />
            <Route path="/file_upload" element={<Upload />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/others" element={<Others />} />
            <Route path="/legal" element={<Legal />} />

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
