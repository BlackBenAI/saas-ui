import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  wordmark?: boolean;
}

export function Logo({ className, wordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6 shrink-0 text-accent"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M16 2.6 27.4 9.2v13.6L16 29.4 4.6 22.8V9.2Z" fill="currentColor" />
        <path d="M16 8.1 22.7 12v8L16 23.9 9.3 20v-8Z" fill="var(--surface)" />
        <path d="M16 11.6 19.6 13.7v4.6L16 20.4 12.4 18.3v-4.6Z" fill="currentColor" />
      </svg>
      {wordmark ? (
        <span className="font-display text-[15px] font-semibold tracking-[-0.01em]">
          SaaS-UI
        </span>
      ) : (
        <span className="sr-only">SaaS-UI</span>
      )}
    </span>
  );
}
