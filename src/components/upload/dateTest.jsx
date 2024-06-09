import React, { useState, useRef, useEffect } from "react";
import NativeDatepicker from "./reactNativeDatePicker";

const DateTest = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getCurrentDate);
  const nativeDatepickerRef = useRef(null);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setDate(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(date); 
  };

  useEffect(() => {
    if (nativeDatepickerRef.current) {
      nativeDatepickerRef.current.setValue(date);
    }
  }, [date]);

  return (
    <form onSubmit={handleSubmit}>
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
              onChange={handleChange}
              value={date}
              min={getCurrentDate()} // Set the min attribute to the current date
              className="block w-[100%] p-1 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
            />
            <label
              htmlFor="DateSelectionID2"
              className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
            >
              <NativeDatepicker
                ref={nativeDatepickerRef}
                id="DateSelectionID2"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                min={getCurrentDate()} // Ensure the NativeDatepicker respects the min date
              />
            </label>
          </div>
          {false && <p className="text-[red]">{"Error date"}</p>}
        </div>
      </div>
      <button
        type="submit"
        className="bg-black text-white p-2 rounded-md mt-2 text-[.9rem]"
      >
        Submit Form
      </button>
    </form>
  );
};

export default DateTest;
