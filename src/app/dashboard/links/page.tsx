import { SocialLinksForm } from "@/features/dashboard/components/social-links-form";
import { PagePreview } from "@/features/dashboard/components/page-preview";
import { getDashboardData } from "@/features/dashboard/queries";

export const metadata = { title: "Social Links" };

export default async function LinksPage() {
  const data = await getDashboardData();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <SocialLinksForm links={data.socialLinks} />
      </div>
      <PagePreview data={data} />
    </div>
  );
}
