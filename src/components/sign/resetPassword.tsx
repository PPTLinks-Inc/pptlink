import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo_orange from "/imgs/onemorecolor.png";
import { LoadingAssetBig, LoadingAssetSmall2 } from "../../assets/assets";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { standardFetch } from "@/lib/axios";
import { AxiosError } from "axios";

export default function ResetPasswordPage() {
  const [passwordErr, setPasswordErr] = useState("");
  const [values, setValues] = useState({
    password: "",
    showPassword: false
  });

  const [searchParams] = useSearchParams();
  const [resetToken] = useState(searchParams.get("resetToken"));
  const [id] = useState(searchParams.get("id"));

  const showPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const validateTokenQuery = useQuery({
    retry: false,
    queryKey: ["validateToken", resetToken],
    queryFn: () =>
      standardFetch.get("/api/v1/auth/verify-reset-token", {
        params: { resetToken, id }
      })
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async function () {
      const { data } = await standardFetch.post<{ message: string }>(
        "/api/v1/auth/reset-password",
        {
          newPassword: values.password,
          id,
          resetToken
        }
      );

      return data;
    }
  });

  function validatePassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordErr(
        "Password must be at least 8 characters and contain at least one lowercase, uppercase, and a number."
      );
    } else {
      setPasswordErr("");
    }
  }

  return (
    <section className="w-full h-screen bg-[#FFFFF0] flex flex-col justify-center items-center gap-8 relative maxSmallMobile:gap-2 maxSmallMobile:overflow-y-auto">
      <div className="w-[90%] mx-auto flex justify-center items-center maxSmallMobile:flex-col maxSmallMobile:gap-4">
        <Link
          to="/"
          className="block w-fit h-fit absolute top-[2rem] left-[3rem] maxSmallMobile:!static maxSmallMobile:top-0 maxSmallMobile:left-0"
        >
          <img
            src={logo_orange}
            alt={logo_orange}
            className="block w-10 aspect-square"
          />
        </Link>
        {!validateTokenQuery.isLoading && !validateTokenQuery.isError && !resetPasswordMutation.isSuccess && (
          <p className="text-[1.7rem] font-[900] mx-auto maxSmallMobile:responsiveText maxSmallMobile:font-[500]">
            Welcome To Password Reset
          </p>
        )}
      </div>

      {validateTokenQuery.isLoading &&
      !resetPasswordMutation.isSuccess &&
      !resetPasswordMutation.isError ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <LoadingAssetBig />
          <p>Validating password reset link</p>
        </div>
      ) : (
        <>
          {validateTokenQuery.isError ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-[red] text-xl">Invalid Reset link</p>
              <p className="w-3/5 text-center">
                Remembered your password, back to{" "}
                <Link to="/signin" className="text-[#FFA500]">
                  Sign In
                </Link>
              </p>
            </div>
          ) : (
            <>
              {resetPasswordMutation.isSuccess ? (
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <p>Password changed successfully</p>
                  <p className="w-3/5 text-center">
                    Back to{" "}
                    <Link to="/signin" className="text-[#FFA500]">
                      Sign In
                    </Link>
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordErr !== "" || resetPasswordMutation.isError)
                      return;

                    resetPasswordMutation.mutate();
                  }}
                  className=" h-fit w-[25rem] maxSmallMobile:w-[95%] maxSmallMobile:mx-auto"
                >
                  <div
                    className={`w-full h-fit flex justify-between items-center gap-4 mb-4 maxScreenMobile:!flex-col`}
                  >
                    <div
                      className={`w-full h-fit relative maxScreenMobile:mt-8`}
                    >
                      <label
                        htmlFor="password"
                        className="block w-full mb-2 pl-1"
                      >
                        *Enter new Password
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
                          onChange={(e) => {
                            setValues({ ...values, password: e.target.value });
                            validatePassword(e.target.value);
                          }}
                          id="password"
                          name="password"
                          placeholder="**********"
                          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${passwordErr ? "border border-[red] outline-offset-2" : "border-none"}`}
                        />
                      </div>
                      {passwordErr && (
                        <p className="text-[red] pl-2 ">{passwordErr}</p>
                      )}
                      {resetPasswordMutation.isError &&
                        resetPasswordMutation.error instanceof AxiosError && (
                          <p className="text-[red] pl-2">
                            {resetPasswordMutation.error.response?.data.message}
                          </p>
                        )}
                    </div>
                  </div>

                  <button
                    disabled={resetPasswordMutation.isPending}
                    className="flex justify-center items-center w-3/5 m-auto mt-8 mb-2 bg-primaryTwo rounded-md text-white h-[2.5rem] _px-5 shadow-xl border-none maxScreenMobile:w-full"
                  >
                    {resetPasswordMutation.isPending ? (
                      <LoadingAssetSmall2 />
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <p className="w-3/5 m-auto mt-4 text-center">
                    Remembered your password, back to{" "}
                    <a href="/signin" className="text-[#FFA500]">
                      Sign In
                    </a>
                  </p>
                </form>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
