import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  dark?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ dark = false, className = "", iconOnly = false }: LogoProps) {
  const imgClass = dark ? "brightness-0 invert" : "";

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      <Image
        src="/logo.svg"
        alt="Car 1983 icon"
        width={38}
        height={31}
        className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${imgClass}`}
        priority
      />
      {!iconOnly && (
        <Image
          src="/logo-name.svg"
          alt="Car 1983"
          width={96}
          height={21}
          className={`flex-shrink-0 ${imgClass}`}
          priority
        />
      )}
    </Link>
  );
}
