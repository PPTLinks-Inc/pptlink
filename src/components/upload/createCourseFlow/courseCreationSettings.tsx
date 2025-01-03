import { useState } from "react";
// import Image from 'next/image';
// import {
//   BookOpen,
//   HelpCircle,
//   Settings,
//   User,
//   Bell,
//   Menu,
//   PlusIcon,
//   Save,
//   Send,
//   DollarSign,
//   Calendar,
//   CreditCard,
//   Users,
//   Briefcase,
//   GraduationCap,
//   Lock,
//   Eye,
//   Trash2
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter
// } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger
// } from "@/components/ui/tooltip";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DeadlineOption = "never" | "1week" | "2weeks" | "1month";

export default function CourseCreationSettings() {
  const [courseSettings, setCourseSettings] = useState({
    pricing: { currency: "naira", amount: "" },
    registration: {
      deadline: "never" as DeadlineOption,
      calculatedDate: null as string | null
    },
    paymentInfo: "",
    courseLevel: "beginner",
    maxParticipants: "",
    instructors: [
      {
        id: 1,
        name: "",
        email: "",
        role: "",
        experience: "",
        expertise: [],
        biography: "",
        profileImage: null
      }
    ]
  });

  const calculateDeadlineDate = (deadline: DeadlineOption): string | null => {
    if (deadline === "never") return null;
    const date = new Date();
    switch (deadline) {
      case "1week":
        date.setDate(date.getDate() + 7);
        break;
      case "2weeks":
        date.setDate(date.getDate() + 14);
        break;
      case "1month":
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        return null;
    }
    return date.toLocaleDateString();
  };

  const isValidNumber = (value: string) => {
    return /^\d+$/.test(value) && Number(value) > 0;
  };

  return (
    <div className="bg-slate-200 w-full h-full">
      <div className="text-primaryTwo container py-4">
        <h1 className="text-2xl font-bold">Course Creation Settings</h1>
        <p className="text-lg mt-2 ">Set up your course settings</p>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">
            Please input the currency in which your course should be charged
          </h3>
          <div className="space-y-2 mt-2">
            <div className="flex space-x-4">
              <Label className="flex items-center">
                <Input
                  type="radio"
                  name="currency"
                  value="naira"
                  checked={courseSettings.pricing.currency === "naira"}
                  onChange={(e) =>
                    setCourseSettings((prevSettings) => ({
                      ...prevSettings,
                      pricing: {
                        ...prevSettings.pricing,
                        currency: e.target.value
                      }
                    }))
                  }
                  className={`mr-2 w-[1.5rem] h-[1.5rem] border-[1.5px] ${courseSettings.pricing.currency === "naira" ? "border-[#FFA500]" : "border-primaryTwo"}`}
                />
                Naira (₦)
              </Label>
              <Label className="flex items-center">
                <Input
                  type="radio"
                  name="currency"
                  value="usd"
                  checked={courseSettings.pricing.currency === "usd"}
                  onChange={(e) =>
                    setCourseSettings((prevSettings) => ({
                      ...prevSettings,
                      pricing: {
                        ...prevSettings.pricing,
                        currency: e.target.value
                      }
                    }))
                  }
                  className={`mr-2 w-[1.5rem] h-[1.5rem] border-[1.5px] ${courseSettings.pricing.currency === "usd" ? "border-[#FFA500]" : "border-primaryTwo"}`}
                />
                USD ($)
              </Label>
            </div>
            <div className="relative w-3/6 maxScreenMobile:w-full">
              <Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                min="0"
                value={courseSettings.pricing.amount}
                onChange={(e) =>
                  setCourseSettings((prevSettings) => ({
                    ...prevSettings,
                    pricing: { ...prevSettings.pricing, amount: e.target.value }
                  }))
                }
                placeholder={
                  courseSettings.pricing.currency === "naira"
                    ? "₦0.00"
                    : "$0.00"
                }
                className={`pl-8 border-[0.5px] ${
                  courseSettings.pricing.amount &&
                  isValidNumber(courseSettings.pricing.amount)
                    ? "border-[#FFA500]"
                    : "border-primaryTwo"
                }`}
              />
              <span className="absolute left-2 top-2">
                {courseSettings.pricing.currency === "naira" ? "₦" : "$"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">
            Please input the expiration deadline for the course
          </h3>
          <Select
            value={courseSettings.registration.deadline}
            onValueChange={(value: DeadlineOption) =>
              setCourseSettings((prevSettings) => ({
                ...prevSettings,
                registration: {
                  ...prevSettings.registration,
                  deadline: value,
                  calculatedDate: calculateDeadlineDate(value)
                }
              }))
            }
          >
            <SelectTrigger
              className={`border-[0.5px] ${courseSettings.registration.deadline ? "border-[#FFA500]" : "border-primaryTwo"} w-3/6 maxScreenMobile:w-full`}
            >
              <SelectValue placeholder="Select deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never (Always Open)</SelectItem>
              <SelectItem value="1week">1 Week</SelectItem>
              <SelectItem value="2weeks">2 Weeks</SelectItem>
              <SelectItem value="1month">1 Month</SelectItem>
            </SelectContent>
            {courseSettings.registration.calculatedDate && (
              <p className="text-sm text-gray-600">
                Registration closes on:{" "}
                {courseSettings.registration.calculatedDate}
              </p>
            )}
          </Select>
        </div>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">Course Level</h3>
          <div className="flex space-x-4">
            {["beginner", "intermediate", "expert"].map((level) => (
              <Label key={level} className="flex items-center">
                <Input
                  type="radio"
                  name="courseLevel"
                  value={level}
                  checked={courseSettings.courseLevel === level}
                  onChange={(e) =>
                    setCourseSettings((prevSettings) => ({
                      ...prevSettings,
                      courseLevel: e.target.value
                    }))
                  }
                  className="mr-2 border-[0.5px] border-primaryTwo"
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
            value={courseSettings.maxParticipants}
            onChange={(e) =>
              setCourseSettings((prevSettings) => ({
                ...prevSettings,
                maxParticipants: e.target.value
              }))
            }
            placeholder="Leave blank for unlimited"
            className={`border-[0.5px] ${courseSettings.maxParticipants && isValidNumber(courseSettings.maxParticipants) ? "border-[#FFA500]" : "border-primaryTwo"} w-3/6 maxScreenMobile:w-full`}
          />
          <p className="text-sm text-gray-600">Maximum allowed: 20,000</p>
        </div>
      </div>
    </div>
  );
}
