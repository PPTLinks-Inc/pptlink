import { useState } from "react";
import img_feather from "/Icon-feather-upload-cloud.svg";
import img_featherTwo from "/Group92.png";

export default function UploadStage({
    currentView,
    uploadValues,
    setUploadValues,
    uploadValuesErrors,
    setUploadValuesErrors,
    handleInputChange }) {
    const [addCategory, setAddCategory] = useState({ isNewCategory: false, newCategory: "" });
    const [addCategoryError, setAddCategoryError] = useState(false);
    // make axios request to update categories here
    function updateCategories() {
        if (addCategory.newCategory === "") {
            setAddCategoryError(true);
            return;
        } else {
            setAddCategoryError(false);
        }
        setAddCategory((prev) => ({ ...prev, isNewCategory: false }));
        // console.log("Added categories", addCategory);
    }

    return (
        <div
            className={`w-full h-fit ${currentView === 1 ? "block" : "hidden"}`}
        >
            {/* Upload File here */}
            <div
                className={`w-full h-[20rem] m-auto ${false && "hidden"} 
              ${false && "border-[3px] !border-[red] border-dashed"} before:block before:w-full relative before:h-full before:bg-[#FFFFF0] 
              before:absolute before:top-0 before:left-0 before:pointer-events-none`}
            >
                {uploadValues.canUpload && (
                    <input
                        type="file"
                        name="file"
                        onChange={handleInputChange}
                        accept=".ppt, .pptx, .pot, .pps, .pps, .potx, .ppsx, .ppam, .pptm, .potm, .ppsm"
                        multiple={false}
                        className="block w-full h-full cursor-pointer"
                    />
                )}
                <div
                    className={`flex flex-col gap-2 justify-center items-center w-full h-full absolute top-0 left-0 pointer-events-none _maxScreenMobile:bg-black`}
                >
                    <span className="block w-[5rem] aspect-square">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.163 107.713" className="block w-full h-full">
                            <g id="Icon_feather-upload-cloud" data-name="Icon feather-upload-cloud" transform="translate(2.029 -0.985)">
                                <path id="Path_197" data-name="Path 197" d="M56.759,40.379,34.38,18,12,40.379" transform="translate(28.686 36.845)" fill="none" stroke={`${uploadValues.file ? "green" : !uploadValuesErrors.fileError ? "#ffa500" : "red"}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="7" />
                                <path id="Path_198" data-name="Path 198" d="M18,18V68.354" transform="translate(45.066 36.845)" fill="none" stroke={`${uploadValues.file ? "green" : !uploadValuesErrors.fileError ? "#ffa500" : "red"}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="7" />
                                <path id="Path_199" data-name="Path 199" d="M110.007,90.6A27.974,27.974,0,0,0,96.635,38.06h-7.05A44.759,44.759,0,1,0,12.712,78.9" transform="translate(0 0)" fill="none" stroke={`${uploadValues.file ? "green" : !uploadValuesErrors.fileError ? "#ffa500" : "red"}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="7" />
                                <path id="Path_200" data-name="Path 200" d="M56.759,40.379,34.38,18,12,40.379" transform="translate(28.686 36.845)" fill="none" stroke={`${uploadValues.file ? "green" : !uploadValuesErrors.fileError ? "#ffa500" : "red"}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="7" />
                            </g>
                        </svg>
                    </span>
                    <span className={`w-fit h-fit ${uploadValues.file ? "text-[green]" : !uploadValuesErrors.fileError ? "text-black" : "text-[red]"}`}>
                        {uploadValuesErrors.fileError ?
                            <>{uploadValuesErrors.fileError}</>
                            : <>{uploadValues.file ? "File Upload successfully" : true ? "Drop your file in here or" : "Error you can't upload right now"}</>
                        }
                    </span>
                    <span className={`w-fit h-fit text-white ${uploadValues.file ? "bg-[green]" : !uploadValuesErrors.fileError ? "bg-[#ffa500]" : "bg-[red]"} py-2 px-8 rounded-full`}>
                        {uploadValues.file ? "Change file..." : true ? "Browse..." : "Reload"}
                    </span>
                </div>
                {/* {uploadValuesErrors.fileError && (
                    <p className="text-[red] w-[90%] mx-auto text-lg mt-2 pb-6">{uploadValuesErrors.fileError}</p>
                )} */}
            </div>
            {/* Title */}
            <div className="w-[90%] h-fit m-auto mt-8 text-lg text-black">
                <label htmlFor="title" className="block mb-2">
                    <sup className="w-full text-xl font-bold">*</sup>Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={uploadValues.title}
                    onChange={handleInputChange}
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${uploadValuesErrors.title ? "border border-[red] outline-offset-2" : "border-none"}`}
                />
                {uploadValuesErrors.titleError && (
                    <p className="text-[red]">{uploadValuesErrors.titleError}</p>
                )}
            </div>
            {/* Description (Optional) */}
            <div className="w-[90%] h-fit m-auto mt-8 text-lg text-black">
                <label htmlFor="textarea" className="block mb-2">
                    <sup className="w-full text-xl font-bold"></sup>Description
                    (Optional)
                </label>
                <textarea
                    id="textarea"
                    className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md resize-none ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    rows="5"
                    cols="50"
                    name="description"
                    value={uploadValues.description}
                    onChange={handleInputChange}
                ></textarea>
                {uploadValuesErrors.descriptionError && (
                    <p className="text-[red]">{uploadValuesErrors.descriptionError}</p>
                )}
            </div>
            {/* Privacy/Downloadable */}
            <div className="flex justify-between w-[90%] m-auto mt-6">
                <div className="w-[48%] h-fit mt-6 text-lg text-black">
                    <label htmlFor="publicSelector" className="block mb-2">
                        <sup className="w-full text-xl font-bold">*</sup>Privacy
                    </label>
                    <select
                        name="privacy"
                        id="publicSelector"
                        onChange={handleInputChange}
                        className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                        <option value="TEMP">Temprary</option>
                    </select>
                    {uploadValuesErrors.privacyError && (
                        <p className="text-[red]">{uploadValuesErrors.privacyError}</p>
                    )}
                </div>

                <div className="w-[48%] h-fit mt-6 text-lg text-black">
                    <label htmlFor="downloadSelector" className="block mb-2">
                        <sup className="w-full text-xl font-bold">*</sup>Downloadable
                    </label>
                    <select
                        name="downloadable"
                        id="downloadSelector"
                        onChange={handleInputChange}
                        className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${false ? "border border-[red] outline-offset-2" : "border-none"}`}
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    {uploadValuesErrors.downloadableError && (
                        <p className="text-[red]">{uploadValuesErrors.downloadableError}</p>
                    )}
                </div>
            </div>
            {/* Add Category */}
            <div className="flex justify-between w-[90%] m-auto mt-6">
                <div className="w-[48%] maxScreenMobile:w-full mr-auto flex flex-col justify-center items-center h-fit mt-6 text-lg text-black">
                    <div className="w-full relative">
                        <label htmlFor="publicSelector" className="block mb-2">
                            <sup className="w-full text-xl font-bold">*</sup>Category
                        </label>
                        <div className={`bg-white h-fit justify-between items-center overflow-hidden flex w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md ${addCategoryError && "border-2 border-[red]"}`}
                        >
                            <select
                                name="category"
                                title="category"
                                onChange={(e) => setUploadValues({ ...uploadValues, category: e.target.value })}
                                id="publicSelector"
                                className="block w-[60%] text-lg _maxScreenMobile:w-[85%] p-2 mr-2 !border-[0px] !border-none bg-white outline outline-[white] indent-8"
                                value={uploadValues.category}
                                disabled={false}
                            >
                                <option value="" className="text-[gray]">
                                    {false ? "Loading..." : "Choose a category"}
                                </option>
                                {uploadValues.categories.map((category, id) => (
                                    <option value={category.toUpperCase().trim()} key={id}>
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() => {
                                    setAddCategoryError(false);
                                    setAddCategory(prev => ({ ...prev, newCategory: "", isNewCategory: !prev.isNewCategory }));
                                }}
                                className="w-[40%] maxScreenMobile:text-[0.8rem] 
                      flex gap-1 justify-evenly items-center h-full p-2 
                      bg-black border-black rounded-tr-md rounded-br-md _maxScreenMobile:w-fit _maxScreenMobile:p-4"
                            >
                                <span className="text-white text-[1rem] block w-fit h-fit italic _maxScreenMobile:hidden">
                                    NEW
                                </span>
                            </button>
                        </div>

                        <div
                            className={`${addCategory.isNewCategory ? "flex" : "hidden"} bg-white h-fit justify-between items-center overflow-hidden w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md transition-all mt-[20px]`}
                        >
                            <input
                                type="text"
                                id="title"
                                value={addCategory.newCategory || ""}
                                onChange={(e) =>
                                    setAddCategory((prev) => ({ ...prev, newCategory: e.target.value }))
                                }
                                className="block w-[60%] p-2 indent-8 border-none border-black border-r-0 rounded-tl-md rounded-bl-md"
                                placeholder="ADD CATEGORY"
                            />
                            <button
                                type="button"
                                className="w-[40%] flex gap-1 justify-center items-center h-full p-2 bg-black border-none border-black rounded-tr-md rounded-br-md cursor-pointer"
                                onClick={updateCategories}
                            >
                                <span className="text-white text-[1rem] block w-fit h-fit italic">
                                    ADD
                                </span>
                            </button>
                        </div>
                    </div>
                    {addCategoryError ||
                        uploadValuesErrors.categoryError
                        && (<p className="text-[red] w-full">{uploadValuesErrors.categoryError ?
                            uploadValuesErrors.categoryError
                            : "Category already exists or is invalid"}</p>)}
                </div>
            </div>
        </div>
    )
}