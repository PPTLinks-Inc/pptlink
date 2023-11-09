/* eslint-disable no-unused-vars */

import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { LoadingAssetSmall2, LoadingAssetBig2 } from "../../assets/assets";
import { AiFillCaretDown } from "react-icons/ai";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { useReducer } from "react";
import { useInView } from "react-intersection-observer";

let observer;

const initialPageNo = 1;
let shouldFetchMoreData = true;

const pageNoReducer = (state, action) => {
  console.log({ state, action });
  if (shouldFetchMoreData) return (action += 1);

  return state;
};

let isFetching = false;
const Institutions = () => {
  const controller = new AbortController();

  const { ref: arrowRef, inView } = useInView({
    threshold: 0.8,
    rootMargin: "15%",
  });

  const { id } = useParams();

  const [values, setValues] = useState({
    pending: true,

    isIntersecting: false,

    error: false,

    instition: "",

    presentations: [],
  });

  const [pageNo, pageNoDIspatch] = useReducer(pageNoReducer, initialPageNo);

  useEffect(() => {
    console.log({ pageNo });
  }, [pageNo]);

  const getPresentations = () => {
    setValues((prev) => ({ ...prev, pending: true }));

    axios
      .get(
        `/api/v1/institution/presentations/${id}?noPerPage=10&pageNo=${pageNo}`,
        {
          signal: controller.signal,
        }
      )
      .then(({ data }) => {
        console.log(data);

        setValues((prev) => ({
          ...prev,
          presentations: [...prev.presentations, ...data.presentations],
          pending: false,
        }));

        isFetching = false;
        pageNoDIspatch(pageNo);
        if (data.pageInstitutionCount < 10) {
          shouldFetchMoreData = false;
        }
        // if (data.pagePresentationCount < 10) observer && observer.disconnect();

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
    getPresentations();
  }, []);

  useEffect(() => {
    console.log("intersecting", inView);
    if (isFetching) return;
    if (inView) {
      isFetching = true;
      getPresentations();
    }
  }, [inView]);

  const handleRefresh = useCallback(() => {
    setValues({ ...values, pending: true, error: false });
    getPresentations();
  }, [values]);

  const withoutUnderscore = (input) => {
    return input.replace(/_/g, " ");
  };

  return (
    <section className="min-h-full w-full py-[20px] relative flex flex-col justify-around px-[20px]">
      {/* meta and SEO information */}
      <Helmet>
        <title>{`${values.instition} - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks, ${values.instition}`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://www.PPTLink.com/institutions`}
        />
        <meta property="og:title" content={`${values.instition} - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta
          property="twitter:url"
          content={`https://www.PPTLink.com/institutions`}
        />

        <meta
          property="twitter:title"
          content={`${values.instition} - PPTLinks `}
        />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>

      <div className="w-full flex flex-col justify-between">
        <h1 className="text-[40px] font-medium mb-[45px]">
          {values.instition}
        </h1>
      </div>

      <div className="">
        <div className="w-full flex justify-start items-center">
          <h2 className="text-xl mb-6">Presentations</h2>
        </div>

        {values.pending && values.presentations.length < 1 ? (
          <div className="w-full h-[25vh] flex justify-center items-center">
            <LoadingAssetBig2 />
          </div>
        ) : (
          <>
            {values.error ? (
              <div className="w-full h-[25vh] flex justify-center items-center">
                <button
                  className="px-7 rounded-xl py-1 bg-slate-200 text-black"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <>
                <div className="w-full h-fit flex md:grid md:grid-cols-3 justify-items-start flex-wrap gap-x-5 gap-y-[60px]">
                  {values.presentations.length < 1 ? (
                    <div className="w-full h-[25vh] flex justify-center items-center">
                      <LoadingAssetBig2 />
                    </div>
                  ) : (
                    values.presentations.map((_, i) => (
                      <div
                        key={i}
                        className="w-[95%] m-auto git  md:w-[300px] cursor-pointer"
                      >
                        <Link to={`/${_.liveId}`}>
                          <img
                            src={_.thumbnail}
                            alt="presentation image"
                            className="rounded-xl w-full h-[190px]"
                            draggable="false"
                            loading="lazy"
                          />

                          <p className="font-bold leading-10 treading-6">
                            {_.name}
                          </p>

                          <span className="w-[40%] flex justify-between flex-col">
                            <small>
                              {new Date(_.createdAt).toDateString()}
                            </small>
                            <small>{_.linkType}</small>
                          </span>
                        </Link>
                      </div>
                    ))
                  )}
                </div>

                <div
                  ref={arrowRef}
                  className={`w-full h-[40px] flex items-center justify-center ${
                    !shouldFetchMoreData && "hidden"
                  }`}
                >
                  {values.presentations.length > 0 && values.pending ? (
                    <LoadingAssetSmall2 />
                  ) : (
                    values.presentations.length > 0 && (
                      <AiFillCaretDown
                        className="text-2xl cursor-pointer"
                        onClick={shouldFetchMoreData ? getPresentations : null}
                      />
                    )
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Institutions;
