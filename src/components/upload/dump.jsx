// import React, { useState, useRef, useEffect } from "react";
// import "../../assets/styles/general_css.css";
// import img_feather from "/Icon-feather-upload-cloud.svg";
// import img_plus from "/Icon-awesome-plus.png";
// import upload_progress_svg from "/upload_progress_svg.svg";
// import Icon_metro_calendar from "/Icon-metro-calendar.svg";
// import Icon_awesome_clock from "/Icon-awesome-clock.svg";
// import validate from "./uploadValidationRules";
// import useForm from "./useForm";

// export default function NewUploadPage() {
//   const [currentView, setCurrentView] = useState(1);
//   const addcategoryref = useRef(null);
//   const dateInputRef = useRef(null);
//   const scrollableRef = useRef(null);
//   const [categories, setCategories] = useState([
//     ["category 1", false],
//     ["category 2", false],
//     ["category 3", false],
//     ["category 4", false]
//   ]);
//   const [addedCategory, setAddedCategory] = useState("");
//   const [categoryError, setCategoryError] = useState("");
//   const [toggle, setToggle] = useState(false);

//   // function to open new category input form
//   function addCategory() {
//     if (addcategoryref.current.style.display === "none") {
//       addcategoryref.current.style.display = "flex";
//     } else {
//       addcategoryref.current.style.display = "none";
//     }

//     setAddedCategory("");
//     setCategoryError("");
//   }

//   // function to add a new category
//   const newCategory = () => {
//     const regex =
//       /^(?=.*[a-zA-Z])(?=(?:.*[!@#$%^&*]){0,2})[a-zA-Z0-9!@#$%^&*]+(?: [a-zA-Z0-9!@#$%^&*]+)*$/;
//     const trimmedCategory = addedCategory.trim();

//     // Check if trimmedCategory is in predefinedCategories, ignoring the boolean part
//     const isPredefined = categories.some(
//       ([category]) => category.toLowerCase() === trimmedCategory.toLowerCase()
//     );

//     if (
//       !isPredefined &&
//       trimmedCategory !== "" &&
//       regex.test(trimmedCategory)
//     ) {
//       if (addcategoryref.current.style.display === "none") {
//         addcategoryref.current.style.display = "flex";
//       } else {
//         addcategoryref.current.style.display = "none";
//       }

//       setCategories([...categories, [trimmedCategory, true]]);
//       setAddedCategory("");
//       setCategoryError("");
//     } else {
//       setCategoryError("Category already exists or is invalid");
//     }
//   };

//   const handleLabelClick = () => {
//     if (dateInputRef.current) {
//       dateInputRef.current.focus();
//       dateInputRef.current.click();
//     }
//   };

//   const showPreviousStage = () =>
//     setCurrentView((prev) => {
//       if (prev <= 1) return (prev = 1);
//       return prev - 1;
//     });

//   const showNextStage = (num) => setCurrentView(num);

//   // scroll page to the top when currentView changes
//   useEffect(() => {
//     if (scrollableRef.current) {
//       scrollableRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [currentView]);

//   const nextFunction = (updateNum) => {
//     if (Object.keys(errors.errors).length === 0 && currentView === updateNum) {
//       showNextStage(2);
//     }

//     if (Object.keys(errors.errors2).length === 0 && currentView === updateNum) {
//       showNextStage(3);
//       return;
//     }
//   };

//   // form validation functions
//   const { handleChange, handleSubmit, values, errors } = useForm(
//     nextFunction,
//     validate
//   );

//   return (
//     <section
//       className="upload_svg_cover min-h-[100vh] relative bg-[#FFFFF0]"
//       ref={scrollableRef}
//     >
//       <div className="bottom_cover pt-10 pb-16 w-[90%] m-auto bg-transparent min-h-screen z-50">
//         <h1 className="text-[3rem] text-[#FFFFF0]">New Presentation</h1>
//         <hr />
//         <div className="form_tracker_wrapper w-full flex justify-center mb-20">
//           {/* Note: true simply means all inputs for that view is
//                     met("not empty and valid") you can use required. first
//                     stage need not have, by default it is what it is 👀🥂 */}
//           <span className="active !block text-center w-[calc(100%/4)] relative">
//             <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
//               1
//             </span>
//             <span className="!block w-full text-[.5rem] text-center text-white">
//               Upload <br />
//               Presentation
//             </span>
//           </span>
//           <span
//             className={`${(currentView === 2 || currentView === 3) & true ? "active" : ""} !block text-center w-[calc(100%/4)] relative`}
//           >
//             <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
//               2
//             </span>
//             <span className="!block w-full text-[.5rem] text-center text-white">
//               Presenter's Information <br />
//               and Time of Presentation
//             </span>
//           </span>
//           <span
//             className={`${(currentView === 3) & true ? "active" : ""} !block text-center w-[calc(100%/4)] relative`}
//           >
//             <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">
//               3
//             </span>
//             <span className="!block w-full text-[.5rem] text-center text-white">
//               Preview
//             </span>
//           </span>
//         </div>
//         <form className="w-full min-h-screen bg-[#FFFFF0] shadow-md relative py-20">
//           <span className="absolute top-0 left-0 bg-[#FFFFF0] text-[#ffa500] block w-fit p-4 border-r-[2px] border-b-[2px] border-black text-xl font-medium">
//             Upload File
//           </span>
//           {/* first stage elements */}
//           <div
//             className={`w-full h-fit ${currentView === 1 ? "block" : "hidden"}`}
//           >
//             {/* first stage 🐱‍👤😒 upload el onNext remove */}
//             <div
//               className={`w-[90%] h-[15rem] m-auto ${errors.errors?.file ? "bg-[red]" : "bg-black"} border-[3px] !border-[#FFFFF0] border-dashed before:block before:w-full relative before:h-full before:bg-[#FFFFF0]  before:absolute before:top-0 before:left-0 before:pointer-events-none`}
//             >
//               <input
//                 type="file"
//                 name="file"
//                 onChange={handleChange}
//                 accept=".ppt, .pptx, .pot, .pps, .pps, .potx, .ppsx, .ppam, .pptm, .potm, .ppsm"
//                 multiple={false}
//                 className="block w-full h-full bg-[red] cursor-pointer"
//               />
//               <div className="flex flex-col gap-2 justify-center items-center w-full h-full bg-[rgba(255,165,0,0.3)]  absolute top-0 left-0 pointer-events-none">
//                 <img
//                   src={img_feather}
//                   alt={img_feather}
//                   className="block w-16 aspect-square"
//                 />
//                 <span className="w-fit h-fit text-black">
//                   Drop your file in here
//                 </span>
//                 <span className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full">
//                   Browse...
//                 </span>
//               </div>
//               {errors.errors?.file && (
//                 <p className="text-[red]">{errors.errors?.file}</p>
//               )}
//             </div>

