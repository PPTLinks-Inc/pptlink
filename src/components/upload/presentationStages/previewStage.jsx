import SlidePreview from '../SlidePreview';

export default function PreviewStage({ currentView, uploadValues }) {

    return (
        <div className={`w-full min-h-full ${currentView === 3 ? "flex" : "hidden"} justify-center items-center`}>
            <div className="w-full h-fit gridPreview overflow-x-auto">
                <div className="w-full flex flex-col justify-between bg-[#FFFFF0]">
                    {/* MARK: Preview */}
                    <div
                        className="maxScreenMobile:mt-4 w-[95%] maxScreenMobile:w-full m-auto h-[20rem] bg-white rounded-md border-2 border-black maxScreenMobile:border-[0.1px] maxScreenMobile:border-[#00000034] maxScreenMobile:rounded-none"
                    >
                        {false && (
                            <SlidePreview
                                currentView={currentView}
                                uploadValues={uploadValues}
                                url={""}
                            />
                        )}
                    </div>
                    <div className="bg-[#ffa500] h-fit mt-16 pb-4 w-full">
                        <p className="w-fit m-auto pt-14 pb-4 text-black text-[1.2rem]">
                            PRESENTER&apos;S INFORMATION
                        </p>
                        <div className="w-[95%] maxScreenMobile:w-full m-auto min-h-64 bg-[#FFFFF0] text-black">
                            <ul className="block w-full py-4">
                                <li className="block w-full mb-4 px-4">
                                    <span>Name</span>
                                    <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                    <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                        {uploadValues.presenterName ? uploadValues.presenterName : "No Name Set"}
                                    </p>
                                </li>
                                <li className="block w-full mb-4 px-4">
                                    <span>Bio</span>
                                    <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                    <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                        {uploadValues.bio ? uploadValues.bio : "No Bios Set"}
                                    </p>
                                </li>
                                <li className="block w-full mb-4 px-4">
                                    <span>Social Media Link</span>
                                    <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                    <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                        {uploadValues.socialMediaLink ? uploadValues.socialMediaLink : "No Social Link Set"}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-[#ffa500] pb-[1.7rem] flex flex-col justify-between">
                    <p className="w-fit m-auto pt-14 pb-4 text-black text-[1.2rem] mt-0">
                        PRESENTATION DETAILS
                    </p>
                    <div className="w-[95%] maxScreenMobile:w-full m-auto mb-0 min-h-[calc(100%-(5.7rem))] _overflow-auto bg-[#FFFFF0] text-black">
                        <ul className="block w-full pt-4">
                            <li className="block w-full mb-4 px-4">
                                <span>Presentation title</span>
                                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                    {uploadValues.title ? uploadValues.title : "No Title Set"}
                                </p>
                            </li>
                            <li className="block w-full mb-4 px-4">
                                <span>Description</span>
                                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                    {uploadValues.description ? uploadValues.description : "No Description Set"}
                                </p>
                            </li>
                            <li className="block w-full mb-4 px-4">
                                <span>Privacy</span>
                                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                    {uploadValues.privacy ? uploadValues.privacy : "No Privacy Set"}
                                </p>
                            </li>
                            <li className="block w-full mb-4 px-4">
                                <span>Category</span>
                                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                    {uploadValues.category ? uploadValues.category : "No Category Set"}
                                </p>
                            </li>
                            <li className="block w-full mb-4 px-4">
                                <span>Downloadable</span>
                                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                    {uploadValues.downloadable === "true" ? "Downloadable" : "Not downloadable"}
                                </p>
                            </li>
                        </ul>
                        <p className="bg-[#ffa500] text-black w-3/6 pl-4 py-2">
                            SCHEDULE
                        </p>
                        <ul className="block w-full pb-4">
                            <li className="block w-full mb-4 px-4">
                                <span>Date</span>
                                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                    {uploadValues.presentationDate ? `Start Date: ${uploadValues.presentationDate}` : "No Date Set"}
                                </p>
                            </li>
                            <li className="block w-full mb-4 px-4">
                                <span>Time</span>
                                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                                <p className="text-[0.9rem] italic mt-2 w-full !h-fit">
                                    {uploadValues.presentationStartTime
                                        ? `Start Time(${uploadValues.presentationStartTime})`
                                        : "No Start Time Set "}
                                    -
                                    {uploadValues.presentationEndTime
                                        ? ` End Time(${uploadValues.presentationEndTime})`
                                        : " No End Time Set"}
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}