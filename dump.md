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

<!-- Checkout  -->
<div className="w-full h-fit bg-primaryTwo py-6 relative text-[#FFFFF0] !pt-16">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, type: "tween" }
            }}
            viewport={{ once: true }}
            className="container text-4xl font-extrabold text-center maxScreenMobile:text-3xl maxScreenMobile:font-bold !mb-2">
            {/* All the skills you need in one place */}
            Checkout all available courses
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, type: "tween" }
            }}
            viewport={{ once: true }}
            className="w-2/5 mx-auto text-sm text-center  maxScreenMobile:w-[90%]">
            Checkout all available skills you will need to kick start a carrier in the tech industry
          </motion.p>

          <div className="container grid grid-cols-4 grid-flow-col overflow-x-auto !mt-6">
            <span data-allcourses="1" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 1 && "!border-[#FFFFF0] font-bold"}`}>Software</span>
            <span data-allcourses="2" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 2 && "!border-[#FFFFF0] font-bold"}`}>Design</span>
            <span data-allcourses="3" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 3 && "!border-[#FFFFF0] font-bold"}`}>Fashion</span>
            <span data-allcourses="4" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 4 && "!border-[#FFFFF0] font-bold"}`}>Health</span>
          </div>

          <div className="_hidden flex justify-end items-center  gap-5 maxScreenMobile:justify-end container mx-auto h-fit bg-[transparent] py-4">
            <button onClick={() => scrollCardsTwo(true)} className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px] aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] hover:bg-[#FFA500]">
              <FaCaretLeft className="text-[1.5rem] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
              />
            </button>
            <button onClick={() => scrollCardsTwo(false)} className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px] aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] hover:bg-[#FFA500]">
              <FaCaretRight className="text-[1.5rem] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
              />
            </button>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 1, type: "tween" }
            }}
            viewport={{ once: true }}
            ref={scrollRefTwo}
            className="snap_scrolling container flex gap-8 h-fit overflow-x-auto overflow-y-hidden pr-2 pb-2 scroll-smooth">
            {(currentView === 1 ||
              currentView === 2 ||
              currentView === 3 ||
              currentView === 4) && Array.from({ length: 10 }, (_, i) => i + 1).map(idx => (
                <NavLink
                  key={idx.toString()}
                  className="snap_scrolling_child min-w-[18rem] grow-0 shrink-0 basis-[15rem] !aspect-[2/2.5] bg-[url('/cod.png')] bg-cover bg-center flex flex-col justify-between items-start py-6 px-2 border-[0.1px] rounded-lg relative before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-primaryTwo/25 cursor-pointer shadow-white shadow-inner z-10"
                  to="/libraryPage"
                >
                  <div className="absolute top-3 left-0 w-full h-full _bg-black/40 z-0 rounded-lg">
                    <div className="relative w-full">
                      {/* <img src={purchased} alt={purchased} className="block h-[1.5rem]" /> */}
                      <svg width="176" height="32" viewBox="0 0 176 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 32H176L147.294 16.3137L176 0H0V32Z" fill={"gold"} />
                      </svg>
                      <span className="block w-[35%] absolute top-[50%] -translate-y-[50%] left-0 bg-transparent pl-2 text-sm">{"Pendding"}</span>
                    </div>
                  </div>
                  <div className="z-10 pt-6">
                    <p className="text-md font-light mb-1">Software Development</p>
                    <h4 className="text-2xl font-bold">Mobile Development Basics</h4>
                  </div>
                  <div className="z-10">
                    <p className="text-md font-light mb-3">David A. Spencer</p>
                    <div className="relative flex items-center justify-between gap-1 w-full">
                      <span className="flex -space-x-3">
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(index => (
                          <Avatar
                            key={index.toString()}
                            className="border-2 border-background block w-[1.5rem] h-[1.5rem] !rounded-[0.75rem]"
                            style={{ zIndex: index + 1 }}
                          >
                            <AvatarImage src={"/team/imoh.jpg"} alt={"imoh"} className="object-cover" />
                            <AvatarFallback>{"I"}</AvatarFallback>
                          </Avatar>
                        ))}
                      </span>
                      <span className="block w-fit responsiveText">25+ enrolled</span>
                    </div>
                  </div>
                </NavLink>
              ))}
          </motion.div>
          <NavLink
            to="#"
            className="block text-center text-[#FFA500] underline mt-6"
          >
            See more
          </NavLink>
        </div>





