import Socials from "../social/socials";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/header";
import { ABOUT, LEGAL, UPLOAD } from "../../constants/routes";
import useUser from "../../hooks/useUser";

// eslint-disable-next-line react/prop-types
export default function Backmenu({ backmenu, handleDropdown }) {
  const { userQuery, logOut } = useUser();
  const user = userQuery.data;
  const navigate = useNavigate();

  const handlePresentationBtn = () => {
    if (!user) return navigate('/signin');

    if (user) {
      logOut();
      return navigate('/signin');
    }
  };

  const buttontext = () => {
    if (!user) return "Sign in";
    if (user) return "Sign Out";
  };

  return (
    <div className={`w-full h-screen absolute maxScreenMobile:overflow-auto ${backmenu && "scaleIn"}`}>
      <Header isBackMenu={true} handleDropdown={handleDropdown} />

      <div className="w-full h-[90vh]">
        <div className="flex-col w-[100%] h-[50%] flex-1 !border-0 justify-center flex lg:flex-wrap lg:flex-row maxScreen:my-14">
          <button
            onClick={() => handlePresentationBtn()}
            className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[5rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px] maxScreenMobile:text-left maxScreen:py-5 maxScreen:pl-0"
          >
            {buttontext()}
          </button>
          <Link
            to={UPLOAD}
            className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[5rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px] maxScreenMobile:text-left maxScreen:py-5 maxScreen:pl-0"
          >
            Upload
          </Link>
          <Link
            to={LEGAL}
            className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[5rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px] maxScreenMobile:text-left maxScreen:py-5 maxScreen:pl-0"
          >
            Legal
          </Link>
          <Link
            to={ABOUT}
            className="maxScreen:!flex maxScreen:w-full maxScreen:justify-center maxScreen:items-center text-center pl-[5rem] w-[100%] md:h-[calc(100%/2)] h-[calc(100%)] flex items-center justify-start font-medium text-[30px] md:text-[40px] hover:bg-black hover:text-white lg:w-1/2 lg:flex lg:items-center  lg:text-[40px] maxScreenMobile:text-left maxScreen:py-5 maxScreen:pl-0"
          >
            About
          </Link>
        </div>

        <div className="container m-auto border-slate-100 border-collapse text-left flex flex-col lg:flex-row maxScreenMobile:text-center maxScreenMobile:!border-black maxScreenMobile:!border-t-[1px]">
          <div className="flex-1 pr-5">
            <h2 className="text-2xl mt-4 mb-6 font-medium">Our location</h2>
            <Link
              to="/"
              className="block responsiveText py-2 relative before:block before:absolute before:top-auto before:bottom-1 before:left-0 before:right-0 before:h-0 before:!w-full before:py-[.1px] before:bg-black before:scale-x-0 !transition-all !ease-in-out !duration-300 hover:before:!scale-x-[1] leading-[30px]"
            >
              You can find us at Nascomsoft in Anguwan Cashew, Off dass road,
              opposite Elim church, 740102, Yelwa, Bauchi Nigeria
            </Link>
          </div>
          <div className="flex-1 pl-28 maxScreenMobile:mb-5 maxScreenMobile:w-full maxScreen:p-0">
            <h3 className="text-xl font-medium my-6">External</h3>
            <Socials />
          </div>
        </div>
      </div>
    </div>
  );
}
