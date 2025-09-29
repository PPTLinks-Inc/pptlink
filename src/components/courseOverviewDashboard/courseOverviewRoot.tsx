/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import CourseOverviewHeader from "./subComponents/header";
import AsideForDarshboardOverview from "./subComponents/aside";
import InnerMainHeader from "./subComponents/innerMainHeader";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

export default function CourseOverviewRoot({
  children
}: {
  children: React.ReactNode;
}) {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const handleSideBar = () => setToggleSidebar(!toggleSidebar);

  return (
    <section className="min-h-screen w-full bg-black text-white grid grid-cols-1 grid-rows-[auto_1fr]">
      <CourseOverviewHeader />
      <div
        className={`h-full grid ${toggleSidebar ? "grid-cols-[300px_1fr]" : "grid-cols-1"} grid-rows-1`}
      >
        <motion.div
          variants={{
            initial: {
              x: 5,
              opacity: 0
            },
            inView: {
              x: 0,
              opacity: 100,
              transition: {
                duration: 1,
                staggerChildren: 0.2,
                when: "beforeChildren"
              }
            }
          }}
          initial="initial"
          whileInView="inView"
          viewport={{ once: true }}
          className={`aside sticky! top-0! bg-primaryTwo h-full grid grid-cols-1 grid-rows-[auto_1fr_auto] p-2 ${!toggleSidebar && "!hidden"}`}
        >
          <AsideForDarshboardOverview />
        </motion.div>
        <main className="relative w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2 p-2 pt-0">
          <button
            onClick={() => handleSideBar()}
            className={`z-10 absolute ${toggleSidebar ? "-left-4" : "left-0.5"} top-[50%] -translate-y-[50%] bg-black p-1 border-none rounded-lg`}
          >
            {toggleSidebar ? <FaCaretLeft /> : <FaCaretRight />}
          </button>
          <InnerMainHeader />
          {/* wrappers for different different */}
          {children}
          {/* end different wrappers */}
        </main>
      </div>
    </section>
  );
}
