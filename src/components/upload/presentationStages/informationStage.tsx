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
