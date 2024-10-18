import { useRef, useContext, useEffect } from "react";
import documentImg from "/team/pptlink_resources/documentation-svgrepo-com (1).svg";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
import Card from "../list/card";
import { useIntersection } from "react-use";
import { publicPresentation } from "../../contexts/publicPresentationContext";
import { LoadingAssetBig2, LoadingAssetSmall2 } from "../../assets/assets";

export default function PublicPresentation() {
  const scrollRef = useRef();

  const {
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
    presentations,
    refetch
  } = useContext(publicPresentation);

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "100px",
    threshold: .5
  });

  useEffect(
    function () {
      if (intersection && intersection?.isIntersecting) {
        console.log("fetching next page");
        if (hasNextPage) fetchNextPage();
      }
    },
    [hasNextPage, intersection, intersection?.isIntersecting]
  );

  return (
    <div ref={root}>
      <section className="bg-black">
        <div className="container h-fit py-10 flex flex-col justify-between items-center">
          <h1 className="text-5xl font-[400] uppercase mb-5 maxScreenMobile:text-3xl maxScreenMobile:text-center">
            PUBLIC PRESENTATIONS
          </h1>
          <div className="w-[150px] aspect-square mb-5">
            <img
              src={documentImg}
              alt={documentImg}
              className="block w-full h-full"
            />
          </div>
          <div className="w-[300px] maxScreenMobile:!w-[90%] h-fit rounded-[.5rem] border border-white relative mb-5">
            <input
              type="text"
              name="searcher"
              placeholder="Search for Libraries"
              className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-black text-white"
            />
            <img
              src={searchImg}
              alt={searchImg}
              className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
            />
          </div>
        </div>
      </section>

      <section className="public_presentations container py-5 h-fit bg-black">
        <div
          className="cards_wrapper w-full mt-20 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth"
          ref={scrollRef}
        >
          {presentations.map((presentation) => (
            <Card
              key={presentation.id}
              presentation={presentation}
              refresh={refetch}
            />
          ))}
        </div>
        {isLoading && (
          <div className="flex items-center justify-center w-full h-[40px]">
            <LoadingAssetBig2 />
          </div>
        )}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center w-full h-[40px] mb-10">
            <LoadingAssetSmall2 />
          </div>
        )}
        {isError ||
          (isFetchNextPageError && (
            <div className="flex justify-center flex-col items-center gap-3">
              <p className="text-whte">Failed to fetch</p>
              <button
                onClick={() => fetchNextPage()}
                className="block w-fit h-fit p-2 border-2 border-white rounded-[.5rem] bg-black text-white"
              >
                Load more
              </button>
            </div>
          ))}
      </section>

      <div className="mb-[100px] h-[50px]" ref={intersectionRef}></div>
    </div>
  );
}
