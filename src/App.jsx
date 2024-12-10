import { Route, Routes, useLocation } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingAssetBig2 } from "./assets/assets";
import PresentationContextProvider from "./contexts/presentationContext";
import "./assets/styles/general_css.css";
import ErrorBoundary from "./ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import useUser from "./hooks/useUser";
import { setAuthFetchToken } from "./lib/axios";

// all lazy import
const Home = lazy(() => import("./components/home/home"));
const NotFound = lazy(() => import("./components/404/404"));
const Interface = lazy(() => import("./components/interface/Interface"));
const Root = lazy(() => import("./components/root/root"));
const Library = lazy(() => import("./components/library/library"));
const LibraryPage = lazy(() => import("./components/library/library_page"));
const SignPage = lazy(() => import("./components/sign/sign"));
const Pay = lazy(() => import("./components/pay/pay"));
const About = lazy(() => import("./components/about-us/about"));
const Document = lazy(() => import("./components/document/document"));
const Documentation = lazy(() => import("./components/document/Documentation"));
const NewDashboard = lazy(() => import("./components/profile/newDashboard"));
const PublicPresentation = lazy(
  () => import("./components/see_more_presentation/seeMorePresentation")
);
const SupperUpload = lazy(() => import("./components/upload/supperUpload"));
const ResetPasswordPage = lazy(() => import("./components/sign/resetPassword"));
const CodeTest = lazy(() => import("./components/codeTest/codeTest"));

function App() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownID = (id) => {
    setActiveDropdown((prevState) => (prevState === id ? null : id));
  };

  setAuthFetchToken(localStorage.getItem("accessToken"));

  useUser();

  const location = useLocation();

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
          <Routes location={location} key={location.key}>
            <Route path="/" element={<Root />}>
              <Route exact path="/" element={<Home />} />
              <Route
                path="public_presentation"
                element={<PublicPresentation />}
              />

              <Route path="*" element={<NotFound />} />
              {/* <Route path="dashboard" element={<Dashboard />} /> */}
              <Route path="dashboard" element={<NewDashboard />} />
              <Route path="about" element={<About />} />
              <Route path="documentation" element={<Document />} />
              <Route path="library" element={<Library />} />
              <Route path="libraryPage" element={<LibraryPage />} />
              <Route
                path="documentation/*"
                element={
                  <Documentation
                    activeDropdown={activeDropdown}
                    handleDropdownID={handleDropdownID}
                  />
                }
              />
              <Route path="upload" element={<SupperUpload />} />
            </Route>
            <Route
              path="/:id"
              element={
                <PresentationContextProvider>
                  <Interface />
                </PresentationContextProvider>
              }
            />

            <Route path="signin" element={<SignPage />} />
            <Route path="signup" element={<SignPage />} />
            <Route path="forgot-password" element={<SignPage />} />
            <Route path="pay" element={<Pay />} />
            <Route path="codetest" element={<CodeTest />} />
            <Route
              path={`reset/${"sdfsdfasdasdfadsfdsfdgsdfgsdfasdfdgsdzfdsgffgdhfghgfhgfbngfhgfhghgfhfcgjfgchjfg"}`}
              element={<ResetPasswordPage />}
            />
            {/* <Route path="datetest" element={<DateTest />} /> */}
          </Routes>
        </Suspense>
        {/* </Router> */}
      </AnimatePresence>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
