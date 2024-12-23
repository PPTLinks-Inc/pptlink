import { useState } from "react";
import { Link } from "react-router-dom";
import { CiVideoOn } from "react-icons/ci";
import { PiPresentationLight } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import logo_white from "/imgs/WHITE.png";
import LogoBlack from "../../images/Logo-Black.png";
import { Helmet } from "react-helmet";

export default function CreatePath() {
    const [stage, setStage] = useState(1);
    const [create, setCreate] = useState({
        type: "",
        category: "",
        name: "",
        message: "",
        file: "",
        dontHave: false,
    });

    const IncrementDecrementStage = (value) => {
        if (value === "increment") {
            setStage(stage >= 4 ? 4 : stage + 1);
        } else {
            setStage(stage <= 1 ? 1 : stage - 1);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreate({
            ...create,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setCreate({
            ...create,
            dontHave: false,
            file: e.target.files[0],
        });
    };

    return (
        <div className="bg-black w-full h-screen !text-white flex flex-col justify-between maxScreenMobile:justify-start items-center">
            <Helmet>
                <title>{`Create - PPTLinks `}</title>
                <meta
                    name='description'
                    content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
                />
                <meta
                    name='tags'
                    content={`PPT, Presentations, Powerpoint, Create PPTLinks`}
                />

                {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
                <meta property='og:type' content='website' />
                <meta property='og:url' content={`https://www.PPTLink.com/`} />
                <meta property='og:title' content={`Create - PPTLinks `} />
                <meta
                    property='og:description'
                    content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
                />
                <meta property='og:image' content={LogoBlack} />

                {/* meta tags to display information on twitter  */}
                <meta property='twitter:card' content='website' />
                <meta
                    property='twitter:url'
                    content={`https://www.PPTLink.com/`}
                />

                <meta property='twitter:title' content={`Create - PPTLinks `} />
                <meta
                    property='twitter:description'
                    content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
                />
                <meta property='twitter:image' content={LogoBlack} />
            </Helmet>
            <header className="w-full h-fit">
                <div className="container flex justify-between items-center gap-4">
                    <Link to="/" className="block w-fit">
                        <span className=" text-2xl md:text-3xl font-semibold maxScreenMobile:hidden">
                            PPTLINKS
                        </span>
                        <img
                            src={logo_white}
                            alt={logo_white}
                            className="hidden w-8 aspect-square maxScreenMobile:block"
                        />
                    </Link>
                    <div className=" pt-4 pb-4 pl-8 flex justify-between items-center w-[calc(80%-16px)] text-sm border-l-2 border-l-white maxScreenMobile:!w-fit maxScreenMobile:!border-none">
                        <span className="block w-fit maxScreenMobile:hidden">Step {stage} of 4</span>
                        <Link to="/" className="text-[#FFA500]">Exit</Link>
                    </div>
                </div>
            </header>

            <span className="hidden maxScreenMobile:block w-fit my-8 mx-auto">Step {stage} of 4</span>

            <section className={`w-3/6 h-fit flex flex-col justify-between items-center gap-6 maxScreenMobile:!w-[90%]`}>
                {stage === 1 && <><h1 className="w-full text-2xl md:text-3xl font-bold text-left maxScreenMobile:">What type of content are you working on?</h1>
                    <div className="w-fit h-fit grid grid-cols-2 gap-6 maxScreenMobile:grid-cols-1 maxScreenMobile:grid-rows-2">
                        <div className={`p-8 maxScreenMobile:p-4 flex flex-col justify-between items-start border-[1px] ${create.type === "Courses" ? "border-[#FFA500]" : "border-white"} rounded-md`} onClick={() => setCreate({ ...create, type: "Courses" })}>
                            <span className="block text-3xl mb-2"><CiVideoOn /></span>
                            <div>
                                <h6 className="text-md font-semibold mb-2">Courses</h6>
                                <p className="text-sm">Uncover the simplicity of crafting compelling courses using our efficient and user-friendly tool</p>
                            </div>
                        </div>
                        <div className={`p-8 maxScreenMobile:p-4 flex flex-col justify-between items-start border-[1px] ${create.type === "Presentation" ? "border-[#FFA500]" : "border-white"} rounded-md`} onClick={() => setCreate({ ...create, type: "Presentation" })}>
                            <span className="block text-3xl mb-2"><PiPresentationLight /></span>
                            <div>
                                <h6 className="text-md font-semibold mb-2">Presentation</h6>
                                <p className="text-sm">Unwind and create outstanding free presentation using our hassle-free tools, making presenting a breeze</p>
                            </div>
                        </div>
                    </div></>}
                {stage === 2 && <>
                    <h1 className="w-full text-2xl md:text-3xl font-bold text-left maxScreenMobile:">Choose a category for your content.</h1>
                    <div className="w-full h-fit">
                        <select
                            id="category"
                            name="category"
                            className={`bg-black border-[1px] ${create.category !== "" ? "border-[#FFA500]" : "border-white"} rounded-md text-white !text-sm block w-full py-4 indent-4`}
                            value={create.category}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>
                                Select Category
                            </option>
                            <option value="SD">Software development</option>
                            <option value="Design">Design</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                </>}
                {stage === 3 && <>
                    <h1 className="w-full text-2xl md:text-3xl font-bold text-left maxScreenMobile:">What fantastic name do you want to give to it?</h1>
                    <div className="w-full h-fit flex flex-col gap-4">
                        <input
                            type="text"
                            name="name"
                            className={`block w-full bg-transparent border-[1px] border-solid ${create.name !== "" ? "border-[#FFA500]" : "border-white"} rounded-md py-2 text-white text-sm indent-4`}
                            placeholder="Course Name"
                            value={create.name}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="message"
                            cols="auto"
                            rows="auto"
                            placeholder="Could you take some time to tell us more about the course you're looking to teach? We're eager to know all the details!"
                            className={`block w-full !h-32 bg-transparent border-[1px] border-solid ${create.message !== "" ? "border-[#FFA500]" : "border-white"} rounded-md p-4 resize-none text-white text-sm`}
                            value={create.message}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                </>}
                {stage === 4 && <>
                    <h1 className="w-full text-2xl md:text-3xl font-bold text-left maxScreenMobile:">Add a thumbnail image</h1>
                    <div className="w-fit h-fit grid grid-cols-2 gap-6 maxScreenMobile:grid-cols-1 maxScreenMobile:grid-rows-2 maxScreenMobile:w-full">
                        <div className={`p-8 maxScreenMobile:p-4 flex flex-col justify-between items-center border-[1px] ${create.file ? "border-[#FFA500]" : "border-white"} rounded-md`}>
                            <span className="block text-3xl mb-2"><CiImageOn /></span>
                            <div className="mb-2">
                                <h6 className="text-md font-semibold text-center mb-2">Upload an image</h6>
                                <p className="text-sm text-center">Aspect-ratio 16:9</p>
                            </div>
                            <button htmlFor="file" className="w-fit h-fit py-1 px-4 bg-black border-[1px] border-white rounded-md flex justify-between items-center gap-2" onClick={() => document.getElementById('file').click()}>
                                <span>Upload</span>
                                <MdOutlineFileUpload />
                            </button>
                            <input type="file" name="file" id="file" className="hidden" onChange={handleFileChange} />
                        </div>

                        <div className={`p-8 maxScreenMobile:p-4 flex flex-col justify-center items-center border-[1px] ${create.dontHave ? "border-[#FFA500]" : "border-white"} rounded-md`} onClick={() => setCreate({ ...create, file: "", dontHave: !create.dontHave })}>
                            <div>
                                <h6 className="text-md font-semibold text-center mb-2">I don&apos;t have one</h6>
                                <p className="text-sm text-center">Skip these for now, I&apos;ll do this later</p>
                            </div>
                        </div>
                    </div>
                </>}
            </section>

            <footer className="w-full h-fit pb-8 pt-3 maxScreenMobile:mt-auto maxScreenMobile:mb-0 maxScreenMobile:justify-self-end">
                <div className="container flex justify-between items-center">
                    <button className={`${stage === 1 ? "hidden" : "block"} py-2 px-8 bg-black border-[1px] border-white rounded-md`} onClick={() => IncrementDecrementStage("decrement")}>Previous</button>
                    <button className="block py-2 px-8 bg-black border-[1px] border-white rounded-md ml-auto" onClick={() => IncrementDecrementStage("increment")}>Next</button>
                </div>
            </footer>
        </div>
    )
}