import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const SettingMoodle = () => {
  const [showPassword, setShowPassword] = useState(false);
  const inputGeminiApiKey = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveSettings = () => {
    // Logic to save settings can be added here
    console.log("Settings saved");
    chrome.storage.local.set(
      {
        geminiApiKey: inputGeminiApiKey.current?.value || "",
      },
      () => {
        toast.success("Settings saved successfully!");
      }
    );
  };

  // Load saved settings from local storage
  chrome.storage.local.get("geminiApiKey", (result) => {
    if (result.geminiApiKey) {
      inputGeminiApiKey.current!.value = result.geminiApiKey;
    }
  });

  return (
    <>
      {/* GEMINI API KEY INPUT */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-full rounded-lg shadow-md">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            GEMINI API KEY
          </label>
          {/* ADD HIDE AND NOT HIDE INPUT PASSWORD LIKE EYE ICON */}
          <div className="relative">
            <input
              ref={inputGeminiApiKey}
              type={showPassword ? "text" : "password"}
              placeholder="API key {gemini} "
              autoComplete="off"
              spellCheck="false"
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <Button onClick={handleSaveSettings} className=" mt-4 w-full">
            Save Settings
          </Button>
          <Button variant={"secondary"} className="w-full">
            Tutorial ⬇️
          </Button>
        </div>
      </div>
    </>
  );
};

export default SettingMoodle;
