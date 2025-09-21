import { Separator } from "@/components/ui/separator";
import {
  SidebarFooter,
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader
} from "@/components/ui/sidebar";
import { IoBookOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import logo_white from "/imgs/WHITE.png";
import { Button } from "@/components/ui/button";
import { FaRegSave } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { MdHelpOutline } from "react-icons/md";
import { AiOutlineProfile } from "react-icons/ai";
import { MdOutlineFeedback } from "react-icons/md";
import React, { createContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CourseData } from "@/store/courseStore";
import { useCourseStore } from "@/store/courseStoreProvider";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { LoadingAssetSmall } from "@/assets/assets";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import axios from "axios";
import useCourseContent from "@/hooks/useCourseContent";
import { ActiveTab } from "@/types/course";

interface CourseSideBarContextType {
  isActive: ActiveTab;
}

export const CourseSideBarContext = createContext<CourseSideBarContextType>({
  isActive: "course"
});

export default function CourseSideBarContextProvider({
  children,
  isActive
}: {
  children: React.ReactNode;
  isActive: ActiveTab;
}) {
  const params = useParams();
  // const data = useRouteLoaderData(ROUTER_ID) as CourseData;
  const data = useCourseContent(params.courseId as string) as CourseData;
  const saveCourseData = useCourseStore((state) => state.saveCourseData);
  const toast = useToast();

  const { userQuery } = useUser();
  const navigate = useNavigate();

  const courseName = useCourseStore((state) => state.name);

  const published = useCourseStore((state) => state.published);
  const isPublishable = useCourseStore((state) => state.canPublish);
  const toggleCoursePublish = useCourseStore((state) => state.togglePublish);

  const togglePublish = useMutation({
    mutationFn: () => toggleCoursePublish()
  });

  const saveCourse = useMutation({
    mutationFn: () => saveCourseData(isActive, userQuery.data?.id ?? ""),
    onSuccess: function () {
      toast.toast({
        title: "Saved"
      });
    },
    onError: function (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const { response } = error;
        if (response) {
          toast.toast({
            title: "Error",
            description: response.data.message,
            variant: "destructive"
          });
          return;
        }
      }
      toast.toast({
        title: "Error",
        variant: "destructive"
      });
    }
  });

  const isCreator = data.creatorId === userQuery.data?.id;

  const getNextIncompleteTab = useCourseStore(
    (state) => state.getNextIncompleteTab
  );

  const handleNextOrPublish = () => {
    if (published) {
      toast.toast({
        title: "Unpublishing course",
        description: "Your course is being unpublished..."
      });
      togglePublish.mutate();
    } else if (isPublishable) {
      toast.toast({
        title: "Publishing course",
        description: "Your course is being published..."
      });
      togglePublish.mutate();
      // TODO: Implement publish logic
    } else {
      const nextIncompleteTab = getNextIncompleteTab();
      if (nextIncompleteTab === isActive) {
        toast.toast({
          title: "Error",
          description: "Please complete the current tab before proceeding",
          variant: "destructive"
        });
        return;
      }

      if (nextIncompleteTab === "course") {
        navigate(`/course/${data.id}`);
        return;
      }

      navigate(`/course/${nextIncompleteTab}/${data.id}`);
    }
  };

  return (
    <CourseSideBarContext.Provider value={{ isActive }}>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenuButton asChild tooltip="Go to Course Dashboard">
              <Link to="/dashboard?tab=2">
                <img src={logo_white} className="block w-8 aspect-square" />
                <span className="font-bold">PPTLinks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarHeader>
          <SidebarContent className="mt-5">
            <SidebarMenuButton
              tooltip="Course content"
              className="mx-auto"
              isActive={isActive === "course"}
              asChild
            >
              <Link to={`/course/${data.id}`}>
                <IoBookOutline />
                <span className="text-lg">Courses</span>
              </Link>
            </SidebarMenuButton>
            {isCreator && (
              <SidebarMenuButton
                isActive={isActive === "settings"}
                tooltip="Course Settings"
                className="mx-auto"
                asChild
              >
                <Link to={`/course/settings/${data.id}`}>
                  <GoGear />
                  <span className="text-lg">Settings</span>
                </Link>
              </SidebarMenuButton>
            )}
            <SidebarMenuButton
              isActive={isActive === "profile"}
              tooltip="Course profile"
              className="mx-auto"
              asChild
            >
              <Link to={`/course/profile/${data.id}`}>
                <AiOutlineProfile />
                <span className="text-lg">Profile</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              isActive={isActive === "feedback"}
              tooltip="Course feedback"
              className="mx-auto"
              asChild
            >
              <Link to="/create-course/feedback">
                <MdOutlineFeedback />
                <span className="text-lg">Feedback</span>
              </Link>
            </SidebarMenuButton>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenuButton
              isActive={isActive === "help"}
              tooltip="Help"
              asChild
            >
              <Link to="/create-course/help">
                <MdHelpOutline />
                <span className="text-lg">Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
        {/* <SidebarInset>
          <header className="flex flex-wrap md:flex-nowrap items-center gap-2 px-4 py-2 bg-slate-200 border-b border-white">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <p className="text-sm md:text-base">
                <b>Course Builder:</b> {courseName}
              </p>
            </div>

            <div className="flex flex-wrap md:flex-nowrap justify-end items-center gap-2 ml-auto w-full md:w-auto mt-2 md:mt-0">
              <Button
                className="w-full md:w-auto"
                variant="outline"
                onClick={() => saveCourse.mutate()}
                disabled={saveCourse.isPending}
              >
                {saveCourse.isPending ? (
                  <LoadingAssetSmall />
                ) : (
                  <>
                    <FaRegSave />
                    <span className="ml-1">{`Save ${isActive} data`}</span>
                  </>
                )}
              </Button>

              {isCreator && (
                <Button
                  className={cn(
                    "w-full md:w-auto border-white",
                    published
                      ? "bg-rose-600 hover:bg-red-700 text-white"
                      : isPublishable
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-primaryTwo text-white"
                  )}
                  variant="outline"
                  onClick={handleNextOrPublish}
                >
                  {togglePublish.isPending ? (
                    <LoadingAssetSmall />
                  ) : (
                    <span>
                      {published
                        ? "Unpublish"
                        : isPublishable
                          ? "Publish"
                          : "Next section"}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </header>

          <div className="bg-primaryTwo h-full">{children}</div>
        </SidebarInset> */}

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-slate-200 border-b-[1px] border-b-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p className="maxScreenMobile:text-sm md:text-base">
              <b>Course Builder:</b> {courseName}
            </p>
            <div className="ml-auto mr-0 flex justify-center items-center gap-4">
              <Button
                className="ml-auto"
                variant="outline"
                onClick={() => saveCourse.mutate()}
                disabled={saveCourse.isPending}
              >
                {saveCourse.isPending ? (
                  <LoadingAssetSmall />
                ) : (
                  <>
                    <FaRegSave />
                    <span className="maxScreenMobile:hidden">{`Save ${isActive} data`}</span>
                  </>
                )}
              </Button>

              {isCreator && (
                <Button
                  className={cn(
                    "ml-auto border-white",
                    published
                      ? "bg-rose-600 hover:bg-red-700 text-white"
                      : isPublishable
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-primaryTwo text-white"
                  )}
                  variant="outline"
                  onClick={handleNextOrPublish}
                >
                  {togglePublish.isPending ? (
                    <LoadingAssetSmall />
                  ) : (
                    <span>
                      {published ? (
                        "Unpublish"
                      ) : isPublishable ? (
                        "Publish"
                      ) : (
                        <>
                          <span className="maxScreenMobile:hidden">
                            Next section
                          </span>
                          <span className="hidden maxScreenMobile:block">
                            <MdNavigateNext />
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </header>
          <div className="bg-primaryTwo h-full">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </CourseSideBarContext.Provider>
  );
}
