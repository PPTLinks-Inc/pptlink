import { useRef, useEffect } from "react";
import {
  ProgressIndicator,
  FormLabelIndicator,
  FormStageMover
} from "./uploadSubcomponents/progressIndicator";
import UploadStage from "./presentationStages/uploadStage";
import InformationStage from "./presentationStages/informationStage";
import PreviewStage from "./presentationStages/previewStage";
import { useUploadStore } from "@/store/uploadStore";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LoadingAssetBig2 } from "@/assets/assets";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import { authFetch } from "@/lib/axios";

export default function SupperUpload() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const currentView = useUploadStore((state) => state.currentView);
  const resetUploadStore = useUploadStore((state) => state.resetStore);
  const [searchParams] = useSearchParams();

  // scroll page to the top when currentView changes
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentView]);

  useEffect(function () {
    return function () {
      resetUploadStore();
    };
  }, []);

  const editPresentationQuery = useQuery({
    queryKey: ["editPresentation", searchParams.get("edit")],
    queryFn: async () => {
      const { data } = await authFetch.get(
        `/api/v1/ppt/presentations/${searchParams.get("edit")}`
      );

      useUploadStore.setState({
        title: data.presentation.name,
        description: data.presentation.description,
        privacy: data.presentation.linkType,
        downloadable: data.presentation.downloadable,
        selectedCategory: data.presentation.category,
        presentersName: data.presentation.presenterName,
        bio: data.presentation.bio,
        socialLinks: data.presentation.social_media,
        date: data.presentation.date,
        startTime: data.presentation.startTime,
        endTime: data.presentation.endTime,
        pdfUrl: data.presentation.thumbnail
      });

      return data;
    },
    enabled: searchParams.has("edit")
  });

  return (
    <>
      <Helmet>
        <title>{`Upload - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks, PPTLinksUpload`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.PPTLink.com/upload`} />
        <meta property="og:title" content={`Upload - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta
          property="twitter:url"
          content={`https://www.PPTLink.com/upload`}
        />

        <meta property="twitter:title" content={`Upload - PPTLinks `} />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>
      <section
        ref={scrollableRef}
        className="uploadSvgCover h-fit relative _bg-[#FFFFF0]"
      >
        <div className="pt-10 pb-16 w-[90%] m-auto bg-transparent h-fit z-50 maxScreenMobile:w-full">
          {editPresentationQuery.isLoading ? (
            <div className="flex flex-col justify-center items-center min-h-screen">
              <LoadingAssetBig2 />
              <p className="text-center">Fetching presentation data</p>
            </div>
          ) : (
            <>
              {/* progress indicator */}
              <ProgressIndicator />
              <div className="w-full min-h-screen bg-[#FFFFF0] shadow-xl relative py-20 maxScreenMobile:pt-0 md:rounded-md">
                <FormLabelIndicator />
                {/* first stage elements 👀👀 */}
                <UploadStage />
                {/* Second stage show els 👀👀 */}
                <InformationStage />
                {/* Third stage show els 👀👀 */}
                <PreviewStage />
              </div>
              {/* form stage tracker */}
              <FormStageMover />
            </>
          )}
        </div>
      </section>
    </>
  );
}
