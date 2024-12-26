export default function DummyPageForNow() {

  return (<>Coming Soon</>)
}
// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
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

// const Icon = ({ type }) => {
//   const iconStyles = "w-6 h-6 text-gray-600";

//   switch (type) {
//     case "video":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className={iconStyles}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//           />
//         </svg>
//       );
//     case "document":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className={iconStyles}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//       );
//     case "quiz":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className={iconStyles}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
//           />
//         </svg>
//       );
//     case "text":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className={iconStyles}
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//       );
//     default:
//       return null;
//   }
// };

// const CourseCreationWorkflow = () => {
//   const contentTypes = [
//     { icon: "video", label: "Video Lecture", type: "video" },
//     { icon: "document", label: "Resource Document", type: "document" },
//     { icon: "quiz", label: "Quiz", type: "quiz" },
//     { icon: "text", label: "Text Lesson", type: "text" }
//   ];

//   const [sections, setSections] = useState([
//     { id: 1, title: "Introduction to the Course", content: [] }
//   ]);

//   const [activeSection, setActiveSection] = useState(null);
//   const [previewMode, setPreviewMode] = useState(false);

//   const [courseSettings, setCourseSettings] = useState({
//     pricing: { currency: "naira", amount: "" },
//     registration: { deadline: "never", calculatedDate: null },
//     paymentInfo: "",
//     courseLevel: "beginner",
//     maxParticipants: "",
//     instructors: [
//       {
//         id: 1,
//         name: "",
//         email: "",
//         role: "",
//         experience: "",
//         expertise: [],
//         biography: "",
//         profileImage: null
//       }
//     ]
//   });

//   const calculateDeadlineDate = (deadline) => {
//     if (deadline === "never") return null;
//     const date = new Date();
//     switch (deadline) {
//       case "1week":
//         date.setDate(date.getDate() + 7);
//         break;
//       case "2weeks":
//         date.setDate(date.getDate() + 14);
//         break;
//       case "1month":
//         date.setMonth(date.getMonth() + 1);
//         break;
//       default:
//         return null;
//     }
//     return date.toLocaleDateString();
//   };

//   const addInstructor = () => {
//     setCourseSettings((prevSettings) => ({
//       ...prevSettings,
//       instructors: [
//         ...prevSettings.instructors,
//         {
//           id: prevSettings.instructors.length + 1,
//           name: "",
//           email: "",
//           role: "",
//           experience: "",
//           expertise: [],
//           biography: "",
//           profileImage: null
//         }
//       ]
//     }));
//   };

//   const removeInstructor = (id) => {
//     setCourseSettings((prevSettings) => ({
//       ...prevSettings,
//       instructors: prevSettings.instructors.filter(
//         (instructor) => instructor.id !== id
//       )
//     }));
//   };

//   const updateInstructor = (id, field, value) => {
//     setCourseSettings((prevSettings) => ({
//       ...prevSettings,
//       instructors: prevSettings.instructors.map((instructor) =>
//         instructor.id === id ? { ...instructor, [field]: value } : instructor
//       )
//     }));
//   };