<!-- ///////////////////////////////////////////quiz app///////////////////////////////////////////////// -->

/* eslint-disable react/prop-types */
import { createContext, useState, useMemo } from 'react';

// Default quiz data
const defaultQuiz = [
    {
        id: 1,
        Name: 'My first Quiz',
        timed: true,
        createdBy: 1,
        rightAns: 3, 
        questions: [
            {
                question: 'When was Nigerian independence',
                options: [
                    { optionsA: '2025', correct: false },
                    { optionsB: '1960', correct: true },
                    { optionsA: '1996', correct: false },
                    { optionsA: '1967', correct: false },
                ],
            },

            {
                question: 'When was Nigerian civil war',
                options: [
                    { optionsA: '2025', correct: false },
                    { optionsB: '1960', correct: false },
                    { optionsA: '1996', correct: false },
                    { optionsA: '1967', correct: true },
                ],
            },
        ],
    }
];

// eslint-disable-next-line react-refresh/only-export-components
export const quizContext = createContext(defaultQuiz);

const QuizContextProvider = (props) => {
    // Initialize with defaultQuiz instead of []
    const [quiz, setQuiz] = useState(defaultQuiz);

    const providerQuiz = useMemo(() => ({ quiz, setQuiz }), [quiz, setQuiz]);

    return (
        <quizContext.Provider value={providerQuiz}>
            {props.children}
        </quizContext.Provider>
    );
};

export default QuizContextProvider;


<!-- ///////////////////////////////new interface///////////////////////////////////////////////// -->

<!-- /////////////////////////////////context////////////////////////// -->
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useOrientation } from "react-use";

const hostMicStates = ["hostNeutral", "hostActive", "hostInActive"];
const usersMicStates = [
  "userNeutral",
  "userRequest",
  "userActive",
  "userInActive"
];

// eslint-disable-next-line react-refresh/only-export-components
export const TheInterfaceContext = createContext();
const TheInterfaceContextProvider = (props) => {
  const orientation = useOrientation();
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(true);
  const [micIndex, setMicIndex] = useState(0);
  const [mic, setMic] = useState({
    hostNeutral: true,
    hostActive: false,
    hostInActive: false,
    userNeutral: false,
    userRequest: false,
    userActive: false,
    userInActive: false
  });
  const [sideBar, setSideBar] = useState(true);
  const [videoShare, setVideoShare] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [micRequest] = useState(15);
  const [chooseCoHost] = useState(15);
  const [chooseSlide] = useState(12);
  const is768PxScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const [footerClass, setFooterClass] = useState({
    interfaceFooter: true,
    inAactiveSideBarDesktop: false,
    mobileViewHost: false,
    desktopViewUsers: false,
    mobileViewUsers: false
  });
  const [liveChatAudience, setLiveChatAudience] = useState({
    audience: true,
    chats: false,
    controls: false,
    requests: false,
    coHost: false,
    chooseSlide: false,
    poll: false
  });

  const cycleMicState = useCallback(() => {
    const filteredStates = isHost ? hostMicStates : usersMicStates;
    const nextIndex = (micIndex + 1) % filteredStates.length;
    const newMic = {};
    filteredStates.forEach((key) => {
      newMic[key] = false;
    });
    newMic[filteredStates[nextIndex]] = true;
    setMic(newMic);
    setMicIndex(nextIndex);
  }, [isHost, micIndex]);

  // Keeping trak of this component's fullscreen state and mobile
  useEffect(() => {
    setFooterClass({
      interfaceFooter: sideBar && !is768PxScreen && isHost ? true : false,
      inAactiveSideBarDesktop:
        !sideBar && !is768PxScreen && isHost ? true : false,
      mobileViewHost: is768PxScreen && isHost ? true : false,
      desktopViewUsers: !is768PxScreen && !isHost ? true : false,
      mobileViewUsers: is768PxScreen && !isHost ? true : false
    });
  }, [sideBar, is768PxScreen, isHost]);

  return (
    <TheInterfaceContext.Provider
      value={{
        // orientation,
        navigate,
        isHost,
        setIsHost,
        micIndex,
        setMicIndex,
        mic,
        setMic,
        sideBar,
        setSideBar,
        videoShare,
        setVideoShare,
        screenShare,
        setScreenShare,
        micRequest,
        chooseCoHost,
        chooseSlide,
        is768PxScreen,
        footerClass,
        liveChatAudience,
        setLiveChatAudience,
        cycleMicState
      }}
    >
      {props.children}
    </TheInterfaceContext.Provider>
  );
};

