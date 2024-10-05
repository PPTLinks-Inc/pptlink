import { useState, useRef, useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../assets/styles/general_css.css";
import img_feather from "/Icon-feather-upload-cloud.svg";
import img_featherTwo from "/Group92.png";
import img_plus from "/Icon-awesome-plus.png";
import validate from "./uploadValidationRules";
import useForm from "./useForm";
import Uploadanimation from "./uploadAnim";
import { DatePicker, EndTimePicker, StartTimePicker } from "./calender";
import { userContext } from "../../contexts/userContext";
import axios from "axios";
import { SERVER_URL } from "../../constants/routes";
import SlidePreview from "./SlidePreview";
import { LoadingAssetSmall2 } from "../../assets/assets";

let eventSourse = null;

export default function NewUploadPage() {
  const { user } = useContext(userContext);
  const queries = useQueryClient();
  const [currentView, setCurrentView] = useState(1);
  const addcategoryref = useRef(null);
  const scrollableRef = useRef(null);
  const previewRef = useRef(null);
  const [canUpload, setCanUpload] = useState(true);
  // const [categories, setCategories] = useState([
  //   ["Category One", false]
  // ]);
  const categories = useQuery({
    queryKey: ["categories"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async function () {
      const { data } = await axios.get("/api/v1/ppt/categories");
      return data;
    }
  });
  const [addedCategory, setAddedCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [toggle, setToggle] = useState(false);

  // form validation functions
  const {
    handleChange,
    handleSubmit,
    setValues,
    values,
    errors,
    uploadProgress,
    uploadProcessing,
    savePresentation
  } = useForm(nextFunction, validate);

  useEffect(() => {
    if (!eventSourse && user) {
      eventSourse = new EventSource(
        `${SERVER_URL}/api/v1/ppt/presentations/upload-notification/${user.id}/${Date.now()}`
      );

      eventSourse.onopen = () => {
        setCanUpload(true);
      };

      eventSourse.onerror = () => {
        setCanUpload(false);
      };

      eventSourse.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.event === "connect") setCanUpload(true);

        if (data.event === "upload-done") {
          setValues((prev) => ({
            ...prev,
            tempFileId: data.tempDataId,
            pdfLink: data.pdfLink,
            file: null
          }));
        } else if (data.event === "upload-error") {
          setValues((prev) => ({
            ...prev,
            file: null,
            pdfLink: null,
            tempFileId: null
          }));
        }
      };
    }

    return () => {
      if (eventSourse) {
        eventSourse.close();
        eventSourse = null;
      }
    };
  }, [user]);

  // function to open new category input form
  function addCategory() {
    if (addcategoryref.current.style.display === "none") {
      addcategoryref.current.style.display = "flex";
    } else {
      addcategoryref.current.style.display = "none";
    }
    setAddedCategory("");
    setCategoryError("");
  }

  // function to add a new category
  function newCategory() {
    const regex =
      /^(?=.*[a-zA-Z])(?=(?:.*[!@#$%^&*]){0,2})[a-zA-Z0-9!@#$%^&*]+(?: [a-zA-Z0-9!@#$%^&*]+)*$/;
    const trimmedCategory = addedCategory.trim();

    // Check if trimmedCategory is in predefinedCategories, ignoring the boolean part
    const isPredefined = categories.data.some(
      (category) =>
        category.name.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (
      !isPredefined &&
      trimmedCategory !== "" &&
      regex.test(trimmedCategory)
    ) {
      if (addcategoryref.current.style.display === "none") {
        addcategoryref.current.style.display = "flex";
      } else {
        addcategoryref.current.style.display = "none";
      }
      const newCategory = { id: `new-${Date.now()}`, name: trimmedCategory };
      queries.setQueryData(["categories"], (prev) => {
        return [...prev, newCategory];
      });
      setValues((prev) => ({ ...prev, category: JSON.stringify(newCategory) }));
      setAddedCategory("");
      setCategoryError("");
    } else {
      setCategoryError("Category already exists or is invalid");
    }
  }

  function showPreviousStage() {
    setCurrentView((prev) => {
      validate(values);
      if (prev <= 1) return (prev = 1);
      return prev - 1;
    });
  }

  function showNextStage() {
    setCurrentView((prev) => {
      if (prev >= 3) return (prev = 3);
      console.log("prev value for next ", prev);
      return prev + 1;
    });
  }

  function nextFunction(updateNum) {
    if (Object.keys(errors.errors).length === 0 && currentView === updateNum) {
      showNextStage(2);
    }

    if (Object.keys(errors.errors2).length === 0 && currentView === updateNum) {
      showNextStage(3);
      return;
    }
  }

  // cancel upload
  const cancelUpload = () => {
    // setValues((prev) => ({ ...prev, file: null }));
    window.location.reload();
  };

  // scroll page to the top when currentView changes
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentView]);

  useEffect(() => {
    if (!values.toggle) {
      setValues((prev) => ({ ...prev, date: "", startTime: "", endTime: "" }));
    }
  }, [values.toggle]);

  // form validation functions
  return (
    <section
      className="upload_svg_cover h-fit relative bg-[#FFFFF0]"
      ref={scrollableRef}
    >
      <div className="bottom_cover pt-10 pb-16 w-[90%] m-auto bg-transparent h-fit z-50 maxScreenMobile:w-full">
        <h1 className="text-[3rem] text-[#FFFFF0] maxScreenMobile:!text-[1rem] maxScreenMobile:text-center">
          New Presentation
        </h1>
        <hr />
        <div className="form_tracker_wrapper w-full flex justify-center mb-20 maxScreenMobile:!mb-4">
          {/* Note: true simply means all inputs for that view is 
                    met("not empty and valid") you can use required. first 
                    stage need not have, by default it is what it is 👀🥂 */}
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
        <form
          onSubmit={(e) => e.preventDefault()}
          className="addshadow w-full min-h-screen bg-[#FFFFF0] _shadow-md relative py-20 maxScreenMobile:pt-0"
        >
          <span className="absolute top-0 left-0 bg-[#FFFFF0] text-[#ffa500] block w-fit p-4 border-r-[2px] border-b-[2px] border-black text-xl font-medium maxScreenMobile:hidden">
            {currentView === 1
              ? "Upload File"
              : currentView === 2
                ? "Presenter's Information"
                : currentView === 3
                  ? "Preview"
                  : ""}
          </span>
          {/* first stage elements */}
          <div
            className={`w-full h-fit ${currentView === 1 ? "block" : "hidden"}`}
          >
            {/* first stage 🐱‍👤😒 upload el onNext remove */}
            {/* <div className="w-[90%] h-[15rem] m-auto bg-black border-[3px] !border-[#FFFFF0] border-dashed before:block before:w-full relative before:h-full before:bg-[#FFFFF0]  before:absolute before:top-0 before:left-0 before:pointer-events-none"> */}
            <div
              className={`w-[90%] h-[15rem] m-auto ${errors.errors?.file ? "bg-[red]" : "bg-black"} ${!errors.errors?.file && values.file && "hidden"} 
              border-[3px] !border-[#FFFFF0] border-dashed before:block before:w-full relative before:h-full before:bg-[#FFFFF0] 
              before:absolute before:top-0 before:left-0 before:pointer-events-none maxScreenMobile:w-full maxScreenMobile:bg-[black]
               maxScreenMobile:before:bg-black`}
            >
              {canUpload && (
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept=".ppt, .pptx, .pot, .pps, .pps, .potx, .ppsx, .ppam, .pptm, .potm, .ppsm"
                  multiple={false}
                  className="block w-full h-full bg-[red] cursor-pointer"
                />
              )}
              <div
                className={`flex flex-col gap-2 justify-center items-center w-full h-full
                   ${values?.tempFileId
                    ? "bg-green-400"
                    : canUpload
                      ? "bg-[rgba(255,165,0,0.3)]"
                      : "bg-rose-400"
                  } absolute top-0 left-0 pointer-events-none maxScreenMobile:bg-black`}
              >
                <img
                  src={img_feather}
                  alt={img_feather}
                  className="block w-16 aspect-square maxScreenMobile:hidden"
                />
                <img
                  src={img_featherTwo}
                  alt={img_featherTwo}
                  className="hidden w-16 aspect-square maxScreenMobile:block"
                />
                {values?.tempFileId ? (
                  <>
                    <span className="w-fit h-fit text-black">
                      File Upload successfully
                    </span>
                    <span className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full">
                      Change File...
                    </span>
                  </>
                ) : canUpload ? (
                  <>
                    <span className="w-fit h-fit text-black maxScreenMobile:text-white">
                      Drop your file in here
                    </span>
                    <span className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full maxScreenMobile:bg-white">
                      Browse...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-fit h-fit text-black">
                      Error you can&apos;t upload right now
                    </span>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full"
                    >
                      Reload
                    </button>
                  </>
                )}
              </div>
              {errors.errors?.file && (
                <p className="text-[red]">{errors.errors?.file}</p>
              )}
            </div>

            {/* first stage 🐱‍👤😒 loading animation onNext remain at top */}
            <Uploadanimation
              cancelUpload={cancelUpload}
              values={values}
              errors={errors}
              uploadProgress={uploadProgress}
              uploadProcessing={uploadProcessing}
            />
            {/* first stage 🐱‍👤😒 onNext remove */}
            <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
              <label htmlFor="title" className="block mb-2">
                <sup className="w-full text-xl font-bold">*</sup>Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.title ? "border border-[red] outline-offset-2" : "border-none"}`}
              />
              {errors.errors?.title && (
                <p className="text-[red]">{errors.errors.title}</p>
              )}
            </div>
            {/* first stage 🐱‍👤😒 onNext remove */}
            <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
              <label htmlFor="textarea" className="block mb-2">
                <sup className="w-full text-xl font-bold"></sup>Description
                (Optional)
              </label>
              <textarea
                id="textarea"
                className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.description ? "border border-[red] outline-offset-2" : "border-none"}`}
                rows="5"
                cols="50"
                name="description"
                value={values.description}
                onChange={handleChange}
              ></textarea>
              {errors.errors?.description && (
                <p className="text-[red]">{errors.errors.description}</p>
              )}
            </div>
            {/* first stage 🐱‍👤😒 onNext remove */}
            <div className="flex justify-between w-[90%] m-auto">
              <div className="w-[48%] h-fit mt-6 text-lg text-black">
                <label htmlFor="publicSelector" className="block mb-2">
                  <sup className="w-full text-xl font-bold">*</sup>Privacy
                </label>
                <select
                  name="privacy"
                  id="publicSelector"
                  onChange={handleChange}
                  className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.privacy ? "border border-[red] outline-offset-2" : "border-none"}`}
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                  <option value="TEMP">Temprary</option>
                </select>
                {errors.errors?.privacy && (
                  <p className="text-[red]">{errors.errors.privacy}</p>
                )}
              </div>

              <div className="w-[48%] h-fit mt-6 text-lg text-black">
                <label htmlFor="downloadSelector" className="block mb-2">
                  <sup className="w-full text-xl font-bold">*</sup>Downloadable
                </label>
                <select
                  name="downloadable"
                  id="downloadSelector"
                  onChange={handleChange}
                  className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.downloadable ? "border border-[red] outline-offset-2" : "border-none"}`}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                {errors.errors?.downloadable && (
                  <p className="text-[red]">{errors.errors.downloadable}</p>
                )}
              </div>
            </div>
            {/* first stage 🐱‍👤😒 onNext remove */}
            <div className="flex justify-between w-[90%] m-auto">
              <div className="w-[48%] maxScreenMobile:w-full mr-auto flex flex-col justify-center _items-center h-fit mt-6 text-lg text-black">
                <div className="w-full relative">
                  <label htmlFor="publicSelector" className="block mb-2">
                    <sup className="w-full text-xl font-bold">*</sup>Category
                  </label>
                  <div
                    className={`bg-white h-fit justify-between items-center overflow-hidden flex w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md ${categoryError || errors.errors?.category ? "border border-[red] outline-offset-2" : "border-none"}`}
                  >
                    <select
                      name="category"
                      title="category"
                      onChange={handleChange}
                      id="publicSelector"
                      className="block w-[65%] text-lg maxScreenMobile:w-[85%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-8"
                      value={values?.category}
                      disabled={categories.isLoading}
                    >
                      <option value="" className="text-[gray]">
                        {categories.isLoading
                          ? "Loading..."
                          : "Choose a category"}
                      </option>

                      <>
                        {categories.data?.map((category) => (
                          <option
                            value={JSON.stringify(category)}
                            key={category.id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </>
                    </select>

                    <button
                      type="button"
                      onClick={addCategory}
                      className="w-[45%] maxScreenMobile:text-[0.8rem] 
                      flex gap-1 justify-evenly items-center h-full p-2 
                      bg-black border-none rounded-tl-md rounded-bl-md maxScreenMobile:w-fit maxScreenMobile:p-4"
                    >
                      <img
                        src={img_plus}
                        alt={img_plus}
                        className="block w-3 h-3 scale-125 maxScreenMobile:scale-150"
                      />
                      <span className="text-white text-[1rem] block w-fit h-fit italic maxScreenMobile:hidden">
                        ADD NEW
                      </span>
                    </button>
                  </div>
                  <div
                    ref={addcategoryref}
                    className="hidden bg-white h-fit justify-between items-center overflow-hidden w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md transition-all mt-[20px]"
                  >
                    <input
                      type="text"
                      id="title"
                      value={addedCategory}
                      onChange={(e) => setAddedCategory(e.target.value)}
                      className="block w-[65%] p-2 indent-8 border-2 border-black border-r-0 rounded-tl-md rounded-bl-md"
                      placeholder="ADD CATEGORY"
                    />
                    <button
                      type="button"
                      className="w-[45%] flex gap-1 justify-center items-center h-full p-2 bg-black border-2 border-black rounded-tr-md rounded-br-md cursor-pointer"
                      onClick={newCategory}
                    >
                      <span className="text-white text-[1rem] block w-fit h-fit italic">
                        ADD
                      </span>
                    </button>
                  </div>
                </div>

                {categoryError ? (
                  <p className="text-[red]">{categoryError}</p>
                ) : (
                  errors.errors?.category && (
                    <p className="text-[red]">{errors.errors.category}</p>
                  )
                )}
              </div>
            </div>
          </div>
          {/* first stage second 🐱‍👤😒 loading animation onNext remain at top */}
          {currentView === 2 && (
            <Uploadanimation
              cancelUpload={cancelUpload}
              values={values}
              errors={errors}
              uploadProgress={uploadProgress}
              uploadProcessing={uploadProcessing}
            />
          )}
          {/* Second stage show els 👀👀 */}
          <div
            className={`w-full h-fit ${currentView === 2 ? "block" : "hidden"}`}
          >
            {/* first stage 🐱‍👤😒 onNext remove */}
            <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black maxScreenMobile:pt-6">
              <label htmlFor="name" className="block mb-2">
                <sup className="w-full text-xl font-bold">*</sup>
                Presenter&apos;s Name
              </label>
              <input
                type="text"
                value={values.name}
                onChange={handleChange}
                name="name"
                id="name"
                className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors2?.name ? "border border-[red] outline-offset-2" : "border-none"}`}
              />
              {errors.errors2?.name && (
                <p className="text-[red]">{errors.errors2.name}</p>
              )}
            </div>
            {/* first stage 🐱‍👤😒 onNext remove */}
            <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
              <label htmlFor="BioOptional" className="block mb-2">
                <sup className="w-full text-xl font-bold"></sup>Bio (Optional)
              </label>
              <textarea
                id="BioOptional"
                className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors2?.bio ? "border border-[red] outline-offset-2" : "border-none"}`}
                rows="5"
                cols="50"
                name="bio"
                onChange={handleChange}
                value={values.bio}
              ></textarea>
              {errors.errors2?.bio && (
                <p className="text-[red]">{errors.errors2.bio}</p>
              )}
            </div>
            {/* first stage 🐱‍👤😒 onNext remove */}
            <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
              <label htmlFor="title" className="block mb-2">
                <sup className="w-full text-xl font-bold"></sup>Social Media
                Link (Optional)
              </label>
              <input
                type="text"
                id="title"
                name="social"
                onChange={handleChange}
                value={values.social}
                className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors2?.social ? "border border-[red] outline-offset-2" : "border-none"}`}
              />
              {errors.errors2?.social && (
                <p className="text-[red]">{errors.errors2.social}</p>
              )}
            </div>
            {/* time of presentation */}
            <span
              className="bg-[#FFFFF0] text-[#ffa500] w-fit p-4 mt-8 
            border-[2px] border-black text-xl font-medium flex 
            justify-between items-center maxScreenMobile:text-white 
            maxScreenMobile:bg-[#ffa500] maxScreenMobile:border-[#ffa500]"
            >
              Time of Presentation
              <div className="ml-[20px] flex items-center justify-center">
                <input
                  type="checkbox"
                  id="switch"
                  name="toggle"
                  className="toggle"
                  onChange={(event) => {
                    setToggle(!toggle);
                    handleChange(event);
                  }}
                />
                <label htmlFor="switch" className="toggle__label">
                  Toggle
                </label>
              </div>
            </span>
            {/* time constants for presentaions */}
            {toggle && (
              <div className="flex maxScreenMobile:flex-col justify-between w-[90%] m-auto">
                {/* 1 */}
                <DatePicker
                  handleChange={handleChange}
                  setValues={setValues}
                  values={values}
                  errors={errors}
                />

                {/* 2 */}
                <StartTimePicker
                  handleChange={handleChange}
                  setValues={setValues}
                  values={values}
                  errors={errors}
                />

                {/* 3 */}
                <EndTimePicker
                  handleChange={handleChange}
                  setValues={setValues}
                  values={values}
                  errors={errors}
                />
              </div>
            )}
            {/* end */}
          </div>
          {/* Third stage show els 👀👀 */}
          <div
            className={`w-full min-h-full ${currentView === 3 ? "flex" : "hidden"} justify-center items-center`}
          >
            {/* <h1 className='text-[3rem] font-black text-black'>Coming Soon pls🐱‍🏍</h1> */}
            <div className="w-full h-fit flex justify-between items-start maxScreenMobile:flex-col">
              <div className="!w-[50%] maxScreenMobile:!w-full max-h-auto mt-auto mb-0 flex flex-col justify-between bg-[#FFFFF0]">
                {/* MARK: Preview */}
                <div
                  ref={previewRef}
                  className="maxScreenMobile:mt-4 w-[95%] m-auto h-[20rem] bg-white rounded-md border-2 border-black"
                >
                  {values?.pdfLink && (
                    <SlidePreview
                      currentView={currentView}
                      url={values?.pdfLink}
                      containerRef={previewRef}
                    />
                  )}
                </div>
                <div className="bg-black h-fit mt-16 pb-4">
                  <p className="w-fit m-auto pt-14 pb-4 text-black text-[1.2rem]">
                    PRESENTER&apos;S INFORMATION
                  </p>
                  <div className="w-[95%] m-auto min-h-64 bg-[#FFFFF0] text-black">
                    <ul className="block w-full py-4">
                      <li className="block w-full mb-4 px-4">
                        <span>Name</span>
                        <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                        <p className="text-[0.9rem] italic mt-2">
                          {values.name ? values.name : "No Name Set"}
                        </p>
                      </li>
                      <li className="block w-full mb-4 px-4">
                        <span>Bio</span>
                        <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                        <p className="text-[0.9rem] italic mt-2">
                          {values.bio ? values.bio : "No Bios Set"}
                        </p>
                      </li>
                      <li className="block w-full mb-4 px-4">
                        <span>Social Media Link</span>
                        <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                        <p className="text-[0.9rem] italic mt-2">
                          {values.social ? values.social : "No Social Link Set"}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="!w-[50%] maxScreenMobile:!w-full _overflow-auto max-h-auto bg-black pb-4 flex flex-col justify-between">
                <p className="w-fit m-auto pt-14 pb-4 text-black text-[1.2rem] mt-0">
                  PRESENTATION DETAILS
                </p>
                <div className="w-[95%] m-auto mb-0 min-h-[calc(100%-(5.7rem))] _overflow-auto bg-[#FFFFF0] text-black">
                  <ul className="block w-full pt-4">
                    <li className="block w-full mb-4 px-4">
                      <span>Presentation title</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.title ? values.title : "No Title Set"}
                      </p>
                    </li>
                    <li className="block w-full mb-4 px-4">
                      <span>Description</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.description
                          ? values.description
                          : "No Description Set"}
                      </p>
                    </li>
                    <li className="block w-full mb-4 px-4">
                      <span>Privacy</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.privacy ? values.privacy : "No Privacy Set"}
                      </p>
                    </li>
                    {/* <li className="block w-full mb-4 px-4">
                      <span>Key Words</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.key ? values.key.array.forEach(element => {
                          return JSON.stringify([...element]);
                        }) : ""}
                        {/* Cybersecurity, Cybercrimes, Cyber war, cyber protection,
                        Hacking...
                      </p>
                    </li> */}
                    <li className="block w-full mb-4 px-4">
                      <span>Category</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.category
                          ? JSON.parse(values.category).name
                          : "No Category Set"}
                      </p>
                    </li>
                    <li className="block w-full mb-4 px-4">
                      <span>Downloadable</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.downloadable
                          ? "Downloadable"
                          : "Not downloadable"}
                      </p>
                    </li>
                  </ul>
                  <p className="bg-black text-slate-200 w-3/6 pl-4 py-2">
                    SCHEDULE
                  </p>
                  <ul className="block w-full pb-4">
                    <li className="block w-full mb-4 px-4">
                      <span>Date</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.date
                          ? `Start Date: ${values.date}`
                          : "No Date Set"}
                      </p>
                    </li>
                    <li className="block w-full mb-4 px-4">
                      <span>Time</span>
                      <hr className="p-[0.8px] mt-1 bg-black w-[80%]" />
                      <p className="text-[0.9rem] italic mt-2">
                        {values.startTime
                          ? `Start Time(${values.startTime}) `
                          : "No Start Time Set "}
                        -
                        {values.endTime
                          ? ` End Time(${values.endTime})`
                          : " No End Time Set"}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-between items-center mt-6 maxScreenMobile:flex-col maxScreenMobile:gap-4 maxScreenMobile:w-[90%] maxScreenMobile:mx-auto">
          <button
            type="button"
            className={`${currentView === 1
              ? "bg-[#3d3535bf] text-white !cursor-not-allowed"
              : "border border-black pointer-events-auto"
              } text-black text-[1.5rem] p-2 
              rounded-md w-[25%] maxScreenMobile:text-[1.2rem] maxScreenMobile:w-full`}
            onClick={showPreviousStage}
            disabled={savePresentation.isPending}
          >
            Back
          </button>

          <button
            type="button"
            className={`${savePresentation.isError ? "bg-[red]" : "bg-[black]"} pointer-events-auto 
            text-white text-[1.5rem] p-2 border-none rounded-md w-[25%] maxScreenMobile:text-[1.2rem] 
            maxScreenMobile:w-full`}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(currentView);
            }}
            disabled={savePresentation.isPending}
          >
            {savePresentation.isError ? (
              "Error, Try again"
            ) : savePresentation.isPending ? (
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
