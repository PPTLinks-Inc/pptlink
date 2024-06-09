import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import Icon_metro_calendar from "/Icon-metro-calendar.svg";
import Icon_awesome_clock from "/Icon-awesome-clock.svg";
import NativeDatepicker from "./reactNativeDatePicker";

const DatePicker = ({ handleChange, values, errors }) => {
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getCurrentDate());
  const nativeDatepickerRef = useRef(null);

  useEffect(() => {
    if (nativeDatepickerRef.current) {
      nativeDatepickerRef.current.setValue(date);
    }
  }, [date]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setDate(newValue);
    handleChange({ target: { name: "date", value: newValue } });
  };

  const handleDatePickerChange = (newValue) => {
    setDate(newValue);
    handleChange({ target: { name: "date", value: newValue } });
  };

  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="DateSelectionID" className="block mb-2">
          <span className="w-full text-xl font-bold">*</span>Date Selection
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.date ? "border border-[red] outline-offset-2" : "border-none"}`}
        >
          <input
            type="date"
            name="date"
            id="DateSelectionID"
            value={date}
            onChange={handleInputChange}
            min={getCurrentDate()}
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            htmlFor="DateSelectionIDTwo"
            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
          >
            <NativeDatepicker
              id="DateSelectionIDTwo"
              ref={nativeDatepickerRef}
              value={date}
              onChange={handleDatePickerChange}
              min={getCurrentDate()}//no need cuz its not defined too, internally to be handled 🤦‍♀️ yet..
            />
          </label>
        </div>
        {errors.errors2?.date && (
          <p className="text-[red]">{errors.errors2.date}</p>
        )}
      </div>
    </div>
  );
};

const StartTimePicker = ({ handleChange, values, errors }) => {
  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="StartTime" className="block mb-2">
          <span className="w-full text-xl font-bold">*</span>Start Time
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow- ${errors.errors2?.startTime ? "border border-[red] outline-offset-2" : "border-none"}`}
        >
          <input
            type="time"
            name=""
            id="StartTime"
            onChange={handleChange}
            value={() => (!values.toggle ? "" : values.startTime)}
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            htmlFor="StartTime"
            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
          >
            <img
              src={Icon_awesome_clock}
              alt={Icon_awesome_clock}
              className="block w-4 h-4 scale-150 _aspect-square"
            />
          </label>
        </div>
        {errors.errors2?.startTime && (
          <p className="text-[red]">{errors.errors2.startTime}</p>
        )}
      </div>
    </div>
  );
};

const EndTimePicker = ({ handleChange, values, errors }) => {
  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="EndTime" className="block mb-2">
          <span className="w-full text-xl font-bold"></span>End Time (Optional)
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.endTime ? "border border-[red] outline-offset-2" : "border-none"}`}
        >
          <input
            type="time"
            name=""
            id="EndTime"
            onChange={handleChange}
            value={() => (!values.toggle ? "" : values.endTime)}
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            htmlFor="EndTime"
            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
          >
            <img
              src={Icon_awesome_clock}
              alt={Icon_awesome_clock}
              className="block w-4 h-4 scale-150 _aspect-square"
            />
          </label>
        </div>
        {errors.errors2?.endTime && (
          <p className="text-[red]">{errors.errors2.endTime}</p>
        )}
      </div>
    </div>
  );
};

export { DatePicker, StartTimePicker, EndTimePicker };
