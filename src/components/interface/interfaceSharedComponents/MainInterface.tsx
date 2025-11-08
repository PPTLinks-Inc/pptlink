/* eslint-disable react/prop-types */
import PopUpModal from "../../Models/dashboardModel";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { IoSync } from "react-icons/io5";

interface MainInterfaceElementProps {
  sideBar: boolean;
  setSideBar: Dispatch<SetStateAction<boolean>>;
  is768PxScreen: boolean;
  orientation: OrientationState;
  footerClass: {
    interfaceFooter: boolean;
    inAactiveSideBarDesktop: boolean;
    mobileViewHost: boolean;
    desktopViewUsers: boolean;
    mobileViewUsers: boolean;
  };
}

// export default function MainInterfaceElement({sideBar, setSideBar, is768PxScreen, orientation}) {
export const MainInterfaceElement: React.FC<MainInterfaceElementProps> = ({
  footerClass,
  sideBar,
  setSideBar,
  is768PxScreen,
  orientation
}) => {
  const tt = footerClass;
  return (
    <>
      <div className="relative w-full h-full bg-[white] border-none rounded-sm">
        {/* popup model */}
        <PopUpModal
          open={false}
          onClose={() => {}}
          onSubmit={() => {}}
          isLoading={!false}
          message={"Start screen share?"}
          actionText={"share"}
        />
        {/* Sync button */}
        <button
          onClick={() => alert("Sync... in progress")}
          className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow _bg-[#19191971] hover:bg-[#191919] text-white text-xl absolute bottom-4 right-20 ${!orientation.type.includes("landscape") && is768PxScreen && "hidden"}`}
        >
          <IoSync color="white" size={28} />
        </button>
        {/* Fullscreen button */}
        <button
          onClick={() => setSideBar(!sideBar)}
          className={`w-10 h-10 border-none rounded-full flex justify-center items-center shadow _bg-[#19191971] hover:bg-[#191919] text-white text-xl absolute bottom-4 right-6 ${!orientation.type.includes("landscape") && is768PxScreen && "hidden"}`}
        >
          {sideBar ? (
            <RxEnterFullScreen color="white" size={28} />
          ) : (
            <RxExitFullScreen color="white" size={28} />
          )}
        </button>
        {/* slider component goes here (ppt file slider)  THE INTERFACE */}
        <div className="slider-view w-full h-full bg-[gray]"></div>
      </div>
    </>
  );
};
