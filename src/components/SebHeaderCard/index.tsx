import { useEffect, useMemo, useRef, useState } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  AlertCircle,
  ExternalLink,
  FileCode2,
  GripHorizontal,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import HideButton from "../hideButton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  createSebHeaderProfileDraft,
  type SebActivateProfileMessage,
  type SebClearProfileMessage,
  type SebDeactivateProfileMessage,
  type SebGetStatusMessage,
  type SebHeaderProfile,
  type SebHeaderProfileDraft,
  type SebStatusResponse,
} from "@/lib/seb/shared";

const SebHeaderCard = ({
  listeners,
  attributes,
  id,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
}) => {
  const [supported, setSupported] = useState(false);
  const [storedProfile, setStoredProfile] = useState<SebHeaderProfile | null>(null);
  const [draftProfile, setDraftProfile] = useState<SebHeaderProfileDraft | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void loadStatus();
  }, []);

  const displayedProfile = useMemo(
    () => draftProfile ?? storedProfile,
    [draftProfile, storedProfile]
  );

  const statusLabel = supported
    ? storedProfile?.enabled
      ? "Nyala"
      : "Mati"
    : "Belum Support";

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const loadStatus = async () => {
    try {
      const response = (await chrome.runtime.sendMessage({
        type: "sebGetStatus",
      } satisfies SebGetStatusMessage)) as SebStatusResponse;

      if (!response.ok) {
        throw new Error(response.error || "Gagal ambil status SEB.");
      }

      setSupported(response.supported);
      setStoredProfile(response.profile ?? null);
    } catch (error) {
      console.error("Failed to load SEB status:", error);
      setSupported(false);
      toast.error("Status SEB gagal kebaca.");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setDraftError(null);
    setIsBusy(true);

    try {
      const xmlText = await file.text();
      const nextDraft = await createSebHeaderProfileDraft(file.name, xmlText);
      setDraftProfile(nextDraft);
      toast.success("Config SEB berhasil kebaca.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Config SEB yang dipilih gagal diproses.";
      setDraftProfile(null);
      setDraftError(message);
      toast.error(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleEnable = async () => {
    if (!draftProfile) {
      toast.error("Upload dulu config SEB yang valid ya.");
      return;
    }

    setIsBusy(true);
    try {
      const response = (await chrome.runtime.sendMessage({
        type: "sebActivateProfile",
        profile: draftProfile,
      } satisfies SebActivateProfileMessage)) as SebStatusResponse;

      if (!response.ok) {
        throw new Error(response.error || "Gagal nyalain rewrite header SEB.");
      }

      setSupported(response.supported);
      setStoredProfile(response.profile ?? null);
      setDraftProfile(null);
      setDraftError(null);
      toast.success("Header SEB udah nyala.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal nyalain rewrite header SEB.";
      toast.error(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDisable = async () => {
    setIsBusy(true);
    try {
      const response = (await chrome.runtime.sendMessage({
        type: "sebDeactivateProfile",
      } satisfies SebDeactivateProfileMessage)) as SebStatusResponse;

      if (!response.ok) {
        throw new Error(response.error || "Gagal matiin rewrite header SEB.");
      }

      setSupported(response.supported);
      setStoredProfile(response.profile ?? null);
      toast.success("Header SEB udah dimatiin.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal matiin rewrite header SEB.";
      toast.error(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleClear = async () => {
    setIsBusy(true);
    try {
      const response = (await chrome.runtime.sendMessage({
        type: "sebClearProfile",
      } satisfies SebClearProfileMessage)) as SebStatusResponse;

      if (!response.ok) {
        throw new Error(response.error || "Gagal hapus profile SEB.");
      }

      setSupported(response.supported);
      setStoredProfile(null);
      setDraftProfile(null);
      setDraftError(null);
      toast.success("Config SEB berhasil dibersihin.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal hapus profile SEB.";
      toast.error(message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleOpenExam = () => {
    if (!displayedProfile?.startUrl) {
      toast.error("URL ujiannya belum ada nih.");
      return;
    }

    chrome.tabs.create({ url: displayedProfile.startUrl });
  };

  const hasPendingReplacement = Boolean(draftProfile && storedProfile?.enabled);

  return (
    <Card className="relative group w-full dark:bg-gray-800 dark:border-gray-700">
      <HideButton
        id={id || "SebHeaderCard"}
        classNames="group-hover:flex hidden transition-all duration-300"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".seb,.xml,text/xml,application/xml"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between gap-3 text-lg font-bold">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
          EXAMBRO Bypass
          </span>
          <Badge variant={storedProfile?.enabled ? "default" : "secondary"}>
            {statusLabel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Upload file `.seb` atau XML polos, terus extension ini bakal ngitung
          `ConfigKeyHash`-nya buat dipasang ke request header pas buka URL ujian yang pas.
        </p>

        {!supported ? (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-900 dark:text-yellow-200">
            Buat sekarang fitur injek header cuma jalan di build Chromium. Hash masih bisa dicek di sini, tapi rewrite header belum bisa dinyalain.
          </div>
        ) : null}

        {draftError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-900 dark:text-red-200">
            <span className="inline-flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4" />
              {draftError}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="w-full" onClick={triggerFilePicker} disabled={isBusy}>
            <Upload className="mr-2 h-4 w-4" />
            {draftProfile || storedProfile ? "Ganti Config" : "Upload Config"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleOpenExam}
            disabled={!displayedProfile?.startUrl}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Buka Ujian
          </Button>
        </div>

        {hasPendingReplacement ? (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-900 dark:text-blue-200">
            Config baru udah siap. Kalau kamu nyalain, rule header ujian yang lama bakal ketimpa.
          </div>
        ) : null}

        {displayedProfile ? (
          <div className="space-y-3 rounded-lg border border-border/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{displayedProfile.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {draftProfile ? "Preview dulu" : storedProfile?.enabled ? "Profile aktif" : "Profile kesimpan"}
                </p>
              </div>
              <FileCode2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                URL Mulai
              </p>
              <p className="break-all text-xs text-foreground">{displayedProfile.startUrl}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                X-SafeExamBrowser-ConfigKeyHash
              </p>
              <code className="block break-all rounded-md bg-muted px-2 py-2 text-[11px] leading-5 text-foreground">
                {displayedProfile.configKeyHash}
              </code>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
            Belum ada config SEB yang di-load.
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => void handleEnable()}
            disabled={!draftProfile || !supported || isBusy}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Nyalain Header
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => void handleDisable()}
              disabled={!storedProfile?.enabled || isBusy}
            >
              <ShieldOff className="mr-2 h-4 w-4" />
              Matiin
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => void handleClear()}
              disabled={(!storedProfile && !draftProfile) || isBusy}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Bersihin
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SebHeaderCard;
