"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ClipLoader } from "react-spinners"; // Loading spinner
import { toast } from "sonner";
import { Icons } from "../Icons";
import axios from "axios";
import AiAppTypeModal from "../../../components/AiAppTypeModal";
import { motion, MotionProps } from "framer-motion";
import AiRappFilter from "../../../components/AiRappFilter";
import { Input } from "../input";

interface Rapp {
  images: string[];
    slug: string;
  id: string;
  type: string;
  model?: string;
  rappName: string;
  rappDes: string;
  cost: number;
  commission?: number;
  rappStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface MotionDivProps extends MotionProps {
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
  children?: React.ReactNode;
}

const MotionDiv: React.FC<MotionDivProps> = ({
  onClick,
  className,
  "aria-label": ariaLabel,
  children,
  ...motionProps
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

interface MotionButtonProps extends MotionProps {
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  "aria-label": string;
  children: React.ReactNode;
}

const MotionButton: React.FC<MotionButtonProps> = ({
  onClick,
  className = "motion-button",
  "aria-label": ariaLabel = "Button",
  children,
  ...motionProps
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

const ProductList = () => {
  const [data, setData] = useState<Rapp[]>([]);
  const [publicRappData, setPublicRappData] = useState<Rapp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [deleteRappId, setDeleteRappId] = useState<string | null>(null);
  const [deleteRappType, setDeleteRappType] = useState<string | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rapptype, setRapptype] = useState<string>(
    // Initialize rapptype from localStorage (if available)
    typeof window !== "undefined" ? localStorage.getItem("rapptype") || "all" : "all"
  );

  const getRapps = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/getRapps`,
        { headers: { "Content-Type": "application/json" } }
      );
      const myRapps = response?.data.data.myRapps || [];
      const publicRapps = response?.data.data.publicRapps || [];
      if (rapptype === "private") {
        setData(myRapps);
        setPublicRappData([]);
      } else if (rapptype === "public") {
        setPublicRappData(publicRapps);
        setData([]);
      } else {
        setData(myRapps);
        setPublicRappData(publicRapps); // Set public Rapps
      }
    } catch (error) {
      console.error("Error fetching rapps:", error);
      toast.error("Failed to fetch Rapps. Please try again later.");
    } finally {
      console.log("publicRappData", publicRappData);

      setLoading(false);
    }
  }, [rapptype]);

  useEffect(() => {
    getRapps();
  }, [getRapps]);

  useEffect(() => {
    localStorage.setItem("rapptype", rapptype);
  }, [rapptype]);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleRun = (e: React.MouseEvent, rappName: string, rappId, type) => {
    e.preventDefault();
    handleActionClick(e);
    window.open(`/dashboard/rapps/run/${rappName}?id=${rappId}&type=${type}`, "_blank");
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent, type:string) => {
    e.preventDefault();
    handleActionClick(e);
    setDeleteRappId(id);
    setDeleteRappType(type)
    setDropdownOpen(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteRappId && deleteRappType) {
      try {
        const req = await fetch( 
          deleteRappType === 'private'
            ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/${deleteRappId}`
            : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/rapps/${deleteRappId}`, 
          {
           method: "DELETE", 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const response = await req.json();

        if (req.ok) {
          toast.success("Rapp Deleted Successfully");
          setData((prev) => prev.filter((rapp) => rapp.id !== deleteRappId));
          setDeleteRappId(null);
          window.location.reload();
        } else {
          toast.error(response.error);
          setDeleteRappId(null);
        }
      } catch (error) {
        console.error("Error deleting rapp:", error);
        toast.error("Failed to delete Rapp. Please try again later.");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteRappId(null);
  };

  const handleCreateAIApp = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (filter: string) => {
    setRapptype(filter);
  };


  return (
    <div className="rounded-sm border border-stroke bg-indigo-800 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 md:mb-0">
          <h4 className="text-lg sm:text-xl font-semibold text-white">
            AI App List
          </h4>

          <MotionButton
            onClick={handleCreateAIApp}
            className="px-2 md:px-4 py-1 md:py-2 bg-indigo-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
            aria-label="Create AI App"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create AI App
          </MotionButton>
        </div>
        <div className="flex items-center justify-between md:justify-end w-full gap-2">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search by username or email"
              className="w-full bg-gradient-to-br from-indigo-900 to-indigo-950 border-muted-foreground text-white pl-10 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500  transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icons.searchbar />
            </div>
          </div>
          <AiRappFilter onFilterChange={handleFilterChange} rappType={rapptype} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isModalOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AiAppTypeModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#ffffff" loading={loading} size={50} />
        </div>
      ) : (
        <>
          {/* Your Rapps Section */}
          {data?.length > 0 || publicRappData?.length > 0 ? (
            <>
              {/* Render Private Rapps Heading if applicable */}
              {(rapptype === "all" || rapptype === "public") && publicRappData?.length > 0 && (
                <h6 className="text-md font-semibold text-white mb-2">
                  Public Apps
                </h6>
              )}
              {publicRappData?.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {publicRappData.map((rapp) => (
                    <Link
                      href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=public`}
                      key={rapp.id}
                      className="grid gap-2 sm:gap-4 items-center bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] p-2 sm:p-4 rounded-md w-full shadow hover:shadow-lg transition 
                      [grid-template-columns:minmax(0,_6fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_0.5fr)_minmax(0,_0.5fr)]
                      md:[grid-template-columns:minmax(0,_5fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_0.5fr)_minmax(0,_1fr)_auto]"
                    >
                      <div className="overflow-hidden flex items-center gap-3 sm:gap-4">
                        <div className="h-8 w-8 sm:h-14 sm:w-14 rounded-md overflow-hidden min-w-8 sm:min-w-14">
                          <Image
                            src={rapp.images?.[0] || "/DummyRapps.png"}
                            width={64}
                            height={64}
                            alt="dummy image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="text-xs sm:text-base break-words whitespace-normal">
                          <h5 className="font-medium text-white break-word whitespace-normal">
                            {rapp.rappName}
                          </h5>
                          <p className="text-gray-500 dark:text-gray-400 line-clamp-2 break-words whitespace-normal">
                            {rapp.rappDes}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-right text-white flex justify-end items-center">
                        <p className="leading-none">{rapp.cost}</p>
                        <Image src="/coin-png.png" alt="coin" width={16} height={16} />
                      </div>
                      <p className="text-xs sm:text-sm hidden md:block text-center text-white">
                        {rapp.model}
                      </p>
                      <p className="text-xs sm:text-sm text-center text-white">
                        {rapp.type}
                      </p>
                      <div
                        className={`text-xs sm:text-sm font-medium w-fit flex justify-self-center px-1 py-1 sm:px-2 sm:py-2 rounded-full text-right sm:text-center ${rapp.rappStatus === "approved"
                          ? "bg-white/[0.1] text-success"
                          : rapp.rappStatus === "pending"
                            ? "bg-white/[0.1] text-warning"
                            : "bg-white/[0.1] text-danger"
                          }`}
                      >
                        {rapp.rappStatus === "approved" && (
                          <p className="flex flex-row gap-1 items-center">
                            <Icons.approved />{" "}
                            <span className="hidden md:block">Approved</span>
                          </p>
                        )}
                        {rapp.rappStatus === "pending" && (
                          <p className="flex flex-row gap-1 items-center">
                            <Icons.pending />{" "}
                            <span className="hidden md:block">Pending</span>
                          </p>
                        )}
                        {rapp.rappStatus === "denied" && (
                          <p className="flex flex-row gap-1 items-center">
                            <Icons.denied />{" "}
                            <span className="hidden md:block">Denied</span>
                          </p>
                        )}
                      </div>

                      {/* Three dots menu button */}
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(e, rapp.id)}
                          className="flex justify-center items-center text-xs sm:btn-sm text-white transition duration-300 dark:text-white dark:hover:bg-indigo-800/70"
                        >
                          <EllipsisVertical />
                        </button>
                        {/* Dropdown menu */}
                        {dropdownOpen === rapp.id && (
                          <div className="absolute right-4 mt-2 w-28 bg-white rounded-md shadow-lg dark:bg-gray-800">
                            <button
                              onClick={(e) => handleRun(e, rapp.rappName, rapp.id, "public")}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:text-white w-full text-left"
                            >
                              Run
                            </button>

                            <Link href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=public`}>
                              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:text-white w-full text-left">
                                Edit
                              </button>
                            </Link>
                            <button
                              onClick={(e) => handleDeleteClick(rapp.id, e, "public")}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:text-white w-full text-left"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {(rapptype === "all" || rapptype === "private") && data?.length > 0 && (
                <h6 className="text-md font-semibold text-white mb-2 mt-6">
                  Private Apps
                </h6>
              )}
              {data?.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {data.map((rapp) => (
                    <Link
                      href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=private`} 
                      key={rapp.id}
                      className="grid gap-2 sm:gap-4 items-center bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] p-2 sm:p-4 rounded-md w-full shadow hover:shadow-lg transition 
                      [grid-template-columns:minmax(0,_6fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_0.5fr)_minmax(0,_0.5fr)]
                      md:[grid-template-columns:minmax(0,_5fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_0.5fr)_minmax(0,_1fr)_auto]"
                    >
                      <div className="overflow-hidden flex items-center gap-3 sm:gap-4">
                        <div className="h-8 w-8 sm:h-14 sm:w-14 rounded-md overflow-hidden min-w-8 sm:min-w-14">
                          <Image
                            src={rapp.images?.[0] || "/DummyRapps.png"}
                            width={64}
                            height={64}
                            alt="dummy image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="text-xs sm:text-base break-words whitespace-normal">
                          <h5 className="font-medium text-white break-word whitespace-normal">
                            {rapp.rappName}
                          </h5>
                          <p className="text-gray-500 dark:text-gray-400 line-clamp-2 break-words whitespace-normal">
                            {rapp.rappDes}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-right text-white flex justify-end items-center">
                        <p className="leading-none">{rapp.cost}</p>
                        <Image src="/coin-png.png" alt="coin" width={16} height={16} />
                      </div>
                      <p className="text-xs sm:text-sm hidden md:block text-center text-white">
                        {rapp.model}
                      </p>
                      <p className="text-xs sm:text-sm text-center text-white">
                        {rapp.type}
                      </p>
                      <div
                        className={`text-xs sm:text-sm font-medium w-fit flex justify-self-center px-1 py-1 sm:px-2 sm:py-2 rounded-full text-right sm:text-center ${rapp.rappStatus === "approved"
                          ? "bg-white/[0.1] text-success"
                          : rapp.rappStatus === "pending"
                            ? "bg-white/[0.1] text-warning"
                            : "bg-white/[0.1] text-danger"
                          }`}
                      >
                        {rapp.rappStatus === "approved" && (
                          <p className="flex flex-row gap-1 items-center">
                            <Icons.approved />{" "}
                            <span className="hidden md:block">Approved</span>
                          </p>
                        )}
                        {rapp.rappStatus === "pending" && (
                          <p className="flex flex-row gap-1 items-center">
                            <Icons.pending />{" "}
                            <span className="hidden md:block">Pending</span>
                          </p>
                        )}
                        {rapp.rappStatus === "denied" && (
                          <p className="flex flex-row gap-1 items-center">
                            <Icons.denied />{" "}
                            <span className="hidden md:block">Denied</span>
                          </p>
                        )}
                      </div>

                      {/* Three dots menu button */}
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(e, rapp.id)}
                          className="flex justify-center items-center text-xs sm:btn-sm text-white transition duration-300 dark:text-white dark:hover:bg-indigo-800/70"
                        >
                          <EllipsisVertical />
                        </button>
                        {/* Dropdown menu */}
                        {dropdownOpen === rapp.id && (
                          <div className="absolute right-4 mt-2 w-28 bg-white rounded-md shadow-lg dark:bg-gray-800">
                            <button
                              onClick={(e) => handleRun(e, rapp.rappName, rapp.id, "private")}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:text-white w-full text-left"
                            >
                              Run
                            </button>

                            <Link href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=private`}>
                              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:text-white w-full text-left">
                                Edit
                              </button>
                            </Link>
                            <button
                              onClick={(e) => handleDeleteClick(rapp.id, e, "private")}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:text-white w-full text-left"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="justify-center text-wrap text-center mx-auto mt-5 py-10 h-96 bg-indigo-900/[0.4] border-dashed border-2 border-muted-foreground rounded-lg flex items-center flex-col">
              <p className="text-gray-400">
                No AI apps available. Want to create a new one?
              </p>
              <button
                onClick={handleCreateAIApp}
                className="px-2 md:px-4 py-1 md:py-2 text-sm md:text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                aria-label="Create AI App"
              >
                Create AI App
              </button>
            </div>
          )}


          {/* Confirmation modal */}
          {deleteRappId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-md shadow-lg p-6 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Delete
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure want to delete this AI app?
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleDeleteCancel}
                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>)}
    </div>
  );
};

export default ProductList;