//   const configSections = [
//     {
//       id: "pricing",
//       title: "Course Pricing",
//       icon: DollarSign,
//       content: () => (
//         <div className="space-y-4">
//           <h3 className="text-lg font-bold">
//             Please input the currency in which your course should be charged
//           </h3>
//           <div className="space-y-2">
//             <div className="flex space-x-4">
//               <Label className="flex items-center">
//                 <Input
//                   type="radio"
//                   name="currency"
//                   value="naira"
//                   checked={courseSettings.pricing.currency === "naira"}
//                   onChange={(e) =>
//                     setCourseSettings((prevSettings) => ({
//                       ...prevSettings,
//                       pricing: {
//                         ...prevSettings.pricing,
//                         currency: e.target.value
//                       }
//                     }))
//                   }
//                   className="mr-2"
//                 />
//                 Naira (₦)
//               </Label>
//               <Label className="flex items-center">
//                 <Input
//                   type="radio"
//                   name="currency"
//                   value="usd"
//                   checked={courseSettings.pricing.currency === "usd"}
//                   onChange={(e) =>
//                     setCourseSettings((prevSettings) => ({
//                       ...prevSettings,
//                       pricing: {
//                         ...prevSettings.pricing,
//                         currency: e.target.value
//                       }
//                     }))
//                   }
//                   className="mr-2"
//                 />
//                 USD ($)
//               </Label>
//             </div>
//             <div className="relative">
//               <Input
//                 type="number"
//                 min="0"
//                 value={courseSettings.pricing.amount}
//                 onChange={(e) =>
//                   setCourseSettings((prevSettings) => ({
//                     ...prevSettings,
//                     pricing: { ...prevSettings.pricing, amount: e.target.value }
//                   }))
//                 }
//                 placeholder={
//                   courseSettings.pricing.currency === "naira"
//                     ? "₦0.00"
//                     : "$0.00"
//                 }
//                 className="pl-8"
//               />
//               <span className="absolute left-2 top-2">
//                 {courseSettings.pricing.currency === "naira" ? "₦" : "$"}
//               </span>
//             </div>
//           </div>
//         </div>
//       )
//     },
//     {
//       id: "registration",
//       title: "Registration Settings",
//       icon: Calendar,
//       content: () => (
//         <div className="space-y-4">
//           <h3 className="text-lg font-bold">
//             Please input the expiration deadline for the course
//           </h3>
//           <Select
//             value={courseSettings.registration.deadline}
//             onValueChange={(value) =>
//               setCourseSettings((prevSettings) => ({
//                 ...prevSettings,
//                 registration: {
//                   ...prevSettings.registration,
//                   deadline: value,
//                   calculatedDate: calculateDeadlineDate(value)
//                 }
//               }))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select deadline" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="never">Never (Always Open)</SelectItem>
//               <SelectItem value="1week">1 Week</SelectItem>
//               <SelectItem value="2weeks">2 Weeks</SelectItem>
//               <SelectItem value="1month">1 Month</SelectItem>
//             </SelectContent>
//           </Select>
//           {courseSettings.registration.calculatedDate && (
//             <p className="text-sm text-gray-600">
//               Registration closes on:{" "}
//               {courseSettings.registration.calculatedDate}
//             </p>
//           )}
//         </div>
//       )
//     },
//     {
//       id: "payment",
//       title: "Payment Information",
//       icon: CreditCard,
//       content: () => (
//         <div className="flex justify-end">
//           <PaymentDetailsForm />
//         </div>
//       )
//     },
//     {
//       id: "level",
//       title: "Course Level",
//       icon: GraduationCap,
//       content: () => (
//         <div className="space-y-4">
//           <h3 className="text-lg font-bold">Course Level</h3>
//           <div className="flex space-x-4">
//             {["beginner", "intermediate", "expert"].map((level) => (
//               <Label key={level} className="flex items-center">
//                 <Input
//                   type="radio"
//                   name="courseLevel"
//                   value={level}
//                   checked={courseSettings.courseLevel === level}
//                   onChange={(e) =>
//                     setCourseSettings((prevSettings) => ({
//                       ...prevSettings,
//                       courseLevel: e.target.value
//                     }))
//                   }
//                   className="mr-2"
//                 />
//                 <span className="capitalize">{level}</span>
//               </Label>
//             ))}
//           </div>
//         </div>
//       )
//     },
//     {
//       id: "participants",
//       title: "Maximum Participants",
//       icon: Users,
//       content: () => (
//         <div className="space-y-4">
//           <h3 className="text-lg font-bold">
//             Please input the maximum amount of students that is allowed to take
//             the course
//           </h3>
//           <Input
//             type="number"
//             min="1"
//             max="20000"
//             value={courseSettings.maxParticipants}
//             onChange={(e) =>
//               setCourseSettings((prevSettings) => ({
//                 ...prevSettings,
//                 maxParticipants: e.target.value
//               }))
//             }
//             placeholder="Leave blank for unlimited"
//           />
//           <p className="text-sm text-gray-600">Maximum allowed: 20,000</p>
//         </div>
//       )
//     },
//     {
//       id: "instructors",
//       title: "Instructor Information",
//       icon: Briefcase,
//       content: () => (
//         <div className="space-y-4">
//           <h3 className="text-lg font-bold">Instructor Details</h3>
//           {courseSettings.instructors.map((instructor, index) => (
//             <Card key={instructor.id}>
//               <CardHeader>
//                 <CardTitle className="flex justify-between items-center">
//                   <span>Instructor {index + 1}</span>
//                   {courseSettings.instructors.length > 1 && (
//                     <Button
//                       onClick={() => removeInstructor(instructor.id)}
//                       variant="destructive"
//                       size="sm"
//                     >
//                       Remove
//                     </Button>
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="relative w-20 h-20 rounded-full overflow-hidden">
//                     <Image
//                       src={
//                         instructor.profileImage ||
//                         "/placeholder.svg?height=80&width=80"
//                       }
//                       alt={`${instructor.name || "Instructor"} profile`}
//                       layout="fill"
//                       objectFit="cover"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="file"
//                       id={`image-upload-${instructor.id}`}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={(e) => handleImageUpload(instructor.id, e)}
//                     />
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() =>
//                         document
//                           .getElementById(`image-upload-${instructor.id}`)
//                           ?.click()
//                       }
//                     >
//                       Upload Image
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor={`name-${instructor.id}`}>Full Name</Label>
//                     <Input
//                       id={`name-${instructor.id}`}
//                       value={instructor.name}
//                       onChange={(e) =>
//                         updateInstructor(instructor.id, "name", e.target.value)
//                       }
//                       placeholder="Full Name"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor={`email-${instructor.id}`}>
//                       Email Address
//                     </Label>
//                     <Input
//                       id={`email-${instructor.id}`}
//                       type="email"
//                       value={instructor.email}
//                       onChange={(e) =>
//                         updateInstructor(instructor.id, "email", e.target.value)
//                       }
//                       placeholder="Email Address"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor={`role-${instructor.id}`}>Role/Title</Label>
//                     <Input
//                       id={`role-${instructor.id}`}
//                       value={instructor.role}
//                       onChange={(e) =>
//                         updateInstructor(instructor.id, "role", e.target.value)
//                       }
//                       placeholder="Role/Title"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor={`experience-${instructor.id}`}>
//                       Experience
//                     </Label>
//                     <Select
//                       value={instructor.experience}
//                       onValueChange={(value) =>
//                         updateInstructor(instructor.id, "experience", value)
//                       }
//                     >
//                       <SelectTrigger id={`experience-${instructor.id}`}>
//                         <SelectValue placeholder="Select Experience" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {[1, 2, 3, 4, 5, "5+", "10+"].map((years) => (
//                           <SelectItem key={years} value={years.toString()}>
//                             {years} years
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor={`biography-${instructor.id}`}>
//                     Biography
//                   </Label>
//                   <Textarea
//                     id={`biography-${instructor.id}`}
//                     value={instructor.biography}
//                     onChange={(e) =>
//                       updateInstructor(
//                         instructor.id,
//                         "biography",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Enter instructor biography..."
//                     className="min-h-[100px]"
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//           <Button onClick={addInstructor} className="w-full">
//             <PlusIcon className="w-4 h-4 mr-2" />
//             Add Instructor
//           </Button>
//         </div>
//       )
//     }
//   ];

