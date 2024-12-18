import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingAssetBig2 } from "./assets/assets";
import PresentationContextProvider, { presentationLoader } from "./contexts/presentationContext";
import "./assets/styles/general_css.css";
import ErrorBoundary from "./ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import useUser from "./hooks/useUser";
import { setAuthFetchToken } from "./lib/axios";

// all lazy import
const Home = lazy(() => import("./components/home/home"));
const NotFound = lazy(() => import("./components/404/404"));
const Interface = lazy(() => import("./components/interface/Interface"));
const InterfaceNotFound = lazy(() => import("./components/interface/404"));
const Root = lazy(() => import("./components/root/root"));
const Library = lazy(() => import("./components/library/library"));
const LibraryPage = lazy(() => import("./components/library/library_page"));
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

const router = createBrowserRouter([
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
        path: "public_presentation",
        element: <PublicPresentation />
      },
      {
        path: "dashboard",
        element: <NewDashboard />
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
        element: <SupperUpload />
      },
      {
        path: "library",
        element: <Library />
      },
      {
        path: "libraryPage",
        element: <LibraryPage /> 
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
    element: <SignPage />
  },
  {
    path: "/pay",
    element: <Pay />
  },
  {
    path: "/reset/:token",
    element: <ResetPasswordPage />
  }
]);

function App() {

  setAuthFetchToken(localStorage.getItem("accessToken"));

  useUser();

  // const location = useLocation();

  return (
    <ErrorBoundary>
      <AnimatePresence exit>
        {/* <Router> */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen bg-black">
              <LoadingAssetBig2 />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </AnimatePresence>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
