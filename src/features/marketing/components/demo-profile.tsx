"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/features/profile/components/profile-card";
import type { ProfileCardData } from "@/features/profile/types";
import { cn } from "@/lib/utils";

const DEMO_PROFILE: ProfileCardData = {
  name: "Bhuvan",
  username: "bhuvan",
  bio: "Indie hacker building tools for creators. If my work helped you, a goddie goes a long way 💜",
  avatarUrl: null,
  provider: "upi",
  identifier: "bhuvan@okhdfcbank",
  theme: "midnight",
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com/buymeagoddie" },
    { platform: "twitter", url: "https://x.com/buymeagoddie" },
    { platform: "youtube", url: "https://youtube.com/@buymeagoddie" },
    { platform: "github", url: "https://github.com/buymeagoddie" },
  ],
  settings: {
    show_qr: true,
    show_social_links: true,
    allow_custom_amount: true,
  },
};

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_FRAMES: Record<Device, string> = {
  desktop: "w-full max-w-3xl",
  tablet: "w-full max-w-md",
  mobile: "w-full max-w-[22rem]",
};

export function DemoProfile() {
  const [device, setDevice] = useState<Device>("desktop");

  return (
    <section id="demo" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Live demo"
          title={
            <>
              Your page, <span className="text-gradient">before you build it.</span>
            </>
          }
          description="This is a real, interactive preview. Pick an amount, open the QR — exactly what your supporters will see."
        />

        <Reveal className="mt-10 flex justify-center" delay={0.1}>
          <Tabs
            value={device}
            onValueChange={(value) => setDevice(value as Device)}
          >
            <TabsList aria-label="Preview device">
              <TabsTrigger value="desktop">
                <Monitor aria-hidden /> Desktop
              </TabsTrigger>
              <TabsTrigger value="tablet">
                <Tablet aria-hidden /> Tablet
              </TabsTrigger>
              <TabsTrigger value="mobile">
                <Smartphone aria-hidden /> Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Reveal>

        <Reveal className="mt-8 flex justify-center" delay={0.15}>
          <div
            className={cn(
              "glass-card overflow-hidden rounded-[2rem] p-2 transition-all duration-500",
              DEVICE_FRAMES[device],
            )}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-red-400/70" />
                <span className="size-2.5 rounded-full bg-amber-400/70" />
                <span className="size-2.5 rounded-full bg-emerald-400/70" />
              </span>
              <span className="mx-auto flex items-center rounded-full bg-foreground/5 px-4 py-1 font-mono text-xs text-muted-foreground">
                buymeagoddie.com/bhuvan
              </span>
            </div>

            <div
              className={cn(
                "flex justify-center rounded-3xl bg-[radial-gradient(ellipse_at_top,oklch(0.24_0.06_292),oklch(0.14_0.02_290))] px-4 py-10",
                device === "desktop" && "py-14",
              )}
            >
              <ProfileCard data={DEMO_PROFILE} mode="preview" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
