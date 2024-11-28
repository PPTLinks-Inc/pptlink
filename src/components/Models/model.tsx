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
        className={`${color} rounded-md shadow relative transition-all  border-1 border-black/25 scale-100 opacity-100`}
      >
        {children}
      </div>
    </div>,
    document.getElementById("portal-modal") as HTMLDivElement
  );
}
