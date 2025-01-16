"use client";
import React, { useEffect, useRef, useState } from "react";
import { Model } from "@/payload-types";
import LivePreview from "@/components/EditPrompt/EditLivePreview";
import Step2PromptInputs from "@/components/EditPrompt/EditPromptsStep";
import { useParams, useSearchParams } from "next/navigation";
import { useUser } from "@/providers/User";
import { useRouter } from "next/navigation";

interface CreatePrivateRapps {
  type: string;
  model: string;
  computationcost: number;
  systemprompt: string;
  prompt: string;
  negativeprompt: string;
  status: string;
  settings: {
    name: string;
    value: any;
  };
  imageinput: boolean;
  name: string;
  description: string;
  priceapplicable: boolean;
  price: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  promptVariables: [];
  systemVariables: [];
  negativeVariables: [];
  access: Access[];
}
interface Access {
  userId: {
    id: string
    name: string
    balance: number
    role: string
    domain: string
    members: any[] // Adjust type if members have a defined structure
    associatedWith: string
    rappAccess: any[]
    rapps: any[]
    privateRapps: any[]
    apiKey: string | null
    email: string
    createdAt: string
    updatedAt: string
    loginAttempts: number
  }
  getAccess: string[]
  id: string
}

const Privaterapp: React.FC = () => {
  const user = useUser();
  const router = useRouter();
  const params = useParams()
  const slug = params?.id
  const [formData, setFormData] = useState<CreatePrivateRapps>();
  const [rappData, setRappData] = useState(new FormData())
  const searchParams = useSearchParams();
  const type = searchParams?.get("type");


  useEffect(() => {
    if (!user) {
      return router.push("/auth/signIn");
    }
    if (slug) {
      const fetchRappData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/getPromptBySlug/${slug}?type=${type}`,
          )
          if (response.ok) {
            const data = await response.json()
            setFormData({ ...data.rappData, type })
            const form = new FormData()
            Object.keys(data).forEach((key) => {
              form.append(key, data[key])
            })
            setRappData(form)
          }
        } catch (error) {
          console.error('Error fetching rapp data:', error)
        }
      }

      fetchRappData()
    }
  }, [slug, user])

  return (
    <div className="flex flex-col md:flex-row gap-8  md:mx-4 mt-12">
      <div className="md:w-[50%] ">
        <Step2PromptInputs
          formData={formData}
          setFormData={setFormData}
          selectedModel={formData?.model}
        />
      </div>
      <div className="md:w-[50%]">
        <LivePreview
          setFormData={setFormData}
          formData={formData}
          currentStep={2}
        />
      </div>
    </div>
  );
};

export default Privaterapp
