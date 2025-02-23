"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { SipOwl } from "@/components/SipOwl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDropzone } from "react-dropzone";

interface InitialUploadProps {
  onImageSelect: (image: string) => void;
}

export function InitialUpload({ onImageSelect }: InitialUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageSelect(base64.split(",")[1]);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.log(err);
      setError("Failed to process image. Please try again.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) await handleFile(file);
    },
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-900 text-white p-6">
      <SipOwl className="mb-12" />

      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Welcome, I&apos;m SIP the Owl, your virtual sommelier
      </h1>

      <p className="text-lg mb-8 text-center max-w-md">
        Upload photos of your menus and I&apos;ll analyze it to suggest the best
        wine pairings for your dishes.
      </p>

      <div className="w-full max-w-md">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 mb-4
            ${
              isDragActive
                ? "border-pink-400 bg-pink-900/50"
                : "border-white/30 hover:border-white/50"
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 mb-4 text-pink-200" />
          <p className="text-pink-100">
            {isDragActive
              ? "Drop your image here..."
              : "Drag & drop your food photo, or click to select"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
