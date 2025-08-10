import { useState, useRef, useEffect, memo, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../list/card";
import ShowCourseCard from "../list/showCourseCard";
import { CiSettings } from "react-icons/ci";
import { useIntersection } from "react-use";
import { LoadingAssetBig2, LoadingAssetSmall2 } from "../../assets/assets";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { FaUser } from "react-icons/fa6";
import useUserPresentation from "../../hooks/useUserPresentation";
import useUser from "../../hooks/useUser";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { authFetch } from "../../lib/axios";
import { CiSearch } from "react-icons/ci";
import { UtilityProvider } from "../../contexts/utilityContext";

// eslint-disable-next-line react/prop-types
const TabContent = memo(function TabContent({ isActive, children }) {
  return (
    <div 
      className={`${isActive ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-200 ease-in-out`}
    >
      {children}
    </div>
  );
});

export default function NewDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(
    parseInt(searchParams.get("tab") || "1")
  );
  const [search, setSearch] = useState("");
  const { search: globalSearch } = useContext(UtilityProvider);
  const { userQuery } = useUser();
  const user = userQuery.data;

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

  const myCourses = useQuery({
    queryKey: ["myCourses", user?.id],
    enabled: currentView === 2,
    queryFn: async function () {
      const { data } = await authFetch.get(`/api/v1/course/user-courses`);

      return data;
    }
  });

  const paidCourses = useQuery({
    queryKey: ["paidCourses", user?.id],
    enabled: currentView === 3,
    queryFn: async function () {
      const { data } = await authFetch.get(`/api/v1/course/paid-courses`);

      return data;
    }
  });

  useEffect(
    function () {
      if (intersection && intersection?.isIntersecting) {
        if (presentationQuery.hasNextPage) presentationQuery.fetchNextPage();
      }
    },
    [intersection, intersection?.isIntersecting, presentationQuery]
  );

  const handleView = (e) => {
    const view = parseInt(e.target.dataset.view);
    navigate(`?tab=${view}`);
  };

  return (
    <div className="w-full relative h-fit">
      <Helmet>
        <title>{`Dashboard - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks, PPTLINKSDashboard`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.PPTLink.com/dashboard`} />
        <meta property="og:title" content={`Dashboard - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta
          property="twitter:url"
          content={`https://www.PPTLink.com/dashboard`}
        />

        <meta property="twitter:title" content={`Dashboard - PPTLinks `} />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>
      <section className={`relative bg-primaryTwo`}>
        <div className={`w-full h-fit pt-6`}>
          <div
            className={`container relative h-fit py-6 flex flex-col justify-between items-center backdrop_el rounded-t-md`}
          >
            <button
              className={`absolute top-8 right-8 text-3xl font-bold text-[#FFFFF0]`}
            >
              <CiSettings />
            </button>
            <span className="backdrop_el block mx-auto my-4 rounded px-3 py-1 responsiveText">
              My Profile
            </span>
            <div
              className={`flex justify-center items-center w-[150px] aspect-square _bg-[red] !border-[0.01px] border-[#FFFFF0] rounded-full relative mb-4`}
            >
              <FaUser size="80" className="block" />
              <button
                className={`absolute text-xl bottom-[0.7rem] right-[0.7rem] bg-primaryTwo !text-[#FFFFF0]`}
              >
                <FaRegEdit />
              </button>
            </div>
            <div className="w-[70%] mx-auto flex flex-col justify-between items-center gap-2 responsiveText text-center">
              <h1 className="text-2xl mt-2">{user ? user.username : "--"}</h1>
              {/* <p>Legacy Paradigm Executive</p> */}
              <div className="flex justify-between items-center gap-4">
                <span className="flax flex-col justify-between items-center">
                  <span className="block w-fit mx-auto">
                    {user ? user.presentations : "--"}
                  </span>
                  <span className="block w-fit mx-auto">Presentations</span>
                </span>
                <span className="text-2xl">|</span>
                <span className="flax flex-col justify-between items-center">
                  <span className="block w-fit mx-auto">
                    {user ? user.courses : "--"}
                  </span>
                  <span className="block w-fit mx-auto">Courses</span>
                </span>
              </div>
              <p>
                This is a placeholder text, click on the settings Icon to edit
                your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-5 h-fit bg-primaryTwo text-white`}>
        <div
          className={`bg-primaryTwo h-fit flex justify-evenly items-center border-b-2 border-b-white`}
        >
          <button
            onClick={handleView}
            data-view="1"
            className={
              currentView === 1
                ? `block w-[8rem] text-white p-2 border-2 border-white !border-b-[primaryTwo] _!z-10 before:block before:w-full before:h-fit before:py-2 before:bg-primaryTwo bg-primaryTwo relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]`
                : ``
            }
          >
            Presentations
          </button>
          <button
            onClick={handleView}
            data-view="2"
            className={
              currentView === 2
                ? `block w-[8rem] text-white p-2 border-2 border-white !border-b-[primaryTwo] _!z-10 before:block before:w-full before:h-fit before:py-2 before:bg-primaryTwo bg-primaryTwo relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]`
                : ``
            }
          >
            My courses
          </button>
          <button
            onClick={handleView}
            data-view="3"
            className={
              currentView === 3
                ? `block w-[8rem] text-white p-2 border-2 border-white !border-b-[primaryTwo] _!z-10 before:block before:w-full before:h-fit before:py-2 before:bg-primaryTwo bg-primaryTwo relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]`
                : ``
            }
          >
            Paid courses
          </button>
          {/* <button
            onClick={handleView}
            data-view="4"
            className={
              currentView === 4
                ? `block w-[8rem] text-white p-2 border-2 border-white !border-b-[primaryTwo] _!z-10 before:block before:w-full before:h-fit before:py-2 before:bg-primaryTwo bg-primaryTwo relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]`
                : ``
            }
          >
            History
          </button> */}
        </div>
        <div className="w-full h-fit">
          {/* ////////////////////////////////////Cards///////////////////////////////////////////// */}
          <div
            className={`public_presentations container pt-12 pb-5 h-fit block relative`}
          >
            {/* search */}
            <div
              className={`w-[300px] maxScreenMobile:!w-[90%] mx-auto h-fit rounded-[.5rem] border border-white ${search !== "" && "!border-[#FFA500]"} relative mb-5 ${globalSearch.isMobileSearch ? "maxScreenMobile:hidden" : ""}`}
            >
              <input
                type="text"
                name="searcher"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for Libraries"
                className={`block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-primaryTwo text-white`}
              />
              <span
                className={`block w-fit text-[#FFFFF0] ${currentView == 3 && "text-primaryTwo"} text-[1.3rem]  absolute right-2 top-[50%] translate-y-[-50%] pointer-events-none`}
              >
                <CiSearch />
              </span>
            </div>
            {/* end search */}
            <TabContent isActive={currentView === 1}>
              <div
                className={`w-full min-h-screen flex justify-center items-center`}
              >
                {presentationQuery?.data && (
                  <div className="dashboard_cards_wrapper w-full min-h-screen mt-20 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth">
                    {presentationQuery.data.pages.flat().map((presentation) => (
                      <Card
                        key={presentation.id}
                        presentation={presentation}
                        refresh={presentationQuery.refetch}
                      />
                    ))}
                  </div>
                )}
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

              {presentationQuery.isError ||
                (presentationQuery.isFetchNextPageError && (
                  <div className="flex justify-center flex-col items-center gap-3">
                    <p className="text-whte">Failed to fetch</p>
                    <button
                      onClick={() => presentationQuery.fetchNextPage()}
                      className="block w-fit h-fit p-2 border-2 border-white rounded-[.5rem] bg-primaryTwo text-white"
                    >
                      Load more
                    </button>
                  </div>
                ))}
            </TabContent>

            <TabContent isActive={currentView === 2}>
              <>
                {myCourses.isLoading && (
                  <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">
                    <LoadingAssetBig2 />
                  </div>
                )}
                <div
                  className={`w-full min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start p-4`}
                >
                  {myCourses.data?.map((course) => (
                    <ShowCourseCard key={course.id} course={course} />
                  ))}
                </div>
                {myCourses.isError && (
                  <div className="flex justify-center flex-col items-center gap-3">
                    <p className="text-whte">Failed to Course</p>
                    <button
                      onClick={() => myCourses.refetch()}
                      className="block w-fit h-fit p-2 border-2 border-white rounded-[.5rem] bg-primaryTwo text-white"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </>
            </TabContent>

            <TabContent isActive={currentView === 3}>
              <>
                {paidCourses.isLoading && (
                  <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">
                    <LoadingAssetBig2 />
                  </div>
                )}
                <div
                  className={`w-full min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start p-4`}
                >
                  {paidCourses.data?.map((course) => (
                    <ShowCourseCard key={course.id} course={course} />
                  ))}
                </div>
                {paidCourses.isError && (
                  <div className="flex justify-center flex-col items-center gap-3">
                    <p className="text-whte">Failed to Course</p>
                    <button
                      onClick={() => paidCourses.refetch()}
                      className="block w-fit h-fit p-2 border-2 border-white rounded-[.5rem] bg-primaryTwo text-white"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </>
            </TabContent>

            {/* <TabContent isActive={currentView === 4}>
              <div
                className={`w-full min-h-screen flex justify-center items-center`}
              >
                <h1>History</h1>
              </div>
            </TabContent> */}
          </div>

          <div ref={intersectionRef}></div>
        </div>
      </section>
    </div>
  );
}
