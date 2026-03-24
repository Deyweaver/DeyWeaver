type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function PageHeader({ title, description, eyebrow = 'Workspace' }: PageHeaderProps) {
  return (
    <header className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        <span className="h-2 w-2 rounded-full bg-primary" />
        {eyebrow}
      </div>
      <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-base text-muted-foreground md:text-lg">{description}</p>
    </header>
  );
}