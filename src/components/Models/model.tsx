// eslint-disable-next-line react/prop-types

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
  return (
    <div
      onClick={onClose || (() => {})}
      className={`z-30 fixed inset-0 flex justify-center items-center transition-colors backdrop-blur-sm ${open ? "visible bg-black/20" : "invisible"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${color} rounded-md shadow relative transition-all  border-2 border-black ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        <img src="/team/pptlink_resources/Icon_metro-notification.svg" alt={"icon"} className="absolute !top-0 !left-0 scale-[0.7]" />
        {children}
      </div>
    </div>
  );
}