//             {/* first stage 🐱‍👤😒 loading animation onNext remain at top */}
//             {values.file && !errors.errors?.file && (
//               <div className="w-[70%] m-auto my-6 flex justify-between items-center">
//                 <span className="block w-fit h-fit">
//                   <img
//                     src={upload_progress_svg}
//                     alt={upload_progress_svg}
//                     className="block w-32 aspect-square contrast-200"
//                   />
//                 </span>
//                 <div className="w-[calc(100%-8rem)] ">
//                   <div className="text-center relative">
//                     <p className="text-[#ffa500] text-[1.2rem] font-light italic">
//                       {`${values.file.name} Uploading...`}
//                     </p>
//                     <span className="block w-fit h-fit text-[#ffa500] text-[0.8rem] absolute left-auto right-0 top-[50%] translate-y-[-50%]">
//                       3500kbs
//                     </span>
//                   </div>
//                   <div className="w-full relative mt-4 p-[.15rem] rounded-full border-[2px] border-[#80808092] before:block before:w-[80%] before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-[#ffa500]"></div>
//                 </div>
//               </div>
//             )}
//             {/* first stage 🐱‍👤😒 onNext remove */}
//             <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
//               <label htmlFor="title" className="block mb-2">
//                 <sup className="w-full text-xl font-bold">*</sup>Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={values.title}
//                 onChange={handleChange}
//                 className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.title ? "border border-[red] outline-offset-2" : "border-none"}`}
//               />
//               {errors.errors?.title && (
//                 <p className="text-[red]">{errors.errors.title}</p>
//               )}
//             </div>
//             {/* first stage 🐱‍👤😒 onNext remove */}
//             <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
//               <label htmlFor="textarea" className="block mb-2">
//                 <sup className="w-full text-xl font-bold">*</sup>Description
//               </label>
//               <textarea
//                 id="textarea"
//                 className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.description ? "border border-[red] outline-offset-2" : "border-none"}`}
//                 rows="5"
//                 cols="50"
//                 name="description"
//                 value={values.description}
//                 onChange={handleChange}
//               ></textarea>
//               {errors.errors?.description && (
//                 <p className="text-[red]">{errors.errors.description}</p>
//               )}
//             </div>
//             {/* first stage 🐱‍👤😒 onNext remove */}
//             <div className="flex justify-between w-[90%] m-auto">
//               <div className="w-[48%] h-fit mt-6 text-lg text-black">
//                 <label htmlFor="publicSelector" className="block mb-2">
//                   <sup className="w-full text-xl font-bold">*</sup>Privacy
//                 </label>
//                 <select
//                   name="privacy"
//                   id="publicSelector"
//                   onChange={handleChange}
//                   className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.privacy ? "border border-[red] outline-offset-2" : "border-none"}`}
//                 >
//                   <option value="public">Public</option>
//                   <option value="private">Private</option>
//                   <option value="temprary">Temprary</option>
//                 </select>
//                 {errors.errors?.privacy && (
//                   <p className="text-[red]">{errors.errors.privacy}</p>
//                 )}
//               </div>

//               <div className="w-[48%] h-fit mt-6 text-lg text-black">
//                 <label htmlFor="downloadSelector" className="block mb-2">
//                   <sup className="w-full text-xl font-bold">*</sup>Downloadable
//                 </label>
//                 <select
//                   name="downloadable"
//                   id="downloadSelector"
//                   onChange={handleChange}
//                   className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors?.downloadable ? "border border-[red] outline-offset-2" : "border-none"}`}
//                 >
//                   <option value={true}>Yes</option>
//                   <option value={false}>No</option>
//                 </select>
//                 {errors.errors?.downloadable && (
//                   <p className="text-[red]">{errors.errors.downloadable}</p>
//                 )}
//               </div>
//             </div>
//             {/* first stage 🐱‍👤😒 onNext remove */}
//             <div className="flex justify-between w-[90%] m-auto">
//               <div className="w-[48%] mr-auto flex flex-col justify-center _items-center h-fit mt-6 text-lg text-black">
//                 <div className="w-full relative">
//                   <label htmlFor="publicSelector" className="block mb-2">
//                     <sup className="w-full text-xl font-bold">*</sup>Category
//                   </label>
//                   <div
//                     className={`bg-white h-fit justify-between items-center overflow-hidden flex w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md ${categoryError || errors.errors?.category ? "border border-[red] outline-offset-2" : "border-none"}`}
//                   >
//                     <select
//                       name="category"
//                       title="category"
//                       onChange={handleChange}
//                       id="publicSelector"
//                       className="block w-[68%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-8"
//                     >
//                       <option value="" className="text-[gray]">
//                         Choose a category
//                       </option>

