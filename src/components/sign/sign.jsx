import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../contexts/userContext";
import { Helmet } from "react-helmet";
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

export default function SignPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  const [isSignupPage, setIsSignupPage] = useState(
    useLocation().pathname === "/signup"
  );

  const [passwordErr, setPasswordErr] = useState(null);
  const [emailErr, setEmailErr] = useState(null);
  const [fullNameErr, setFullNameErr] = useState(null);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(null);

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });

  const showPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const signin = useMutation({
    mutationFn: () => {
      return axios
        .post("/api/v1/auth/login", {
          email: values.email,
          password: values.password
        });
    },
    onSuccess: ({ data }) => {
      setUser(data.user);
      localStorage.setItem("accessToken", data.token);
      navigate('/');
    }
  });

  const signup = useMutation({
    mutationFn: () => {
      return axios
        .post("/api/v1/auth/register", {
          email: values.email,
          password: values.password,
          username: values.fullName,
        });
    },
    onSuccess: ({ data }) => {
      setUser(data.user);
      localStorage.setItem("accessToken", data.token);
      navigate('/');
    }
  });

  function handleSubmition(e) {
    e.preventDefault();

    if (!isSignupPage) {
      // handle validations for SIGNIN NOTE: shine your eye 👀✨
      if (values.email.length === 0) {
        setEmailErr("Email value is empty!");
      } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.email)) {
        setEmailErr("Invalid Email address!");
      } else {
        setEmailErr(null);
      }

      if (values.password.length < 8) {
        setPasswordErr("Password can'nt be empty!");
      } else {
        setPasswordErr(null);
      }
      console.log(values);
      if (emailErr || passwordErr) return;
      // handle axios FOR SIGNIN 😂
      if (emailErr === null &&
        passwordErr === null &&
        values.email.length !== 0 &&
        values.password.length !== 0) {
        signin.mutate();
      }

    } else {
      // handle validations for SIGNUP NOTE: shine your eye 👀✨
      if (values.fullName.length === 0) {
        setFullNameErr("Username value is empty!");
      } else {
        setFullNameErr(null);
      }

      if (values.email.length === 0) {
        setEmailErr("Email value is empty!");
      } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.email)) {
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
        setConfirmPasswordErr("Password and confirm Password does'nt match!");
      } else {
        setConfirmPasswordErr(null);
      }
      console.log(values);
      if (fullNameErr || emailErr || passwordErr || confirmPasswordErr) return;
      // handle axios FOR SIGNUP 😂
      if (fullNameErr === null &&
        emailErr === null &&
        passwordErr === null &&
        confirmPasswordErr === null &&
        values.fullName.length !== 0 &&
        values.email.length !== 0 &&
        values.password.length !== 0 &&
        values.confirmPassword.length !== 0) {
        signup.mutate();
      }
    }
  }

  const switchPage = (e) => {
    e.preventDefault();
    setIsSignupPage(!isSignupPage);
    setValues({ ...values, fullName: "", email: "", password: "", showPassword: false });
    setPasswordErr(null);
    setEmailErr(null);
    setFullNameErr(null);
    setConfirmPasswordErr(null);
    signin.reset();
    signup.reset();
  }

  return (
    <section className="signpage h-screen relative">
      <div className="container h-full flex flex-row justify-between items-center gap-10  absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
        <div className="formwrapper relative w-[55%] bg-[#FFFFF0] h-[95vh] rounded-[15px] p-10 maxScreenMobile:px-2 !text-[.8rem] overflow-auto maxScreenMobile:w-full">
          <div className="_sticky top-0 maxScreen:z-50">
            <Link to="/" className="block text-md mb-3 font-[600]">
              <img src={logo_orange} alt={logo_orange} className="w-5 aspect-square" />
              {/* PPTLINKS */}
            </Link>
            <p className="mb-5 text-[.7rem]">
              {isSignupPage ? "Create Account" : "Welcome Back"}
            </p>
          </div>
          <h1 className="text-center text-3xl font-[400] mb-10">
            {isSignupPage ? "Sign Up" : "Sign In"}
          </h1>
          <form onSubmit={handleSubmition} autoComplete="false"> {/*action={isSignupPage ? "/signup" : "/signin"} method="post"*/}
            {/* sign up */}
            {signin.isError && <p className="text-[red] text-center font-bold text-xl">{signin.error.response.data.message}</p>}
            {signup.isError && <p className="text-[red] text-center font-bold text-xl">{signup.error.response.data.message}</p>}
            <div
              className={`flex justify-between items-center gap-4 mb-8 ${!isSignupPage && "!flex-col"} maxScreenMobile:flex-col`}
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
                {fullNameErr && (<p className="text-[red] pl-2 absolute top-[100]">{fullNameErr}</p>)}
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
                {emailErr && (<p className="text-[red] pl-2 absolute top-[100]">{emailErr}</p>)}
              </div>
            </div>

            {/* sign in */}
            <div
              className={`flex justify-between items-center gap-4 mb-8 ${!isSignupPage && "!flex-col !gap-2"}  maxScreenMobile:!flex-col`}
            >
              <div
                className={`w-[50%] maxScreenMobile:!w-full ${!isSignupPage && "!w-4/5"} relative maxScreenMobile:mt-8`}
              >
                <label htmlFor="password" className="block w-full mb-2 pl-1">
                  *Password
                </label>
                <div className="relative w-full h-fit">
                  {values.showPassword ? (
                    <AiFillEyeInvisible className="text-black font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer" onClick={showPassword} />
                  ) : (
                    <AiFillEye className="text-black font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer" onClick={showPassword} />
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
                {passwordErr && (<p className="text-[red] pl-2 absolute top-[100]">{passwordErr}</p>)}
              </div>
              <div
                className={`w-[50%] maxScreenMobile:!w-full ${!isSignupPage && "!hidden"} relative maxScreenMobile:mt-8`}
              >
                <label
                  htmlFor="confirmpassword"
                  className="block w-full mb-2 pl-1"
                >
                  *confirmpassword
                </label>
                <div className="relative w-full h-fit">
                  {values.showPassword ? (
                    <AiFillEyeInvisible className="text-black font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer" onClick={showPassword} />
                  ) : (
                    <AiFillEye className="text-black font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer" onClick={showPassword} />
                  )}
                  <input
                    type={values.showPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={(e) =>
                      setValues({ ...values, confirmPassword: e.target.value })
                    }
                    id="confirmpassword"
                    name="confirmpassword"
                    placeholder="**********"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${confirmPasswordErr ? "border border-[red] outline-offset-2" : "border-none"}`}
                  />
                </div>
                {confirmPasswordErr && (<p className="text-[red] pl-2 absolute top-[100]">{confirmPasswordErr}</p>)}
              </div>
            </div>
            <button disabled={signin.isPending || signup.isPending} className="flex justify-center items-center w-3/5 m-auto mt-14 mb-2 bg-black rounded-3xl text-white h-[2.5rem] _px-5 shadow-xl border-none maxScreenMobile:w-full">
              {(signin.isPending || signup.isPending) ? <LoadingAssetSmall2 /> : isSignupPage ? "Sign Up" : "Sign In"}
            </button>
            <p className="w-3/5 m-auto mt-4 text-center">
              {isSignupPage
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              {/* href={isSignupPage ? "/signin" : "/signup"} */}
              <a
                onClick={switchPage}
                className="text-[#FFA500]"
              >
                {isSignupPage ? "Sign In" : "SIgn Up"}
              </a>
            </p>
            <a
              href="#"
              className={`block w-fit m-auto mt-4 text-center text-[#FFA500] ${isSignupPage && "hidden"}`}
            >
              Forgot password
            </a>
          </form>
          <div className="w-full mt-3 flex flex-col items-center justify-between gap-2">
            <span className="flex w-full justify-center items-center mb-2">
              <hr className="block w-[35%] h-[.1px] bg-black" />
              <span className="block w-fit text-center mx-1 font-bold">Or</span>
              <hr className="block w-[35%] h-[.1px] bg-black" />
            </span>
            <button
              disabled
              className="flex items-center justify-center w-3/5 border-[1px] border-black text-[.7rem] h-[40px] px-4 rounded-3xl maxScreenMobile:w-full hover:!font-normal hover:!cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-5 block w-[1.3rem] aspect-square"
                width="26.186"
                height="16.366"
                viewBox="0 0 26.186 16.366"
              >
                <path
                  id="Icon_awesome-google-plus-g"
                  data-name="Icon awesome-google-plus-g"
                  d="M16.809,11.511a6.941,6.941,0,0,1,.134,1.362c0,4.678-3.137,7.993-7.859,7.993a8.183,8.183,0,0,1,0-16.366,7.817,7.817,0,0,1,5.481,2.143L12.343,8.776a4.6,4.6,0,0,0-3.26-1.262,5.17,5.17,0,0,0,0,10.338,4.432,4.432,0,0,0,4.644-3.528H9.083V11.511h7.725Zm7.9.274V9.41H22.324v2.375H19.949v2.387h2.375v2.375h2.387V14.172h2.375V11.785H24.711Z"
                  transform="translate(-0.9 -4.5)"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
            <button
              disabled
              className="flex items-center justify-center w-3/5 border-[1px] border-black text-[.7rem] h-[40px] px-4 rounded-3xl maxScreenMobile:w-full hover:!font-normal hover:!cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-5 block w-[1.3rem] aspect-square"
                width="9.176"
                height="17.132"
                viewBox="0 0 9.176 17.132"
              >
                <path
                  id="Icon_awesome-facebook-f"
                  data-name="Icon awesome-facebook-f"
                  d="M10.184,9.637l.476-3.1H7.685V4.524A1.55,1.55,0,0,1,9.433,2.849h1.352V.209A16.493,16.493,0,0,0,8.384,0C5.934,0,4.333,1.485,4.333,4.173V6.536H1.609v3.1H4.333v7.5H7.685v-7.5Z"
                  transform="translate(-1.609)"
                />
              </svg>
              <span>Sign in with Facebook</span>
            </button>
          </div>
          {/* svgs all over the area 😠🐱‍👤 */}
          <img
            src={meetingsvg}
            alt={meetingsvg}
            className="block w-[8rem] h-[9rem] pointer-events-none  absolute top-[10%] left-[50%] translate-x-[-50%]"
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
            <p className="block w-full text-[.8rem] -mb-24 leading-6 text-justify">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
