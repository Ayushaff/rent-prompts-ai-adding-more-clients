"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { ClipLoader } from "react-spinners";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/providers/User";
import { handleDownloadPDF } from "@/utilities/pdfDownload";
import { handleExportToWord } from "@/utilities/wordDownload";
import { handleDownloadExcel } from "@/utilities/excelDownload";
import { useSearchParams } from "next/navigation";
import ImageOutputRenderer from "@/components/PrivateRapp/ImageOutputRenderer";

interface RappData {
  id: string;
  promptVariables: any[];
  systemVariables: any[];
  negativeVariables: any[];
  modelId: string;
  modelType: string;
}

const RunRapp = () => {
  const [rappData, setRappData] = useState<RappData>();
  const [promptInputs, setPromptInputs] = useState({});
  const [negativeInputs, setNegativeInputs] = useState({});
  const [systemInputs, setSystemInputs] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const [copyText, setCopyText] = useState("Copy");
  const [dropdownOpen, setDropdownOpen] = useState(false);
   const [audioKey, setAudioKey] = useState(0);
      const [audioFile, setAudioFile] = useState<string | null>(null);
      const [videoOutput, setVideoOutput] = useState("");
  const user = useUser();
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams?.get("id"); 
  const type= searchParams?.get("type");

  useEffect(() => {
    if (!user) {
      return router.push("/auth/signIn");
      }

    const getRappInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/${id}?type=${type}`
        );
        const data = await response.json();
        setRappData(data.rappData);
      } catch (err) {
        console.error("Error fetching rapp info:", err);
      } finally {
        setLoading(false);
      }
    };

    getRappInfo();
  }, [user]);


  const handleInputChange = (e, type, name) => {
    const value = e.target.value;

    if (type === "prompt") {
      setPromptInputs((prev) => ({ ...prev, [name]: value }));
    } else if (type === "negative") {
      setNegativeInputs((prev) => ({ ...prev, [name]: value }));
    } else if (type === "system") {
      setSystemInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const promptValues = Object.keys(promptInputs).reduce((acc, key) => {
        acc[key] = promptInputs[key];
        return acc;
      }, {});

      const systemValues = Object.keys(systemInputs).reduce((acc, key) => {
        acc[key] = systemInputs[key];
        return acc;
      }, {});

      const negativeValues = Object.keys(negativeInputs).reduce((acc, key) => {
        acc[key] = negativeInputs[key];
        return acc;
      }, {});

      setRunning(true);
      toast.loading("Running...");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/run/${rappData?.id}?type=${type}`,
        {
          method: "POST",
          body: JSON.stringify({
            promptValues: promptValues,
            systemValues: systemValues,
            negativeValues: negativeValues,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if(response.ok){
        const purchaseRapp = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/purchase`,
          {
            method: "POST",
            body: JSON.stringify({
              modelId: rappData?.modelId,
              rappId: rappData?.id,
              type: type,
            }),
          }
        );

        const result = await purchaseRapp.json();

        if (purchaseRapp.ok) {
          setOutput(data?.data?.result || data?.data);
          setVideoOutput(data?.data?.video?.url);
          const newAudioFile = data?.data?.audio_file?.url;
          setAudioFile(newAudioFile);
          setAudioKey((prevKey) => prevKey + 1);
          toast.success("Rapp run successfully");
        } else {
          console.error("Error:", result.error);
          toast.error(result.error)
          setOutput("Oops, something went wrong.😟");
        }
      } else {
        console.error("Error:", data.error);
        toast.error(data.error)
        setOutput("Oops, something went wrong.😟");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setOutput("Oops, something went wrong.😟");
    } finally {
      setRunning(false);
      toast.dismiss();
    }
  };

  const handleCopy = () => {
    if (typeof output === "string") {
      navigator.clipboard.writeText(output);
      setCopyText("Copied");
      toast.success("Text copied successfully");
      setDropdownOpen(!dropdownOpen);

      setTimeout(() => {
        setCopyText("Copy");
      }, 2000);
    }
  };

  const handleFileDownload = (fileType) => {
    const onSuccess = () => {
        toast.success(`${fileType.toUpperCase()} exported successfully`);
        if (setDropdownOpen) setDropdownOpen(false);
    };

    switch (fileType) {
        case "pdf":
            handleDownloadPDF(output, onSuccess);
            break;
        case "word":
          handleExportToWord(output, onSuccess);
            break;
        case "excel":
          handleDownloadExcel(output, onSuccess);
            break;
        default:
            console.error("Unsupported file type.");
    }
};
const handleDownload = async () => {
  if (output) {
    try {
      // Ensure `output` is always an array for uniform handling
      const urls = Array.isArray(output) ? output : [output];

      for (const [index, url] of urls.entries()) {
        // Fetch the file as a blob
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch the file from URL: ${url}`);
        }
        const blob = await response.blob();

        // Create a download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;

        // If multiple files, add an index to the filename
        const fileName = `output${urls.length > 1 ? `-${index + 1}` : ""}.png`;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error("Download failed: ", error);
    }
  }
};


  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 sm:mt-0 sm:p-4 flex flex-col gap-4 sm:bg-indigo-800 sm:shadow-2xl">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 w-full mx-auto ">
            {/* Left side: Input panel */}
            <div className="relative w-full md:w-2/6 bg-gradient-to-br from-black/[0.1] to-black/[0.3] shadow-xl rounded-xl pb-16 md:pb-20 p-3 md:p-8 text-white h-fit">
              {rappData ? (
                <div>
                  {/* System Variables */}
                  {rappData?.systemVariables?.length > 0 && (
                    <>
                      <h2 className="font-bold text-2xl mb-3 text-purple-300 tracking-wide">
                        System Variables
                      </h2>
                      {rappData?.systemVariables.map((variable, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex gap-1 items-center">
                            <Label className="block font-semibold text-lg mb-1">
                              {variable.displayName}
                            </Label>
                            <div className="relative">
                              <div className="group -mt-3">
                                <Info className="w-3 h-3 text-yellow-400 cursor-pointer z-20" />
                                <div className="absolute z-40 left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-60 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  <p className="italic text-sm text-yellow-400/[0.6] break-normal whitespace-normal">
                                    {variable.description ||
                                      "Click on the edit icon to edit the variable and description."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Textarea
                            rows={1}
                            className="min-h-10"
                            placeholder={variable.placeholder}
                            value={systemInputs[variable.name] || ""}
                            onChange={(e) =>
                              handleInputChange(e, "system", variable.name)
                            }
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {rappData?.promptVariables?.length > 0 && (
                    <>
                      <h2 className="font-bold text-2xl mb-3 text-white tracking-wide mt-5">
                        User Variables
                      </h2>
                      {rappData?.promptVariables?.map((variable, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex gap-1 items-center">
                            <Label className="block font-semibold text-lg mb-1">
                              {variable.displayName}
                            </Label>
                            <div className="relative">
                              <div className="group -mt-3">
                                <Info className="w-3 h-3 text-yellow-400 cursor-pointer z-20" />
                                <div className="absolute z-40 left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-60 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  <p className="italic text-sm text-yellow-400/[0.6] break-normal whitespace-normal">
                                    {variable.description ||
                                      "Click on the edit icon to edit the variable and description."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Textarea
                          rows={1}
                          className="min-h-10"
                            placeholder={variable.placeholder}
                            value={promptInputs[variable.name] || ""}
                            onChange={(e) =>
                              handleInputChange(e, "prompt", variable.name)
                            }
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {/* Negative Variables */}
                  {rappData?.negativeVariables?.length > 0 && (
                    <>
                      <h2 className="font-bold text-2xl mb-3 text-red-300 tracking-wide mt-5">
                        Negative Variables
                      </h2>
                      {rappData?.negativeVariables.map((variable, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex gap-1 items-center">
                            <Label className="block font-semibold text-lg mb-1">
                              {variable.displayName}
                            </Label>
                            <div className="relative">
                              <div className="group -mt-3">
                                <Info className="w-3 h-3 text-yellow-400 cursor-pointer z-20" />
                                <div className="absolute z-40 left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-60 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  <p className="italic text-sm text-yellow-400/[0.6] break-normal whitespace-normal">
                                    {variable.description ||
                                      "Click on the edit icon to edit the variable and description."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Textarea
                            rows={1}
                            placeholder={variable.placeholder}
                            value={negativeInputs[variable.name] || ""}
                            onChange={(e) =>
                              handleInputChange(e, "negative", variable.name)
                            }
                          />
                        </div>
                      ))}
                    </>
                  )}

                  <button
                    className="bg-yellow-500 absolute bottom-3 md:bottom-7 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 mt-6"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? <span>Running...</span> : <span>Run Model</span>}
                  </button>
                </div>
              ) : (
                <p className="text-gray-300">Loading...</p>
              )}
            </div>         

            {/* Right side: Output panel */}
            <div className="w-full md:w-4/6 min-h-[80vh] sm:max-h-[85vh]">
              <div className="border border-gray-400  h-full sha p-3 bg-white relative  rounded-lg shadow-inner shadow-black flex flex-col items-center justify-center">
                {running ? (
                  <span className="text-gray-500 flex flex-col gap-2 justify-center items-center">
                    <ClipLoader
                      color="text-gray-500"
                      loading={running}
                      size={50}
                    />
                    Generating output...
                  </span>
                ) : (
                  <>
                  {output ? (
                    <>
                      <div className="sticky right-0 top-0 flex flex-col mb-2 w-full">
                        <div className="flex  justify-between  w-full">
                          <div className="bg-indigo-800 text-white py-2 md:py-2 px-3 rounded-lg shadow-md flex items-center">
                            Output Section:
                          </div>
                          <button
                            className="bg-indigo-800 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-500 transition-colors flex items-center"
                            onClick={() => {
                              if (rappData?.modelType === "text") {
                                setDropdownOpen(!dropdownOpen);
                              } else if (rappData?.modelType === "image") {
                                handleDownload(); // Ensure to call the function properly
                              }
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              className="w-6 h-6"
                            >
                              <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42L11 13.59V4a1 1 0 0 1 1-1zm-7 16a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z" />
                            </svg>
                          </button>
                          {dropdownOpen && rappData?.modelType === "text" && (
                            <div className="absolute right-0 top-8 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={handleCopy}
                              >
                                {copyText}
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleFileDownload("pdf")}
                              >
                                Export to PDF
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleFileDownload("word")}
                              >
                                Export to Word
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleFileDownload("excel")}
                              >
                                Export to Excel
                              </button>
                            </div>
                          )}
                          {
                            dropdownOpen && rappData?.modelType === 'image' && (
                              <button onClick={handleDownload}></button>
                            )
                          }
                        </div>
                      </div>
                
                      {/* Video Output Section */}
                      {rappData?.modelType === "video" && videoOutput && (
                        <div className="w-full flex justify-center items-center mt-4">
                          <video controls className="w-full max-w-2xl rounded-lg">
                            <source src={videoOutput} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                
                      {/* Audio Output Section */}
                      {audioFile && rappData?.modelType === "audio" && (
                        <div className="relative w-full flex flex-col justify-between h-full mt-4 px-3">
                          <div className="relative flex-1">
                            <audio key={audioKey} controls className="w-full">
                              <source src={audioFile} type="audio/mpeg" />
                              Your browser does not support the audio tag.
                            </audio>
                          </div>
                        </div>
                      )}
                
                      {/* Text Output Section */}
                      {typeof output === "string" && (
                        <div className="relative w-full flex flex-col overflow-hidden">
                          <p className="text-gray-900 break-words whitespace-normal sm:overflow-y-auto sm:h-[80vh] sm:max-h-[80vh] sm:no-scrollbar">
                            <ReactMarkdown className="prose">{output}</ReactMarkdown>
                          </p>
                        </div>
                      )}
                      { rappData?.modelType === "image" && (
                        <div className="h-full w-full overflow-hidden">
                          <ImageOutputRenderer imageData={output} />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 min-h-96 items-center flex break-normal whitespace-normal">
                      No output yet. Fill in the variables and run the model.
                    </p>
                  )}
                </>
                
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunRapp;
