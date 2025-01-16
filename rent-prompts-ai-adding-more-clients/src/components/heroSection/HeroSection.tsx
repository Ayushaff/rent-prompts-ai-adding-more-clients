"use client";

import Container from "@/components/ui/Container";
import ParticleAnimationCanvas from "@/components/ui/ParticleAnimation";
import ModalVideo from "../ui/modal-video";
import Video from "../../../public/VideoThumbnail.png";
import HeroHeader from "./HeroHeader";
import Workflows from "../ui/workflows";
import Testimonials from "../ui/testimonials";
import Link from "next/link";
import Footer from "../ui/Footer";
import { useUser } from "@/providers/User";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { itemVariants, MotionDiv, MotionSpan } from "../ui/MotionProps";

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useUser();
  const router = useRouter();

  const transition = { duration: 1, ease: [0.35, 0.1, 0.25, 1] };
  const variants = {
    hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
    visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
  };

  const handleDiveIn = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Container>
        <HeroHeader />
        <div className="w-screen relative -z-10">
          <div className="absolute top-0 left-0 right-0 overflow-x-hidden">
            <ParticleAnimationCanvas />
          </div>
        </div>
        <div className=" my-20 md:mt-20 md:mb-32">
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.06 }}
            className=" top-20 left-0 right-0 z-10"
          >
            <MotionSpan transition={transition} variants={variants}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold flex flex-col sm:text-3xl text-center drop-shadow-2xl">
                Welcome to{" "}
                <span
                  className="text-5xl mt-2 sm:text-6xl
          md:text-7xl lg:text-8xl"
                >
                  rentprompts.ai
                </span>
              </h1>
            </MotionSpan>
            <MotionDiv
              transition={transition}
              variants={variants}
              className="flex items-center justify-center mt-6"
            >
              <button onClick={handleDiveIn}>
                <div
                  // href="/dashboard"
                  className="relative inline-flex items-center justify-center px-8 py-5 mt-4 overflow-hidden font-bold text-white rounded-full bg-indigo-600 shadow-2xl group"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:opacity-100"></span>
                  <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
                  <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
                  <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
                  <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
                  <span className="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
                  <span className="relative text-2xl">Dive in</span>
                </div>
              </button>
            </MotionDiv>
          </MotionDiv>
        </div>

        <div className="items-center flex justify-center flex-col gap-10 px-4 mx-auto">
          <ModalVideo
            thumb={Video}
            thumbWidth={960}
            thumbHeight={540}
            thumbAlt="Modal video thumbnail"
            video="videos//video.mp4"
            videoWidth={1920}
            videoHeight={1080}
          />

          <Workflows />
          <div className="hidden md:block">
            <Testimonials />
          </div>
        </div>
        <Footer />
      </Container>

      {showModal && (
        <MotionDiv
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.06 }}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={() => setShowModal(false)}>
            <MotionDiv variants={itemVariants} onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-lg shadow-lg px-8 py-6 w-96">
                <MotionSpan transition={transition} variants={variants}>
                  <h2 className="text-2xl font-bold text-indigo-900 mb-4">
                    Welcome!
                  </h2>
                  <p className="text-gray-600 mb-6 text-wrap">
                    You need to log in to access your dashboard. Please sign in
                    to continue!
                  </p>
                </MotionSpan>
                <MotionDiv transition={transition} variants={variants}>
                  <div className="flex justify-end">
                    <Link href="/auth/signIn">
                      <button className="px-6 py-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700">
                        Log In
                      </button>
                    </Link>
                  </div>
                </MotionDiv>
              </div>
            </MotionDiv>
          </div>
        </MotionDiv>
      )}
    </>
  );
};

export default HeroSection;
