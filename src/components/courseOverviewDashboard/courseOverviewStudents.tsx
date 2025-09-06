import { useState, useRef, useEffect, useContext } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import CourseOverviewRoot from "./courseOverviewRoot";
import { useIntersection } from "react-use";
import useUserPresentation from "../../hooks/useUserPresentation";
import { CiSearch } from "react-icons/ci";
import { UtilityProvider } from "../../contexts/utilityContext";
import { useTheme } from "../../hooks/useTheme";

const ViewStudents = Array.from({ length: 16 }, (_, i) => i + 1);

export default function CourseOverviewStudents() {
  const [currentView, setCurrentView] = useState(2);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { search: globalSearch } = useContext(UtilityProvider);
  const { bg, text, border } = useTheme();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) {
      navigate("?tab=1", { replace: true });
    } else {
      setCurrentView(parseInt(tab));
    }
  }, [searchParams, navigate]);

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "100px",
    threshold: 1
  });

  const presentationQuery = useUserPresentation({ enabled: currentView === 1 });

  useEffect(
    function () {
      if (intersection && intersection?.isIntersecting) {
        if (presentationQuery.hasNextPage) presentationQuery.fetchNextPage();
      }
    },
    [intersection, intersection?.isIntersecting, presentationQuery]
  );

  return (
    <CourseOverviewRoot>
      <div className="wrapper w-full h-full grid grid-rows-[auto_1fr] grid-cols-1 gap-2 px-5">
        {/* search */}
        <div
          className={`w-[60%] mx-auto h-fit rounded-[.5rem] border ${border} _border-white ${search !== "" && "!border-[#FFA500]"} relative mb-5 ${globalSearch.isMobileSearch ? "maxScreenMobile:hidden" : ""}`}
        >
          <input
            type="text"
            name="searcher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Libraries"
            className={`block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] ${bg} ${text}`}
          />
          <span
            className={`block w-fit ${text} text-[#FFFFF0] ${currentView == 3 && "text-primaryTwo"} text-[1.3rem]  absolute right-2 top-[50%] translate-y-[-50%] pointer-events-none`}
          >
            <CiSearch />
          </span>
        </div>

        <div className="w-full h-full  _bg-gray-700 relative grid grid-rows-[auto_1fr] grid-cols-1 px-4 !border-[0.1px] border-white">
          <header className="w-full h-fit grid grid-cols-6 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
            <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
              Name
            </span>
            <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
              Course
            </span>
            <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
              Joined
            </span>
            <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
              Progress
            </span>
            <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
              Status
            </span>
            <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
              Action
            </span>
          </header>
          <ul className="block w-full h-fit _!h-[380px] !overflow-y-scroll">
            {ViewStudents.map((students) => (
              <li
                key={students.toString()}
                className="w-full h-fit grid grid-cols-6 grid-rows-1 justify-center items-center py-1 !border-b-[0.1px] border-[#8080808e]"
              >
                <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                  Raymond{students} A. Amem
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                  Python 00{students}
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                  May 1{students}, 2025
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                  {students}0%
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                  {students % 2 ? "Active" : "Completed"}
                </span>
                <span className="flex justify-center items-center w-full h-fit py-2">
                  <Link
                    to={"#"}
                    className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                  >
                    View
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CourseOverviewRoot>
  );
}
