import { LoadingAssetSmall2 } from "../../../assets/assets";

function ProgressIndicator({ currentView }) {

    return (
        <>
            <h1 className="text-[3rem] text-[#FFFFF0] maxScreenMobile:!text-[2rem] maxScreenMobile:text-center">
                New Presentation
            </h1>
            <hr className="bg-[#FFFFF0] !h-[0.1px]" />
            <div className="form_tracker_wrapper w-full flex justify-center mb-20 maxScreenMobile:!mb-4">
                <span className="active !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]">
                    <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
                        1
                    </span>
                    <span className="!block w-full text-[0.9rem] text-center text-white">
                        Upload
                    </span>
                </span>
                <span
                    className={`${(currentView === 2 || currentView === 3) && true ? "active" : ""} !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]`}
                >
                    <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
                        2
                    </span>
                    <span className="!block w-full text-[0.9rem] text-center text-white">
                        Information
                    </span>
                </span>
                <span
                    className={`${(currentView === 3) && true ? "active" : ""} !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]`}
                >
                    <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
                        3
                    </span>
                    <span className="!block w-full text-[0.9rem] text-center text-white">
                        Preview
                    </span>
                </span>
            </div>
        </>
    )
}

function FormLabelIndicator({ currentView }) {

    return (
        <span className="absolute top-0 left-0 bg-[#FFFFF0] text-[#ffa500] block w-fit p-4 border-r-[2px] border-b-[2px] border-black text-xl font-medium maxScreenMobile:hidden rounded-tl-md rounded-br-md">
            {currentView === 1
                ? "Upload File"
                : currentView === 2
                    ? "Presenter's Information"
                    : currentView === 3
                        ? "Preview"
                        : ""}
        </span>
    )
}

function FormStageMover({ currentView, moveStage }) {

    return (
        <div className="flex justify-between items-center mt-6 maxScreenMobile:flex-col maxScreenMobile:gap-4 maxScreenMobile:w-[90%] maxScreenMobile:mx-auto">
            <button
                type="button"
                data-next="prev"
                className={`${currentView === 1
                    ? "!cursor-not-allowed"
                    : "pointer-events-auto"
                    } border border-black text-black text-[1.5rem] px-2 py-[calc(0.5rem-2px)] rounded-md w-[25%] maxScreenMobile:text-[1.2rem] maxScreenMobile:w-full`}
                onClick={() => moveStage("prev")}
                disabled={currentView === 1 ? true : false}
            >
                Back
            </button>

            <button
                type={"button"}
                data-next="next"
                className={`${false ? "bg-[red]" : "bg-[black]"} pointer-events-auto text-white text-[1.5rem] p-2 border-none rounded-md w-[25%] maxScreenMobile:text-[1.2rem] maxScreenMobile:w-full`}
                onClick={() => moveStage("next")}
                disabled={false}
            >
                {false ? (
                    "Error, Try again"
                ) : false ? (
                    <LoadingAssetSmall2 />
                ) : currentView === 3 ? (
                    "Submit"
                ) : (
                    "Next"
                )}
            </button>
        </div>
    )
}

export { ProgressIndicator, FormLabelIndicator, FormStageMover }