export default TheInterfaceContextProvider;

<!-- ///////////////////////////////////////interfaceView/////////////////////////// -->

import { useContext } from "react";
import { TheInterfaceContext } from "@/contexts/InterfaceContext";
import ShareAPI from "./Share";
import AsideElement from "./interfaceSharedComponents/AsideElement";
import InterfaceFooterElement from "./interfaceSharedComponents/InterfaceFooter";
import MainInterfaceElement from "./interfaceSharedComponents/MainInterface";

// ratios: side-bar 23.75(342px), main-view 73.125(1053px), spacings 3.125(45px)
export default function InterfaceView() {
  const {
    // orientation,
    navigate,
    isHost,
    setIsHost,
    micIndex,
    setMicIndex,
    mic,
    setMic,
    sideBar,
    setSideBar,
    videoShare,
    setVideoShare,
    screenShare,
    setScreenShare,
    micRequest,
    chooseCoHost,
    chooseSlide,
    is768PxScreen,
    footerClass,
    liveChatAudience,
    setLiveChatAudience,
    cycleMicState
  } = useContext(TheInterfaceContext);
  return (
    // new interface page new design
    <div className="relative bg-black maxScreenMobile:bg-primaryTwo w-[100svw] h-[100svh] grid grid-rows-[40px_1fr] grid-cols-[1fr]">
      {/* header section */}
      <header className="w-full h-full p-1">
        <div className="w-full h-full mx-auto border-none rounded-sm flex justify-between items-center">
          <ShareAPI fitSize={true} />
          <div
            className={`w-fit h-full flex justify-center items-center gap-4 _$ {!orientation.type.includes("landscape") && is768PxScreen && "hidden"}`}
          >
            <h2 className="text-xl font-light text-white">Meeting with YLN</h2>
            <sub className="text-[0.7rem] text-white">By {"Imoh Omezegba"}</sub>
          </div>
          <button className="bg-[#29db29] w-fit h-full flex justify-center items-center gap-2 px-2 border-none rounded-sm text-[0.8rem] font-semibold">
            <span>2:45</span>
            <span>Live</span>
          </button>
        </div>
      </header>
      {/* main interface/footer and sideBar wrapper */}
      <div
        className={`bg-black maxScreenMobile:bg-primaryTwo grid grid-rows-[1fr] ${sideBar && !is768PxScreen ? "grid-cols-[1fr_345px]" : "grid-cols-1"}`}
      >
        {/* main interface/footer wrapper */}
        <div
          className={`w-full h-full p-1  grid grid-rows-[1fr_50px] grid-cols-[1fr] gap-1`}
        >
          {/* main interface */}
          <MainInterfaceElement
            footerClass={footerClass}
            sideBar={sideBar}
            setSideBar={setSideBar}
            is768PxScreen={is768PxScreen}
            orientation={orientation}
          />
          {/* interface footer */}
          <InterfaceFooterElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
        </div>
        {/* sideBar section */}
        <AsideElement
          footerClass={footerClass}
          sideBar={sideBar}
          is768PxScreen={is768PxScreen}
          setLiveChatAudience={setLiveChatAudience}
          liveChatAudience={liveChatAudience}
          setSideBar={setSideBar}
          micRequest={micRequest}
          isHost={isHost}
          mic={mic}
          setMic={setMic}
          videoShare={videoShare}
          setVideoShare={setVideoShare}
          screenShare={screenShare}
          setScreenShare={setScreenShare}
          cycleMicState={cycleMicState}
          chooseCoHost={chooseCoHost}
          chooseSlide={chooseSlide}
          navigate={navigate}
        />
      </div>
    </div>
  );
}


