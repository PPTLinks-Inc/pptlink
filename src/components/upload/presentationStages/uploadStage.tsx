/* eslint-disable react/prop-types */
import { FormEvent, useEffect, useRef, useState } from "react";
import { useUploadStore } from "@/store/uploadStoreProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SERVER_URL } from "@/constants/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PopUpModal from "@/components/Models/dashboardModel";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { LoadingAssetBig, LoadingAssetSmall } from "@/assets/assets";
import { useSearchParams } from "react-router-dom";
import { authFetch, standardFetch } from "@/lib/axios";
import useUser from "@/hooks/useUser";
import {
  useMutation as useConvexMutation,
  useQuery as useConvexQuery
} from "convex/react";
import { api } from "@pptlinks/shared-convex-backend/convex/_generated/api";

const useFileValidation = () => {
  const pdfUrl = useUploadStore((state) => state.pdfUrl);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (file: any) => {
    if (pdfUrl === "" && !file) {
      return false;
    }
    return true;
  };
};

export default function UploadStage() {
  const validateFile = useFileValidation();
  const schema = z.object({
    title: z.string().min(2, { message: "Title is too short" }),
    description: z
      .string()
      .optional()
      .refine((description) => {
        if (description) {
          return description.length >= 5;
        }
        return true;
      }, "Description is too short"),
    privacy: z.enum(["PUBLIC", "PRIVATE", "TEMP"]),
    downloadable: z.enum(["YES", "NO"]),
    category: z.string().min(2, { message: "Choose a category" }),
    file: z
      .any()
      .refine(validateFile)
      .refine((file: FileList) => {
        if (file) {
          return file.length > 0;
        }
        return false;
      }, "File is required")
      .refine((file) => {
        if (!file) {
          return false;
        }
        if (!file[0]) return false;
        return file[0].size < 50 * 1024 * 1024;
      }, "File size must not exceed 50MB")
      .refine((file) => {
        if (!file) {
          return false;
        }
        if (!file[0]) return false;
        const mimeTypes = [
          "application/wps-office.pptx",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.openxmlformats-officedocument.presentationml.template",
          "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
          "application/vnd.ms-powerpoint.addin.macroEnabled.12",
          "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
          "application/vnd.ms-powerpoint.template.macroEnabled.12",
          "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"
        ];

        if (!mimeTypes.includes(file[0].type)) {
          return false;
        }

        return true;
      }, "Please upload a valid presentation file.")
  });
  const { userQuery } = useUser();
  const user = userQuery.data;
  const currentView = useUploadStore((state) => state.currentView);
  const setCurrentView = useUploadStore((state) => state.setCurrentView);
  const addCategory = useUploadStore((state) => state.addCategory);
  const categories = useUploadStore((state) => state.categories);
  const setPdfUrl = useUploadStore((state) => state.setPdfUrl);
  const pdfUrl = useUploadStore((state) => state.pdfUrl);

  const [addNewCategory, setAddNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [searchParams] = useSearchParams();

  const [modalValues, setModalValues] = useState({
    message: "",
    actionText: "",
    open: false,
    oneButton: false,
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: (_e: FormEvent<HTMLFormElement>) => {},
    onClose: () => {}
  });

  const toastRef = useRef<{
    id: string;
    dismiss: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (props: any) => void;
  }>();

  const updateUploadStatus = useConvexMutation(
    api.jobsMutation.updateSingleUploadTempDataStatus
  );
  const uploadData = useConvexQuery(api.jobsQuery.getSingleUploadTempData, {
    userId: user?.id ?? ""
  });

  const uploadMutation = useMutation({
    mutationFn: async function (file: File) {
      setUploadPercentage(0);

      if (!user) {
        return;
      }

      const params = {
        name: file.name,
        contentType: file.type,
        ...(searchParams.has("edit")
          ? { editPresentationId: searchParams.get("edit")! }
          : {})
      };

      console.log("params", params);

      const { data: urlData } = await authFetch.get(
        `${SERVER_URL}/api/v1/ppt/generate-upload-url`,
        {
          params
        }
      );

      await standardFetch.put(urlData.signedUrl, file, {
        headers: {
          "Content-Type": file.type
        },
        onUploadProgress: function (progressEvent) {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercentage(percentCompleted);
          }
        }
      });

      updateUploadStatus({
        userId: user.id,
        status: "pending"
      });
    },
    onSuccess: function () {
      toastRef.current = toast({
        description: "File upload has been completed successfully.",
        duration: 60000,
        action: <LoadingAssetSmall />
      });
    }
  });

  const setCategories = useUploadStore((state) => state.setCategories);
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await authFetch.get("/api/v1/ppt/categories");

      setCategories(data);

      return data;
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: useUploadStore((store) => store.title),
      description: useUploadStore((store) => store.description),
      privacy: useUploadStore((store) => store.privacy),
      downloadable: useUploadStore((store) => store.downloadable)
        ? "YES"
        : "NO",
      category: useUploadStore((store) => store.selectedCategory.id),
      file: null
    }
  });

  const isError =
    uploadData?.status === "error" ||
    uploadMutation.isError ||
    errors.file?.message;

  const processingFile = uploadData?.status === "processing";
  const successFile = uploadData?.status === "success";
  const uploading =
    uploadData?.status === "uploading" || uploadMutation.isPending;
  const pending = uploadData?.status === "pending";

  useEffect(
    function () {
      if (!searchParams.has("edit")) {
        categoriesQuery.refetch();
        reset({
          title: "",
          description: "",
          privacy: "PUBLIC",
          downloadable: "YES",
          category: "",
          file: null
        });
        return;
      }
    },
    [searchParams]
  );

  const formValues = watch();

  useEffect(
    function () {
      if (uploadData?.status === "success") {
        setPdfUrl(uploadData?.thumbnail ?? "");
        toastRef.current?.update({
          description: "File upload has been completed successfully.",
          duration: 6000
        });
      }
    },
    [uploadData?.status]
  );

  const setUploadStageSubmitHandler = useUploadStore(
    (state) => state.setUloadStageSubmitHandler
  );
  const setTitle = useUploadStore((state) => state.setTitle);
  const setDescription = useUploadStore((state) => state.setDescription);
  const setPrivacy = useUploadStore((state) => state.setPrivacy);
  const setDownloadable = useUploadStore((state) => state.setDownloadable);
  const setCategory = useUploadStore((state) => state.setSelectedCategory);

  useEffect(
    function () {
      if (formValues.file) {
        // check if file is valid
        trigger("file").then((isValid) => {
          if (isValid) {
            console.log(isValid, formValues.file);
            uploadMutation.mutate(formValues.file![0]);
          }
        });
      }
    },
    [formValues.file]
  );

  useEffect(
    function () {
      setUploadStageSubmitHandler(
        handleSubmit(function () {
          setTitle(formValues.title);
          setDescription(formValues.description || "");
          setPrivacy(formValues.privacy as "PUBLIC" | "PRIVATE" | "TEMP");
          setDownloadable(formValues.downloadable === "YES");

          const category = categories.find(
            (cat) => cat.id === formValues.category
          );

          setCategory(category || { id: "", name: "" });
          setCurrentView(2);
        })
      );
    },
    [
      handleSubmit,
      setUploadStageSubmitHandler,
      setCurrentView,
      setTitle,
      formValues.title,
      formValues.description,
      formValues.privacy,
      formValues.downloadable,
      formValues.category,
      setDescription,
      setPrivacy,
      setDownloadable,
      setCategory,
      categories
    ]
  );

  function updateCategories() {
    setAddNewCategory(false);
    if (newCategory === "") {
      return;
    }

    addCategory(newCategory);
    setNewCategory("");
  }

  return (
    <div className={`w-full h-fit ${currentView === 1 ? "block" : "hidden"}`}>
      <PopUpModal {...modalValues} />
      {/* Upload File here */}
      <div
        className={`w-full h-[20rem] m-auto ${false && "hidden"} 
              ${isError && "border-[3px] !border-[red] border-dashed"} before:block before:w-full relative before:h-full before:bg-[#FFFFF0] 
              before:absolute before:top-0 before:left-0 before:pointer-events-none`}
      >
        {!processingFile && !pending && !uploading && (
          <input
            type="file"
            accept=".ppt, .pptx, .pot, .pps, .pps, .potx, .ppsx, .ppam, .pptm, .potm, .ppsm"
            multiple={false}
            className="block w-full h-full cursor-pointer"
            {...register("file")}
          />
        )}
        <div
          className={`flex flex-col gap-2 justify-center items-center w-full h-full absolute top-0 left-0 pointer-events-none _maxScreenMobile:bg-primaryTwo`}
        >
          {!processingFile && !pending && !uploading && (
            <>
              <span className="block w-[5rem] aspect-square">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 130.163 107.713"
                  className="block w-full h-full"
                >
                  <g
                    id="Icon_feather-upload-cloud"
                    data-name="Icon feather-upload-cloud"
                    transform="translate(2.029 -0.985)"
                  >
                    <path
                      id="Path_197"
                      data-name="Path 197"
                      d="M56.759,40.379,34.38,18,12,40.379"
                      transform="translate(28.686 36.845)"
                      fill="none"
                      stroke={`${successFile ? "green" : isError ? "red" : "#ffa500"}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="7"
                    />
                    <path
                      id="Path_198"
                      data-name="Path 198"
                      d="M18,18V68.354"
                      transform="translate(45.066 36.845)"
                      fill="none"
                      stroke={`${successFile ? "green" : isError ? "red" : "#ffa500"}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="7"
                    />
                    <path
                      id="Path_199"
                      data-name="Path 199"
                      d="M110.007,90.6A27.974,27.974,0,0,0,96.635,38.06h-7.05A44.759,44.759,0,1,0,12.712,78.9"
                      transform="translate(0 0)"
                      fill="none"
                      stroke={`${successFile ? "green" : isError ? "red" : "#ffa500"}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="7"
                    />
                    <path
                      id="Path_200"
                      data-name="Path 200"
                      d="M56.759,40.379,34.38,18,12,40.379"
                      transform="translate(28.686 36.845)"
                      fill="none"
                      stroke={`${successFile ? "green" : isError ? "red" : "#ffa500"}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="7"
                    />
                  </g>
                </svg>
              </span>

              <span
                className={`w-fit h-fit text-white ${successFile ? "bg-[green]" : isError ? "bg-[red]" : "bg-[#ffa500]"} py-2 px-8 rounded-full`}
              >
                {formValues.file && formValues.file[0]
                  ? "Change file..."
                  : "Browse File"}
              </span>
            </>
          )}
          <span
            className={`w-fit h-fit ${successFile ? "text-[green]" : isError ? "text-[red]" : "text-primaryTwo"}`}
          >
            {successFile
              ? "File Upload successfully"
              : isError
                ? "An Error occurred while uploading"
                : processingFile && "File is being processed..."}
          </span>

          {pending && (
            <span className="w-fit h-fit text-primaryTwo">
              <LoadingAssetBig />
            </span>
          )}

          {uploading && (
            <Progress
              value={uploadPercentage}
              className="bg-[#ffa500] w-1/2 mx-auto"
            />
          )}

          {(uploading ||
            pending ||
            processingFile) && (
              <button className="w-fit h-fit text-white py-2 px-8 rounded-full bg-[#ffa500] cursor-pointer pointer-events-auto" onClick={() => {
                updateUploadStatus({
                  userId: user?.id ?? "",
                  status: "cancelled"
                })
              }}>
                Cancel
              </button>
            )}
        </div>
      </div>
      {/* Title */}
      <div className="w-[90%] h-fit m-auto mt-8 text-lg text-primaryTwo">
        <label htmlFor="title" className="block mb-2">
          <sup className="w-full text-xl font-bold">*</sup>Title
        </label>
        <input
          type="text"
          id="title"
          {...register("title")}
          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md border ${watch("title")?.length > 0 && "border-[#FFA500]"} ${errors.title?.message && "border-[red] outline-offset-2"}`}
        />
        {errors.title?.message && (
          <p className="text-[red]">{errors.title?.message?.toString()}</p>
        )}
      </div>
      {/* Description (Optional) */}
      <div className="w-[90%] h-fit m-auto mt-8 text-lg text-primaryTwo">
        <label htmlFor="textarea" className="block mb-2">
          <sup className="w-full text-xl font-bold"></sup>Description (Optional)
        </label>
        <textarea
          id="textarea"
          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md resize-none border ${watch("description")?.length > 0 && "border-[#FFA500]"} ${errors.description?.message && "border-[red] outline-offset-2"}`}
          rows={5}
          cols={50}
          {...register("description")}
        ></textarea>

        {errors.description?.message && (
          <p className="text-[red]">
            {errors.description?.message?.toString()}
          </p>
        )}
      </div>
      {/* Privacy/Downloadable */}
      <div className="flex justify-between w-[90%] m-auto mt-6">
        <div className="w-[48%] h-fit mt-6 text-lg text-primaryTwo">
          <label htmlFor="publicSelector" className="block mb-2">
            <sup className="w-full text-xl font-bold">*</sup>Privacy
          </label>
          <select
            id="publicSelector"
            className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md border ${watch("privacy")?.length > 0 && "border-[#FFA500]"} ${errors.privacy?.message && "border-[red] outline-offset-2"}`}
            {...register("privacy")}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="TEMP">Temporary</option>
          </select>
          {errors.privacy?.message && (
            <p className="text-[red]">{errors.privacy?.message?.toString()}</p>
          )}
        </div>

        <div className="w-[48%] h-fit mt-6 text-lg text-primaryTwo">
          <label htmlFor="downloadSelector" className="block mb-2">
            <sup className="w-full text-xl font-bold">*</sup>Downloadable
          </label>
          <select
            id="downloadSelector"
            className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md border ${watch("downloadable")?.length > 0 && "border-[#FFA500]"} ${errors.downloadable?.message && "border-[red] outline-offset-2"}`}
            {...register("downloadable")}
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
          {errors.downloadable?.message && (
            <p className="text-[red]">
              {errors.downloadable?.message?.toString()}
            </p>
          )}
        </div>
      </div>
      {/* Add Category */}
      <div className="flex justify-between w-[90%] m-auto mt-6">
        <div className="w-[48%] maxScreenMobile:w-full mr-auto flex flex-col justify-center items-center h-fit mt-6 text-lg text-primaryTwo">
          <div className="w-full relative">
            <label htmlFor="categorySelector" className="block mb-2">
              <sup className="w-full text-xl font-bold">*</sup>Category
            </label>
            <div className="bg-white h-fit justify-between items-center overflow-hidden flex w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md">
              <select
                title="category"
                id="categorySelector"
                className={`block w-[60%] text-lg _maxScreenMobile:w-[85%] p-2 mr-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2 ${watch("category")?.length > 0 && "border border-[#FFA500]"}`}
                {...register("category")}
              >
                <option value="" disabled className="text-[gray]">
                  {categoriesQuery.isLoading ? "Loading" : "Choose a category"}
                </option>
                {categories.map(({ name, id }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setAddNewCategory((prev) => !prev);
                }}
                className="w-[40%] maxScreenMobile:responsiveText 
                      flex gap-1 justify-evenly items-center h-full p-2 
                      bg-primaryTwo border-primaryTwo rounded-tr-md rounded-br-md _maxScreenMobile:w-fit _maxScreenMobile:p-4"
              >
                <span className="text-white responsiveText block w-fit h-fit italic _maxScreenMobile:hidden">
                  NEW
                </span>
              </button>
            </div>

            <div
              className={`${addNewCategory ? "flex" : "hidden"} bg-white h-fit justify-between items-center overflow-hidden w-full indent-4 focus:outline focus:outline-[1px] shadow-md rounded-md transition-all mt-[20px]`}
            >
              <input
                type="text"
                id="title"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`block w-[60%] p-2 indent-8 border-none border-primaryTwo border-r-0 rounded-tl-md rounded-bl-md`}
                placeholder="ADD CATEGORY"
              />
              <button
                type="button"
                className="w-[40%] flex gap-1 justify-center items-center h-full p-2 bg-primaryTwo border-none border-primaryTwo rounded-tr-md rounded-br-md cursor-pointer"
                onClick={updateCategories}
              >
                <span className="text-white responsiveText block w-fit h-fit italic">
                  ADD
                </span>
              </button>
            </div>
          </div>
          {errors.category?.message && (
            <p className="text-[red] w-full">
              {errors.category?.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
