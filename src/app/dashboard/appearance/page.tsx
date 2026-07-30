import { AppearanceForm } from "@/features/dashboard/components/appearance-form";
import { PagePreview } from "@/features/dashboard/components/page-preview";
import { getDashboardData } from "@/features/dashboard/queries";

export const metadata = { title: "Appearance" };

export default async function AppearancePage() {
  const data = await getDashboardData();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
      <div className="flex min-w-0 flex-col gap-6">
        {data.settings ? <AppearanceForm settings={data.settings} /> : null}
      </div>
      <PagePreview data={data} />
    </div>
  );
}
