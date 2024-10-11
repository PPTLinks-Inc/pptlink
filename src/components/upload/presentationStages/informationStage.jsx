import { useState } from "react";
import { DatePicker, EndTimePicker, StartTimePicker } from "../calender";
import { Switch } from "@/components/ui/switch"

export default function InformationStage({ currentView, uploadValues, setUploadValues, handleInputChange }) {
    const [toggleDateTime, setToggleDateTime] = useState(false);

    return (
        <div
            className={`w-full h-fit ${currentView === 2 ? "block" : "hidden"}`}
        >
            {/* Presenter&apos;s Name */}
            <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black maxScreenMobile:pt-6">
                <label htmlFor="presenterName" className="block mb-2">
                    <sup className="w-full text-xl font-bold">*</sup>
                    Presenter&apos;s Name
                </label>
                <input
                    type="text"
                    name="presenterName"
                    id="presenterName"
                    value={uploadValues.presenterName}
                    onChange={handleInputChange} // Correct: Just pass the function, no need for "() => handleInputChange"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                />

                {false && (
                    <p className="text-[red]">{""}</p>
                )}
            </div>
            {/* Bio */}
            <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
                <label htmlFor="BioOptional" className="block mb-2">
                    <sup className="w-full text-xl font-bold"></sup>Bio (Optional)
                </label>
                <textarea
                    id="BioOptional"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    rows="5"
                    cols="50"
                    name="bio"
                    value={uploadValues.bio} // Correct: No need for a function
                    onChange={handleInputChange}
                />
                {false && (
                    <p className="text-[red]">{""}</p>
                )}
            </div>
            {/* Social Media Link */}
            <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
                <label htmlFor="socialMediaLink" className="block mb-2">
                    <sup className="w-full text-xl font-bold"></sup>Social Media
                    Link (Optional)
                </label>
                <input
                    type="text"
                    id="socialMediaLink"
                    name="socialMediaLink"
                    value={uploadValues.socialMediaLink}
                    onChange={handleInputChange}
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                />
                {false && (<p className="text-[red]">{""}</p>)}
            </div>
            {/* time of presentation */}
            <span className="bg-black border-none rounded-tr-md rounded-br-md text-[#ffa500] w-fit p-4 mt-8 text-xl font-medium flex justify-between items-center gap-2 maxScreenMobile:text-white maxScreenMobile:bg-[#ffa500] maxScreenMobile:border-[#ffa500]">
                <span>
                    Time of Presentation
                </span>
                <span>
                    <Switch setToggleDateTime={() => setToggleDateTime(prev => !prev)} />
                </span>
            </span>
            {/* time constants for presentaions */}
            {toggleDateTime && (
                <div className="flex maxScreenMobile:flex-col justify-between w-[90%] m-auto">
                    {/* 1 */}
                    {/* <DatePicker
                        handleChange={() => { }}
                        setValues={() => { }}
                        values={""}
                        errors={""}
                    /> */}

                    {/* 2 */}
                    <StartTimePicker
                        handleChange={() => { }}
                        setValues={() => { }}
                        values={""}
                        errors={""}
                    />

                    {/* 3 */}
                    <EndTimePicker
                        handleChange={() => { }}
                        setValues={() => { }}
                        values={""}
                        errors={""}
                    />
                </div>
            )}
            {/* end */}
        </div>
    )
}