import img_feather from "/Icon-feather-upload-cloud.svg";
import img_featherTwo from "/Group92.png";
import { ComboboxDemo } from "../../ui/selectWithSearch";


export default function UploadStage({ currentView }) {

    return (
        <div
            className={`w-full h-fit ${currentView === 1 ? "block" : "hidden"}`}
        >
            {/* first stage 🐱‍👤😒 upload el onNext remove */}
            <div
                className={`w-[90%] h-[15rem] m-auto ${false ? "bg-[red]" : "bg-black"} ${!false && true && "hidden"} border-[3px] !border-[#FFFFF0] border-dashed before:block before:w-full relative before:h-full before:bg-[#FFFFF0]before:absolute before:top-0 before:left-0 before:pointer-events-none maxScreenMobile:w-full maxScreenMobile:bg-[black]maxScreenMobile:before:bg-black`}>
                {false && (
                    <input
                        type="file"
                        name="file"
                        onChange={() => { }}
                        accept=".ppt, .pptx, .pot, .pps, .pps, .potx, .ppsx, .ppam, .pptm, .potm, .ppsm"
                        multiple={false}
                        className="block w-full h-full bg-[red] cursor-pointer"
                    />
                )}
                <div
                    className={`flex flex-col gap-2 justify-center items-center w-full h-full ${false ? "bg-green-400" : false ? "bg-[rgba(255,165,0,0.3)]" : "bg-rose-400"} absolute top-0 left-0 pointer-events-none maxScreenMobile:bg-black`}>
                    <img
                        src={img_feather}
                        alt={img_feather}
                        className="block w-16 aspect-square maxScreenMobile:hidden"
                    />
                    <img
                        src={img_featherTwo}
                        alt={img_featherTwo}
                        className="hidden w-16 aspect-square maxScreenMobile:block"
                    />
                    {false ? (
                        <>
                            <span className="w-fit h-fit text-black">
                                File Upload successfully
                            </span>
                            <span className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full">
                                Change File...
                            </span>
                        </>
                    ) : true ? (
                        <>
                            <span className="w-fit h-fit text-black maxScreenMobile:text-white">
                                Drop your file in here
                            </span>
                            <span className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full maxScreenMobile:bg-white">
                                Browse...
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="w-fit h-fit text-black">
                                Error you can&apos;t upload right now
                            </span>
                            <button
                                type="button"
                                onClick={() => { }}
                                className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full"
                            >
                                Reload
                            </button>
                        </>
                    )}
                </div>
                {false && (
                    <p className="text-[red] text-lg mt-2 maxScreenMobile:w-[90%] maxScreenMobile:mx-auto">{""}</p>
                )}
            </div>
            {/* Title */}
            <div className="w-[90%] h-fit m-auto mt-14 text-lg text-black">
                <label htmlFor="title" className="block mb-2">
                    <sup className="w-full text-xl font-bold">*</sup>Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={""}
                    onChange={() => { }}
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                />
                {false && (
                    <p className="text-[red]">{false}</p>
                )}
            </div>
            {/* Description (Optional) */}
            <div className="w-[90%] h-fit m-auto mt-8 text-lg text-black">
                <label htmlFor="textarea" className="block mb-2">
                    <sup className="w-full text-xl font-bold"></sup>Description
                    (Optional)
                </label>
                <textarea
                    id="textarea"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    rows="5"
                    cols="50"
                    name="description"
                    value={""}
                    onChange={() => { }}
                ></textarea>
                {false && (
                    <p className="text-[red]">{""}</p>
                )}
            </div>
            {/* Privacy/Downloadable */}
            <div className="flex justify-between w-[90%] m-auto mt-6">
                <div className="w-[48%] h-fit mt-6 text-lg text-black">
                    <label htmlFor="publicSelector" className="block mb-2">
                        <sup className="w-full text-xl font-bold">*</sup>Privacy
                    </label>
                    <select
                        name="privacy"
                        id="publicSelector"
                        onChange={() => { }}
                        className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                        <option value="TEMP">Temprary</option>
                    </select>
                    {false && (
                        <p className="text-[red]">{""}</p>
                    )}
                </div>

                <div className="w-[48%] h-fit mt-6 text-lg text-black">
                    <label htmlFor="downloadSelector" className="block mb-2">
                        <sup className="w-full text-xl font-bold">*</sup>Downloadable
                    </label>
                    <select
                        name="downloadable"
                        id="downloadSelector"
                        onChange={() => { }}
                        className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    {false && (
                        <p className="text-[red]">{""}</p>
                    )}
                </div>
            </div>
            {/* Add Category */}
            <div className="flex justify-between w-[90%] m-auto mt-6">
                <div className="w-[48%] maxScreenMobile:w-full mr-auto flex flex-col justify-center _items-center h-fit mt-6 text-lg text-black">
                    <div className="w-full relative">
                        <label htmlFor="publicSelector" className="block mb-2">
                            <sup className="w-full text-xl font-bold">*</sup>Category
                        </label>
                        <div
                            className={`bg-white h-fit justify-between items-center overflow-hidden flex w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                        >
                            <ComboboxDemo frameworks={[
                                {
                                    value: "next.js",
                                    label: "Next.js",
                                },
                                {
                                    value: "sveltekit",
                                    label: "SvelteKit",
                                },
                                {
                                    value: "nuxt.js",
                                    label: "Nuxt.js",
                                },
                                {
                                    value: "remix",
                                    label: "Remix",
                                },
                                {
                                    value: "astro",
                                    label: "Astro",
                                },
                            ]} className="block outline-none" />
                            <button
                                type="button"
                                onClick={() => { }}
                                className="w-[45%] maxScreenMobile:text-[0.8rem] flex gap-1 justify-evenly items-center h-[2.8rem] p-2 bg-black border-black rounded-tr-md rounded-br-md maxScreenMobile:w-fit maxScreenMobile:p-4"
                            >
                                <span className="text-white text-[1rem] block w-fit h-fit italic maxScreenMobile:hidden">
                                    NEW
                                </span>
                            </button>
                        </div>
                        <div
                            className="hidden bg-white h-fit justify-between items-center overflow-hidden w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md transition-all mt-[20px]"
                        >
                            <input
                                type="text"
                                id="title"
                                value={""}
                                onChange={() => { }}
                                className="block w-[65%] p-2 indent-8 border-none border-black border-r-0 rounded-tl-md rounded-bl-md"
                                placeholder="ADD CATEGORY"
                            />
                            <button
                                type="button"
                                className="w-[45%] flex gap-1 justify-center items-center h-full p-2 bg-black border-none border-black rounded-tr-md rounded-br-md cursor-pointer"
                                onClick={() => { }}
                            >
                                <span className="text-white text-[1rem] block w-fit h-fit italic">
                                    ADD
                                </span>
                            </button>
                        </div>
                    </div>

                    {false ? (
                        <p className="text-[red]">{""}</p>
                    ) : (
                        false && (
                            <p className="text-[red]">{""}</p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}