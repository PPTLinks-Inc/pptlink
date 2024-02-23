import { Link } from "react-router-dom";
export default function Header({ bgcolor, handleDropdown }) {

    return (
        <header className={bgcolor ? "pt-20 pb-10 rounded-t-[50px] bg-[#FFFFF0] maxScreenMobile:pt-10" : "absolute top-0 left-0 right-0 z-10 pt-20 maxScreenMobile:pt-10 _rounded-t-[50px] bg-black"}>
            <div className="container flex justify-between items-center">
                <div className="logo_wrapper">
                    <Link to="/" className="hlogo">PPTLINKS</Link>
                </div>
                <button className="w-[25px] h-[25px]" onClick={() => handleDropdown()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="!w-full !h-full" viewBox="0 0 36 31.365">
                        <path id="Icon_open-menu" data-name="Icon open-menu" d="M0,0V4.5H36V0ZM0,13.365v4.5H36v-4.5Zm0,13.5v4.5H36v-4.5Z" fill={bgcolor ? "black" : "white"} />
                    </svg>
                </button>
            </div>
        </header>
    )
}