//   const handleImageUpload = (
//     instructorId: number,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         updateInstructor(instructorId, "profileImage", reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="bg-white h-full w-20"></div>

//       {/* Main content */}
//       <div className="flex-1 p-8 overflow-auto">
//         <h1 className="text-3xl font-bold mb-8">Antecedotes</h1>

//         {configSections.map((section) => (
//           <Card key={section.id} className="mb-8">
//             <CardHeader>
//               <CardTitle>{section.title}</CardTitle>
//             </CardHeader>
//             <CardContent>{section.content()}</CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// const PaymentDetailsForm = () => {
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});
//   const [isPreview, setIsPreview] = useState(false);

//   const paymentMethods = [
//     { id: "bank", label: "Bank Transfer" },
//     { id: "payoneer", label: "Payoneer" },
//     { id: "stripe", label: "Stripe" },
//     { id: "grey", label: "Grey Finance" }
//   ];

//   const supportedCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

//   const tooltips = {
//     swiftCode:
//       "SWIFT/BIC code is an 8-11 character code that identifies your bank internationally",
//     iban: "International Bank Account Number - format varies by country",
//     accountHolder: "Name exactly as it appears on your bank account"
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case "accountNumber":
//         return value.length < 8
//           ? "Account number must be at least 8 characters"
//           : "";
//       case "email":
//         return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
//           ? "Invalid email format"
//           : "";
//       case "swiftCode":
//         return !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value)
//           ? "Invalid SWIFT/BIC code"
//           : "";
//       case "accountHolder":
//         return value.length < 2
//           ? "Please enter the full account holder name"
//           : "";
//       case "bankName":
//         return value.length < 2 ? "Please enter the bank name" : "";
//       case "greyTag":
//         return value.length < 2 ? "Please enter your Grey Finance tag" : "";
//       default:
//         return value.length < 1 ? "This field is required" : "";
//     }
//   };

