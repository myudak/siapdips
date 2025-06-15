import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function QrReader({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) {
  const [result, setResult] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/libs/jsQR.js";
    script.onload = () => console.log("jsQR loaded");
    document.body.appendChild(script);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const code = window.jsQR(imageData.data, canvas.width, canvas.height);
      setResult(code?.data || "No QR code found.");
    };
  };

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700 ">
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardContent className="flex flex-col  p-0">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Upload QR Absen</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <p className="mt-3">
            <strong>Code:</strong> {result}
          </p>
          {result && (
            <Button
              className="mt-2"
              onClick={() => {
                window.open(`https://siap.undip.ac.id/a/${result}`, "_blank");
              }}
            >
              Absen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
