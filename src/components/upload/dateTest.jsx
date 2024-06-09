import NativeDatepicker from "./reactNativeDatePicker";
import React, { useState } from "react";

const DateTest = () => {
  const [date, setDate] = useState("2024-06-08");

  const handleChange = (newValue) => {
    setDate(newValue);
  };
  console.log("Testing date: ", date);

  return (
    <div>
      <h1>Choose a Date</h1>
      {/* <NativeDatepicker value={date} onChange={handleChange} /> */}
      <NativeDatepicker
        value={date}
        onChange={(newValue) => setDate(newValue)}
      />
    </div>
  );
};

export default DateTest;