//                       <>
//                         {categories.map((category, i) => (
//                           <option
//                             value={category[0]}
//                             selected={category[1]}
//                             key={i}
//                           >
//                             {category[0]}
//                           </option>
//                         ))}
//                       </>
//                     </select>

//                     <div
//                       onClick={addCategory}
//                       className="max-w-[30%] flex gap-1 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md cursor-pointer"
//                     >
//                       <img
//                         src={img_plus}
//                         alt={img_plus}
//                         className="block w-2 h-2 scale-150"
//                       />
//                       <span className="text-white text-[0.9rem] block w-fit h-fit italic">
//                         Create New
//                       </span>
//                     </div>
//                   </div>
//                   <div
//                     ref={addcategoryref}
//                     className="hidden bg-white h-fit justify-between items-center overflow-hidden w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md transition-all mt-[20px]"
//                   >
//                     <input
//                       type="text"
//                       id="title"
//                       value={addedCategory}
//                       onChange={(e) => setAddedCategory(e.target.value)}
//                       className="block w-[77%] p-2 indent-8 border-2 border-black border-r-0 rounded-md"
//                       placeholder="ADD CATEGORY"
//                     />

//                     <div
//                       onClick={newCategory}
//                       className="w-[23%] flex gap-1 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md cursor-pointer"
//                     >
//                       <span className="text-white text-[0.9rem] block w-fit h-fit italic">
//                         Add
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {categoryError ? (
//                   <p className="text-[red]">{categoryError}</p>
//                 ) : (
//                   errors.errors?.category && (
//                     <p className="text-[red]">{errors.errors.category}</p>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* first stage second 🐱‍👤😒 loading animation onNext remain at top */}
//           {values.file && !errors.errors.file && (
//             <div
//               className={`w-[70%] ${currentView === 2 ? "flex" : "hidden"} m-auto my-6 justify-between items-center`}
//             >
//               <span className="block w-fit h-fit">
//                 <img
//                   src={upload_progress_svg}
//                   alt={upload_progress_svg}
//                   className="block w-32 aspect-square contrast-200"
//                 />
//               </span>
//               <div className="w-[calc(100%-8rem)] ">
//                 <div className="text-center relative">
//                   <p className="text-[#ffa500] text-[1.2rem] font-light italic">
//                     {`${values.file.name} Uploading...`}
//                   </p>
//                   <span className="block w-fit h-fit text-[#ffa500] text-[0.8rem] absolute left-auto right-0 top-[50%] translate-y-[-50%]">
//                     3500kbs
//                   </span>
//                 </div>
//                 <div className="w-full relative mt-4 p-[.15rem] rounded-full border-[2px] border-[#80808092] before:block before:w-[80%] before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-[#ffa500]"></div>
//               </div>
//             </div>
//           )}
//           {/* Second stage show els 👀👀 */}
//           <div
//             className={`w-full h-fit ${currentView === 2 ? "block" : "hidden"}`}
//           >
//             {/* first stage 🐱‍👤😒 onNext remove */}
//             <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
//               <label htmlFor="name" className="block mb-2">
//                 <sup className="w-full text-xl font-bold">*</sup>Presenter's
//                 Name
//               </label>
//               <input
//                 type="text"
//                 value={values.name}
//                 onChange={handleChange}
//                 name="name"
//                 id="name"
//                 className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors2?.name ? "border border-[red] outline-offset-2" : "border-none"}`}
//               />
//               {errors.errors2?.name && (
//                 <p className="text-[red]">{errors.errors2.name}</p>
//               )}
//             </div>
//             {/* first stage 🐱‍👤😒 onNext remove */}
//             <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
//               <label htmlFor="BioOptional" className="block mb-2">
//                 <sup className="w-full text-xl font-bold"></sup>Bio (Optional)
//               </label>
//               <textarea
//                 id="BioOptional"
//                 className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors2?.bio ? "border border-[red] outline-offset-2" : "border-none"}`}
//                 rows="5"
//                 cols="50"
//                 name="bio"
//                 onChange={handleChange}
//                 value={values.bio}
//               ></textarea>
//               {errors.errors2?.bio && (
//                 <p className="text-[red]">{errors.errors2.bio}</p>
//               )}
//             </div>
//             {/* first stage 🐱‍👤😒 onNext remove */}
//             <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
//               <label htmlFor="title" className="block mb-2">
//                 <sup className="w-full text-xl font-bold"></sup>Social Media
//                 Link (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="social"
//                 onChange={handleChange}
//                 value={values.social}
//                 className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.errors2?.social ? "border border-[red] outline-offset-2" : "border-none"}`}
//               />
//               {errors.errors2?.social && (
//                 <p className="text-[red]">{errors.errors2.social}</p>
//               )}
//             </div>
//             {/* time of presentation */}
//             <span className="bg-[#FFFFF0] text-[#ffa500] w-fit p-4 mt-8 border-[2px] border-black text-xl font-medium flex justify-between items-center">
//               Time of Presentation
//               <div className="ml-[20px] flex items-center justify-center">
//                 <input
//                   type="checkbox"
//                   id="switch"
//                   name="toggle"
//                   className="toggle"
//                   onChange={(event) => {
//                     setToggle(!toggle);
//                     handleChange(event);
//                   }}
//                 />
//                 <label for="switch" className="toggle__label">
//                   Toggle
//                 </label>
//               </div>
//             </span>
//             {/* time constants for presentaions */}
//             {toggle && (
//               <div className="flex justify-between w-[90%] m-auto">
//                 <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//                   <div className="w-full relative">
//                     <label htmlFor="DateSelectionID" className="block mb-2">
//                       <span className="w-full text-xl font-bold">*</span>Date
//                       Selection
//                     </label>
//                     <div
//                       className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-2 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.date ? "border border-[red] outline-offset-2" : "border-none"}`}
//                     >
//                       <input
//                         type="date"
//                         ref={dateInputRef}
//                         name=""
//                         id="DateSelectionID"
//                         onChange={handleChange}
//                         value={() => (!values.toggle ? "" : values.date)}
//                         className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//                       />
//                       <label
//                         htmlFor="DateSelectionID"
//                         onClick={handleLabelClick}
//                         className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md"
//                       >
//                         <img
//                           src={Icon_metro_calendar}
//                           alt={Icon_metro_calendar}
//                           className="block w-4 h-4 scale-150 _aspect-square"
//                         />
//                       </label>
//                     </div>
//                     {errors.errors2?.date && (
//                       <p className="text-[red]">{errors.errors2.date}</p>
//                     )}
//                   </div>
//                 </div>
//                 {/* 2 */}
//                 <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//                   <div className="w-full relative">
//                     <label htmlFor="StartTime" className="block mb-2">
//                       <span className="w-full text-xl font-bold">*</span>Start
//                       Time
//                     </label>
//                     <div
//                       className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-2 focus:outline focus:outline-[1px] shadow- ${errors.errors2?.startTime ? "border border-[red] outline-offset-2" : "border-none"}`}
//                     >
//                       <input
//                         type="time"
//                         name=""
//                         id="StartTime"
//                         onChange={handleChange}
//                         value={() => (!values.toggle ? "" : values.startTime)}
//                         className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//                       />
//                       <label
//                         htmlFor="StartTime"
//                         className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md"
//                       >
//                         <img
//                           src={Icon_awesome_clock}
//                           alt={Icon_awesome_clock}
//                           className="block w-4 h-4 scale-150 _aspect-square"
//                         />
//                       </label>
//                     </div>
//                     {errors.errors2?.startTime && (
//                       <p className="text-[red]">{errors.errors2.startTime}</p>
//                     )}
//                   </div>
//                 </div>
//                 {/* 3 */}
//                 <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//                   <div className="w-full relative">
//                     <label htmlFor="EndTime" className="block mb-2">
//                       <span className="w-full text-xl font-bold"></span>End Time
//                       (Optional)
//                     </label>
//                     <div
//                       className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-2 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.endTime ? "border border-[red] outline-offset-2" : "border-none"}`}
//                     >
//                       <input
//                         type="time"
//                         name=""
//                         id="EndTime"
//                         onChange={handleChange}
//                         value={() => (!values.toggle ? "" : values.endTime)}
//                         className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//                       />
//                       <label
//                         htmlFor="EndTime"
//                         className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md"
//                       >
//                         <img
//                           src={Icon_awesome_clock}
//                           alt={Icon_awesome_clock}
//                           className="block w-4 h-4 scale-150 _aspect-square"
//                         />
//                       </label>
//                     </div>
//                     {errors.errors2?.endTime && (
//                       <p className="text-[red]">{errors.errors2.endTime}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {/* end */}
//           </div>
//           {/* Third stage show els 👀👀 */}
//           <div
//             className={`w-full h-full ${currentView === 3 ? "flex" : "hidden"} justify-center items-center`}
//           >
//             <h1 className="text-[3rem] font-black text-black">
//               Coming Soon pls🐱‍🏍
//             </h1>
//           </div>
//         </form>
//         <div className="flex justify-between items-center mt-6">
//           <button
//             className={`${currentView === 1 ? "bg-[#3d3535bf] text-white !cursor-not-allowed" : "border border-black pointer-events-auto"} text-black text-[1.5rem] p-2 rounded-full w-[25%]`}
//             onClick={showPreviousStage}
//           >
//             Back
//           </button>

//           <button
//             className={`${currentView === 3 ? "bg-[#808080bf] !cursor-not-allowed" : "bg-[Black] pointer-events-auto"} text-white text-[1.5rem] p-2 border-none rounded-full w-[25%]`}
//             onClick={handleSubmit}
//           >
//             {currentView === 3 ? "Submit" : "Next"}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////

// // testing of native date picker
// import NativeDatepicker from "./reactNativeDatePicker";
// import React, { useState } from "react";

// const DateTest = () => {
//   const [date, setDate] = useState("2024-06-08");

//   const handleChange = (newValue) => {
//     setDate(newValue);
//   };
//   console.log("Testing date: ", date);

//   return (
//     <div>
//       <h1>Choose a Date</h1>
//       {/* <NativeDatepicker value={date} onChange={handleChange} /> */}
//       <NativeDatepicker
//         value={date}
//         onChange={(newValue) => setDate(newValue)}
//       />
//     </div>
//   );
// };

// export default DateTest;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////

// /* global define */
// (function nativeDatepickerFactory1(factory) {
//   if (typeof exports === 'object' && typeof module === 'object') {
//     module.exports = factory();
//   } else if (typeof define === 'function' && define.amd) {
//     define(factory);
//   } else {
//     window['NativeDatepicker'] = factory();
//   }
// })(function nativeDatepickerFactory2() {
//   var classNames = {
//     wrapper: 'NativeDatepicker',
//     input: 'NativeDatepicker__input',
//   };

//   var dateRegex = /\d{4}-\d{2}-\d{2}/;

//   function NativeDatepicker(options) {
//     this.options = Object.assign(
//       {
//         win: typeof window !== 'undefined' ? window : undefined,
//         existingElement: null,
//         onChange: function defaultOnChange() {},
//         initialValue: '',
//       },
//       options
//     );

//     this.addStylesheet();
//     this.buildDom();
//     this.setValue(this.options.initialValue);
//   }

//   NativeDatepicker.prototype.setValue = function setValue(fullString) {
//     var match = fullString.match(dateRegex);
//     if (match) {
//       this.fullValue = fullString;
//       this.dateValue = match[0];
//       this.dateInputElement.value = match[0];
//     }
//   };

//   NativeDatepicker.prototype.buildDom = function buildDom() {
//     // DOM structure:
//     //   <span class="NativeDatepicker">
//     //     <input type="date" class="NativeDatepicker__input">
//     //   </span>

//     var element =
//       this.options.existingElement ||
//       this.options.win.document.createElement('span');
//     element.classList.add(classNames.wrapper);
//     this.element = element;

//     if (!this.isSupported()) {
//       // Not via CSS class because we don't want to mess with
//       // CSS-set display values, to not mess up user styles
//       element.style.display = 'none';
//     }

//     var dateInputElement = this.options.win.document.createElement('input');
//     dateInputElement.type = 'date';
//     dateInputElement.classList.add(classNames.input);
//     element.appendChild(dateInputElement);
//     this.dateInputElement = dateInputElement;

//     var self = this;
//     dateInputElement.addEventListener(
//       'change',
//       function onNativeDatepickerChange() {
//         var newValue = self.fullValue.replace(
//           dateRegex,
//           dateInputElement.value
//         );
//         // Regex didn't match, fallback to setting the entire value
//         if (!newValue.includes(dateInputElement.value)) {
//           newValue = dateInputElement.value;
//         }
//         dateInputElement.value = self.dateValue;
//         self.options.onChange(newValue);
//       }
//     );
//   };

//   NativeDatepicker.prototype.addStylesheet = function addStylesheet() {
//     var styleId = 'NativeDatepickerStyles';
//     if (!this.options.win.document.querySelector('style#' + styleId)) {
//       var style = this.options.win.document.createElement('style');
//       style.id = styleId;
//       style.textContent =
//         '.' +
//         classNames.wrapper +
//         ' {' +
//         '  display: inline-block;' +
//         '  position: relative;' +
//         '}' +
//         '.' +
//         classNames.input +
//         ' {' +
//         '  position: absolute;' +
//         '  left: 0;' +
//         '  top: 0;' +
//         '  width: 100%;' +
//         '  height: 100%;' +
//         '  opacity: 0;' +
//         '  cursor: pointer;' +
//         '  box-sizing: border-box;' +
//         '}' +
//         '.' +
//         classNames.input +
//         '::-webkit-calendar-picker-indicator {' +
//         '  position: absolute;' +
//         '  left: 0;' +
//         '  top: 0;' +
//         '  width: 100%;' +
//         '  height: 100%;' +
//         '  margin: 0;' +
//         '  padding: 0;' +
//         '  cursor: pointer;' +
//         '}';
//       this.options.win.document.head.appendChild(style);
//     }
//   };

//   NativeDatepicker.prototype.isSupported = function isSupported() {
//     var input = this.options.win.document.createElement('input');
//     input.type = 'date';
//     input.value = 'invalid date value';
//     return input.value !== 'invalid date value';
//   };

//   return NativeDatepicker;
// });
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useRef, useEffect } from "react";
// import { Calendar } from "primereact/calendar";
// import Icon_metro_calendar from "/Icon-metro-calendar.svg";
// import Icon_awesome_clock from "/Icon-awesome-clock.svg";
// import NativeDatepicker from "./reactNativeDatePicker";

// const DatePicker = ({ handleChange, values, errors }) => {
//   const getCurrentDate = () => {
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     const mm = String(today.getMonth() + 1).padStart(2, "0");
//     const dd = String(today.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };
//   const [date, setDate] = useState(getCurrentDate);
//   const nativeDatepickerRef = useRef(null);

//   const handleChangeTwo = (event) => {
//     const newValue = event.target.value;
//     setDate(newValue);
//   };

//   useEffect(() => {
//     if (nativeDatepickerRef.current) {
//       nativeDatepickerRef.current.setValue(date);
//     }
//   }, [date]);

//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="DateSelectionID" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>Date Selection
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.date ? "border border-[red] outline-offset-2" : "border-none"}`}
//         >
//           <input
//             type="date"
//             name=""
//             id="DateSelectionID"
//             value={date}
//             onChange={handleChange}
//             // value={() => (!values.toggle ? "" : values.date)}
//             min={getCurrentDate()}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             htmlFor="DateSelectionIDTwo"
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <NativeDatepicker
//               id="DateSelectionIDTwo"
//               ref={nativeDatepickerRef}
//               value={date}
//               onChange={(newValue) => setDate(newValue)}
//               min={getCurrentDate()}
//             />
//           </label>
//         </div>
//         {errors.errors2?.date && (
//           <p className="text-[red]">{errors.errors2.date}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const StartTimePicker = ({ handleChange, values, errors }) => {
//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="StartTime" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>Start Time
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow- ${errors.errors2?.startTime ? "border border-[red] outline-offset-2" : "border-none"}`}
//         >
//           <input
//             type="time"
//             name=""
//             id="StartTime"
//             onChange={handleChange}
//             value={() => (!values.toggle ? "" : values.startTime)}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             htmlFor="StartTime"
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <img
//               src={Icon_awesome_clock}
//               alt={Icon_awesome_clock}
//               className="block w-4 h-4 scale-150 _aspect-square"
//             />
//           </label>
//         </div>
//         {errors.errors2?.startTime && (
//           <p className="text-[red]">{errors.errors2.startTime}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const EndTimePicker = ({ handleChange, values, errors }) => {
//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="EndTime" className="block mb-2">
//           <span className="w-full text-xl font-bold"></span>End Time (Optional)
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.endTime ? "border border-[red] outline-offset-2" : "border-none"}`}
//         >
//           <input
//             type="time"
//             name=""
//             id="EndTime"
//             onChange={handleChange}
//             value={() => (!values.toggle ? "" : values.endTime)}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             htmlFor="EndTime"
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <img
//               src={Icon_awesome_clock}
//               alt={Icon_awesome_clock}
//               className="block w-4 h-4 scale-150 _aspect-square"
//             />
//           </label>
//         </div>
//         {errors.errors2?.endTime && (
//           <p className="text-[red]">{errors.errors2.endTime}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export { DatePicker, StartTimePicker, EndTimePicker };

// const DatePicker = ({ handleChange, values, errors }) => {
//   const getCurrentDate = () => {
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     const mm = String(today.getMonth() + 1).padStart(2, "0");
//     const dd = String(today.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };

//   const [date, setDate] = useState(getCurrentDate());
//   const nativeDatepickerRef = useRef(null);

//   useEffect(() => {
//     if (nativeDatepickerRef.current) {
//       nativeDatepickerRef.current.setValue(date);
//     }
//   }, [date]);

//   const handleInputChange = (event) => {
//     const newValue = event.target.value;
//     setDate(newValue);
//     handleChange({ target: { name: "date", value: newValue } });
//   };

//   const handleDatePickerChange = (newValue) => {
//     setDate(newValue);
//     handleChange({ target: { name: "date", value: newValue } });
//   };

//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="DateSelectionID" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>Date Selection
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.date ? "border border-[red] outline-offset-2" : "border-none"}`}
//         >
//           <input
//             type="date"
//             name="date"
//             id="DateSelectionID"
//             value={date}
//             onChange={handleInputChange}
//             min={getCurrentDate()}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             htmlFor="DateSelectionIDTwo"
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <NativeDatepicker
//               id="DateSelectionIDTwo"
//               ref={nativeDatepickerRef}
//               value={date}
//               onChange={handleDatePickerChange}
//               min={getCurrentDate()}//no need cuz its not defined too, internally to be handled 🤦‍♀️ yet..
//             />
//           </label>
//         </div>
//         {errors.errors2?.date && (
//           <p className="text-[red]">{errors.errors2.date}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// import { useState, useEffect, useRef } from "react";