//   const handleInputChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     const error = validateField(name, value);
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const LabelWithTooltip = ({ htmlFor, label, tooltip }) => (
//     <div className="flex items-center gap-2">
//       <Label htmlFor={htmlFor}>{label}</Label>
//       {tooltip && (
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger>
//               <HelpCircle className="h-4 w-4 text-gray-500" />
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>{tooltip}</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       )}
//     </div>
//   );

//   const FormField = ({
//     id,
//     label,
//     type = "text",
//     tooltip,
//     value,
//     onChange
//   }) => (
//     <div className="space-y-2">
//       <LabelWithTooltip htmlFor={id} label={label} tooltip={tooltip} />
//       <Input
//         id={id}
//         type={type}
//         value={value || ""}
//         onChange={(e) => onChange(id, e.target.value)}
//         className={errors[id] ? "border-red-500" : ""}
//       />
//       {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
//     </div>
//   );

//   const renderPersonalDetails = () => (
//     <div className="space-y-4">
//       <FormField
//         id="fullName"
//         label="Full Name"
//         value={formData.fullName}
//         onChange={handleInputChange}
//       />
//       <FormField
//         id="email"
//         label="Email Address"
//         type="email"
//         value={formData.email}
//         onChange={handleInputChange}
//       />
//     </div>
//   );

//   const renderBankFields = () => (
//     <div className="space-y-4">
//       <FormField
//         id="bankName"
//         label="Bank Name"
//         value={formData.bankName}
//         onChange={handleInputChange}
//       />
//       <FormField
//         id="accountHolder"
//         label="Account Holder Name"
//         tooltip={tooltips.accountHolder}
//         value={formData.accountHolder}
//         onChange={handleInputChange}
//       />
//       <FormField
//         id="accountNumber"
//         label="Account Number/IBAN"
//         tooltip={tooltips.iban}
//         value={formData.accountNumber}
//         onChange={handleInputChange}
//       />
//       <FormField
//         id="swiftCode"
//         label="SWIFT/BIC Code"
//         tooltip={tooltips.swiftCode}
//         value={formData.swiftCode}
//         onChange={handleInputChange}
//       />
//     </div>
//   );

//   const renderPayoneerFields = () => (
//     <FormField
//       id="payoneerEmail"
//       label="Payoneer Email Address"
//       type="email"
//       value={formData.payoneerEmail}
//       onChange={handleInputChange}
//     />
//   );

