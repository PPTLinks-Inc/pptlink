import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingAssetBig2 } from "./assets/assets";
import PresentationContextProvider, {
  presentationLoader
} from "./contexts/presentationContext";
import UploadStoreProvider from "./store/uploadStoreProvider";
import "./assets/styles/general_css.css";
import { Toaster } from "@/components/ui/toaster";
import useUser from "./hooks/useUser";
import { setAuthFetchToken } from "./lib/axios";
import * as Sentry from "@sentry/react";

// all lazy import
const Home = lazy(() => import("./components/home/home"));
const NotFound = lazy(() => import("./components/404/404"));
const Interface = lazy(() => import("./components/interface/Interface"));
const InterfaceNotFound = lazy(() => import("./components/interface/404"));
const Root = lazy(() => import("./components/root/root"));
const RootNoFooter = lazy(() => import("./components/root/rootNoFooter"));
const Library = lazy(() => import("./components/library/library"));
const SignPage = lazy(() => import("./components/sign/sign"));
const Pay = lazy(() => import("./components/pay/pay"));
const About = lazy(() => import("./components/about-us/about"));
const Document = lazy(() => import("./components/document/document"));
const NewDashboard = lazy(() => import("./components/profile/newDashboard"));
const PublicPresentation = lazy(
  () => import("./components/see_more_presentation/seeMorePresentation")
);
const SupperUpload = lazy(() => import("./components/upload/supperUpload"));
const ResetPasswordPage = lazy(() => import("./components/sign/resetPassword"));
const RequestPasswordResetLink = lazy(
  () => import("./components/sign/requestPasswordResetLink")
);
const CreatePath = lazy(() => import("./components/createNew/createPath"));
const CourseSideBarContext = lazy(
  () => import("./contexts/courseSideBarContext")
);
const CourseCreationWorkflow = lazy(
  () => import("./components/upload/createCourseFlow/courseCreationWorkflow")
);
const CourseCreationProfile = lazy(
  () => import("./components/upload/createCourseFlow/courseCreationProfile")
);
const CourseCreationSettings = lazy(
  () => import("./components/upload/createCourseFlow/courseCreationSettings")
);
const CourseCreationHelp = lazy(
  () => import("./components/upload/createCourseFlow/courseCreationHelp")
);
const CoursePreviewPage = lazy(
  () => import("./components/upload/createCourseFlow/coursePreviewPage")
);
const CourseCreationWorkflowTwo = lazy(
  () => import("./components/upload/createCourseFlow/courseCreationWorkflowTwo")
);
const TermsAndServicesPage = lazy(
  () => import("./components/Terms_and_policy_page/termsAndServices")
);
const PrivacyPolicyPage = lazy(
  () => import("./components/Terms_and_policy_page/privacyPolicy")
);

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

const router = sentryCreateBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "about",
          element: <About />
        },
        {
          path: "documentation",
          element: <Document />
        },
        {
          path: "upload",
          element: (
            <UploadStoreProvider>
              <SupperUpload />
            </UploadStoreProvider>
          )
        },
        {
          path: "library",
          element: <Library />
        }
      ]
    },
    {
      path: "/",
      element: <RootNoFooter />,
      errorElement: <NotFound />,
      children: [
        {
          path: "public_presentation",
          element: <PublicPresentation />
        },
        {
          path: "dashboard",
          element: <NewDashboard />
        },
        {
          path: "/terms-and-services",
          element: <TermsAndServicesPage />
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicyPage />
        },
        {
          path: "course/user/preview",
          element: <CoursePreviewPage />
        }
      ]
    },
    {
      path: "/:id",
      element: (
        <PresentationContextProvider>
          <Interface />
        </PresentationContextProvider>
      ),
      errorElement: <InterfaceNotFound />,
      loader: presentationLoader
    },
    {
      path: "/signin",
      element: <SignPage />
    },
    {
      path: "/signup",
      element: <SignPage />
    },
    {
      path: "/forgot-password",
      element: <RequestPasswordResetLink />
    },
    {
      path: "/pay",
      element: <Pay />
    },
    {
      path: "/reset-password",
      element: <ResetPasswordPage />
    },
    {
      path: "/create",
      element: <CreatePath />
    },
    {
      path: "/course/:courseId",
      element: (
        <CourseSideBarContext isActive="course">
          <CourseCreationWorkflow />
        </CourseSideBarContext>
      )
    },
    {
      path: "/course/settings/:courseId",
      element: (
        <CourseSideBarContext isActive="settings">
          <CourseCreationSettings />
        </CourseSideBarContext>
      )
    },
    {
      path: "/course/profile/:courseId",
      element: (
        <CourseSideBarContext isActive="profile">
          <CourseCreationProfile />
        </CourseSideBarContext>
      )
    },
    {
      path: "/course/help",
      element: (
        <CourseSideBarContext isActive="help">
          <CourseCreationHelp />
        </CourseSideBarContext>
      )
    },
    {
      path: "/course/antidote",
      element: <CourseCreationWorkflowTwo />
    }
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);

function App() {
  setAuthFetchToken(localStorage.getItem("accessToken"));

  useUser();

  // const location = useLocation();

  return (
    // <ErrorBoundary>
    <>
      <AnimatePresence exit>
        {/* <Router> */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen bg-primaryTwo">
              <LoadingAssetBig2 />
            </div>
          }
        >
          <RouterProvider
            router={router}
            future={{
              v7_startTransition: true
            }}
          />
        </Suspense>
      </AnimatePresence>
      <Toaster />
    </>
    // </ErrorBoundary>
  );
}

export default App;
