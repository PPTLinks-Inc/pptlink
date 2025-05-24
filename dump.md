import { useEffect, useState, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import Icon_awesome_clock from "/Icon-awesome-clock.svg";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/customTimePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
https://www.sec.gov/Archives/edgar/data/1141197/000110313204000018/exhibit101.pdf?utm_source=chatgpt.com
// import { TimePicker } from "@/components/ui/customTimePicker"
import { SlCalender } from "react-icons/sl";
import { useUploadStore } from "@/store/uploadStore";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import formatDate from "@/lib/formatDate";
import { useSearchParams } from "react-router-dom";

const schema = z
  .object({
    presenterName: z.string().min(2, "Presenter's name is Required"),
    bio: z
      .string()
      .optional()
      .refine((bio) => {
        if (bio) {
          return bio.length >= 5;
        }
        return true;
      }),
    socialLinks: z
      .string()
      .optional()
      .refine((url) => {
        if (!url) return true;
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
          regex.test(url)
        );

        return isValidSocialLink;
      }, "Enter a valid social media link"),
    selectDateTime: z.boolean().default(false),
    date: z
      .date()
      .optional()
      .refine((date) => {
        if (date) {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            return false;
          }
        }

        return true;
      }, "Date cannot be in the past"),
    startTime: z.string().optional(),
    endTime: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.selectDateTime && !data.date) {
        return false;
      }

      return true;
    },
    { message: "Must select Date, can't be empty", path: ["date"] }
  )
  .refine(
    (data) => {
      if (data.startTime && data.date) {
        const date = new Date(data.date);
        const [startHour, startMinute] = data.startTime.split(":").map(Number);
        date.setHours(startHour, startMinute, 0, 0);

        if (date < new Date()) {
          return false;
        }
      }

      return true;
    },
    { message: "Start time cannot be in the past", path: ["startTime"] }
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const [startHour, startMinute] = data.startTime.split(":").map(Number);
        const [endHour, endMinute] = data.endTime.split(":").map(Number);
        const startTime = new Date();
        const endTime = new Date();
        startTime.setHours(startHour, startMinute, 0, 0);
        endTime.setHours(endHour, endMinute, 0, 0);
        const tenMinutesInMillis = 10 * 60 * 1000;

        if (endTime.getTime() - startTime.getTime() < tenMinutesInMillis) {
          return false;
        }
      }
      return true;
    },
    {
      message: "End time must be 10 minutes after start time",
      path: ["endTime"]
    }
  );

