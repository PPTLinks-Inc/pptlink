import React, { useState } from "react";
import Icon_awesome_clock from "/Icon-awesome-clock.svg"; // Ensure this path is correct

const DateTest = () => {
  const [timeValue, setTimeValue] = useState(""); // Initialize with an empty string

  const handleIconClick = () => {
    const timeInput = document.getElementById("StartTime");
    if (timeInput) {
      if (timeInput.showPicker) {
        timeInput.showPicker(); // For modern browsers that support this method
      } else {
        timeInput.focus(); // Fallback for browsers that don't support showPicker
      }
    }
  };

  const handleTimeChange = (event) => {
    const newVal = event.target.value;
    setTimeValue(newVal); // Update the state with the new value
  };

  console.log(timeValue);

  return (
    <section className="bg-white text-black h-screen">
      <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg">
        <div className="w-full relative">
          <label htmlFor="StartTime" className="block mb-2">
            <span className="w-full text-xl font-bold">*</span>Start Time
          </label>
          <div
            className={`relative bg-[brown] w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow- ${false ? "border border-[red] outline-offset-2" : "border-none"
              }`}
          >
            <input
              type="time"
              id="StartTime"
              value={timeValue}
              onChange={handleTimeChange}
              className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
            />
            <button
              type="button"
              onClick={handleIconClick}
              className="absolute top-0 left-auto right-0 bottom-0 w-[35%] flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
            >
              <img
                src={Icon_awesome_clock}
                alt="Clock Icon"
                className="block w-4 h-4 scale-150 pointer-events-auto _aspect-square"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DateTest;
