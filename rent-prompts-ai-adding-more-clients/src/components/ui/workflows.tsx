import Image from "next/image";
import WorflowImg01 from "../../../public/CardImg.png";
import WorflowImg02 from "../../../public/CardImg.png";
import WorflowImg03 from "../../../public/CardImg.png";
import { containerVariants, itemVariants, MotionDiv, transition, variants } from "./MotionProps";

export default function Workflows() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MotionDiv variants={containerVariants}
            initial="hidden"
            whileInView="visible" className="pb-12 md:pb-20">
          {/* Section header */}
          <MotionDiv variants={itemVariants}>
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-indigo-600 bg-clip-text text-transparent">
                Tailored Workflows
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Map your product journey
            </h2>
            <p className="text-lg text-indigo-200/65 break-words whitespace-normal">
              Simple and elegant interface to start collaborating with your team
              in minutes. It seamlessly integrates with your code and your
              favorite programming languages.
            </p>
          </div>
          </MotionDiv>
          {/* Spotlight items */}
          <div className="group mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {/* Card 1 */}
          <MotionDiv transition={transition}
              variants={variants}>
            <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 "
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] after:absolute after:inset-0">
                {/* Arrow */}
                <div
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={9}
                    height={8}
                    fill="none"
                  >
                    <path
                      fill="#F4F4F5"
                      d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                    />
                  </svg>
                </div>
                {/* Image */}
                <Image
                  className="inline-flex w-full"
                  src={WorflowImg01}
                  width={350}
                  height={288}
                  alt="Workflow 01"
                />
                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <span className="btn-sm relative rounded-full bg-white px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.700/.15),theme(colors.gray.700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
                      <span className="bg-indigo-600 bg-clip-text text-transparent">
                        Built-in Tools
                      </span>
                    </span>
                  </div>
                  <p className="text-indigo-200/65 break-words whitespace-normal">
                    Streamline the product development flow with a content
                    platform that&apos;s aligned across specs and insights.
                  </p>
                </div>
              </div>
            </a>
            </MotionDiv>
            {/* Card 2 */}
          <MotionDiv transition={transition}
              variants={variants}>
          <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 "
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] after:absolute after:inset-0">
                {/* Arrow */}
                <div
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={9}
                    height={8}
                    fill="none"
                  >
                    <path
                      fill="#F4F4F5"
                      d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                    />
                  </svg>
                </div>
                {/* Image */}
                <Image
                  className="inline-flex w-full"
                  src={WorflowImg02}
                  width={350}
                  height={288}
                  alt="Workflow 02"
                />
                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <span className="btn-sm relative rounded-full bg-white px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.700/.15),theme(colors.gray.700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
                      <span className="bg-indigo-600 bg-clip-text text-transparent break-words whitespace-normal">
                        Scale Instantly
                      </span>
                    </span>
                  </div>
                  <p className="text-indigo-200/65 break-words whitespace-normal">
                    Streamline the product development flow with a content
                    platform that&apos;s aligned across specs and insights.
                  </p>
                </div>
              </div>
            </a>
            </MotionDiv>
            {/* Card 3 */}
          <MotionDiv transition={transition}
              variants={variants}>
          <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500"
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] after:absolute after:inset-0">
                {/* Arrow */}
                <div
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={9}
                    height={8}
                    fill="none"
                  >
                    <path
                      fill="#F4F4F5"
                      d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                    />
                  </svg>
                </div>
                {/* Image */}
                <Image
                  className="inline-flex w-full"
                  src={WorflowImg03}
                  width={350}
                  height={288}
                  alt="Workflow 03"
                />
                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <span className="btn-sm relative rounded-full bg-white px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.700/.15),theme(colors.gray.700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
                      <span className="bg-indigo-600 bg-clip-text text-transparent">
                        Tailored Flows
                      </span>
                    </span>
                  </div>
                  <p className="text-indigo-200/65 break-words whitespace-normal">
                    Streamline the product development flow with a content
                    platform that&apos;s aligned across specs and insights.
                  </p>
                </div>
              </div>
            </a>
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
