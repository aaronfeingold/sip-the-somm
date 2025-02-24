"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { SipOwl } from "@/components/SipOwl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDropzone } from "react-dropzone";

interface DualUploadProps {
  onImagesSelect: (images: { food: string; wine: string }) => void;
}

type MenuType = "food" | "wine";

interface UploadState {
  food: string | null;
  wine: string | null;
}

export function InitialUpload({ onImagesSelect }: DualUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadState>({
    food: null,
    wine: null,
  });

  const handleFile = async (file: File, type: MenuType) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImages = {
          ...uploadedImages,
          [type]: base64.split(",")[1],
        };
        setUploadedImages(newImages);

        // If both images are uploaded, trigger the callback
        if (type === "food" && uploadedImages.wine) {
          onImagesSelect({ food: newImages.food!, wine: uploadedImages.wine });
        } else if (type === "wine" && uploadedImages.food) {
          onImagesSelect({ food: uploadedImages.food, wine: newImages.wine! });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError(`Failed to process ${type} menu image. Please try again.`);
    }
  };

  // Food menu dropzone
  const {
    getRootProps: getFoodRootProps,
    getInputProps: getFoodInputProps,
    isDragActive: isFoodDragActive,
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) await handleFile(file, "food");
    },
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  // Wine menu dropzone
  const {
    getRootProps: getWineRootProps,
    getInputProps: getWineInputProps,
    isDragActive: isWineDragActive,
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) await handleFile(file, "wine");
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
        Upload photos of your food and wine menus and I&apos;ll analyze them to
        suggest the best wine pairings for your dishes.
      </p>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Food Menu Upload */}
        <div
          {...getFoodRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              isFoodDragActive
                ? "border-pink-400 bg-pink-900/50"
                : uploadedImages.food
                ? "border-green-400 bg-pink-900/50"
                : "border-white/30 hover:border-white/50"
            }
          `}
        >
          <input {...getFoodInputProps()} />
          <Upload className="mx-auto h-12 w-12 mb-4 text-pink-200" />
          <p className="text-pink-100">
            {isFoodDragActive
              ? "Drop your food menu here..."
              : uploadedImages.food
              ? "Food menu uploaded ✓"
              : "Upload food menu"}
          </p>
        </div>

        {/* Wine Menu Upload */}
        <div
          {...getWineRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              isWineDragActive
                ? "border-pink-400 bg-pink-900/50"
                : uploadedImages.wine
                ? "border-green-400 bg-pink-900/50"
                : "border-white/30 hover:border-white/50"
            }
          `}
        >
          <input {...getWineInputProps()} />
          <Upload className="mx-auto h-12 w-12 mb-4 text-pink-200" />
          <p className="text-pink-100">
            {isWineDragActive
              ? "Drop your wine menu here..."
              : uploadedImages.wine
              ? "Wine menu uploaded ✓"
              : "Upload wine menu"}
          </p>
        </div>

        {error && (
          <div className="col-span-full">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
