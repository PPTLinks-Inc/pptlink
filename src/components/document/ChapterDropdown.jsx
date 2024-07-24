/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

function ChapterDropdown({
  data,
  id,
  activeDropdown,
  handleDropdownID,
  link
}) {
  const currentRef = useRef();
  
  const isActive = activeDropdown === id;
  const navigate = useNavigate();

  const [mainActive, setMainActive] = useState([
    { id: 1, bool: false },
    { id: 2, bool: false },
    { id: 3, bool: false },
    { id: 4, bool: false }
  ]);
 
  const onClick = (item, e) => {
    e.stopPropagation();
    setMainActive((prevState) => {
      return prevState.map((newItem) => {
        if (newItem.id === item.id) {
          return {
            ...newItem,
            bool: !newItem.bool
          };
        } else {
          return {
            ...newItem,
            bool: false
          };
        }
      });
    });
  };
  // const {chapter,path} = data
  return (
    <div>
      <li className="relative p-1 duration-1000 transition-all">
        {/* label for checkbox */}
        <label
          htmlFor="chapter"
          className="flex gap-2 md:gap-6 items-center pb-4_ transition-all duration-500"
          //   onClick={() => handleDropdown()}
          onClick={() => handleDropdownID(id)}
        >
          <div className="relative">
            {/* <input
                    type="radio"
                    name="chapter1"
                    id="chapter"
                    className="absolute z-50 w-5 aspect-square left-1/2 -translate-x-1/2 opacity-0 peer chapter"
                  /> */}
            <div className="w-5 h-5 bg-transparent border-2 border-black md:border-white rounded-full grid place-content-center">
              <div
                className={`w-3 h-3 rounded-full border-2 border-black md:border-white peer-checked:bg-white chapter-child ${isActive && "bg-black md:bg-white"}`}
              ></div>
            </div>
          </div>
          <div
            className="uppercase text-sm whitespace-nowrap font-semibold md:text-2xl"
            onClick={() => navigate(`/documentation${data.path}`)}
          >
            {" "}
            {data.chapter}
          </div>
        </label>
        <div className={`isActive ${isActive ? "active" : ""} `}>
          <div ref={currentRef} className={`overflow-hidden`}>
            {/* div for children */}
            {mainActive.map((item, i) => (
              <>
                <DropDown item={item} key={i} onClick={onClick} id={id} />
              </>
            ))}
          </div>
        </div>
      </li>
    </div>
  );
}

export default ChapterDropdown;

function DropDown({ item, onClick, id }) {
  const list = [1, 2, 3, 4];
  // console.log(id);
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
          
          element.scrollIntoView({
            behavior: "smooth"
          });
        }}
      >
        {/* <li id={id} className="mt-2">
          sub chapter {item.id}.1.1
        </li>
        <li className="mt-2">sub chapter {item.id}.1.1</li>
        <li className="mt-2">sub chapter {item.id}.1.1</li>
        <li className="mt-2">sub chapter {item.id}.1.1</li> */}
        {list.map((number) => {
          return (
            <li className="mt-2" key={number}>
              <a href={`#${id}-${item.id}-1-${number}`}>
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
