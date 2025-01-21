import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Eye, Pencil, RotateCcw, User } from "lucide-react";
import { useEffect, useState } from "react";

const SettingcardProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [nim, setNim] = useState<string | null>(null);
  const [prodi, setProdi] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const result = await chrome.storage.local.get([
        "profileImage",
        "profileName",
        "profileNim",
        "profileProdi",
      ]);
      console.log(result);
      setAvatarUrl(result.profileImage);
      setUsername(result.profileName);
      setNim(result.profileNim);
      setProdi(result.profileProdi);
    };
    getProfile();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full ">
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback>
                {" "}
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-3 w-auto">
            <Button>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button>
              <Eye className="h-4 w-4" />
            </Button>
            <Button>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">{username || "myudakk"}</span>
          </div>
          <div className="flex items-center gap-3 w-auto">
            <Button>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button>
              <Eye className="h-4 w-4" />
            </Button>
            <Button>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">{nim || "24012345610169"}</span>
          </div>
          <div className="flex items-center gap-3 w-auto">
            <Button>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button>
              <Eye className="h-4 w-4" />
            </Button>
            <Button>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">{prodi || "PRODI"}</span>
          </div>
          <div className="flex items-center gap-3 w-auto">
            <Button>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button>
              <Eye className="h-4 w-4" />
            </Button>
            <Button>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingcardProfile;
