import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./components/home/home";
import NotFound from "./components/404/404";
import Login from "./components/log in/login";
import Dashboard from "./components/profile/dashboard";
import List from "./components/list/list";
import Upload from "./components/upload/upload";
import Interface from "./components/interface/Interface";
import Root from "./components/root/root";
import Institutions from "./components/institutions/institutions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_URL } from "./constants/routes";

axios.defaults.baseURL = SERVER_URL;

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`;
  return config;
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  if (response.data.token) {
    localStorage.setItem("accessToken", response.data.token);
  }
  return response;
});

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route exact path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="institutions" element={<List />} />
            <Route path="institutions/:id" element={<Institutions />} />
            <Route path="upload" element={<Upload />} />
          </Route>
          <Route path="/:id" element={<Interface />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
