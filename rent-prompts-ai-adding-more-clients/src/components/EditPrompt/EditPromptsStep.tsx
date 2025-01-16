import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface Step2PromptInputsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  selectedModel: any;
}

const EditPromptsStep: React.FC<Step2PromptInputsProps> = ({
  formData,
  setFormData,
  selectedModel,
}) => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize default values for prompts if they don't exist
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      systemprompt: prev?.systemprompt || "",
      userprompt: prev?.userprompt || "",
      negativeprompt: prev?.negativeprompt || "",
    }));
  }, [setFormData]);

  const toggleAccordion = () => setSettingsOpen(!isSettingsOpen);

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      imageinput: checked,
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let settingValue: any;

    if (type === "checkbox") {
      settingValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      settingValue = Number(value);
    } else {
      settingValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: settingValue,
      },
    }));
  };

  const handleStatusChange = (value) => {
    const status = value.toLowerCase(); // Ensure value is saved in lowercase
    setFormData((prev) => ({
      ...prev,
      status,
    }));
    setIsOpen(false);
  };

  const handlePromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    type: string
  ) => {
    const inputText = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [type]: inputText,
    }));

    // Extract variables from the current prompt
    const variablePattern = /\$\$([a-zA-Z_]\w*)/g;
    const matches = new Set(inputText.match(variablePattern) || [])

    setFormData((prev) => {
      const existingVariables =
        type === 'systemprompt'
          ? prev.systemVariables || []
          : type === 'negaiveprompt'
          ? prev.negativeVariables || []
            : prev.promptVariables || []

      // Filter out variables no longer in the prompt
      const retainedVariables = existingVariables.filter((variable) => matches.has(variable.name))

      // Identify new variables not yet in retainedVariables
      const newVariables = Array.from(matches)
        .filter(
          (variable) => !retainedVariables.some((existingVar) => existingVar.name === variable),
        )
        .map((variable) => ({
          identifier: `${type}-${Date.now()}-${Math.random()}`, // Unique identifier
          name: variable,
          displayName: variable,
          description: `Description for ${variable}`,
          placeholder: `Enter ${variable}`,
          type: 'string', // Default type
          allowMultiple: false,
          options: ["option1", "option2"],
          value: '',
        }))

      // Combine retained and new variables
      const updatedVariables = [...retainedVariables, ...newVariables]

      return {
        ...prev,
        systemVariables: type === 'systemprompt' ? updatedVariables : prev.systemVariables,
        promptVariables: type === 'userprompt' ? updatedVariables : prev.promptVariables,
        negativeVariables: type === 'negativeprompt' ? updatedVariables : prev.negativeVariables,
      }
    })
  }

  const renderSettingInput = (setting: any) => {
    const { name, description, type, options, allowMultiple } = setting;

    switch (type) {
      case "integer":
        return (
          <div className="mb-4 w-full" key={name}>
            <div className="flex gap-1 items-center">
              <Label className="text-lg">{name}</Label>
              {description && (
                <div className="relative">
                  <div className="group -mt-3">
                    <Info className="w-3 h-3 text-yellow-400 cursor-pointer z-20" />
                    <div className="absolute z-40 left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-60 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="italic text-sm text-yellow-400/[0.6] break-words whitespace-normal">
                        {description || "Click on an option to select it."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Input
              type="number"
              name={name}
              value={formData.settings[name] || ""}
              onChange={handleSettingChange}
            />
          </div>
        );
      case "boolean":
        return (
          <div className="mb-4 flex items-center gap-2" key={name}>
            <Checkbox
              className="h-6 w-6"
              checked={formData.settings[name] || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    [name]: checked,
                  },
                }))
              }
            />
            <div className="flex gap-1 items-center">
              <Label className="text-lg">{name}</Label>
              {description && (
                <div className="relative">
                  <div className="group -mt-3">
                    <Info className="w-3 h-3 text-yellow-400 cursor-pointer z-20" />
                    <div className="absolute z-40 left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-60 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="italic text-sm text-yellow-400/[0.6] break-words whitespace-normal">
                        {description || "Click on an option to select it."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
        case 'select':
        return (
          <div className="mb-4 w-full" key={name}>
            <div className="flex gap-1 items-center">
              <Label className="text-lg">{name}</Label>
              {description && (
                <div className="relative">
                  <div className="group -mt-3">
                    <Info className="w-3 h-3 text-yellow-400 cursor-pointer z-20" />
                    <div className="absolute z-40 left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-60 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="italic text-sm text-yellow-400/[0.6] break-words whitespace-normal">
                          {description || 'Click on an option to select it.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {options?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => {
                    const selected = formData.settings[name] || [];
                    const isSelected = selected.includes(option);
                    const updatedSelection = isSelected
                      ? selected.filter((item) => item !== option)
                      : [...selected, option];

                    setFormData((prev) => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        [name]: allowMultiple ? updatedSelection : [option],
                      },
                    }));
                  }}
                  className={`cursor-pointer border rounded-lg px-3 py-2 bg-gradient-to-br from-black/[0.3] via-black/[0.1] to-black/[0.4] break-normal whitespace-normal break-all ${
                    formData.settings[name]?.includes(option)
                        ? 'bg-indigo-900 border-muted-foreground border-opacity-40 text-white'
                        : 'bg-indigo-700'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        );

      case "string":
      default:
        return (
          <div className="mb-4 w-full" key={name}>
            <div className="flex gap-1 items-center">
              <Label className="text-lg">{name}</Label>
              {description && (
                <div className="relative">
                  <div className="group -mt-3">
                    <Info className="w-3 h-3 text-yellow-400 cursor-pointer z-20" />
                    <div className="absolute z-40 left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-60 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="italic text-sm text-yellow-400/[0.6] break-words whitespace-normal">
                        {description || "Click on an option to select it."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Input
              type="text"
              name={name}
              value={formData.settings[name] || ""}
              onChange={handleSettingChange}
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full relative flex flex-row gap-8">
        <div className="w-full flex flex-col rounded-lg justify-between p-4 md:px-8 md:py-7 border-2 border-muted-foreground bg-indigo-700">
          <div className="w-full flex flex-col">
            {/* System Prompt */}
            {
              formData?.systemprompt && (
                <div className="mb-4">
                  <Label className="text-lg font-semibold mb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                       <div>System Prompt:</div>
                       <p className="font-normal text-sm text-gray-300">To insert a variable, type
  <span className="font-semibold text-white px-1 rounded">
   {'$$varName'} 
  </span></p>
                   </Label>
              <Textarea
                name="systemPrompt"
                value={formData?.systemprompt||''}
                onChange={(e) => handlePromptChange(e, "systemprompt")}
                onInput={(e) => {
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = "auto";
                  textarea.style.height = `${textarea.scrollHeight}px`;
                }}
                placeholder="Write your system prompt here..."
                rows={5}
                cols={50}
                style={{ overflow: "hidden", resize: "none" }}
              />
            </div>
              )
            }
            
             

            {/* User Prompt */}
            <div className="mb-4">
              <Label className="text-lg font-semibold mb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between">
               <div>User Prompt:</div>
               <p className="font-normal text-sm text-gray-300">To insert a variable, type
  <span className="font-semibold text-white px-1 rounded">
   {'$$varName'} 
  </span></p>
              </Label>
              <Textarea
                name="userPrompt"
                value={formData?.userprompt||''}
                onChange={(e) => handlePromptChange(e, "userprompt")}
                placeholder="Write your user prompt here..."
                rows={5}
                cols={50}
                onInput={(e) => {
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = "auto";
                  textarea.style.height = `${textarea.scrollHeight}px`;
                }}
                style={{ overflow: "hidden", resize: "none" }}
              />
            </div>

            {/* Negative Prompt */}
            {
              formData?.negativeprompt && (
                <div className="mb-4">
              <Label className="text-lg font-semibold mb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>Negative Prompt:</div>
                <p className="font-normal text-sm text-gray-300">To insert a variable, type
  <span className="font-semibold text-white px-1 rounded">
   {'$$varName'} 
  </span></p>
              </Label>
              <Textarea
                name="negativePrompt"
                value={formData?.negativeprompt||''}
                onChange={(e) => handlePromptChange(e, "negativeprompt")}
                placeholder="Write your negative prompt here..."
                rows={5}
                cols={50}
                onInput={(e) => {
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = "auto";
                  textarea.style.height = `${textarea.scrollHeight}px`;
                }}
                style={{ overflow: "hidden", resize: "none" }}
              />
            </div>
              )
            }
          
            {/* Accept Image as Input */}
            {
              formData?.imageinput && (
                <div className="mb-4 items-center flex gap-2">
              <Checkbox
                checked={formData?.imageinput}
                onCheckedChange={handleCheckboxChange}
                className="w-6 h-6"
              />
                <Label className="text-xl font-semibold">
                  Accept Image as Input
                </Label>
            </div>
              )
            }
            

            {/* Advanced Settings */}
            <div>
              <button
                className="flex justify-between items-center w-full text-lg font-semibold bg-indigo-600 py-3 px-4 rounded-t-lg"
                onClick={toggleAccordion}
              >
                <span>Advanced Settings:</span>
                {isSettingsOpen ? (
                  <ChevronDown className="ml-2" />
                ) : (
                  <ChevronRight className="ml-2" />
                )}
              </button>
              {isSettingsOpen && (
                <div className="bg-indigo-600 text-white p-4 rounded-b-lg pt-1 space-y-4">
                  {formData?.settings ? (
                    <div>
                      {Object.keys(formData.settings).map((key) => {
                        const setting = formData.settings[key]
                        if (typeof setting === 'object' && setting.name) {
                          return (
                            <div
                              key={setting.id}
                              className="p-3 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition-colors duration-300"
                            >
                              {renderSettingInput(setting)}
                            </div>
                          )
                        }
                        return null // Ignore invalid fields
                      })}
                    </div>
                  ) : (
                    <p className="text-white italic">No settings available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPromptsStep
