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

type BankOption =
  | "Select Bank"
  | "FCMB"
  | "GT Bank"
  | "First Bank"
  | "Fidelity Bank";

export default function CourseCreationProfile() {
  const [accountDetails, setAccountDetails] = useState({
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
              value={accountDetails.accountNumber}
              id="accountName"
              onChange={(e) =>
                setAccountDetails((prev) => ({
                  ...prev,
                  accountNumber: e.target.value
                }))
              }
              placeholder="e.g 0123456789"
              className={`pl-2 border-[0.5px] mt-2 ${
                accountDetails.accountNumber &&
                isValidNumber(accountDetails.accountNumber)
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
              value={accountDetails.bankName}
              onValueChange={(value: BankOption) =>
                setAccountDetails((prev) => ({
                  ...prev,
                  bankName: value
                }))
              }
            >
              <SelectTrigger
                className={`border-[0.5px] mt-2 ${
                  accountDetails.bankName !== "Select Bank"
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
          instructors section
        </div>
      </div>
    </div>
  );
}
