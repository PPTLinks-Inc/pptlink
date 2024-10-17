import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo_orange from "/imgs/onemorecolor.png";
import { MdDone } from "react-icons/md";
import PopUpModal from "../Models/dashboardModel";

export default function ResetPasswordPage() {
    const [passwordErr, setPasswordErr] = useState(null);
    const [values, setValues] = useState({
        password: "",
        showPassword: false
    });

    const showPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    return (
        <section className="w-full h-screen bg-[#FFFFF0] flex flex-col justify-center items-center gap-8 relative maxSmallMobile:gap-2 maxSmallMobile:overflow-y-auto">
            <div className="w-[90%] mx-auto flex justify-center items-center maxSmallMobile:flex-col maxSmallMobile:gap-4">
                <Link to="/" className="block w-fit h-fit absolute top-[2rem] left-[3rem] maxSmallMobile:!static maxSmallMobile:top-0 maxSmallMobile:left-0">
                    <img
                        src={logo_orange}
                        alt={logo_orange}
                        className="block w-10 aspect-square"
                    />
                </Link>
                <p className="text-[1.7rem] font-[900] mx-auto maxSmallMobile:text-[1rem] maxSmallMobile:font-[500]">Welcome To Password Reset</p>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log(values);
                    // Regular expression to check for lowercase, uppercase, and number 🥱🥂
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
                    if (!passwordRegex.test(values.password)) {
                        setPasswordErr(
                            "Password must be at least 8 characters and contain at least one lowercase, uppercase, and a number."
                        );
                    } else {
                        setPasswordErr(null);
                        // Proceed with form submission or other logic 👀✔
                    }
                }}
                className=" h-fit w-[25rem] maxSmallMobile:w-[95%] maxSmallMobile:mx-auto"
            >
                <div
                    className={`w-full h-fit flex justify-between items-center gap-4 mb-4 maxScreenMobile:!flex-col`}
                >
                    <div
                        className={`w-full h-fit relative maxScreenMobile:mt-8`}
                    >
                        <label htmlFor="password" className="block w-full mb-2 pl-1">
                            *Enter new Password
                        </label>
                        <div className="relative w-full h-fit">
                            {values.showPassword ? (
                                <AiFillEyeInvisible
                                    className="text-black font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer"
                                    onClick={showPassword}
                                />
                            ) : (
                                <AiFillEye
                                    className="text-black font-bold text-xl absolute right-0 top-[50%] translate-y-[-50%] mr-2 z-10 cursor-pointer"
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
                            <p className="text-[red] pl-2 ">
                                {passwordErr}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    disabled={false}
                    className="flex justify-center items-center w-3/5 m-auto mt-8 mb-2 bg-black rounded-md text-white h-[2.5rem] _px-5 shadow-xl border-none maxScreenMobile:w-full"
                >
                    {false ? (
                        <LoadingAssetSmall2 />
                    ) : (
                        "Reset Password"
                    )}
                </button>

                <p className="w-3/5 m-auto mt-4 text-center">
                    Remembered your password, back to <a href="/signin" className="text-[#FFA500]">Sign In</a>
                </p>
            </form>
        </section>
    )
}