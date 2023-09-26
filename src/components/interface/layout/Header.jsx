// import logo from "./assets/logo.png";
// import headerImg from './assets/header-gradient.webp'
import { FaBars  } from "react-icons/fa";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
function Header({handleSideBar}) {

    const [sidebar, setSidebar] = useState(false)
  return (
   <>
   {/* <div className="absolute w-full top-0 left-0 right-0 ">
    <div className="relative h-[550px] overflow-hidden w-full">
        <picture className="w-[1440px] h-[550px] absolute top-0 left-1/2 -translate-x-1/2 right-0">
        <img src={headerImg} alt="" className="absolute w-full h-full inset-0" draggable='false'/>
        </picture>
    </div>

   </div> */}
   <header className="p-4 pl-6 flex justify-between items-center bg-black relative shadow-[white] z-50 w-full">
      <div className="mr-4 flex items-center">
        <button className="border-none p-2 rounded-full transition duration-400 hover:bg-blue"  onClick={() => {
            setSidebar(!sidebar)
            handleSideBar(!sidebar)}
            }>
          <FaBars className="text-white w-[25px] h-[25px]" />{" "}
        </button>
      </div>
      <div className="flex-1 relative ">
        
        <h1 className="text-center text-white font-bold text-xl tracking-widest cursor-pointer">PPTlink</h1>
      </div>
    </header>
   
   </>
  );
}

export default Header;