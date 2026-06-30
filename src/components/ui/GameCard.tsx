import type { ReactNode } from "react";

type GameCardProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  tone?: "default" | "cyan" | "amber" | "red";
  className?: string;
};

const toneClasses = {
  default: "border-zinc-800 bg-zinc-900",
  cyan: "border-cyan-500/25 bg-cyan-950/10",
  amber: "border-amber-500/25 bg-amber-950/10",
  red: "border-red-900/60 bg-red-950/20",
};

export function GameCard({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
  className = "",
}: GameCardProps) {
  return (
    <section className={`rounded-[1.75rem] border p-4 shadow-xl shadow-black/20 ${toneClasses[tone]} ${className}`}>
      {eyebrow && <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>}
      {title && <h3 className="mt-1 text-xl font-black text-zinc-50">{title}</h3>}
      {description && <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>}
      {children && <div className={title || description || eyebrow ? "mt-4" : ""}>{children}</div>}
    </section>
  );
}
