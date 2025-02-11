import CourseStoreProvider from "@/store/courseStoreProvider";
import { Outlet } from "react-router-dom";

export default function CourseRoot() {
  return (
    <CourseStoreProvider>
      <Outlet />
    </CourseStoreProvider>
  );
}
