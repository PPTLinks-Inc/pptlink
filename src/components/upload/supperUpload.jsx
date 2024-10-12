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
import { ProgressIndicator, FormLabelIndicator, FormStageMover } from "./uploadSubcomponents/progressIndicator";
import UploadStage from "./presentationStages/uploadStage";
import InformationStage from "./presentationStages/informationStage";
import PreviewStage from "./presentationStages/previewStage";

export default function SupperUpload() {
    const { user } = useContext(userContext);
    const queries = useQueryClient();
    const scrollableRef = useRef(null);
    const [currentView, setCurrentView] = useState(1);
    const [uploadValues, setUploadValues] = useState({
        // values to collect here
        file: null,
        title: "",
        description: "",
        privacy: "PUBLIC",
        downloadable: true,
        category: "",
        categories: ["Educational Contents"],
        linkType: "",
        tempFileId: "",
        presenterName: "",
        bio: "",
        socialMediaLink: "",
        presentationDate: "",
        presentationStartTime: "",
        presentationEndTime: "",
        canUpload: true,
    });

    const [uploadValuesErrors, setUploadValuesErrors] = useState({
        // errors to lookout for here
        fileError: "",
        titleError: "",
        descriptionError: "",
        privacyError: "",
        downloadableError: "",
        categoryError: "",
        linkTypeError: "",
        tempFileIdError: "",
        presenterNameError: "",
        bioError: "",
        socialMediaLinkError: "",
        presentationDateError: "",
        presentationStartTimeError: "",
        presentationEndTimeError: "",
    });
    // seters
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUploadValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    // create axios requset to get all categories here
    console.log(uploadValues);

    // form validation functions
    // handling previous and next views
    function moveStage(btnClicked) {
        setCurrentView((prev) => {
            if (btnClicked === "prev") {
                if (prev <= 1) return (prev = 1);
                return prev - 1;
            } else if (btnClicked === "next") {
                if (prev >= 3) return (prev = 3);
                return prev + 1;
            } else {
                alert("😣 Stop trying to hack it skum bag!!!");
            }
        });
    }

    // scroll page to the top when currentView changes
    useEffect(() => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentView]);

    return (
        <section
            ref={scrollableRef}
            className="upload_svg_cover h-fit relative bg-[#FFFFF0]">
            <div className="bottom_cover_ pt-10 pb-16 w-[90%] m-auto bg-transparent h-fit z-50 maxScreenMobile:w-full">
                {/* progress indicator */}
                <ProgressIndicator currentView={currentView} />
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="w-full min-h-screen bg-[#FFFFF0] shadow-xl relative py-20 maxScreenMobile:pt-0 md:rounded-md"
                >
                    <FormLabelIndicator currentView={currentView} />
                    {/* first stage elements 👀👀 */}
                    <UploadStage
                        currentView={currentView}
                        uploadValues={uploadValues}
                        setUploadValues={setUploadValues}
                        uploadValuesErrors={uploadValuesErrors}
                        setUploadValuesErrors={setUploadValuesErrors}
                        handleInputChange={handleInputChange}
                    />
                    {/* Second stage show els 👀👀 */}
                    <InformationStage
                        currentView={currentView}
                        uploadValues={uploadValues}
                        setUploadValues={setUploadValues}
                        uploadValuesErrors={uploadValuesErrors}
                        setUploadValuesErrors={setUploadValuesErrors}
                        handleInputChange={handleInputChange}
                    />
                    {/* Third stage show els 👀👀 */}
                    <PreviewStage
                        currentView={currentView}
                        uploadValues={uploadValues}
                    />
                </form>
                {/* form stage tracker */}
                <FormStageMover
                    currentView={currentView}
                    moveStage={moveStage}
                    uploadValuesErrors={uploadValuesErrors}
                    setUploadValuesErrors={setUploadValuesErrors}
                />
            </div>
        </section>
    );
}
