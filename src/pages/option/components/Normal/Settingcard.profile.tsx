import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { copyToClipboard } from "@/lib/utils";

import {
  Copy,
  DownloadIcon,
  Eye,
  EyeOff,
  Pencil,
  RotateCcw,
  ShieldAlert,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageCropper } from "./Settingcard.profile.lib";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProfileState = {
  originalAvatarUrl: string | null;
  avatarUrl: string | null;
  username: string | null;
  nim: string | null;
  prodi: string | null;
  blurAvatar: boolean;
  blurUsername: boolean;
  blurNim: boolean;
  blurProdi: boolean;
};

const SettingcardProfile = () => {
  const [profile, setProfile] = useState<ProfileState>({
    originalAvatarUrl: null,
    avatarUrl: null,
    username: null,
    nim: null,
    prodi: null,
    blurAvatar: false,
    blurUsername: false,
    blurNim: false,
    blurProdi: false,
  });

  useEffect(() => {
    const getProfile = async () => {
      const result = await chrome.storage.local.get([
        "profileImage",
        "profileImageLocal",
        "profileNameLocal",
        "profileNim",
        "profileProdi",
        "isBlurredAvatar",
        "isBlurredUsername",
        "isBlurredNim",
        "isBlurredProdi",
      ]);
      console.log(result);
      setProfile({
        originalAvatarUrl: result.profileImage,
        avatarUrl: result.profileImageLocal,
        username: result.profileNameLocal,
        nim: result.profileNim,
        prodi: result.profileProdi,
        blurAvatar: result.isBlurredAvatar,
        blurUsername: result.isBlurredUsername,
        blurNim: result.isBlurredNim,
        blurProdi: result.isBlurredProdi,
      });
    };
    getProfile();
  }, []);

  useEffect(() => {
    const token = window.location.hash.substring(1);
    verifyToken(token).then((isValid) => {
      if (isValid) {
        setTimeout(() => {
          toast.success("Data Cleared ✅"), 1000;
        });
      }
    });
  }, []);

  return (
    <div id="profileSettings" className="flex flex-col gap-4 w-full ">
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div
            className={`flex items-center gap-3 ${
              profile.blurAvatar ? "blur-sm" : ""
            }`}
          >
            <Avatar>
              <AvatarImage src={profile.avatarUrl || ""} />
              <AvatarFallback>
                {" "}
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-3 w-auto">
            <ImageCropper
              onCropComplete={(croppedImageData) => {
                setProfile((prev: any) => ({
                  ...prev,
                  avatarUrl: croppedImageData,
                }));
                chrome.storage.local.set({
                  profileImageLocal: croppedImageData,
                });
                toast.success("Profile updated");
              }}
              triggerButton={
                <Button type="button" variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />

            <Button
              onClick={() => {
                setProfile({
                  ...profile,
                  blurAvatar: !profile.blurAvatar,
                });
                chrome.storage.local.set({
                  isBlurredAvatar: !profile.blurAvatar,
                });
              }}
              title="blur profile"
            >
              {profile.blurAvatar ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                setProfile({
                  ...profile,
                  avatarUrl: profile.originalAvatarUrl,
                });
                chrome.storage.local.set({
                  profileImageLocal: profile.originalAvatarUrl,
                });
              }}
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                const imageUrl = profile.avatarUrl;
                if (!imageUrl) return;
                const fileName = imageUrl.substring(
                  imageUrl.lastIndexOf("/") + 1
                );
                const link = document.createElement("a");
                link.href = imageUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              variant={"secondary"}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div
            className={`flex items-center gap-3 ${
              profile.blurUsername ? "blur-sm" : ""
            }`}
          >
            {profile.username ? (
              <span className="font-medium">{profile.username}</span>
            ) : (
              <ProfileError />
            )}
          </div>
          <div className="flex items-center gap-3 w-auto">
            <Button
              onClick={() => {
                setProfile({
                  ...profile,
                  blurUsername: !profile.blurUsername,
                });
                chrome.storage.local.set({
                  isBlurredUsername: !profile.blurUsername,
                });
              }}
            >
              {profile.blurUsername ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                toast.success("Username copied to clipboard");
                copyToClipboard(profile.username || "");
              }}
              title="Copy Text"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div
            className={`flex items-center gap-3 ${
              profile.blurNim ? "blur-sm" : ""
            }`}
          >
            {profile.nim ? (
              <span className="font-medium">{profile.nim}</span>
            ) : (
              <ProfileError />
            )}
          </div>
          <div className="flex items-center gap-3 w-auto">
            <Button
              onClick={() => {
                setProfile({
                  ...profile,
                  blurNim: !profile.blurNim,
                });
                chrome.storage.local.set({
                  isBlurredNim: !profile.blurNim,
                });
              }}
            >
              {profile.blurNim ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                toast.success("NIM copied to clipboard");
                copyToClipboard(profile.nim || "");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div
            className={`flex items-center gap-3 ${
              profile.blurProdi ? "blur-sm" : ""
            }`}
          >
            {profile.prodi ? (
              <span className="font-medium">{profile.prodi}</span>
            ) : (
              <ProfileError />
            )}
          </div>
          <div className="flex items-center gap-3 w-auto">
            <Button
              onClick={() => {
                setProfile({
                  ...profile,
                  blurProdi: !profile.blurProdi,
                });
                chrome.storage.local.set({
                  isBlurredProdi: !profile.blurProdi,
                });
              }}
            >
              {profile.blurProdi ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                toast.success("Prodi copied to clipboard");
                copyToClipboard(profile.prodi || "");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex  justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"destructive"}>Clear All data</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear All data</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to clear all local data? {"{NAMA, NIM ETC}"}
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  const token = await generateToken();
                  window.location.hash = token;
                  chrome.storage.local.clear();
                  window.location.reload();
                }}
                variant={"destructive"}
              >
                Clear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const ProfileError = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div>
            <CardTitle className="text-sm mb-0.5">Error</CardTitle>
            <p className="text-gray-500 text-sm">
              This item has not been added yet. Please go to Undip to add it.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="flex-shrink-0"
          onClick={() =>
            chrome.tabs.create({ url: "https://siap.undip.ac.id/sso/login" })
          }
        >
          Go to Undip
        </Button>
      </div>
    </Card>
  );
};

async function generateToken() {
  const timestamp = Math.floor(Date.now() / 1000); // Current time
  const encoder = new TextEncoder();
  const data = encoder.encode(`${timestamp}-secret-key`);

  // Hash the timestamp with SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${timestamp}-${hashHex.substring(0, 16)}`;
}

async function verifyToken(token: string | null): Promise<boolean> {
  if (!token) return false;

  const TIME = 1;

  const [timestamp, hash] = token.split("-");
  if (!timestamp || !hash) return false;

  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime - parseInt(timestamp) > TIME) {
    return false;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(`${timestamp}-secret-key`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const expectedHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 16);

  return expectedHash === hash;
}

export default SettingcardProfile;
