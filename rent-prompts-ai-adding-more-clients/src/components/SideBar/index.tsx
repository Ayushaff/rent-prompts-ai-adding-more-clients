"use client";
import { cn } from "@/utilities/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion, type MotionProps } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Icons } from "../ui/Icons";

// Define types for components with motion props
type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>;
type MotionSpanProps = MotionProps & React.HTMLAttributes<HTMLSpanElement>;

const MotionDiv = motion.div as React.FC<MotionDivProps>
const MotionSpan = motion.span as React.FC<MotionSpanProps>

interface Links {
  label: string | React.JSX.Element;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  target?: string;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: MotionDivProps) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: MotionDivProps) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <MotionDiv
      className={cn(
        "h-full px-4 py-4 hidden lg:flex md:flex-col bg-indigo-80 border-r-2 border-black-[0.5] shadow-2xl dark:bg-neutral-800 w-[250px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "250px" : "60px") : "250px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-16 px-8 py-4 flex flex-row lg:hidden items-center justify-between bg-black/[0.4] backdrop-blur-md w-full z-50",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center z-20 w-full">
      <Link href="/" className="flex">
                      <Icons.betalogo className="h-8 w-auto fill-primary" />
                      {/* <h1 className="text-xl ml-2 italic font-semibold">
                        RENTPROMPTS
                      </h1> */}
                    </Link>
        <IconMenu2
          className="text-white dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <MotionDiv
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-screen w-full inset-0 bg-indigo-950 dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-white dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  onLogoutClick,
  ...props
   // Event handler for logout link, optional
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
  onLogoutClick?: () => void; // Event handler for logout link, optional
}) => {
  const { open, setOpen, animate } = useSidebar();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {

    if (onLogoutClick) {
      e.preventDefault(); // Prevent default navigation for logout links
      onLogoutClick();
    }
    // Only close the sidebar on mobile screens
    if (window.innerWidth < 1024) { // `lg` breakpoint is 1024px in Tailwind
      setOpen(false);
    }
  };

  return (
    <Link
      href={link.href}
      target={link.target}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {link.icon}
      <MotionSpan
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-white dark:text-neutral-200 text-sm font-bold group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </MotionSpan>
    </Link>
  );
};

