
// eslint-disable-next-line react/prop-types
export default function Modal({ open, onClose, children, color }) {
  return (
    <div
      onClick={onClose}
      className={`z-30 fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}
    >
      <div onClick={(e) => e.stopPropagation()} className={`${color} rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>{children}</div>
    </div>
  );
}