<!-- ////////////////////////////////////////////////Aside///////////////////////////// -->

/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import LiveAudienceElement from "./LiveAudience";
import LiveChatElement from "./LiveChat";
import ControlsDotsElement from "./ControlsDots";
import MicRequestElement from "./MicRequest";
import ChooseCoHostElement from "./ChooseCoHost";
import ChooseSlideElement from "./ChooseSlide";
import PollElement from "./Poll";

export default function AsideElement({
  sideBar,
  is768PxScreen,
  setLiveChatAudience,
  liveChatAudience,
  setSideBar,
  micRequest,
  isHost,
  mic,
  setMic,
  videoShare,
  setVideoShare,
  screenShare,
  setScreenShare,
  cycleMicState,
  chooseCoHost,
  chooseSlide,
  footerClass,
  navigate
}) {
  return (
    <>
      {/* orientation.type.includes("portrait") */}
      <div
        className={`w-full h-full p-1 overflow-auto ${!sideBar && "hidden"} ${is768PxScreen && "!absolute !top-[50%] -translate-y-[50%] !left-0 !bottom-auto !w-full !h-[calc(100vh-150px)] bg-black z-50"} !border-none`}
      >
        {/* sideBar wrapper */}
        <div
          className={`w-full !h-full grid grid-cols-[1fr] ${is768PxScreen ? "grid-rows-[1fr]" : "grid-rows-[20px_1fr]"} gap-1 relative`}
        >
          {/* floating button for closing controls area */}
          <button
            onClick={() => {
              setLiveChatAudience({
                audience: liveChatAudience.controls ? true : false,
                chats: false,
                controls: liveChatAudience.controls ? false : true,
                requests: false,
                coHost: false,
                chooseSlide: false,
                poll: false
              });
              setSideBar(!liveChatAudience.controls ? true : false);
            }}
            className={`text-white ${
              !(
                liveChatAudience.controls ||
                liveChatAudience.coHost ||
                liveChatAudience.chooseSlide ||
                liveChatAudience.poll
              )
                ? "hidden"
                : "block"
            } w-fit h-fit p-1 border-none rounded-sm absolute top-8 right-2 z-10`}
          >
            <IoClose size={20} />
          </button>
          {/* SideBar toggle for Live audience and chat */}
          <div
            className={`${is768PxScreen && "hidden"} w-full h-full border-none rounded-sm grid grid-cols-2 grid-rows-1 gap-1`}
          >
            <button
              onClick={() => {
                setLiveChatAudience({
                  audience: true,
                  chats: false,
                  controls: false,
                  requests: false,
                  coHost: false,
                  chooseSlide: false,
                  poll: false
                });
                setSideBar(true);
              }}
              className="flex w-full h-full justify-center items-center relative cursor-pointer"
            >
              <span
                className={`${liveChatAudience.audience && "bg-primaryTwo"} border-none rounded-sm text-white text-xs flex justify-center items-center w-full h-full`}
              >
                <span className="mr-1">Live Audience</span>
                <span
                  className={`${liveChatAudience.audience ? "bg-black" : "bg-primaryTwo"} border-none rounded-sm text-[0.6rem] inline-block py-[0.5px] px-[2px]`}
                >
                  99+
                </span>
              </span>
            </button>
            <button
              onClick={() => {
                setLiveChatAudience({
                  audience: false,
                  chats: true,
                  controls: false,
                  requests: false,
                  coHost: false,
                  chooseSlide: false,
                  poll: false
                });
                setSideBar(true);
              }}
              className="flex w-full h-full justify-center items-center relative cursor-pointer"
            >
              <span
                className={`${liveChatAudience.chats && "bg-primaryTwo"} border-none rounded-sm text-white text-xs flex justify-center items-center w-full h-full`}
              >
                <span className="mr-1">Live Chat</span>
                <span
                  className={`${liveChatAudience.chats ? "bg-black" : "bg-primaryTwo"} border-none rounded-sm text-[0.6rem] inline-block py-[0.5px] px-[2px]`}
                >
                  99+
                </span>
              </span>
            </button>
          </div>
          {/* ********Live Audiences section********* */}
          <LiveAudienceElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
          {/* *******Live Chats section************* */}
          <LiveChatElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
          {/* ******Controls for three Dots********** */}
          <ControlsDotsElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
          {/* ******Mic Requests section 2 ********** */}
          <MicRequestElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
          {/* ******Choose co-host********** */}
          <ChooseCoHostElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
          {/* ******Choose slide********** */}
          <ChooseSlideElement
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
            chooseSlide={chooseSlide}
          />
          {/* ******Poll********** */}
          <PollElement
            liveChatAudience={liveChatAudience}
            footerClass={footerClass}
            navigate={navigate}
            sideBar={sideBar}
            is768PxScreen={is768PxScreen}
            setLiveChatAudience={setLiveChatAudience}
            setSideBar={setSideBar}
            isHost={isHost}
            mic={mic}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
            cycleMicState={cycleMicState}
          />
        </div>
      </div>
    </>
  );
}



