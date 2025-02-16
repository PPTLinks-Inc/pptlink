import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUser } from "react-icons/fa6";
import { useCourseStore } from "@/store/courseStoreProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command";

type BankOption =
  | "Select Bank"
  | "FCMB"
  | "GT Bank"
  | "First Bank"
  | "Fidelity Bank";

// Define main state interface
interface AccountProfileDetails {
  accountName: string;
  accountNumber: string;
  bankName: BankOption;
  isValidAccount: boolean;
}

export default function CourseCreationProfile() {
  const instructors = useCourseStore((state) => state.instructor);

  const [accountProfileDetails, setAccountProfileDetails] =
    useState<AccountProfileDetails>({
      accountName: "",
      accountNumber: "",
      bankName: "Select Bank" as BankOption,
      isValidAccount: false
    });

  const isValidNumber = (value: string) => {
    return /^\d+$/.test(value) && Number(value) > 0;
  };

  return (
    <div className="bg-slate-200 w-full h-full">
      <div className="text-primaryTwo container py-4">
        <h1 className="text-2xl font-bold">Course Creation Profile</h1>
        <p className="text-lg mt-2 ">Set up your course profile</p>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">Pease enter your bank details</h3>
          <div className="relative w-3/6 maxScreenMobile:w-full">
            <Label htmlFor="accountName" className="text-sm">
              Account number
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="\d*{10}"
              min="0"
              value={accountProfileDetails.accountNumber}
              id="accountName"
              onChange={(e) =>
                setAccountProfileDetails((prev) => ({
                  ...prev,
                  accountNumber: e.target.value
                }))
              }
              placeholder="e.g 0123456789"
              className={`pl-2 border-[0.5px] mt-2 ${
                accountProfileDetails.accountNumber &&
                isValidNumber(accountProfileDetails.accountNumber)
                  ? "border-[#FFA500]"
                  : "border-primaryTwo"
              }`}
            />
          </div>

          <div className="mt-10">
            <Label htmlFor="accountName" className="text-sm pb-2">
              Select bank name
            </Label>
            <Select
              value={accountProfileDetails.bankName}
              onValueChange={(value: BankOption) =>
                setAccountProfileDetails((prev) => ({
                  ...prev,
                  bankName: value
                }))
              }
            >
              <SelectTrigger
                className={`border-[0.5px] mt-2 ${
                  accountProfileDetails.bankName !== "Select Bank"
                    ? "border-[#FFA500]"
                    : "border-primaryTwo"
                } w-3/6 maxScreenMobile:w-full`}
              >
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Bank">Select Bank</SelectItem>
                <SelectItem value="FCMB">FCMB</SelectItem>
                <SelectItem value="First Bank">First Bank</SelectItem>
                <SelectItem value="Fidelity Bank">Fidelity Bank</SelectItem>
                <SelectItem value="GT Bank">GT Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className={`text-green-700 font-bold text-lg`}>
            Found ✔ Raymond Amem Aondoakura
          </p>
        </div>

        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-bold">Instructor(s) Details</h3>
          {instructors.map((instructor, index) => (
            <Card
              key={instructor.id}
              className="bg-slate-200 shadow-primaryTwo"
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Instructor {index + 1}</span>
                  {instructors.length > 1 && index + 1 !== 1 && (
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    {index + 1 === 1 ? (
                      <img
                        src="../../../../public/team/imoh.jpg"
                        alt="imoh knight"
                        className="block w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser size="80" className="block" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id={`image-upload-${instructor.id}`}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document
                          .getElementById(`image-upload-${instructor.id}`)
                          ?.click()
                      }
                      className={`${index + 1 >= 2 && "pointer-events-none cursor-not-allowed bg-black/20"}`}
                    >
                      Select Image
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 ">
                    <Label htmlFor={`name-${instructor.id}`}>Full Name</Label>
                    <div className="w-full">
                      <Input
                        id={`name-${instructor.id}`}
                        value={instructor.user.username}
                        placeholder="Full Name"
                        className="border-[0.5px] border-primaryTwo"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`email-${instructor.id}`}>
                      Email Address
                    </Label>
                    <div className="w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="border-[0.5px] border-primaryTwo w-full bg-transparent"
                          >
                            <span className="truncate w-full text-left">
                              {instructor.user.email}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[500px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search Email..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No email found.</CommandEmpty>
                              <CommandGroup>

                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div
                    className={`space-y-2 ${index + 1 >= 2 && "pointer-events-none cursor-not-allowed"}`}
                  >
                    <Label htmlFor={`role-${instructor.id}`}>Role/Title</Label>
                    <div
                      className={`w-full relative ${index + 1 >= 2 && "overflow-hidden !border-0 !rounded !before:border-0 !before:rounded before:!absolute before:!block before:!top-0 before:!left-0 before:!right-0 before:!bottom-0 before:!bg-black/20"}`}
                    >
                      <Input
                        id={`role-${instructor.id}`}
                        value={instructor.role}
                        placeholder="Role/Title"
                        className="border-[0.5px] border-primaryTwo"
                      />
                    </div>
                  </div>
                  <div
                    className={`space-y-2 ${index + 1 >= 2 && "pointer-events-none cursor-not-allowed"}`}
                  >
                    <Label htmlFor={`experience-${instructor.id}`}>
                      Experience
                    </Label>
                    <div
                      className={`w-full relative ${index + 1 >= 2 && "overflow-hidden !border-0 !rounded !before:border-0 !before:rounded before:!absolute before:!block before:!top-0 before:!left-0 before:!right-0 before:!bottom-0 before:!bg-black/20"}`}
                    >
                      <Select value={instructor.experience}>
                        <SelectTrigger
                          id={`experience-${instructor.id}`}
                          className="border-[0.5px] border-primaryTwo"
                        >
                          <SelectValue placeholder="Select Experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=" ">Select Experience</SelectItem>
                          {[1, 2, 3, 4, 5, "5+", "10+"].map((years) => (
                            <SelectItem key={years} value={years.toString()}>
                              {years} years
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div
                  className={`space-y-2 ${index + 1 >= 2 && "pointer-events-none cursor-not-allowed"}`}
                >
                  <Label htmlFor={`biography-${instructor.id}`}>
                    Biography
                  </Label>
                  <div
                    className={`w-full relative ${index + 1 >= 2 && "overflow-hidden !border-0 !rounded !before:border-0 !before:rounded before:!absolute before:!block before:!top-0 before:!left-0 before:!right-0 before:!bottom-0 before:!bg-black/20"}`}
                  >
                    <Textarea
                      id={`biography-${instructor.id}`}
                      value={instructor.bio}
                      placeholder="Enter instructor biography..."
                      className="min-h-[100px] resize-none border-[0.5px] border-primaryTwo"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button className="w-full">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Instructor
          </Button>
        </div>
      </div>
    </div>
  );
}
