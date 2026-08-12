import Image from "next/image";

const SIZES = {
  sm: 32,
  md: 48,
  lg: 96,
};

export default function Logo({ size = "md", className = "" }) {
  const px = SIZES[size] ?? SIZES.md;
  return (
    <Image
      src="/logo.png"
      alt="SafetyLab"
      width={px}
      height={px}
      className={className}
      priority
    />
  );
}
