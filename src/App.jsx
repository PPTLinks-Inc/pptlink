import { Route, Routes, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { userContext } from "./contexts/userContext";
import Home from "./components/home/home";
import NotFound from "./components/404/404";
import Dashboard from "./components/profile/dashboard";
import List from "./components/list/list";
import Upload from "./components/upload/upload";
import Interface from "./components/interface/Interface";
import Root from "./components/root/root";
import Institutions from "./components/institutions/institutions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "./constants/routes";
import About from "./components/about-us/about";
import Document from "./components/document/document";
import PresentationContextProvider from "./contexts/presentationContext";
import SignPage from "./components/sign/sign";
import NewUploadPage from "./components/upload/newupload";
import "./assets/styles/general_css.css";

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

  const userQuery = useQuery({
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryKey: ["user"],
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
          <Route path="/" element={<Root isLoading={userQuery.isLoading} />}>
            <Route exact path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="institutions" element={<List />} />
            <Route path="institutions/:id" element={<Institutions />} />
            <Route path="upload" element={<Upload />} />
            <Route path="about" element={<About />} />
            <Route path="documentation" element={<Document />} />
            <Route path="newupload" element={<NewUploadPage />} />
          </Route>
          {/* <Route path="about-us" element={<About />} /> */}
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
        </Routes>
      </AnimatePresence>

      <ToastContainer stacked />
    </>
  );
}

export default App;
