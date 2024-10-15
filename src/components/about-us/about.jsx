/* eslint-disable no-unused-vars */
import { useEffect, useReducer, useRef, useState } from "react";
import "./about.css";
// import React from "react";
// import { FaClose } from "react-icons/fa";

const members = [
  {
    bannerColor: "bg-green-400",
    row: "row-span-2",
    col: "col-span-2",
    image: "/team/imoh.jpg",
    index: 1,
    name: "Imoh",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam qui dolorem recusandae expedita pariatur, reprehenderit placeat quo dolorum, consequatur consequuntur blanditiis cupiditate delectus officia aliquam? At accusamus nostrum vero iusto distinctio molestias facere cupiditate hic reiciendis repudiandae?"
  },
  {
    // ///////////////////////////////////////////////////
    bannerColor: "bg-cyan-900",
    row: "row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/dorathy.jpg",
    index: 2,
    name: "Dorathy Paul",
    text: `I am Dorathy Paul, a web developer with a passion for creating digital experiences. I am currently pursuing a degree in Computer Science at Abubakar Tafawa Balewa University, I combine my academic knowledge with hands-on web development skills to craft dynamic and user-friendly websites. My journey is fueled by a desire to Innovate, solve problems and contribute to the ever-evolving world of technology. I am thrilled to be part of this project, and I'm looking forward to bringing a big change to the society together.`
  },
  {
    bannerColor: "bg-yellow-400",
    row: "row-span-2",
    col: "col-span-2 md:col-span-2",
    image: "/team/xavi.jpg",
    index: 3,
    name: "Xavier Anyanwu",
    text: `I’m Xavier Anyanwu, I’m a web development enthusiast, I’ve learnt to love tech and learnt a lot from it, like the importance of hardwork and the power of team work. What drives me is the level of innovation and creativity I want to share with  my generation and the next one..I believe there isn’t a limit to what we can archive.`
  },
  {
    bannerColor: "bg-purple-400",
    row: "md: row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/yoh.jpg",
    index: 4,
    name: "Yohanna Philip Abana",
    text: `I'm Yohanna Philip Abana, a passionate web developer and embedded systems enthusiast with a strong love for teaching and a constant thirst for challenges. I believe that technology can transform the world, and I'm committed to being a part of that change. Whether it's creating captivating web experiences or diving into the intricacies of embedded systems, I thrive on solving complex problems and pushing the boundaries of what's possible.
[11/5, 20:49] +234 706 553 7567: I am Dorathy Paul, a web developer with a passion for creati`
  },
  {
    bannerColor: "bg-cyan-600",
    row: "row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/mujeeb.jpg",
    index: 5,
    name: "Abimbola Mujeeb Ayodeji",
    text: `I am Abimbola Mujeeb Ayodeji,a frontend web developer,data analyst and 3D designer.
I am currently a final year student of ATBU Bauchi studying Automotive Engineering...My area of interest are in augmented reality ,data science and 3D modelling
I am passionate about teaching and passing my knowledge to make the world a better place and I'm happy to be a part of this project`
  },
  {
    bannerColor: "bg-pink-400",
    row: "row-span-4 md:row-span-2",
    col: "col-span-2 md:col-span-2",
    image: "/team/bright.jpg",
    index: 6,
    name: "Bright Onyedikachi Kingsley",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam qui dolorem recusandae expedita pariatur, reprehenderit placeat quo dolorum, consequatur consequuntur blanditiis cupiditate delectus officia aliquam? At accusamus nostrum vero iusto distinctio molestias facere cupiditate hic reiciendis repudiandae?"
  },
  {
    bannerColor: "bg-orange-400",
    row: "row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/sam.jpg",
    index: 7,
    name: "imoh",
    text: ""
  },
  {
    bannerColor: "bg-green-300",
    row: "row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/ray.jpg",
    index: 8,
    name: "Raymond A. Amem",
    text: `Raymond A. Amem, zealious kind for Tech. A WebDev and an Enthusiast for Web 3.0,  Embedded systems with a problem solving mindset. I seek to make end users have that full satisfaction when it comes to Frontend engineering and easily accessible to them without stress ✨.`
  },
  {
    bannerColor: "bg-indigo-400",
    row: "row-span-4",
    col: "col-span-2 md:col-span-1",
    image: "/team/kola.jpg",
    index: 13,
    name: "Kolawole Nelson Otitolaiye",
    text: `I am Kolawole Nelson Otitolaiye, a dedicated web developer driven by a relentless passion for continuous self-improvement. I approach each day with an unwavering commitment to growth and a great belief that every challenge, no matter how difficult, is an opportunity to grow my knowledge and skill set.`
  },
  {
    bannerColor: "bg-teal-400",
    row: "row-span-2",
    col: "col-span-2 md:col-span-2",
    image: "/team/baraka.jpg",
    index: 9,
    name: "Baraka Abdulazeez",
    text: `I'm Baraka Abdulazeez,I'm a software developer with a passion for tech,I'm currently pursuing a degree in chemical engineering at Abubakar Tafawa Balewa University,I hope to make tomorrow better than yesterday .I am thrilled to be part of this amazing project.`
  },
  {
    bannerColor: "bg-rose-400",
    row: "row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/sam.jpg",
    index: 10,
    name: "SAANMOYOL UNCLESAM",
    text: `I am SAANMOYOL UNCLESAM, A web developer. I specialize myself in designing and creating the web User Interface (UI).  Which is my basic skill in web development.`
  },
  {
    bannerColor: "bg-orange-400",
    row: "row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/mujeeb.jpg",
    index: 11,
    name: "imoh",
    text: ""
  },
  {
    bannerColor: "bg-sky-400",
    row: "row-span-2",
    col: "col-span-2 md:col-span-1",
    image: "/team/bright.jpg",
    index: 12,
    name: "imoh",
    text: ""
  }
];

