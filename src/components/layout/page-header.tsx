type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={`rounded-2xl border border-border bg-card px-6 py-5 shadow-sm ${className ?? ''}`}>
      <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-base text-muted-foreground md:text-lg">{description}</p>
    </header>
  );
}