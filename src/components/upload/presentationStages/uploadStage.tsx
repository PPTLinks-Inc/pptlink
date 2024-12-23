/* eslint-disable react/prop-types */
import { FormEvent, useEffect, useRef, useState } from "react";
import { useUploadStore } from "@/store/uploadStore";
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
import { authFetch } from "@/lib/axios";
import useUser from "@/hooks/useUser";

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
    .refine((file) => {
      if (useUploadStore.getState().pdfUrl === "" && !file) {
        return false;
      }
      return true;
    })
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
      return file[0].size < 10 * 1024 * 1024;
    }, "File size must not exceed 10MB")
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

export default function UploadStage() {
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

  const [serverConnected, setServerConnected] = useState(false);
  const [failedToConnect, setFailedToConnect] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const processingFile = useUploadStore((state) => state.processingFile);
  const setProcessingFile = useUploadStore((state) => state.setProcessingFile);

  const [allowCheckFileStatus, setAllowCheckFileStatus] = useState(true);

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

  const uploadMutation = useMutation({
    mutationFn: async function (file: File) {
      setProcessingFile(false);
      setUploadPercentage(0);
      const formData = new FormData();
      formData.append("ppt", file);

      if (searchParams.has("edit")) {
        formData.append("edit", searchParams.get("edit")!);
      }

      const { data } = await authFetch.post(
        `${SERVER_URL}/api/v1/ppt/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: function (progressEvent) {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadPercentage(percentCompleted);
            }
          }
        }
      );

      return data;
    },
    onSuccess: function (data) {
      toastRef.current = toast({
        description: data.message,
        duration: 60000,
        action: <LoadingAssetSmall />
      });
      setProcessingFile(true);
    }
  });

  const cancelPendingUploadMutation = useMutation({
    mutationFn: async function () {
      await authFetch.delete(
        `${SERVER_URL}/api/v1/ppt/presentation/cancel-upload`
      );
    },
    onSuccess: function () {
      setProcessingFile(false);
      setUploadPercentage(0);
      uploadMutation.reset();
      setValue("file", null);
      setPdfUrl("");
      if (toastRef.current) {
        toastRef.current.update({
          description: "File upload has been cancelled.",
          duration: 3000,
          action: null
        });

        setTimeout(() => {
          toastRef.current?.dismiss();
        }, 5000);
      }
      setModalValues((prev) => ({ ...prev, open: false }));
    },
    onError: function () {
      if (toastRef.current) {
        toastRef.current.update({
          title: "Error",
          description: "An error occurred while cancelling the upload.",
          duration: 3000,
          action: null,
          variant: "destructive"
        });

        setTimeout(() => {
          toastRef.current?.dismiss();
        }, 8000);
      }
      setModalValues((prev) => ({ ...prev, open: false }));
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
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: useUploadStore.getState().title,
      description: useUploadStore.getState().description || "",
      privacy: useUploadStore.getState().privacy,
      downloadable: useUploadStore.getState().downloadable ? "YES" : "NO",
      category: useUploadStore.getState().selectedCategory.id,
      file: null
    }
  });

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
      if (!user) return;

      const token = localStorage.getItem("accessToken");

      const eventSource = new EventSource(
        `${SERVER_URL}/api/v1/ppt/presentations/upload-notification/${token}/${user.id}`
      );

      eventSource.addEventListener("message", function (ev) {
        const data = JSON.parse(ev.data);

        if (data.event === "connect") {
          setFailedToConnect(false);
          setServerConnected(true);

          if (searchParams.has("edit")) {
            const file = new File([], "File Name", {
              type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileList: any = {
              0: file,
              length: 1,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              item: (_index: number) => file
            } as unknown as FileList;
            setValue("file", fileList);
            return;
          }

          if (data?.status === "SUCCESS") {
            setModalValues({
              message:
                "Your file has been processed successfully. Click continue to proceed.",
              open: true,
              oneButton: false,
              actionText: "Continue",
              isLoading: false,
              onSubmit: (e) => {
                e.preventDefault();
                setModalValues((prev) => ({ ...prev, open: false }));
              },
              onClose: () => {
                setPdfUrl("");
                setValue("file", null);
                setModalValues((prev) => ({ ...prev, open: false }));
              }
            });
            setPdfUrl(data.pdfUrl);
            // create a file object from the url
            const file = new File([], "File Name", {
              type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileList: any = {
              0: file,
              length: 1,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              item: (_index: number) => file
            } as unknown as FileList;
            setValue("file", fileList);
          } else if (data?.status === "ERROR") {
            setModalValues({
              message: "An error occurred while processing your file.",
              open: true,
              oneButton: true,
              actionText: "Retry",
              isLoading: false,
              onSubmit: () => {},
              onClose: () => {
                setPdfUrl("");
                setValue("file", null);
                setModalValues((prev) => ({ ...prev, open: false }));
              }
            });
            setPdfUrl("");
          } else if (data?.status === "PENDING") {
            setPdfUrl("waiting for pdf link");
            setProcessingFile(true);
            const file = new File([], "File Name", {
              type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileList: any = {
              0: file,
              length: 1,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              item: (_index: number) => file
            } as unknown as FileList;
            setValue("file", fileList);
            toastRef.current = toast({
              description: "Processing Presentation file",
              duration: 60000,
              action: <LoadingAssetSmall />
            });
            setModalValues({
              message: "Your file is being processed. Please wait or cancel.",
              open: true,
              oneButton: false,
              actionText: "OK",
              isLoading: false,
              onSubmit: (e) => {
                e.preventDefault();
                setModalValues((prev) => ({ ...prev, open: false }));
              },
              onClose: () => {
                setModalValues((prev) => ({
                  ...prev,
                  isLoading: true,
                  message: "Cancelling upload..."
                }));
                cancelPendingUploadMutation.mutate();
              }
            });
          }
        } else if (data.event === "done") {
          if (toastRef.current) {
            toastRef.current.update({
              description: "File has been processed successfully.",
              duration: 3000,
              action: null
            });

            setTimeout(() => {
              toastRef.current?.dismiss();
            }, 5000);
          }
          setProcessingFile(false);
          setPdfUrl(data.pdfUrl);
        } else if (data.event === "error") {
          if (toastRef.current) {
            toastRef.current.update({
              title: "Error",
              description: "An error occurred while processing your file.",
              duration: 3000,
              action: null,
              variant: "destructive"
            });

            setTimeout(() => {
              toastRef.current?.dismiss();
            }, 8000);
          }
          setProcessingFile(false);
          uploadMutation.reset();
        }
      });

      eventSource.addEventListener("error", function () {
        setFailedToConnect(true);
        if (toastRef.current) {
          toastRef.current.update({
            title: "Error",
            description: "Failed to connect to server.",
            duration: 3000,
            action: null,
            variant: "destructive"
          });

          setTimeout(() => {
            toastRef.current?.dismiss();
          }, 8000);
        }
      });

      return () => {
        eventSource.close();
      };
    },
    [user]
  );

  const checkFileStatusMutation = useMutation({
    mutationFn: async function () {
      const { data } = await authFetch.get(
        `${SERVER_URL}/api/v1/ppt/presentation/upload-status`
      );
      return data;
    },
    onSuccess: function (data) {
      setAllowCheckFileStatus(false);
      if (data.status === "SUCCESS") {
        setPdfUrl(data.pdfUrl);
        setModalValues({
          message:
            "Your file has been processed successfully. Click continue to proceed.",
          open: true,
          oneButton: true,
          actionText: "Continue",
          isLoading: false,
          onSubmit: (e) => {
            e.preventDefault();
            setProcessingFile(false);
            setModalValues((prev) => ({ ...prev, open: false }));
          },
          onClose: () => {}
        });
      } else if (data.status === "ERROR") {
        setModalValues({
          message:
            "An error occurred while processing your file. Please retry.",
          open: true,
          oneButton: true,
          actionText: "Retry",
          isLoading: false,
          onSubmit: () => {},
          onClose: () => {
            setPdfUrl("");
            setValue("file", null);
            setModalValues((prev) => ({ ...prev, open: false }));
          }
        });
        setPdfUrl("");
        setValue("file", null);
      } else if (data.status === "PENDING") {
        setModalValues({
          message: "Your file is being processed. Please wait or cancel.",
          open: true,
          oneButton: false,
          actionText: "OK",
          isLoading: false,
          onSubmit: (e) => {
            e.preventDefault();
            setModalValues((prev) => ({ ...prev, open: false }));
          },
          onClose: () => {
            setModalValues((prev) => ({
              ...prev,
              isLoading: true,
              message: "Cancelling upload..."
            }));
            cancelPendingUploadMutation.mutate();
          }
        });
      }
    }
  });

  useEffect(
    function () {
      let timer: NodeJS.Timeout | null = null;
      if (!allowCheckFileStatus && processingFile) {
        timer = setTimeout(() => {
          setAllowCheckFileStatus(true);
        }, 30000);
      }

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    },
    [allowCheckFileStatus, processingFile]
  );

  useEffect(
    function () {
      if (formValues.file && formValues.file[0]) {
        trigger("file").then(function (valid) {
          if (valid) {
            const file = formValues.file![0] as File;

            const pdfUrl = useUploadStore.getState().pdfUrl;
            if (pdfUrl !== "" && !searchParams.has("edit")) {
              return;
            }

            uploadMutation.mutate(file);
          }
        });
      }
    },
    [formValues.file, trigger]
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
              ${!!errors.file?.message && !uploadMutation.isError && "border-[3px] !border-[red] border-dashed"} before:block before:w-full relative before:h-full before:bg-[#FFFFF0] 
              before:absolute before:top-0 before:left-0 before:pointer-events-none`}
      >
        {!processingFile && serverConnected && !failedToConnect && (
          <input
            type="file"
            accept=".ppt, .pptx, .pot, .pps, .pps, .potx, .ppsx, .ppam, .pptm, .potm, .ppsm"
            multiple={false}
            className="block w-full h-full cursor-pointer"
            {...register("file")}
          />
        )}
        {uploadMutation.isPending && (
          <Progress
            value={uploadPercentage}
            className="bg-[#ffa500] w-1/2 mx-auto"
          />
        )}
        <div
          className={`flex flex-col gap-2 justify-center items-center w-full h-full absolute top-0 left-0 pointer-events-none _maxScreenMobile:bg-primaryTwo`}
        >
          {!processingFile ? (
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
                    stroke={`${uploadMutation.isSuccess || pdfUrl !== "" ? "green" : uploadMutation.isError || errors.file?.message ? "red" : "#ffa500"}`}
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
                    stroke={`${uploadMutation.isSuccess || pdfUrl !== "" ? "green" : uploadMutation.isError || errors.file?.message ? "red" : "#ffa500"}`}
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
                    stroke={`${uploadMutation.isSuccess || pdfUrl !== "" ? "green" : uploadMutation.isError || errors.file?.message ? "red" : "#ffa500"}`}
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
                    stroke={`${uploadMutation.isSuccess || pdfUrl !== "" ? "green" : uploadMutation.isError || errors.file?.message ? "red" : "#ffa500"}`}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="7"
                  />
                </g>
              </svg>
            </span>
          ) : (
            <LoadingAssetBig />
          )}
          <span
            className={`w-fit h-fit ${uploadMutation.isSuccess || pdfUrl !== "" ? "text-[green]" : uploadMutation.isError || errors.file?.message ? "text-[red]" : "text-primaryTwo"}`}
          >
            {serverConnected ? (
              errors.file?.message ? (
                <>{errors.file.message.toString()}</>
              ) : (
                <>
                  {uploadMutation.isSuccess || pdfUrl !== ""
                    ? "File Upload successfully"
                    : uploadMutation.isError
                      ? "An Error occurred while uploading"
                      : processingFile && "File is being processed..."}
                </>
              )
            ) : failedToConnect ? (
              "Failed to connect to server."
            ) : (
              "Connecting to server..."
            )}
          </span>
          {serverConnected && !processingFile && (
            <span
              className={`w-fit h-fit text-white ${uploadMutation.isSuccess || pdfUrl !== "" ? "bg-[green]" : uploadMutation.isError || errors.file?.message ? "bg-[red]" : "bg-[#ffa500]"} py-2 px-8 rounded-full`}
            >
              {formValues.file && formValues.file[0]
                ? "Change file..."
                : "Browse File"}
            </span>
          )}
          {allowCheckFileStatus && processingFile && (
            <button
              disabled={checkFileStatusMutation.isPending}
              onClick={() => checkFileStatusMutation.mutate()}
              className="w-fit h-fit text-white py-2 px-8 rounded-full bg-[green] mt-5 !pointer-events-auto"
            >
              {checkFileStatusMutation.isPending
                ? "Checking file status..."
                : "Check file status"}
            </button>
          )}
          {processingFile && (
            <p className="text-primaryTwo">File Processing. Please wait...</p>
          )}
        </div>
        {/* {uploadValuesErrors.fileError && (
                    <p className="text-[red] w-[90%] mx-auto text-lg mt-2 pb-6">{uploadValuesErrors.fileError}</p>
                )} */}
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
          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.title?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
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
          className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md resize-none ${errors.description?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
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
            className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.privacy?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
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
            className={`block w-full indent-4 py-2 focus:outline focus:outline-[1px] shadow-md rounded-md ${errors.downloadable?.message ? "border border-[red] outline-offset-2" : "border-none"}`}
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
                className="block w-[60%] text-lg _maxScreenMobile:w-[85%] p-2 mr-2 !border-[0px] !border-none bg-white outline outline-[white] indent-2"
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
                className="block w-[60%] p-2 indent-8 border-none border-primaryTwo border-r-0 rounded-tl-md rounded-bl-md"
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
