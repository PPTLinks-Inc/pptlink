// eslint-disable-next-line react/prop-types
import { createPortal } from "react-dom";

export default function Modal({
  open,
  onClose,
  children,
  color
}: {
  open: boolean;
  onClose: (() => void) | null;
  children: React.ReactNode;
  color: string;
}) {
  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose || (() => {})}
      className="z-30 fixed inset-0 flex justify-center items-center transition-colors backdrop-blur-sm bg-black/20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${color} rounded-md shadow relative transition-all  border-2 border-black scale-100 opacity-100`}
      >
        <img src="/team/pptlink_resources/Icon_metro-notification.svg" alt={"icon"} className="absolute !top-0 !left-0 scale-[0.7]" />
        {children}
      </div>
    </div>,
    document.getElementById("portal-modal") as HTMLDivElement
  );
}
