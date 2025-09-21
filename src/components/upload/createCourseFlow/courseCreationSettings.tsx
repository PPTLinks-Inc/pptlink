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
import useUser from "@/hooks/useUser";

export default function CourseCreationSettings() {
  // const data = useRouteLoaderData(ROUTER_ID) as CourseData;
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

  const creatorId = useCourseStore((state) => state.creatorId);
  const enrollmentDateFrom = useCourseStore(
    (state) => state.enrollmentDateFrom
  );
  const enrollmentDateTo = useCourseStore((state) => state.enrollmentDateTo);
  const startDate = useCourseStore((state) => state.startDate);
  const duration = useCourseStore((state) => state.duration);
  const categoryId = useCourseStore((state) => state.categoryId);

  const name = useCourseStore((state) => state.name);
  const description = useCourseStore((state) => state.description);
  const price = useCourseStore((state) => state.price);
  const freeCourse = useCourseStore((state) => state.free);
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

  if (creatorId !== userQuery.data?.id) {
    return (
      <div className="bg-slate-200 w-full h-full">
        <div className="text-primaryTwo container py-4">
          <h1 className="text-2xl font-bold">Course Creation Settings</h1>
          <p className="text-lg maxScreenMobile:text-md mt-2 ">Set up your course settings</p>
          <div className="space-y-4 mt-10 maxScreenMobile:w-full">
            <p className="text-lg maxScreenMobile:text-md font-bold">
              You do not have permission to view this page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-200 w-full h-full">
      <div className="text-primaryTwo container py-4">
        <h1 className="text-2xl font-bold">Course Creation Settings</h1>
        <p className="text-lg maxScreenMobile:text-md mt-2 ">Set up your course settings</p>

        <div className="space-y-4 mt-10 maxScreenMobile:w-full">
          <div className="space-y-4 mt-10 maxScreenMobile:w-full">
            <Label className="text-lg maxScreenMobile:text-md font-bold">Course Title</Label>

            <Input
              type="text"
              className="pl-2 border-[0.5px] border-black w-3/6 maxScreenMobile:w-full"
              value={name}
              onChange={(e) => updateValues(e.target.value, "name")}
            />
          </div>
          <div className="space-y-4 mt-10 maxScreenMobile:w-full">
            <Label className="text-lg maxScreenMobile:text-md font-bold">Course description</Label>

            <Textarea
              value={description}
              onChange={(e) => updateValues(e.target.value, "description")}
              className="pl-2 border-[0.5px] border-black w-3/6 maxScreenMobile:w-full"
            ></Textarea>
          </div>
          <div className="space-y-4 mt-10 maxScreenMobile:w-full">
            <Label className="text-lg maxScreenMobile:text-md font-bold">Course catergory</Label>

            <Select onValueChange={handleCategoryChange} value={categoryId}>
              <SelectTrigger className="w-3/6 maxScreenMobile:w-full border-[0.5px] border-black">
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
          {!freeCourse && (
            <div className="space-y-2 mt-2">
              <h3 className="text-lg maxScreenMobile:text-md font-bold">
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
              <div className="relative w-3/6 maxScreenMobile:w-full">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="₦4000.00"
                  min="4000"
                  className="pl-8 border-[0.5px] border-primaryTwo"
                  value={price}
                  onChange={(e) => {
                    updateValues(Number(e.target.value), "price");
                  }}
                  disabled={published}
                />
                <span className="absolute left-2 top-2">₦</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-10 maxScreenMobile:w-full">
          <h3 className="text-lg maxScreenMobile:text-md font-bold">Set your cohort dates</h3>

          <div className="w-3/6 maxScreenMobile:w-full">
            <div className="w-full flex gap-6 maxScreenMobile:flex-col">
              <div className="w-3/6 maxScreenMobile:w-full">
                <h5>Enrollment start date</h5>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-transparent border-[0.5px] border-black"
                      )}
                      disabled={published}
                    >
                      {enrollmentDateFrom ? (
                        formatDate(enrollmentDateFrom)
                      ) : (
                        <span>Pick an enrollment start date</span>
                      )}
                      <SlCalender className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={enrollmentDateFrom}
                      onSelect={(date) =>
                        date && updateValues(date, "enrollmentDateFrom")
                      }
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-3/6 maxScreenMobile:w-full">
                <h5>Enrollment end date</h5>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-transparent border-[0.5px] border-black"
                      )}
                      disabled={published}
                    >
                      {enrollmentDateTo ? (
                        formatDate(enrollmentDateTo)
                      ) : (
                        <span>Pick an enrollment end date</span>
                      )}
                      <SlCalender className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={enrollmentDateTo}
                      onSelect={(date) =>
                        date && updateValues(date, "enrollmentDateTo")
                      }
                      captionLayout="dropdown"
                      disabled={(date) => {
                        if (!enrollmentDateFrom) return true;
                        return date < enrollmentDateFrom;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-6">
              <h5>Start date</h5>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-transparent border-[0.5px] border-black"
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
                    onSelect={(date) => date && updateValues(date, "startDate")}
                    captionLayout="dropdown"
                    disabled={(date) => {
                      if (!enrollmentDateTo) return true;
                      return date < enrollmentDateTo;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <h5>Course duration</h5>
            <Select
              onValueChange={handleDurationChange}
              value={duration}
              disabled={published}
            >
              <SelectTrigger className="w-3/6 maxScreenMobile:w-full border-[0.5px] border-black">
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

        <div className="space-y-4 mt-10 maxScreenMobile:w-full">
          <h3 className="text-lg maxScreenMobile:text-md font-bold">Course Level</h3>
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

        <div className="space-y-4 mt-10 maxScreenMobile:w-full">
          <h3 className="text-lg maxScreenMobile:text-md font-bold">
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
            className="border-[0.5px] border-primaryTwo w-3/6 maxScreenMobile:w-full"
            value={maxStudents}
            onChange={(e) => {
              updateValues(Number(e.target.value), "maxStudents");
            }}
            disabled={published}
          />
          <p className="text-sm text-gray-600">Maximum allowed: 20,000</p>
        </div>

        <div className="space-y-4 mt-10 maxScreenMobile:w-full">
          <h3 className="text-lg maxScreenMobile:text-md font-bold">Course Thumbnail</h3>
          <div className="w-full flex flex-col gap-4">
            {thumbnail && (
              <div className="relative w-[18rem] maxScreenMobile:w-full aspect-[2/2.5] rounded-lg overflow-hidden border-[0.1px] shadow-white shadow-inner">
                <img
                  src={
                    typeof thumbnail === "string"
                      ? thumbnail
                      : URL.createObjectURL(thumbnail)
                  }
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
                  updateValues(file, "thumbnail");
                }
              }}
              className="border-[0.5px] border-primaryTwo w-3/6 maxScreenMobile:w-full cursor-pointer"
            />
            <p className="text-sm text-gray-600">
              Recommended size: 800x1000 pixels (2:2.5 aspect ratio)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
