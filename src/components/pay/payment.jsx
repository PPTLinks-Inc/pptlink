import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { MdCreditCard } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { IoMdPhonePortrait } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";

export default function Payment() {
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
            <div className="min-h-[50vh] py-10 _text-black bg-primaryTwo">
                <div className="container">
                    <h1 className="text-3xl maxScreenMobile:text-2xl font-[400] uppercase mb-1">
                        Learn JavaScript in 1 Hour 😎
                    </h1>
                    <p className="uppercase text-[#FFA500]">Paid Program</p>
                    <p className="text-[0.9rem] pb-3 w-2/5 maxScreenMobile:w-4/5 maxSmallMobile:w-full maxSmallMobile:text-justify">
                        This is a brief course on JavaScript that will take you from a beginner to a pro in just 1 hour.
                        This course is designed to help you understand the basics of JavaScript and how to use it to build web applications.
                    </p>
                    <span className="text-[#FFA500] font-bold text-xl">{"$108,570.00"}</span>
                    <h2 className="text-3xl font-bold mb-2 mt-6">Payment Options</h2>
                    <form className="block w-full pt-2">
                        <div className="w-full flex flex-wrap justify-start items-center gap-10 mb-40 maxSmallMobile:flex-wrap-none maxSmallMobile:flex-col maxSmallMobile:mb-10">
                            <label htmlFor="option1" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full">
                                <span className="block text-3xl"><MdCreditCard /></span>
                                <span>Credit/Debit</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input type="radio" name="paymentOptions" id="option1" className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full" />
                                </span>
                            </label>
                            <label htmlFor="option2" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full">
                                <span className="block text-3xl"><BsBank /></span>
                                <span>Bank Transfer</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input type="radio" name="paymentOptions" id="option2" className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full" />
                                </span>
                            </label>
                            <label htmlFor="option3" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full">
                                <span className="block text-3xl"><IoMdPhonePortrait /></span>
                                <span>USSD</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input type="radio" name="paymentOptions" id="option3" className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full" />
                                </span>
                            </label>
                            <label htmlFor="option4" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full">
                                <span className="block text-3xl"><IoQrCode /></span>
                                <span>QR Code</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input type="radio" name="paymentOptions" id="option4" className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full" />
                                </span>
                            </label>
                        </div>

                        <button type="submit" className="text-xl text-[#FFA500] block w-fit mx-auto border border-[#FFA500] px-10 py-2 rounded-md font-bold maxScreenMobile:w-full">Proceed To payment</button>
                    </form>
                </div>
            </div>
        </>
    );
};

