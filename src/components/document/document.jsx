import { NavLink } from "react-router-dom";
import documentImg from "/team/pptlink_resources/documentation-svgrepo-com (1).svg";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
import initiative from "/team/pptlink_resources/initiative.png";
import planning from "/team/pptlink_resources/planning.png";
import execution from "/team/pptlink_resources/execution.png";
import controlSystem from "/team/pptlink_resources/control-system.png";
import conclusion from "/team/pptlink_resources/conclusion.png";
import others from "/team/pptlink_resources/other.png";

export default function Document() {
  return (
    <>
      <section className="bg-black">
        <div className="container min-h-fit py-10 flex flex-col justify-between items-center">
          <h1 className="text-5xl font-[400] uppercase mb-5">DOCUMENTATION</h1>
          <div className="w-[150px] aspect-square mb-5">
            <img
              src={documentImg}
              alt={documentImg}
              className="block w-full h-full"
            />
          </div>
          <p className="text-center w-[80%] text-[0.8rem] mb-10">
            Welcome to PPTLinks, your premier platform for easy sharing and
            viewing power point presentations. This section provides a
            comprehensive overview of what PPTLinks is, its purpose, and
            benefits it offers to its users.
          </p>
          <div className="w-[300px] h-fit rounded-[.5rem] border border-white relative mb-5">
            <input
              type="text"
              name="searcher"
              placeholder="Search for Articles & Contents"
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
      <section className="midJ container py-5 min-h-screen bg-[#FFFFF0]">
        <div className="flex flex-wrap justify-between items-center gap-y-16 gap-x-8 w-full mt-20 mb-10">
          {/* {Array(6).fill(0).map((_, i) => ({ id: i })).map(({ id }) => */}
          <div className="basis-[300px] grow-[1] min-h-[250px] bg-[#ffffff36] border border-[#FFA500] text-black rounded-md p-3 _text-center text-[.8rem] flex flex-col justify-between items-center">
            <div className="w-20 aspect-square mb-3">
              <img
                src={initiative}
                alt={initiative}
                className="block w-full h-full"
              />
            </div>
            <h3 className="text-xl mb-2">WHAT IS PPTLinks</h3>
            <div className="">
              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Proposal:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>

              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Charter:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>
            </div>
          </div>
          <div className="basis-[300px] grow-[1] min-h-[250px] bg-[#ffffff36] border border-[#FFA500] text-black rounded-md p-3 _text-center text-[.8rem] flex flex-col justify-between items-center">
            <div className="w-20 aspect-square mb-3">
              <img
                src={planning}
                alt={planning}
                className="block w-full h-full"
              />
            </div>
            <h3 className="text-xl mb-2">GETTING STARTED</h3>
            <div className="">
              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Proposal:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>

              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Charter:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>
            </div>
          </div>
          <div className="basis-[300px] grow-[1] min-h-[250px] bg-[#ffffff36] border border-[#FFA500] text-black rounded-md p-3 _text-center text-[.8rem] flex flex-col justify-between items-center">
            <div className="w-20 aspect-square mb-3">
              <img
                src={execution}
                alt={execution}
                className="block w-full h-full"
              />
            </div>
            <h3 className="text-xl mb-2">UPLOADING PRESENTATIONS</h3>
            <div className="">
              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Proposal:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>

              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Charter:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>
            </div>
          </div>
          <div className="basis-[300px] grow-[1] min-h-[250px] bg-[#ffffff36] border border-[#FFA500] text-black rounded-md p-3 _text-center text-[.8rem] flex flex-col justify-between items-center">
            <div className="w-20 aspect-square mb-3">
              <img
                src={controlSystem}
                alt={controlSystem}
                className="block w-full h-full"
              />
            </div>
            <h3 className="text-xl mb-2">GUIDELINES AND RULES</h3>
            <div className="">
              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Proposal:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>

              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Charter:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>
            </div>
          </div>

          <div className="basis-[300px] grow-[1] min-h-[250px] bg-[#ffffff36] border border-[#FFA500] text-black rounded-md p-3 _text-center text-[.8rem] flex flex-col justify-between items-center">
            <div className="w-20 aspect-square mb-3">
              <img src={others} alt={others} className="block w-full h-full" />
            </div>
            <h3 className="text-xl mb-2">OTHERS</h3>
            <div className="">
              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Proposal:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>

              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Charter:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>
            </div>
          </div>

          <div className="basis-[300px] grow-[1] min-h-[250px] bg-[#ffffff36] border border-[#FFA500] text-black rounded-md p-3 _text-center text-[.8rem] flex flex-col justify-between items-center">
            <div className="w-20 aspect-square mb-3">
              <img
                src={conclusion}
                alt={conclusion}
                className="block w-full h-full"
              />
            </div>
            <h3 className="text-xl mb-2">LEGAL</h3>
            <div className="">
              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Proposal:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>

              <NavLink to="#" className="block mb-3 text-justify text-[.7rem]">
                Project Charter:{" "}
                <span className="text-[#FFA500] underline decoration-[#FFA500]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  dolorum adipisci eligendi pariatur neque quas!
                </span>
              </NavLink>
            </div>
          </div>

          {/* )} */}
        </div>
      </section>
    </>
  );
}
