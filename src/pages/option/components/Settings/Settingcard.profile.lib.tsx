import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

import React, { useState, useRef, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";

interface ImageCropperProps {
  onCropComplete: (croppedImageUrl: string) => void;
  triggerButton: React.ReactNode;
  aspectRatio?: number;
}

export function ImageCropper({
  onCropComplete,
  triggerButton,
  aspectRatio = 1,
}: ImageCropperProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setOpen(true);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropCompleteCallback = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    if (!src || !croppedAreaPixels) return;

    try {
      const croppedImageData = await getCroppedImg(src, croppedAreaPixels);
      onCropComplete(croppedImageData);
      setOpen(false);
    } catch (e) {
      console.error("Error cropping image", e);
    }
  }, [src, croppedAreaPixels, onCropComplete]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        ref={fileInputRef}
        className="hidden"
      />

      {React.cloneElement(triggerButton as React.ReactElement, {
        onClick: () => fileInputRef.current?.click(),
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <div className="relative flex flex-col h-full">
            <div className="relative w-full h-[60vh]">
              {src && (
                <Cropper
                  image={src}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropCompleteCallback}
                  classes={{
                    containerClassName: "bg-gray-50 rounded-lg",
                    mediaClassName: "rounded-lg",
                  }}
                />
              )}
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Zoom:</label>
                {/* <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-32"
                  /> */}
                <Slider
                  value={[zoom]}
                  onValueChange={(v) => {
                    setZoom(v[0]);
                  }}
                  min={1}
                  max={3}
                  step={0.1}
                  className="w-32"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={showCroppedImage}>Save Crop</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}
