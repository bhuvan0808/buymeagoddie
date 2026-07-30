/**
 * Shared shell for legal / informational pages: consistent typography and
 * spacing without pulling in a markdown pipeline.
 */
export function ContentPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <h1 className="text-4xl font-bold">{title}</h1>
      {updated ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {updated}
        </p>
      ) : null}
      <div className="mt-10 flex flex-col gap-6 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}
