/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";

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
  const [scheduleSession, setScheduleSession] = useState(false);

  const handleScheduleSession = (b? : boolean) => setScheduleSession(b? b : true);
  console.log("scheduleSession", scheduleSession);

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