// const useForm = (callback, validate) => {
//   const [values, setValues] = useState({
//     toggle: false,
//     file: null,
//     downloadable: "true",
//     privacy: "public",
//     date: "" // Add date to the initial state
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const isInitialRender = useRef(true);

//   useEffect(() => {
//     if (isInitialRender.current) {
//       isInitialRender.current = false;
//       return; // Skip the effect on the initial render
//     }

//     if (Object.keys({ ...errors.errors }).length === 0 && submitting) {
//       callback(1);
//       setSubmitting(false); // Reset submitting after callback
//     }

//     if (Object.keys({ ...errors.errors2 }).length === 0 && submitting) {
//       callback(2);
//       setSubmitting(false); // Reset submitting after callback
//     }
//   }, [errors, callback, submitting]);

//   const handleSubmit = (event) => {
//     if (event) event.preventDefault();

//     const validationErrors = validate(values);
//     setErrors(validationErrors);

//     if (
//       Object.keys(validationErrors.errors).length === 0 ||
//       Object.keys(validationErrors.errors2).length === 0
//     ) {
//       setSubmitting(true);
//     }
//   };

//   const handleChange = (event, customError = null) => {
//     const { name, value, files, checked } = event.target;

//     setValues((prevValues) => ({
//       ...prevValues,
//       [name]: files ? files[0] : value,
//     }));

