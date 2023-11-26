/* eslint-disable no-unused-vars */

import {
  useState,
  useReducer,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import profile from "../../images/profile.jfif";
import { AiFillCaretDown } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { LoadingAssetBig2, LoadingAssetSmall2, LoadingAssetSmall } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { UPLOAD } from "../../constants/routes";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { userContext } from "../../contexts/userContext";
import { useInView } from "react-intersection-observer";

const initialPageNo = 1;
let shouldFetchMoreData = true;

const pageNoReducer = (state, action) => {
  console.log({ state, action });
  if (shouldFetchMoreData) return (action += 1);

  return state;
};

let isFetching = false;
const Dashboard = () => {
  const controller = new AbortController();

  const { ref: arrowRef, inView } = useInView({
    threshold: 0.8,
    rootMargin: "15%",
  });

  const navigate = useNavigate();

  const { user, setUser } = useContext(userContext);
  const [loggingOut, setLoggingOut] = useState(false);

  const [values, setValues] = useState({
    error: false,

    setPresentations: [],

    pending: true,
    isIntersecting: false,
  });

  const [pageNo, pageNoDIspatch] = useReducer(pageNoReducer, initialPageNo);

  const getPresentations = () => {
    setValues((prev) => ({ ...prev, pending: true }));

    axios
      .get(`/api/v1/ppt/presentations?noPerPage=10&pageNo=${pageNo}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        console.log(data);
        setValues((prev) => ({
          ...prev,
          setPresentations: [...prev.setPresentations, ...data.presentations],
          pending: false,
        }));
        isFetching = false;
        pageNoDIspatch(pageNo);
        if (data.pagePresentationCount < 10) {
          shouldFetchMoreData = false;
        }
        controller.abort();
      })
      .catch((err) => {
        setValues((prev) => ({
          ...prev,
          pending: false,
          error: true,
        }));
      });
  };

  useEffect(() => {
    if (isFetching) return;
    isFetching = true;
    getPresentations();
  }, []);

  useEffect(() => {
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

  const handleLogout = () => {
    setLoggingOut(true);
    const sendData = { email: user.email };
    axios
      .post("/api/v1/auth/logout", sendData, { signal: controller.signal })
      .then(({ data }) => {
        setUser(null);
        localStorage.removeItem("accessToken");
        navigate("/");

        controller.abort();
      })
      .catch((err) => {
        setLoggingOut(false);
        console.log(err)
      });
  };

  return (
    <section className="min-h-full w-full py-[20px] relative flex flex-col justify-around_">
      {/* meta and SEO information */}
      <Helmet>
        <title>{`Dashboard - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks, Dashboard`}
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

      <div className="flex flex-col md:flex-row max-w-[80%] mx-auto gap-20 items-center mb-[40px]">
        <label
          htmlFor="uploadImg"
          className="block min-w-[250px] h-fit relative rounded-full"
        >
          <img
            className="w-[250px] h-[250px] rounded-full mt-[40px] mb-4 md:mb-[40px]"
            src={profile}
            alt="your profile"
            draggable="false"
            loading="lazy"
          />
          <FaPlus
            size="30px"
            className="absolute z-10 top-[65%] right-0 border rounded border-slate-200 text-slate-200 "
          />
          <input type="file" id="uploadImg" className="absolute" hidden />
        </label>

        <div className="">
          <h2 className="text-xl mb-6 font-bold">Welcome to PPTLinks,</h2>
          <p className="mb-6">
            Your upload list and all other activities carried out on the
            platform will appear here. Feel free to upload more presentations,
            lets make this world paperless.
          </p>

          <button className="" onClick={() => navigate(UPLOAD)}>
            <span className="px-7 rounded-xl py-1 bg-slate-200 text-black flex items-center justify-around animate-bounce">
              <GrAdd /> <span className="ml-3">Upload</span>
            </span>
          </button>
        </div>
      </div>

      <div className="px-5 md:px-0">
        <div className="w-full px-3 flex justify-between items-center">
          <h2 className="text-xl mt-4 mb-6">Your presentations</h2>

          <button
            className="px-7 rounded-xl py-2 bg-slate-200 text-black"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            { loggingOut ? <LoadingAssetSmall /> : "Log out" }
          </button>
        </div>
        {values.pending && values.setPresentations.length < 1 ? (
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
                <div className="w-full h-fit flex md:grid md:grid-cols-3 justify-start flex-wrap gap-x-5 gap-y-[60px]">
                  {values.setPresentations.length < 1 ? (
                    <div className="w-full h-[25vh] flex justify-center items-center">
                      <LoadingAssetBig2 />
                    </div>
                  ) : (
                    values.setPresentations.map((_, i) => (
                      <div key={i} className="m-auto md:w-[300px] cursor-pointer">
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
                  {values.setPresentations.length > 0 && values.pending ? (
                    <LoadingAssetSmall2 />
                  ) : (
                    values.setPresentations.length > 0 && (
                      <AiFillCaretDown
                        className="text-2xl cursor-pointer"
                        onClick={getPresentations}
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
export default Dashboard;
