import { FaChevronUp, FaExpand, FaSync, FaCompress } from "react-icons/fa";
import Chat from "./layout/Chat";
import AnimateInOut from "../AnimateInOut";
import { FaHome, FaDownload } from "react-icons/fa";
import { useState } from "react";

let stopFunction = false;
let navBar = false;

const navItems = [
  {
    name: "download",
    icon: <FaDownload className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "home",
    icon: <FaHome className="text-2xl relative z-10" />,
    link: "/",
  },
];

export default function Actions({
  active,
  toggleFullScreen,
  presentation,
  syncButton,
  syncSlide,
  fullscreen,
  closeChatModal,
  setCloseChatModal,
}) {
  const [navbar, setNavbar] = useState(false);
  const [hovered, setActionsHovered] = useState(false);
  const [keepChatOpen, setKeepChatOpen] = useState(active || hovered);

  return (
    <>
      {/* <div className={`${keepChatOpen || active ? "" : "hidden"}`}> */}
      <div>
        <Chat
          closeChatModal={closeChatModal}
          setCloseChatModal={setCloseChatModal}
          setKeepChatOpen={setKeepChatOpen}
          active={active || hovered}
          keepChatOpen={keepChatOpen}
        />
      </div>
      {/* </div> */}
      <nav
        onMouseEnter={() => {
          setActionsHovered(true);
        }}
        onMouseLeave={() => setActionsHovered(false)}
        className={`h-16 w-16 rounded-full bottom-12 right-12  z-40 fixed transition-all duration-500 ${
          navbar ? "" : "active"
        } ${active || hovered || navbar ? "block" : "hidden"}`}
      >
        <ul
          className={`w-full h-full flex items-center justify-center select-none`}
        >
          <button
            title="Toggle fullscreen"
            aria-label="Toggle fullscreen"
            type="button"
            className={`absolute -left-14 z-50 rounded-full bg-black p-2 bottom-2 hover:bg-slate-400
                ${
                  !keepChatOpen || active || hovered || navbar
                    ? "block"
                    : "hidden"
                }
              `}
          >
            {fullscreen ? (
              <FaCompress
                size="30px"
                onClick={() => toggleFullScreen()}
                className="text-slate-200"
              />
            ) : (
              <FaExpand
                size="30px"
                onClick={() => toggleFullScreen()}
                className="text-slate-200"
              />
            )}
          </button>

          {/* sync button for viewers */}

          {presentation.User !== "HOST" && !syncButton && (
            <>
              <button
                onClick={() => syncSlide()}
                title={syncButton ? "" : "Sync"}
                className={`absolute -left-28 bottom-2 bg-black p-2 rounded-full z-50 hover:bg-slate-400  ${
                  syncButton ? "bg-black" : "bg-slate-400 "
                } z-50`}
              >
                <FaSync size="28px" className="text-slate-200" />
              </button>
              <div
                style={{
                  animationDelay: "-1s",
                }}
                className="pulsing__animation aspect-square absolute bg-slate-400 w-11 h-11  rounded-full -left-28 bottom-2  "
              ></div>
              <div
                style={{
                  animationDelay: "-2s",
                }}
                className="pulsing__animation aspect-square absolute bg-slate-400 w-11 h-11  rounded-full -left-28 bottom-2  "
              ></div>
              <div
                style={{
                  animationDelay: "-3s",
                }}
                className="pulsing__animation aspect-square absolute bg-slate-400 w-11 h-11  rounded-full -left-28 bottom-2  "
              ></div>
            </>
          )}
          <button
            onClick={() => {
              stopFunction = !stopFunction;
              setNavbar((prev) => !prev);
              navBar = !navBar;
            }}
            className={`text-slate-200 text-2xl rounded-full border active:scale-75 duration-200 border-white bg-black flex items-center z-20 justify-center w-full h-full active:bg-slate-200 transition-all select-none ${
              navBar ? "rotate-180" : "rotate-0"
            } `}
          >
            <FaChevronUp />
          </button>
          {navItems
            .filter(({ name }) => name !== "download" && presentation.pptLink)
            .map(({ icon, link, name }, i) => (
              <li
                key={i}
                className={`absolute w-[80%] rounded-full p-2 h-[80%] bg-black z-10 text-slate-200 border border-white transition-all  duration-500 ${
                  navbar && "duration-300"
                }`}
                style={{
                  transform: navbar
                    ? `translateY(-${(i + 1.1) * 100 + (i + 1) * 8}%)`
                    : "translateY(0)",
                  transitionDelay: `${(i + 1) / 10}s`,
                  zIndex: navItems.length - (i + 1),
                }}
              >
                <a
                  href={name === "download" ? presentation.pptLink : link}
                  className="w-full relative h-full flex items-center  justify-center flex-row-reverse"
                  download={name === "download" && presentation.name}
                >
                  <span className="">{icon}</span>
                  <span
                    className={`text-white absolute right-[calc(100%+1rem)] rounded-md p-2 shadow-md transition-all border-white border ${
                      navBar ? "opacity-100" : "opacity-0"
                    } duration-500 font-bold bg-black`}
                  >
                    {name}
                  </span>
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
}
