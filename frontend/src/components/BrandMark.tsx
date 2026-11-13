import { cn } from "@/lib/utils";

type BrandMarkVariant = "full" | "symbol" | "favicon";
type BrandMarkTone = "brand" | "mono" | "inverse";

interface BrandMarkProps {
  className?: string;
  variant?: BrandMarkVariant;
  tone?: BrandMarkTone;
}

const SYMBOL_SRC = "/brand/saas-ui-symbol-192.png";
const FAVICON_SRC = "/brand/saas-ui-symbol-32.png";

export function BrandMark({
  className,
  variant = "full",
  tone = "brand",
}: BrandMarkProps) {
  const symbol = variant === "favicon" ? FAVICON_SRC : SYMBOL_SRC;
  const size = variant === "favicon" ? 32 : 24;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={symbol}
        alt=""
        width={size}
        height={size}
        className={cn(
          "shrink-0",
          variant === "favicon" ? "h-8 w-8" : "h-6 w-6",
          tone === "mono" && "brightness-0",
          tone === "inverse" && "brightness-0 invert",
        )}
        decoding="async"
      />
      {variant === "full" ? (
        <span className="font-display text-[15px] font-semibold tracking-[-0.01em]">
          SaaS-UI
        </span>
      ) : (
        <span className="sr-only">SaaS-UI</span>
      )}
    </span>
  );
}
