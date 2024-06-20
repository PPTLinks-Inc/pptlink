/* eslint-disable react/prop-types */
import { LoadingAssetBig } from "../../assets/assets";
import upload_progress_svg from "/upload_progress_svg.svg";

export default function Uploadanimation({ cancelUpload, values, errors, uploadProgress, uploadProcessing }) {
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
                        {uploadProcessing ? (
                            <div className="w-full h-[2rem] flex justify-center items-center">
                                <LoadingAssetBig />
                            </div>
                        ) : (<>
                            <div className="text-center relative">
                                <p className="text-[#ffa500] text-[1.2rem] font-light italic">
                                    {`${values.file.name} Uploading...`}
                                </p>
                                <span className="block w-fit h-fit text-[#ffa500] text-[0.8rem] absolute left-auto right-0 top-[50%] translate-y-[-50%]">
                                    3500kbs
                                </span>
                            </div>
                            <progress id="upload-loader" className="w-full" max={100} value={uploadProgress}></progress>
                        </>)}
                    </div>
                    <button className="block border-none text-[#ffa500] text-[.8rem] shadow-md p-2 rounded ml-4" onClick={cancelUpload}>Cancel</button>
                </div>
            )}
        </>
    )
}