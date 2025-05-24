import { Link, useRouteError } from "react-router-dom";
import notFound from "./illustration.svg";
import { AxiosError } from "axios";

function PresentationNotFound() {
  return (
    <section className="bg-primaryTwo ">
      <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        <div className="wf-ull lg:w-1/2">
          <p className="text-sm font-medium text-slate-500">404 error</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-300 md:text-3xl lg:text-5xl">
            Presentation Not Found.
          </h1>

          <div className="flex items-center mt-6 gap-x-3">
            <Link
              to={"/"}
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>Home</span>
            </Link>
          </div>
        </div>

        <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
          <img
            className="w-full max-w-lg lg:mx-auto"
            src={notFound}
            alt=""
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default function ErrorComponent() {
  const error = useRouteError();

  if (error instanceof AxiosError) {
    return <PresentationNotFound />;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center z-50 absolute bg-primaryTwo inset-0">
      <p className="text-slate-200 text-3xl text-center">
        Something terrible happened.
      </p>
      <p className="text-slate-200 mt-5 text-center">
        Reload the page to try again.
      </p>
      <button
        className="bg-slate-200 text-primaryTwo p-3 mt-3 rounded-md"
        onClick={() => location.reload()}
      >
        Reload
      </button>
    </div>
  );
}
