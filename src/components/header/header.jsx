import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function Header({ bgcolor, handleDropdown }) {
    const [getlocation] = useState(useLocation().pathname === '/document' ? true : false);

    return (
        <header className={`absolute top-0 left-0 right-0 pt-10 pb-5 flex items-center justify-center 
        ${bgcolor ? "bg-[#FFFFF0]" : "bg-black"}`}>
            <div className="container flex justify-between items-center">
                <div className="logo_wrapper">
                    <Link to="/" className="hlogo uppercase block w-10 h-10">
                        PPTLINKS
                        {/* <svg width="800" height="600" id="logo_svg" className="block !w-full !h-full bg-[white]" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <title>Layer 1</title>
                                <g>
                                    <g id="svg_1">
                                        <metadata id="svg_3" />
                                        <g>
                                            <path fillRule="nonzero" fill="none" strokeMiterlimit="2.61313" strokeLinejoin="round" strokeLinecap="round" strokeWidth="40.27" stroke="black" d="m107.53482,125.93492c0,-1.31 1.06,-2.36 2.36,-2.36l113.68,0l0,-113.68c0,-1.3 1.06,-2.36 2.36,-2.36l464.17,0c1.31,0 2.36,1.06 2.36,2.36l0,464.17c0,1.31 -1.06,2.36 -2.36,2.36l-113.68,0l0,113.68c0,1.3 -1.06,2.36 -2.36,2.36l-464.17,0c-1.3,0 -2.36,-1.06 -2.36,-2.36l0,-464.17zm4.72,2.36l0,459.44l459.44,0l0,-111.32l-345.76,0c-1.3,0 -2.36,-1.06 -2.36,-2.36l0,-232.08c0,-1.3 1.06,-2.36 2.36,-2.36l345.76,0l0,-111.31l-459.44,0l0,-0.01zm575.48,-116.04l-459.44,0l0,111.32l345.76,0c1.3,0 2.36,1.06 2.36,2.36l0,232.08c0,1.3 -1.06,2.36 -2.36,2.36l-345.76,0l0,111.31l459.44,0l0,-459.44l0,0.01zm-116.04,232.08l-343.4,0l0,111.32l343.4,0l0,-111.32z" className="fil0 str0" />
                                            <path fillRule="nonzero" fill="black" d="m107.53482,125.93492c0,-1.31 1.06,-2.36 2.36,-2.36l113.68,0l0,-113.68c0,-1.3 1.06,-2.36 2.36,-2.36l464.17,0c1.31,0 2.36,1.06 2.36,2.36l0,464.17c0,1.31 -1.06,2.36 -2.36,2.36l-113.68,0l0,113.68c0,1.3 -1.06,2.36 -2.36,2.36l-464.17,0c-1.3,0 -2.36,-1.06 -2.36,-2.36l0,-464.17zm4.72,2.36l0,459.44l459.44,0l0,-111.32l-345.76,0c-1.3,0 -2.36,-1.06 -2.36,-2.36l0,-232.08c0,-1.3 1.06,-2.36 2.36,-2.36l345.76,0l0,-111.31l-459.44,0l0,-0.01zm575.48,-116.04l-459.44,0l0,111.32l345.76,0c1.3,0 2.36,1.06 2.36,2.36l0,232.08c0,1.3 -1.06,2.36 -2.36,2.36l-345.76,0l0,111.31l459.44,0l0,-459.44l0,0.01zm-116.04,232.08l-343.4,0l0,111.32l343.4,0l0,-111.32z" className="fil1" id="svg_2" />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg> */}
                    </Link>
                </div>

                <div className="btnGroup1 flex justify-between items-center">
                    <Link to="/" className="mr-5 uppercase">Dashboard</Link>
                    <button className="w-[25px] h-[25px]" onClick={() => handleDropdown()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="!w-full !h-full" viewBox="0 0 36 31.365">
                            <path id="Icon_open-menu" data-name="Icon open-menu" d="M0,0V4.5H36V0ZM0,13.365v4.5H36v-4.5Zm0,13.5v4.5H36v-4.5Z" strokeLinecap="round" fill={bgcolor ? "black" : "white"} />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}