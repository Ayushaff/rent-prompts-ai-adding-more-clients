"use client";
import React, { useEffect, useRef, useState } from "react";
import Step1ModelSelection from "@/components/PrivateRapp/Step1ModelSelection";
import Step2PromptInputs from "@/components/PrivateRapp/Step2PromptInputs";
import StepNavigation from "@/components/PrivateRapp/StepNavigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LivePreview from "./LivePreview";
import Step3RappDetails from "./Step3RappDetails";
import { Model } from "@/payload-types";
import Link from "next/link";
import Step4RappDetails from "./Step4RappDetails";
import { ClipLoader } from "react-spinners";
import { useUser } from "@/providers/User";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CreatePrivateRapps {
  imageString?: [];
  type: string;
  modelType: string;
  model: string;
  modelName: string;
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
  access: [];
  key: string;
  images?: [];
  needsApproval:boolean;
}

const Privaterapp: React.FC = () => {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePrivateRapps>({
    type: "text",
    modelType: "text",
    imageString: [],
    model: "",
    modelName: "",
    computationcost: 0,
    systemprompt: "",
    prompt: "",
    negativeprompt: "",
    status: "pending",
    settings: {
      name: "",
      value: "",
    },
    imageinput: false,
    name: "",
    description: "",
    priceapplicable: false,
    price: 0,
    totalCost: 0,
    promptVariables: [],
    systemVariables: [],
    negativeVariables: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    access: [],
    key: 'test',
    images: [],
    needsApproval: false,
  });
  const [step, setStep] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [isStepValid, setIsStepValid] = useState({
    step1: false,
    step2: false,
    step3: false,
  });
  const sendInvitationsRef: any = useRef(null);
  const [selectedUsers, setSelectedUsers] = useState<{
    [userId: string]: { email: string; access: boolean; permissions: string[] };
  }>({});
  const [isSending, setIsSending] = useState(false);


  const pathname = usePathname();

  // Function to extract the word after /create for the rappCreatingType
  const getWordAfterCreate = (path: string): string | null => {
    const match = path.match(/\/create\/(.+?)(?:\/|$)/);
    return match ? match[1] : null;
  };

  const rappCreateType = getWordAfterCreate(pathname || "");

  // Use useEffect to update formData when rappCreateType changes
  useEffect(() => {
    if (rappCreateType) {
      setFormData((prev) => ({
        ...prev,
        rappCreateType,
      }));
    }
  }, [rappCreateType]);

  // Check query parameters on initial render
  useEffect(() => {
    if (!searchParams) return;
    const modelId = searchParams.get("model") || '';
    const type = searchParams.get("type") || '';

    if (modelId && type) {
      // Update formData and skip to Step 2
      setFormData((prev) => ({
        ...prev,
        model: modelId,
        type,
      }));
      setStep(2);
    }
  }, [searchParams]);  // Trigger effect on changes to searchParams



  useEffect(() => {
    if (!user) {
      return router.push("/auth/signIn");
    }
    const fetchModels = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/models/getAll`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setModels(result.data || []);
      } catch (err) {
        setError("Failed to load models.");
        console.error("Error fetching models:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [user]);

  // Handle validation change from Step1ModelSelection
  const handleValidationChange = (isValid: boolean) => {
    // Only update if the validation state actually changed
    if (isValid !== isStepValid[`step${step}`]) {
      setIsStepValid((prev) => ({
        ...prev,
        [`step${step}`]: isValid,
      }));
    }

    // Only update canProceed if the value is different
    if (isValid !== canProceed) {
      setCanProceed(isValid);
    }
  };

  // Determine max steps based on user role
  const maxSteps = user?.role === "entAdmin" ? 4 : 3;
  const totalSteps = user?.role === "entAdmin" ? 4 : 3;

  const nextStep = () => {

    if (
      (user?.role === "entAdmin" && step === 4) ||
      (user?.role !== "entAdmin" && step === 3)
    ) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (isSending) return;

    try {
      setIsSending(true);
      if (sendInvitationsRef.current) {
        await sendInvitationsRef.current();
      }
      setSuccessMessage("AI App Created Successfully!");
    } catch (error) {
      console.error("Error processing invitations and permissions:", error);
      setSuccessMessage("Failed to process the request. Please try again.");
      setError("Failed to process the request. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Find the selected model using the stored model ID
  const selectedModel = models.find((model) => model.id === formData.model);

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#ffffff" loading={loading} size={50} />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="md:p-4 py-4 flex flex-col gap-4 md:bg-indigo-800 md:shadow-2xl relative w-full">
        <StepNavigation step={step} totalSteps={totalSteps} />
        {successMessage ? ( // Check if submitted
          <div className="flex flex-col items-center mt-10">
            <h2 className="text-2xl text-green-400 font-semibold mb-3">{successMessage}</h2>
            <Button variant="white" className="mt-5 mb-10 px-2">
              <Link href="/dashboard/projects">Go to AI Apps Listing</Link>
            </Button>
          </div>
        ) : (
          <div className="w-full border-t-2 border-t-muted-foreground pt-11 md:pt-8">
            {step === 1 && (
              <Step1ModelSelection
                formData={formData}
                setFormData={setFormData}
                APPLICATION_TYPES={["text", "image", "audio", "video"]}
                models={models}
                onValidationChange={handleValidationChange}
              />
            )}
            {step === 2 && (
              <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-0">
                <div className="md:w-[50%] ">
                  <Step2PromptInputs
                    formData={formData}
                    setFormData={setFormData}
                    selectedModel={selectedModel}
                    onValidationChange={handleValidationChange}
                  />
                </div>
                <div className="md:w-[50%] ">
                  <LivePreview
                    setFormData={setFormData}
                    selectedModel={selectedModel}
                    formData={formData}
                    currentStep={2}
                  />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-0">
                <div className="md:w-1/2 xl:w-2/5">
                  <Step3RappDetails
                    formData={formData}
                    setFormData={setFormData}
                    onValidationChange={handleValidationChange}
                  />
                  <Step4RappDetails
                    formData={formData}
                    setFormData={setFormData}
                    sendInvitationsRef={sendInvitationsRef}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    isSending={isSending}
                    setIsSending={setIsSending}
                    isVisible={false}
                  />
                </div>
                <div className="md:w-1/2 xl:w-3/5">
                  <LivePreview
                    selectedModel={selectedModel}
                    setFormData={setFormData}
                    formData={formData}
                    currentStep={3}
                  />
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-0">
                <div className="md:w-full w-full">
                  <Step4RappDetails
                    formData={formData}
                    setFormData={setFormData}
                    sendInvitationsRef={sendInvitationsRef}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    isSending={isSending}
                    setIsSending={setIsSending}
                    isVisible={true}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex  justify-between top-20 absolute md:top-6 md:right-4 gap-4 items-end w-full">
          {step > 1 && !successMessage && (
            <Button variant="white" onClick={prevStep} className="md:ml-8">
              <ChevronLeft className="-ml-2" strokeWidth="3" />
              Previous
            </Button>
          )}
          {!successMessage && step < maxSteps ? (
            <Button
              variant="white"
              className="ml-auto"
              onClick={nextStep}
              // disabled={!isStepValid[`step${step}`]}
            >
              Save & Continue
              <ChevronRight className="-mr-2" strokeWidth="3" />
            </Button>
          ) : (
            !successMessage &&
            ((step === 3 && user?.role !== "entAdmin") || // Non-enterprise users submit on step 3
              (step === 4 && user?.role === "entAdmin")) && // Enterprise users submit on step 4
            (
              <button
                onClick={handleSubmit}
                disabled={isSending}
                className="px-3 md:px-4 py-1 md:py-2 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                {isSending ? "Submitting..." : "Submit"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Privaterapp;