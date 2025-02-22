import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
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

export default function NewDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(parseInt(searchParams.get("tab") || "1"));
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

  const handleView = (e) => {
    const view = parseInt(e.target.dataset.view);
    navigate(`?tab=${view}`);
  };

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

  useEffect(
    function () {
      if (intersection && intersection?.isIntersecting) {
        if (presentationQuery.hasNextPage) presentationQuery.fetchNextPage();
      }
    },
    [intersection, intersection?.isIntersecting, presentationQuery]
  );

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
      <section
        className={`relative ${currentView === 3 ? "before:bg-[#FFFFF0] text-primaryTwo" : "bg-primaryTwo"}`}
      >
        <div className={`w-full h-fit pt-6`}>
          <div
            className={`container relative h-fit py-6 flex flex-col justify-between items-center ${currentView === 3 ? "bg-[#FFFFF0] rounded-t-lg" : "backdrop_el"} rounded-t-md`}
          >
            <button
              className={`absolute top-8 right-8 text-2xl font-bold ${currentView !== 3 ? "text-[#FFA500]" : ""}`}
            >
              <CiSettings />
            </button>
            <span className="backdrop_el block mx-auto my-4 rounded px-3 py-1 responsiveText">
              My Profile
            </span>
            <div className="flex justify-center items-center w-[150px] aspect-square _bg-[red] !border-[0.01px] border-[#FFFFF0] rounded-full relative mb-4">
              <FaUser size="80" className="block" />
              <button className="absolute text-xl bottom-[0.7rem] right-[0.7rem] bg-primaryTwo">
                <FaRegEdit />
              </button>
            </div>
            <div className="w-[70%] mx-auto flex flex-col justify-between items-center gap-2 responsiveText text-center">
              <h1 className="text-2xl mt-2">{user ? user.username : "--"}</h1>
              <p>Legacy Paradigm Executive</p>
              <div className="flex justify-between items-center gap-4">
                <span className="flax flex-col justify-between items-center">
                  <span className="block w-fit mx-auto">
                    {user ? user.presentations : "--"}
                  </span>
                  <span className="block w-fit mx-auto">Presentations</span>
                </span>
                <span className="text-2xl">|</span>
                <span className="flax flex-col justify-between items-center">
                  <span className="block w-fit mx-auto">{user ? user.courses : "--"}</span>
                  <span className="block w-fit mx-auto">Courses</span>
                </span>
              </div>
              <p>This is a placeholder text, click on the settings Icon to edit your profile.</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`py-5 h-fit ${currentView === 3 ? "bg-[#FFFFF0] text-primaryTwo" : "bg-primaryTwo text-white"}`}
      >
        <div
          className={`${currentView == 3 ? "bg-[#FFFFF0] container_" : "bg-primaryTwo"} h-fit flex justify-evenly items-center border-b-2 ${currentView === 3 ? "border-b-primaryTwo" : "border-b-white"}`}
        >
          <button
            onClick={handleView}
            data-view="1"
            className={
              currentView === 1
                ? `block w-[8rem] ${currentView === 3 ? "text-primaryTwo" : "text-white"} p-2 border-2 ${currentView === 3 ? "border-primaryTwo" : "border-white"} ${currentView === 3 ? "!border-b-[white]" : "!border-b-[primaryTwo]"} _!z-10 before:block before:w-full before:h-fit before:py-2 ${currentView === 3 ? "before:bg-[#FFFFF0] bg-[#FFFFF0]" : "before:bg-primaryTwo bg-primaryTwo"} relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]`
                : ``
            }
          >
            Upload
          </button>
          <button
            onClick={handleView}
            data-view="2"
            className={
              currentView === 2
                ? `block w-[8rem] ${currentView === 3 ? "text-primaryTwo" : "text-white"} p-2 border-2 ${currentView === 3 ? "border-primaryTwo" : "border-white"} ${currentView === 3 ? "!border-b-[white]" : "!border-b-[primaryTwo]"} _!z-10 before:block before:w-full before:h-fit before:py-2 ${currentView === 3 ? "before:bg-[#FFFFF0] bg-[#FFFFF0]" : "before:bg-primaryTwo bg-primaryTwo"} relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]`
                : ``
            }
          >
            Courses
          </button>
          <button
            onClick={handleView}
            data-view="3"
            className={
              currentView === 3
                ? `block w-[8rem] ${currentView === 3 ? "text-primaryTwo" : "text-white"} p-2 border-2 ${currentView === 3 ? "border-primaryTwo" : "border-white"} ${currentView === 3 ? "!border-b-[white]" : "!border-b-[primaryTwo]"} _!z-10 before:block before:w-full before:h-fit before:py-2 ${currentView === 3 ? "before:bg-[#FFFFF0] bg-[#FFFFF0]" : "before:bg-primaryTwo bg-primaryTwo"} relative before:absolute before:top-[100%] before:left-0 before:right-0 mb-[-2px]`
                : ``
            }
          >
            History
          </button>
        </div>
        <div className="w-full h-fit">
          {/* ////////////////////////////////////Cards///////////////////////////////////////////// */}
          <div
            className={`public_presentations container pt-12 pb-5 h-fit block ${currentView == 1 ? "_block" : "_hidden"}`}
          >
            {/* search */}
            <div className="w-[300px] maxScreenMobile:!w-[90%] mx-auto h-fit rounded-[.5rem] border border-white relative mb-5">
              <input
                type="text"
                name="searcher"
                placeholder="Search for Libraries"
                className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-primaryTwo text-white"
              />
              <img
                src={searchImg}
                alt={searchImg}
                className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
              />
            </div>
            {/* end search */}
            {currentView == 1 && (
              <>
                <div
                  className={`w-full min-h-screen flex justify-center items-center _bg-[purple]`}
                >
                  {presentationQuery?.data && (
                    <div className="dashboard_cards_wrapper w-full mt-20 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth">
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
              </>
            )}

            {currentView == 2 && (
              <>
                <div
                  className={`w-full min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start p-4`}
                >
                  {myCourses.data?.map((course) => (
                    <ShowCourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            )}

            {currentView == 3 && (
              <>
                <div
                  className={`container _w-full min-h-screen flex justify-center items-center _bg-[purple]`}
                >
                  <h1>No History yet</h1>
                </div>
              </>
            )}
          </div>
          <div
            className={`w-full min-h-screen flex flex-col justify-center items-center pt-12 _bg-[purple] ${currentView == 3 ? "block" : "hidden"}`}
          >
            {/* search */}
            <div className="w-[300px] maxScreenMobile:!w-[90%] h-fit rounded-[.5rem] border border-white relative mb-5">
              <input
                type="text"
                name="searcher"
                placeholder="Search for Libraries"
                className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-primaryTwo text-white"
              />
              <img
                src={searchImg}
                alt={searchImg}
                className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
              />
            </div>
            {/* end search */}
            <div
              className={`container _w-full min-h-screen flex justify-center items-center _bg-[purple]`}
            >
              <h1>No History yet</h1>
            </div>
          </div>

          <div ref={intersectionRef}></div>
        </div>
      </section>
    </div>
  );
}
