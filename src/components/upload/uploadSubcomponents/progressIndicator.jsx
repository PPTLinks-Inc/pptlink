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
                    <span className="!block w-full text-[1.25rem] text-center text-white">
                        Upload
                    </span>
                </span>
                <span
                    className={`${(currentView === 2 || currentView === 3) & true ? "active" : ""} !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]`}
                >
                    <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
                        2
                    </span>
                    <span className="!block w-full text-[1.25rem] text-center text-white">
                        Information
                    </span>
                </span>
                <span
                    className={`${(currentView === 3) & true ? "active" : ""} !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]`}
                >
                    <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
                        3
                    </span>
                    <span className="!block w-full text-[1.25rem] text-center text-white">
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

export { ProgressIndicator, FormLabelIndicator }