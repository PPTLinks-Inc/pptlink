/* eslint-disable react/prop-types */
import CourseOverviewHeader from "./subComponents/header";
import AsideForDarshboardOverview from "./subComponents/aside";
import InnerMainHeader from "./subComponents/innerMainHeader";

export default function CourseOverviewRoot({ children }) {
  return (
    <section className="h-screen w-full bg-black text-white grid grid-cols-1 grid-rows-[auto_1fr]">
      <CourseOverviewHeader />
      <div className="h-full grid grid-cols-[300px_1fr] grid-rows-1">
        <div className="aside bg-primaryTwo h-full grid grid-cols-1 grid-rows-[auto_1fr_auto] p-2">
          <AsideForDarshboardOverview />
        </div>
        <main className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2 p-2 pt-0">
          <InnerMainHeader />
          {/* wrappers for different different */}
          {children}
          {/* end different wrappers */}
        </main>
      </div>
    </section>
  );
}
