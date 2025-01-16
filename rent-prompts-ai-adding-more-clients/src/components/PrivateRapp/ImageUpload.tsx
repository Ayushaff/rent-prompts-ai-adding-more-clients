import React, { useState } from "react";
import Image from "next/image";

// Define an interface for the props
interface FileUploadProps {
  name: string; // Input field name
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // File change handler
  className?: string; // Optional className
}

const FileUpload: React.FC<FileUploadProps> = ({ name, onChange, className }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      setErrors("No files selected.");
      return;
    }

    const validFiles = Array.from(files);
    setUploadedFiles(validFiles);
    onChange(e); // Pass the event to the parent component

    // Simulate upload progress for demo purposes
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
      } else {
        setUploadProgress(progress);
      }
    }, 100);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  return (
    <div>
      <div
        className={`cursor-pointer p-6 flex justify-center bg-indigo-800 border border-dashed border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600 ${className}`}
        onClick={() => {
          const fileInput = document.getElementById("file-input") as HTMLInputElement;
          if (fileInput) {
            fileInput.click();
          }
        }}
      >
        <div className="text-center">
          <span className="inline-flex justify-center items-center size-12 bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200">
            <svg
              className="shrink-0 size-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" x2="12" y1="3" y2="15"></line>
            </svg>
          </span>

          <div className="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
            <span className="pe-1 font-medium text-white dark:text-neutral-200">
              Drop your files here or
            </span>
            <span className="bg-white px-1 font-semibold text-indigo-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 dark:bg-neutral-800 dark:text-blue-500 dark:hover:text-blue-600">
              browse
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground dark:text-neutral-400">
            Pick files up to 2MB each.
          </p>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        name={name} // Attach the "name" prop to the input
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}

      <div className="mt-4 space-y-2">
        {uploadedFiles.length > 0 &&
          uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="p-3 bg-white border border-solid border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600"
            >
              <div className="mb-1 flex justify-between items-center">
                <div className="flex items-center gap-x-3">
                  <span className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="rounded-lg"
                      width={100} // Adjust width as needed
                      height={100} // Adjust height as needed
                    />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      <span className="truncate inline-block max-w-[300px] align-bottom">
                        {file.name}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
                    onClick={() => removeFile(index)}
                  >
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div
                className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="flex flex-col justify-center rounded-full bg-indigo-600 text-xs text-white text-center transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FileUpload;