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
import { MdHelpOutline } from "react-icons/md";
import { AiOutlineProfile } from "react-icons/ai";
import { MdOutlineFeedback } from "react-icons/md";
import React, { createContext } from "react";
import { Link, useRouteLoaderData, useNavigate } from "react-router-dom";
import { CourseData } from "@/store/courseStore";
import { useCourseStore } from "@/store/courseStoreProvider";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { LoadingAssetSmall } from "@/assets/assets";
import { ROUTER_ID } from "@/constants/routes";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const CourseSideBarContext = createContext(undefined);

export type ActiveTab = "course" | "settings" | "profile" | "feedback" | "help";

export default function CourseSideBarContextProvider({
  children,
  isActive
}: {
  children: React.ReactNode;
  isActive: ActiveTab;
}) {
  const data = useRouteLoaderData(ROUTER_ID) as CourseData;
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
    onError: function () {
      toast.toast({
        title: "Error",
        variant: "destructive"
      });
    }
  });

  const isCreator = data.creatorId === userQuery.data?.id;

  const nextIncompleteTab = useCourseStore((state) =>
    state.getNextIncompleteTab()
  );

  const handleNextOrPublish = () => {
    if (published) {
      toast.toast({
        title: "Unpublishing course",
        description: "Your course is being unpublished..."
      });
      togglePublish.mutate();
      // TODO: Implement unpublish logic
    } else if (isPublishable) {
      toast.toast({
        title: "Publishing course",
        description: "Your course is being published..."
      });
      togglePublish.mutate();
      // TODO: Implement publish logic
    } else {
      if (nextIncompleteTab === "course") {
        navigate(`/course/${data.id}`);
        return;
      }
      navigate(`/course/${nextIncompleteTab}/${data.id}`);
    }
  };

  return (
    <CourseSideBarContext.Provider value={undefined}>
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
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-slate-200 border-b-[1px] border-b-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>
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
                    <span>Save</span>
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
                      {published
                        ? "Unpublish"
                        : isPublishable
                          ? "Publish"
                          : "Next"}
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
