import Socials from "../social/socials";
import { Link } from "react-router-dom";
import Header from "../header/header";
import {
    ABOUT,
    LEGAL,
    LOGIN,
    UPLOAD,
} from "../../constants/routes";
export default function Backmenu({ handleDropdown }) {

    return (
        <div className="w-full h-full maxScreenMobile:overflow-auto">
            <Header bgcolor={true} handleDropdown={handleDropdown} />

            <div className="w-full h-[90vh]">
                <div className="flex-col w-[100%] h-[50%] flex-1 !border-0 justify-center flex lg:flex-wrap lg:flex-row">
                    <Link
                        to={LOGIN}
                        className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[4rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px]"
                    >
                        Signin
                    </Link>
                    <Link
                        to={UPLOAD}
                        className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[4rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px]"
                    >
                        Upload
                    </Link>
                    <Link
                        to={LEGAL}
                        className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[4rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px]"
                    >
                        Legal
                    </Link>
                    <Link
                        to={ABOUT}
                        className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[4rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px]"
                    >
                        About
                    </Link>
                </div>

                <div className="container m-auto border-slate-100 border-collapse text-left flex flex-col lg:flex-row">
                    <div className="flex-1 pr-5">
                        <h2 className="text-2xl mt-4 mb-6 font-medium">Our location</h2>
                        <p>
                            You can find us at Nascomsoft in Anguwan Cashew, Off dass road,
                            opposite Elim church, 740102, Yelwa, Bauchi Nigeria
                        </p>
                    </div>
                    <div className="flex-1 lg:pl-[2.5%]">
                        <h3 className="text-xl font-medium my-6">External</h3>
                        <Socials />
                    </div>
                </div>
            </div>
        </div>
    )
}