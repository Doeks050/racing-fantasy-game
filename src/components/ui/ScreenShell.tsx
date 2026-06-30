import type { ReactNode } from "react";

type ScreenShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function ScreenShell({ eyebrow, title, description, children }: ScreenShellProps) {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-zinc-900 p-4 shadow-2xl shadow-black/30">
        <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="absolute -bottom-16 left-6 h-28 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="relative">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
          )}
          <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-50">{title}</h2>
          {description && <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>}
        </div>
      </div>

      {children}
    </div>
  );
}
