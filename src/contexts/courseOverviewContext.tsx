/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
interface CourseOverviewContextType {
  scheduleSession: boolean;
  handleScheduleSession: (b?: boolean) => void;
}

export const CourseOverview = createContext<CourseOverviewContextType>({
  scheduleSession: false,
  handleScheduleSession: () => {}
});

export default function CourseOverviewContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [scheduleSession, setScheduleSession] = useState(false);

  const handleScheduleSession = (b?: boolean) => {
    // If no value is provided, toggle the current state
    const newValue = b === undefined ? !scheduleSession : b;
    setScheduleSession(newValue);
    
    // Only navigate if we're turning scheduling on
    if (newValue === true) {
      navigate("/dashboard/overview/live-sessions");
    }
  };

  return (
    <CourseOverview.Provider
      value={{
        handleScheduleSession,
        scheduleSession
      }}
    >
      {children}
    </CourseOverview.Provider>
  );
}
