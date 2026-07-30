import { ProfileForm } from "@/features/dashboard/components/profile-form";
import { ProfileUrlCard } from "@/features/dashboard/components/profile-url-card";
import { PagePreview } from "@/features/dashboard/components/page-preview";
import { getDashboardData } from "@/features/dashboard/queries";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <ProfileUrlCard username={data.profile.username ?? ""} />
        <ProfileForm profile={data.profile} />
      </div>
      <PagePreview data={data} />
    </div>
  );
}
