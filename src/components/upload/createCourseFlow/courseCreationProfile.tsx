import { useState, useCallback } from "react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingAssetSmall } from "@/assets/assets";

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

interface InstructorSearchResult {
  id: string;
  email: string;
  username: string;
}

export default function CourseCreationProfile() {
  const instructors = useCourseStore((state) => state.instructors);
  const addInstructor = useCourseStore((state) => state.addInstructor);
  const removeInstructor = useCourseStore((state) => state.removeInstructor);
  const updateInstructor = useCourseStore((state) => state.updateInstructor);

  const handleInputChange = (instructorId: string, field: string, value: string) => {
    updateInstructor(instructorId, {
      [field]: value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, instructorId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      updateInstructor(instructorId, {
        photo: file
      });
    };
    reader.readAsDataURL(file);
  };

  const [accountProfileDetails, setAccountProfileDetails] =
    useState<AccountProfileDetails>({
      accountName: "",
      accountNumber: "",
      bankName: "Select Bank" as BankOption,
      isValidAccount: false
    });

  const [searchEmail, setSearchEmail] = useState("");
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorSearchResult | null>(null);

  const instructorSearchQuery = useQuery({
    queryKey: ["instructorSearch", searchEmail],
    queryFn: async () => {
      if (!searchEmail) return [];
      const { data } = await authFetch.get<InstructorSearchResult[]>(
        `/api/v1/course/search-instructor?instructorEmail=${searchEmail}`
      );
      return data;
    },
    enabled: searchEmail.length > 0
  });

  const handleSearch = useCallback((value: string) => {
    setSearchEmail(value);
  }, []);

  const debouncedSearch = useDebounce(handleSearch, 500);

  const isValidNumber = (value: string) => {
    return /^\d+$/.test(value) && Number(value) > 0;
  };

  const handleSaveInstructor = async () => {
    if (!selectedInstructor) return;

    try {
      await addInstructor(selectedInstructor.id);
      setSelectedInstructor(null);
      setSearchEmail("");
    } catch (error) {
      console.error("Failed to add instructor:", error);
    }
  };

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add instructor</DialogTitle>
          <DialogDescription>
            Search for an instructor by email address.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Search with email"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {instructorSearchQuery.isLoading && (
              <div className="flex justify-center">
                <LoadingAssetSmall />
              </div>
            )}
            {instructorSearchQuery.data?.length === 0 && searchEmail && (
              <p className="text-sm text-gray-500">No instructors found</p>
            )}
            {instructorSearchQuery.data?.map((instructor) => (
              <Label
                key={instructor.id}
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <Input
                  type="radio"
                  name="instructor"
                  value={instructor.id}
                  checked={selectedInstructor?.id === instructor.id}
                  onChange={() => setSelectedInstructor(instructor)}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium">{instructor.username}</p>
                  <p className="text-sm text-gray-500">{instructor.email}</p>
                </div>
              </Label>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={!selectedInstructor}
              onClick={handleSaveInstructor}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
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
            {instructors.map(({ id: instructorId, instructor, status }, index) => (
              <Card
                key={instructorId}
                className="bg-slate-200 shadow-primaryTwo"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Instructor {index + 1}</span>
                      {status === "PENDING" && (
                      <span className="text-yellow-500 text-sm">(Pending Invite)</span>
                      )}
                      {status === "REJECTED" && (
                      <span className="text-red-500 text-sm">(Rejected Invite)</span>
                      )}
                    </div>
                    {index !== 0 && (
                      <Button variant="destructive" size="sm" onClick={() => removeInstructor(instructorId)}>
                        Remove
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      {instructor.photo ? (
                        <img
                          src={typeof instructor.photo === 'string' ? instructor.photo : URL.createObjectURL(instructor.photo)}
                          alt="Instructor Profile image"
                          className="block w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser size="80" className="block" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id={`image-upload-${instructorId}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, instructorId)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById(`image-upload-${instructorId}`)
                            ?.click()
                        }
                        disabled={status !== "APPROVED"}
                      >
                        Select Image
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 ">
                      <Label htmlFor={`name-${instructorId}`}>Full Name</Label>
                      <div className="w-full">
                        <Input
                          id={`name-${instructorId}`}
                          value={instructor.user.username}
                          placeholder="Full Name"
                          className="border-[0.5px] border-primaryTwo"
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`email-${instructorId}`}>
                        Email Address
                      </Label>
                      <div className="w-full">
                        <Input
                          id={`email-${instructorId}`}
                          value={instructor.user.email}
                          placeholder="Email Address"
                          className="border-[0.5px] border-primaryTwo"
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    <div
                      className="space-y-2"
                    >
                      <Label htmlFor={`role-${instructorId}`}>Role/Title</Label>
                      <div
                        className="w-full"
                      >
                        <Input
                          id={`role-${instructorId}`}
                          value={instructor.role || ''}
                          placeholder="Role/Title"
                          className="border-[0.5px] border-primaryTwo"
                          disabled={status !== "APPROVED"}
                          onChange={(e) => handleInputChange(instructorId, 'role', e.target.value)}
                        />
                      </div>
                    </div>
                    <div
                      className="space-y-2"
                    >
                      <Label htmlFor={`experience-${instructorId}`}>
                        Experience
                      </Label>
                      <div
                        className="w-full"
                      >
                        <Select 
                          value={instructor.experience || ''}
                          onValueChange={(value) => handleInputChange(instructorId, 'experience', value)}
                          disabled={status !== "APPROVED"}
                        >
                          <SelectTrigger
                            id={`experience-${instructorId}`}
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
                    className="space-y-2"
                  >
                    <Label htmlFor={`biography-${instructorId}`}>
                      Biography
                    </Label>
                    <div
                      className="w-full"
                    >
                      <Textarea
                        id={`biography-${instructorId}`}
                        value={instructor.bio || ''}
                        placeholder="Enter instructor biography..."
                        className="min-h-[100px] resize-none border-[0.5px] border-primaryTwo"
                        disabled={status !== "APPROVED"}
                        onChange={(e) => handleInputChange(instructorId, 'bio', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Instructor
              </Button>
            </DialogTrigger>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
