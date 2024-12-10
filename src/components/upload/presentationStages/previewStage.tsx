import { useUploadStore } from "@/store/uploadStore";
import formatDate from "@/lib/formatDate";
import { useEffect } from "react";
import { LoadingAssetBig } from "@/assets/assets";
import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { authFetch } from "@/lib/axios";

export default function PreviewStage() {
  const currentView = useUploadStore((state) => state.currentView);
  const pdfUrl = useUploadStore((state) => state.pdfUrl);
  const presenterName = useUploadStore((state) => state.presentersName);
  const bio = useUploadStore((state) => state.bio);
  const socialLinks = useUploadStore((state) => state.socialLinks);
  const title = useUploadStore((state) => state.title);
  const description = useUploadStore((state) => state.description);
  const privacy = useUploadStore((state) => state.privacy);
  const downloadable = useUploadStore((state) => state.downloadable);
  const date = useUploadStore((state) => state.date);
  const startTime = useUploadStore((state) => state.startTime);
  const endTime = useUploadStore((state) => state.endTime);
  const selectedCategory = useUploadStore((state) => state.selectedCategory);

  const processingFile = useUploadStore((state) => state.processingFile);
  const setIsSaving = useUploadStore((state) => state.setIsSaving);

  const [searchParams] = useSearchParams();

  const savePresentationMutation = useMutation({
    mutationFn: async function () {
      setIsSaving(true);

      if (!searchParams.has("edit")) {
        const { data } = await authFetch.post(
          `${SERVER_URL}/api/v1/ppt/presentations/save`,
          {
            title,
            description,
            category: selectedCategory,
            downloadable,
            linkType: privacy,
            presenterName,
            bio,
            socialMediaLink: socialLinks,
            presentationDate: date,
            presentationStartTime: startTime,
            presentationEndTime: endTime
          }
        );

        return data.liveId;
      } else {
        await authFetch.put(
          `${SERVER_URL}/api/v1/ppt/presentations/update`,
          {
            id: searchParams.get("edit"),
            title,
            description,
            category: selectedCategory,
            downloadable,
            linkType: privacy,
            presenterName,
            bio,
            socialMediaLink: socialLinks,
            presentationDate: date,
            presentationStartTime: startTime,
            presentationEndTime: endTime
          }
        );

        return null;
      }
    },
    onSuccess: function (liveId) {
      if (liveId === null) {
        toast({
          title: "Success",
          description: "Your presentation has been updated successfully"
        });
        setIsSaving(false);
        return;
      }
      window.location.href = `/${liveId}`;
    },
    onError: function () {
      toast({
        title: "Error",
        description: "An error occurred while saving your presentation",
        variant: "destructive"
      });
      setIsSaving(false);
    }
  });

  const setSavePresentationStageHandler = useUploadStore(
    (state) => state.setSavePresentationStageHandler
  );
  useEffect(
    function () {
      setSavePresentationStageHandler(savePresentationMutation.mutate);
    },
    [savePresentationMutation.mutate, setSavePresentationStageHandler]
  );

  return (
    <div
      className={`w-full min-h-full ${currentView === 3 ? "flex" : "hidden"} justify-center items-center`}
    >
      <div className="w-full h-fit gridPreview overflow-x-auto">
        <div className="w-full flex flex-col justify-between bg-[#FFFFF0]">
          {/* MARK: Preview */}
          <div className="maxScreenMobile:mt-4 w-[95%] maxScreenMobile:w-full m-auto h-[20rem] bg-white rounded-md border-2 border-black maxScreenMobile:border-[0.1px] maxScreenMobile:border-[#00000034] maxScreenMobile:rounded-none">
            {processingFile ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <LoadingAssetBig />
                <p className="text-black">
                  Your presentation file is being processed. Please wait before
                  submitting
                </p>
              </div>
            ) : (
              <img
                src={pdfUrl}
                alt="Presentation Preview"
                className="block w-full h-full object-cover"
              />
            )}
          </div>
          <div className="bg-[#ffa500] h-fit mt-16 pb-4 w-full">
            <p className="w-fit m-auto pt-14 pb-4 text-black text-[1.2rem]">
              PRESENTER&apos;S INFORMATION
            </p>
            <div className="w-[95%] maxScreenMobile:w-full m-auto min-h-64 bg-[#FFFFF0] text-black">
              <ul className="block w-full py-4">
                <li className="block w-full mb-4 px-4">
                  <span>Name</span>
                  <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                  <p className="responsiveText italic mt-2">
                    {presenterName !== "" ? presenterName : "No Name Set"}
                  </p>
                </li>
                <li className="block w-full mb-4 px-4">
                  <span>Bio</span>
                  <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                  <p className="responsiveText italic mt-2">
                    {bio !== "" ? bio : "No Bios Set"}
                  </p>
                </li>
                <li className="block w-full mb-4 px-4">
                  <span>Social Media Link</span>
                  <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                  <p className="responsiveText italic mt-2">
                    {socialLinks !== "" ? socialLinks : "No Social Link Set"}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full bg-[#ffa500] pb-[1.7rem] flex flex-col justify-between">
          <p className="w-fit m-auto pt-14 pb-4 text-black text-[1.2rem] mt-0">
            PRESENTATION DETAILS
          </p>
          <div className="w-[95%] maxScreenMobile:w-full m-auto mb-0 min-h-[calc(100%-(5.7rem))] _overflow-auto bg-[#FFFFF0] text-black">
            <ul className="block w-full pt-4">
              <li className="block w-full mb-4 px-4">
                <span>Presentation title</span>
                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                <p className="responsiveText italic mt-2">
                  {title !== "" ? title : "No Title Set"}
                </p>
              </li>
              <li className="block w-full mb-4 px-4">
                <span>Description</span>
                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                <p className="responsiveText italic mt-2">
                  {description !== "" ? description : "No Description Set"}
                </p>
              </li>
              <li className="block w-full mb-4 px-4">
                <span>Privacy</span>
                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                <p className="responsiveText italic mt-2">
                  {privacy !== "" ? privacy : "No Privacy Set"}
                </p>
              </li>
              <li className="block w-full mb-4 px-4">
                <span>Category</span>
                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                <p className="responsiveText italic mt-2">
                  {selectedCategory.id !== ""
                    ? selectedCategory.name
                    : "No Category Set"}
                </p>
              </li>
              <li className="block w-full mb-4 px-4">
                <span>Downloadable</span>
                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                <p className="responsiveText italic mt-2">
                  {downloadable ? "Yes" : "No"}
                </p>
              </li>
            </ul>
            <p className="bg-[#ffa500] text-black w-3/6 pl-4 py-2 mb-4">
              SCHEDULE
            </p>
            <ul className="block w-full pb-4">
              <li className="block w-full mb-4 px-4">
                <span>Date</span>
                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                <p className="responsiveText italic mt-2">
                  {date ? `Start Date: ${formatDate(date)}` : "No Date Set"}
                </p>
              </li>
              <li className="block w-full mb-4 px-4">
                <span>Time</span>
                <hr className="p-[0.8px] mt-1 bg-black w-[80%] maxScreenMobile:w-full" />
                <p className="responsiveText italic mt-2">
                  {startTime !== ""
                    ? `Start Time(${startTime})`
                    : "No Start Time Set "}
                  -
                  {endTime !== ""
                    ? ` End Time(${endTime})`
                    : " No End Time Set"}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
