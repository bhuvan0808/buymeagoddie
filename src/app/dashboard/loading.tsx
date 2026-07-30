import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
      <div className="flex flex-col gap-6">
        <div className="glass-card rounded-2xl p-6">
          <Skeleton className="mb-2 h-5 w-28" />
          <Skeleton className="mb-5 h-4 w-56" />
          <Skeleton className="mb-4 h-12 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <Skeleton className="mb-2 h-5 w-24" />
          <Skeleton className="mb-6 h-4 w-48" />
          <div className="mb-5 flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="mb-4 h-11 w-full" />
          <Skeleton className="mb-4 h-11 w-full" />
          <Skeleton className="mb-5 h-24 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="hidden xl:block">
        <Skeleton className="mx-auto mb-3 h-3 w-24" />
        <Skeleton className="h-[34rem] w-full rounded-[2.2rem]" />
      </div>
    </div>
  );
}
