import React, { useState, useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import Icon_awesome_clock from "/Icon-awesome-clock.svg";
import { Calendar, FormatDate } from "@/components/ui/calendar";
// import { TimePicker } from "@/components/ui/customTimePicker"
import { SlCalender } from "react-icons/sl";

export default function InformationStage({ currentView, uploadValues, setUploadValues, uploadValuesErrors, handleInputChange }) {
    const [toggleDateTime, setToggleDateTime] = useState(false);
    const [toggleDateTimeDatePicker, setToggleDateTimeDatePicker] = useState(false);
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);

    const handleClickStartTime = () => {
        const timeInput = startTimeRef.current;
        if (timeInput) {
            if (timeInput.showPicker) {
                timeInput.showPicker();
            } else {
                timeInput.focus();
            }
        }
    };

    const handleClickEndTime = () => {
        const timeInput = endTimeRef.current;
        if (timeInput) {
            if (timeInput.showPicker) {
                timeInput.showPicker();
            } else {
                timeInput.focus();
            }
        }
    };

    useEffect(function () {
        setUploadValues((prevValues) => ({
            ...prevValues,
            presentationDate: "",
            presentationStartTime: "",
            presentationEndTime: "",
        }));
        setToggleDateTimeDatePicker(false);
    }, [toggleDateTime]);

    return (
        <div
            className={`w-full h-fit ${currentView === 2 ? "block" : "hidden"}`}
        >
            {/* Presenter&apos;s Name */}
            <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black maxScreenMobile:pt-12">
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
                {uploadValuesErrors.presenterNameError && (
                    <p className="text-[red]">{uploadValuesErrors.presenterNameError}</p>
                )}
            </div>
            {/* Bio */}
            <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
                <label htmlFor="BioOptional" className="block mb-2">
                    <sup className="w-full text-xl font-bold"></sup>Bio (Optional)
                </label>
                <textarea
                    id="BioOptional"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md resize-none ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    rows="5"
                    cols="50"
                    name="bio"
                    value={uploadValues.bio} // Correct: No need for a function
                    onChange={handleInputChange}
                />
                {uploadValuesErrors.bioError && (
                    <p className="text-[red]">{uploadValuesErrors.bioError}</p>
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
                {uploadValuesErrors.socialMediaLinkError && (<p className="text-[red]">{uploadValuesErrors.socialMediaLinkError}</p>)}
            </div>
            {/* time of presentation */}
            <span className="bg-black border-none rounded-tr-md rounded-br-md text-[#ffa500] w-fit p-4 mt-8 mb-6 text-xl font-medium flex justify-between items-center gap-2 _maxScreenMobile:text-white _maxScreenMobile:bg-[#ffa500] _maxScreenMobile:border-[#ffa500]">
                <label htmlFor="setToggleDateTime">
                    Time of Presentation
                </label>
                <span>
                    <Switch id="setToggleDateTime" setToggleDateTime={() => setToggleDateTime(prev => !prev)} />
                    {/* <Switch onChange={() => setToggleDateTime(prev => !prev)} /> */}
                </span>
            </span>
            {/* time constants for presentaions */}
            {toggleDateTime && (
                <div className="flex maxScreenMobile:flex-col justify-between w-[90%] m-auto relative">
                    {/* 1 */}
                    <div className="w-[30%] maxScreenMobile:w-full flex _justify-center items-center h-fit mt-6 text-lg text-black relative">
                        <div className="w-full relative">
                            <label htmlFor="DateSelectionID" className="block mb-2">
                                <span className="w-full text-xl font-bold">*</span>Date Selection
                            </label>
                            <div
                                className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-lg ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                            >
                                <input
                                    type="date"
                                    id="DateSelectionID"
                                    name="presentationDate"
                                    value={uploadValues.presentationDate || ""}
                                    onChange={handleInputChange}
                                    className="block w-[100%] p-1 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
                                />
                                <label
                                    aria-label="Open Date Picker"
                                    htmlFor="DateSelectionIDTwo"
                                    onClick={() => setToggleDateTimeDatePicker(prev => !prev)}
                                    className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
                                >
                                    <span className="_text-[#ffa500] !text-white">
                                        <SlCalender />
                                    </span>
                                </label>
                            </div>
                            {/* Datepicker model */}
                            {toggleDateTimeDatePicker && (
                                <div className="absolute top-auto bottom-[100%] left-auto right-0 z-50">
                                    <Calendar
                                        mode="single"
                                        selected={uploadValues.presentationDate || ""}
                                        onSelect={(date) => {
                                            // Call a custom handler to update the date in uploadValues
                                            setUploadValues((prevValues) => ({
                                                ...prevValues,
                                                presentationDate: FormatDate(date, 'YYYY-MM-DD'),
                                            }));
                                        }}
                                        className="rounded-md border !border-[#ffa500] bg-[#FFFFF0]"
                                    />
                                </div>
                            )}
                            {/* error */}
                            {uploadValuesErrors.presentationDateError && (
                                <p className="text-[red]">{uploadValuesErrors.presentationDateError}</p>
                            )}
                        </div>
                    </div>

                    {/* 2 */}
                    <div className="w-[30%] maxScreenMobile:w-full flex _justify-center items-center h-fit mt-6 text-lg text-black relative">
                        <div className="w-full relative">
                            <label htmlFor="StartTime" className="block mb-2">
                                <span className="w-full text-xl font-bold">*</span>Start Time
                            </label>
                            <div
                                className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-lg ${false ? "border border-[red] outline-offset-2" : "border-none"
                                    }`}
                            >
                                <input
                                    type="time"
                                    id="StartTime"
                                    ref={startTimeRef}
                                    name="presentationStartTime"
                                    value={uploadValues.presentationStartTime || ""}
                                    onChange={handleInputChange}
                                    className="block w-[100%] p-1 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
                                />
                                <label
                                    type="button"
                                    aria-label="Open Start Time Picker"
                                    htmlFor="StartTime"
                                    onClick={handleClickStartTime}
                                    className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
                                >
                                    <img
                                        src={Icon_awesome_clock}
                                        alt="Clock Icon"
                                        className="block w-4 h-4 scale-150 pointer-events-auto"
                                    />
                                </label>
                            </div>
                            {/* error */}
                            {uploadValuesErrors.presentationStartTimeError && (
                                <p className="text-[red]">{uploadValuesErrors.presentationStartTimeError}</p>
                            )}
                            {/* <TimePicker /> custom made 😉😁 */}
                            {/* {!true && <div className="absolute top-auto bottom-[100%] left-auto right-0 bg-[#FFFFF0] z-10">
                                <TimePicker
                                    onTimeChange={(hours, minutes, period) => {
                                        console.log(`Selected time: ${hours}:${minutes} ${period}`);
                                    }}
                                    className="rounded-md border !border-[#ffa500]"
                                />
                            </div>} */}
                        </div>
                    </div>

                    {/* 3 */}
                    <div className="w-[30%] maxScreenMobile:w-full flex _justify-center items-center h-fit mt-6 text-lg text-black">
                        <div className="w-full relative">
                            <label htmlFor="EndTime" className="block mb-2">
                                <span className="w-full text-xl font-bold">*</span>End Time (Optional)
                            </label>
                            <div
                                className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-lg ${false ? "border border-[red] outline-offset-2" : "border-none"
                                    }`}
                            >
                                <input
                                    type="time"
                                    id="EndTime"
                                    ref={endTimeRef}
                                    name="presentationEndTime"
                                    value={uploadValues.presentationEndTime || ""}
                                    onChange={handleInputChange}
                                    className="block w-[100%] p-1 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
                                />
                                <label
                                    type="button"
                                    aria-label="Open End Time Picker"
                                    htmlFor="EndTime"
                                    onClick={handleClickEndTime}
                                    className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
                                >
                                    <img
                                        src={Icon_awesome_clock}
                                        alt="Clock Icon"
                                        className="block w-4 h-4 scale-150 pointer-events-auto"
                                    />
                                </label>
                            </div>
                            {uploadValuesErrors.presentationEndTimeError && (
                                <p className="text-[red]">{uploadValuesErrors.presentationEndTimeError}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* end */}
        </div>
    )
}