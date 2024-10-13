import { useState, useRef, useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../assets/styles/general_css.css";
// import img_plus from "/Icon-awesome-plus.png";
// import validate from "./uploadValidationRules";
// import useForm from "./useForm";
// import Uploadanimation from "./uploadAnim";
import { userContext } from "../../contexts/userContext";
import axios from "axios";
import { SERVER_URL } from "../../constants/routes";
// import SlidePreview from "./SlidePreview";
import { ProgressIndicator, FormLabelIndicator, FormStageMover } from "./uploadSubcomponents/progressIndicator";
import UploadStage from "./presentationStages/uploadStage";
import InformationStage from "./presentationStages/informationStage";
import PreviewStage from "./presentationStages/previewStage";
import { FormatDate } from "@/components/ui/calendar";

export default function SupperUpload() {
    const { user } = useContext(userContext);
    const queries = useQueryClient();
    const scrollableRef = useRef(null);
    const [currentView, setCurrentView] = useState(1);
    const [uploadValues, setUploadValues] = useState({
        // first stage values here
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

    // uploads SetersFunc
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setUploadValues((prevValues) => ({
                ...prevValues,
                file: files[0],
            }));
        } else {
            setUploadValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        }
    };
    console.log("uploadValues", uploadValues);
    // uploads Error SetersFunc
    const validateUploads = () => {
        let errors = {};

        // Supported MIME types
        // const mimeTypes = [
        //     "application/wps-office.pptx",
        //     "application/vnd.ms-powerpoint",
        //     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        //     "application/vnd.openxmlformats-officedocument.presentationml.template",
        //     "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        //     "application/vnd.ms-powerpoint.addin.macroEnabled.12",
        //     "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
        //     "application/vnd.ms-powerpoint.template.macroEnabled.12",
        //     "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
        // ];
        // checking file presence to processed to next phase:simple 🥂
        const allowedExtensions = [".ppt", ".pptx", ".pot", ".pps", ".potx", ".ppsx", ".ppam", ".pptm", ".potm", ".ppsm"];
        // Check if the file is selected and valid
        if (!uploadValues.file) {
            errors.fileError = "Please upload a presentation file.";
        } else {
            const baseFileSize = 10; // change it to suit the required file size
            const { type, size } = uploadValues.file;
            const fileExtension = uploadValues.file?.name.split(".").pop();

            if (!allowedExtensions.includes(`.${fileExtension}`)) {
                // But this method is, not a server side check though 😶🙄😅
                errors.fileError = "Invalid file extension.";
            } else if (size > (baseFileSize * 1024 * 1024)) {  // Limit to 10MB
                errors.fileError = `The file size must not exceed ${baseFileSize}MB`;
            } else {
                errors.fileError = "";
            }

            // Not sure why this method was not working 😒🥱
            // if (!mimeTypes.includes(type)) {
            //     errors.fileError = "Upload a valid ppt or pptx file.";
            // }
        }
        // Title validation checks
        if (!uploadValues.title) {
            errors.titleError = "Type in title of presentation";
        } else if (uploadValues.title.length < 2) {
            errors.titleError = "Presentation title is too short";
        } else {
            errors.titleError = "";
        }
        // Description validation checks
        if (uploadValues.description && uploadValues.description.length < 5) {
            errors.descriptionError = "Presentation Description is too short";
        } else {
            errors.descriptionError = "";
        }
        // privacy validation checks
        if (!uploadValues.privacy) {
            errors.privacyError = "Choose the privacy of your presentation";
        } else {
            errors.privacyError = "";
        }
        // downloadable validation checks
        if (!uploadValues.downloadable) {
            errors.downloadableError = "Should your presentation be downloadable";
        } else {
            errors.downloadableError = "";
        }
        // category validation checks
        if (!uploadValues.category) {
            errors.categoryError = "Choose a presentation category";
        } else {
            errors.categoryError = "";
        }

        // /////////////////////Page 2 errors////////////////////////////
        if (currentView === 2) {
            // presenterName validation checks
            if (!uploadValues.presenterName) {
                errors.presenterNameError = "Type in presenter's name";
            } else if (uploadValues.presenterName && uploadValues.presenterName.length < 2) {
                errors.presenterNameError = "Presenter's name is too short";
            } else {
                errors.presenterNameError = "";
            }
            // Bio validation checks
            if (uploadValues.bio && uploadValues.bio.length < 5) {
                errors.bioError = "Please give more details about the presenter";
            } else {
                errors.bioError = "";
            }
            // Social media link validation regex
            const socialMediaRegexes = [
                /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,}$/,
                /^(https?:\/\/)?(www\.)?(web\.)?facebook\.com\/[a-zA-Z0-9./_-]+$/,
                /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,}/,
                /^https:\/\/www\.tiktok\.com\/@[\w.-]+(\/video\/\d+)?(\?[^/\s]*)?$/,
                /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//,
                /^(https?:\/\/)?(www\.)?(youtube\.com\/(@[\w.-]+|[\w.-]+)|youtu\.be\/[\w.-]+)(\?[^/\s]*)?$/,
                /^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}$/
            ];
            // socialMediaLink validation regex checks
            const isValidSocialLink = socialMediaRegexes.some((regex) =>
                regex.test(uploadValues.socialMediaLink)
            );
            // socialMediaLink validation checks
            if (uploadValues.socialMediaLink && !isValidSocialLink) {
                errors.socialMediaLinkError = "Input a valid social media link";
            } else {
                errors.socialMediaLinkError = "";
            }
            // Date validation checks
            // if (!uploadValues.presentationDate) {
            //     errors.presentationDateError = "Must select start Date, can't be empty";
            // } else 
            if (uploadValues.presentationDate &&
                uploadValues.presentationDate < FormatDate(new Date(), 'YYYY-MM-DD')) {
                errors.presentationDateError = "Date cannot be in the past";
            } else {
                errors.presentationDateError = "";
            }
            // start time validation checks
            // if (!uploadValues.presentationStartTime) {
            //     errors.presentationStartTimeError = "Must select start time, can't be empty";
            // } else 
            if (uploadValues.presentationStartTime) {
                const startTime = new Date(`1970-01-01T${uploadValues.presentationStartTime}:00Z`);
                const currentTime = new Date();

                const startHours = startTime.getUTCHours();
                const startMinutes = startTime.getUTCMinutes();
                const currentHours = currentTime.getUTCHours();
                const currentMinutes = currentTime.getUTCMinutes();

                if (startHours < currentHours ||
                    (startHours >= currentHours && startMinutes < currentMinutes)) {
                    errors.presentationStartTimeError = "Can't select past time";
                } else {
                    errors.presentationStartTimeError = "";
                }
            }
            // end time validation checks
            if (uploadValues.presentationStartTime && uploadValues.presentationEndTime) {
                const startTime = new Date(`1970-01-01T${uploadValues.presentationStartTime}:00Z`).getTime();
                const endTime = new Date(`1970-01-01T${uploadValues.presentationEndTime}:00Z`).getTime();
                const tenMinutesInMillis = 10 * 60 * 1000;

                if ((endTime - startTime) < tenMinutesInMillis) {
                    errors.presentationEndTimeError = "Must be 10 minutes after start time";
                } else {
                    errors.presentationEndTimeError = "";
                }
            } else if (uploadValues.presentationEndTime && !uploadValues.presentationStartTime) {
                errors.presentationEndTimeError = "Must select start time, first";
            } else {
                errors.presentationEndTimeError = "";
            }
        }
        // Update the state with all errors at once
        setUploadValuesErrors((prevErrors) => ({
            ...prevErrors,
            ...errors,
        }));
        // Check if there are any errors
        return Object.values(errors).some((error) => error !== "");
    };

    // form validation function, handling previous and next views
    function moveStage(btnClicked) {
        setCurrentView((prev) => {
            if (btnClicked === "prev") {
                return prev > 1 ? prev - 1 : 1;
            } else if (btnClicked === "next") {
                if (validateUploads()) {
                    return prev;
                }
                return prev < 3 ? prev + 1 : 3;
            } else {
                alert("😣 Stop trying to hack it Skum Bag!!!");
            }
        });
    }

    // create axios requset to get all categories here with useEffect 🥂
    console.log("uploadValuesErrors.fileError", uploadValuesErrors.fileError);

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
                />
            </div>
        </section>
    );
}