//   const renderStripeFields = () => (
//     <FormField
//       id="stripeKey"
//       label="Stripe Connected Account ID"
//       value={formData.stripeKey}
//       onChange={handleInputChange}
//     />
//   );

//   const renderGreyFields = () => (
//     <FormField
//       id="greyTag"
//       label="Grey Finance Tag"
//       value={formData.greyTag}
//       onChange={handleInputChange}
//       tooltip="Enter your Grey Finance tag (e.g., @yourtag)"
//     />
//   );

//   const renderPreview = () => (
//     <div className="space-y-4">
//       <h3 className="font-medium">Review Your Details</h3>
//       <div className="space-y-2">
//         {Object.entries(formData).map(([key, value]) => (
//           <div key={key} className="flex justify-between py-1 border-b">
//             <span className="font-medium">
//               {key.replace(/([A-Z])/g, " $1").trim()}
//             </span>
//             <span>{value}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isPreview) {
//       // Handle final submission
//       console.log("Final submission:", formData);
//       return;
//     }

//     // Validate all fields before showing preview
//     const newErrors = {};
//     Object.keys(formData).forEach((key) => {
//       const error = validateField(key, formData[key] || "");
//       if (error) newErrors[key] = error;
//     });

//     if (Object.keys(newErrors).length === 0) {
//       setIsPreview(true);
//     } else {
//       setErrors(newErrors);
//     }
//   };

//   const handleDelete = () => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete your payment information?"
//       )
//     ) {
//       setFormData({});
//       setPaymentMethod("");
//       setIsPreview(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>Add Your Payment Details</CardTitle>
//         <CardDescription>
//           Choose your preferred payment method and enter your details
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {!isPreview ? (
//             <>
//               <div className="space-y-4">
//                 <Label>Step 1: Select Payment Method</Label>
//                 <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
//                   <TabsList className="grid grid-cols-4 w-full">
//                     {paymentMethods.map((method) => (
//                       <TabsTrigger key={method.id} value={method.id}>
//                         {method.label}
//                       </TabsTrigger>
//                     ))}
//                   </TabsList>
//                 </Tabs>
//               </div>

//               {paymentMethod && (
//                 <>
//                   <div className="space-y-4">
//                     <Label>Step 2: Enter Personal Details</Label>
//                     {renderPersonalDetails()}
//                   </div>

//                   <div className="space-y-4">
//                     <Label>Step 3: Enter Payment Details</Label>
//                     {paymentMethod === "bank" && renderBankFields()}
//                     {paymentMethod === "payoneer" && renderPayoneerFields()}
//                     {paymentMethod === "stripe" && renderStripeFields()}
//                     {paymentMethod === "grey" && renderGreyFields()}
//                   </div>

//                   <div className="space-y-4">
//                     <Label>Step 4: Select Currency</Label>
//                     <Select
//                       onValueChange={(value) =>
//                         handleInputChange("currency", value)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Choose currency" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {supportedCurrencies.map((currency) => (
//                           <SelectItem key={currency} value={currency}>
//                             {currency}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </>
//               )}
//             </>
//           ) : (
//             renderPreview()
//           )}

//           <Alert>
//             <Lock className="h-4 w-4" />
//             <AlertDescription>
//               Your payment details are encrypted and stored securely
//             </AlertDescription>
//           </Alert>
//         </form>
//       </CardContent>
//       <CardFooter className="flex gap-4">
//         {isPreview ? (
//           <>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsPreview(false)}
//             >
//               Edit Details
//             </Button>
//             <Button type="submit" onClick={handleSubmit}>
//               Confirm & Save
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button type="submit" onClick={handleSubmit} className="flex-1">
//               <Eye className="mr-2 h-4 w-4" />
//               Preview Details
//             </Button>
//             <Button type="button" variant="destructive" onClick={handleDelete}>
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default CourseCreationWorkflow;
