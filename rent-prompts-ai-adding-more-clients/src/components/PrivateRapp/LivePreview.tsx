import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import VariableForm from "./RenderPreviewForm";
import { Download, DownloadIcon, Trash } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Icons } from "../ui/Icons";
import ReactMarkdown from "react-markdown";
import { handleDownloadPDF } from "@/utilities/pdfDownload";
import { handleExportToWord } from "@/utilities/wordDownload";
import { handleDownloadExcel } from "@/utilities/excelDownload";
import { Model } from "@/payload-types";
import ImageOutputRenderer from "./ImageOutputRenderer";
import ImageSlider from "./ImageSlider";

interface LivePreviewProps {
  formData: {
    imageString?: [];
    type: string;
    name: string;
    description: string;
    price: number;
    imageinput: boolean;
    totalCost: number;
    status: string;
    prompt: string;
    negativeprompt: string;
    settings: {
      name: string;
    };
    systemprompt: string;
    model: string;
    modelName: string;
    promptVariables: Variable[];
    systemVariables: Variable[];
    negativeVariables: Variable[];
    key: string;
    image?: string;
    rappCreateType?: string;
  };
  selectedModel: any;
  currentStep: number;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}
interface Variable {
  name: string;
  identifier: string;
  displayName: string;
  description?: string;
  placeholder?: string;
  type: "string" | "number" | "boolean" | "select";
  options?: string[];
  allowMultiple?: boolean;
  value: any;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  formData,
  currentStep,
  setFormData,
  selectedModel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableVariable, setEditableVariable] = useState<any | null>(null);
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<{
    [key: string]: { [key: string]: string[] }; // [variableType]: { [variableId]: selectedOptions[] }
  }>({
    systemVariables: {},
    promptVariables: {},
    negativeVariables: {},
  });
  const [output, setOutput] = useState<any>("");
  const [videoOutput, setVideoOutput] = useState("");
  const [audioKey, setAudioKey] = useState(0);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [copyText, setCopyText] = useState("Copy");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setFormData((prevData) => ({
          ...prevData,
          image: base64Image,
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleValueChange = (variable: Variable, newValue: any) => {
    const updatedFormData = { ...formData };
    const updateVariableValue = (variables: Variable[]) =>
      variables.map((v) =>
        v.identifier === variable.identifier
          ? { ...v, value: newValue } // Update value for the matching variable
          : v
      );

    if (formData.promptVariables) {
      updatedFormData.promptVariables = updateVariableValue(
        formData.promptVariables
      );
    }
    if (formData.systemVariables) {
      updatedFormData.systemVariables = updateVariableValue(
        formData.systemVariables
      );
    }
    if (formData.negativeVariables) {
      updatedFormData.negativeVariables = updateVariableValue(
        formData.negativeVariables
      );
    }
    setFormData(updatedFormData);
  };

  const handleSelectOption = (variable: Variable, option: string) => {
    const updatedFormData = { ...formData };

    const updateVariableValue = (variables: Variable[]) =>
      variables.map((v) =>
        v.identifier === variable.identifier
          ? {
            ...v,
            value: variable.allowMultiple
              ? v.value?.includes(option)
                ? v.value.filter((item: string) => item !== option) // Remove if already selected
                : [...(v.value || []), option] // Add if not selected
              : [option], // Single select: Replace with the new option
          }
          : v
      );

    if (formData.promptVariables) {
      updatedFormData.promptVariables = updateVariableValue(
        formData.promptVariables
      );
    }
    if (formData.systemVariables) {
      updatedFormData.systemVariables = updateVariableValue(
        formData.systemVariables
      );
    }
    if (formData.negativeVariables) {
      updatedFormData.negativeVariables = updateVariableValue(
        formData.negativeVariables
      );
    }

    setFormData(updatedFormData);

    const updatedSelectedOptions = { ...selectedOptions };

    if (!updatedSelectedOptions[variable.type]) {
      updatedSelectedOptions[variable.type] = {};
    }

    if (!updatedSelectedOptions[variable.type][variable.identifier]) {
      updatedSelectedOptions[variable.type][variable.identifier] = [];
    }

    if (variable.allowMultiple) {
      if (
        updatedSelectedOptions[variable.type][variable.identifier]?.includes(
          option
        )
      ) {
        updatedSelectedOptions[variable.type][
          variable.identifier
        ] = updatedSelectedOptions[variable.type][variable.identifier].filter(
          (selectedOption) => selectedOption !== option
        );
      } else {
        updatedSelectedOptions[variable.type][variable.identifier] = [
          ...updatedSelectedOptions[variable.type][variable.identifier],
          option,
        ];
      }
    } else {
      updatedSelectedOptions[variable.type][variable.identifier] = [option];
    }

    setSelectedOptions(updatedSelectedOptions);
  };

  const handleSubmit = async () => {
    setLoading(true);
    toast.loading("Running...")

    const promptValues = formData.promptVariables.reduce((acc, variable) => {
      acc[variable.name] = variable.value;
      return acc;
    }, {});

    const systemValues = formData.systemVariables.reduce((acc, variable) => {
      acc[variable.name] = variable.value;
      return acc;
    }, {});

    const negativeValues = formData.negativeVariables.reduce((acc, variable) => {
      acc[variable.name] = variable.value;
      return acc;
    }, {});

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/run/live`,
        {
          method: "POST",
          body: JSON.stringify({
            promptRaw: formData.prompt,
            systemPromptRaw: formData.systemprompt,
            negetivePromptRaw: formData.negativeprompt,
            promptValues: promptValues,
            systemValues: systemValues,
            negativeValues: negativeValues,
            settingsRaw: formData.settings,
            modelId: formData.model,
            keyRaw: formData.key,
            image: formData.image,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await response.json();


      if (response.ok) {
        const purchaseRapp = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/purchase`,
          {
            method: "POST",
            body: JSON.stringify({
              modelId: formData.model,
            }),
          }
        );

        const result = await purchaseRapp.json();

        if (purchaseRapp.ok) {
          toast.dismiss();
          setData(res?.data?.result || res?.data);
          setOutput(res?.data?.result || res?.data);
          setVideoOutput(res?.data?.video?.url);
          const newAudioFile = res?.data?.audio_file?.url;
          setAudioFile(newAudioFile);
          setAudioKey((prevKey) => prevKey + 1); // Increment the key to force a re-render
          toast.success("Rapp run successfully");
        } else {
          toast.dismiss();
          toast.error(result.error);
          setData("Oops, something went wrong.😟");
        }
      } else {
        toast.dismiss();
        toast.error(res.error);
        setData("Oops, something went wrong.😟");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error submitting form:", error);
      setData("Oops, something went wrong.😟");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  const openEditModal = (variable: any) => {
    setEditableVariable(variable);
    setIsEditing(true);
  };

  const validateVariable = (variable: any) => {
    if (!variable.displayName.trim()) return "Display Name is required.";
    if (!variable.type) return "Data Type is required.";
    if (!variable.description.trim()) return "Description is required.";
    if (
      variable.type !== "boolean" &&
      variable.type !== "select" &&
      !variable.placeholder.trim()
    )
      return "Placeholder is required.";
    if (variable.type === "select") {
      if (!variable.options || !Array.isArray(variable.options)) {
        return "Options must be an array.";
      }
      if (variable.options.length === 0) {
        return "Options cannot be empty.";
      }
      if (variable.options.some((option) => !option.trim())) {
        return "Options cannot contain empty values.";
      }
      // Convert options to lowercase and check for duplicates
      const uniqueOptions = new Set(
        variable.options.map((opt) => opt.trim().toLowerCase())
      );
      if (uniqueOptions.size !== variable.options.length) {
        return "Options cannot be similar.";
      }
    }
    return null;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateVariable(editableVariable);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Update formData with the edited variable
    setFormData((prevFormData) => {
      const updatedPromptVariables = prevFormData.promptVariables.map(
        (variable) =>
          variable.identifier === editableVariable.identifier
            ? editableVariable
            : variable
      );
      const updatedSystemVariables = prevFormData.systemVariables.map(
        (variable) =>
          variable.identifier === editableVariable.identifier
            ? editableVariable
            : variable
      );
      const updatedNegativeVariables = prevFormData.negativeVariables.map(
        (variable) =>
          variable.identifier === editableVariable.identifier
            ? editableVariable
            : variable
      );

      return {
        ...prevFormData,
        promptVariables: updatedPromptVariables,
        systemVariables: updatedSystemVariables,
        negativeVariables: updatedNegativeVariables,
      };
    });

    setError("");
    setIsEditing(false);
  };
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditableVariable((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOptions = [...editableVariable.options];
    newOptions[index] = e.target.value;
    setEditableVariable((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const addOption = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Prevent the popup from closing when adding an option
    setEditableVariable((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent the popup from closing when removing an option
    const newOptions = [...editableVariable.options];
    newOptions.splice(index, 1);
    setEditableVariable((prev) => ({
      ...prev,
      options: newOptions,
    }));
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

  const renderPreviewContent = () => {
    switch (currentStep) {
      case 2:
        return (
          <div className="space-y-4">
            <VariableForm
              onValueChange={handleValueChange}
              onSelectChange={handleSelectOption}
              openEditModal={openEditModal}
              handleImageUpload={handleImageUpload}
              formData={formData}
              selectedOptions={selectedOptions}
              selectedModel={selectedModel}
            />

            <div className="text-center">
              {loading ? (
                <div className="flex justify-between items-center gap-2">
                  <Button
                    variant="blue"
                    className=" px-3 md:px-6 text-sm md:text-base"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Running...
                  </Button>
                  <p className="text-yellow-300 text-sm flex">
                    {formData.totalCost} <Image src="/coin-png.png" alt="coin" width={14} height={12} />/cycle
                  </p>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-2">
                  <Button
                    variant="green"
                    className=" px-3 md:px-6 text-sm md:text-base"
                    onClick={handleSubmit}
                  >
                    Run
                  </Button>
                  <p className="text-yellow-300 text-sm flex">
                    {formData.totalCost} <Image src="/coin-png.png" alt="coin" width={14} height={12} />/cycle
                  </p>


                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-md bg-indigo-800 md:min-h-[25rem] pb-10 relative">
                {data ? (
                  <>
                    <div className="sticky top-0 flex flex-col z-10 px-3 rounded-t-md">
                      <div className="flex flex-row justify-between items-center py-2">
                        <h2 className="text-white py-1 md:py-2 px-3 bg-indigo-700 rounded-lg shadow-md">
                          Output Section:
                        </h2>
                        <div className="relative">
                          <button
                            className="bg-indigo-700 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-500 transition-colors flex items-center"
                            onClick={() => {
                              if (formData?.type === "text") {
                                setDropdownOpen(!dropdownOpen);
                              } else if (formData?.type === "image") {
                                handleDownload(); // Ensure to call the function properly
                              }
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              className="w-4 md:w-6 h-6"
                            >
                              <path
                                d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42L11 13.59V4a1 1 0 0 1 1-1zm-7 16a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"
                              />
                            </svg>
                          </button>
                          {dropdownOpen && (
                            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
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
                        </div>
                      </div>
                    </div>

                    {/* Video Output Section */}
                    {formData.type === "video" && videoOutput && (
                      <div className="w-full flex justify-center items-center mt-4">
                        <video controls className="w-full max-w-2xl rounded-lg">
                          <source src={videoOutput} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    {/* Audio Output Section */}
                    {audioFile && formData.type === "audio" && (
                      <div className="relative flex flex-col justify-between h-full mt-4 px-3">
                        <div className="relative flex-1">
                          <audio key={audioKey} controls className="w-full">
                            <source src={audioFile} type="audio/mpeg" />
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                      </div>
                    )}

                    {/* Markdown Output Section */}
                    {typeof data === "string" && (
                      <div className="text-white break-words overflow-auto pr-2 whitespace-pre-wrap h-full mt-2 px-4">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                style={{
                                  fontSize: "2rem",
                                  fontWeight: "bold",
                                  margin: "0 0 10px",
                                  lineHeight: "1.4",
                                  color: "#FFFFFF",
                                }}
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                style={{
                                  fontSize: "1.5rem",
                                  fontWeight: "600",
                                  margin: "0 0 1px",
                                  lineHeight: "1.3",
                                  color: "#FFFFFF",
                                }}
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                style={{
                                  fontSize: "1.25rem",
                                  fontWeight: "500",
                                  margin: "0 0 1px",
                                  lineHeight: "1.3",
                                  color: "#FFFFFF",
                                }}
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p
                                style={{
                                  fontSize: "1rem",
                                  fontWeight: "400",
                                  margin: "0 0 1px",
                                  lineHeight: "1.2",
                                  color: "#FFFFFF",
                                }}
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li
                                style={{
                                  fontSize: "1rem",
                                  fontWeight: "400",
                                  margin: "0 0 1px",
                                  lineHeight: "1.2",
                                  color: "#FFFFFF",
                                }}
                                {...props}
                              />
                            ),
                          }}
                        >
                          {data}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Image Output Section */}
                    {typeof data !== "string" && formData.type === "image" && (
                      <div className="h-full w-full">
                        <ImageOutputRenderer imageData={data} />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-300 pt-3 items-center flex break-normal whitespace-normal px-3">
                    No output yet. Fill in the variables and run the model.
                  </p>
                )}
              </div>
            </div>

            {isEditing && editableVariable && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                <div className="bg-indigo-600 mx-4 p-4 rounded-lg w-96">
                  <h2 className="text-xl font-semibold mb-4">Edit Variable</h2>
                  <form onSubmit={onSubmit}>
                    <div className="mb-2 space-y-1">
                      <Label className="block font-semibold ml-1">
                        Display Name:
                      </Label>
                      <Input
                        type="text"
                        name="displayName"
                        value={editableVariable.displayName}
                        className="w-full p-2 border rounded-md"
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-2 space-y-1">
                      <Label className="block font-semibold ml-1">
                        Data Type:
                      </Label>
                      <select
                        name="type"
                        value={editableVariable.type}
                        className="w-full p-2 border bg-indigo-800 rounded-md"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          Select Data Type
                        </option>
                        <option value="string">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Checkbox</option>
                        <option value="select">Select</option>
                      </select>
                    </div>

                    <div className="mb-2 space-y-1">
                      <Label className="block font-semibold ml-1">
                        Description:
                      </Label>
                      <Input
                        type="text"
                        name="description"
                        value={editableVariable.description}
                        className="w-full p-2 border rounded-md"
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Conditionally render based on type */}
                    {editableVariable.type !== "boolean" &&
                      editableVariable.type !== "select" && (
                        <div className="mb-2 space-y-1">
                          <Label className="block font-semibold ml-1">
                            Placeholder:
                          </Label>
                          <Input
                            type="text"
                            name="placeholder"
                            value={editableVariable.placeholder}
                            className="w-full p-2 border rounded-lg"
                            onChange={handleInputChange}
                            required={
                              editableVariable.type !== "boolean" &&
                              editableVariable.type !== "select"
                            }
                          />
                        </div>
                      )}

                    {editableVariable.type === "select" && (
                      <div className="mb-3 space-y-1">
                        <Label className="block font-semibold ml-1">
                          Options:
                        </Label>
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            {editableVariable.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <Input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleOptionChange(e, index)}
                                  className="w-full p-2 border rounded-md"
                                />
                                <Button
                                  variant="red"
                                  onClick={(e) => removeOption(index, e)}
                                  className="text-md px-2 py-2"
                                >
                                  <Trash className="w-5 h-5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="blue"
                            onClick={addOption}
                            className="py-2 h-fit "
                          >
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}

                    {editableVariable.type === "select" && (
                      <div className="mb-4 flex items-center gap-1">
                        <Checkbox
                          className="h-6 w-6"
                          checked={editableVariable.allowMultiple}
                          onCheckedChange={(checked) =>
                            setEditableVariable((prev) => ({
                              ...prev,
                              allowMultiple: checked,
                            }))
                          }
                        />
                        <Label className="block font-semibold text-md ml-1">
                          Allow Multiple Select
                        </Label>
                      </div>
                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="w-full ">
            <h2 className="font-semibold text-xl mb-4">Live Preview:</h2>

            <div className="flex-1 rounded-lg">
            <div className="relative h-60 overflow-hidden rounded-lg">
        <ImageSlider formData={formData} />
      </div>

              <div className="space-y-2 sm:space-y-4">
                <div className="space-y-2">
                  <p className="text-white text-2xl sm:text-4xl font-bold whitespace-normal break-words">
                    {formData.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300 whitespace-normal break-words">
                    {formData.description}
                  </p>
                </div>

                <div className="flex felx-row gap-2 sm:gap-4 items-center">
                  <div className={`space-y-2 ${isEditing ? "w-1/3" : ""}`}>
                    <div className="flex gap-2 items-center">
                      <p className="text-whiten w-fit bg-indigo-600 py-1 px-2 rounded-lg text-xs font-semibold">
                        <span>{formData?.modelName?.toUpperCase()}</span>
                      </p>
                      <p className="text-whiten w-fit bg-indigo-600 py-1 px-2 rounded-lg text-xs font-semibold">
                        <span>{formData?.type?.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                  <div className={`space-y-2 ${isEditing ? "w-2/3" : ""}`}>
                    <div className="text-whiten w-fit bg-indigo-600 py-1 px-2 rounded-lg text-xs font-semibold flex items-center">
                      <p className="font-bold">{formData.totalCost}</p>
                      <Image src="/coin-png.png" width={15} height={15} alt="coin image" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div
                    className={`text-xs sm:text-sm font-medium w-fit flex justify-start px-1 py-1 sm:px-2 sm:py-2 rounded-lg text-right sm:text-center ${formData.status === "approved"
                      ? "bg-white/[0.1] text-success"
                      : formData.status === "pending"
                        ? "bg-white/[0.1] text-warning"
                        : "bg-white/[0.1] text-danger"
                      }`}
                  >
                    {formData.status === "approved" && (
                      <p className="flex flex-row gap-1 items-center">
                        <Icons.approved /> <span>Approved</span>
                      </p>
                    )}
                    {formData.status === "pending" && (
                      <p className="flex flex-row gap-1 items-center">
                        <Icons.pending /> <span>Pending</span>
                      </p>
                    )}
                    {formData.status === "denied" && (
                      <p className="flex flex-row gap-1 items-center">
                        <Icons.denied /> <span>Denied</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4 md:px-8 md:py-4 border-2 border-muted-foreground rounded-lg bg-indigo-700 text-white">
      {renderPreviewContent()}
    </div>
  );
};

const renderImageOutput = (imageData: string | string[]) => {
  if (typeof imageData === "string") {
    // Single image case
    return (
      <div className="w-full flex justify-center items-center">
        {/* Use an img tag for external images that might fail Next.js domain verification */}
        <img
          src={imageData || "/DummyRapps.png"}
          alt="Generated"
          className="max-w-full max-h-[600px] object-contain mt-2 border border-gray-300 rounded-md"
        />
      </div>
    );
  } else if (Array.isArray(imageData)) {
    // Multiple images case
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {imageData.map((imgUrl, index) => (
          <div key={index} className="relative flex flex-col items-center">
            {/* Use an img tag for external images */}
            <img
              src={imgUrl || "/DummyRapps.png"}
              alt={`Generated ${index + 1}`}
              className="max-w-full max-h-[400px] object-contain border border-gray-300 rounded-md"
            />

          </div>
        ))}
      </div>
    );
  }
  return null;
};
export default LivePreview;
