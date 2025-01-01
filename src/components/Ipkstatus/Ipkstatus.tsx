import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getActiveTab, sendTabMessage } from "@/lib/utils";
import { Eye, EyeOff, HelpCircle, Pencil, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface IpkData {
  value: string;
  isBlurred: boolean;
  isLocal: boolean;
}

// const IPK_REGEX = /^\d{1,1}(\.\d{0,2})?$/;
const DEFAULT_IPK = "0.00";
const LOADING_STATE = "Loading...";
const ERROR_STATE = "Error";
const NOT_FOUND_STATE = "No IPK found";

const IpkStatus = ({ setIsLocalStatus }: { setIsLocalStatus: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [ipkData, setIpkData] = useState<IpkData>({
    value: LOADING_STATE,
    isBlurred: false,
    isLocal: false,
  });
  const [defaultIpk, setDefaultIpk] = useState<string>(DEFAULT_IPK);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  //   const validateAndFormatIpk = (value: string): string => {
  //     if (!value) return DEFAULT_IPK;
  //     const numValue = parseFloat(value);
  //     if (isNaN(numValue)) return DEFAULT_IPK;
  //     return Math.min(Math.max(numValue, 0), 4).toFixed(2);
  //   };

  const handleSave = async (value: string) => {
    // const formattedIpk = validateAndFormatIpk(value);
    try {
      await chrome.storage.local.set({ ipkLocal: value });
      const tabId = await getActiveTab();
      const action = "changeIpk";
      await sendTabMessage(tabId, { action, data: value });
      setIpkData((prev) => ({ ...prev, value: value }));
      setError(null);
    } catch (err) {
      setError("Failed to save IPK");
      console.error(err);
    }
    setIsEditing(false);
  };

  const handleReset = useCallback(async () => {
    try {
      //   await chrome.storage.local.remove("ipkLocal");
      const tabId = await getActiveTab();
      const action = "changeIpk";
      await sendTabMessage(tabId, { action, data: defaultIpk });
      setIpkData((prev) => ({ ...prev, value: defaultIpk }));
      await chrome.storage.local.set({ ipkLocal: defaultIpk });

      //   await fetchIpkFromPage();
      //   setError(null);
    } catch (err) {
      setError("Failed to reset IPK");
      console.error(err);
    }
  }, [defaultIpk]);

  const handleIpkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // if (IPK_REGEX.test(value) || value === "") {
    setIpkData((prev) => ({ ...prev, value }));
    // }
  };

  const toggleBlur = useCallback(async () => {
    if (ipkData.isLocal) {
      await chrome.storage.local.set({ isBlurred: !ipkData.isBlurred });
      setIpkData((prev) => ({ ...prev, isBlurred: !prev.isBlurred }));
      return;
    }

    try {
      const tabId = await getActiveTab();
      const action = ipkData.isBlurred
        ? "undoBlurIpkElement"
        : "blurIpkElement";
      await sendTabMessage(tabId, { action });
      setIpkData((prev) => ({ ...prev, isBlurred: !prev.isBlurred }));
      setError(null);
    } catch (err) {
      setError("Failed to toggle IPK visibility");
      console.error(err);
    }
  }, [ipkData.isBlurred, ipkData.isLocal]);

  const fetchIpkFromStorage = async (): Promise<boolean> => {
    const result = await chrome.storage.local.get([
      "ipkLocal",
      "ipkDefault",
      "isBlurred",
    ]);

    if (result.ipkDefault) {
      setDefaultIpk(result.ipkDefault[0]);
    }

    if (result.ipkLocal) {
      setIpkData({
        value: result.ipkLocal,
        isBlurred: result.isBlurred,
        isLocal: true,
      });
      return true;
    }
    return false;
  };

  const checkIpkFromPage = async () => {
    try {
      const tabId = await getActiveTab();
      const response = await sendTabMessage(tabId, { action: "fetchIpkData" });

      if (response?.ipkData?.[0]) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const fetchIpkFromPage = async () => {
    try {
      const tabId = await getActiveTab();
      const response = await sendTabMessage(tabId, { action: "fetchIpkData" });

      if (response?.ipkData?.[0]) {
        // const formattedIpk = validateAndFormatIpk(response.ipkData[0]);
        const formattedIpk = response.ipkData[0];
        setIpkData({
          value: formattedIpk,
          isBlurred: !!response.isBlur,
          isLocal: false,
        });
        await chrome.storage.local.set({ ipkLocal: formattedIpk });
        setError(null);
      } else {
        setIpkData((prev) => ({ ...prev, value: NOT_FOUND_STATE }));
      }
    } catch (err) {
      setError("Failed to fetch IPK from page");
      setIpkData((prev) => ({ ...prev, value: ERROR_STATE }));
      console.error(err);
    }
  };

  useEffect(() => {
    const initializeIpk = async () => {
      const hasLocalIpk = await fetchIpkFromStorage();
      if (!hasLocalIpk || (await checkIpkFromPage())) {
        await fetchIpkFromPage();
      }
    };

    initializeIpk();
  }, []);

  const isIpkLoaded = ![LOADING_STATE, ERROR_STATE, NOT_FOUND_STATE].includes(
    ipkData.value
  );

  useEffect(() => {
    setIsLocalStatus(!ipkData.isLocal);
  }, [ipkData.isLocal]);

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-bold text-center">
          IPK STATUS
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2 inline" />
              </TooltipTrigger>
              <TooltipContent>
                berlaku di https://siap.undip.ac.id/pages/mhs/dashboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="text-sm">
                {error === "Failed to fetch IPK from page" ? (
                  <>
                    Coba ke{" "}
                    <a
                      href="https://siap.undip.ac.id/pages/mhs/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      SIAP UNDIP Dashboard
                    </a>{" "}
                    ato tunggu web ny selese loding
                  </>
                ) : (
                  error
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Your IPK
            </p>
            <div className="relative">
              {isEditing ? (
                <Input
                  type="text"
                  value={ipkData.value}
                  onChange={handleIpkChange}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSave(ipkData.value)
                  }
                  className="text-center text-xl font-bold w-32 mx-auto"
                  autoFocus
                  onBlur={(e) => handleSave(e.target.value)}
                />
              ) : (
                <div
                  className={`text-2xl font-bold transition-all duration-300 ${
                    ipkData.isBlurred ? "blur-sm" : ""
                  }`}
                >
                  {ipkData.value}
                </div>
              )}
            </div>
          </div>

          {isIpkLoaded && (
            <div className="flex gap-2">
              <Button
                className="flex-1 h-8"
                variant="outline"
                onClick={handleEdit}
                title="Edit IPK"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                className="flex-1 h-8"
                variant="outline"
                onClick={toggleBlur}
                title={ipkData.isBlurred ? "Show IPK" : "Hide IPK"}
              >
                {ipkData.isBlurred ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                className="flex-1 h-8"
                variant="outline"
                onClick={handleReset}
                title="Reset IPK"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IpkStatus;
