import * as React from "react";
import { cn } from "@/lib/utils";

export type TimePickerProps = {
  className?: string;
  onTimeChange?: (hours: number, minutes: number, period: "AM" | "PM") => void;
};

function TimePicker({ className, onTimeChange }: TimePickerProps) {
  const [hours, setHours] = React.useState(12);
  const [minutes, setMinutes] = React.useState(0);
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");

  const handleTimeChange = () => {
    if (onTimeChange) {
      onTimeChange(hours, minutes, period);
    }
  };

  const handleScrollChange = (type: "hours" | "minutes", value: number) => {
    if (type === "hours") {
      setHours(value);
    } else {
      setMinutes(value);
    }
    handleTimeChange();
  };

  const handlePeriodToggle = () => {
    setPeriod((prev) => (prev === "AM" ? "PM" : "AM"));
    handleTimeChange();
  };

  const renderScrollableColumn = (
    values: number[],
    selectedValue: number,
    type: "hours" | "minutes"
  ) => (
    <div className="flex-1 h-full overflow-y-scroll scrollbar-none flex flex-col items-center space-y-2">
      {values.map((value) => (
        <div
          key={value}
          className={cn(
            "text-md font-semibold cursor-pointer !text-[#ffa500] hover:text-[black]",
            selectedValue === value && "!text-[black]"
          )}
          onClick={() => handleScrollChange(type, value)}
        >
          {value.toString().padStart(2, "0")}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "flex justify-between gap-1 bg-red-500 p-3 !text-[#ffa500] !bg-[#FFFFF0]",
        "w-[200px] h-[200px]",
        className
      )}
    >
      {/* Hours - Scrollable */}
      <div className="w-[calc(100%/3)] h-full !text-[#ffa500]">
        {renderScrollableColumn(
          Array.from({ length: 12 }, (_, i) => i + 1),
          hours,
          "hours"
        )}
      </div>

      {/* Minutes - Scrollable */}
      <div className="w-[calc(100%/3)] h-full !text-[#ffa500]">
        {renderScrollableColumn(
          Array.from({ length: 60 }, (_, i) => i),
          minutes,
          "minutes"
        )}
      </div>

      {/* AM/PM - Static */}
      <div className="w-[calc(100%/3)] h-full flex flex-col items-center space-y-2 justify-start">
        <button
          className={cn(
            "text-xl font-semibold !text-[#ffa500] cursor-pointer",
            period === "AM" ? "opacity-100" : "opacity-50"
          )}
          onClick={handlePeriodToggle}
        >
          AM
        </button>
        <button
          className={cn(
            "text-xl font-semibold !text-[#ffa500] cursor-pointer",
            period === "PM" ? "opacity-100" : "opacity-50"
          )}
          onClick={handlePeriodToggle}
        >
          PM
        </button>
      </div>
    </div>
  );
}

TimePicker.displayName = "TimePicker";

export { TimePicker };
