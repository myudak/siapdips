import { Copy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

const NavbarProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [nim, setNim] = useState<string | null>(null);
  const [prodi, setProdi] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const result = await chrome.storage.local.get([
        "profileImageLocal",
        "profileName",
        "profileNim",
        "profileProdi",
      ]);
      console.log(result);
      setAvatarUrl(result.profileImageLocal);
      setUsername(result.profileName);
      setNim(result.profileNim);
      setProdi(result.profileProdi);
    };
    getProfile();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {username && (
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => {
              toast.success("Usernama copied to clipboard");
              copyToClipboard(username);
            }}
          >
            <Copy className="mr-2 h-4 w-4" /> {username}
          </DropdownMenuItem>
        )}
        {nim && (
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => {
              toast.success("NIM copied to clipboard");
              copyToClipboard(nim);
            }}
          >
            <Copy className="mr-2 h-4 w-4" /> {nim}
          </DropdownMenuItem>
        )}
        {prodi && (
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => {
              toast.success("Prodi copied to clipboard");
              copyToClipboard(prodi);
            }}
          >
            <Copy className="mr-2 h-4 w-4" /> {prodi}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="hover:cursor-pointer">
          <a href="#">Edit Profile</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarProfile;
