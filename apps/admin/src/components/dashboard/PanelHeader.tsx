import { Icon } from "./Icon";

export function PanelHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: "award" | "pin";
}) {
  return (
    <div className="px-7 py-6 border-b border-[#e6e8ef]">
      <div className="flex items-center gap-3">
        {icon ? <Icon name={icon} className="size-7 text-violet-500" /> : null}
        <h2 className="text-2xl font-extrabold tracking-tight m-0">{title}</h2>
      </div>
      <p className="text-[17px] text-[#6d7385] mt-3 m-0">{subtitle}</p>
    </div>
  );
}
