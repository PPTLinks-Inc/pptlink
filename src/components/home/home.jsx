/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";
import { AiFillCaretDown } from "react-icons/ai";
import axios from "axios";
import { useEffect, useRef, useState, useCallback, useReducer } from "react";
import { LoadingAssetSmall2, LoadingAssetBig2 } from "../../assets/assets";
import { Helmet } from "react-helmet";
import { useInView } from "react-intersection-observer";
import LogoBlack from "../../images/Logo-Black.png";
import loading from "./../../images/loading.png";
import MovingEllipses from "./MovingEllipes"
import "./home.css"

const initialPageNo = 1;
let shouldFetchMoreData = true;

const pageNoReducer = (state, action) => {
  console.log({ state, action });
  if (shouldFetchMoreData) return (action += 1);

  return state;
};

let isFetching = false;
const Home = () => {
  const controller = new AbortController();

  const { ref: arrowRef, inView } = useInView({
    threshold: 0.8,
    rootMargin: "15%",
  });

  const [values, setValues] = useState({
    pending: true,

    isIntersecting: false,

    error: false,

    institutions: [],
  });

  const [pageNo, pageNoDIspatch] = useReducer(pageNoReducer, initialPageNo);

  useEffect(() => {
    console.log({ pageNo });
  }, [pageNo]);

  const getInstitutions = () => {
    setValues((prev) => ({ ...prev, pending: true }));

    axios
      .get(`/api/v1/institution?noPerPage=10&pageNo=${pageNo}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        console.log(data);

        setValues((prev) => ({
          ...prev,
          institutions: [...prev.institutions, ...data.institutions],
          pending: false,
        }));

        isFetching = false;
        pageNoDIspatch(pageNo);
        if (data.pageInstitutionCount < 10) {
          shouldFetchMoreData = false;
        }

        controller.abort();
      })
      .catch((err) => {
        console.log(err);
        setValues((prev) => ({ ...prev, pending: false, error: true }));
      });
  };

  useEffect(() => {
    if (isFetching) return;
    isFetching = true;
    getInstitutions();
  }, []);

  useEffect(() => {
    console.log("intersecting", inView);
    if (isFetching) return;
    if (inView) {
      isFetching = true;
      getInstitutions();
    }
  }, [inView]);

  const handleRefresh = useCallback(() => {
    setValues({ ...values, pending: true, error: false });
    getInstitutions();
  }, [values]);

  function SpacesWithUnderscores(inputString) {
    var resultString = inputString.replace(/\s+/g, "_");
    return resultString;
  }

  return (
    <section className="h-[fit-content] w-[95%] m-auto flex justify-between relative my-5">
      {/* meta and SEO information */}
      <Helmet>
        <title>{`Home - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks,`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`https://www.pptlinks.com`} />
        <meta property='og:title' content={`Home - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property='twitter:card' content='website' />
        <meta property='twitter:url' content={`https://www.pptlinks.com`} />

        <meta property="twitter:title" content={`Home - PPTLinks `} />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>

      <div className="w-[70%] flex flex-col mt-7 justify-between maxScreen:w-full">
        <h1 className="text-[40px] font-medium mb-7 md:mb-[45px]">
          List of all institutions
        </h1>

        <p className="text-xl  mb-7 md:mb-[45px]">
          Click on an institution to find all public presentations made by them
        </p>

        <form className="flex flex-wrap w-[100%] md:w-[100%] justify-between lg:justify-start gap-3 mb-[45px]">
          <input
            type="text"
            placeholder="Find institution"
            className="block w-[70%] grow shrink basis-[300px] lg:max-w-[450px] border border-slate-200 px-[15px] mr-2 py-[12px] text-slate-200 decoration-black rounded-xl bg-transparent my-1"
          />

          <button
            className="block w-[fit-content] px-7 rounded-xl py-[9px] bg-slate-200 text-black my-1"
            type="submit"
          >
            Find
          </button>
        </form>
        {values.pending && values.institutions.length < 1 ? (
          <div className="w-full h-[25vh] flex justify-center items-center">
            <LoadingAssetBig2 />
          </div>
        ) : (
          <>
            {values.error ? (
              <div className="w-full h-[10vh] md:h-[25vh] flex justify-center items-center">
                <button
                  className="px-7 rounded-xl py-1 bg-slate-200 text-black"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <>
                {values.institutions.map((_, i) => (
                  <Link
                    key={i}
                    to={`/institutions/${SpacesWithUnderscores(_.name)}`}
                    className="border-l-4 pl-2 border-slate-200 h-[50px] flex items-center mb-[45px]"
                  >
                    {_.name}
                  </Link>
                ))}

                {
                  <div
                    ref={arrowRef}
                    className={`w-full h-[40px] flex items-center justify-center ${!shouldFetchMoreData && "hidden"
                      }`}
                  >
                    {values.institutions.length > 0 && values.pending ? (
                      <LoadingAssetSmall2 />
                    ) : (
                      values.institutions.length > 0 && (
                        <AiFillCaretDown
                          className="text-2xl cursor-pointer"
                          onClick={shouldFetchMoreData ? getInstitutions : null}
                        />
                      )
                    )}
                  </div>
                }
              </>
            )}
          </>
        )}
      </div>

      <div className="w-[30%] h-[fit-content] absolute right-[3rem] top-[4rem] maxScreen:hidden">
        <img
          draggable="false"
          loading="lazy"
          src={loading}
          alt="Ellipse"
          className="w-full"
        />
      </div>
      <MovingEllipses />
    </section>


  );
};

export default Home;