//     if (checked !== undefined)
//       setValues((prevValues) => ({ ...prevValues, toggle: checked }));

//     // Custom validation error handling for the date field
//     if (customError) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         errors2: { ...prevErrors.errors2, [name]: customError }
//       }));
//     } else {
//       // Clear the error if the date is valid
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         errors2: { ...prevErrors.errors2, [name]: "" }
//       }));
//     }

//     if (
//       (errors.errors && errors.errors[event.target.name] && name !== "file") ||
//       (errors.errors2 && errors.errors2[event.target.name] && name !== "file")
//     ) {
//       setErrors(validate(values));
//     }
//   };

//   return {
//     handleChange,
//     handleSubmit,
//     values,
//     errors
//   };
// };

// export default useForm;


// const validate = (values) => {
//     const errors = {};
//     const errors2 = {};

//     // Example validation logic for the date field
//     const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
//     if (values.date && values.date < currentDate) {
//       errors2.date = "Date cannot be in the past";
//     }

//     // Other validation logic...

//     return { errors, errors2 };
//   };

//   export default validate;


//   import React, { useState, useRef, useEffect } from "react";
// import NativeDatepicker from "./reactNativeDatePicker";

// const DatePicker = ({ handleChange, values, errors }) => {
//   const getCurrentDate = () => {
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     const mm = String(today.getMonth() + 1).padStart(2, "0");
//     const dd = String(today.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };

