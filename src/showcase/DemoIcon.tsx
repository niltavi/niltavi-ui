import {Copy, CreditCard, Eye, Layers, LogoApple, Pencil, TrashBin} from "@gravity-ui/icons";

const icons = {
  "gravity-ui:copy": Copy,
  "gravity-ui:eye": Eye,
  "gravity-ui:pencil": Pencil,
  "gravity-ui:trash-bin": TrashBin,
  "logos:expo-icon": Layers,
  "tabler:brand-apple-filled": LogoApple,
};

export function DemoIcon({icon, className}: {icon: string; className?: string}) {
  const Component = icons[icon as keyof typeof icons] ?? CreditCard;
  return <Component aria-hidden="true" className={className} />;
}
