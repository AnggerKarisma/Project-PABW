"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart, HelpCircle, ListOrdered, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/utils/supabase/authUtils";

const AccountPopover = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const supabase = createClient();
  const [profile, setProfile] = useState<{
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error fetching user:", userError);
          setLoading(false);
          return;
        }

        // Get profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error fetching profile:", profileError);
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [supabase]);

  const userLinks = [
    {
      link: "/my-account",
      label: "Akun Saya",
      icon: <User className="h-4 w-4" />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/wishlist",
      label: "Daftar Keinginan",
      icon: <Heart className="h-4 w-4" />,
      isActive: pathname.includes("/wishlist"),
    },
    {
      link: "/my-orders",
      label: "Pesanan Saya",
      icon: <ListOrdered className="h-4 w-4" />,
      isActive: pathname.includes("/my-orders"),
    },
    {
      link: "/help",
      label: "Bantuan",
      icon: <HelpCircle className="h-4 w-4" />,
      isActive: pathname.includes("/help"),
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="hidden lg:block">
      <Popover>
        <PopoverTrigger className="flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 duration-200 p-2 rounded-md">
          {loading ? (
            <div className="h-6 w-6 rounded-full bg-gray-300 animate-pulse" />
          ) : (
            <User size={25} />
          )}
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl w-56">
          <div className="space-y-1">
            {loading ? (
              <div className="flex flex-col items-center py-2">
                <div className="h-16 w-16 rounded-full bg-gray-300 animate-pulse" />
                <div className="h-4 w-24 bg-gray-300 rounded mt-2 animate-pulse" />
              </div>
            ) : profile ? (
              <UserAvatar
                name={profile.full_name || profile.username || "User"}
                avatarUrl={profile.avatar_url || undefined}
              />
            ) : (
              <div className="py-2 text-center">
                <Link
                  href="/sign-in"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Masuk
                </Link>
              </div>
            )}

            {profile && (
              <>
                <Separator className="my-2" />
                <div className="space-y-1">
                  {userLinks.map((link) => (
                    <Link
                      key={link.link}
                      href={link.link}
                      className={cn(
                        "flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md text-sm",
                        link.isActive && "bg-gray-200 dark:bg-gray-800"
                      )}
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                </div>
                <Separator className="my-2" />
                <button
                  className="flex items-center w-full gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-sm text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Keluar
                </button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountPopover;
