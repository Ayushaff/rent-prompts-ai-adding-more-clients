"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/providers/User";
import Link from "next/link";
import { Kanban, Waypoints } from "lucide-react";
import { Icons } from "@/components/ui/Icons";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  position: string;
  team: string;
  location: string;
  profileImage: string;
  associateWith: string;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
  };
  ownedRAPPs: { name: string; revenue: number }[];
  managedRAPPs: { name: string; revenue: number }[];
}

interface Rapp {
  images:any[];
  slug: string;
  id: string;
  type: string;
  model?: string;
  rappName: string;
  rappDes: string;
  cost: number;
  totalTokenConsumed: number;
  commission?: number;
  rappStatus: string;
  createdAt: string;
  updatedAt: string;
}

const UserProfile = ({ params }) => {
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [rappData, setRappData] = useState<Rapp[]>([]);
  const [sharedRapps, setSharedRapps] = useState<Rapp[]>([]);
  const [tokenConsumed, setTokenConsumed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  useEffect(() => {
    if (!user) {
      return router.push("/auth/signIn");
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // First API call to fetch user data
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getPublicData`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ slug: decodedSlug }),
          }
        );

        const userResult = await userResponse.json();
        const userId = userResult.data?.id; // Extract the userId

        setUserData(userResult.data);

        if (userId) {
          // Second API call to fetch RAPPs data using the userId
          const rappResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/getRapps`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ id: userId }),
            }
          );

          const result = await rappResponse.json();
          setRappData(result.data?.myRapps);
          console.log("rappdata", rappData);
          console.log("result", result);
          setSharedRapps(result.data?.accessRapps);
          setTokenConsumed(result.data?.totalTokenConsumed)
        } else {
          setError("Failed to retrieve user ID for fetching RAPPs data");
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedSlug, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#ffffff" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="mx-auto bg-indigo-800 md:shadow-xl rounded-lg text-white relative">
      {/* Profile header */}
      <div className="relative z-10 mt-4 bg-gradient-to-br from-black/[0.3] via-black/[0.1] to-black/[0.4] p-5 flex flex-col md:flex-row items-start gap-6 w-full rounded-xl">
      <div className="flex items-center md:justify-start flex-col md:flex-row gap-5 w-full">
        <div className="w-28 h-28 sm:w-36 sm:h-36 sm:min-w-36 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
          <Image
            src={userData?.profileImage || "/DummyUser.webp"}
            alt="User Profile Picture"
            width={144}
            height={144}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold mb-1">
            {userData?.name || "Dummy User"}
          </h1>
          <p className="text-gray-300">{userData?.email}</p>
          <p className="mt-2 text-gray-400">
            {userData?.position || "Software Developer"}
          </p>
          <p className="mt-1 text-sm text-gray-400 flex items-center">
            <MdLocationOn className="mr-2" /> {userData?.location || "Indore"}
          </p>
        </div>
        </div>
      </div>

      {/* Owned and Managed RAPPs */}
      <div className="relative z-10 md:p-6">

      <div className="flex items-center  mt-4 md:mt-0 mb-2 md:mb-4 gap-2">
        <Kanban/>
        <h2 className="text-2xl font-semibold">
          Owned AI APP&apos;s
        </h2>
        </div>

        {rappData?.length === 0 ? (
          <p className="text-gray-400">No self-owned AI Apps available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
            {rappData?.map((rapp, index) => (
              <Link
                href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=private`}
                key={rapp.id}
                className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-4 items-center bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] p-2 sm:p-4 rounded-md w-full shadow hover:shadow-lg transition"
                style={{ gridTemplateColumns: "6fr 1fr 1fr 1fr auto" }}
              >
                <div className="overflow-hidden flex items-center gap-3 sm:gap-4">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-md overflow-hidden min-w-8 md:min-w-12">
                    <Image
                      src={rapp.images?.[0]||"/DummyRapps.png"}
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
                    <p className="text-gray-500 dark:text-gray-400 truncate">
                      {rapp.rappDes}
                    </p>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-right text-white flex justify-end items-center">
                  <p className="leading-none">{rapp.cost}</p>
                  <Image src="/coin-png.png" alt="coin" width={16} height={16} />
                </div>
                <p className="text-xs sm:text-sm text-center text-white">
                  {rapp.model}
                </p>
                <div
                  className={`text-xs sm:text-sm font-medium w-fit flex justify-self-center px-1 py-1 sm:px-2 sm:py-2 rounded-full text-right sm:text-center ${
                    rapp.rappStatus === "approved"
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
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Enterprise Consumption */}
      <div className="relative z-10 mt-6 md:mt-0 md:p-6">
        <div className="flex items-center  mt-4 md:mt-0 gap-2">
          <Waypoints />
          <h2 className="text-2xl font-semibold">Shared AI APP&apos;s</h2>
        </div>
        {sharedRapps?.length === 0 ? (
          <p className="text-gray-400">
            No enterprise consumption data available.
          </p>
        ) : (
          <>
            <p className="text-sm md:text-lg mb-2 md:mb-4 font-semibold">
              Total Consumed: {tokenConsumed}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
              {sharedRapps?.map((rapp, index) => (
                <Link
                  href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=private`}
                  key={rapp.id}
                  className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-4 items-center bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] p-2 sm:p-4 rounded-md w-full shadow hover:shadow-lg transition"
                  style={{ gridTemplateColumns: "6fr 1fr 1fr 1fr auto" }}
                >
                  <div className="overflow-hidden flex items-center gap-3 sm:gap-4">
                    <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-md overflow-hidden min-w-8 md:min-w-12">
                      <Image
                        src={rapp.images?.[0]||"/DummyRapps.png"}
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
                      <p className="text-gray-500 dark:text-gray-400 truncate">
                        {rapp.rappDes}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-right text-white flex justify-end items-center">
                    <p className="leading-none">{rapp.cost}</p>
                    <Image src="/coin-png.png" alt="coin" width={16} height={16} />
                  </div>
                  <p className="text-xs sm:text-sm text-center text-white">
                    {rapp.model}
                  </p>
                  <div
                    className={`text-xs sm:text-sm font-medium w-fit flex justify-self-center px-1 py-1 sm:px-2 sm:py-2 rounded-full text-right sm:text-center ${
                      rapp.rappStatus === "approved"
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
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
