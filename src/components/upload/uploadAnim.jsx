import upload_progress_svg from "/upload_progress_svg.svg";

export default function Uploadanimation({ cancelUpload, values, errors }) {
    return (
        <>
            {values.file && !errors.errors.file && (
                <div className="w-[70%] m-auto my-6 flex justify-between items-center">
                    <span className="block w-fit h-fit">
                        <img
                            src={upload_progress_svg}
                            alt={upload_progress_svg}
                            className="block w-32 aspect-square contrast-200"
                        />
                    </span>
                    <div className="w-[calc(100%-8rem)] ">
                        <div className="text-center relative">
                            <p className="text-[#ffa500] text-[1.2rem] font-light italic">
                                {`${values.file.name} Uploading...`}
                            </p>
                            <span className="block w-fit h-fit text-[#ffa500] text-[0.8rem] absolute left-auto right-0 top-[50%] translate-y-[-50%]">
                                3500kbs
                            </span>
                        </div>
                        <div className="w-full relative mt-4 p-[.15rem] rounded-full border-[2px] border-[#80808092] before:block before:w-[40%] before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-[#ffa500]"></div>
                    </div>
                    <button className="block border-none text-[#ffa500] text-[.8rem] shadow-md p-2 rounded ml-4" onClick={() => cancelUpload}>Cancel</button>
                </div>
            )}
        </>
    )
}