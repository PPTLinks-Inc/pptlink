import { useState } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate
} from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import play from "/team/pptlink_resources/presentation-play-svgrepo-com.png";
import chat from "/team/pptlink_resources/presentation-svgrepo-com (1).png";
import meetingsvg from "/team/pptlink_resources/presentation-svgrepo-com (3).png";
import groupchats from "/team/pptlink_resources/presentation-svgrepo-com (4).png";
import flowchat from "/team/pptlink_resources/presentation-svgrepo-com (5).png";
import switchboard from "/team/pptlink_resources/presentation-whiteboard-svgrepo-com.png";
import { LoadingAssetSmall2 } from "../../assets/assets";
import "../../assets/styles/general_css.css";
import logo_orange from "/imgs/onemorecolor.png";
import PopUpModal from "../Models/dashboardModel";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { standardFetch } from "../../lib/axios";
import useUser from "../../hooks/useUser";
import { setAuthFetchToken } from "../../lib/axios";
import GoogleLoginButton from "../ui/googleLoginButton";

export default function SignPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [passwordErr, setPasswordErr] = useState(null);
  const [emailErr, setEmailErr] = useState(null);
  const [fullNameErr, setFullNameErr] = useState(null);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(null);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false
  });
  const [modal, setModal] = useState(false);
  const [isSignupPage, setIsSignupPage] = useState(
    useLocation().pathname === "/signup" ? true : false
  );
  const [isResetPage, setIsResetPage] = useState(
    useLocation().pathname === "/forgot-password" ? true : false
  );

  const showPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const signin = useMutation({
    mutationFn: () => {
      return standardFetch.post("/api/v1/auth/login", {
        email: values.email,
        password: values.password
      });
    },
    onSuccess: ({ data }) => {
      if (window.opener) {
        window.opener.postMessage(
          { type: "SIGN_IN", payload: data.user, token: data.token },
          window.location.origin // Ensure only trusted origins receive the message
        );
        window.close();
      } else {
        setUser(data.user);
        setAuthFetchToken(data.token);
        const redirectUrl = searchParams.get("redirect") || "/";
        navigate(redirectUrl);
      }
    }
  });

  const signup = useMutation({
    mutationFn: () => {
      return standardFetch.post("/api/v1/auth/register", {
        email: values.email,
        password: values.password,
        username: values.fullName
      });
    },
    onSuccess: ({ data }) => {
      if (window.opener) {
        window.opener.postMessage(
          { type: "SIGN_IN", payload: data.user, token: data.token },
          window.location.origin // Ensure only trusted origins receive the message
        );
        window.close();
      } else {
        setUser(data.user);
        setAuthFetchToken(data.token);
        navigate("/");
      }
    }
  });

  function handleSubmition(e) {
    e.preventDefault();

    if (isResetPage) {
      // handle validations for RESET PASSWORD ✨
      if (values.email.length === 0) {
        setEmailErr("Email cannot be empty!");
      } else if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          values.email
        )
      ) {
        setEmailErr("Invalid Email address!");
      } else {
        setEmailErr(null);
      }
      if (emailErr) return;
      if (emailErr === null && values.email.length !== 0) {
        // handle axios FOR RESET PASSWORD ✔ here
        setModal(true);
      }
    } else if (!isSignupPage) {
      // handle validations for SIGNIN NOTE: shine your eye 👀✨
      if (values.email.length === 0) {
        setEmailErr("Email cannot be empty!");
      } else if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          values.email
        )
      ) {
        setEmailErr("Invalid Email address!");
      } else {
        setEmailErr(null);
      }

      if (values.password.length < 8) {
        setPasswordErr("Password cannot be empty!");
      } else {
        setPasswordErr(null);
      }
      if (emailErr || passwordErr) return;
      // handle axios FOR SIGNIN 😂
      if (
        emailErr === null &&
        passwordErr === null &&
        values.email.length !== 0 &&
        values.password.length !== 0
      ) {
        signin.mutate();
      }
    } else {
      // handle validations for SIGNUP NOTE: shine your eye 👀✨
      if (values.fullName.length === 0) {
        setFullNameErr("Username cannot be empty");
      } else {
        setFullNameErr(null);
      }

      if (values.email.length === 0) {
        setEmailErr("Email cannot be empty");
      } else if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          values.email
        )
      ) {
        setEmailErr("Invalid Email address!");
      } else {
        setEmailErr(null);
      }

      if (values.password.length < 8) {
        setPasswordErr("Your Password should be more than 8 characters!");
      } else {
        setPasswordErr(null);
      }

      if (values.password !== values.confirmPassword) {
        setConfirmPasswordErr("Password and confirm Password does not match!");
      } else {
        setConfirmPasswordErr(null);
      }
      if (fullNameErr || emailErr || passwordErr || confirmPasswordErr) return;
      // handle axios FOR SIGNUP 😂
      if (
        fullNameErr === null &&
        emailErr === null &&
        passwordErr === null &&
        confirmPasswordErr === null &&
        values.fullName.length !== 0 &&
        values.email.length !== 0 &&
        values.password.length !== 0 &&
        values.confirmPassword.length !== 0
      ) {
        signup.mutate();
      }
    }
  }

  const switchPage = (e) => {
    e.preventDefault();
    if (isResetPage) {
      setModal(false);
      setIsResetPage(!isResetPage);
      navigate("/signin");
    } else {
      setIsSignupPage(!isSignupPage);
    }
    setValues({
      ...values,
      fullName: "",
      email: "",
      password: "",
      showPassword: false
    });
    setPasswordErr(null);
    setEmailErr(null);
    setFullNameErr(null);
    setConfirmPasswordErr(null);
    signin.reset();
    signup.reset();
  };

  const containertVarients = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.5,
        duration: 1.5
      }
    },
    exit: {
      x: "-100vw",
      transition: {
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${isSignupPage ? "Sign Up" : isResetPage ? "Forgot password" : "Sign In"} - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks, PPTLinksSignIn, PPTLinks${isSignupPage ? "SignUp" : isResetPage ? "Forgot password" : "SignIn"}`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://www.PPTLink.com/${isSignupPage ? "signup" : isResetPage ? "forgot-password" : "signin"}`}
        />
        <meta
          property="og:title"
          content={`${isSignupPage ? "Sign Up" : isResetPage ? "Forgot password" : "Sign In"} - PPTLinks `}
        />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta
          property="twitter:url"
          content={`https://www.PPTLink.com/${isSignupPage ? "signup" : isResetPage ? "forgot-password" : "signin"}`}
        />

        <meta
          property="twitter:title"
          content={`${isSignupPage ? "Sign Up" : isResetPage ? "Forgot password" : "Sign In"} - PPTLinks `}
        />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>
      <PopUpModal
        open={modal}
        onClose={() => {}}
        onSubmit={(e) => {
          switchPage(e);
        }}
        isLoading={false}
        oneButton={true}
        message={`A reset link has been sent to this email ${values.email ? values.email : ""}`}
        actionText={"OK"}
      />
      <motion.section
        className="signpage h-screen relative"
        variants={containertVarients}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="container h-full flex flex-row justify-between items-center gap-10  absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
          <div className="formwrapper relative w-[38.75rem] bg-[#FFFFF0] max-h-[38.75rem] rounded-[0.9375rem] p-10 maxScreenMobile:px-[0.125rem] !responsiveText overflow-auto maxScreenMobile:w-full maxScreenMobile:max-h-[90vh]">
            <div className="flex justify-left item-center gap-2 maxScreen:z-50 maxScreenMobile:px-3">
              <Link to="/" className="block text-md mb-3 font-[600]">
                <img
                  src={logo_orange}
                  alt={logo_orange}
                  className="w-5 aspect-square"
                />
                {/* PPTLINKS */}
              </Link>
              <p className="mb-5 text-[.7rem]">
                {isSignupPage
                  ? "Create Account"
                  : isResetPage
                    ? "Welcome To Reset"
                    : "Welcome Back"}
              </p>
            </div>
            <h1 className="text-center text-3xl font-[400] mb-10">
              {isSignupPage
                ? "Sign Up"
                : isResetPage
                  ? "Forgot Password"
                  : "Sign In"}
            </h1>
            <form
              onSubmit={handleSubmition}
              autoComplete="false"
              className="maxScreenMobile:px-3"
            >
              {" "}
              {/* sign up */}
              {signin.isError && (
                <p className="text-[red] text-center font-bold text-xl">
                  {signin.error.response?.data
                    ? signin.error.response.data.message
                    : signin.error.message}
                </p>
              )}
              {signup.isError && (
                <p className="text-[red] text-center font-bold text-xl">
                  {signup.error.response?.data
                    ? signup.error.response.data.message
                    : signup.error.message}
                </p>
              )}
              <div
                className={`flex justify-between items-center gap-4 ${!isResetPage && "mb-8"} ${!isSignupPage && "!flex-col"} maxScreenMobile:flex-col`}
              >
                <div
                  className={`w-[50%] ${!isSignupPage && "!hidden"} maxScreenMobile:!w-full relative maxScreenMobile:mt-8`}
                >
                  <label htmlFor="fullname" className="block w-full mb-2 pl-1">
                    *Username
                  </label>
                  <input
                    type="text"
                    value={values.fullName}
                    onChange={(e) =>
                      setValues({ ...values, fullName: e.target.value })
                    }
                    id="fullname"
                    name="fullname"
                    placeholder="Full Name"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${fullNameErr ? "border border-[red] outline-offset-2" : "border-none"}`}
                  />
                  {fullNameErr && (
                    <p className="text-[red] pl-2 absolute top-[100]">
                      {fullNameErr}
                    </p>
                  )}
                </div>
                <div
                  className={`w-[50%] ${!isSignupPage && "!w-4/5"} maxScreenMobile:!w-full relative maxScreenMobile:mt-8`}
                >
                  <label htmlFor="email" className="block w-full mb-2 pl-1">
                    *Email
                  </label>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    id="email"
                    name="email"
                    placeholder="eg: example@gmail.com"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${emailErr ? "border border-[red] outline-offset-2" : "border-none"}`}
                  />
                  {emailErr && (
                    <p className="text-[red] pl-2 absolute top-[100]">
                      {emailErr}
                    </p>
                  )}
                </div>
              </div>
              {/* sign in */}
              <div
                className={`flex justify-between items-center gap-4 mb-8 ${!isSignupPage && "!flex-col !gap-2"}  maxScreenMobile:!flex-col`}
              >
                <div
                  className={`w-[50%] maxScreenMobile:!w-full ${!isSignupPage && "!w-4/5"} ${isResetPage && "!hidden"} relative maxScreenMobile:mt-8`}
                >
                  <label htmlFor="password" className="block w-full mb-2 pl-1">
                    *Password
                  </label>
                  <div className="relative w-full h-fit">
                    {values.showPassword ? (
                      <AiFillEyeInvisible
                        className="text-primaryTwo font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer"
                        onClick={showPassword}
                      />
                    ) : (
                      <AiFillEye
                        className="text-primaryTwo font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer"
                        onClick={showPassword}
                      />
                    )}
                    <input
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) =>
                        setValues({ ...values, password: e.target.value })
                      }
                      id="password"
                      name="password"
                      placeholder="**********"
                      className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${passwordErr ? "border border-[red] outline-offset-2" : "border-none"}`}
                    />
                  </div>
                  {passwordErr && (
                    <p className="text-[red] pl-2 absolute top-[100]">
                      {passwordErr}
                    </p>
                  )}
                </div>
                <div
                  className={`w-[50%] maxScreenMobile:!w-full ${!isSignupPage && "!hidden"} relative maxScreenMobile:mt-8`}
                >
                  <label
                    htmlFor="confirmpassword"
                    className="block w-full mb-2 pl-1"
                  >
                    *confirm password
                  </label>
                  <div className="relative w-full h-fit">
                    {values.showPassword ? (
                      <AiFillEyeInvisible
                        className="text-primaryTwo font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer"
                        onClick={showPassword}
                      />
                    ) : (
                      <AiFillEye
                        className="text-primaryTwo font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer"
                        onClick={showPassword}
                      />
                    )}
                    <input
                      type={values.showPassword ? "text" : "password"}
                      value={values.confirmPassword}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          confirmPassword: e.target.value
                        })
                      }
                      id="confirmpassword"
                      name="confirmpassword"
                      placeholder="**********"
                      className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${confirmPasswordErr ? "border border-[red] outline-offset-2" : "border-none"}`}
                    />
                  </div>
                  {confirmPasswordErr && (
                    <p className="text-[red] pl-2 absolute top-[100]">
                      {confirmPasswordErr}
                    </p>
                  )}
                </div>
              </div>
              <button
                disabled={signin.isPending || signup.isPending}
                className="flex justify-center items-center w-3/5 m-auto mt-14 mb-2 bg-primaryTwo rounded-md text-white h-[2.5rem] _px-5 shadow-xl border-none maxScreenMobile:w-full"
              >
                {signin.isPending || signup.isPending ? (
                  <LoadingAssetSmall2 />
                ) : isSignupPage ? (
                  "Sign Up"
                ) : isResetPage ? (
                  "Reset your Password"
                ) : (
                  "Sign In"
                )}
              </button>
              <p className="w-3/5 m-auto mt-4 text-center">
                {isSignupPage
                  ? "Already have an account?"
                  : isResetPage
                    ? "Remembered your password"
                    : "Don't have an account?"}{" "}
                {/* href={isSignupPage ? "/signin" : "/signup"} */}
                <button onClick={switchPage} className="text-[#FFA500] cursor-pointer hover:underlines">
                  {isSignupPage || isResetPage ? "Sign In" : "SIgn Up"}
                </button>
              </p>
              <Link
                to={"/forgot-password"}
                className={`cursor-pointer hover:underline block w-fit m-auto mt-4 text-center text-[#FFA500] ${(isSignupPage || isResetPage) && "hidden"}`}
              >
                Forgot password
              </Link>
            </form>
            <div className="w-full mt-3 flex flex-col items-center justify-between gap-2 maxScreenMobile:px-3">
              <span className="flex w-full justify-center items-center mb-2">
                <hr className="block w-[35%] h-[0.1px] bg-primaryTwo" />
                <span className="block w-fit text-center mx-1 font-bold">
                  Or
                </span>
                <hr className="block w-[35%] h-[0.1px] bg-primaryTwo" />
              </span>

              <GoogleLoginButton />
            </div>
            {/* svgs all over the area 😠🐱‍👤 */}
            <img
              src={meetingsvg}
              alt={meetingsvg}
              className="block w-[5rem] h-[6rem] pointer-events-none  absolute top-[5%] left-[25%] rotate-[25deg]"
            />

            <img
              src={isSignupPage ? play : chat}
              alt={isSignupPage ? play : chat}
              className="block w-[4rem] aspect-square pointer-events-none  absolute bottom-[16%] left-[5%]"
            />

            <img
              src={chat}
              alt={chat}
              className={`block w-[4rem] aspect-square pointer-events-none  absolute bottom-[25%] right-[2%] ${!isSignupPage && "hidden"}`}
            />

            <img
              src={isSignupPage ? groupchats : switchboard}
              alt={isSignupPage ? groupchats : switchboard}
              className="block w-[4rem] aspect-square pointer-events-none  absolute bottom-[1%] right-[20%]"
            />

            <img
              src={isSignupPage ? flowchat : play}
              alt={isSignupPage ? flowchat : play}
              className="block w-[4rem] aspect-square pointer-events-none  absolute top-[10%] right-[5%]"
            />
          </div>
          <div className="w-[45%] text-white maxScreenMobile:hidden">
            <div className="min-h-[95vh] flex flex-col justify-evenly items-center text-[#FFFFF0]">
              <h1 className="block w-full text-right text-4xl">PPTLINKS</h1>
              <p className="block w-full text-[1.1rem] leading-[2rem] -mb-24 text-left">
                PPTLinks is your ultimate solution for seamless presentations,
                designed to excel in challenging network environments, replace
                traditional projectors in classrooms, boardrooms, and seminars,
                and provide flawless performance for both live and virtual
                audiences with robust security and seamless integration with
                other software and devices.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
