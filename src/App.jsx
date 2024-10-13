/* eslint-disable no-unused-vars */
import { Route, Routes, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { userContext } from "./contexts/userContext";
import Home from "./components/home/home";
import NotFound from "./components/404/404";
import List from "./components/list/list";
import Interface from "./components/interface/Interface";
import Root from "./components/root/root";
import Institutions from "./components/institutions/institutions";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "./constants/routes";
import About from "./components/about-us/about";
import Document from "./components/document/document";
import PresentationContextProvider from "./contexts/presentationContext";
import SignPage from "./components/sign/sign";
// import NewUploadPage from "./components/upload/newupload";
// import DateTest from "./components/upload/dateTest";
import Documentation from "./components/document/Documentation";
import Library from "./components/library/library";
import PublicPresentation from "./components/see_more_presentation/seeMorePresentation";
import NewDashboard from "./components/profile/newDashboard";
import "./assets/styles/general_css.css";
import ErrorBoundary from "./ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import SupperUpload from "./components/upload/supperUpload";

axios.defaults.baseURL = SERVER_URL;

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`;
  return config;
});

// Add a response interceptor
// never remove this interceptor, breaks login if removed
axios.interceptors.response.use(function (response) {
  if (response.data.token) {
    localStorage.setItem("accessToken", response.data.token);
  }
  return response;
});

function App() {
  const { setUser } = useContext(userContext);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownID = (id) => {
    setActiveDropdown((prevState) => (prevState === id ? null : id));
  };
  useQuery({
    queryKey: ["user"],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get("/api/v1/auth/user");
      setUser(data.user);
      return data.user;
    }
  });

  const location = useLocation();

  return (
    <>
      <AnimatePresence exit>
        <Routes location={location} key={location.key}>
          <Route path="/" element={<Root />}>
            <Route exact path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="dashboard" element={<NewDashboard />} />
            <Route path="institutions" element={<List />} />
            <Route path="institutions/:id" element={<Institutions />} />
            <Route path="about" element={<About />} />
            <Route path="documentation" element={<Document />} />
            <Route path="library" element={<Library />} />
            <Route path="public_presentation" element={<PublicPresentation />} />
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
              <ErrorBoundary>
                <PresentationContextProvider>
                  <Interface />
                </PresentationContextProvider>
              </ErrorBoundary>
            }
          />
          <Route path="signin" element={<SignPage />} />
          <Route path="signup" element={<SignPage />} />
          {/* <Route path="datetest" element={<DateTest />} /> */}
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  );
}

export default App;
