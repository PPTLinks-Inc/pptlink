/* eslint-disable react/prop-types */
import useUser from "@/hooks/useUser";
import { useConvexQuery } from "@/lib/convex";
import { useUploadStore } from "@/store/uploadStoreProvider";
import { api } from "@pptlinks/shared-convex-backend/convex/_generated/api";
import { useSearchParams } from "react-router-dom";

function ProgressIndicator() {
  const currentView = useUploadStore((state) => state.currentView);
  const [searchParams] = useSearchParams();

  return (
    <>
      <h1 className="w-full text-center text-[3rem] text-[#FFFFF0] maxScreenMobile:!text-[2rem] maxScreenMobile:text-center mb-10">
        {searchParams.has("edit") ? "Edit Presentation" : "New Presentation"}
      </h1>
      {/* <hr className="bg-[#FFFFF0] !h-[0.1px]" /> */}
      <div className="form_tracker_wrapper w-full flex justify-center mb-20 maxScreenMobile:!mb-4">
        <span className="active !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]">
          <span className="flex justify-center items-center w-[1.5rem] m-auto aspect-square text-center rounded-[0.75rem] mb-2 bg-white text-primaryTwo text-[.9rem]">
            1
          </span>
          <span className="!block w-full responsiveText text-center text-white">
            Upload
          </span>
        </span>
        <span
          className={`${(currentView === 2 || currentView === 3) && true ? "active" : ""} !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]`}
        >
          <span className="flex justify-center items-center w-[1.5rem] m-auto aspect-square text-center rounded-[0.75rem] mb-2 bg-white text-primaryTwo text-[.9rem]">
            2
          </span>
          <span className="!block w-full responsiveText text-center text-white">
            Information
          </span>
        </span>
        <span
          className={`${currentView === 3 && true ? "active" : ""} !block text-center w-[calc(100%/4)] relative maxScreenMobile:w-[calc(100%/3)]`}
        >
          <span className="flex justify-center items-center w-[1.5rem] m-auto aspect-square text-center rounded-[0.75rem] mb-2 bg-white text-primaryTwo text-[.9rem]">
            3
          </span>
          <span className="!block w-full responsiveText text-center text-white">
            Preview
          </span>
        </span>
      </div>
    </>
  );
}

function FormLabelIndicator() {
  const currentView = useUploadStore((state) => state.currentView);
  return (
    <span className="absolute top-0 left-0 bg-[#FFFFF0] text-[#ffa500] block w-fit p-4 border-r-[2px] border-b-[2px] border-primaryTwo text-xl font-medium maxScreenMobile:hidden rounded-tl-md rounded-br-md">
      {currentView === 1
        ? "Upload File"
        : currentView === 2
          ? "Presenter's Information"
          : currentView === 3
            ? "Preview"
            : ""}
    </span>
  );
}

function FormStageMover() {
  const { userQuery } = useUser();
  const user = userQuery.data;
  const [searchParams] = useSearchParams();
  const currentView = useUploadStore((state) => state.currentView);
  const moveView = useUploadStore((state) => state.moveView);

  const { data } = useConvexQuery(api.jobsQuery.getSingleUploadTempData, {
    userId: user?.id ?? ""
  });
  const processingFile = data?.status ===  "processing";
  const isSaving = useUploadStore((state) => state.isSaving);

  const disableBtn =
    (currentView === 3 && processingFile) || isSaving ? true : false;

  return (
    <div className="flex justify-between items-center mt-6 maxScreenMobile:flex-col maxScreenMobile:gap-4 maxScreenMobile:w-[90%] maxScreenMobile:mx-auto">
      <button
        type="button"
        className={`${
          currentView === 1 || isSaving
            ? "!cursor-not-allowed"
            : "pointer-events-auto"
        } border border-primaryTwo text-primaryTwo text-[1.5rem] px-2 py-[calc(0.5rem-2px)] rounded-md w-[25%] maxScreenMobile:text-[1.2rem] maxScreenMobile:w-full`}
        onClick={() => moveView("back")}
        disabled={currentView === 1 || isSaving ? true : false}
      >
        Back
      </button>

      <button
        type={"button"}
        className={`${disableBtn && "!cursor-not-allowed"} disabled:bg-gray-400 bg-primaryTwo pointer-events-auto text-white text-[1.5rem] p-2 border-none rounded-md w-[25%] maxScreenMobile:text-[1.2rem] maxScreenMobile:w-full`}
        onClick={() => moveView("next")}
        disabled={disableBtn}
      >
        {currentView === 3
          ? isSaving
            ? "Saving..."
            : searchParams.has("edit")
              ? "Update"
              : "Submit"
          : "Next"}
      </button>
    </div>
  );
}

export { ProgressIndicator, FormLabelIndicator, FormStageMover };
