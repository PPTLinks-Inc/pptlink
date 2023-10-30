import { Link } from "react-router-dom";
import notFound from "./404.webp";

function PresentationNotFound() {
  return (
    <div className="bg-indigo-900 relative overflow-hidden h-screen">
      <img src={notFound} className="absolute h-full w-full object-cover" />
      <div className="inset-0 bg-black opacity-25 absolute"> </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex items-center py-32 xl:py-40">
        <div className="w-full font-mono flex flex-col items-center relative z-10">
          <h1 className="font-extrabold text-5xl text-center text-slate-50 leading-tight mt-4">
            It seems you are all alone here
          </h1>
          <p className="font-extrabold text-8xl mt-44 text-slate-50 animate-bounce">
            404
          </p>
          <Link to={"/"} className="bg-slate-50 px-5 py-3 rounded-md">Go Home</Link>
        </div>
      </div>
    </div>
  );
}

export default PresentationNotFound;
