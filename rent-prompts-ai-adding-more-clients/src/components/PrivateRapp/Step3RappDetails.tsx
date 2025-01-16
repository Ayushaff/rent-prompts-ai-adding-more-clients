import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface Step3RappDetailsProps {
  formData: {
    name: string;
    description: string;
    images?: [];
    imageString?: [];
    needsApproval?: boolean;
    rappCreateType?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onValidationChange: (isValid: boolean) => void;
}

const Step3RappDetails: React.FC<Step3RappDetailsProps> = ({
  formData,
  setFormData,
  onValidationChange,
}) => {
  // const [images, setImages] = useState(formData.images || [] as any);
  const [errors, setErrors] = useState<{ images?: string }>({});

  // Validate form fields whenever name or description changes
  useEffect(() => {
    const isValid = formData.name && formData.description;
    // onValidationChange(isValid);
  }, [formData.name, formData.description, onValidationChange]);

  // Clean up object URLs when the component unmounts
  // useEffect(() => {
  //   return () => {
  //     images.forEach((image) => URL.revokeObjectURL(image));
  //   };
  // }, [images]);

  // Handle input changes for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    formData.images = [];
    formData.imageString = []
    const files = e.target.files;
  
    if (!files || files.length === 0) {
      setErrors({ images: "No files selected." });
      return;
    }
  
    const validFiles = Array.from(files);
  
    try {
      // Convert all files to base64 strings
      const base64Strings = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.onerror = () => {
                reject(new Error("Failed to read file"));
              };
              reader.readAsDataURL(file);
            })
        )
      );
  
      // Update formData with new files and their base64 strings
      setFormData((prevData) => ({
        ...prevData,
        images: [
          ...(prevData.images || []),
          ...validFiles.map((file) => ({ image: file })),
        ],
        imageString: [
          ...(prevData.imageString || []),
          ...base64Strings,
        ],
      }));
  
      // Clear any previous errors
      setErrors((prev) => ({ ...prev, images: "" }));
    } catch (error) {
      console.error("Error handling file upload:", error); // Log the error
      setErrors((prev) => ({ ...prev, images: "Failed to handle file upload." }));
    }
  };
  

  return (
    <div className="w-full flex gap-10">
      <div className="w-full flex flex-col justify-between p-4 md:px-8 md:py-7 border-2 border-muted-foreground rounded-lg bg-indigo-700">
        <div className="w-full">
          {/* AI App Title */}
          <div className="mb-4">
            <Label className="block text-lg font-semibold mb-2">AI App Title:</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 bg-background rounded"
            />
          </div>

          {/* AI App Description */}
          <div className="mb-4">
            <Label className="block text-lg font-semibold mb-2">AI App Description:</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <Label className="block text-sm font-semibold mb-2">Upload one or more Images of AI apps:</Label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="w-full p-3 border border-gray-300 rounded-xl bg-indigo-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.images && <p className="text-sm text-red-400 mt-2">{errors.images}</p>}
          </div>

         {
          formData.rappCreateType === "public" && 
          <div className="flex items-center">
            <Input type="checkbox"
             name="needsApproval"
            checked={formData.needsApproval || false} 
            className="w-4 h-4"  
            onChange={(e) => {
              const { name, checked } = e.target; 
              setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
              }));
            }}/>
            <Label className="ml-2">Send For Approval</Label>
          </div>
         }
          
        </div>
      </div>
    </div>
  );
};

export default Step3RappDetails;