//   const [date, setDate] = useState(getCurrentDate());
//   const nativeDatepickerRef = useRef(null);

//   useEffect(() => {
//     if (nativeDatepickerRef.current) {
//       nativeDatepickerRef.current.setValue(date);
//     }
//   }, [date]);

//   const handleInputChange = (event) => {
//     const newValue = event.target.value;
//     validateDate(newValue);
//   };

//   const handleDatePickerChange = (newValue) => {
//     validateDate(newValue);
//   };

//   const validateDate = (newValue) => {
//     const currentDate = getCurrentDate();
//     if (newValue < currentDate) {
//       handleChange({ target: { name: "date", value: newValue } }, "Date cannot be in the past");
//     } else {
//       setDate(newValue);
//       handleChange({ target: { name: "date", value: newValue } });
//     }
//   };

//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="DateSelectionID" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>Date Selection
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.date ? "border border-[red] outline-offset-2" : "border-none"}`}
//         >
//           <input
//             type="date"
//             name="date"
//             id="DateSelectionID"
//             value={date}
//             onChange={handleInputChange}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             htmlFor="DateSelectionIDTwo"
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <NativeDatepicker
//               id="DateSelectionIDTwo"
//               ref={nativeDatepickerRef}
//               value={date}
//               onChange={handleDatePickerChange}
//             />
//           </label>
//         </div>
//         {errors.errors2?.date && (
//           <p className="text-[red]">{errors.errors2.date}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DatePicker;



// ///////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////


import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import Icon_metro_calendar from "/Icon-metro-calendar.svg";
import Icon_awesome_clock from "/Icon-awesome-clock.svg";
import NativeDatepicker from "./reactNativeDatePicker";

const DatePicker = ({ handleChange, values, errors }) => {
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getCurrentDate());
  const nativeDatepickerRef = useRef(null);

  useEffect(() => {
    if (nativeDatepickerRef.current) {
      nativeDatepickerRef.current.setValue(date);
    }
  }, [date]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    validateDate(newValue);
  };

  const handleDatePickerChange = (newValue) => {
    validateDate(newValue);
  };

  const validateDate = (newValue) => {
    const currentDate = getCurrentDate();
    if (newValue < currentDate) {
      handleChange({ target: { name: "date", value: newValue } }, "Date cannot be in the past");
    } else {
      setDate(newValue);
      handleChange({ target: { name: "date", value: newValue } });
    }
  };

  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="DateSelectionID" className="block mb-2">
          <span className="w-full text-xl font-bold">*</span>Date Selection
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.date ? "border border-[red] outline-offset-2" : "border-none"}`}
        >
          <input
            type="date"
            name="date"
            id="DateSelectionID"
            value={date}
            onChange={handleInputChange}
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            htmlFor="DateSelectionIDTwo"
            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
          >
            <NativeDatepicker
              id="DateSelectionIDTwo"
              ref={nativeDatepickerRef}
              value={date}
              onChange={handleDatePickerChange}
            />
          </label>
        </div>
        {errors.errors2?.date && (
          <p className="text-[red]">{errors.errors2.date}</p>
        )}
      </div>
    </div>
  );
};