export default function InformationStage() {
  const currentView = useUploadStore((state) => state.currentView);
  const setCurrentView = useUploadStore((state) => state.setCurrentView);
  const [searchParams] = useSearchParams();
  const [toggleStartTime, setToggleStartTime] = useState(false);
  const [toggleEndTime, setToggleEndTime] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      presenterName: useUploadStore.getState().presentersName,
      bio: useUploadStore.getState().bio,
      socialLinks: useUploadStore.getState().socialLinks,
      selectDateTime: useUploadStore.getState().date ? true : false,
      date: useUploadStore.getState().date
        ? new Date(useUploadStore.getState().date as string)
        : undefined,
      startTime: useUploadStore.getState().startTime,
      endTime: useUploadStore.getState().endTime
    }
  });

  useEffect(
    function () {
      if (!searchParams.has("edit")) {
        reset({
          presenterName: "",
          bio: "",
          socialLinks: "",
          selectDateTime: false,
          date: undefined,
          startTime: "",
          endTime: ""
        });
        return;
      }
    },
    [searchParams]
  );

  const values = watch();

  useEffect(
    function () {
      if (!values.selectDateTime) {
        setValue("date", undefined);
        setValue("startTime", undefined);
        setValue("endTime", undefined);
      }
    },
    [setValue, values.selectDateTime]
  );

  const setInformationStageSubmitHandler = useUploadStore(
    (state) => state.setInformationStageSubmitHandler
  );
  const setPresenterName = useUploadStore((state) => state.setPresentersName);
  const setBio = useUploadStore((state) => state.setBio);
  const setSocialLinks = useUploadStore((state) => state.setSocialLinks);
  const setDate = useUploadStore((state) => state.setDate);
  const setStartTime = useUploadStore((state) => state.setStartTime);
  const setEndTime = useUploadStore((state) => state.setEndTime);
  useEffect(
    function () {
      setInformationStageSubmitHandler(
        handleSubmit(function () {
          setPresenterName(values.presenterName);
          setBio(values.bio || "");
          setSocialLinks(values.socialLinks || "");
          setDate(values.date ? values.date.toISOString() : "");
          setStartTime(values.startTime || "");
          setEndTime(values.endTime || "");
          setCurrentView(3);
        })
      );
    },
    [
      handleSubmit,
      setInformationStageSubmitHandler,
      setCurrentView,
      setPresenterName,
      values.presenterName,
      values.bio,
      values.socialLinks,
      values.date,
      values.startTime,
      values.endTime,
      setBio,
      setSocialLinks,
      setDate,
      setStartTime,
      setEndTime
    ]
  );

  return (
    <div className={`w-full h-fit ${currentView === 2 ? "block" : "hidden"}`}>
      {/* Presenter&apos;s Name */}
      <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black maxScreenMobile:pt-12">
        <label htmlFor="presenterName" className="block mb-2">
          <sup className="w-full text-xl font-bold">*</sup>
          Presenter&apos;s Name
        </label>
        <input
          type="text"
          id="presenterName"
          {...register("presenterName")}
          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.presenterName?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
        />
        {errors.presenterName?.message && (
          <p className="text-[red]">
            {errors.presenterName?.message?.toString()}
          </p>
        )}
      </div>
      {/* Bio */}
      <div className="w-[90%] h-fit m-auto mt-10 text-lg text-black">
        <label htmlFor="BioOptional" className="block mb-2">
          <sup className="w-full text-xl font-bold"></sup>Bio (Optional)
        </label>
        <textarea
          id="BioOptional"
          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md resize-none ${errors.bio?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
          rows={5}
          cols={50}
          {...register("bio")}
        />
        {errors.bio?.message && (
          <p className="text-[red]">{errors.bio?.message?.toString()}</p>
        )}
      </div>
      {/* Social Media Link */}
      <div className="w-[90%] h-fit m-auto mt-6 text-lg text-black">
        <label htmlFor="socialMediaLink" className="block mb-2">
          <sup className="w-full text-xl font-bold"></sup>Social Media Link
          (Optional)
        </label>
        <input
          type="text"
          id="socialMediaLink"
          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.socialLinks?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
          {...register("socialLinks")}
        />
        {errors.socialLinks?.message && (
          <p className="text-[red]">{errors.socialLinks?.message.toString()}</p>
        )}
      </div>
      {/* time of presentation */}
      <span
        className={`bg-black rounded-tr-md rounded-br-md text-[#ffa500] w-fit p-4 mt-8 mb-6 text-xl font-medium flex justify-between items-center gap-2 ${(errors.date?.message || errors.startTime?.message || errors.endTime?.message) && "!border-t-2 !border-r-2 !border-b-2 !border-[red]"}`}
      >
        <label htmlFor="setToggleDateTime">Time of Presentation</label>
        <span>
          <Controller
            name="selectDateTime"
            control={control}
            render={({ field }) => (
              <Switch
                id="setToggleDateTime"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </span>
      </span>
      {/* time constants for presentaions */}
      {values.selectDateTime && (
        <div className="flex maxScreenMobile:flex-col justify-between w-[90%] m-auto relative">
          {/* 1 */}
          <div className="w-[30%] maxScreenMobile:w-full flex _justify-center items-center h-fit mt-6 text-lg text-black relative">
            <div className="w-full relative">
              <label htmlFor="DateSelectionID" className="block mb-2">
                <span className="w-full text-xl font-bold">*</span>Date
                Selection
              </label>
              <div
                className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-lg ${errors.date?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
              >
                <Controller
                  id="DateSelectionIDTwo"
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <span
                          aria-label="button"
                          className={cn(
                            "p-3 flex items-center w-full h-9 justify-start text-left font-normal"
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value)
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <label
                            aria-label="Open Date Picker"
                            htmlFor="DateSelectionIDTwo"
                            className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
                          >
                            <span className="_text-[#ffa500] !text-white">
                              <SlCalender />
                            </span>
                          </label>
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value || "")}
                          onSelect={field.onChange}
                          initialFocus
                          className="rounded-md border !border-[#ffa500] bg-[#FFFFF0]"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {/* error */}
              {errors.date?.message && (
                <p className="text-[red]">{errors.date?.message?.toString()}</p>
              )}
            </div>
          </div>

          {/* 2 */}
          <div className="w-[30%] maxScreenMobile:w-full flex _justify-center items-center h-fit mt-6 text-lg text-black relative">
            <div className="w-full relative">
              <label htmlFor="StartTime" className="block mb-2">
                <span className="w-full text-xl font-bold">*</span>Start Time
              </label>
              <div
                className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-lg ${
                  errors.startTime?.message
                    ? "border border-[red] outline-offset-2"
                    : "border-none"
                }`}
              >
                <input
                  type="time"
                  id="StartTimeId"
                  className="block w-[100%] p-1 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
                  {...register("startTime")}
                />
                <label
                  aria-label="Open Start Time Picker"
                  htmlFor="StartTimeId"
                  onClick={() => setToggleStartTime(!toggleStartTime)}
                  className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
                >
                  <img
                    src={Icon_awesome_clock}
                    alt="Clock Icon"
                    className="block w-4 h-4 scale-150 pointer-events-none"
                  />
                </label>
              </div>
              {/* error */}
              {errors.startTime?.message && (
                <p className="text-[red]">
                  {errors.startTime?.message?.toString()}
                </p>
              )}
              {toggleStartTime && (
                <div className="w-full absolute bottom-[100%] left-0 right-0">
                  <TimePicker
                    onTimeChange={(h, m, s) => {
                      setStartTime(`${h}:${m}:${s}`);
                      console.log(`Start Time is ${h}, ${m}, ${s}`);
                    }}
                    className="rounded-md border !border-[#ffa500] bg-[#FFFFF0]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3 */}
          <div className="w-[30%] maxScreenMobile:w-full flex _justify-center items-center h-fit mt-6 text-lg text-black">
            <div className="w-full relative">
              <label htmlFor="EndTime" className="block mb-2">
                <span className="w-full text-xl font-bold">*</span>End Time
                (Optional)
              </label>
              <div
                className={`relative bg-white w-full h-fit flex justify-between items-center rounded-md overflow-hidden indent-4 py-1 focus:outline focus:outline-[1px] shadow-lg ${
                  errors.endTime?.message
                    ? "border border-[red] outline-offset-2"
                    : "border-none"
                }`}
              >
                <input
                  type="time"
                  id="EndTimeId"
                  className="block w-[100%] p-1 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
                  {...register("endTime")}
                />
                <label
                  aria-label="Open End Time Picker"
                  htmlFor="EndTimeId"
                  onClick={() => setToggleEndTime(!toggleEndTime)}
                  className="absolute top-0 left-auto right-0 bottom-0 w-[35%] _pointer-events-none flex gap-8 justify-center items-center h-full p-1 bg-black border-none rounded-tl-md rounded-bl-md"
                >
                  <img
                    src={Icon_awesome_clock}
                    alt="Clock Icon"
                    className="block w-4 h-4 scale-150 pointer-events-none"
                  />
                </label>
              </div>
              {errors.endTime?.message && (
                <p className="text-[red]">
                  {errors.endTime?.message?.toString()}
                </p>
              )}
              {toggleEndTime && (
                <div className="w-full absolute bottom-[100%] left-0 right-0">
                  <TimePicker
                    onTimeChange={(h, m, s) => {
                      setEndTime(`${h}:${m}:${s}`);
                      console.log(`End Time is ${h}, ${m}, ${s}`);
                    }}
                    className="rounded-md border !border-[#ffa500] bg-[#FFFFF0]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* end */}
    </div>
  );
}



import { NavLink } from "react-router-dom";
import documentImg from "/team/pptlink_resources/documentation-svgrepo-com (1).svg";
import initiative from "/team/pptlink_resources/initiative.png";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
import { BsLockFill, BsUnlockFill } from 'react-icons/bs';
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AccordionWrapper from "../accordion/accordion";

export default function LibraryPage() {
    return (<>
        <Helmet>
            <title>{`Library - PPTLinks `}</title>
            <meta
                name='description'
                content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
            />
            <meta
                name='tags'
                content={`PPT, Presentations, Powerpoint, PPTLinks, publicPresentation, PPTLINKSLibrary, library, `}
            />

            {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
            <meta property='og:type' content='website' />
            <meta property='og:url' content={`https://www.PPTLink.com/library`} />
            <meta property='og:title' content={`Library - PPTLinks `} />
            <meta
                property='og:description'
                content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
            />
            <meta property='og:image' content={LogoBlack} />

            {/* meta tags to display information on twitter  */}
            <meta property='twitter:card' content='website' />
            <meta
                property='twitter:url'
                content={`https://www.PPTLink.com/library`}
            />

            <meta property='twitter:title' content={`Library - PPTLinks `} />
            <meta
                property='twitter:description'
                content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
            />
            <meta property='twitter:image' content={LogoBlack} />
        </Helmet>
        <section className="bg-black">
            <div className="container h-fit py-10 flex flex-col justify-between items-start">
                <h1 className="text-3xl font-[400] uppercase mb-5">UI/UX Strategy Essentials</h1>
                <p className="uppercase text-[#FFA500]">Paid Program</p>
                <p className="text-[0.9rem] py-3 w-2/5 maxScreenMobile:w-4/5 maxSmallMobile:w-full maxSmallMobile:text-justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia sequi, dolor molestias repudiandae nobis voluptate quidem in voluptas id maiores, quae repellendus esse praesentium illum recusandae unde commodi tempora asperiores.</p>
                <div className="relative flex items-center justify-between gap-4 w-fit">
                    <span className="flex -space-x-4">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(index => (
                            <Avatar
                                key={index.toString()}
                                className="border-2 border-background block w-[2rem] h-[2rem] !rounded-[1rem]"
                                style={{ zIndex: index + 1 }}
                            >
                                <AvatarImage src={"/team/baraka.jpg"} alt={"baraka"} className="object-cover" />
                                <AvatarFallback>{"B"}</AvatarFallback>
                            </Avatar>
                        ))}
                    </span>
                    <span className="block w-fit responsiveTex text-white">25+ enrolled</span>
                </div>
                <div className="flex justify-between items-center gap-3 py-4">
                    <button className="flex justify-between items-center gap-3 py-4 `w-fit px-3 text-black font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]">Enroll Now</button>
                    <span className="text-[#FFA500] font-bold text-xl">$45,330</span>
                </div>
            </div>
        </section>
        <div className="border-t-2 border-b-2 bg-black border-t-white border-b-white">
            <div className="container py-3 flex justify-between items-center gap-2 maxScreenMobile:flex-col maxScreenMobile:items-start">
                <p><span>#</span>3 Months</p>
                <p><span>#</span>Beginner</p>
                <p><span>#</span>Last Uploaded August 17 2024</p>
            </div>
        </div>
        <section className="bg-black min-h-[50vh]">
            <h2 className="container text-xl font-bold text-white capitalize pt-8 pb-4">Courses in this Program</h2>

            <div className="container">
                {/* start */}
                {Array.from({ length: 3 }, (_, i) => i + 1).map((_, id) => (
                    <AccordionWrapper
                        key={id}
                        title={
                            <p className="!w-full px-6 py-4 bg-[#FFFFF0] border-0 !rounded-md">
                                <span className="block w-fit text-[#FFA500] !text-sm mb-1 font-semibold">Course 1-47 minutes</span>
                                <span className="block w-fit text-black text-xl capitalize">Welcome to UI/UX Course</span>
                            </p>
                        }
                        className="transition-all duration-300 !border-0 !border-transparent"
                    >
                        <div className="courses my-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3 maxScreenMobile:grid-cols-2 maxSmallMobile:grid-cols-1">
                            {/* start */}

                            {Array.from({ length: eval(5 - id) }, (_, i) => i + 1).map(idx => (
                                <div key={idx.toString()} className="border-2 border-[#FFFFF0] rounded-md p-3">
                                    <img src="/team/baraka.jpg" alt="baraka" className="block mb-3 w-12 aspect-square border-0 rounded-md object-cover" />
                                    <div className="flex flex-col justify-between items-start gap-2">
                                        <h3 className="font-semibold text-base">Ideation and Validation</h3>
                                        <p className="text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. Minus repudiandae at incidunt hic nihil unde nulla odit?</p>
                                        <NavLink to="#" target="_blank" className="block underline">Learn More...</NavLink>
                                    </div>
                                </div>
                            ))}
                            {/* end */}

                        </div>
                    </AccordionWrapper>
                ))}
                {/* end */}
            </div>
        </section>
        {/* <section className="library container py-5 h-fit bg-[#FFFFF0]">
            <div className="w-full my-20">
                <NavLink to={'#'}
                    className="_min-w-[350px] bg-black
                 h-fit border-[.1px]
                 border-black rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{true ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-black px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">GNS</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Department of General Studies</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">The Federal Polytechnic Bauchi</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Students Lecture Guide for FPTB GNS courses</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        <span class="block mt-2"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" class="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-black px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>

                <NavLink to={'#'}
                    className="_min-w-[350px] bg-black
                 h-fit border-[.1px]
                 border-black rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{true ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-black px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">Friday presentations</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Soft Skills Class</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">Nasomsoft Embedded Hub</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Notes on presentations every friday at Nasomsoft Embedded Hub</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        <span class="block mt-2"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" class="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-black px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>

                <NavLink to={'#'}
                    className="_min-w-[350px] bg-black
                 h-fit border-[.1px]
                 border-black rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{true ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-black px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">GNS</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Department of General Studies</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">Abubakar Tafawa Balewa University Bauchi</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Students Lecture Guide from 100 Level to 300 Level</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        <span class="block mt-2"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" class="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-black px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>
            </div>
        </section> */}
    </>)
}



        <section className="library container py-5 h-fit bg-[#FFFFF0]">
            <div className="w-full my-20">
                {/* {Array(3).fill(0).map((_, i) => ({ id: i })).map(({ id }) => */}
                <NavLink to={'#'}
                    className="_min-w-[350px] bg-black
                 h-fit border-[.1px]
                 border-black rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{true ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-black px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">GNS</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Department of General Studies</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">The Federal Polytechnic Bauchi</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Students Lecture Guide for FPTB GNS courses</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        {/* <span className="text-[1.005rem]">View Library <span className="font-bold text-xl">&rarr;</span></span> */}
                        <span class="block mt-2"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" class="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-black px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>

                <NavLink to={'#'}
                    className="_min-w-[350px] bg-black
                 h-fit border-[.1px]
                 border-black rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{true ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-black px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">Friday presentations</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Soft Skills Class</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">Nasomsoft Embedded Hub</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Notes on presentations every friday at Nasomsoft Embedded Hub</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        {/* <span className="text-[1.005rem]">View Library <span className="font-bold text-xl">&rarr;</span></span> */}
                        <span class="block mt-2"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" class="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-black px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>

                <NavLink to={'#'}
                    className="_min-w-[350px] bg-black
                 h-fit border-[.1px]
                 border-black rounded-[.6rem]
                    text-[.8rem] flex flex-col 
                    justify-between items-center">
                    <div className="after_effect bg-transparent rounded-t-[.5rem] flex w-full justify-between items-center text-white pt-8 pb-4 px-2">
                        <span className="tracking-[.4rem] uppercase text-xl text-[#FFA500] font-extrabold">{true ? <BsUnlockFill /> : <BsLockFill />}</span>
                        <span className="tracking-[.4rem] uppercase text-[1.005rem]">LIBRARY</span>
                    </div>
                    <div className="w-full bg-[#FFFFF0] text-black px-2">
                        <h2 className="block text-4xl w-full font-[400] my-4">GNS</h2>
                        <p className="block w-full my-1 text-[1.3rem] font-[500] overflow-x-hidden whitespace-nowrap text-ellipsis">Department of General Studies</p>
                        <p className="block w-full my-1 text-[1.1rem] overflow-x-hidden whitespace-nowrap text-ellipsis">Abubakar Tafawa Balewa University Bauchi</p>
                        <span className="block w-full my-4 overflow-x-hidden whitespace-nowrap text-ellipsis italic">Students Lecture Guide from 100 Level to 300 Level</span>
                    </div>
                    <div className="before_effect bg-transparent rounded-b-[.5rem] flex w-full justify-between items-center text-white pt-4 pb-8 px-2">
                        {/* <span className="text-[1.005rem]">View Library <span className="font-bold text-xl">&rarr;</span></span> */}
                        <span class="block mt-2"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 192 512" class="text-xl text-[#FFA500] cursor-pointer rotate-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg></span>
                        <span className="responsiveText block bg-[#FFA500] text-black px-[4px] p-[1px]">Free</span>
                    </div>
                </NavLink>
                {/* )} */}
            </div>
        </section>



        {/* <div className="why_pptlinks container w-full py-20 maxScreenMobile:py-12">
        <motion.h3
          initial={{ y: 100, opacity: 0 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, type: "tween" }
          }}
          viewport={{ once: true }}
          className="text-6xl text-center text-[#FFA500] mb-10"
        >
          WHY USE PPTLINKS?
        </motion.h3>
        <div className="wrap_circle w-full h-fit mt-20 !text-black maxScreenMobile:mt-10">
          <motion.div className="grid_anim_wrapper">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img1}
                    alt={anim_img1}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>

                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    Make Amazing Presentation
                  </h4>
                  <p className="responsiveText w-full text-ellipsis m-auto">
                    and carry your audience along.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img2}
                    alt={anim_img2}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    Host Classes with Libraries
                  </h4>
                  <p className="responsiveText w-full text-ellipsis m-auto">
                    to create engaging learning experiences for participants.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img4}
                    alt={anim_img4}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    Tell your story visually
                  </h4>
                  <p className="responsiveText w-full text-ellipsis m-auto">
                    to give a lasting impression.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img5}
                    alt={anim_img5}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    For Business
                  </h4>
                  <p className="responsiveText w-full text-ellipsis m-auto">
                    present Your ideas with Confidence and Clarity.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img3}
                    alt={anim_img3}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    For Physical Presentations to Carry Everyone Alone
                  </h4>
                  <p className="responsiveText w-full text-ellipsis m-auto">
                    backbenchers become part of the session.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div> */}



<!-- ////////////////////////////////////////////// -->

import { NavLink } from "react-router-dom";

export default function InstructorCard({ img }) {
    return (
        <div className="border-2 border-[#FFFFF0] rounded-md p-3 aspect-square relative">
            <div className="h-full flex flex-col">
                <img
                    src={img}
                    alt={img}
                    className="block mb-3 w-12 aspect-square border-0 rounded-full object-cover"
                />
                <div className="flex flex-col flex-1 justify-between gap-2">
                    <div className="overflow-hidden">
                        <h3 className="font-semibold text-base truncate">
                            {"Ideation and Validation"}
                        </h3>
                        <p className="text-sm line-clamp-4">
                            {"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. Minus repudiandae at incidunt hic nihil unde nulla odit?"}
                        </p>
                    </div>
                    <NavLink
                        to={"#"}
                        target="_blank"
                        className="block underline mt-auto"
                    >
                        Learn More...
                    </NavLink>
                </div>
            </div>
        </div>
    )
}


<!-- //////////////////////////////// -->
<div className="md:my-4_ pt-4 grid grid-cols-4 auto-rows-fr grid-flow-row gap-4 maxScreen:grid-cols-3 items-stretch">

<motion.div
  initial={{ y: 30, opacity: 0 }}
  whileInView={{
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "tween" }
  }}
  viewport={{ once: true }}
  className="card snap_scrolling_child w-full h-full rounded-lg cursor-pointer border border-[#FFFFF0] relative flex flex-col"
>






