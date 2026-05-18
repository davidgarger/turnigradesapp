import logoUrl from "@/assets/turni-logo.png";

type Props = { className?: string };

export function TurniLogo({ className }: Props) {
  return (
    <img
      src={logoUrl}
      alt="Turni Logo"
      className={className}
      draggable={false}
    />
  );
}
