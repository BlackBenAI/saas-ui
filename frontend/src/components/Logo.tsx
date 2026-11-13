import { BrandMark } from "@/components/BrandMark";

interface LogoProps {
  className?: string;
  wordmark?: boolean;
}

export function Logo({ className, wordmark = true }: LogoProps) {
  return (
    <BrandMark
      className={className}
      variant={wordmark ? "full" : "symbol"}
    />
  );
}
