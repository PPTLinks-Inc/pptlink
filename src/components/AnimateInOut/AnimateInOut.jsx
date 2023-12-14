import { AnimatePresence, motion } from "framer-motion";

// Component Mount and Unmount Animation Wrapper
export default function AnimateInOut({
  children,
  initial,
  animate,
  exit,
  className,
  show,
}) {
  return (
    <AnimatePresence>
      {show && (
        // Framer Motion wrapper for animation
        <motion.div
          initial={initial}
          animate={animate}
          exit={exit}
          transition={{ type: "keyframes" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
