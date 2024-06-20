import React, { useState, useRef, useEffect } from "react";
import Icon_awesome_clock from "/Icon-awesome-clock.svg";
import NativeDatepicker from "./reactNativeDatePicker";

const DatePicker = ({ handleChange, setValues, values, errors }) => {
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getCurrentDate());
  const nativeDatepickerRef = useRef(null);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    validateDate(newValue);
  };

  const handleDatePickerChange = (newValue) => {
    validateDate(newValue);
  };

  const validateDate = (newValue) => {
    setDate(newValue);
    handleChange({ target: { name: "date", value: newValue } });
  };

  useEffect(() => {
    if (nativeDatepickerRef.current) {
      nativeDatepickerRef.current.setValue(date);
    }

    if (values.toggle === false) {
      setDate(null);
    } else {
      setValues(prev => ({ ...prev, date: getCurrentDate() }));
    }
  }, [date, values.toggle]);

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
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            htmlFor="DateSelectionIDTwo"
            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
          >
            {/* would have just used normal vjs event to trigger date model, but no offence its still a native library 🤦‍♂️🥂 */}
            <NativeDatepicker
              id="DateSelectionIDTwo"
              ref={nativeDatepickerRef}
              value={date}
              onChange={handleDatePickerChange}
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

const StartTimePicker = ({ handleChange, setValues, values, errors }) => {
  const startTimeRef = useRef(null);

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

  useEffect(() => {
    if (startTimeRef.current) {
      startTimeRef.current.value = values.startTime || "";
    }
  }, [values.startTime]);

  const handleStartTimeChange = (event) => {
    const newVal = event.target.value;
    setValues((prevValues) => ({ ...prevValues, startTime: newVal }));
    handleChange({ target: { name: "startTime", value: newVal } });
  };

  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="StartTime" className="block mb-2">
          <span className="w-full text-xl font-bold">*</span>Start Time
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.startTime ? "border border-[red] outline-offset-2" : "border-none"
            }`}
        >
          <input
            type="time"
            id="StartTime"
            ref={startTimeRef}
            value={values.startTime || ""}
            onChange={handleStartTimeChange}
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            type="button"
            aria-label="button"
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
        {errors.errors2?.startTime && (
          <p className="text-[red]">{errors.errors2.startTime}</p>
        )}
      </div>
    </div>
  );
};

const EndTimePicker = ({ handleChange, setValues, values, errors }) => {
  const endTimeRef = useRef(null);

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

  useEffect(() => {
    if (endTimeRef.current) {
      endTimeRef.current.value = values.endTime || "";
    }
  }, [values.endTime]);

  const handleEndTimeChange = (event) => {
    const newVal = event.target.value;
    setValues((prevValues) => ({ ...prevValues, endTime: newVal }));
    handleChange({ target: { name: "endTime", value: newVal } });
  };

  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="EndTime" className="block mb-2">
          <span className="w-full text-xl font-bold">*</span>End Time (Optional)
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.endTime ? "border border-[red] outline-offset-2" : "border-none"
            }`}
        >
          <input
            type="time"
            id="EndTime"
            ref={endTimeRef}
            value={values.endTime || ""}
            onChange={handleEndTimeChange}
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            type="button"
            aria-label="button"
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
        {errors.errors2?.endTime && (
          <p className="text-[red]">{errors.errors2.endTime}</p>
        )}
      </div>
    </div>
  );
};


export { DatePicker, StartTimePicker, EndTimePicker };