let focusedMember = null;

const memberReducer = (memberState, action) => {
  return action;
};

// const showReducer = (showState, action) => {
//   return action;
// };

export default function About() {
  // const [active, setActive] = useState(false);
  const [intro, setIntro] = useState(true);

  const membersRef = useRef();
  // .ref?: React.LegacyRef<HTMLElement> | undefined
  // const memberRef = useRef();
  const topRef = useRef();

  const [memberState, memberDispatch] = useReducer(
    memberReducer,
    focusedMember
  );

  // const [showState, showDispatch] = useReducer<any>(showReducer, false);
  null;
  // const [focusedMember, setFocusedMember] = useState<number | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIntro(false);
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (memberState !== null) {
      topRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [memberState]);

  return (
    // <main className="relative w-screen_ h-screen mt-12">
    //   <div
    //     className={`fixed flex items-center transition-all duration-500 justify-center z-50 top-0 left-0 w-full h-full ${
    //       intro ? "opacity-1 -translate-y-0" : "opacity-0 translate-y-full"
    //     }`}
    //   >
    //     <p className="capitalize text-3xl font-bold">
    //       this page will not be black
    //     </p>
    //   </div>

    //   <div className="absolute top-0 z-50 w-1 h-1 bg-red-600" ref={topRef} />
    //   <section
    //     className={`h-full grid ${
    //       memberState
    //         ? "grid-cols-6 translate-y-[90vh]"
    //         : "grid-cols-6 translate-y-0"
    //     } md:p-12_ ${
    //       !memberState && "grid-rows-10_ md:grid-rows-6"
    //     } grid-flow-dense_ transition-all duration-1000 gap-2`}
    //   >
    //     {members.map((element, index) => (
    //       <div
    //         // ref={membersRef}events/my-events
    //         onClick={(e) => {
    //           e.preventDefault();
    //           memberDispatch(index + 1);
    //         }}
    //         className={`cell overflow-auto flex flex-col md:flex-row items-stretch rounded-r-md   ${
    //           element.bannerColor
    //         } ${
    //           memberState === index ? "z-20 gap-2 p-2" : "z-20 gap-0"
    //         } group transition-all duration-1000 overflow-clip cursor-pointer ${
    //           memberState
    //             ? "md:aspect-square max-h-sm_ !col-span-1 !row-span-1"
    //             : `$bg-yellow-500{element.col} ${element.row} aspect-auto`
    //         } ${
    //           memberState === index + 1
    //             ? "absolute w-[80vw] m-auto inset-0 -translate-y-[90vh] h-[80vh] open-cell"
    //             : "relative border-none trigger-cell"
    //         } `}
    //         key={index}
    //       >
    //         {memberState === index + 1 && (
    //           <button
    //             className="p-2 rounded-full bg-white text-4xl font-bold absolute top-4 right-4 z-[100] active:scale-75 transition-all duration-200 w-12 h-12 flex items-center justify-center"
    //             onClick={() => {
    //               membersRef.current?.scrollIntoView({
    //                 block: "start",
    //                 behavior: "smooth",
    //               });
    //               setTimeout(() => {
    //                 // showDispatch(false);
    //                 memberDispatch(null);
    //               }, 600);
    //             }}
    //           >
    //             X
    //           </button>
    //         )}
    //         {!memberState && (
    //           <div className="absolute top-0 left-0 z-50 flex w-full h-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100 bg-black/40">
    //             <div className="px-2 mt-auto h-fit">
    //               <h3 className="font-bold capitalize">{element.name}</h3>
    //               <p className="text-grid">{element.text}</p>
    //             </div>
    //           </div>
    //         )}
    //         <h1 className="absolute top-0 left-0 z-50 text-3xl text-black">
    //           {index + 1}
    //         </h1>

    //         {memberState === index + 1 && (
    //           <div className="flex-[3] shrink-0 bg-transparent md:hidden" />
    //         )}

    //         <div
    //           className={`overflow-clip absolute top-0 left-0 md:static self-center_  ${
    //             memberState ? "w-80 h-full" : "w-full h-full"
    //           }`}
    //         >
    //           <img
    //             src={element.image}
    //             alt=""
    //             className="object-cover transition-all h-full duration-1000 group-hover:scale-105 w-full"
    //           />
    //         </div>
    //         {
    //           <div
    //             className={`bg-gray-300/90_ text-white ${
    //               element.bannerColor
    //             } overflow-hidden transition-all duration-1000 ${
    //               memberState === index + 1
    //                 ? "md:w-[50vw] p-6 flex-[1] md:flex-[3] bg-gray-300/90_ space-y-4"
    //                 : "w-4 h-0_ text-none "
    //             }`}
    //           >
    //             <h2
    //               className={`transition-all capitalize duration-1000 text-3xl font-bold ${
    //                 memberState && memberState === index + 1
    //                   ? "opacity-100"
    //                   : "opacity-0"
    //               }`}
    //             >
    //               {element.name}
    //             </h2>
    //             <p
    //               className={`transition-all duration-1000 leading-loose ${
    //                 memberState && memberState === index + 1
    //                   ? "opacity-100"
    //                   : "opacity-0"
    //               }`}
    //             >
    //               {element.text}
    //             </p>
    //           </div>
    //         }
    //       </div>
    //     ))}
    //   </section>
    // </main>
    <main className="min-h-screen bg-[#FFFFF0] flex items-center justify-center">
      <h1 className="text-7xl font-bold text-black">In the works...</h1>
    </main>
  );
}

// ${active ? "flex-[1]":"w-1/2"}
// ${active ? "flex-[1]":"w-1/2"}
// ${active ? "flex-[1]":"w-1/2"}
