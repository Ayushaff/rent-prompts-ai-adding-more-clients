import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import EditVariableForm from "./RenderPreviewForm";
import ReactMarkdown from "react-markdown";
import { handleDownloadPDF } from "@/utilities/pdfDownload";
import { handleExportToWord } from "@/utilities/wordDownload";
import { handleDownloadExcel } from "@/utilities/excelDownload";
import { useRouter } from "next/navigation";
import ImageOutputRenderer from "../PrivateRapp/ImageOutputRenderer";

interface LivePreviewProps {
  formData: any
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

const EditLivePreview: React.FC<LivePreviewProps> = ({
  formData,
  currentStep,
  setFormData,
}) => {
  const [inputValues, setInputValues] = useState({
    uploadedImage: null as File | null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableVariable, setEditableVariable] = useState<any | null>(null);
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [videoOutput, setVideoOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
   const [audioKey, setAudioKey] = useState(0);
    const [audioFile, setAudioFile] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = React.useState<{
    [key: string]: { [key: string]: string[] }; // [variableType]: { [variableId]: selectedOptions[] }
  }>({
    systemVariables: {},
    promptVariables: {},
    negativeVariables: {},
  });
  const [output, setOutput] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

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
          ? { ...v, value: newValue } 
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
                : [option],
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
      if (updatedSelectedOptions[variable.type][variable.identifier]?.includes(option)) {
        updatedSelectedOptions[variable.type][variable.identifier] = updatedSelectedOptions[variable.type][variable.identifier].filter(
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

  const rappId = formData?.id
  const promptData = {
    userprompt: formData?.userprompt,
    systemprompt: formData?.systemprompt,
    negativeprompt: formData?.negativeprompt,
    imageinput: formData?.imageinput,
    // model: formData.model,
    promptVariables: formData?.promptVariables,
    systemVariables: formData?.systemVariables,
    negativeVariables: formData?.negativeVariables,
    settings: formData?.settings,
  }

  const handleSave = async () => {
    setSaving(true)

    const validateVariablesList = (variables, type) => {
      for (let i = 0; i < variables.length; i++) {
        const error = validateVariable(variables[i])
        if (error) {
          return `${type} ${error}`
        }
      }
      return null
    }

    const promptError = validateVariablesList(formData.promptVariables, 'Prompt Variable')
    const systemError = validateVariablesList(formData.systemVariables, 'System Variable')
    const negativeError = validateVariablesList(formData.negativeVariables, 'Negative Variable')

    if (promptError || systemError || negativeError) {
      toast.error(
        'Validation Error: Please check the variables for any missing or required fields.',
      )
      setError(
        `Validation Error:\n${promptError || ''}\n${systemError || ''}\n${negativeError || ''}`,
      )
      setSaving(false)
      return
    }

    setError('')

    try {
      //determine which collection to update based on the type of the rApp
      const collection = formData.type === 'private' ? 'privateRapps' : 'rapps'
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${collection}/updatePrompts/${rappId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promptData),
        },
      )

      if (!response.ok) {
        toast.error("Error in updating prompts")
      }

      if (response.status === 200) {
        const result = await response.json()
        toast.success('Prompts saved successfully')
      }
    } catch (err: any) {
      console.error('Error saving prompts:', err)
    } finally {
      setSaving(false)
    }
  }

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
            promptRaw: formData.userprompt,
            systemPromptRaw: formData.systemprompt,
            negetivePromptRaw: formData.negativeprompt,
            promptValues: promptValues,
            systemValues: systemValues,
            negativeValues: negativeValues,
            settingsRaw: formData.settings,
            modelId: formData.modelId,
            keyRaw: formData.key,
            image: formData.image,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await response.json();

      if(response.ok){
        const purchaseRapp = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/purchase`,
          {
            method: "POST",
            body: JSON.stringify({
              modelId: formData.modelId,
              rappId: formData.id,
              type: formData.type,
            }),
          }
        );

        const result = await purchaseRapp.json();

        if (purchaseRapp?.ok) {
          setData(res?.data?.result || res?.data);
          setOutput(res?.data?.result || res?.data);
          setVideoOutput(res?.data?.video?.url);
          const newAudioFile = res?.data?.audio_file?.url;
          setAudioFile(newAudioFile);
          setAudioKey((prevKey) => prevKey + 1); 
          toast.dismiss();
          toast.success("Rapp run successfully");
        } else {
          toast.dismiss();
          toast.error(result?.message);
          setData("Oops, something went wrong.😟");
        }
      } else{
        toast.dismiss();
        toast.error(res?.message);
        setData("Oops, something went wrong.😟");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error submitting form:", error);
      setData("Oops, something went wrong.😟");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const openEditModal = (variable: any) => {
    setEditableVariable(variable);
    setIsEditing(true);
  };

  const validateVariable = (variable: any) => {
    if (!variable?.displayName?.trim()) return 'Display Name is required.'
    if (!variable?.type) return 'Data Type is required.'
    if (!variable?.description?.trim()) return 'Description is required.'
    if (
      variable?.type !== 'boolean' &&
      variable?.type !== 'select' &&
      !variable?.placeholder.trim()
    )
      return 'Placeholder is required.'
    if (variable?.type === 'select') {
      if (!variable?.options || !Array.isArray(variable?.options)) {
        return 'Options must be an array.'
      }
      if (variable?.options?.length === 0) {
        return 'Options cannot be empty.'
      }
      if (variable?.options?.some((option) => !option?.trim())) {
        return 'Options cannot contain empty values.'
      }
      // Convert options to lowercase and check for duplicates
      const uniqueOptions = new Set(variable?.options?.map((opt) => opt?.trim().toLowerCase()))
      if (uniqueOptions.size !== variable?.options?.length) {
        return 'Options cannot be similar.'
      }
    }
    return null
  }

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

  const renderPreviewContent = () => {
    switch (currentStep) {
      case 2:
        return (
          <div className="space-y-4">
            <EditVariableForm
              onValueChange={handleValueChange}
              onSelectChange={handleSelectOption}
              openEditModal={openEditModal}
              handleImageUpload={handleImageUpload}
              formData={formData}
              setFormData={setFormData}
              selectedOptions={selectedOptions}
            />

          <div className="text-center">
              <div className="flex justify-end space-x-2 md:space-x-3">
              {loading ? (
                  <Button
                    variant="blue"
                    className="text-sm md:text-base px-2 md:px-4 py-1 md:py-2 text-white rounded-md transition-all duration-300 ease-in-out shadow-lg"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Running...
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    className="text-sm md:text-base px-2 md:px-4 py-1 md:py-2 text-white rounded-md transition-all duration-300 ease-in-out shadow-lg"
                    onClick={handleSubmit}
                  >
                    Run
                  </Button>
                )}
                {saving ? (
                  <Button
                    variant="blue"
                    className="text-sm md:text-base px-2 md:px-4 py-1 md:py-2 text-white rounded-md  transition-all duration-300 ease-in-out shadow-lg"
                    disabled={saving}
                  >
                    Saving...
                  </Button>
                ) : (
                  <Button
                    variant='green'
                    className="text-sm md:text-base px-2 md:px-4 py-1 md:py-2   text-white rounded-md transition-all duration-300 ease-in-out shadow-lg"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            

            <div className="mt-6 space-y-4">
            <div className="px-4 rounded-md bg-indigo-800 pb-10 relative">
  {data ? (
    <>
      <div className="sticky top-0 flex flex-col bg-indigo-800 z-10">
        <div className="flex flex-row justify-between items-center py-2">
          <h2 className="text-white py-2 px-3 bg-indigo-700 rounded-lg shadow-md">
            Output Section:
          </h2>
          <div className="relative">
            <button
              className="bg-indigo-700 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-500 transition-colors flex items-center"
              onClick={() => {
                if (formData?.modelType === "text") {
                  setDropdownOpen(!dropdownOpen);
                } else if (formData?.modelType === "image") {
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
      {formData?.modelType === "video" && videoOutput && (
        <div className="w-full flex justify-center items-center mt-4">
          <video controls className="w-full max-w-2xl rounded-lg">
            <source src={videoOutput} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Audio Output Section */}
      {audioFile && formData?.modelType === "audio" && (
        <div className="relative w-full flex flex-col justify-between h-full mt-4">
          <div className="relative flex-1">
            <audio key={audioKey} controls className="w-full">
              <source src={audioFile} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      )}

      {/* Markdown or Image Output */}
      {typeof data === "string" && (
        <div className="text-white break-words overflow-auto pr-2 whitespace-pre-wrap h-full mt-2">
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

{ formData?.modelType === "image" && (
                        <div className="h-full w-full overflow-hidden">
                          <ImageOutputRenderer imageData={output} />
                        </div>
                      )}
    </>
  ) : (
    <p className="text-gray-500 min-h-96 pt-4 flex break-normal whitespace-normal">
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
                              <div key={`option-${index}`} className="flex items-center space-x-2">
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

                    {error && (
                      <p className="text-red-500 text-sm whitespace-normal max-w-full">{error}</p>
                    )}

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

export default EditLivePreview;