const StartTimePicker = ({ handleChange, values, errors }) => {
  const [timeValue, setTimeValue] = useState("");

  const handleClickStartTime = () => {
    const timeInput = document.getElementById("StartTime");
    if (timeInput) {
      if (timeInput.showPicker) {
        timeInput.showPicker();
      } else {
        timeInput.focus();
      }
    }
  };

  const handleTimeChange = (event) => {
    const newVal = event.target.value;
    setTimeValue(newVal);
  };

  console.log(timeValue);

  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="StartTime" className="block mb-2">
          <span className="w-full text-xl font-bold">*</span>Start Time
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow- ${errors.errors2?.startTime ? "border border-[red] outline-offset-2" : "border-none"}`}
        >
          <input
            // ref={inputRef}
            type="time"
            name=""
            id="StartTime"
            onChange={handleChange}
            value={handleTimeChange}
            // pattern="[0-9]{2}:[0-9]{2}"
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            type="button"
            aria-label="button"
            id="StartTime"
            htmlFor="StartTime"
            onClick={handleClickStartTime}
            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
          >
            <img
              src={Icon_awesome_clock}
              alt={Icon_awesome_clock}
              className="block w-4 h-4 scale-150 pointer-events-auto"
            />
          </label>
        </div>
        {errors.errors2?.startTime && (
          <p className="text-[red]">{errors.errors2.startTime}</p>
        )}
      </div>
    </div>
  );
};

const EndTimePicker = ({ handleChange, values, errors }) => {
  const [timeValue, setTimeValue] = useState("");

  const handleClickEndTime = () => {
    const timeInput = document.getElementById("StartTime");
    if (timeInput) {
      if (timeInput.showPicker) {
        timeInput.showPicker();
      } else {
        timeInput.focus();
      }
    }
  };

  const handleTimeChange = (event) => {
    const newVal = event.target.value;
    setTimeValue(newVal);
  };

  console.log(timeValue);

  return (
    <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
      <div className="w-full relative">
        <label htmlFor="EndTime" className="block mb-2">
          <span className="w-full text-xl font-bold"></span>End Time (Optional)
        </label>
        <div
          className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.endTime ? "border border-[red] outline-offset-2" : "border-none"}`}
        >
          <input
            type="time"
            name=""
            id="EndTime"
            onChange={handleChange}
            // value={() => (!values.toggle ? "" : values.endTime)}
            value={handleTimeChange}
            // pattern="[0-9]{2}:[0-9]{2}"
            className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
          />
          <label
            type="button"
            aria-label="button"
            id="EndTime"
            htmlFor="EndTime"
            onClick={handleClickEndTime}
            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
          >
            <img
              src={Icon_awesome_clock}
              alt={Icon_awesome_clock}
              className="block w-4 h-4 scale-150 pointer-events-auto"
            />
          </label>
        </div>
        {errors.errors2?.endTime && (
          <p className="text-[red]">{errors.errors2.endTime}</p>
        )}
      </div>
    </div>
  );
};

export { DatePicker, StartTimePicker, EndTimePicker };

// const StartTimePicker = ({ handleChange, values, errors }) => {
//   const [startTime, setStartTime] = useState("");

//   const handleClickStartTime = () => {
//     const timeInput = document.getElementById("StartTime");
//     if (timeInput) {
//       if (timeInput.showPicker) {
//         timeInput.showPicker();
//       } else {
//         timeInput.focus();
//       }
//     }
//   };

