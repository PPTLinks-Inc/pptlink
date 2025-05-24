import { Link, useSearchParams } from "react-router-dom";
import logo_orange from "/imgs/onemorecolor.png";
import { LoadingAssetSmall2 } from "../../assets/assets";
import { useMutation } from "@tanstack/react-query";
import { standardFetch } from "@/lib/axios";
import { AxiosError } from "axios";

export default function RequestPasswordResetLink() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const sendEmailVerification = useMutation({
    mutationFn: async function () {
      const { data } = await standardFetch.post<{ message: string }>(
        "/api/v1/auth/send-verifcation-email",
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
        {!sendEmailVerification.isSuccess && (
          <p className="text-[1.7rem] font-[900] mx-auto maxSmallMobile:responsiveText maxSmallMobile:font-[500]">
            Your email is not verified
          </p>
        )}
      </div>
      {sendEmailVerification.isSuccess ? (
        <p className="text-lg">{sendEmailVerification.data.message}</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendEmailVerification.mutate();
          }}
          className=" h-fit w-[25rem] maxSmallMobile:w-[95%] maxSmallMobile:mx-auto"
        >
          {sendEmailVerification.isError &&
            sendEmailVerification.error instanceof AxiosError && (
              <p className="text-center text-[red]">
                {sendEmailVerification.error.response?.data.message}
              </p>
            )}

          <button
            disabled={sendEmailVerification.isPending}
            className="flex justify-center items-center w-3/5 m-auto mt-8 mb-2 bg-primaryTwo rounded-md text-white h-[2.5rem] _px-5 shadow-xl border-none maxScreenMobile:w-full"
          >
            {sendEmailVerification.isPending ? (
              <LoadingAssetSmall2 />
            ) : (
              "Resend Email verification link"
            )}
          </button>

          <p className="w-3/5 m-auto mt-4 text-center">
            <a href="/signin" className="text-[#FFA500]">
              Sign in to another account
            </a>
          </p>
        </form>
      )}
    </section>
  );
}
