import { useState, useRef, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../list/card";
import CourseOverviewRoot from "./courseOverviewRoot";
import { useIntersection } from "react-use";
import { LoadingAssetBig2, LoadingAssetSmall2 } from "../../assets/assets";
import useUserPresentation from "../../hooks/useUserPresentation";
import { CiSearch } from "react-icons/ci";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UtilityProvider } from "../../contexts/utilityContext";
import { useTheme } from "../../hooks/useTheme";

export default function CourseOverviewPresentations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(
    parseInt(searchParams.get("tab") || "1")
  );
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
      <ScrollArea
        className="wrapper w-full h-full grid grid-rows-[auto_1fr] grid-cols-1 gap-2 px-5 no-scrollbar [scrollbar-width:none]! [-ms-overflow-style:none]! [&_*::-webkit-scrollbar]:hidden! [-ms-overflow-style:none]! [scrollbar-width:none]!"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
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
            className={`block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] ${bg} ${text} _bg-primaryTwo _text-white`}
          />
          <span
            className={`block w-fit ${text} text-[#FFFFF0] ${currentView == 3 && "text-primaryTwo"} text-[1.3rem]  absolute right-2 top-[50%] translate-y-[-50%] pointer-events-none`}
          >
            <CiSearch />
          </span>
        </div>

        <div className="w-full h-full">
          <div className="w-full flex flex-wrap gap-4 justify-start items-center mb-2">
            {presentationQuery?.data &&
              presentationQuery.data.pages.flat().map((presentation) => (
                <div
                  key={presentation.id}
                  className="flex-1 basis-[320px] min-w-[260px] max-w-[300px] maxScreenMobile:!mx-auto aspect-[1/1.2] flex flex-col"
                >
                  <Card
                    presentation={presentation}
                    refresh={presentationQuery.refetch}
                  />
                </div>
              ))}
            {presentationQuery.isLoading && (
              <div className="flex items-center justify-center w-full h-[40px]">
                <LoadingAssetBig2 />
              </div>
            )}
          </div>
          {presentationQuery.isFetchingNextPage && (
            <div className="flex items-center justify-center w-full h-[40px]">
              <LoadingAssetSmall2 />
            </div>
          )}
        </div>
      </ScrollArea>
    </CourseOverviewRoot>
  );
}
