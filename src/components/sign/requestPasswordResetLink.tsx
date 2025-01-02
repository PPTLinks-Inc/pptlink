import { useState } from "react";
import { Link } from "react-router-dom";
import logo_orange from "/imgs/onemorecolor.png";
import { LoadingAssetSmall2 } from "../../assets/assets";
import { useMutation } from "@tanstack/react-query";
import { standardFetch } from "@/lib/axios";
import { AxiosError } from "axios";

export default function RequestPasswordResetLink() {
  const [email, setEmail] = useState("");

  const resetPassword = useMutation({
    mutationFn: async function () {
      const { data } = await standardFetch.post<{ message: string }>(
        "/api/v1/auth/send-reset-link",
        {
          email
        }
      );

      return data;
    }
  });

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
        {!resetPassword.isSuccess && (
          <p className="text-[1.7rem] font-[900] mx-auto maxSmallMobile:responsiveText maxSmallMobile:font-[500]">
            Enter your email address
          </p>
        )}
      </div>
      {resetPassword.isSuccess ? (
        <p className="text-lg">{resetPassword.data.message}</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            resetPassword.mutate();
          }}
          className=" h-fit w-[25rem] maxSmallMobile:w-[95%] maxSmallMobile:mx-auto"
        >
          <div
            className={`w-full h-fit flex justify-between items-center gap-4 mb-4 maxScreenMobile:!flex-col`}
          >
            <div className={`w-full h-fit relative maxScreenMobile:mt-8`}>
              <label htmlFor="email" className="block w-full mb-2 pl-1">
                *Email
              </label>
              <div className="relative w-full h-fit">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md border-none"
                />
              </div>
            </div>
          </div>

          {resetPassword.isError &&
            resetPassword.error instanceof AxiosError && (
              <p className="text-center text-[red]">
                {resetPassword.error.response?.data.message}
              </p>
            )}

          <button
            disabled={resetPassword.isPending}
            className="flex justify-center items-center w-3/5 m-auto mt-8 mb-2 bg-primaryTwo rounded-md text-white h-[2.5rem] _px-5 shadow-xl border-none maxScreenMobile:w-full"
          >
            {resetPassword.isPending ? (
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
    </section>
  );
}
