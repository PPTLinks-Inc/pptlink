import { useState } from "react";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Helmet } from "react-helmet";
// import { useMutation } from "@tanstack/react-query";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import play from "/team/pptlink_resources/presentation-play-svgrepo-com.png";
// import chat from "/team/pptlink_resources/presentation-svgrepo-com (1).png";
// import meetingsvg from "/team/pptlink_resources/presentation-svgrepo-com (3).png";
// import groupchats from "/team/pptlink_resources/presentation-svgrepo-com (4).png";
// import flowchat from "/team/pptlink_resources/presentation-svgrepo-com (5).png";
// import switchboard from "/team/pptlink_resources/presentation-whiteboard-svgrepo-com.png";
// import { LoadingAssetSmall2 } from "../../assets/assets";
// import "../../assets/styles/general_css.css";
// import logo_orange from "/imgs/onemorecolor.png";
// import PopUpModal from "../Models/dashboardModel";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { RiVisaLine } from "react-icons/ri";
import { FaStripe } from "react-icons/fa";
import { FaPaypal } from "react-icons/fa";
import { RiMastercardFill } from "react-icons/ri";
import { FaGooglePay } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";

export default function Pay() {
    const [toggleSwitch, setToggleSwitch] = useState(false);

    return (
        <>
            <Helmet>
                <title>{`Pay - PPTLinks `}</title>
                <meta
                    name='description'
                    content='Make your powerpoint presentations payment for a course'
                />
                <meta
                    name='tags'
                    content={`PPT, Presentations, Powerpoint, PPTLinks, Pay`}
                />

                {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
                <meta property='og:type' content='website' />
                <meta property='og:url' content={`https://www.PPTLink.com/pay`} />
                <meta property='og:title' content={`Pay - PPTLinks `} />
                <meta
                    property='og:description'
                    content='Make your powerpoint presentations payment for a course'
                />
                <meta property='og:image' content={LogoBlack} />

                {/* meta tags to display information on twitter  */}
                <meta property='twitter:card' content='website' />
                <meta
                    property='twitter:url'
                    content={`https://www.PPTLink.com/pay`}
                />

                <meta property='twitter:title' content={`Pay - PPTLinks `} />
                <meta
                    property='twitter:description'
                    content='Make your powerpoint presentations payment for a course'
                />
                <meta property='twitter:image' content={LogoBlack} />
            </Helmet>
            <section className="absolute top-0 left-0 right-0 bottom-0 bg-black w-full h-full overflow-y-hidden maxScreenMobile:overflow-y-auto">
                <form onSubmit={(e) => { e.preventDefault(); alert("Submitted Successfully...") }} className="w-full h-full _grid _grid-cols-2 _grid-rows-1 flex justify-between items-center gap-0 maxScreenMobile:flex-col  maxScreenMobile:h-fit">
                    <div className={`w-[60%] h-full bg-black overflow-y-auto maxScreenMobile:!w-full maxScreenMobile:!h-fit ${toggleSwitch && "!bg-[#3c0a0a]"}`}>
                        <div className="container !text-white py-16">
                            <h3 className="text-2xl font-semibold _uppercase my-4">Checkout</h3>
                            <p className="py-3">Personal details</p>
                            <div className="w-full grid grid-cols-2 grid-rows-2 gap-2 pb-4 maxScreenMobile:grid-cols-1 maxScreenMobile:grid-rows-4">
                                <label htmlFor="address" className="block !w-full h-fit">
                                    <span className="block w-fit pb-2 text-sm">Address line</span>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        placeholder="Address Line"
                                        className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                    />
                                </label>
                                <label htmlFor="address" className="block !w-full h-fit">
                                    <span className="block w-fit pb-2 text-sm">City</span>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="City"
                                        className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                    />
                                </label>
                                <label htmlFor="address" className="block !w-full h-fit">
                                    <span className="block w-fit pb-2 text-sm">State</span>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        placeholder="State"
                                        className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                    />
                                </label>
                                <label htmlFor="address" className="block !w-full h-fit">
                                    <span className="block w-fit pb-2 text-sm">Postal Code</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        id="postal-code"
                                        name="postal-code"
                                        placeholder="Postal Code"
                                        className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                    />
                                </label>
                            </div>
                            <h3 className="text-2xl font-semibold _uppercase my-4">Payment Methods</h3>
                            <div className="flex justify-left items-center gap-2">
                                <span className="block text-4xl bg-[#FFFFF0] text-[blue] border-0 rounded-sm py-1 px-3"><RiVisaLine /></span>
                                <span className="block text-4xl bg-[#FFFFF0] text-[blue] border-0 rounded-sm py-1 px-3"><FaStripe /></span>
                                <span className="block text-4xl bg-[#FFFFF0] text-[blue] border-0 rounded-sm py-1 px-3"><FaPaypal /></span>
                                <span className="block text-4xl bg-[#FFFFF0] text-[red] border-0 rounded-sm py-1 px-3"><RiMastercardFill /></span>
                                <span className="block text-4xl bg-[#FFFFF0] text-[red] border-0 rounded-sm py-1 px-3"><FaGooglePay /></span>
                            </div>
                            <h3 className="text-2xl font-semibold _uppercase my-4">Cards details</h3>
                            <div className="flex flex-col justify-between items-start gap-3">
                                <label htmlFor="address" className="block !w-full h-fit">
                                    <span className="block w-fit pb-2 text-sm">Card Number</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]{10}"
                                        id="card-no"
                                        name="card-no"
                                        placeholder="Scan on card please..."
                                        className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                    />
                                </label>
                                <div className="w-full grid grid-cols-2 grid-rows-1 gap-2 pb-4 maxScreenMobile:grid-cols-1 maxScreenMobile:grid-rows-2">
                                    <label htmlFor="address" className="block !w-full h-fit">
                                        <span className="block w-fit pb-2 text-sm">Expirarity</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]{2}/[0-9]{2}"
                                            id="expirarity"
                                            name="expirarity"
                                            placeholder="20/23"
                                            className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                        />
                                    </label>
                                    <label htmlFor="address" className="block !w-full h-fit">
                                        <span className="block w-fit pb-2 text-sm">CVC</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d*"
                                            id="card-cvc"
                                            name="card-cvc"
                                            placeholder="555"
                                            className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                        />
                                    </label>
                                </div>
                                <label htmlFor="address" className="block !w-full h-fit">
                                    <span className="block w-fit pb-2 text-sm">Card holder name</span>
                                    <input
                                        type="text"
                                        id="card-holder-name"
                                        name="card-holder-name"
                                        placeholder="Scan on card please..."
                                        className={`block w-full border-[0.5px] bg-black border-[#FFFFF0] rounded-md py-2 indent-2 text-sm`}
                                    />
                                </label>
                            </div>
                            <label htmlFor="address" className="flex w-fit h-fit !justify-center !items-center gap-2 mt-4">
                                <span className="block w-fit pb-1 font-light italic text-lg">Save card details</span>
                                <Switch
                                    checked={toggleSwitch}
                                    onCheckedChange={() => setToggleSwitch(!toggleSwitch)}
                                    className="text-sm _block _w-full _h-full !bg-[#ffa500]"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="w-[40%] h-full pb-10 bg-[#FFFFF0] maxScreenMobile:!w-full maxScreenMobile:h-fit">
                        <div className="container py-16">
                            <h3 className="text-2xl font-semibold _uppercase my-4">Summery</h3>
                            <div className="mt-10 w-full h-fit pb-5 border-b-2 border-b-black text-gray-600">
                                <span className="flex justify-between items-center">
                                    <span>Price</span>
                                    <span>$48,887.99</span>
                                </span>
                                <span className="flex justify-between items-center">
                                    <span>Discount</span>
                                    <span>$48,887.99</span>
                                </span>
                            </div>
                            <span className="flex justify-between items-center font-bold my-10">
                                <span>Total</span>
                                <span>$0.00</span>
                            </span>
                        </div>
                        <button type="submit" className={`container bg-black text-white text-lg text-center block py-4 border-0 rounded-md ${toggleSwitch && "!bg-[#3c0a0a]"}`}>Checkout</button>
                    </div>
                </form>
            </section>
        </>
    );
}