<!-- ////////////////////////////////////////////////tailwinf.config.mjs////////////////////////////////// -->
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/*", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        onxy: "#181818",
        brightWhite: "#fbfbfb",
        faintblack: "rgba(255, 255, 255, 0.5)",
        blur: "hsl(0 0% 100% / .05)",
        black101: "rgba(21, 21, 21, 0.5)",
        white25: "rgba(255, 255, 255, 0.5)",
        white10: "rgba(255, 255, 255, 0.1)",
        white70: "rgba(255, 255, 255, 0.7)",
        blue: "rgba(63, 100, 233, 0.43)",
        red: "rgba(233, 63, 63, 0.43)",
        golden: "hsla(43, 100%, 50%, 0.43)",
        dimeblack: "#0d0d0d",
        darkGray: "#808080",
        mediumGray: "rgba(128, 128, 128, 0.5)",
        lightGray: "#c5c5c5",
        borderDark: "#383737",
        lightBorder: "#ebebeb",
        body: "#FFFFF0",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))"
        },
        // primaryTwo: '#212A37',
        primaryTwo: {
          DEFAULT: "#191919",
          dark: "#191919", // Dark mode value
          light: "#FFFFF0" // Light mode value (primaryThree)
        },
        primaryThree: "#FFFFF0",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      boxShadow: {
        altShadow: "0px 0px 15px rgba(255,166,0,0.53)"
      },
      utilities: {
        baseSpace: "mt-5",
        baseFont: "sm",
        lineHeight: "leading-6",
        keyframes: {
          ping: {
            "75%, 100%": {
              content: "",
              transform: "scale(1)",
              opacity: "0"
            }
          },
          pinging: {
            "0%": {
              transform: "scale(1)",
              opacity: "1"
            },
            "50%": {
              transform: "scale(1.2)",
              opacity: "0.6"
            },
            "100%": {
              transform: "scale(1.5)",
              opacity: "0"
            }
          }
        },
        animation: {
          "ping-200": "ping 1s 200ms cubic-bezier(0, 0, 0.2, 1) infinite",
          pinging: "pinging 1s infinite"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)"
          },
          to: {
            height: "0"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      tall: {
        min: "2000px"
      },
      maxScreen: {
        max: "1050px"
      },
      maxScreenMobile: {
        max: "768px"
      },
      maxSmallMobile: {
        max: "468px"
      }
    },
    plugins: []
  },
  plugins: [require("tailwindcss-animate")]
};
