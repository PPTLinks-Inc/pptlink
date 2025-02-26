import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { MdCreditCard } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { IoMdPhonePortrait } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";
import useUser from "../../hooks/useUser";
import { useState } from "react";

export default function Payment() {
    const { userQuery } = useUser();
    const user = userQuery.data;
    const coursePrice = 108570.00; // Price in NGN
    const [selectedPayment, setSelectedPayment] = useState('card');
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can use selectedPayment here to determine payment flow
        e.target.submit();
    };

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
                    <span className="text-[#FFA500] font-bold text-xl">
                        {`₦${coursePrice.toLocaleString()}`}
                    </span>
                    <h2 className="text-3xl font-bold mb-2 mt-6">Payment Options</h2>
                    <form onSubmit={handleSubmit} method="POST" action="https://checkout.flutterwave.com/v3/hosted/pay" className="block w-full pt-2">
                        <div className="w-full flex flex-wrap justify-start items-center gap-10 mb-40 maxSmallMobile:flex-wrap-none maxSmallMobile:flex-col maxSmallMobile:mb-10">
                            <label htmlFor="option1" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full cursor-pointer">
                                <span className="block text-3xl"><MdCreditCard /></span>
                                <span>Credit/Debit</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input
                                        type="radio"
                                        name="paymentOptions"
                                        id="option1"
                                        value="card"
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full"
                                    />
                                </span>
                            </label>
                            <label htmlFor="option2" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full cursor-pointer">
                                <span className="block text-3xl"><BsBank /></span>
                                <span>Bank Transfer</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input
                                        type="radio"
                                        name="paymentOptions"
                                        id="option2"
                                        value="bank"
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full"
                                    />
                                </span>
                            </label>
                            <label htmlFor="option3" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full !cursor-not-allowed pointer-events-none relative before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0 before:bg-black/60 before:rounded-md">
                                <span className="block text-3xl"><IoMdPhonePortrait /></span>
                                <span>USSD</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input
                                        type="radio"
                                        name="paymentOptions"
                                        id="option3"
                                        value="ussd"
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full"
                                    />
                                </span>
                            </label>
                            <label htmlFor="option4" className="flex justify-between items-center gap-2 min-w-fit w-[calc((100%/4)-40px)] border border-[#FFA500] rounded-md p-2 maxSmallMobile:w-full !cursor-not-allowed pointer-events-none relative before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0 before:bg-black/60 before:rounded-md">
                                <span className="block text-3xl"><IoQrCode /></span>
                                <span>QR Code</span>
                                <span className="block w-fit aspect-square border-none rounded-full">
                                    <input
                                        type="radio"
                                        name="paymentOptions"
                                        id="option4"
                                        value="qr"
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="block w-5 aspect-square accent-[#FFA500] border-[#FFA500] rounded-full"
                                    />
                                </span>
                            </label>
                        </div>

                        <input type="hidden" name="public_key" value="FLWPUBK_TEST-f9c069130b91a7dc2a7930386caa51a9-X" />
                        <input type="hidden" name="tx_ref" value="bitethtx-019203" />
                        <input type="hidden" name="amount" value={coursePrice} />
                        <input type="hidden" name="currency" value="NGN" />
                        <input type="hidden" name="redirect_url" value="https://demoredirect.localhost.me/" />
                        <input type="hidden" name="meta[token]" value="54" />
                        <input type="hidden" name="customer[name]" value={`${user ? user.username : ""}`} />
                        <input type="hidden" name="customer[email]" value={`${user ? user.email : ""}`} />
                        <input type="hidden" name="configurations[session_duration]" value="10" />
                        <input type="hidden" name="configurations[max_retry_attempt]" value="5" />

                        <button type="submit" className="text-xl text-[#FFA500] block w-fit mx-auto border border-[#FFA500] px-10 py-2 rounded-md font-bold maxScreenMobile:w-full">Proceed To payment</button>
                    </form>
                </div>
            </div>
        </>
    );
};

