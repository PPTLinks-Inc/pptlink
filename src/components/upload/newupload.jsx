import React, { useState, useRef, useEffect } from 'react';
import "../../assets/styles/general_css.css";
import img_feather from "/Icon-feather-upload-cloud.svg";
import img_plus from "/Icon-awesome-plus.png";
import upload_progress_svg from "/upload_progress_svg.svg";
import Icon_metro_calendar from "/Icon-metro-calendar.svg";
import Icon_awesome_clock from "/Icon-awesome-clock.svg";

export default function NewUploadPage() {
    const [currentView, setCurrentView] = useState(1);
    const addcategoryref = useRef(null);
    const dateInputRef = useRef(null);
    const scrollableRef = useRef(null)

    function addCategory() {
        if (addcategoryref.current.style.display === 'none') {
            addcategoryref.current.style.display = 'block';
        } else {
            addcategoryref.current.style.display = 'none';
        }
    }

    const handleLabelClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.focus();
            dateInputRef.current.click();
        }
    };

    const showPreviousStage = () => setCurrentView(prev => {
        console.log(prev)
        if (prev <= 1) return prev = 1;
        return (prev - 1);
    });

    const showNextStage = () => setCurrentView(prev => {
        console.log(prev)
        if (prev >= 3) return prev = 3;
        return (prev + 1);
    });

    // scroll page to the top when currentView changes 
    useEffect(() => {
        console.log('reached')
        window.scrollTo(0, 0);
    }, [currentView])

    // form validation functions 


    return (
        <section className="upload_svg_cover min-h-[100vh] relative bg-[#FFFFF0]" ref={scrollableRef}>
            <div className="bottom_cover pt-10 pb-16 w-[90%] m-auto bg-transparent min-h-screen z-50">
                <h1 className="text-[3rem] text-[#FFFFF0]">New Presentation</h1>
                <hr />
                <div className="form_tracker_wrapper w-full flex justify-center mb-20">
                    {/* Note: true simply means all inputs for that view is 
                    met("not empty and valid") you can use required. first 
                    stage need not have, by default it is what it is 👀🥂 */}
                    <span className="active !block text-center w-[calc(100%/4)] relative">
                        <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">1</span>
                        <span className="!block w-full text-[.5rem] text-center text-white">Upload <br />Presentation</span>
                    </span>
                    <span className={`${((currentView === 2 || currentView === 3) & true) ? "active" : ""} !block text-center w-[calc(100%/4)] relative`}>
                        <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">2</span>
                        <span className="!block w-full text-[.5rem] text-center text-white">Presenter's Information <br />and Time of Presentation</span>
                    </span>
                    <span className={`${(currentView === 3 & true) ? "active" : ""} !block text-center w-[calc(100%/4)] relative`}>
                        <span className="flex justify-center items-center w-[2rem] m-auto aspect-square text-center rounded-[1rem] my-4 bg-white text-black text-[.9rem]">3</span>
                        <span className="!block w-full text-[.5rem] text-center text-white">Preview</span>
                    </span>
                </div>
                <form className="addshadow w-full min-h-screen bg-[#FFFFF0] _shadow-md relative py-20">
                    <span className="absolute top-0 left-0 bg-[#FFFFF0] text-[#ffa500] block w-fit p-4 border-r-[2px] border-b-[2px] border-black text-xl font-medium">
                        {currentView === 1 ? "Upload File" : currentView === 2 ? "Presenter's Information" : currentView === 3 ? "Preview" : ""}
                    </span>
                    {/* first stage elements */}
                    <div className={`w-full h-fit ${currentView === 1 ? "block" : "hidden"}`}>
                        {/* first stage 🐱‍👤😒 upload el onNext remove */}
                        <div className="w-[90%] h-[15rem] m-auto bg-black border-[3px] !border-[#FFFFF0] border-dashed before:block before:w-full relative before:h-full before:bg-[#FFFFF0]  before:absolute before:top-0 before:left-0 before:pointer-events-none">
                            <input type="file" accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="block w-full h-full bg-[red] cursor-pointer" />
                            <div className="flex flex-col gap-2 justify-center items-center  w-full h-full bg-[rgba(255,165,0,0.3)]  absolute top-0 left-0 pointer-events-none">
                                <img src={img_feather} alt={img_feather} className="block w-16 aspect-square" />
                                <span className="w-fit h-fit text-black">Drop your file in here</span>
                                <span className="w-fit h-fit text-black bg-[#ffa500] py-2 px-8 rounded-full">Browse...</span>
                            </div>
                            <p className='text-[red]'>Error message</p>
                        </div>
                        {/* first stage 🐱‍👤😒 loading animation onNext remain at top */}
                        <div className='w-[70%] m-auto my-6 flex justify-between items-center'>
                            <span className='block w-fit h-fit'>
                                <img src={upload_progress_svg} alt={upload_progress_svg} className='block w-32 aspect-square contrast-200' />
                            </span>
                            <div className='w-[calc(100%-8rem)] '>
                                <div className='text-center relative'>
                                    <p className='text-[#ffa500] text-[1.2rem] font-light italic'>File Uploading...</p>
                                    <span className='block w-fit h-fit text-[#ffa500] text-[0.8rem] absolute left-auto right-0 top-[50%] translate-y-[-50%]'>3500kbs</span>
                                </div>
                                <div className='w-full relative mt-4 p-[.15rem] rounded-full border-[2px] border-[#80808092] before:block before:w-[80%] before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-[#ffa500]'></div>
                            </div>
                        </div>
                        {/* first stage 🐱‍👤😒 onNext remove */}
                        <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
                            <label htmlFor="title" className="block mb-2"><sup className="w-full text-xl font-bold">*</sup>Title</label>
                            <input type="text" id="title" className="block w-full p-2 border-2 border-black rounded-md" />
                            <p className='text-[red]'>Error message</p>
                        </div>
                        {/* first stage 🐱‍👤😒 onNext remove */}
                        <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
                            <label htmlFor="textarea" className="block mb-2"><sup className="w-full text-xl font-bold">*</sup>Description</label>
                            <textarea id="textarea" className="block w-full p-2 border-2 border-black rounded-md" rows="5" cols="50"></textarea>
                            <p className='text-[red]'>Error message</p>
                        </div>
                        {/* first stage 🐱‍👤😒 onNext remove */}
                        <div className="flex justify-between w-[90%] m-auto">
                            <div className="w-[48%] h-fit mt-6 text-lg text-black">
                                <label htmlFor="publicSelector" className="block mb-2"><sup className="w-full text-xl font-bold">*</sup>Privacy</label>
                                <select name="" id="publicSelector" className="block w-full p-2 border-2 border-black rounded-md">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="temprary">Temprary</option>
                                </select>
                                <p className='text-[red]'>Error message</p>
                            </div>
                            <div className="w-[48%] h-fit mt-6 text-lg text-black">
                                <label htmlFor="downloadSelector" className="block mb-2"><sup className="w-full text-xl font-bold">*</sup>Downloadable</label>
                                <select name="" id="downloadSelector" className="block w-full p-2 border-2 border-black rounded-md">
                                    <option value="public">Yes</option>
                                    <option value="private">No</option>
                                </select>
                                <p className='text-[red]'>Error message</p>
                            </div>
                        </div>
                        {/* first stage 🐱‍👤😒 onNext remove */}
                        <div className="flex justify-between w-[90%] m-auto">
                            <div className="w-[48%] mr-auto flex _justify-center items-center h-fit mt-6 text-lg text-black">
                                <div className="w-full relative">
                                    <label htmlFor="publicSelector" className="block mb-2"><sup className="w-full text-xl font-bold">*</sup>Category</label>
                                    <div className="bg-white w-full h-fit flex justify-between items-center border-2 border-black rounded-md overflow-hidden">
                                        <select name="" id="publicSelector" className="block w-[68%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-8">
                                            <option value="public" className="text-[gray]">Uncategorized</option>
                                            <option value="private">Categorized 1</option>
                                            <option value="temprary">Categorized 2</option>
                                            <option value="temprary">Categorized 3</option>
                                        </select>
                                        <div onClick={addCategory} className="w-[30%] flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md">
                                            <img src={img_plus} alt={img_plus} className="block w-4 h-4 scale-150 _aspect-square" />
                                            <span className="text-white text-[0.9rem] block w-fit h-fit italic">Create New</span>
                                        </div>
                                    </div>
                                    <div ref={addcategoryref} className="hidden w-[100%] h-fit m-auto mt-2 text-lg text-black absolute transition-all">
                                        <input type="text" id="title" className="block w-full p-2 indent-8 border-2 border-black rounded-md" placeholder="ADD CATEGORY" />
                                    </div>
                                    <p className='text-[red]'>Error message</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* first stage second 🐱‍👤😒 loading animation onNext remain at top */}
                    <div className={`w-[70%] ${(currentView === 2 || currentView === 3) ? "flex" : "hidden"} m-auto my-6 justify-between items-center`}>
                        <span className='block w-fit h-fit'>
                            <img src={upload_progress_svg} alt={upload_progress_svg} className='block w-32 aspect-square contrast-200' />
                        </span>
                        <div className='w-[calc(100%-8rem)] '>
                            <div className='text-center relative'>
                                <p className='text-[#ffa500] text-[1.2rem] font-light italic'>File Uploading...</p>
                                <span className='block w-fit h-fit text-[#ffa500] text-[0.8rem] absolute left-auto right-0 top-[50%] translate-y-[-50%]'>3500kbs</span>
                            </div>
                            <div className='w-full relative mt-4 p-[.15rem] rounded-full border-[2px] border-[#80808092] before:block before:w-[80%] before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-[#ffa500]'></div>
                        </div>
                    </div>
                    {/* Second stage show els 👀👀 */}
                    <div className={`w-full h-fit ${currentView === 2 ? "block" : "hidden"}`}>
                        {/* first stage 🐱‍👤😒 onNext remove */}
                        <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
                            <label htmlFor="name" className="block mb-2"><sup className="w-full text-xl font-bold">*</sup>Name</label>
                            <input type="text" id="name" className="block w-full p-2 border-2 border-black rounded-md" />
                            <p className='text-[red]'>Error message</p>
                        </div>
                        {/* first stage 🐱‍👤😒 onNext remove */}
                        <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
                            <label htmlFor="BioOptional" className="block mb-2"><sup className="w-full text-xl font-bold"></sup>Bio (Optional)</label>
                            <textarea id="BioOptional" className="block w-full p-2 border-2 border-black rounded-md" rows="5" cols="50"></textarea>
                            <p className='text-[red]'>Error message</p>
                        </div>
                        {/* first stage 🐱‍👤😒 onNext remove */}
                        <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
                            <label htmlFor="title" className="block mb-2"><sup className="w-full text-xl font-bold"></sup>Social Media Link (Optional)</label>
                            <input type="text" id="title" className="block w-full p-2 border-2 border-black rounded-md" />
                            <p className='text-[red]'>Error message</p>
                        </div>
                        {/* time of presentation */}
                        <span className="bg-[#FFFFF0] text-[#ffa500] block w-fit p-4 mt-8 border-[2px] border-black text-xl font-medium">Time of Presentation</span>
                        {/* time constants for presentaions */}
                        <div className="flex justify-between w-[90%] m-auto">
                            <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
                                <div className="w-full relative">
                                    <label htmlFor="DateSelectionID" className="block mb-2"><span className="w-full text-xl font-bold">*</span>Date Selection</label>
                                    <div className="relative bg-white w-full h-fit flex justify-between items-center border-2 border-black rounded-md overflow-hidden">
                                        <input type='date' ref={dateInputRef} name="" id="DateSelectionID" className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2" />
                                        <label htmlFor="DateSelectionID" onClick={handleLabelClick} className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md">
                                            <img src={Icon_metro_calendar} alt={Icon_metro_calendar} className="block w-4 h-4 scale-150 _aspect-square" />
                                        </label>
                                    </div>
                                    <p className='text-[red]'>Error message</p>
                                </div>
                            </div>
                            {/* 2 */}
                            <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
                                <div className="w-full relative">
                                    <label htmlFor="StartTime" className="block mb-2"><span className="w-full text-xl font-bold">*</span>Start Time</label>
                                    <div className="relative bg-white w-full h-fit flex justify-between items-center border-2 border-black rounded-md overflow-hidden">
                                        <input type='time' name="" id="StartTime" className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2" />
                                        <label htmlFor="StartTime" className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md">
                                            <img src={Icon_awesome_clock} alt={Icon_awesome_clock} className="block w-4 h-4 scale-150 _aspect-square" />
                                        </label>
                                    </div>
                                    <p className='text-[red]'>Error message</p>
                                </div>
                            </div>
                            {/* 3 */}
                            <div className="w-[30%] flex _justify-center items-center h-fit mt-6 text-lg text-black">
                                <div className="w-full relative">
                                    <label htmlFor="EndTime" className="block mb-2"><span className="w-full text-xl font-bold">*</span>End Time</label>
                                    <div className="relative bg-white w-full h-fit flex justify-between items-center border-2 border-black rounded-md overflow-hidden">
                                        <input type='time' name="" id="EndTime" className="block w-[100%] p-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2" />
                                        <label htmlFor="EndTime" className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-2 bg-black border-none rounded-tl-md rounded-bl-md">
                                            <img src={Icon_awesome_clock} alt={Icon_awesome_clock} className="block w-4 h-4 scale-150 _aspect-square" />
                                        </label>
                                    </div>
                                    <p className='text-[red]'>Error message</p>
                                </div>
                            </div>
                        </div>
                        {/* end */}
                    </div>
                    {/* Third stage show els 👀👀 */}
                    <div className={`w-full min-h-full ${currentView === 3 ? "flex" : "hidden"} justify-center items-center`}>
                        {/* <h1 className='text-[3rem] font-black text-black'>Coming Soon pls🐱‍🏍</h1> */}
                        <div className='w-full h-fit flex justify-between items-start'>
                            <div className='!w-[50%] h-screen flex flex-col justify-between bg-[#FFFFF0]'>
                                <div className='flex justify-between items-center w-[95%] m-auto mt-0 h-[20rem] bg-white rounded-md border-2 border-black'>
                                </div>
                                <div className='bg-[#ffa500] h-fit mt-16 pb-4'>
                                    <p className='w-fit m-auto pt-14 pb-4 text-black text-[1.2rem]'>PRESENTER'S INFORMATION</p>
                                    <div className='w-[95%] m-auto min-h-64 bg-[#FFFFF0] text-black'>
                                        <ul className='block w-full py-4'>
                                            <li className='block w-full mb-4 px-4'>
                                                <span>Name</span>
                                                <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                                <p className='text-[0.9rem] italic mt-2'>Lorem ipsum dolor sit amet</p>
                                            </li>
                                            <li className='block w-full mb-4 px-4'>
                                                <span>Bio</span>
                                                <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                                <p className='text-[0.9rem] italic mt-2'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata</p>
                                            </li>
                                            <li className='block w-full mb-4 px-4'>
                                                <span>Social Media Link</span>
                                                <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                                <p className='text-[0.9rem] italic mt-2'>
                                                    Rosemary_Haley@example.com
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='!w-[50%] overflow-auto h-screen bg-[#ffa500] pb-4 flex flex-col justify-between'>
                                <p className='w-fit m-auto pt-14 pb-4 text-black text-[1.2rem] mt-0'>PRESENTATION TITLE</p>
                                <div className='w-[95%] m-auto mb-0 min-h-[calc(100%-(5.7rem))] _overflow-auto bg-[#FFFFF0] text-black'>
                                    <ul className='block w-full pt-4'>
                                        <li className='block w-full mb-4 px-4'>
                                            <span>Description</span>
                                            <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                            <p className='text-[0.9rem] italic mt-2'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata</p>
                                        </li>
                                        <li className='block w-full mb-4 px-4'>
                                            <span>Privacy</span>
                                            <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                            <p className='text-[0.9rem] italic mt-2'>Public</p>
                                        </li>
                                        <li className='block w-full mb-4 px-4'>
                                            <span>Key Words</span>
                                            <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                            <p className='text-[0.9rem] italic mt-2'>Cybersecurity, Cybercrimes, Cyber war, cyber protection, Hacking...</p>
                                        </li>
                                        <li className='block w-full mb-4 px-4'>
                                            <span>Category</span>
                                            <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                            <p className='text-[0.9rem] italic mt-2'>Educational</p>
                                        </li>
                                        <li className='block w-full mb-4 px-4'>
                                            <span>Shareable</span>
                                            <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                            <p className='text-[0.9rem] italic mt-2'>YES</p>
                                        </li>
                                    </ul>
                                    <p className='bg-[#ffa500] w-3/6 pl-4 py-2'>SCHEDULE</p>
                                    <ul className='block w-full pb-4'>
                                        <li className='block w-full mb-4 px-4'>
                                            <span>Date</span>
                                            <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                            <p className='text-[0.9rem] italic mt-2'>21st January, 2024</p>
                                        </li>
                                        <li className='block w-full mb-4 px-4'>
                                            <span>Time</span>
                                            <hr className='p-[0.8px] mt-1 bg-black w-[80%]' />
                                            <p className='text-[0.9rem] italic mt-2'>2 : 00 pm - 4: 00 pm</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="flex justify-between items-center mt-6">
                    <button className={`${currentView === 1 ? "bg-[#808080bf] pointer-events-none" : "bg-black pointer-events-auto"} text-white font-black text-[1.5rem] p-2 border-none rounded-full w-[25%]`} onClick={showPreviousStage}>Back</button>
                    <button className={`${currentView === 3 ? "bg-[#808080bf] pointer-events-none" : "bg-[#ffa500] pointer-events-auto"} text-black font-black text-[1.5rem] p-2 border-none rounded-full w-[25%]`} onClick={showNextStage}>Next</button>
                </div>
            </div>
        </section>
    );
}