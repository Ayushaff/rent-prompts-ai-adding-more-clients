import Link from "next/link";
import React from "react";
import { Icons } from "./Icons";

const Footer = () => {
  return (
    <footer className="">
      <div className="max-w-screen-xl px-4 py-16  mx-auto sm:px-6 lg:px-8 bg-gray/5 border-t-2 border-t-indigo-600 mt-16">
        <div className=" grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="pl-0 lg:pl-12 items-center lg:items-start lg:justify-start justify-center">
            <Link
              href="/"
              className="flex lg:items-start items-center lg:justify-start justify-center lg:ml-0"
            >
              <Icons.fulllogo className="h-12 w-auto fill-primary" />
            </Link>
            <div className="flex lg:items-center lg:justify-start items-center justify-center">
              <p className="max-w-xs mt-4 lg:mt-2 text-sm text-center lg:text-left text-primary">
                One-Stop Marketplace for Generative AI
                <br /> &rArr; Responsible | Affordable | Relevant | Easy
              </p>
            </div>
            <div className="flex mt-8 lg:mt-4 items-center lg:items-center lg:justify-start justify-center space-x-6 text-primary">
              <Link
                className="hover:text-indigo-500"
                href="https://www.facebook.com/share/TxVFGpBgLVKkNLgS/?mibextid=qi2Omg"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> Facebook </span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                className="hover:text-indigo-500"
                href="https://www.instagram.com/rentprompts/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> Instagram </span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                className="hover:text-indigo-500"
                href="https://x.com/RentPrompts"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> X </span>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 396 396"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M301.026 37.125H355.608L236.362 173.415L376.645 358.875H266.805L180.774 246.394L82.335 358.875H27.72L155.265 213.097L20.691 37.125H133.32L211.084 139.936L301.026 37.125ZM281.869 326.205H312.114L116.886 68.079H84.4305L281.869 326.205Z" />
                </svg>
              </Link>
              <Link
                className="hover:text-indigo-500"
                href="https://www.linkedin.com/company/crex-rentprompts" // Add the LinkedIn URL here
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> LinkedIn </span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm-2.708 18H6.5v-7h2.792v7zm-1.396-8.04c-.89 0-1.61-.73-1.61-1.62 0-.89.72-1.62 1.61-1.62.89 0 1.61.73 1.61 1.62 0 .89-.72 1.62-1.61 1.62zm10.396 8.04h-2.792v-3.403c0-.813-.015-1.86-1.134-1.86-1.134 0-1.309.886-1.309 1.803V18h-2.792v-7h2.683v.961h.04c.375-.71 1.292-1.46 2.662-1.46 2.847 0 3.372 1.872 3.372 4.303V18z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <p className="mt-5 text-xs hidden lg:flex">
              © 2024 CREX RentPrompts Pvt Ltd. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 lg:col-span-2 sm:grid-cols-3 lg:grid-cols-3">
            <div className="">
              <p className="font-medium text-center">Explore</p>
              <nav className="flex flex-col mt-4 space-y-2 text-sm text-primary items-center justify-center">
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/community"
                >
                  {" "}
                  Community{" "}
                </Link>
                {/* <Link
                  className="hover:text-indigo-500 text-center"
                  href="/generate"
                >
                  {" "}
                  Media{" "}
                </Link> */}
                {/* <Link
                  className="hover:text-indigo-500 text-center"
                  href="/rent"
                >
                  {" "}
                  Prompts{" "}
                </Link> */}
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/explore"
                >
                  {" "}
                  Rapps{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/academy"
                >
                  {" "}
                  Academy{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/blog"
                >
                  {" "}
                  Blogs{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="https://discord.gg/kPkYbzMvN3"
                  target="_blank"
                >
                  {" "}
                  Events{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/explore"
                >
                  {" "}
                  Explore{" "}
                </Link>
              </nav>
            </div>
            <div>
              <p className="font-medium text-center">Services</p>
              <nav className="flex flex-col mt-4 space-y-2 text-sm text-primary items-center justify-center">
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/generate"
                >
                  {" "}
                  Generate{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/sell"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Sell{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/rent"
                >
                  {" "}
                  Rent{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/bounties"
                >
                  {" "}
                  Bounties{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/services"
                >
                  {" "}
                  Consulting Services{" "}
                </Link>
              </nav>
            </div>
            <div>
              <p className="font-medium text-center">Legal</p>
              <nav className="flex flex-col mt-4 space-y-2 text-sm text-primary items-center justify-center">
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/termsandconditions"
                >
                  {" "}
                  Terms &amp; Conditions{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="/privacypolicy"
                >
                  {" "}
                  Privacy Policy{" "}
                </Link>
                <Link
                  className="hover:text-indigo-500 text-center"
                  href="refundpolicy"
                >
                  {" "}
                  Refund Policy{" "}
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs flex px-4 text-center items-center justify-center lg:hidden">
          © 2024 CREX RentPrompts Pvt Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
