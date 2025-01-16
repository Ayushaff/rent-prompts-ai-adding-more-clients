"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/utilities/cn";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GlowingStarsBackgroundCard } from "./glowing-stars";
import ImageSlider from "./ImageSlider";

interface PrivateRappProps {
  privateRapp: any | null; // Change to reflect your new data structure
  index: number;
  user?: any;
}

const RappListing = ({ privateRapp, index, user }: PrivateRappProps) => {
  const validUrls = privateRapp?.images
    .map(({ image }: any) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState(
    validUrls
      ? validUrls[0]
      : "/public/DummyRapps.png"
  );
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likes, setLikes] = useState(privateRapp?.likes_length ?? 0);
  const [isLike, setIsLike] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (privateRapp?.likes_id && user?.id) {
      setIsLike(privateRapp.likes_user_id?.includes(user.id));
    }

    if (privateRapp?.likes_id) {
      setLikes(privateRapp.likes_length);
    }
  }, [privateRapp, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  const handleImageClick = (imageSrc: string) => setActiveImage(imageSrc);

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded);

  const handleLikeClick = async (privateRappId: string) => {
    if (!user?.id) {
      toast.error("You are not logged in.");
      return;
    }

    setLoading(true);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/privateRappsLikes/${privateRappId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          credentials: "include",
        }
      );

      if (!result.ok) {
        console.error("Error:", result.status, result.statusText);
        setLoading(false);
        return;
      }

      const body = await result.json();
      setLikes(body.likeCount);
      setIsLike(body.isLikeUpdated);
    } catch (error) {
      console.error("Error fetching like data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    setbuttonLoading(true);
    router.push(`/rent/${privateRapp.id}`);
  };

  return (
    <React.Fragment>
      <GlowingStarsBackgroundCard className="relative">
      {/* <div className="absolute top-0 right-0 font-bold rounded z-20">
        <p className="px-2 py-1 text-sm rounded bg-indigo-400 text-white font-bold ">
          {privateRapp.modelType}
        </p>
      </div> */}

      <Link
        className={cn(
          "invisible h-full w-full cursor-pointer rounded-t-lg group/main",
          {
            "visible animate-in fade-in-5": isVisible,
          }
        )}
        href={""}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative">
          {privateRapp.isFeatured === true && (
            <div className="absolute -top-7 -left-9 w-auto px-2 z-20 text-sm font-bold text-indigo-700 rounded-xl flex justify-center items-center">
              <div className="relative bg-gradient-to-r from-indigo-400 to-cyan-400 text-white text-xs font-extrabold px-2 py-1 rounded-tl-lg rounded-br-lg shadow-lg overflow-hidden animate-pulse-glow">
                FEATURED
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-indigo-600 opacity-80 w-full h-full transform translate-x-full animate-slide-glow" />
              </div>
            </div>
          )}
        </div>

        <ImageSlider urls={validUrls} onArrowClick={handleArrowClick} />
        <div className="flex items-start gap-4 md:gap-8 justify-between mt-4">
          <div className="flex items-center gap-1">
            <Heart
              className={`cursor-pointer ${isLike ? "text-red-500 fill-red-500" : ""}${loading ? "animate-pulse text-red-500 fill-red-500" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLikeClick(privateRapp?.id);
              }}
            />
            <p className="font-bold">{likes}</p>
          </div>
          <div className="flex gap-1 ">
            <p className="px-2 pb-1 text-sm rounded bg-white text-indigo-600 font-bold border">
              {privateRapp.modelName}
            </p>

            {/* <div className="w-auto">
              <p className="rounded px-1 bg-white/30 text-white flex items-center justify-center font-bold">
                <span className="mb-[1px] text-md pr-[2px]">
                  {privateRapp.totalCost === 0 ? "FREE" : privateRapp.totalCost}
                </span>
                {privateRapp.totalCost === 0 ? "" : (
                  <img
                    src={coinImage.src}
                    alt="Coin"
                    style={{ width: "20px", height: "20px" }}
                  />
                )}
              </p>
            </div> */}
          </div>
        </div>

        <div className="flex flex-col-2 items-start gap-4 md:gap-6 justify-between mt-1 w-full">
          <div className="w-[78%]">
            <h3 className="font-medium truncate text-lg md:text-md">
              {privateRapp.name}
            </h3>
          </div>
        </div>
        <h3 className="mt-1 font-medium truncate text-md md:text-sm">
          {privateRapp.description}
        </h3>
      </Link>
      </GlowingStarsBackgroundCard>
    </React.Fragment>
  );
};

export default RappListing;
