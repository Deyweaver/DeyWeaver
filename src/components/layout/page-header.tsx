import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  className?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, eyebrow, className, actions }: PageHeaderProps) {
  return (
    <header className={`rounded-2xl border border-border bg-card px-6 py-5 shadow-sm ${className ?? ''}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p> : null}
          <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-base text-muted-foreground md:text-lg">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
