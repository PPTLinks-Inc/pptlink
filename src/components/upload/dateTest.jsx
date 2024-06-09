import NativeDatepicker from "./reactNativeDatePicker";
import React, { useState } from "react";

const DateTest = () => {
  const [date, setDate] = useState("2024-06-08");

  const handleChange = (newValue) => {
    setDate(newValue);
  };
  console.log("Testing date: ", date);

  return (
    <>
      <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
        <div className="w-full relative">
          <label htmlFor="DateSelectionID" className="block mb-2">
            <span className="w-full text-xl font-bold">*</span>Date Selection
          </label>
          <div
            className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-2 focus:outline focus:outline-[1px] shadow-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
          >
            <input
              type="date"
              name=""
              id="DateSelectionID"
              className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
            />
            <label
              htmlFor="DateSelectionID"
              className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md"
            >
              <NativeDatepicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            </label>
          </div>
          {false && (
            <p className="text-[red]">{""}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DateTest;
