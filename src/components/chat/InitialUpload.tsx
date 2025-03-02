"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { SipOwl } from "@/components/SipOwl";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { useError } from "@/provider/ErrorProvider";

interface DualUploadProps {
  onImagesSelect: (images: { food: string; wine: string }) => void;
  disabled?: boolean;
}

type MenuType = "food" | "wine";

interface UploadState {
  food: string | null;
  wine: string | null;
}

export function InitialUpload({
  onImagesSelect,
  disabled = false,
}: DualUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadState>({
    food: null,
    wine: null,
  });
  const { showError } = useError();

  const handleFile = async (file: File, type: MenuType) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError(
        `The ${type} menu image is too large. Maximum size is 5MB.`,
        "warning"
      );
      return;
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      showError(
        `Please upload a valid image file for the ${type} menu.`,
        "warning"
      );
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedImages((prev) => ({
          ...prev,
          [type]: base64.split(",")[1],
        }));
      };
      reader.onerror = () => {
        showError(
          `Failed to process ${type} menu image. Please try again.`,
          "warning"
        );
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      showError(
        `Failed to process ${type} menu image. Please try again.`,
        "warning"
      );
    }
  };

  const handleSubmit = () => {
    if (uploadedImages.food && uploadedImages.wine) {
      onImagesSelect({
        food: uploadedImages.food,
        wine: uploadedImages.wine,
      });
    } else {
      // This should never happen as the button should be disabled, but just in case
      showError(
        "Please upload both food and wine menu images before analyzing.",
        "default"
      );
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
    disabled: disabled,
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
    disabled: disabled,
  });

  const bothImagesUploaded = uploadedImages.food && uploadedImages.wine;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-6 md:p-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6 md:mb-12">
          <SipOwl className="w-24 h-24 md:w-32 md:h-32" />
        </div>

        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-center">
          Welcome, I&apos;m SIP the Owl, your virtual sommelier
        </h1>

        <p className="text-base md:text-lg mb-6 md:mb-8 text-center max-w-md mx-auto">
          Upload photos of your food and wine menus and I&apos;ll analyze them
          to suggest the best wine pairings for your dishes.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Food Menu Upload */}
          <div
            {...getFoodRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-4 md:p-8 text-center
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
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
            <Upload className="mx-auto h-8 w-8 md:h-12 md:w-12 mb-2 md:mb-4 text-pink-200" />
            <p className="text-pink-100 text-sm md:text-base">
              {disabled
                ? "Please wait..."
                : isFoodDragActive
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
              border-2 border-dashed rounded-lg p-4 md:p-8 text-center
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
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
            <Upload className="mx-auto h-8 w-8 md:h-12 md:w-12 mb-2 md:mb-4 text-pink-200" />
            <p className="text-pink-100 text-sm md:text-base">
              {disabled
                ? "Please wait..."
                : isWineDragActive
                ? "Drop your wine menu here..."
                : uploadedImages.wine
                ? "Wine menu uploaded ✓"
                : "Upload wine menu"}
            </p>
          </div>

          {bothImagesUploaded && (
            <div className="col-span-full flex justify-center mt-4">
              <Button
                onClick={handleSubmit}
                disabled={disabled}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 md:px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {disabled ? "Processing..." : "Analyze Menus"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
