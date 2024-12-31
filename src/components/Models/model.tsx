// eslint-disable-next-line react/prop-types
import { useEffect } from "react";
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
  useEffect(
    function () {
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          onClose && onClose();
        }
      }
      if (open) {
        window.addEventListener("keydown", handleKeyDown);
      }
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    },
    [onClose, open]
  );

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose || (() => {})}
      className="z-30 fixed inset-0 flex justify-center items-center transition-colors backdrop-blur-sm bg-primaryTwo/20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${color} rounded-md shadow relative transition-all  border-1 border-primaryTwo/25 scale-100 opacity-100`}
      >
        {children}
      </div>
    </div>,
    document.getElementById("portal-modal") as HTMLDivElement
  );
}
