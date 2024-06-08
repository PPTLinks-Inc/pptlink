/* eslint-disable */

import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";
import { LoadingAssetSmall } from "../../assets/assets";
import { userContext } from "../../contexts/userContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { delay, motion } from "framer-motion";
import { duration } from "@mui/material";

const Login = () => {
  const controller = new AbortController();
  const { user, setUser } = useContext(userContext);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [values, setValues] = useState({
    signup: false,

    userName: "",
    email: "",
    password: "",

    showPassword: false,

    loginPending: false,
    signupPending: false,

    validateError: []
  });

  useEffect(() => {
    pathname.includes("signup") &&
      setValues((prev) => ({ ...prev, signup: true }));
  }, [pathname]);

  const showPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  let tempArr = [];

  const formValidation = () => {
    tempArr = [];

    if (values.signup && values.userName.length < 3) {
      tempArr = [...tempArr, "Your user name is too short"];
    }

    if (values.email.length < 5) {
      tempArr = [...tempArr, "Your Email is too short"];
    }

    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      )
    ) {
      tempArr = [...tempArr, "Your Email is not Valid"];
    }

    if (values.password.length < 5) {
      tempArr = [...tempArr, "Your Password should be more than 5 characters"];
    }

    setValues({ ...values, validateError: tempArr });
  };

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      formValidation();

      if (tempArr.length === 0) {
        const sendData = { email: values.email, password: values.password };
        setValues({ ...values, loginPending: true, validateError: tempArr });

        axios
          .post("/api/v1/auth/login", sendData, {
            signal: controller.signal
          })
          .then(({ data }) => {
            setUser(data.user);
            localStorage.setItem("accessToken", data.token);

            navigate("/");

            setValues({
              ...values,
              loginPending: false,
              email: "",
              password: ""
            });
            controller.abort();
          })
          .catch((err) => {
            setValues({
              ...values,
              loginPending: false,
              validateError: [err.response.data.message]
            });
          });
      }
    },
    [values]
  );

  const handleSignup = useCallback(
    (e) => {
      e.preventDefault();

      formValidation();

      if (tempArr.length === 0) {
        const sendData = {
          email: values.email,
          password: values.password,
          username: values.userName
        };
        setValues({ ...values, signupPending: true, validateError: tempArr });

        axios
          .post("/api/v1/auth/register", sendData, {
            signal: controller.signal
          })
          .then(({ data }) => {
            setUser(data.user);
            navigate("/");

            setValues({
              ...values,
              signupPending: false,
              email: "",
              password: ""
            });
            controller.abort();
          })
          .catch((err) => {
            setValues({
              ...values,
              signupPending: false,
              validateError: [err.response.data.message]
            });
          });
      }
    },
    [values]
  );

  return (
    <section className="flex justify-center my-9 w-[95%] m-auto">
      {/* meta and SEO information */}
      <Helmet>
        <title>{`Login - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks,`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.PPTLink.com/login`} />
        <meta property="og:title" content={`Login - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta
          property="twitter:url"
          content={`https://www.PPTLink.com/login`}
        />

        <meta property="twitter:title" content={`Login - PPTLinks `} />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>

      {!values.signup && (
        <form onSubmit={handleLogin} autoComplete="false" className="w-full">
          <div className="w-full m-auto border border-slate-200 rounded-xl border-collapse lg:w-[500px]">
            <div className="border-b border-slate-200 w-full p-[30px]">
              <h1 className="text-xl font-bold">Log in</h1>
              Note: If you belong to an institution, log in using your email and
              the institution password
            </div>
            <input
              type="email"
              value={values.email}
              className="w-full p-[30px] bg-transparent border-b border-slate-200"
              placeholder="Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <div
              className={`w-full h-fit flex bg-transparent ${
                values.validateError.length > 0 && "border-b border-slate-200"
              }`}
            >
              <input
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                className="flex-[.75] h-full p-[30px] bg-transparent"
                placeholder="Password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <div
                className={`flex-[.25] bg-slate-200 py-[30px] border border-slate-200 border-collapse flex items-center justify-center cursor-pointer ${
                  values.validateError.length === 0 && "rounded-br-xl"
                }`}
                onClick={showPassword}
              >
                {values.showPassword ? (
                  <AiFillEyeInvisible className="text-black font-bold text-2xl" />
                ) : (
                  <AiFillEye className="text-black font-bold text-2xl" />
                )}
              </div>
            </div>
            {values.validateError.length > 0 && (
              <ul className="flex flex-col justify-between p-[30px] list-[disc]">
                {values.validateError.map((error, i) => (
                  <li key={i} className="text-rose-600">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex m-auto gap-3 justify-between items-center lg:w-[500px]">
            <button
              type="submit"
              disabled={values.loginPending}
              className="px-0.5 w-36 md:px-7 flex items-center justify-center !h-fit rounded-xl bg-slate-200 text-black my-[20px]"
            >
              {values.loginPending ? (
                <LoadingAssetSmall />
              ) : (
                <p className="py-3 md:py-[9px]">Log in</p>
              )}
            </button>

            <p className="text-right ">
              Do not have an account?{" "}
              <span
                className="text-xl font-bold cursor-pointer"
                onClick={() => setValues({ ...values, signup: !values.signup })}
              >
                Signup
              </span>
            </p>
          </div>
        </form>
      )}

      {values.signup && (
        <form onSubmit={handleSignup} className="w-full">
          <div className="w-full m-auto border border-slate-200 rounded-xl border-collapse lg:w-[500px]">
            <div className="border-b border-slate-200 w-full p-[30px]">
              <h1 className="text-xl font-bold">Sign up</h1>
              Please input the necessary information and create an account
            </div>
            <input
              type="text"
              value={values.userName}
              className="w-full p-[30px] bg-transparent border-b border-slate-200"
              placeholder="Username"
              onChange={(e) =>
                setValues({ ...values, userName: e.target.value })
              }
            />

            <input
              type="email"
              value={values.email}
              className="w-full p-[30px] bg-transparent border-b border-slate-200"
              placeholder="Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <div
              className={`w-full h-fit flex bg-transparent ${
                values.validateError.length > 0 && "border-b border-slate-200"
              }`}
            >
              <input
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                className="flex-[.75] h-full p-[30px] bg-transparent"
                placeholder="Password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <div
                className={`flex-[.25] bg-slate-200 py-[30px] border border-slate-200 border-collapse flex items-center justify-center cursor-pointer ${
                  values.validateError.length === 0 && "rounded-br-xl"
                }`}
                onClick={showPassword}
              >
                {values.showPassword ? (
                  <AiFillEyeInvisible className="text-black font-bold text-2xl" />
                ) : (
                  <AiFillEye className="text-black font-bold text-2xl" />
                )}
              </div>
            </div>
            {values.validateError.length > 0 && (
              <ul className="flex flex-col justify-between p-[30px] list-[disc]">
                {values.validateError.map((error, i) => (
                  <li key={i} className="text-rose-600">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex m-auto gap-3 justify-between items-center lg:w-[500px]">
            <button
              type="submit"
              className="px-0.5 flex items-center justify-center w-36 md:px-7 rounded-xl bg-slate-200 text-black my-[20px]"
              disabled={values.signupPending}
            >
              {values.signupPending ? (
                <LoadingAssetSmall />
              ) : (
                <p className="py-2 md:py-[9px]">Sign up</p>
              )}
            </button>

            <p className="text-right ">
              Already have an account?{" "}
              <span
                className="text-xl font-bold cursor-pointer"
                onClick={() => setValues({ ...values, signup: !values.signup })}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      )}
    </section>
  );
};

export default Login;
