
// eslint-disable-next-line react/prop-types
export default function Menu({ right, open, onClose, children, color }: { right: boolean; open: boolean; onClose: () => void; children: React.ReactNode; color?: string }) {
    return (
      <div
        onClick={onClose}
        className={`z-30 fixed inset-0 flex ${right ? "justify-end" : "justify-start" } items-end transition-colors backdrop-blur-sm ${open ? "visible bg-black/20" : "invisible"}`}
      >
        <div onClick={(e) => e.stopPropagation()} className={`${color} w-full md:w-[40%] sm:w-2/3 h-5/6 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
            <div className="w-full h-full rounded-xl bg-[#FFFFDB] shadow-md absolute right-0 bottom-0 overflow-y-scroll border-[1px] border-[#FF8B1C]">
                {children}    
            </div>    
        </div>
      </div>
    );
  }
  