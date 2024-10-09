import { useState, useRef, useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../assets/styles/general_css.css";
import img_plus from "/Icon-awesome-plus.png";
import validate from "./uploadValidationRules";
import useForm from "./useForm";
import Uploadanimation from "./uploadAnim";
import { userContext } from "../../contexts/userContext";
import axios from "axios";
import { SERVER_URL } from "../../constants/routes";
import SlidePreview from "./SlidePreview";
import { LoadingAssetSmall2 } from "../../assets/assets";
import { ProgressIndicator, FormLabelIndicator } from "./uploadSubcomponents/progressIndicator";
import UploadStage from "./presentationStages/uploadStage";
import InformationStage from "./presentationStages/informationStage";
import PreviewStage from "./presentationStages/previewStage";

let eventSourse = null;

export default function SupperUpload() {
    const { user } = useContext(userContext);
    const queries = useQueryClient();
    const [currentView, setCurrentView] = useState(2);

    // form validation functions
    return (
        <section className="upload_svg_cover h-fit relative bg-[#FFFFF0]">
            <div className="bottom_cover_ pt-10 pb-16 w-[90%] m-auto bg-transparent h-fit z-50 maxScreenMobile:w-full">
                {/* progress indicator */}
                <ProgressIndicator currentView={currentView} />
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="w-full min-h-screen bg-[#FFFFF0] shadow-xl relative py-20 maxScreenMobile:pt-0 md:rounded-md"
                >
                    <FormLabelIndicator currentView={currentView} />
                    {/* first stage elements */}
                    <UploadStage currentView={currentView} />
                    {/* Second stage show els 👀👀 */}
                    <InformationStage currentView={currentView} />
                    {/* Third stage show els 👀👀 */}
                    <PreviewStage currentView={currentView} />
                </form>
                <div className="flex justify-between items-center mt-6 maxScreenMobile:flex-col maxScreenMobile:gap-4 maxScreenMobile:w-[90%] maxScreenMobile:mx-auto">
                    <button
                        type="button"
                        className={`${currentView === 1
                            ? "!cursor-not-allowed"
                            : "pointer-events-auto"
                            } border border-black text-black text-[1.5rem] px-2 py-[calc(0.5rem-2px)] rounded-md w-[25%] maxScreenMobile:text-[1.2rem] maxScreenMobile:w-full`}
                        onClick={() => { }}
                        disabled={false}
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        className={`${false ? "bg-[red]" : "bg-[black]"} pointer-events-auto text-white text-[1.5rem] p-2 border-none rounded-md w-[25%] maxScreenMobile:text-[1.2rem] maxScreenMobile:w-full`}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
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
            </div>
        </section>
    );
}
