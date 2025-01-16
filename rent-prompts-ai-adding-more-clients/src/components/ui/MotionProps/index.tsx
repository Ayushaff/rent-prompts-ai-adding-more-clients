import { motion, MotionProps } from "framer-motion";

// Utility type to combine MotionProps with React HTML attributes
type MotionComponent<T extends HTMLElement> = MotionProps & React.HTMLAttributes<T>;

// Define all motion components
export const MotionDiv = motion.div as React.FC<MotionComponent<HTMLDivElement>>;
export const MotionSpan = motion.span as React.FC<MotionComponent<HTMLSpanElement>>;
export const MotionP = motion.p as React.FC<MotionComponent<HTMLParagraphElement>>;
export const MotionH1 = motion.h1 as React.FC<MotionComponent<HTMLHeadingElement>>;
export const MotionH2 = motion.h2 as React.FC<MotionComponent<HTMLHeadingElement>>;
export const MotionH3 = motion.h3 as React.FC<MotionComponent<HTMLHeadingElement>>;
export const MotionH4 = motion.h4 as React.FC<MotionComponent<HTMLHeadingElement>>;
export const MotionH5 = motion.h5 as React.FC<MotionComponent<HTMLHeadingElement>>;
export const MotionH6 = motion.h6 as React.FC<MotionComponent<HTMLHeadingElement>>;
export const MotionSection = motion.section as React.FC<MotionComponent<HTMLElement>>;
export const MotionHeader = motion.header as React.FC<MotionComponent<HTMLElement>>;
export const MotionFooter = motion.footer as React.FC<MotionComponent<HTMLElement>>;
export const MotionMain = motion.main as React.FC<MotionComponent<HTMLElement>>;
export const MotionArticle = motion.article as React.FC<MotionComponent<HTMLElement>>;
export const MotionAside = motion.aside as React.FC<MotionComponent<HTMLElement>>;
export const MotionNav = motion.nav as React.FC<MotionComponent<HTMLElement>>;
export const MotionButton = motion.button as React.FC<MotionComponent<HTMLButtonElement>>;
export const MotionInput = motion.input as React.FC<MotionComponent<HTMLInputElement>>;
export const MotionTextarea = motion.textarea as React.FC<MotionComponent<HTMLTextAreaElement>>;
export const MotionLabel = motion.label as React.FC<MotionComponent<HTMLLabelElement>>;
export const MotionUL = motion.ul as React.FC<MotionComponent<HTMLUListElement>>;
export const MotionOL = motion.ol as React.FC<MotionComponent<HTMLOListElement>>;
export const MotionLI = motion.li as React.FC<MotionComponent<HTMLLIElement>>;
export const MotionTable = motion.table as React.FC<MotionComponent<HTMLTableElement>>;
export const MotionTR = motion.tr as React.FC<MotionComponent<HTMLTableRowElement>>;
export const MotionTD = motion.td as React.FC<MotionComponent<HTMLTableCellElement>>;
export const MotionTH = motion.th as React.FC<MotionComponent<HTMLTableCellElement>>;
export const MotionTBody = motion.tbody as React.FC<MotionComponent<HTMLTableSectionElement>>;
export const MotionTHead = motion.thead as React.FC<MotionComponent<HTMLTableSectionElement>>;
export const MotionTFoot = motion.tfoot as React.FC<MotionComponent<HTMLTableSectionElement>>;
export const MotionA = motion.a as React.FC<MotionComponent<HTMLAnchorElement>>;
export const MotionImg = motion.img as React.FC<MotionComponent<HTMLImageElement>>;
export const MotionCanvas = motion.canvas as React.FC<MotionComponent<HTMLCanvasElement>>;
export const MotionVideo = motion.video as React.FC<MotionComponent<HTMLVideoElement>>;
export const MotionAudio = motion.audio as React.FC<MotionComponent<HTMLAudioElement>>;
export const MotionForm = motion.form as React.FC<MotionComponent<HTMLFormElement>>;
export const MotionSelect = motion.select as React.FC<MotionComponent<HTMLSelectElement>>;
export const MotionOption = motion.option as React.FC<MotionComponent<HTMLOptionElement>>;
export const MotionProgress = motion.progress as React.FC<MotionComponent<HTMLProgressElement>>;
export const MotionIframe = motion.iframe as React.FC<MotionComponent<HTMLIFrameElement>>;


export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delays between children elements' animations
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 200 },
  },
};

export const transition = { duration: 1, ease: [0.35, 0.1, 0.25, 1] }

export const variants = {
    hidden: { filter: 'blur(10px)', transform: 'translateY(20%)', opacity: 0 },
    visible: { filter: 'blur(0)', transform: 'translateY(0)', opacity: 1 },
  }
