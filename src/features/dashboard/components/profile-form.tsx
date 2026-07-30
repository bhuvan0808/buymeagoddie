"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateAvatar, updateProfile } from "@/features/dashboard/actions";
import { createClient } from "@/lib/supabase/client";
import { BIO_MAX_LENGTH } from "@/lib/constants";
import { profileSchema, type ProfileInput } from "@/lib/validation/profile";
import { getInitials } from "@/lib/utils";
import type { ProfileRow } from "@/types/database";

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username ?? "",
      bio: profile.bio ?? "",
    },
  });

  const bioValue = form.watch("bio") ?? "";

  function onSubmit(values: ProfileInput) {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile saved");
      router.refresh();
    });
  }

  async function handleAvatarUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB.");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${profile.id}/avatar-${Date.now()}.${extension}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const result = await updateAvatar(data.publicUrl);
      if (!result.ok) throw new Error(result.error);
      setAvatarUrl(data.publicUrl);
      toast.success("Photo updated");
      router.refresh();
    } catch {
      toast.error("Upload failed. Try a different image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>How you appear to supporters.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="focus-ring group relative rounded-full"
              aria-label="Change profile photo"
            >
              <Avatar className="size-16">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin text-white" aria-hidden />
                ) : (
                  <Camera className="size-4 text-white" aria-hidden />
                )}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleAvatarUpload(file);
              }}
            />
            <p className="text-sm text-muted-foreground">
              PNG, JPG or WebP · max 2MB
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              maxLength={60}
              aria-invalid={!!form.formState.errors.name}
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p role="alert" className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-username">Username</Label>
            <Input
              id="profile-username"
              className="font-mono lowercase"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={30}
              aria-invalid={!!form.formState.errors.username}
              {...form.register("username")}
            />
            {form.formState.errors.username ? (
              <p role="alert" className="text-xs text-destructive">
                {form.formState.errors.username.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Changing this changes your page URL — old links will stop
                working.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-bio">
              Bio{" "}
              <span className="font-normal text-muted-foreground">
                ({bioValue.length}/{BIO_MAX_LENGTH})
              </span>
            </Label>
            <Textarea
              id="profile-bio"
              maxLength={BIO_MAX_LENGTH}
              aria-invalid={!!form.formState.errors.bio}
              {...form.register("bio")}
            />
          </div>

          <Button type="submit" loading={pending} className="self-start">
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
