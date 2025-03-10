import { useParams } from "react-router-dom";
import CourseStoreProvider from "@/store/courseStoreProvider";
import { Outlet } from "react-router-dom";

export default function CourseRoot() {
  // Force re-mounting of CourseStoreProvider when courseId changes
  const { courseId } = useParams();
  
  return (
    <CourseStoreProvider key={courseId}>
      <Outlet />
    </CourseStoreProvider>
  );
}
