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

export default function SupperUpload() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const currentView = useUploadStore((state) => state.currentView);

  // scroll page to the top when currentView changes
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentView]);

  return (
    <section
      ref={scrollableRef}
      className="upload_svg_cover h-fit relative bg-[#FFFFF0]"
    >
      <div className="bottom_cover_ pt-10 pb-16 w-[90%] m-auto bg-transparent h-fit z-50 maxScreenMobile:w-full">
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
      </div>
    </section>
  );
}
