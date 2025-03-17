import { useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlCalender } from "react-icons/sl";
import formatDate from "@/lib/formatDate";
import { useCourseStore } from "@/store/courseStoreProvider";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { standardFetch } from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CourseData } from "@/store/courseStore";
import { ROUTER_ID } from "@/constants/routes";
import { useRouteLoaderData } from "react-router-dom";
import useUser from "@/hooks/useUser";

export default function CourseCreationSettings() {
  const data = useRouteLoaderData(ROUTER_ID) as CourseData;
  const { userQuery } = useUser();
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await standardFetch.get<{ id: string; name: string }[]>(
        "/api/v1/ppt/categories"
      );

      return data;
    }
  });

  const enrollmentDateFrom = useCourseStore((state) => state.enrollmentDateFrom);
  const enrollmentDateTo = useCourseStore((state) => state.enrollmentDateTo);

  const enrollmentDate = useMemo(function () {
    return {
      from: enrollmentDateFrom,
      to: enrollmentDateTo
    };
  }, [enrollmentDateFrom, enrollmentDateTo]);

  const startDate = useCourseStore((state) => state.startDate);
  const duration = useCourseStore((state) => state.duration);
  const categoryId = useCourseStore((state) => state.categoryId);

  const name = useCourseStore((state) => state.name);
  const description = useCourseStore((state) => state.description);
  const price = useCourseStore((state) => state.price);
  const courseLevel = useCourseStore((state) => state.courseLevel);
  const maxStudents = useCourseStore((state) => state.maxStudents);
  const thumbnail = useCourseStore((state) => state.thumbnail);
  const published = useCourseStore((state) => state.published);

  const updateValues = useCourseStore((state) => state.updateValues);

  const courseDurationValues = useMemo(function () {
    return [
      {
        id: "ONE_WEEK",
        value: "1 week"
      },
      {
        id: "TWO_WEEKS",
        value: "2 weeks"
      },
      {
        id: "ONE_MONTH",
        value: "1 month"
      },
      {
        id: "TWO_MONTHS",
        value: "2 months"
      },
      {
        id: "THREE_MONTHS",
        value: "3 months"
      },
      {
        id: "FOUR_MONTHS",
        value: "4 months"
      },
      {
        id: "SIX_MONTHS",
        value: "6 months"
      },
      {
        id: "EIGHT_MONTHS",
        value: "8 months"
      },
      {
        id: "ONE_YEAR",
        value: "1 year"
      },
      {
        id: "TWO_YEARS",
        value: "2 years"
      }
    ];
  }, []);

  const isValidNumber = (value: string) => {
    return /^\d+$/.test(value) && Number(value) > 0;
  };

  // Add memoization for course category selection handler
  const handleCategoryChange = useCallback(
    (value: string) => {
      updateValues(value, "categoryId");
    },
    [updateValues]
  );

  // Add memoization for duration selection handler
  const handleDurationChange = useCallback(
    (value: string) => {
      updateValues(value, "duration");
    },
    [updateValues]
  );


  if (data.creatorId !== userQuery.data?.id) {
    return (
      <div className="bg-slate-200 w-full h-full">
        <div className="text-primaryTwo container py-4">
          <h1 className="text-2xl font-bold">Course Creation Settings</h1>
          <p className="text-lg mt-2 ">Set up your course settings</p>
          <div className="space-y-4 mt-10">
            <p className="text-lg font-bold">
              You do not have permission to view this page
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-200 w-full h-full">
      <div className="text-primaryTwo container py-4">
        <h1 className="text-2xl font-bold">Course Creation Settings</h1>
        <p className="text-lg mt-2 ">Set up your course settings</p>

        <div className="space-y-4 mt-10">
          <div className="space-y-4 mt-10">
            <Label className="text-lg font-bold">Course Title</Label>

            <Input
              type="text"
              className="pl-2 border-[0.5px] border-black w-3/6 maxScreenMobile:w/full"
              value={name}
              onChange={(e) => updateValues(e.target.value, "name")}
            />
          </div>
          <div className="space-y-4 mt-10">
            <Label className="text-lg font-bold">Course description</Label>

            <Textarea value={description} onChange={(e) => updateValues(e.target.value, "description")} className="pl-2 border-[0.5px] border-black w-3/6 maxScreenMobile:w/full"></Textarea>
          </div>
          <div className="space-y-4 mt-10">
            <Label className="text-lg font-bold">Course catergory</Label>

            <Select onValueChange={handleCategoryChange} value={categoryId}>
              <SelectTrigger className="w-3/6 maxScreenMobile:w/full border-[0.5px] border-black">
                <SelectValue
                  placeholder={
                    categoriesQuery.isLoading ? "Loading" : "Select category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    {categoriesQuery.isLoading ? "Loading" : "Select category"}
                  </SelectLabel>
                  {categoriesQuery.data?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 mt-2">
            <h3 className="text-lg font-bold">
              Please input the currency in which your course should be charged
            </h3>
            <div className="flex space-x-4">
              <Label className="flex items-center">
                <Input
                  type="radio"
                  name="currency"
                  value="naira"
                  checked={true}
                  className="mr-2 w-[1.5rem] h-[1.5rem] border-[1.5px] border-primaryTwo"
                  disabled={published}
                />
                Naira (₦)
              </Label>
              <Label className="flex items-center">
                <Input
                  type="radio"
                  name="currency"
                  value="usd"
                  disabled
                  checked={false}
                  className="mr-2 w-[1.5rem] h-[1.5rem] border-[1.5px] border-primaryTwo"
                />
                USD ($)
              </Label>
            </div>
            <div className="relative w-3/6 maxScreenMobile:w/full">
              <Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                min="4000"
                placeholder="₦4000.00"
                className="pl-8 border-[0.5px] border-primaryTwo"
                value={price}
                onChange={(e) => {
                  if (isValidNumber(e.target.value)) {
                    updateValues(Number(e.target.value), "price");
                  }
                }}
                disabled={published}
              />
              <span className="absolute left-2 top-2">₦</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">Set your cohort dates</h3>

          <div>
            <h5>Enrollment date</h5>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-3/6 maxScreenMobile:w/full pl-3 text-left font-normal bg-transparent border-[0.5px] border-black"
                  )}
                  disabled={published}
                >
                  {enrollmentDate.from && enrollmentDate.to ? (
                    <>
                      {formatDate(enrollmentDate.from)} -{" "}
                      {formatDate(enrollmentDate.to)}
                    </>
                  ) : (
                    <span>Pick an enrollment dates</span>
                  )}
                  <SlCalender className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={enrollmentDate}
                  onSelect={(e) => {
                    e &&
                      updateValues(e?.from ?? new Date(), "enrollmentDateFrom");
                    updateValues(e?.to ?? new Date(), "enrollmentDateTo");
                  }}
                  initialFocus
                  numberOfMonths={2}
                  disabled={(function(date) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return new Date(date) < today;
                  })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h5>Start date</h5>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-3/6 maxScreenMobile:w/full pl-3 text-left font-normal bg-transparent border-[0.5px] border-black"
                  )}
                  disabled={published}
                >
                  {startDate ? (
                    formatDate(startDate)
                  ) : (
                    <span>Pick a start date</span>
                  )}
                  <SlCalender className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(e) => e && updateValues(e, "startDate")}
                  initialFocus
                  disabled={(function(date) {
                    return new Date(enrollmentDate.to) > new Date(date) || new Date(enrollmentDate.from) > new Date(date);
                  })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h5>Course duration</h5>
            <Select onValueChange={handleDurationChange} value={duration} disabled={published}>
              <SelectTrigger className="w-3/6 maxScreenMobile:w/full border-[0.5px] border-black">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select duration</SelectLabel>
                  {courseDurationValues.map((duration) => (
                    <SelectItem key={duration.id} value={duration.id}>
                      {duration.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">Course Level</h3>
          <div className="flex space-x-4">
            {["BEGINNER", "INTERMEDIATE", "EXPERT"].map((level) => (
              <Label key={level} className="flex items-center">
                <Input
                  type="radio"
                  name="courseLevel"
                  value={level}
                  className="mr-2 w-[1.5rem] h-[1.5rem] border-[1.5px] border-primaryTwo"
                  checked={courseLevel === level}
                  onChange={() => updateValues(level, "courseLevel")}
                />
                <span className="capitalize">{level}</span>
              </Label>
            ))}
          </div>
        </div>

        

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">
            Please input the maximum amount of students that is allowed to take
            the course
          </h3>
          <Input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            min="1"
            max="20000"
            placeholder="Leave blank for unlimited"
            className="border-[0.5px] border-primaryTwo w-3/6 maxScreenMobile:w/full"
            value={maxStudents}
            onChange={(e) => {
              if (isValidNumber(e.target.value)) {
                updateValues(Number(e.target.value), "maxStudents");
              }
            }}
            disabled={published}
          />
          <p className="text-sm text-gray-600">Maximum allowed: 20,000</p>
        </div>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">Course Thumbnail</h3>
          <div className="flex flex-col gap-4">
            {thumbnail && (
              <div className="relative w-[18rem] aspect-[2/2.5] rounded-lg overflow-hidden border-[0.1px] shadow-white shadow-inner">
                <img
                  src={typeof thumbnail === 'string' ? thumbnail : URL.createObjectURL(thumbnail)}
                  alt="Course thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primaryTwo/25"></div>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  updateValues(file, 'thumbnail');
                }
              }}
              className="border-[0.5px] border-primaryTwo w-3/6 maxScreenMobile:w/full cursor-pointer"
            />
            <p className="text-sm text-gray-600">Recommended size: 800x1000 pixels (2:2.5 aspect ratio)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
