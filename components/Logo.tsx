import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "ink" | "white";
  alt?: string;
  priority?: boolean;
  src?: string;
}

export const Logo = ({
  className,
  variant = "ink",
  alt = "Apan Apparel",
  priority,
  src,
}: LogoProps) => {
  const imageSrc =
    src ??
    (variant === "white" ? "/apan-logo-white.png" : "/apan-logo-ink.png");
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={608}
      height={311}
      priority={priority}
      className={className}
    />
  );
};