//   const handleStartTimeChange = (event) => {
//     const newVal = event.target.value;
//     setStartTime(newVal);
//     handleChange({ target: { name: "startTime", value: newVal } });
//   };

//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="StartTime" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>Start Time
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.startTime ? "border border-[red] outline-offset-2" : "border-none"}`}
//         >
//           <input
//             type="time"
//             id="StartTime"
//             value={startTime}
//             onChange={handleStartTimeChange}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             type="button"
//             aria-label="button"
//             htmlFor="StartTime"
//             onClick={handleClickStartTime}
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <img
//               src={Icon_awesome_clock}
//               alt="Clock Icon"
//               className="block w-4 h-4 scale-150 pointer-events-auto"
//             />
//           </label>
//         </div>
//         {errors.errors2?.startTime && (
//           <p className="text-[red]">{errors.errors2.startTime}</p>
//         )}
//       </div>
//     </div>
//   );
// };


// const EndTimePicker = ({ handleChange, values, errors }) => {
//   const [endTime, setEndTime] = useState("");

//   const handleClickEndTime = () => {
//     const timeInput = document.getElementById("EndTime");
//     if (timeInput) {
//       if (timeInput.showPicker) {
//         timeInput.showPicker();
//       } else {
//         timeInput.focus();
//       }
//     }
//   };

//   const handleEndTimeChange = (event) => {
//     const newVal = event.target.value;
//     setEndTime(newVal);
//     handleChange({ target: { name: "endTime", value: newVal } });
//   };

//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="EndTime" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>End Time (Optional)
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.endTime ? "border border-[red] outline-offset-2" : "border-none"}`}
//         >
//           <input
//             type="time"
//             id="EndTime"
//             value={endTime}
//             onChange={handleEndTimeChange}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             type="button"
//             aria-label="button"
//             htmlFor="EndTime"
//             onClick={handleClickEndTime}
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <img
//               src={Icon_awesome_clock}
//               alt="Clock Icon"
//               className="block w-4 h-4 scale-150 pointer-events-auto"
//             />
//           </label>
//         </div>
//         {errors.errors2?.endTime && (
//           <p className="text-[red]">{errors.errors2.endTime}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// ////////////////////////////////////////////////////////////////////////////

// const EndTimePicker = ({ handleChange, values, errors }) => {
//   const [endTime, setEndTime] = useState(values.endTime || "");
//   const endTimeRef = useRef(null);

//   useEffect(() => {
//     if (endTimeRef.current) {
//       endTimeRef.current.value = endTime;
//     }

//     if (values.toggle === false) {
//       setEndTime(null);
//     }
//   }, [endTime, values.toggle]);

//   const handleClickEndTime = () => {
//     const timeInput = endTimeRef.current;
//     if (timeInput) {
//       if (timeInput.showPicker) {
//         timeInput.showPicker();
//       } else {
//         timeInput.focus();
//       }
//     }
//   };

//   const handleEndTimeChange = (event) => {
//     const newVal = event.target.value;
//     setEndTime(newVal);
//     handleChange({ target: { name: "endTime", value: newVal } });
//   };

//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="EndTime" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>End Time (Optional)
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.endTime ? "border border-[red] outline-offset-2" : "border-none"
//             }`}
//         >
//           <input
//             type="time"
//             id="EndTime"
//             ref={endTimeRef}
//             value={endTime}
//             onChange={handleEndTimeChange}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             type="button"
//             aria-label="button"
//             htmlFor="EndTime"
//             onClick={handleClickEndTime}
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <img
//               src={Icon_awesome_clock}
//               alt="Clock Icon"
//               className="block w-4 h-4 scale-150 pointer-events-auto"
//             />
//           </label>
//         </div>
//         {errors.errors2?.endTime && (
//           <p className="text-[red]">{errors.errors2.endTime}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// //////////////////////////////////////////////////////////////////////


// const StartTimePicker = ({ handleChange, values, errors }) => {
//   const [startTime, setStartTime] = useState(values.startTime || "");
//   const startTimeRef = useRef(null);

//   useEffect(() => {
//     if (startTimeRef.current) {
//       startTimeRef.current.value = startTime;
//     }

//     if (values.toggle === false) {
//       setStartTime(null);
//     }
//   }, [startTime, values.toggle]);

//   const handleClickStartTime = () => {
//     const timeInput = startTimeRef.current;
//     if (timeInput) {
//       if (timeInput.showPicker) {
//         timeInput.showPicker();
//       } else {
//         timeInput.focus();
//       }
//     }
//   };

//   const handleStartTimeChange = (event) => {
//     const newVal = event.target.value;
//     setStartTime(newVal);
//     handleChange({ target: { name: "startTime", value: newVal } });
//   };

//   return (
//     <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
//       <div className="w-full relative">
//         <label htmlFor="StartTime" className="block mb-2">
//           <span className="w-full text-xl font-bold">*</span>Start Time
//         </label>
//         <div
//           className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-md ${errors.errors2?.startTime ? "border border-[red] outline-offset-2" : "border-none"
//             }`}
//         >
//           <input
//             type="time"
//             id="StartTime"
//             ref={startTimeRef}
//             value={startTime}
//             onChange={handleStartTimeChange}
//             className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
//           />
//           <label
//             type="button"
//             aria-label="button"
//             htmlFor="StartTime"
//             onClick={handleClickStartTime}
//             className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
//           >
//             <img
//               src={Icon_awesome_clock}
//               alt="Clock Icon"
//               className="block w-4 h-4 scale-150 pointer-events-auto"
//             />
//           </label>
//         </div>
//         {errors.errors2?.startTime && (
//           <p className="text-[red]">{errors.errors2.startTime}</p>
//         )}
//       </div>
//     </div>
//   );
// };



