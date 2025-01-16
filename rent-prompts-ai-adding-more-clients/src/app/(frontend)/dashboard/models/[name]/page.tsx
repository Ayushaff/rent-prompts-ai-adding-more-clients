"use client";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface Model {
  id: string;
  name: string;
  description: string;
  type: string;
  cost: number;
  imageinput: boolean; // Indicates if the model accepts image input
  example: string[];
  about: any; // Array of example prompts
}

const ModelDetail = () => {
  const params = useParams();
  const router = useRouter();
  const name = params?.name as string;
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      // Fetch model details by name
      const fetchModel = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/models/${name}`
          );
          if (!response.ok) throw new Error("Failed to fetch model details.");
          const result = await response.json();
          setModel(result.data[0]);
        } catch (error) {
          console.error("Error fetching model details:", error);
        } finally {
          setLoading(false);
        }
      };
      console.log(model?.about)
      fetchModel();
    }
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#ffffff" loading={loading} size={50} />
      </div>
    );
  }
  if (!model) return <p>Model not found.</p>;

  const handleUseModelClick = (modelId: string, type: string) => {
  router.push(`/dashboard/rapps/create/private?model=${modelId}&type=${type}`);
};

  return (
    <div className="flex flex-col lg:flex-row gap-6  bg-indigo-800 shadow-2xl p-6">
      <div className="lg:w-3/4">
        <div className="flex flex-row justify-between">
        <div className="flex items-center gap-4 mb-2">
          <Box className="w-16 h-16 rounded-md" />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{model.name}</h1>
            <div className="text-sm font-medium text-gray-200">
              <span>
                This Model Costs{" "}
                <strong className="text-yellow-400">
                  {model.cost} Credits.
                </strong>
              </span>
            </div>
          </div>
        </div>
        <p className="bg-[#FFFFFF0F] text-white rounded-lg w-fit px-2 py-1 sm:px-3 sm:py-2 font-bold text-xs sm:text-lg h-fit">
          {model.type.toUpperCase()}
        </p>
        </div>
        <div className="mt-6">
        <h2 className="text-sm md:text-4xl font-bold">
          About{" "}{model.name}
        </h2>
        <p className="text-gray-200 mb-4 break-words whitespace-normal mt-4">
          {model.description}
        </p>
        {model.example && model.example.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-medium">Example Prompts</h2>
            <ul className="mt-2 list-disc list-inside">
              {model.example.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
      <div className="lg:w-1/4 space-y-2">
          <div className="break-words whitespace-normal">
      Use this model to create a Rapp sdfsd sfsdf
          </div>
          <Button variant="white" onClick={() => handleUseModelClick(model.id, model.type)} className="w-full">
            Use this Model
          </Button>
      </div>
    </div>
  );
};

export default ModelDetail;
