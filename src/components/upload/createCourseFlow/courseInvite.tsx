import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LoadingAssetBig, LoadingAssetSmall2 } from "../../../assets/assets";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/axios";
import { AxiosError } from "axios";
import useUser from "@/hooks/useUser";
import logo_orange from "/imgs/onemorecolor.png";

interface CourseInviteDetails {
  name: string;
  creator: {
    email: string;
    username: string;
  };
}

export default function CourseInvite() {
  const navigate = useNavigate();
  const { userQuery } = useUser();
  const [searchParams] = useSearchParams();
  const [inviteToken] = useState(searchParams.get("token"));

  useEffect(function() {
    if (userQuery.isError) {
        localStorage.setItem("redirect", `${window.location.pathname}${window.location.search}`);
        navigate(`/signin?redirect=${window.location.pathname}${window.location.search}`);
    }
  }, [userQuery.isError]);

  const acceptInviteMutation = useMutation({
    mutationFn: async function () {
      const { data } = await authFetch.post<{ message: string }>(
        `/api/v1/course/accept-invite/${inviteToken}`
      );
      return data;
    }
  });

  const courseDetailsQuery = useQuery({
    queryKey: ["courseInviteDetails", inviteToken],
    enabled: !!userQuery.data && !!inviteToken,
    queryFn: async () => {
      const { data } = await authFetch.get<CourseInviteDetails>(
        `/api/v1/course/invite-details/${inviteToken}`
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
            alt="logo"
            className="block w-10 aspect-square"
          />
        </Link>
        <p className="text-[1.7rem] font-[900] mx-auto maxSmallMobile:responsiveText maxSmallMobile:font-[500]">
          Course Instructor Invitation
        </p>
      </div>

      {userQuery.isLoading ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <LoadingAssetBig />
          <p>Validating user authentication...</p>
        </div>
      ) : userQuery.isSuccess && !userQuery.data ? null : (
        <>
          {courseDetailsQuery.isLoading ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <LoadingAssetBig />
              <p>Loading course details...</p>
            </div>
          ) : courseDetailsQuery.isError ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-[red] text-xl">Failed to load course details</p>
              <p className="w-3/5 text-center">
                Go back to{" "}
                <Link to="/" className="text-[#FFA500]">
                  Home
                </Link>
              </p>
            </div>
          ) : acceptInviteMutation.isSuccess ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p>Successfully joined as course instructor</p>
              <p className="w-3/5 text-center">
                Go to{" "}
                <Link to="/dashboard?tab=2" className="text-[#FFA500]">
                  Dashboard
                </Link>
              </p>
            </div>
          ) : (
            <div className="w-[25rem] maxSmallMobile:w-[95%] maxSmallMobile:mx-auto text-center">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{courseDetailsQuery.data?.name}</h2>
                <p className="text-gray-600">
                  Owner: {courseDetailsQuery.data?.creator.username}
                </p>
              </div>

              <p className="mb-4">{"You've been invited to join this course as an instructor"}</p>
              {acceptInviteMutation.isError &&
                acceptInviteMutation.error instanceof AxiosError && (
                  <p className="text-[red] mb-4">
                    {acceptInviteMutation.error.response?.data.message}
                  </p>
                )}
              <button
                onClick={() => acceptInviteMutation.mutate()}
                disabled={acceptInviteMutation.isPending}
                className="w-full bg-primaryTwo text-white py-2 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {acceptInviteMutation.isPending ? (
                  <div className="flex justify-center items-center"><LoadingAssetSmall2 /></div>
                ) : (
                  "Accept Instructor Invitation"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
