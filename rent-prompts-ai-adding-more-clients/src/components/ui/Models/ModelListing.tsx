"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners"; // Loading spinner
import { Box } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

interface Model {
  id: string;
  name: string;
  description?: string;
  type: string;
  cost?: number;
  imageinput: boolean;
  examples?: any[];
  about?: any;
}

const ModelList = () => {
  const [data, setData] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/models/getAll`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        // setError("Failed to load models.");
        console.error("Error fetching models:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const types = ["text", "image"]; // Hardcoded categories

  // Filter models by selected type
  const filteredData = selectedType
    ? data.filter((model) => model.type === selectedType)
    : data;

  return (
    <div className="rounded-sm border border-stroke bg-indigo-800 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-6">

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#ffffff" loading={loading} size={50} />
        </div>
      ) : data?.length === 0 ? (
        <div className="justify-center mx-auto mt-5 py-10 h-96 bg-indigo-900/[0.4] border-dashed border-2 border-muted-foreground rounded-lg flex items-center flex-col">
          <p className="text-gray-400">
            No models available. Want to create a new one?
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="flex justify-center pb-6 md:pb-6">
              <div className="relative inline-flex flex-wrap justify-center rounded-[1.25rem] bg-black/[0.2] p-1">
                {["all", "text", "image","audio","video"].map((type, index) => (
                  <button
                    key={type}
                    className={`flex h-8 flex-1 items-center gap-2.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-200 ${
                      selectedType === type || (type === "all" && !selectedType)
                        ? "relative bg-gradient-to-b from-black/[0.3] via-black/[0.1] to-black/[0.4] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.indigo.500/0),theme(colors.indigo.500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
                        : "opacity-65 transition-opacity hover:opacity-100"
                    }`}
                    onClick={() =>
                      setSelectedType(type === "all" ? null : type)
                    }
                  >
                    <span
                      className={`fill-current ${
                        selectedType === type ||
                        (type === "all" && !selectedType)
                          ? "text-white"
                          : "text-white"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                      {/* Capitalized */}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mx-auto grid max-w-sm items-start gap-4 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredData.length === 0 ? <div className="mt-16 text-center font-semibold text-base text-white">No Models Available</div>:
            filteredData.map((model) => (
              <Link
                key={model.id}
                href={model.name ? `/dashboard/models/${model.name}` : "#"}
                className="relative rounded-xl bg-gradient-to-br from-black/[0.3] via-black/[0.1] to-black/[0.4] px-4 py-3 backdrop-blur-sm  before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.indigo.800),theme(colors.indigo.700),theme(colors.indigo.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] transform transition duration-500 hover:scale-105 hover:shadow-xl h-full"
              >
                <div className="flex flex-col gap-1 justify-between h-full">
                  <div className="flex flex-row gap-2 justify-between items-center ">
                    <div className="flex flex-row gap-2 items-center">
                      <Box height={36} />
                      <h2 className="text-lg font-bold break-normal whitespace-normal">
                        {model.name}
                      </h2>
                    </div>
                    <p className="bg-[#FFFFFF0F] flex justify-self-end text-white rounded-lg px-2 py-1 font-bold text-xs">
                      {model.type.toUpperCase()}
                    </p>
                  </div>

                  <p className="text-indigo-200/65 whitespace-normal break-words line-clamp-3">
                    {model.description}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    {/* <Image
                      className="inline-flex shrink-0 rounded-full"
                      src={"/DummyRapps.png"}
                      width={36}
                      height={36}
                      alt="asds"
                    /> */}
                    <div className="text-sm font-medium text-gray-200 flex flex-row items-center justify-between w-full">
                      <span>
                        This Model Costs{" "}
                        <strong className="text-yellow-400">
                          {model.cost} Credits.
                        </strong>
                      </span>
                      {/* <span className="text-gray-700"> - </span> */}
                      {model.imageinput && (
                        <ImageIcon
                          className="w-5 h-5"
                          aria-label="This Model Accepts Image as Input."
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelList;
